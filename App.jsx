import React, { useEffect, useState } from "react";
import { Mountain, AlertCircle, Eye } from "lucide-react";
import PensiuneKitLanding from "./PensiuneKitLanding.jsx";
import PensiuneKitApp from "./PensiuneKitApp.jsx";
import Auth from "./Auth.jsx";
import { supabase, isConfigured } from "./supabaseClient.js";

// Útvonalak (hash-alapú, hogy statikus tárhelyen is működjön):
//   /        → landing oldal
//   /#app    → dashboard (belépéshez kötött)

function SetupScreen({ onDemo }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-5"
      style={{ background: "#F7F7F5", fontFamily: "ui-sans-serif, -apple-system, 'Segoe UI', Roboto, sans-serif" }}>
      <div className="w-full rounded-2xl bg-white p-6" style={{ maxWidth: 460, border: "1px solid #E9E9E6" }}>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#256B48" }}>
            <Mountain size={17} color="#fff" />
          </div>
          <div className="text-sm font-semibold" style={{ color: "#17181A" }}>PensiuneKit — még egy lépés</div>
        </div>
        <div className="rounded-xl p-3.5 text-sm leading-relaxed flex items-start gap-2.5"
          style={{ background: "#FDF0DC", color: "#8A5A16" }}>
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <div>
            A regisztráció és belépés még nincs bekötve, mert a <b>config.js</b> fájlban
            nincs kitöltve a két Supabase-érték. A GitHubon nyisd meg a <b>config.js</b> fájlt,
            kattints a ceruza ikonra, másold be a két értéket az idézőjelek közé, majd
            <b> Commit changes</b> — az oldal magától frissül pár perc múlva.
          </div>
        </div>
        <button onClick={onDemo}
          className="mt-4 w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          style={{ border: "1px solid #E9E9E6", color: "#17181A", background: "#fff" }}>
          <Eye size={15} /> Addig is: demó megnyitása fiók nélkül
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash);
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(!isConfigured);
  const [savedProperty, setSavedProperty] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Bejelentkezési állapot figyelése
  useEffect(() => {
    if (!isConfigured) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // A felhasználó mentett szállás-adatainak betöltése
  useEffect(() => {
    if (!isConfigured || !session) { setSavedProperty(null); return; }
    supabase
      .from("properties")
      .select("data")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => setSavedProperty(data ? data.data : null));
  }, [session]);

  const saveProperty = async (p) => {
    if (!isConfigured || !session) return { ok: false, text: "Nincs bejelentkezett felhasználó." };
    const { error } = await supabase.from("properties").upsert({
      user_id: session.user.id,
      data: p,
      updated_at: new Date().toISOString(),
    });
    return error ? { ok: false, text: error.message } : { ok: true, text: "Elmentve ✓" };
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    window.location.hash = "";
  };

  const isApp = route === "#app";

  // 1) Landing mindig elérhető
  if (!isApp) return <PensiuneKitLanding />;

  // 2) #app útvonal
  if (!isConfigured) {
    return demoMode
      ? <PensiuneKitApp demoBanner onLogout={() => { setDemoMode(false); window.location.hash = ""; }} />
      : <SetupScreen onDemo={() => setDemoMode(true)} />;
  }
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F7F5" }}>
        <div className="text-sm" style={{ color: "#6E7076" }}>Betöltés…</div>
      </div>
    );
  }
  if (!session) return <Auth />;

  return (
    <PensiuneKitApp
      userEmail={session.user.email}
      initialProperty={savedProperty}
      onSaveProperty={saveProperty}
      onLogout={logout}
    />
  );
}
