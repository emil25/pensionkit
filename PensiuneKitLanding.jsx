import React, { useState } from "react";
import {
  Mountain, Sparkles, QrCode, MessageSquareQuote, Megaphone, BarChart3,
  BookOpen, Globe, Check, ChevronDown, Star, ArrowRight, Wifi, Coffee,
  Clock, Smartphone, Languages, Zap, Shield, TrendingUp, Play, Menu, X,
  LayoutDashboard, Mail, MapPin, Phone
} from "lucide-react";

/* ─────────────────────────────────────────────
   PensiuneKit — SaaS landing oldal
   Ugyanaz a designrendszer, mint az appban:
   fenyőzöld akcent, Linear/Stripe-minimál
────────────────────────────────────────────── */

const T = {
  bg: "#F7F7F5",
  ink: "#17181A",
  muted: "#6E7076",
  line: "#E9E9E6",
  accent: "#256B48",
  accentDark: "#1d5238",
  accentSoft: "#EAF3EE",
  amber: "#E8A33D",
};

const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

/* ───────────── Interaktív termék-mockup ───────────── */

function MiniPhone() {
  return (
    <div className="rounded-[1.8rem] p-1.5 mx-auto" style={{ width: 210, background: "#17181A", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
      <div className="rounded-[1.5rem] overflow-hidden" style={{ background: "#FDFBF7" }}>
        <div className="h-20 flex flex-col items-center justify-center text-center px-4"
          style={{ background: "linear-gradient(160deg, #1d5238, #2F6B4F)" }}>
          <div className="text-white text-sm" style={serif}>Boróka Vendégház</div>
          <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.75)" }}>Hegyi csend, erdei kilátás</div>
        </div>
        <div className="p-2.5 space-y-2">
          {[
            [Wifi, "WIFI", "Boroka_Guest · boroka2026"],
            [Coffee, "REGGELI", "8:00–10:00, házi lekvárokkal"],
            [Clock, "CHECK-IN", "15:00-tól · check-out 11:00-ig"],
          ].map(([I, t, d]) => (
            <div key={t} className="rounded-xl p-2.5" style={{ background: "#fff", border: "1px solid #EDE9E1" }}>
              <div className="flex items-center gap-1.5 text-[8px] font-semibold" style={{ color: T.accent }}>
                <I size={10} /> {t}
              </div>
              <div className="text-[10px] mt-1" style={{ color: T.ink }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniDashboard() {
  return (
    <div className="rounded-2xl overflow-hidden mx-auto" style={{ width: "100%", maxWidth: 420, background: "#fff", border: `1px solid ${T.line}`, boxShadow: "0 20px 50px rgba(0,0,0,0.12)" }}>
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${T.line}`, background: "#FCFCFB" }}>
        <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: T.accent }}>
          <Mountain size={11} color="#fff" />
        </div>
        <span className="text-xs font-semibold" style={{ color: T.ink }}>Vezérlőpult · Boróka Vendégház</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2">
          {[["Kihasználtság", "78%"], ["Átlag értékelés", "4.9★"], ["QR megnyitás", "482"]].map(([l, v]) => (
            <div key={l} className="rounded-xl p-2.5" style={{ border: `1px solid ${T.line}` }}>
              <div className="text-[9px]" style={{ color: T.muted }}>{l}</div>
              <div className="text-base font-semibold" style={{ color: T.ink }}>{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl p-3 flex items-end gap-1.5" style={{ background: "#FAFAF8", height: 88 }}>
          {[40, 55, 48, 70, 62, 84, 78, 58, 62, 41, 77, 66].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, background: i === 5 ? T.accent : "#C9DACF" }} />
          ))}
        </div>
        <div className="mt-3 rounded-xl p-2.5 flex items-start gap-2 text-[10px]" style={{ background: T.accentSoft, color: T.accentDark }}>
          <Sparkles size={11} className="mt-0.5 shrink-0" />
          AI-javaslat: szeptemberre 58% a foglaltság — indítsd el az őszi kampányt!
        </div>
      </div>
    </div>
  );
}

function MiniAI() {
  return (
    <div className="rounded-2xl overflow-hidden mx-auto" style={{ width: "100%", maxWidth: 420, background: "#fff", border: `1px solid ${T.line}`, boxShadow: "0 20px 50px rgba(0,0,0,0.12)" }}>
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${T.line}`, background: "#FCFCFB" }}>
        <Sparkles size={13} style={{ color: T.accent }} />
        <span className="text-xs font-semibold" style={{ color: T.ink }}>AI Asszisztens</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl px-3 py-2 text-[11px] text-white" style={{ background: T.ink, borderBottomRightRadius: 4 }}>
            Válaszolj erre a Booking véleményre: „Szép hely, de lassú volt a wifi az emeleten.”
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl px-3 py-2 text-[11px]" style={{ background: "#F3F5F2", color: T.ink, borderBottomLeftRadius: 4 }}>
            <div className="flex items-center gap-1 text-[9px] font-semibold mb-1" style={{ color: T.accent }}>
              <Sparkles size={9} /> PensiuneKit AI
            </div>
            Kedves Vendégünk! Köszönjük a visszajelzést — azóta megerősítettük a WiFi-lefedettséget az emeleten. Reméljük, hamarosan újra vendégül láthatjuk, és személyesen is meggyőződhet róla!
          </div>
        </div>
        <div className="flex gap-1.5">
          {["Másolás", "Újragenerálás", "Németül"].map((x) => (
            <span key={x} className="px-2 py-1 rounded-md text-[9px] font-medium" style={{ border: `1px solid ${T.line}`, color: T.muted }}>{x}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function InteractiveMockup() {
  const [tab, setTab] = useState(0);
  const tabs = [
    { l: "Vezérlőpult", i: LayoutDashboard, c: <MiniDashboard /> },
    { l: "Vendégútmutató", i: Smartphone, c: <MiniPhone /> },
    { l: "AI Asszisztens", i: Sparkles, c: <MiniAI /> },
  ];
  return (
    <div>
      <div className="flex justify-center gap-2 mb-6">
        {tabs.map((t, i) => (
          <button key={t.l} onClick={() => setTab(i)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all"
            style={{
              background: tab === i ? T.ink : "#fff",
              color: tab === i ? "#fff" : T.muted,
              border: `1px solid ${tab === i ? T.ink : T.line}`,
            }}>
            <t.i size={13} /> {t.l}
          </button>
        ))}
      </div>
      <div style={{ minHeight: 320 }} className="flex items-start justify-center">{tabs[tab].c}</div>
    </div>
  );
}

/* ───────────── Landing oldal ───────────── */

const FEATURES = [
  { i: BookOpen, t: "Digitális vendégútmutató", d: "Gyönyörű mobiloldal WiFi-jelszóval, házirenddel, túrákkal és éttermekkel — a vendég QR-ról nyitja, app nélkül." },
  { i: Sparkles, t: "AI Vendégasszisztens", d: "„Hozhatunk kutyát?” — kész, udvarias válasz 7 nyelven, a szállásod saját adataiból, másodpercek alatt." },
  { i: MessageSquareQuote, t: "AI Vélemény-menedzser", d: "Google, Booking, Airbnb, Facebook és Tripadvisor vélemények egy helyen — profi válasz egy kattintással." },
  { i: Megaphone, t: "AI Marketing Studio", d: "Facebook posztok, hétvégi ajánlatok, szezonális kampányok — reklámszöveg-írás nélkül." },
  { i: QrCode, t: "QR-anyagok", d: "Recepciós kártya, szobamatrica, asztali QR, poszter — nyomtatásra kész PNG és SVG formátumban." },
  { i: BarChart3, t: "Analitika", d: "Mit néznek a vendégek? Honnan jönnek? Hogyan alakul az értékelésed? Minden egy áttekinthető felületen." },
];

const STEPS = [
  { n: "1", t: "Add meg a szállásod adatait", d: "Név, WiFi, reggeli, házirend, kedvenc helyeid a környéken — kb. 15 perc, egyszer." },
  { n: "2", t: "Nyomtasd ki a QR-kódot", d: "Tedd ki a szobákba és a recepcióra. A vendég beolvassa, és minden választ megtalál." },
  { n: "3", t: "Hagyd, hogy az AI dolgozzon", d: "Vélemény-válaszok, üzenetek, posztok — te a vendégekkel foglalkozol, nem a képernyővel." },
];

const PLANS = [
  {
    n: "Ingyenes", pm: 0, py: 0, d: "Kipróbáláshoz és kis szállásoknak",
    f: ["1 szállás", "Digitális vendégútmutató", "QR-kód generátor", "10 AI-generálás / hó"],
    cta: "Kezdés ingyen",
  },
  {
    n: "Starter", pm: 12, py: 9, d: "Panzióknak és kulcsosházaknak",
    f: ["1 szállás", "Korlátlan útmutató-szerkesztés", "100 AI-generálás / hó", "Vélemény-menedzser", "Alap analitika"],
    cta: "Starter választása",
  },
  {
    n: "Pro", pm: 29, py: 24, d: "A legnépszerűbb — mindenes csomag", hot: true,
    f: ["3 szállás", "Korlátlan AI-generálás", "Marketing Studio", "Saját weboldal a szállásnak", "Teljes analitika", "7 nyelvű útmutató"],
    cta: "Pro választása",
  },
  {
    n: "Business", pm: 79, py: 65, d: "Több szállást kezelő csapatoknak",
    f: ["Korlátlan szállás", "Csapattagok és jogosultságok", "Prioritásos támogatás", "API-hozzáférés", "Egyedi domain"],
    cta: "Beszéljünk",
  },
];

const TESTIMONIALS = [
  { n: "Boróka Vendégház", w: "Hargita megye · 8 szoba", s: 5, t: "Napi másfél órát nyertünk vissza. A vendégek 80%-a a QR-útmutatóból tájékozódik, alig csörög a telefon ugyanazokkal a kérdésekkel." },
  { n: "Havasi Kulcsosház", w: "Maros megye · 4 szoba", s: 5, t: "A vélemény-válaszoló miatt fizettem elő, de a marketing rész lett a kedvencem. A húsvéti kampányunk 8 foglalást hozott." },
  { n: "Villa Panoráma", w: "Brassó · 12 szoba", s: 5, t: "Végre egy szoftver, ami nem úgy néz ki, mint egy 2009-es hotelrendszer. A vendégeink is megjegyzik, milyen igényes az útmutató." },
];

const FAQS = [
  { q: "Kell a vendégeknek appot letölteniük?", a: "Nem. A vendégútmutató egy sima weboldal — a vendég beolvassa a QR-kódot a telefonjával, és azonnal megnyílik a böngészőben. Se letöltés, se regisztráció." },
  { q: "Ez egy foglalási rendszer (PMS)?", a: "Nem — és ez szándékos. A PensiuneKit a vendégélményre fókuszál: kommunikáció, útmutató, vélemények, marketing. A meglévő foglalási rendszered mellett működik, nem helyette." },
  { q: "Milyen nyelveken működik?", a: "Az útmutató és az AI-válaszok 7 nyelven érhetők el: magyar, román, angol, német, francia, olasz, spanyol. A vendég a saját nyelvén olvassa az útmutatót." },
  { q: "Mennyi idő beállítani?", a: "Kb. 15 perc. Megadod az alapadatokat (WiFi, reggeli, házirend), feltöltesz pár képet, kinyomtatod a QR-t — és kész. Az AI-funkciók azonnal működnek." },
  { q: "Lemondhatom bármikor?", a: "Igen, egy kattintással, a hónap végéig. Nincs hűségidő, nincs apró betű. Az adataidat bármikor exportálhatod." },
  { q: "Honnan tudja az AI, mit válaszoljon?", a: "A saját szállásod adataiból dolgozik: a te házirended, a te reggeliidőd, a te ajánlásaid. Nem általános sablonokat ír, hanem a te szállásodra szabott válaszokat." },
];

const POSTS = [
  { t: "Így duplázd meg a Google-véleményeid számát 60 nap alatt", d: "5 perc olvasás", c: "Vélemények" },
  { t: "QR-kód a szobában: mit tegyél bele, és mit ne?", d: "4 perc olvasás", c: "Vendégélmény" },
  { t: "Miért foglalnak egyre többen közvetlenül — és hogyan használd ki?", d: "7 perc olvasás", c: "Direkt foglalás" },
];

function Faq({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl bg-white overflow-hidden" style={{ border: `1px solid ${T.line}` }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <span className="text-sm font-semibold pr-4" style={{ color: T.ink }}>{q}</span>
        <ChevronDown size={16} className="shrink-0 transition-transform" style={{ color: T.muted, transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: T.muted }}>{a}</div>}
    </div>
  );
}

function Eyebrow({ children }) {
  return <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: T.accent }}>{children}</div>;
}

function H2({ children }) {
  return <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: T.ink }}>{children}</h2>;
}

export default function PensiuneKitLanding() {
  const [yearly, setYearly] = useState(true);
  const [menu, setMenu] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const navLinks = ["Funkciók", "Hogyan működik", "Árak", "Vélemények", "GYIK"];

  return (
    <div className="min-h-screen" style={{ background: T.bg, fontFamily: "ui-sans-serif, -apple-system, 'Segoe UI', Roboto, sans-serif" }}>

      {/* ── Fejléc ── */}
      <header className="sticky top-0 z-20 px-5 sm:px-8 py-3.5 flex items-center justify-between"
        style={{ background: "rgba(247,247,245,0.85)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.line}` }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: T.accent }}>
            <Mountain size={16} color="#fff" />
          </div>
          <span className="text-sm font-semibold tracking-tight" style={{ color: T.ink }}>PensiuneKit</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium" style={{ color: T.muted }}>
          {navLinks.map((x) => <span key={x} className="cursor-pointer hover:opacity-70">{x}</span>)}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <a href="#app" className="text-sm font-medium cursor-pointer" style={{ color: T.ink, textDecoration: "none" }}>Bejelentkezés</a>
          <a href="#app" className="px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer" style={{ background: T.accent, textDecoration: "none" }}>Kezdés ingyen</a>
        </div>
        <button className="md:hidden" onClick={() => setMenu(!menu)}>
          {menu ? <X size={20} style={{ color: T.ink }} /> : <Menu size={20} style={{ color: T.ink }} />}
        </button>
      </header>
      {menu && (
        <div className="md:hidden px-5 py-4 space-y-3 text-sm font-medium" style={{ background: "#fff", borderBottom: `1px solid ${T.line}`, color: T.ink }}>
          {navLinks.map((x) => <div key={x}>{x}</div>)}
          <div className="pt-2 px-4 py-2.5 rounded-xl text-white text-center font-semibold" style={{ background: T.accent }}>Kezdés ingyen</div>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="px-5 sm:px-8 pt-16 pb-12 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
          style={{ background: T.accentSoft, color: T.accentDark }}>
          <Sparkles size={13} /> AI-alapú vendégélmény-platform kis szállásoknak
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight" style={{ color: T.ink }}>
          A vendégeid minden választ megkapnak.<br />
          <span style={{ color: T.accent }}>Te visszakapod az idődet.</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: T.muted }}>
          Digitális vendégútmutató, AI vélemény-válaszoló és marketing-segéd panzióknak,
          kulcsosházaknak és vendégházaknak. Nem foglalási rendszer — a vendégélmény a dolgunk.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#app" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer"
            style={{ background: T.accent, boxShadow: "0 4px 16px rgba(37,107,72,0.35)", textDecoration: "none" }}>
            Kezdés ingyen — bankkártya nélkül <ArrowRight size={15} />
          </a>
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer bg-white"
            style={{ border: `1px solid ${T.line}`, color: T.ink }}>
            <Play size={14} style={{ color: T.accent }} /> 2 perces bemutató
          </span>
        </div>
        <div className="mt-4 text-xs" style={{ color: T.muted }}>Ingyenes csomag örökre · beállítás 15 perc alatt</div>
      </section>

      {/* ── Interaktív mockup ── */}
      <section className="px-5 sm:px-8 pb-16 max-w-4xl mx-auto">
        <InteractiveMockup />
      </section>

      {/* ── Előnyök számokban ── */}
      <section className="px-5 sm:px-8 py-12" style={{ background: "#fff", borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}` }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            ["~90 perc", "megspórolt idő naponta"],
            ["7 nyelv", "automatikus fordítással"],
            ["+38%", "több vélemény átlagosan"],
            ["15 perc", "a teljes beállítás"],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: T.accent }}>{v}</div>
              <div className="text-xs mt-1" style={{ color: T.muted }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Funkciók ── */}
      <section className="px-5 sm:px-8 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Eyebrow>Funkciók</Eyebrow>
          <H2>Minden, amivel egy kis szállás nagynak tűnik</H2>
          <p className="mt-2 text-sm max-w-xl mx-auto" style={{ color: T.muted }}>
            Nem 200 funkció, amit sosem használsz — hanem hat, amit minden nap.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.t} className="rounded-2xl bg-white p-5" style={{ border: `1px solid ${T.line}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: T.accentSoft }}>
                <f.i size={17} style={{ color: T.accent }} />
              </div>
              <div className="text-sm font-semibold mt-3" style={{ color: T.ink }}>{f.t}</div>
              <p className="text-[13px] mt-1.5 leading-relaxed" style={{ color: T.muted }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Hogyan működik ── */}
      <section className="px-5 sm:px-8 py-16" style={{ background: "#fff", borderTop: `1px solid ${T.line}` }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow>Hogyan működik</Eyebrow>
            <H2>Három lépés, és magától megy</H2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center sm:text-left">
                <div className="w-9 h-9 rounded-full mx-auto sm:mx-0 flex items-center justify-center text-sm font-semibold text-white" style={{ background: T.accent }}>
                  {s.n}
                </div>
                <div className="text-sm font-semibold mt-3" style={{ color: T.ink }}>{s.t}</div>
                <p className="text-[13px] mt-1.5 leading-relaxed" style={{ color: T.muted }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Árak ── */}
      <section className="px-5 sm:px-8 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <Eyebrow>Árak</Eyebrow>
          <H2>Egyszerű árazás, rejtett költségek nélkül</H2>
          <div className="mt-5 inline-flex items-center gap-1 p-1 rounded-full bg-white" style={{ border: `1px solid ${T.line}` }}>
            {[["Havi", false], ["Éves · –20%", true]].map(([l, y]) => (
              <button key={l} onClick={() => setYearly(y)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{ background: yearly === y ? T.ink : "transparent", color: yearly === y ? "#fff" : T.muted }}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {PLANS.map((pl) => (
            <div key={pl.n} className="rounded-2xl p-5 flex flex-col relative"
              style={{
                background: "#fff",
                border: pl.hot ? `2px solid ${T.accent}` : `1px solid ${T.line}`,
                boxShadow: pl.hot ? "0 12px 32px rgba(37,107,72,0.15)" : "none",
              }}>
              {pl.hot && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold text-white" style={{ background: T.accent }}>
                  Legnépszerűbb
                </span>
              )}
              <div className="text-sm font-semibold" style={{ color: T.ink }}>{pl.n}</div>
              <div className="text-[11px] mt-0.5" style={{ color: T.muted }}>{pl.d}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight" style={{ color: T.ink }}>€{yearly ? pl.py : pl.pm}</span>
                <span className="text-xs" style={{ color: T.muted }}>/hó{yearly && pl.pm > 0 ? " · évente számlázva" : ""}</span>
              </div>
              <div className="mt-4 space-y-2 flex-1">
                {pl.f.map((x) => (
                  <div key={x} className="flex items-start gap-2 text-[13px]" style={{ color: T.ink }}>
                    <Check size={14} className="mt-0.5 shrink-0" style={{ color: T.accent }} /> {x}
                  </div>
                ))}
              </div>
              <span className="mt-5 block text-center px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                style={pl.hot ? { background: T.accent, color: "#fff" } : { border: `1px solid ${T.line}`, color: T.ink }}>
                {pl.cta}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-xs" style={{ color: T.muted }}>
          Minden fizetős csomag 14 napig ingyenesen kipróbálható. Fizetés bankkártyával, Stripe-on keresztül.
        </div>
      </section>

      {/* ── Vélemények ── */}
      <section className="px-5 sm:px-8 py-16" style={{ background: "#fff", borderTop: `1px solid ${T.line}` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow>Vélemények</Eyebrow>
            <H2>Szállásadók, akik visszakapták az estéiket</H2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t) => (
              <div key={t.n} className="rounded-2xl p-5" style={{ background: T.bg, border: `1px solid ${T.line}` }}>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={13} fill={T.amber} style={{ color: T.amber }} />)}
                </div>
                <p className="text-sm mt-3 leading-relaxed" style={{ ...serif, color: T.ink }}>„{t.t}”</p>
                <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${T.line}` }}>
                  <div className="text-xs font-semibold" style={{ color: T.ink }}>{t.n}</div>
                  <div className="text-[11px]" style={{ color: T.muted }}>{t.w}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GYIK ── */}
      <section className="px-5 sm:px-8 py-16 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Eyebrow>GYIK</Eyebrow>
          <H2>Gyakori kérdések</H2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f) => <Faq key={f.q} {...f} />)}
        </div>
      </section>

      {/* ── Blog ── */}
      <section className="px-5 sm:px-8 py-16" style={{ background: "#fff", borderTop: `1px solid ${T.line}` }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Eyebrow>Blog</Eyebrow>
            <H2>Tippek szállásadóknak</H2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {POSTS.map((p, i) => (
              <div key={p.t} className="rounded-2xl overflow-hidden cursor-pointer group" style={{ border: `1px solid ${T.line}` }}>
                <div className="h-24 flex items-end p-3"
                  style={{ background: `linear-gradient(145deg, ${["#2F6B4F", "#4F6B7A", "#7A6A4F"][i]}, ${["#1C4534", "#2C4450", "#4E3F27"][i]})` }}>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "rgba(255,255,255,0.9)", color: T.ink }}>{p.c}</span>
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold leading-snug group-hover:underline" style={{ color: T.ink }}>{p.t}</div>
                  <div className="text-[11px] mt-2" style={{ color: T.muted }}>{p.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Záró CTA + kapcsolat ── */}
      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-3xl mx-auto rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, #1d5238, #2F6B4F)" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 10%, rgba(255,255,255,0.18), transparent 50%)" }} />
          <h2 className="relative text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Adj a vendégeidnek olyan élményt,<br />amiről véleményt írnak.
          </h2>
          <p className="relative mt-3 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
            Ingyenes csomag, bankkártya nélkül. 15 perc múlva már a szobában lehet a QR-kód.
          </p>
          {sent ? (
            <div className="relative mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold" style={{ background: "#fff", color: T.accentDark }}>
              <Check size={16} /> Köszönjük! Elküldtük a belépési linket a(z) {email || "megadott"} címre.
            </div>
          ) : (
            <div className="relative mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail címed"
                className="flex-1 rounded-xl px-4 py-3 text-sm outline-none" style={{ color: T.ink }} />
              <button onClick={() => setSent(true)} className="px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap"
                style={{ background: "#fff", color: T.accentDark }}>
                Kezdés ingyen
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Lábléc ── */}
      <footer className="px-5 sm:px-8 py-10" style={{ background: "#17181A" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: T.accent }}>
                <Mountain size={14} color="#fff" />
              </div>
              <span className="font-semibold text-white">PensiuneKit</span>
            </div>
            <p className="text-xs mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              AI-alapú vendégélmény-platform panzióknak, kulcsosházaknak és vendégházaknak.
            </p>
          </div>
          {[
            ["Termék", ["Funkciók", "Árak", "Vendégútmutató demó", "Újdonságok"]],
            ["Cég", ["Rólunk", "Blog", "Kapcsolat", "Partnerprogram"]],
            ["Jogi", ["ÁSZF", "Adatvédelem", "Cookie-k", "Impresszum"]],
          ].map(([h, links]) => (
            <div key={h}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>{h}</div>
              <div className="space-y-2">
                {links.map((l) => <div key={l} className="text-xs cursor-pointer hover:opacity-80" style={{ color: "rgba(255,255,255,0.7)" }}>{l}</div>)}
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}>
          <span>© 2026 PensiuneKit. Minden jog fenntartva.</span>
          <span className="inline-flex items-center gap-1.5"><Shield size={11} /> GDPR-megfelelő · Adatok az EU-ban tárolva</span>
        </div>
      </footer>
    </div>
  );
}
