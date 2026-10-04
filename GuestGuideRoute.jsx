import React, { useEffect, useState } from 'react';
import { createState, DEFAULT_PROPERTY } from './model.js';
import { guideHtml } from './exports.js';
import { supabase, isConfigured } from './supabaseClient.js';

function publicProperty(data) {
  if (!data || typeof data.name !== 'string') return null;
  const p = { ...DEFAULT_PROPERTY };
  for (const key of Object.keys(p)) if (typeof data[key] === 'string') p[key] = data[key];
  for (const key of ['checkin', 'checkout']) p[key] = p[key].match(/\d{2}:\d{2}/)?.[0] || DEFAULT_PROPERTY[key];
  return p;
}

export default function GuestGuideRoute({ slug }) {
  const [result, setResult] = useState({ loading: true, property: null });
  useEffect(() => {
    let live = true;
    setResult({ loading: true, property: null });
    async function load() {
      if (!isConfigured) return { loading: false, property: !slug || slug === 'boroka' ? createState(true).property : null };
      if (!slug) return { loading: false, property: null };
      const published = await supabase.from('public_guides').select('data').eq('slug', slug).eq('published', true).maybeSingle();
      if (!published.error && published.data) return { loading: false, property: publicProperty(published.data.data) };
      // Compatibility for older QR links before the database migration is run.
      const legacy = await supabase.from('properties').select('data').eq('data->>slug', slug).maybeSingle();
      return { loading: false, property: legacy.error ? null : publicProperty(legacy.data?.data) };
    }
    load().then(value => { if (live) setResult(value); }).catch(() => { if (live) setResult({ loading: false, property: null }); });
    return () => { live = false; };
  }, [slug]);
  if (result.loading) return <div className="loading-page">Útmutató betöltése…</div>;
  if (!result.property) return <div className="loading-page"><div className="panel"><h1>Ez az útmutató most nem érhető el.</h1><p className="quiet">Kérj friss útmutatócímet a házigazdától.</p></div></div>;
  return <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>{!isConfigured && <div className="demo-strip">Bemutató vendégútmutató · Boróka Vendégház</div>}<iframe title="Vendégútmutató" sandbox="" srcDoc={guideHtml(result.property)} style={{ border: 0, width: '100%', flex: 1 }}/></div>;
}
