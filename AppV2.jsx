import React, { useEffect, useState } from 'react';
import Landing from './LandingV2.jsx';
import Workspace from './Workspace.jsx';
import Auth from './Auth.jsx';
import { supabase, isConfigured } from './supabaseClient.js';
import { loadWorkspace, saveWorkspace } from './cloud.js';
import GuestGuideRoute from './GuestGuideRoute.jsx';
export default function App() {
  const [route, setRoute] = useState(window.location.hash);
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(!isConfigured);
  const [property, setProperty] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [recovery, setRecovery] = useState(false);
  useEffect(() => { const handler = () => setRoute(window.location.hash); window.addEventListener('hashchange', handler); return () => window.removeEventListener('hashchange', handler); }, []);
  useEffect(() => {
    if (!isConfigured) return;
    let live = true;
    supabase.auth.getSession().then(({ data, error }) => { if (!live) return; setSession(data.session); if (error) setError('A belépési állapot nem tölthető be.'); setReady(true); }).catch(() => { if (live) { setReady(true); setError('A belépési szolgáltatás most nem elérhető.'); } });
    const { data } = supabase.auth.onAuthStateChange((event, value) => { setSession(value); if (event === 'PASSWORD_RECOVERY') { setRecovery(true); window.location.hash = '#app'; } });
    return () => { live = false; data.subscription.unsubscribe(); };
  }, []);
  useEffect(() => {
    if (!session || !isConfigured) { setLoaded(false); setProperty(null); return; }
    let live = true; setLoaded(false); setError('');
    loadWorkspace(supabase, session.user.id).then(({ state, warning }) => {
      if (!live) return;
      setError(warning);
      setProperty(state);
      setLoaded(true);
    }).catch(() => { if (live) { setError('A felhőkapcsolat most nem elérhető.'); setLoaded(true); } });
    return () => { live = false; };
  }, [session?.user.id]);
  async function save(state) { await saveWorkspace(supabase, session.user.id, state); }
  async function logout() { if (supabase) { const { error } = await supabase.auth.signOut(); if (error) { setError('A kijelentkezés nem sikerült. Próbáld újra.'); return; } } window.location.hash = ''; }
  if (/^#g(?:\/|$)/.test(route)) {
    let slug = ''; try { slug = decodeURIComponent(route.slice(3)); } catch { slug = '__invalid__'; }
    return <GuestGuideRoute slug={slug} />;
  }
  if (!['#app', '#demo', '#local'].includes(route)) return <Landing configured={isConfigured} />;
  if (route === '#demo') return <Workspace key="demo" demoMode storageKey="pensiunekit-demo-v2" onLogout={() => { window.location.hash = ''; }} />;
  if (!isConfigured || route === '#local') return <Workspace key="local" storageKey="pensiunekit-local-v2" onLogout={() => { window.location.hash = ''; }} />;
  if (!ready) return <div className="loading-page">A szállásod betöltése…</div>;
  if (recovery) return <Auth recovery onRecovered={() => setRecovery(false)} />;
  if (!session) return <Auth />;
  if (!loaded) return <div className="loading-page">A mentett adatok betöltése…</div>;
  return <Workspace key={session.user.id} initialState={property} storageKey={`pensiunekit-user-${session.user.id}`} userEmail={session.user.email} onSave={error ? null : save} connectionError={error} onLogout={logout} />;
}
