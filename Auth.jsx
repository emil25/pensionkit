import React, { useState } from "react";
import { Mountain, Mail, Lock, Loader2, Check, ArrowLeft } from "lucide-react";
import { supabase } from "./supabaseClient.js";

const T = {
  bg: "#F7F7F5",
  ink: "#17181A",
  muted: "#6E7076",
  line: "#E9E9E6",
  accent: "#256B48",
  accentDark: "#1d5238",
  accentSoft: "#EAF3EE",
};

function Input({ icon: I, ...props }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 bg-white"
      style={{ border: `1px solid ${T.line}` }}>
      <I size={16} style={{ color: T.muted }} />
      <input {...props} className="flex-1 text-sm outline-none bg-transparent" style={{ color: T.ink }} />
    </div>
  );
}

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | register | forgot
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // {ok, text}

  const submit = async () => {
    if (!email.trim()) return setMsg({ ok: false, text: "Add meg az e-mail címedet." });
    if (mode !== "forgot" && pass.length < 6)
      return setMsg({ ok: false, text: "A jelszó legalább 6 karakter legyen." });
    setLoading(true);
    setMsg(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
        // sikeres belépés után az App.jsx automatikusan átvált a dashboardra
      } else if (mode === "register") {
        const { error } = await supabase.auth.signUp({ email, password: pass });
        if (error) throw error;
        setMsg({ ok: true, text: "Sikeres regisztráció! Nézd meg a postafiókodat — a megerősítő linkre kattintva tudsz belépni. (Ha nem jött levél, a spam mappát is nézd meg.)" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setMsg({ ok: true, text: "Elküldtük a jelszó-visszaállító e-mailt. Nézd meg a postafiókodat." });
      }
    } catch (e) {
      const t = (e && e.message) || "";
      let text = "Hiba történt. Próbáld újra.";
      if (t.includes("Invalid login credentials")) text = "Hibás e-mail cím vagy jelszó.";
      else if (t.includes("already registered")) text = "Ezzel az e-mail címmel már van fiók — lépj be.";
      else if (t.includes("Email not confirmed")) text = "Előbb erősítsd meg az e-mail címedet a kapott levélben.";
      else if (t) text = t;
      setMsg({ ok: false, text });
    }
    setLoading(false);
  };

  const google = async () => {
    setMsg(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "#app" },
    });
    if (error)
      setMsg({
        ok: false,
        text: "A Google-belépés még nincs bekapcsolva a Supabase-ben (Authentication → Providers → Google). Addig az e-mailes belépés működik.",
      });
  };

  const titles = {
    login: ["Üdv újra!", "Lépj be a vendégházad vezérlőpultjába."],
    register: ["Fiók létrehozása", "Ingyenes — csak egy e-mail cím és egy jelszó kell."],
    forgot: ["Elfelejtett jelszó", "Megadod az e-mail címed, és küldünk egy visszaállító linket."],
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5"
      style={{ background: T.bg, fontFamily: "ui-sans-serif, -apple-system, 'Segoe UI', Roboto, sans-serif" }}>
      <div className="w-full" style={{ maxWidth: 400 }}>
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: T.accent }}>
            <Mountain size={17} color="#fff" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight" style={{ color: T.ink }}>PensiuneKit</div>
            <div className="text-[10px]" style={{ color: T.muted }}>Vendégélmény-platform</div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6"
          style={{ border: `1px solid ${T.line}`, boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}>
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: T.ink }}>{titles[mode][0]}</h1>
          <p className="text-sm mt-1 mb-5" style={{ color: T.muted }}>{titles[mode][1]}</p>

          <div className="space-y-3">
            <Input icon={Mail} type="email" placeholder="E-mail cím" value={email}
              onChange={(e) => setEmail(e.target.value)} />
            {mode !== "forgot" && (
              <Input icon={Lock} type="password" placeholder="Jelszó (min. 6 karakter)" value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()} />
            )}
          </div>

          {mode === "login" && (
            <button onClick={() => { setMode("forgot"); setMsg(null); }}
              className="mt-2 text-xs font-medium" style={{ color: T.accent }}>
              Elfelejtetted a jelszavad?
            </button>
          )}

          {msg && (
            <div className="mt-4 rounded-xl p-3 text-xs leading-relaxed flex items-start gap-2"
              style={{
                background: msg.ok ? T.accentSoft : "#FBEDEA",
                color: msg.ok ? T.accentDark : "#8A2E22",
              }}>
              {msg.ok && <Check size={14} className="mt-0.5 shrink-0" />}
              {msg.text}
            </div>
          )}

          <button onClick={submit} disabled={loading}
            className="mt-5 w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: T.accent }}>
            {loading && <Loader2 size={15} className="animate-spin" />}
            {mode === "login" ? "Belépés" : mode === "register" ? "Regisztráció" : "Visszaállító link küldése"}
          </button>

          {mode !== "forgot" && (
            <>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px" style={{ background: T.line }} />
                <span className="text-[11px]" style={{ color: T.muted }}>vagy</span>
                <div className="flex-1 h-px" style={{ background: T.line }} />
              </div>
              <button onClick={google}
                className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-white"
                style={{ border: `1px solid ${T.line}`, color: T.ink }}>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Belépés Google-fiókkal
              </button>
            </>
          )}

          <div className="mt-5 pt-4 text-center text-xs" style={{ borderTop: `1px solid ${T.line}`, color: T.muted }}>
            {mode === "login" && (
              <>Még nincs fiókod?{" "}
                <button onClick={() => { setMode("register"); setMsg(null); }} className="font-semibold" style={{ color: T.accent }}>
                  Regisztrálj ingyen
                </button>
              </>
            )}
            {mode === "register" && (
              <>Van már fiókod?{" "}
                <button onClick={() => { setMode("login"); setMsg(null); }} className="font-semibold" style={{ color: T.accent }}>
                  Lépj be
                </button>
              </>
            )}
            {mode === "forgot" && (
              <button onClick={() => { setMode("login"); setMsg(null); }}
                className="font-semibold inline-flex items-center gap-1" style={{ color: T.accent }}>
                <ArrowLeft size={13} /> Vissza a belépéshez
              </button>
            )}
          </div>
        </div>

        <a href="#" onClick={() => (window.location.hash = "")}
          className="block text-center mt-4 text-xs" style={{ color: T.muted }}>
          ← Vissza a főoldalra
        </a>
      </div>
    </div>
  );
}
