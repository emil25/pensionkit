import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, BookOpen, Sparkles, MessageSquareQuote, Mail, QrCode,
  Megaphone, BarChart3, ChevronDown, Wifi, Coffee, Car, PawPrint,
  Star, Copy, RefreshCw, Check, Phone, MapPin, Clock, Eye, Languages,
  TrendingUp, Loader2, Mountain, Waves, Landmark, UtensilsCrossed,
  BedDouble, Users, Globe, CalendarDays, Send, ChevronRight, Search,
  Baby, Trees, Flame, Camera, Music, CloudSun, ShieldAlert, ArrowRight
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, CartesianGrid, LineChart, Line
} from "recharts";

/* ─────────────────────────────────────────────
   PensiuneKit — Boróka Guesthouse demó
   Stílus: Linear / Stripe / Notion — prémium, minimál
────────────────────────────────────────────── */

const T = {
  bg: "#F7F7F5",
  surface: "#FFFFFF",
  ink: "#17181A",
  muted: "#6E7076",
  line: "#E9E9E6",
  accent: "#256B48",
  accentDark: "#1d5238",
  accentSoft: "#EAF3EE",
  amber: "#E8A33D",
};

async function askClaude(prompt) {
  // Az AI-hívás a szerveroldali proxy-n megy át (/api/claude), így az
  // Anthropic API-kulcs soha nem kerül a böngészőbe. Ha nincs ilyen
  // szerveroldali végpont (pl. egyszerű statikus feltöltésnél), a demó
  // barátságos üzenetet mutat hiba helyett.
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || "API hiba");
    return (data.text || "").trim();
  } catch {
    return "ℹ️ Az élő AI-generálás ebben az egyszerű feltöltésben nincs bekapcsolva — ehhez szerveroldali API-kulcs kell. A demó minden más része (adatok, oldalak, kész AI-válaszok) teljes értékű.";
  }
}

/* ───────────── "fotó" csempék (stock-fotó helyettesítők) ───────────── */

const HUES = [
  ["#2F6B4F", "#1C4534"], ["#5B7A5A", "#33502F"], ["#7A6A4F", "#4E3F27"],
  ["#4F6B7A", "#2C4450"], ["#8A6A50", "#5A3E28"], ["#3E5C55", "#22332F"],
];

function Photo({ label, icon: Icon = Trees, h = 0, className = "", height = 120, big }) {
  const [a, b] = HUES[h % HUES.length];
  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ height, background: `linear-gradient(145deg, ${a}, ${b})` }}>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(circle at 75% 20%, rgba(255,255,255,0.22), transparent 55%)",
      }} />
      <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
        <Icon size={big ? 16 : 12} color="rgba(255,255,255,0.9)" />
        <span className={`${big ? "text-xs" : "text-[10px]"} font-medium`} style={{ color: "rgba(255,255,255,0.9)" }}>{label}</span>
      </div>
    </div>
  );
}

/* ───────────── DEMÓ ADATOK ───────────── */

const PROPERTY_INIT = {
  name: "Boróka Vendégház",
  tagline: "Hegyi csend, erdei kilátás, házi reggeli",
  desc: "Hangulatos hegyvidéki vendégház 8 szobával Hargita megyében — erdőre néző szobák, házi készítésű reggeli és családbarát légkör.",
  wifiName: "Boroka_Guest",
  wifiPass: "boroka2026",
  checkin: "15:00-tól",
  checkout: "11:00-ig",
  breakfast: "8:00–10:00 között a földszinti étkezőben. Házi lekvárok, friss kenyér, helyi termelői sajtok és felvágottak.",
  rules: "Csendes órák: 22:00–8:00\nDohányozni csak a teraszon lehet\nHáziállat előzetes egyeztetéssel hozható\nA szaunát 21:00-ig lehet használni",
  parking: "Ingyenes, zárt parkoló az udvaron — 10 férőhely, kamerával megfigyelt.",
  phone: "+40 745 123 456",
  taxi: "+40 744 987 654",
  email: "hello@borokavendeghaz.ro",
  address: "Fenyves utca 12., Hargita megye, Románia",
};

const ROOMS = [
  { no: "101", type: "Kétágyas szoba", price: 85, status: "Szabad", cap: "2 fő", h: 0, icon: BedDouble, amen: ["Erdei kilátás", "Kávéfőző", "Erkély"] },
  { no: "102", type: "Családi szoba", price: 120, status: "Foglalt", cap: "2+2 fő", h: 1, icon: Users, amen: ["Kiságy", "Játéksarok", "Erdei kilátás"] },
  { no: "103", type: "Deluxe szoba", price: 110, status: "Takarítás", cap: "2 fő", h: 2, icon: Star, amen: ["Kandalló", "Kádas fürdő", "Panoráma"] },
  { no: "104", type: "Apartman", price: 150, status: "Lefoglalva", cap: "4 fő", h: 3, icon: Landmark, amen: ["Konyha", "Nappali", "2 hálószoba"] },
  { no: "105", type: "Kétágyas szoba", price: 85, status: "Foglalt", cap: "2 fő", h: 4, icon: BedDouble, amen: ["Udvari kilátás", "Kávéfőző"] },
  { no: "106", type: "Twin szoba", price: 80, status: "Foglalt", cap: "2 fő", h: 5, icon: BedDouble, amen: ["Két külön ágy", "Íróasztal"] },
  { no: "107", type: "Deluxe szoba", price: 110, status: "Foglalt", cap: "2+1 fő", h: 0, icon: Star, amen: ["Kandalló", "Erkély", "Panoráma"] },
  { no: "108", type: "Családi szoba", price: 125, status: "Foglalt", cap: "2+2 fő", h: 1, icon: Users, amen: ["Emeletes ágy", "Kiságy", "Erdei kilátás"] },
];

const STATUS_COLOR = {
  "Szabad": { bg: "#EAF3EE", fg: "#1d5238" },
  "Foglalt": { bg: "#FDF0DC", fg: "#8A5A16" },
  "Takarítás": { bg: "#E8EEF5", fg: "#2C4A6E" },
  "Lefoglalva": { bg: "#F1ECF9", fg: "#5B3E8F" },
  "Bejelentkezve": { bg: "#FDF0DC", fg: "#8A5A16" },
  "Érkezik ma": { bg: "#EAF3EE", fg: "#1d5238" },
  "Távozik ma": { bg: "#E8EEF5", fg: "#2C4A6E" },
  "Foglalva": { bg: "#F1ECF9", fg: "#5B3E8F" },
  "Kijelentkezve": { bg: "#F0F0EE", fg: "#6E7076" },
};

const G = (n, c, l, a, d, r, ad, ch, pet, s, note) => ({
  n, c, l, a, d, r, ad, ch, pet, s, note,
  ph: "+" + (c === "Magyarország" ? "36 30" : c === "Románia" ? "40 74" : "49 15") + " " + (100 + n.length) + " " + (2000 + n.charCodeAt(0)),
  e: n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ".") + "@gmail.com",
});

const GUESTS = [
  G("Kovács Anna", "Magyarország", "HU", "júl. 4.", "júl. 8.", "102", 2, 2, false, "Bejelentkezve", "Kiságyat kértek a kisebbik gyereknek"),
  G("Popescu Andrei", "Románia", "RO", "júl. 5.", "júl. 9.", "105", 2, 0, false, "Bejelentkezve", "Késői érkezés, 22:00 után"),
  G("Weber Klaus", "Németország", "DE", "júl. 3.", "júl. 10.", "106", 2, 0, false, "Bejelentkezve", "Túraútvonalak érdeklik, térképet kértek"),
  G("Szabó Bence", "Magyarország", "HU", "júl. 5.", "júl. 7.", "107", 2, 1, false, "Bejelentkezve", "Évfordulós hétvége"),
  G("Ionescu Maria", "Románia", "RO", "júl. 2.", "júl. 6.", "108", 2, 2, false, "Távozik ma", "Késői kijelentkezést kértek (12:00)"),
  G("Smith Oliver", "Egyesült Királyság", "EN", "júl. 1.", "júl. 6.", "103", 2, 0, false, "Kijelentkezve", "5★ véleményt ígértek"),
  G("Nagy Eszter", "Magyarország", "HU", "júl. 6.", "júl. 9.", "101", 2, 0, true, "Érkezik ma", "Kistestű kutyával érkeznek"),
  G("Müller Hannah", "Németország", "DE", "júl. 6.", "júl. 12.", "104", 2, 2, false, "Érkezik ma", "Vegetáriánus reggelit kértek"),
  G("Tóth Gábor", "Magyarország", "HU", "júl. 6.", "júl. 10.", "103", 2, 0, false, "Érkezik ma", "Motorral érkeznek, fedett parkolót kértek"),
  G("Dumitrescu Elena", "Románia", "RO", "júl. 11.", "júl. 14.", "102", 2, 1, false, "Foglalva", "Születésnapi meglepetés-torta rendelve"),
  G("Fekete László", "Magyarország", "HU", "júl. 12.", "júl. 16.", "105", 2, 0, false, "Foglalva", ""),
  G("Rossi Marco", "Olaszország", "IT", "júl. 15.", "júl. 19.", "104", 3, 1, false, "Foglalva", "Angolul kommunikálnak"),
  G("Novák Petra", "Magyarország", "HU", "júl. 18.", "júl. 21.", "101", 2, 0, false, "Foglalva", "Wellness-hétvége csomag"),
  G("Braun Stefan", "Ausztria", "DE", "júl. 20.", "júl. 25.", "106", 2, 0, true, "Foglalva", "Két kisebb kutyával"),
  G("García Lucía", "Spanyolország", "ES", "aug. 1.", "aug. 6.", "103", 2, 0, false, "Foglalva", ""),
  G("Kelemen Zsófia", "Magyarország", "HU", "aug. 3.", "aug. 8.", "108", 2, 2, false, "Foglalva", "Visszatérő vendégek, 3. látogatás"),
  G("Stan Ioana", "Románia", "RO", "aug. 8.", "aug. 10.", "102", 2, 0, false, "Foglalva", ""),
  G("Dubois Claire", "Franciaország", "FR", "aug. 12.", "aug. 16.", "104", 2, 1, false, "Foglalva", "Franciául beszélnek, útmutató FR nyelven"),
  G("Balázs Márton", "Magyarország", "HU", "dec. 24.", "dec. 27.", "105", 2, 2, false, "Foglalva", "Karácsonyi csomag"),
  G("Farkas Ildikó", "Magyarország", "HU", "jún. 28.", "júl. 2.", "101", 2, 0, false, "Kijelentkezve", "Google-véleményt írtak (5★)"),
  G("Georgescu Vlad", "Románia", "RO", "jún. 25.", "jún. 28.", "107", 2, 0, false, "Kijelentkezve", ""),
  G("Schmidt Anna", "Németország", "DE", "jún. 20.", "jún. 26.", "104", 2, 2, false, "Kijelentkezve", "Booking-vélemény: 9.6"),
  G("Molnár Dávid", "Magyarország", "HU", "jún. 18.", "jún. 21.", "106", 2, 0, false, "Kijelentkezve", ""),
  G("Radu Cristina", "Románia", "RO", "jún. 14.", "jún. 17.", "102", 2, 1, false, "Kijelentkezve", "Kérték a lekvár receptjét :)"),
  G("Kiss Réka", "Magyarország", "HU", "jún. 10.", "jún. 14.", "103", 2, 0, false, "Kijelentkezve", ""),
  G("Brown Emily", "Egyesült Királyság", "EN", "jún. 7.", "jún. 11.", "105", 2, 0, false, "Kijelentkezve", "Tripadvisor-vélemény érkezett"),
  G("Vass Tamás", "Magyarország", "HU", "jún. 1.", "jún. 5.", "108", 2, 2, true, "Kijelentkezve", "Kutyabarát szolgáltatást dicsérték"),
  G("Munteanu Alex", "Románia", "RO", "máj. 28.", "máj. 31.", "101", 2, 0, false, "Kijelentkezve", ""),
  G("Keller Jonas", "Németország", "DE", "máj. 24.", "máj. 29.", "107", 2, 0, false, "Kijelentkezve", "Kerékpártúrán voltak"),
  G("Orbán Lilla", "Magyarország", "HU", "máj. 20.", "máj. 23.", "102", 2, 0, false, "Kijelentkezve", ""),
  G("Petrescu Dan", "Románia", "RO", "máj. 15.", "máj. 18.", "106", 2, 1, false, "Kijelentkezve", ""),
  G("Horváth Nóra", "Magyarország", "HU", "máj. 10.", "máj. 14.", "104", 2, 2, false, "Kijelentkezve", "Facebook-vélemény: 5★"),
  G("Fischer Lena", "Németország", "DE", "máj. 5.", "máj. 9.", "103", 2, 0, false, "Kijelentkezve", ""),
  G("Bíró Csaba", "Magyarország", "HU", "máj. 1.", "máj. 4.", "105", 2, 0, false, "Kijelentkezve", "Májusi hosszú hétvége"),
  G("Enache Simona", "Románia", "RO", "ápr. 25.", "ápr. 28.", "108", 2, 1, false, "Kijelentkezve", ""),
];

const R = (pf, name, rating, date, text, reply) => ({ pf, name, rating, date, text, reply });
const REVIEWS = [
  R("Google", "Farkas Ildikó", 5, "júl. 3.", "Csodálatos hely, a reggeli minden nap más volt és minden nap finomabb. A házigazdák figyelme lenyűgöző.", "Kedves Ildikó, nagyon köszönjük a szavait! A házi reggeli a szívügyünk — örülünk, hogy ízlett. Szeretettel várjuk vissza!"),
  R("Booking", "Schmidt Anna", 5, "jún. 27.", "Perfekte Lage für Wanderungen, sehr sauber, tolles Frühstück. Wir kommen wieder!", "Liebe Anna, vielen Dank! Es freut uns sehr, dass Ihnen die Wanderwege und das Frühstück gefallen haben. Bis bald in den Bergen!"),
  R("Google", "Popescu Andrei", 5, "jún. 25.", "Locație superbă, liniște totală, gazde foarte primitoare. Micul dejun a fost excelent.", "Mulțumim frumos, Andrei! Ne bucurăm că v-ați simțit bine. Vă așteptăm cu drag oricând!"),
  R("Airbnb", "Brown Emily", 4, "jún. 13.", "Beautiful guesthouse with stunning forest views. WiFi was a bit slow upstairs, but everything else was perfect.", "Thank you, Emily! We've since upgraded our WiFi coverage upstairs — we'd love to welcome you back to test it!"),
  R("Tripadvisor", "Kiss Réka", 5, "jún. 15.", "A kandallós deluxe szoba maga a mennyország. Este szauna, reggel madárcsicsergés.", "Kedves Réka, köszönjük a gyönyörű értékelést! A 103-as szoba a mi kedvencünk is. Várjuk vissza!"),
  R("Facebook", "Horváth Nóra", 5, "máj. 15.", "Gyerekekkel is tökéletes választás! Játéksarok, kiságy, türelmes házigazdák. Köszönünk mindent!", "Kedves Nóra, nagyon örülünk, hogy a gyerekek is jól érezték magukat! Jövőre is szeretettel várjuk a családot."),
  R("Booking", "Keller Jonas", 5, "máj. 30.", "Great base for cycling tours. Secure bike storage, hearty breakfast, friendly hosts.", "Thank you, Jonas! Cyclists are always welcome — glad the bike storage and breakfast fueled your tours!"),
  R("Google", "Vass Tamás", 5, "jún. 6.", "Kutyabarát hely, ami tényleg az! Külön tálka, plédek, séta-útvonal ajánlások. Ritkaság.", "Kedves Tamás, köszönjük! Nálunk a négylábú vendégek is teljes értékű vendégek. Várjuk vissza az egész csapatot!"),
  R("Booking", "Radu Cristina", 4, "jún. 18.", "Foarte curat, mic dejun delicios. Parcarea era plină o seară, dar gazdele au rezolvat rapid.", "Mulțumim, Cristina! Ne pare rău pentru neplăcere — între timp am extins parcarea. Vă așteptăm cu drag!"),
  R("Tripadvisor", "Smith Oliver", 5, "júl. 6.", "One of the best guesthouses we've stayed at in Transylvania. The digital guest guide was genuinely useful.", "Thank you, Oliver! We're glad the digital guide helped you discover the area. See you next time!"),
  R("Google", "Molnár Dávid", 5, "jún. 22.", "Minden apróságra figyelnek. A QR-kódos útmutató szuper ötlet, minden infót ott találtunk.", "Kedves Dávid, köszönjük! Igyekszünk, hogy minden kérdésre azonnal legyen válasz. Várjuk vissza!"),
  R("Facebook", "Orbán Lilla", 5, "máj. 24.", "Romantikus hétvégére tökéletes. A panorámás erkély naplementekor felejthetetlen.", "Kedves Lilla, de jó ezt olvasni! A naplemente tényleg a ház legjobb műsora. Szeretettel várjuk vissza kettesben!"),
  R("Booking", "Munteanu Alex", 4, "jún. 1.", "Cazare foarte bună, zonă superbă. Ar fi utilă o opțiune de cină la cerere.", "Mulțumim, Alex! Vestea bună: din această vară oferim cină la cerere din produse locale. Vă așteptăm!"),
  R("Google", "Bíró Csaba", 5, "máj. 6.", "Hosszú hétvégére jöttünk, egy hét múlva már a következő foglalást intéztük. Ez mindent elmond.", "Kedves Csaba, ez a legszebb visszajelzés, amit kaphatunk. Köszönjük a bizalmat, találkozunk hamarosan!"),
  R("Airbnb", "Fischer Lena", 5, "máj. 11.", "Sehr gemütlich, ruhig und stilvoll. Die Gastgeber haben uns tolle Wander-Tipps gegeben.", "Danke, Lena! Es freut uns, dass die Wandertipps gut ankamen. Die Berge warten schon auf Ihren nächsten Besuch!"),
  R("Google", "Petrescu Dan", 5, "máj. 19.", "Am venit cu copilul de 4 ani — locul de joacă și atmosfera de familie au fost perfecte.", "Mulțumim, Dan! Ne bucurăm că cel mic s-a simțit ca acasă. Vă așteptăm din nou cu toată familia!"),
  R("Tripadvisor", "Georgescu Vlad", 4, "jún. 30.", "Very good value for money. Rooms are cozy, breakfast generous. Book the sauna in advance on weekends.", "Thank you, Vlad! Good tip — weekend sauna slots do fill up fast. We look forward to your next visit!"),
  R("Facebook", "Kelemen Zsófia", 5, "ápr. 20.", "Harmadszor jövünk, és mindig hazaérkezés-érzés. A gyerekek már a kutyát is nevén szólítják :)", "Kedves Zsófia, Bodri is üdvözli a gyerekeket! :) Köszönjük a hűséget, augusztusban találkozunk!"),
  R("Booking", "Enache Simona", 5, "máj. 2.", "Liniște, aer curat, gazde minunate. Exact ce ne trebuia după o perioadă aglomerată.", "Mulțumim din suflet, Simona! Ne bucurăm că v-ați reîncărcat bateriile la noi. Reveniți oricând!"),
  R("Google", "Weber Klaus", 5, "júl. 5.", "Hervorragender Ausgangspunkt für die Harghita-Wanderwege. Sehr hilfsbereit bei der Tourenplanung.", "Vielen Dank, Klaus! Es war uns eine Freude, bei der Tourenplanung zu helfen. Gute Wanderungen noch!"),
  R("Booking", "Novák Petra", 3, "ápr. 12.", "Szép hely, de az érkezésünkkor még takarították a szobát, várni kellett fél órát.", "Kedves Petra, köszönjük az őszinte visszajelzést, és elnézést a várakozásért! Azóta új takarítási beosztást vezettünk be, hogy ez ne fordulhasson elő. Reméljük, adnak még egy esélyt!"),
  R("Google", "Stan Ioana", 5, "ápr. 8.", "Camerele sunt impecabile, iar dulceața de casă de la micul dejun e memorabilă.", "Mulțumim, Ioana! Dulceața e rețeta bunicii — îi transmitem laudele! Vă așteptăm cu drag în august!"),
  R("Tripadvisor", "Dubois Claire", 5, "márc. 30.", "Un séjour magnifique. Accueil chaleureux, guide numérique très pratique, région superbe.", "Merci beaucoup, Claire ! Nous sommes ravis que le guide numérique vous ait été utile. À très bientôt !"),
  R("Facebook", "Fekete László", 4, "márc. 22.", "Nagyon jó hely, egyedül a szauna időbeosztása lehetne rugalmasabb hétvégén.", "Kedves László, köszönjük a jelzést! Hétvégére mostantól előfoglalható idősávokat vezettünk be. Várjuk vissza júliusban!"),
  R("Google", "Rossi Marco", 5, "márc. 15.", "Wonderful hospitality, beautiful nature, excellent homemade food. Highly recommended!", "Grazie mille, Marco! It was a pleasure hosting you. We can't wait to welcome you back in July!"),
];

const CONVERSATIONS = [
  {
    t: "Facebook poszt írása",
    when: "ma, 9:14",
    msgs: [
      ["u", "Írj egy Facebook posztot a szabad júliusi hétvégéinkről, említsd a szaunát és a reggelit."],
      ["a", "🌲 Még van néhány szabad hétvégénk júliusban! Erdőre néző szobák, esti szaunázás, reggel pedig házi lekváros, termelői reggeli vár. Foglald le a nyár legnyugodtabb hétvégéjét! 📅 Írj üzenetet vagy hívj minket. #hegyivendégház #hétvégikiruccanás #hargita"],
    ],
  },
  {
    t: "Húsvéti ajánlat",
    when: "tegnap",
    msgs: [
      ["u", "Készíts húsvéti csomagajánlatot 3 éjszakára, családoknak."],
      ["a", "🐣 Húsvét a Borókában — 3 éjszaka családi szobában, ünnepi reggelikkel, tojáskereséssel az erdőszélen és kézműves foglalkozással a gyerekeknek. Ár: 340 €/család. A csomag tartalmazza a szaunahasználatot és a kései kijelentkezést hétfőn."],
    ],
  },
  {
    t: "Booking véleményre válasz",
    when: "2 napja",
    msgs: [
      ["u", "Válaszolj erre a Booking véleményre: \"Szép hely, de várni kellett a szobára érkezéskor.\""],
      ["a", "Kedves Vendégünk! Köszönjük az őszinte visszajelzést, és elnézést kérünk a várakozásért. Azóta átszerveztük a takarítási beosztást, hogy minden szoba időben készen álljon. Reméljük, hamarosan újra vendégül láthatjuk — a következő látogatásra egy üveg házi szörppel készülünk!"],
    ],
  },
  {
    t: "Házirend fordítása németre",
    when: "3 napja",
    msgs: [
      ["u", "Fordítsd le a házirendet németre."],
      ["a", "Hausordnung: Ruhezeiten: 22:00–8:00 Uhr · Rauchen ist nur auf der Terrasse gestattet · Haustiere nach vorheriger Absprache willkommen · Die Sauna kann bis 21:00 Uhr genutzt werden. Wir wünschen Ihnen einen erholsamen Aufenthalt!"],
    ],
  },
  {
    t: "Üdvözlő e-mail",
    when: "múlt héten",
    msgs: [
      ["u", "Írj üdvözlő e-mailt a holnap érkező Müller családnak, németül."],
      ["a", "Liebe Familie Müller, wir freuen uns sehr auf Ihre Ankunft morgen! Check-in ist ab 15:00 Uhr, kostenlose Parkplätze finden Sie direkt im Hof. Das vegetarische Frühstück ist bereits notiert. WLAN: Boroka_Guest / boroka2026. Bei Fragen erreichen Sie uns unter +40 745 123 456. Bis morgen! Familie Boróka"],
    ],
  },
  {
    t: "Hétvégi promóció ötlet",
    when: "múlt héten",
    msgs: [
      ["u", "Javasolj egy hétvégi promóciót az alacsonyabb szeptemberi foglaltságra."],
      ["a", "Javaslat: „Szeptemberi erdőillat” — vasárnap–csütörtök között 2 éjszaka áráért 3, ingyenes szaunával és túracsomaggal (térkép + házi elemózsia). Célcsoport: nyugdíjas párok és home office-ból dolgozók. Hirdetés: Facebook + Google Business, e-mail a korábbi vendégeknek."],
    ],
  },
];

const CAMPAIGNS = [
  { t: "Hétvégi ajánlat — július", ch: "Facebook", s: "Aktív", reach: "4 820 elérés", clicks: "212 kattintás", txt: "Még van néhány szabad hétvégénk júliusban! Erdőre néző szobák, esti szaunázás…" },
  { t: "Nyári családi csomag", ch: "Facebook + Instagram", s: "Aktív", reach: "7 140 elérés", clicks: "348 kattintás", txt: "5 éjszaka, gyerekprogramokkal, tojáskereséssel és kézműves délutánokkal…" },
  { t: "Last minute — e heti szabad szobák", ch: "Instagram", s: "Aktív", reach: "1 960 elérés", clicks: "96 kattintás", txt: "Spontán kiruccanás? A 101-es erkélyes szobánk még szabad a hétvégére…" },
  { t: "Romantikus csomag", ch: "Instagram", s: "Tervezett", reach: "—", clicks: "—", txt: "Kandallós deluxe szoba, pezsgő érkezéskor, privát szauna-idősáv…" },
  { t: "Őszi „Szeptemberi erdőillat”", ch: "Facebook + e-mail", s: "Tervezett", reach: "—", clicks: "—", txt: "2 éjszaka áráért 3, ingyenes túracsomaggal — hétköznapi pihenés…" },
  { t: "Karácsonyi csomag", ch: "Facebook + Google Business", s: "Tervezett", reach: "—", clicks: "—", txt: "3 ünnepi éjszaka, karácsonyi vacsora, forralt bor a tűz mellett…" },
  { t: "Húsvéti promóció", ch: "Facebook", s: "Lezárult", reach: "6 480 elérés", clicks: "301 kattintás", txt: "Húsvét a Borókában — tojáskeresés, ünnepi reggeli, családi szobák… (8 foglalás)" },
  { t: "Instagram fotósorozat — „Reggelik”", ch: "Instagram", s: "Aktív", reach: "3 220 elérés", clicks: "154 kattintás", txt: "Heti posztsorozat a házi reggelikről — lekvárfőzés, friss kenyér, termelői sajtok…" },
  { t: "Google Business — tavaszi", ch: "Google Business", s: "Lezárult", reach: "2 890 megjelenés", clicks: "187 kattintás", txt: "Tavaszi túraszezon-nyitó ajánlat a Hargita lábánál… (5 foglalás)" },
];

const OCCUPANCY = [
  { m: "aug.", v: 84 }, { m: "szept.", v: 58 }, { m: "okt.", v: 62 }, { m: "nov.", v: 41 },
  { m: "dec.", v: 77 }, { m: "jan.", v: 52 }, { m: "febr.", v: 55 }, { m: "márc.", v: 60 },
  { m: "ápr.", v: 68 }, { m: "máj.", v: 71 }, { m: "jún.", v: 82 }, { m: "júl.", v: 78 },
];
const NATIONS = [
  { n: "Magyar", v: 46 }, { n: "Román", v: 31 }, { n: "Német", v: 9 },
  { n: "Brit", v: 6 }, { n: "Egyéb", v: 8 },
];
const TOP_PAGES = [
  { n: "WiFi", v: 412 }, { n: "Reggeli", v: 358 }, { n: "Túraútvonalak", v: 289 },
  { n: "Éttermek", v: 245 }, { n: "Házirend", v: 198 }, { n: "Vízesések", v: 176 },
];
const SCORE_TREND = [
  { m: "febr.", v: 4.6 }, { m: "márc.", v: 4.7 }, { m: "ápr.", v: 4.7 },
  { m: "máj.", v: 4.8 }, { m: "jún.", v: 4.85 }, { m: "júl.", v: 4.9 },
];
const MKT_PERF = [
  { n: "Hétvégi", v: 212 }, { n: "Családi", v: 348 }, { n: "Last min.", v: 96 },
  { n: "Húsvéti", v: 301 }, { n: "Reggelik", v: 154 }, { n: "Google", v: 187 },
];

const GUIDE = {
  restaurants: [
    { n: "Fenyő Étterem", d: "Erdélyi konyha, kürtőskalács, helyi pisztráng — 5 perc autóval.", i: UtensilsCrossed },
    { n: "Régi Malom Vendéglő", d: "Házias ételek egy felújított vízimalomban — 12 perc.", i: UtensilsCrossed },
    { n: "Pásztortűz Csárda", d: "Bográcsos ételek, élő népzene péntekenként — 8 perc.", i: Flame },
  ],
  coffee: [
    { n: "Boróka Kávézó & Cukrászda", d: "Kézműves kávé és házi sütemények a főtéren — 10 perc.", i: Coffee },
    { n: "Havas Presszó", d: "Specialty kávé, laptopbarát sarok — 11 perc.", i: Coffee },
  ],
  nature: [
    { n: "Fátyol-vízesés", d: "Könnyű, 40 perces séta a jelzett ösvényen — családokkal is járható.", i: Waves },
    { n: "Madarasi Hargita csúcstúra", d: "Közepes nehézségű, 4–5 órás túra, panorámával — térkép a recepción.", i: Mountain },
    { n: "Szent Anna-tó", d: "Európa egyetlen épen maradt krátertava — 50 perc autóval.", i: Waves },
  ],
  culture: [
    { n: "Mikó-vár", d: "Reneszánsz várkastély és múzeum a városközpontban — 15 perc.", i: Landmark },
    { n: "Falumúzeum", d: "Székely népi építészet és kézművesség — 20 perc.", i: Camera },
  ],
  events: [
    { n: "Termelői piac", d: "Minden szombaton 8–13 óráig a főtéren.", i: Music },
    { n: "Ezer Székely Leány Napja", d: "Július első szombatja — népviselet, tánc, kirakodóvásár.", i: Music },
  ],
};

/* ───────────── közös komponensek ───────────── */

function Card({ children, className = "", style = {} }) {
  return (
    <div className={`rounded-2xl bg-white ${className}`}
      style={{ border: `1px solid ${T.line}`, boxShadow: "0 1px 2px rgba(20,20,20,0.04)", ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div className="mb-6">
      {eyebrow && <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: T.accent }}>{eyebrow}</div>}
      <h1 className="text-2xl font-semibold tracking-tight" style={{ color: T.ink }}>{title}</h1>
      {desc && <p className="mt-1 text-sm" style={{ color: T.muted }}>{desc}</p>}
    </div>
  );
}

function Badge({ s }) {
  const c = STATUS_COLOR[s] || { bg: "#F0F0EE", fg: T.muted };
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ background: c.bg, color: c.fg }}>{s}</span>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick} className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
      style={{ background: active ? T.ink : "#fff", color: active ? "#fff" : T.muted, border: `1px solid ${active ? T.ink : T.line}` }}>
      {children}
    </button>
  );
}

function PrimaryBtn({ onClick, disabled, children, loading }) {
  return (
    <button onClick={onClick} disabled={disabled || loading}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
      style={{ background: T.accent, boxShadow: "0 1px 2px rgba(37,107,72,0.3)" }}>
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
      {children}
    </button>
  );
}

function OutputBox({ text, onRegenerate, loading }) {
  const [copied, setCopied] = useState(false);
  if (!text && !loading) return null;
  return (
    <Card className="mt-4 p-5">
      {loading ? (
        <div className="flex items-center gap-3 text-sm" style={{ color: T.muted }}>
          <Loader2 size={16} className="animate-spin" style={{ color: T.accent }} /> A Claude éppen írja a választ…
        </div>
      ) : (
        <>
          <div className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: T.ink }}>{text}</div>
          <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: `1px solid ${T.line}` }}>
            <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ border: `1px solid ${T.line}`, color: T.ink }}>
              {copied ? <Check size={13} style={{ color: T.accent }} /> : <Copy size={13} />}
              {copied ? "Kimásolva" : "Másolás"}
            </button>
            {onRegenerate && (
              <button onClick={onRegenerate} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ border: `1px solid ${T.line}`, color: T.ink }}>
                <RefreshCw size={13} /> Újragenerálás
              </button>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

function Stars({ n, size = 13 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} fill={i <= n ? T.amber : "none"} style={{ color: i <= n ? T.amber : "#D8D8D4" }} />
      ))}
    </div>
  );
}

/* ───────────── Vezérlőpult ───────────── */

function Dashboard({ go }) {
  const kpis = [
    { label: "Mai érkezések", value: "3", sub: "Nagy E. · Müller H. · Tóth G.", icon: CalendarDays },
    { label: "Mai távozások", value: "2", sub: "Ionescu M. · Smith O.", icon: ArrowRight },
    { label: "Aktuális kihasználtság", value: "78%", sub: "6/8 szoba foglalt", icon: BedDouble },
    { label: "Átlagos értékelés", value: "4.9", sub: "25 friss vélemény alapján", icon: Star },
  ];
  const kpis2 = [
    { label: "QR-útmutató megnyitás (hó)", value: "482", icon: QrCode },
    { label: "Kiküldött vélemény-kérés", value: "61", icon: MessageSquareQuote },
    { label: "Elkészült Facebook poszt", value: "12", icon: Megaphone },
    { label: "AI-válasz generálva", value: "45", icon: Sparkles },
  ];
  const feed = [
    ["Ionescu Maria kijelentkezett a 108-as szobából", "18 perce", ArrowRight],
    ["Új 5★ Google-vélemény érkezett Farkas Ildikótól", "42 perce", Star],
    ["QR-útmutató megnyitva — 106-os szoba (DE)", "1 órája", QrCode],
    ["Facebook poszt generálva: „Hétvégi ajánlat — július”", "ma 9:14", Megaphone],
    ["Vendégkérdés: „Hol tudunk parkolni?” — AI-válasz elküldve", "ma 8:51", Sparkles],
    ["Hétvégi ajánlat kampány elindítva", "tegnap", Megaphone],
    ["Weber Klaus túratérképet kért — jegyzet rögzítve", "tegnap", Mountain],
    ["Vélemény-emlékeztető kiküldve 4 távozott vendégnek", "2 napja", Mail],
  ];
  return (
    <div>
      <SectionTitle eyebrow="Vezérlőpult" title="Jó reggelt, Boróka Vendégház! 🌲" desc="Hétfő, július 6. — így indul a heted." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: T.muted }}>{s.label}</span>
              <s.icon size={16} style={{ color: T.accent }} />
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight" style={{ color: T.ink }}>{s.value}</div>
            <div className="mt-1 text-xs truncate" style={{ color: T.muted }}>{s.sub}</div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {kpis2.map((s) => (
          <Card key={s.label} className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: T.accentSoft }}>
              <s.icon size={16} style={{ color: T.accent }} />
            </div>
            <div>
              <div className="text-xl font-semibold tracking-tight" style={{ color: T.ink }}>{s.value}</div>
              <div className="text-[11px]" style={{ color: T.muted }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold" style={{ color: T.ink }}>Kihasználtság az elmúlt 12 hónapban</div>
              <div className="text-xs" style={{ color: T.muted }}>Éves átlag: 66% · csúcs: augusztus (84%)</div>
            </div>
            <TrendingUp size={16} style={{ color: T.accent }} />
          </div>
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={OCCUPANCY} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.accent} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${T.line}`, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke={T.accent} strokeWidth={2} fill="url(#g1)" name="Kihasználtság %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold mb-3" style={{ color: T.ink }}>Mai teendők</div>
          {[
            ["103-as szoba takarítása Tóth G. érkezése előtt", "14:00-ig"],
            ["Müller család: vegetáriánus reggeli előkészítése", "holnap reggel"],
            ["Nagy Eszter kutyás csomag kikészítése (101)", "délután"],
            ["Vélemény-válasz: Brown Emily (Airbnb)", "kész ✓"],
          ].map(([t, w]) => (
            <div key={t} className="flex items-start justify-between gap-2 py-2.5 text-sm" style={{ borderBottom: `1px solid ${T.line}` }}>
              <span style={{ color: T.ink }}>{t}</span>
              <span className="text-xs whitespace-nowrap" style={{ color: T.muted }}>{w}</span>
            </div>
          ))}
          <div className="mt-4 text-xs flex items-start gap-2 rounded-xl p-3" style={{ background: T.accentSoft, color: T.accentDark }}>
            <Sparkles size={14} className="mt-0.5 shrink-0" />
            AI-javaslat: szeptemberre 58% a foglaltság — érdemes most elindítani a „Szeptemberi erdőillat” kampányt.
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold" style={{ color: T.ink }}>Legutóbbi aktivitás</div>
            <span className="text-xs" style={{ color: T.muted }}>élő</span>
          </div>
          {feed.map(([t, w, I]) => (
            <div key={t} className="flex items-center gap-3 py-2.5" style={{ borderBottom: `1px solid ${T.line}` }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: T.accentSoft }}>
                <I size={13} style={{ color: T.accent }} />
              </div>
              <div className="flex-1 text-sm" style={{ color: T.ink }}>{t}</div>
              <div className="text-xs whitespace-nowrap" style={{ color: T.muted }}>{w}</div>
            </div>
          ))}
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold mb-4" style={{ color: T.ink }}>Legnézettebb útmutató-oldalak (e hónap)</div>
          {TOP_PAGES.map((a) => (
            <div key={a.n} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: T.ink }}>{a.n}</span>
                <span style={{ color: T.muted }}>{a.v} megnyitás</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: T.line }}>
                <div className="h-1.5 rounded-full" style={{ width: `${(a.v / 412) * 100}%`, background: T.accent }} />
              </div>
            </div>
          ))}
          <button onClick={() => go("analytics")} className="mt-2 text-xs font-medium inline-flex items-center gap-1" style={{ color: T.accent }}>
            Teljes analitika <ChevronRight size={13} />
          </button>
        </Card>
      </div>
    </div>
  );
}

/* ───────────── Szobák ───────────── */

function Rooms() {
  return (
    <div>
      <SectionTitle eyebrow="Szobák" title="8 szoba · 6 foglalt · 1 takarítás alatt"
        desc="Aktuális állapot, árak és felszereltség — kattints egy szobára a részletekért." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ROOMS.map((r) => (
          <Card key={r.no} className="overflow-hidden">
            <Photo label={`${r.no} · ${r.type}`} icon={r.icon} h={r.h} height={110} />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold" style={{ color: T.ink }}>{r.no} — {r.type}</div>
                <Badge s={r.status} />
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs" style={{ color: T.muted }}>
                <span className="inline-flex items-center gap-1"><Users size={12} /> {r.cap}</span>
                <span className="font-semibold" style={{ color: T.ink }}>€{r.price}<span className="font-normal" style={{ color: T.muted }}>/éj</span></span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.amen.map((a) => (
                  <span key={a} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: "#F3F3F1", color: T.muted }}>{a}</span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ───────────── Vendégek ───────────── */

function Guests() {
  const [f, setF] = useState("Mind");
  const [q, setQ] = useState("");
  const filters = ["Mind", "Bejelentkezve", "Érkezik ma", "Távozik ma", "Foglalva", "Kijelentkezve"];
  const list = GUESTS.filter((g) => (f === "Mind" || g.s === f) && g.n.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <SectionTitle eyebrow="Vendégek" title={`${GUESTS.length} vendég a rendszerben`}
        desc="Jelenlegi vendégek, korábbi tartózkodások és jövőbeli foglalások." />
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white" style={{ border: `1px solid ${T.line}` }}>
          <Search size={14} style={{ color: T.muted }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Keresés név szerint…"
            className="text-sm outline-none bg-transparent w-40" style={{ color: T.ink }} />
        </div>
        {filters.map((x) => <Chip key={x} active={f === x} onClick={() => setF(x)}>{x}</Chip>)}
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: 900 }}>
          <thead>
            <tr className="text-left text-xs" style={{ color: T.muted, borderBottom: `1px solid ${T.line}` }}>
              {["Vendég", "Ország / nyelv", "Tartózkodás", "Szoba", "Fő", "Státusz", "Elérhetőség", "Megjegyzés"].map((h) => (
                <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((g) => (
              <tr key={g.n + g.a} style={{ borderBottom: `1px solid ${T.line}` }}>
                <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: T.ink }}>{g.n}</td>
                <td className="px-4 py-3 whitespace-nowrap" style={{ color: T.muted }}>{g.c} · {g.l}</td>
                <td className="px-4 py-3 whitespace-nowrap" style={{ color: T.ink }}>{g.a} → {g.d}</td>
                <td className="px-4 py-3" style={{ color: T.ink }}>{g.r}</td>
                <td className="px-4 py-3 whitespace-nowrap" style={{ color: T.muted }}>
                  {g.ad}F{g.ch ? ` + ${g.ch}Gy` : ""}{g.pet ? " 🐾" : ""}
                </td>
                <td className="px-4 py-3"><Badge s={g.s} /></td>
                <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: T.muted }}>{g.ph}<br />{g.e}</td>
                <td className="px-4 py-3 text-xs" style={{ color: T.muted, maxWidth: 220 }}>{g.note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <div className="p-8 text-center text-sm" style={{ color: T.muted }}>Nincs találat — módosítsd a keresést vagy a szűrőt.</div>
        )}
      </Card>
    </div>
  );
}

/* ───────────── Vendégútmutató + telefon-előnézet ───────────── */

function GSection({ icon: I, title, children }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: "#fff", border: "1px solid #EDE9E1" }}>
      <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide" style={{ color: T.accent }}>
        <I size={13} /> {title}
      </div>
      <div className="mt-2 text-[13px] leading-relaxed" style={{ color: T.ink }}>{children}</div>
    </div>
  );
}

function PhonePreview({ p }) {
  return (
    <div className="mx-auto rounded-[2.4rem] p-2.5 shrink-0"
      style={{ width: 300, background: "#17181A", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
      <div className="rounded-[2rem] overflow-hidden" style={{ background: "#FDFBF7", height: 620, overflowY: "auto" }}>
        <div className="h-40 flex flex-col items-center justify-center text-center px-6 relative"
          style={{ background: "linear-gradient(160deg, #1d5238, #2F6B4F)" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 15%, rgba(255,255,255,0.18), transparent 50%)" }} />
          <div className="text-white text-xl relative" style={{ fontFamily: "Georgia, serif" }}>{p.name}</div>
          <div className="text-xs mt-1 relative" style={{ color: "rgba(255,255,255,0.75)" }}>{p.tagline}</div>
          <div className="mt-2 relative inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
            <CloudSun size={11} /> Ma: 18 °C, napos · este zápor lehet
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {["Erdei terasz", "Reggelizőnk", "Szaunánk"].map((l, i) => <Photo key={l} label={l} h={i} height={64} />)}
          </div>
          <GSection icon={Wifi} title="WIFI">Hálózat: <b>{p.wifiName}</b><br />Jelszó: <b>{p.wifiPass}</b></GSection>
          <GSection icon={Coffee} title="REGGELI">{p.breakfast}</GSection>
          <GSection icon={Clock} title="BE- ÉS KIJELENTKEZÉS">Bejelentkezés: {p.checkin} · Kijelentkezés: {p.checkout}</GSection>
          <GSection icon={Car} title="PARKOLÁS">{p.parking}</GSection>
          <GSection icon={BookOpen} title="HÁZIREND"><span className="whitespace-pre-wrap">{p.rules}</span></GSection>
          <GSection icon={UtensilsCrossed} title="ÉTTERMEK A KÖZELBEN">
            {GUIDE.restaurants.map((x) => <div key={x.n} className="mb-1.5"><b>{x.n}</b> — {x.d}</div>)}
          </GSection>
          <GSection icon={Coffee} title="KÁVÉZÓK">
            {GUIDE.coffee.map((x) => <div key={x.n} className="mb-1.5"><b>{x.n}</b> — {x.d}</div>)}
          </GSection>
          <GSection icon={Mountain} title="TÚRÁK ÉS VÍZESÉSEK">
            {GUIDE.nature.map((x) => <div key={x.n} className="mb-1.5"><b>{x.n}</b> — {x.d}</div>)}
          </GSection>
          <GSection icon={Landmark} title="MÚZEUMOK">
            {GUIDE.culture.map((x) => <div key={x.n} className="mb-1.5"><b>{x.n}</b> — {x.d}</div>)}
          </GSection>
          <GSection icon={Music} title="ESEMÉNYEK">
            {GUIDE.events.map((x) => <div key={x.n} className="mb-1.5"><b>{x.n}</b> — {x.d}</div>)}
          </GSection>
          <GSection icon={ShieldAlert} title="HASZNOS SZÁMOK">
            Sürgősségi: <b>112</b><br />Recepció: {p.phone}<br />Taxi: {p.taxi}<br />Ügyeletes gyógyszertár: +40 266 111 222
          </GSection>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #EDE9E1" }}>
            <div className="h-24 flex items-center justify-center gap-2 text-xs font-medium"
              style={{ background: "linear-gradient(145deg, #DEE8E1, #C9D8CD)", color: T.accentDark }}>
              <MapPin size={14} /> Térkép megnyitása
            </div>
          </div>
          <div className="text-center text-[10px] py-3" style={{ color: "#B8B3A8" }}>Készült a PensiuneKit-tel</div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, textarea }) {
  return (
    <label className="block">
      <span className="text-xs font-medium" style={{ color: T.muted }}>{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
          className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none"
          style={{ border: `1px solid ${T.line}`, color: T.ink, background: "#fff" }} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none"
          style={{ border: `1px solid ${T.line}`, color: T.ink, background: "#fff" }} />
      )}
    </label>
  );
}

function GuideEditor({ p, setP, onSave }) {
  const set = (k) => (v) => setP({ ...p, [k]: v });
  const [saveMsg, setSaveMsg] = useState(null);
  const [saving, setSaving] = useState(false);
  const doSave = async () => {
    if (!onSave) return;
    setSaving(true);
    const r = await onSave();
    setSaveMsg(r);
    setSaving(false);
    setTimeout(() => setSaveMsg(null), 4000);
  };
  return (
    <div>
      <SectionTitle eyebrow="Digitális vendégútmutató" title="Szerkesztés élő előnézettel"
        desc="Minden módosítás azonnal megjelenik a vendégek által látott mobiloldalon — 482 megnyitás e hónapban." />
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Card className="p-5 flex-1 w-full space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Szállás neve" value={p.name} onChange={set("name")} />
            <Field label="Szlogen" value={p.tagline} onChange={set("tagline")} />
            <Field label="WiFi hálózat" value={p.wifiName} onChange={set("wifiName")} />
            <Field label="WiFi jelszó" value={p.wifiPass} onChange={set("wifiPass")} />
            <Field label="Bejelentkezés" value={p.checkin} onChange={set("checkin")} />
            <Field label="Kijelentkezés" value={p.checkout} onChange={set("checkout")} />
            <Field label="Recepció telefonszáma" value={p.phone} onChange={set("phone")} />
            <Field label="Taxi" value={p.taxi} onChange={set("taxi")} />
          </div>
          <Field label="Reggeli" value={p.breakfast} onChange={set("breakfast")} textarea />
          <Field label="Parkolás" value={p.parking} onChange={set("parking")} textarea />
          <Field label="Házirend" value={p.rules} onChange={set("rules")} textarea />
          <div className="rounded-xl p-3" style={{ background: "#FAFAF8", border: `1px solid ${T.line}` }}>
            <div className="text-xs font-medium mb-2" style={{ color: T.muted }}>Ajánlások az útmutatóban (12 hely, 5 kategória)</div>
            <div className="flex flex-wrap gap-1.5">
              {["Éttermek · 3", "Kávézók · 2", "Túrák és vízesések · 3", "Múzeumok · 2", "Események · 2"].map((x) => (
                <span key={x} className="px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ background: T.accentSoft, color: T.accentDark }}>{x}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs rounded-xl p-3" style={{ background: T.accentSoft, color: T.accentDark }}>
            <Globe size={14} />
            Nyilvános link: pensiunekit.app/boroka — elérhető 7 nyelven, QR-kódról is.
          </div>
          {onSave && (
            <div className="flex items-center gap-3">
              <button onClick={doSave} disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: T.accent }}>
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                Módosítások mentése
              </button>
              {saveMsg && (
                <span className="text-xs font-medium" style={{ color: saveMsg.ok ? T.accentDark : "#8A2E22" }}>
                  {saveMsg.text}
                </span>
              )}
            </div>
          )}
        </Card>
        <PhonePreview p={p} />
      </div>
    </div>
  );
}

/* ───────────── AI Asszisztens (előzményekkel) ───────────── */

const LANGS = ["Magyar", "Román", "Angol", "Német", "Francia", "Olasz", "Spanyol"];

function AiAssistant({ p }) {
  const [sel, setSel] = useState(0);
  const [live, setLive] = useState(null); // {q, a, loading}
  const [q, setQ] = useState("");

  const run = async () => {
    if (!q.trim()) return;
    setSel(-1);
    setLive({ q, a: "", loading: true });
    try {
      const text = await askClaude(
        `Te a(z) "${p.name}" nevű hegyi vendégház AI-asszisztense vagy (8 szoba, Hargita megye, házi reggeli, szauna). ` +
        `Adatok: bejelentkezés ${p.checkin}, kijelentkezés ${p.checkout}, reggeli: ${p.breakfast}, parkolás: ${p.parking}, házirend: ${p.rules}. ` +
        `Segíts a tulajdonosnak: írj posztot, választ, fordítást vagy ötletet a kérése szerint, tömören, magyarul (kivéve ha más nyelvet kér). Kérés: "${q}"`
      );
      setLive({ q, a: text || "Nem érkezett válasz — próbáld újra.", loading: false });
    } catch {
      setLive({ q, a: "Hiba történt a kérés során. Próbáld újra.", loading: false });
    }
  };

  const conv = sel >= 0 ? CONVERSATIONS[sel] : null;
  const msgs = conv ? conv.msgs : live ? [["u", live.q], ...(live.loading ? [] : [["a", live.a]])] : [];

  return (
    <div>
      <SectionTitle eyebrow="AI Asszisztens" title="A vendégház mindenes segédje"
        desc="Posztok, válaszok, fordítások, ötletek — az előzményekből visszakereshető minden. Az új kérdések élőben a Claude API-t hívják." />
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <Card className="w-full md:w-64 shrink-0 p-2">
          <div className="text-[11px] font-semibold px-2 py-1.5 tracking-wide uppercase" style={{ color: T.muted }}>Korábbi beszélgetések</div>
          {CONVERSATIONS.map((c, i) => (
            <button key={c.t} onClick={() => { setSel(i); setLive(null); }}
              className="w-full text-left px-3 py-2.5 rounded-xl transition-all"
              style={{ background: sel === i ? T.accentSoft : "transparent" }}>
              <div className="text-sm font-medium truncate" style={{ color: sel === i ? T.accentDark : T.ink }}>{c.t}</div>
              <div className="text-[11px]" style={{ color: T.muted }}>{c.when}</div>
            </button>
          ))}
        </Card>
        <div className="flex-1 w-full min-w-0">
          <Card className="p-5" style={{ minHeight: 340 }}>
            {msgs.length === 0 && (
              <div className="text-sm py-16 text-center" style={{ color: T.muted }}>Írj egy új kérést lent, vagy válassz egy korábbi beszélgetést.</div>
            )}
            <div className="space-y-4">
              {msgs.map(([role, text], i) => (
                <div key={i} className={`flex ${role === "u" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
                    style={role === "u"
                      ? { background: T.ink, color: "#fff", borderBottomRightRadius: 6 }
                      : { background: "#F3F5F2", color: T.ink, borderBottomLeftRadius: 6 }}>
                    {role === "a" && (
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold mb-1.5" style={{ color: T.accent }}>
                        <Sparkles size={12} /> PensiuneKit AI
                      </div>
                    )}
                    {text}
                  </div>
                </div>
              ))}
              {live && live.loading && (
                <div className="flex items-center gap-2 text-sm" style={{ color: T.muted }}>
                  <Loader2 size={15} className="animate-spin" style={{ color: T.accent }} /> Írás folyamatban…
                </div>
              )}
            </div>
          </Card>
          <div className="mt-3 flex gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder="Pl.: Írj Instagram posztot a szaunáról…"
              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none bg-white"
              style={{ border: `1px solid ${T.line}`, color: T.ink }} />
            <button onClick={run} className="px-4 rounded-xl text-white flex items-center" style={{ background: T.accent }}>
              <Send size={16} />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["Írj Facebook posztot", "Készíts hétvégi ajánlatot", "Fordítsd le a házirendet angolra", "Írj üdvözlő e-mailt"].map((s) => (
              <button key={s} onClick={() => setQ(s)} className="px-2.5 py-1 rounded-full text-[11px]"
                style={{ border: `1px solid ${T.line}`, color: T.muted, background: "#fff" }}>{s}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Vélemények ───────────── */

const PF_COLOR = { Google: "#4285F4", Booking: "#003580", Airbnb: "#FF5A5F", Facebook: "#1877F2", Tripadvisor: "#34E0A1" };

function Reviews({ p }) {
  const [f, setF] = useState("Mind");
  const [review, setReview] = useState("");
  const [tone, setTone] = useState("Barátságos");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const list = REVIEWS.filter((r) => f === "Mind" || r.pf === f);
  const avg = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

  const run = async () => {
    setLoading(true); setOut("");
    try {
      const text = await askClaude(
        `Te a(z) "${p.name}" hegyi vendégház tulajdonosa vagy. Írj választ erre a véleményre ${tone.toLowerCase()} hangnemben, a vélemény nyelvén, max 5 mondatban, idézőjelek nélkül: "${review}"`
      );
      setOut(text || "Nem érkezett válasz — próbáld újra.");
    } catch { setOut("Hiba történt a kérés során. Próbáld újra."); }
    setLoading(false);
  };

  return (
    <div>
      <SectionTitle eyebrow="Vélemények" title={`${REVIEWS.length} vélemény · ${avg} átlag`}
        desc="Minden platformról egy helyen, AI-válaszokkal. Az újakra egy kattintással válaszolhatsz." />
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {["Mind", "Google", "Booking", "Airbnb", "Facebook", "Tripadvisor"].map((x) => (
          <Chip key={x} active={f === x} onClick={() => setF(x)}>{x}</Chip>
        ))}
        <button onClick={() => setOpen(!open)}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
          style={{ background: T.accentSoft, color: T.accentDark }}>
          <Sparkles size={14} /> Új válasz generálása
        </button>
      </div>

      {open && (
        <Card className="p-5 mb-4">
          <textarea value={review} onChange={(e) => setReview(e.target.value)} rows={3}
            placeholder="Illeszd be ide az új véleményt…"
            className="w-full rounded-xl px-3 py-2 text-sm outline-none"
            style={{ border: `1px solid ${T.line}`, color: T.ink }} />
          <div className="flex flex-wrap gap-2 mt-3">
            {["Professzionális", "Barátságos", "Luxus", "Vicces", "Családias", "Hivatalos"].map((x) => (
              <Chip key={x} active={tone === x} onClick={() => setTone(x)}>{x}</Chip>
            ))}
          </div>
          <div className="mt-4"><PrimaryBtn onClick={run} loading={loading} disabled={!review.trim()}>Válasz generálása</PrimaryBtn></div>
          <OutputBox text={out} loading={loading} onRegenerate={run} />
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {list.map((r, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                  style={{ background: PF_COLOR[r.pf] }}>
                  {r.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: T.ink }}>{r.name}</div>
                  <div className="text-[11px]" style={{ color: T.muted }}>{r.pf} · {r.date}</div>
                </div>
              </div>
              <Stars n={r.rating} />
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: T.ink }}>{r.text}</p>
            <div className="mt-3 rounded-xl p-3" style={{ background: T.accentSoft }}>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold mb-1" style={{ color: T.accentDark }}>
                <Sparkles size={12} /> AI-válasz — közzétéve
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: T.accentDark }}>{r.reply}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ───────────── Üzenetsablonok ───────────── */

const TEMPLATES = [
  "Foglalás visszaigazolása", "Érkezési útmutató", "WiFi üdvözlő", "Bejelentkezési emlékeztető",
  "Kijelentkezési emlékeztető", "Köszönő üzenet", "Vélemény kérése", "Kedvezmény a következő látogatásra",
];

function Templates({ p }) {
  const [tpl, setTpl] = useState(TEMPLATES[0]);
  const [lang, setLang] = useState("Magyar");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true); setOut("");
    try {
      const text = await askClaude(
        `Írj rövid, meleg hangvételű "${tpl}" üzenetet a(z) "${p.name}" hegyi vendégház vendégének, ${lang} nyelven. ` +
        `Adatok: bejelentkezés ${p.checkin}, kijelentkezés ${p.checkout}, WiFi: ${p.wifiName} / ${p.wifiPass}, reggeli: ${p.breakfast}, parkolás: ${p.parking}. Max 6 mondat, emoji legfeljebb 1. Csak az üzenetet írd le.`
      );
      setOut(text || "Nem érkezett válasz — próbáld újra.");
    } catch { setOut("Hiba történt a kérés során. Próbáld újra."); }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <SectionTitle eyebrow="Üzenetgenerátor" title="Kész vendégüzenetek egy kattintással"
        desc="Sablon + nyelv kiválasztása, a többit az AI intézi a szállásod adataiból. Eddig 45 üzenet készült." />
      <Card className="p-5">
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((x) => (
            <button key={x} onClick={() => setTpl(x)}
              className="text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                border: `1px solid ${tpl === x ? T.accent : T.line}`,
                background: tpl === x ? T.accentSoft : "#fff",
                color: tpl === x ? T.accentDark : T.ink,
              }}>{x}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Languages size={15} style={{ color: T.muted }} />
          {LANGS.map((l) => <Chip key={l} active={lang === l} onClick={() => setLang(l)}>{l}</Chip>)}
        </div>
        <div className="mt-5"><PrimaryBtn onClick={run} loading={loading}>Üzenet generálása</PrimaryBtn></div>
      </Card>
      <OutputBox text={out} loading={loading} onRegenerate={run} />
    </div>
  );
}

/* ───────────── Marketing Studio ───────────── */

function Marketing({ p }) {
  const [kind, setKind] = useState("Facebook poszt");
  const [topic, setTopic] = useState("Szeptemberi hétköznapi ajánlat: 2 éjszaka áráért 3, túracsomaggal");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  const S_COLOR = { "Aktív": { bg: T.accentSoft, fg: T.accentDark }, "Tervezett": { bg: "#F1ECF9", fg: "#5B3E8F" }, "Lezárult": { bg: "#F0F0EE", fg: T.muted } };

  const run = async () => {
    setLoading(true); setOut("");
    try {
      const text = await askClaude(
        `Írj magyar nyelvű "${kind}" tartalmat a(z) "${p.name}" hegyi vendégháznak (8 szoba, Hargita megye, házi reggeli, szauna, erdei környezet) erről: "${topic}". Legyen figyelemfelkeltő, természetes, ne túl reklámízű. Közösségi média esetén 2-4 releváns hashtaggel. Csak a tartalmat írd le.`
      );
      setOut(text || "Nem érkezett válasz — próbáld újra.");
    } catch { setOut("Hiba történt a kérés során. Próbáld újra."); }
    setLoading(false);
  };

  return (
    <div>
      <SectionTitle eyebrow="AI Marketing Studio" title="Kampányok és posztok egy helyen"
        desc="9 kampány · 12 elkészült Facebook poszt · 26 100 összes elérés az elmúlt 90 napban." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAMPAIGNS.map((c) => {
          const sc = S_COLOR[c.s];
          return (
            <Card key={c.t} className="p-4 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-semibold leading-snug" style={{ color: T.ink }}>{c.t}</div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap" style={{ background: sc.bg, color: sc.fg }}>{c.s}</span>
              </div>
              <div className="text-[11px] mt-1" style={{ color: T.muted }}>{c.ch}</div>
              <p className="text-xs mt-2 leading-relaxed flex-1" style={{ color: T.muted }}>{c.txt}</p>
              <div className="flex gap-3 mt-3 pt-3 text-[11px] font-medium" style={{ borderTop: `1px solid ${T.line}`, color: T.ink }}>
                <span>{c.reach}</span><span>{c.clicks}</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-5 mt-6 max-w-2xl">
        <div className="text-sm font-semibold mb-3" style={{ color: T.ink }}>Új tartalom generálása</div>
        <div className="flex flex-wrap gap-2">
          {["Facebook poszt", "Instagram poszt", "TikTok ötlet", "Google Business poszt", "Hétvégi ajánlat", "E-mail kampány"].map((x) => (
            <Chip key={x} active={kind === x} onClick={() => setKind(x)}>{x}</Chip>
          ))}
        </div>
        <label className="block mt-4">
          <span className="text-xs font-medium" style={{ color: T.muted }}>Miről szóljon?</span>
          <textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={2}
            className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none"
            style={{ border: `1px solid ${T.line}`, color: T.ink }} />
        </label>
        <div className="mt-4"><PrimaryBtn onClick={run} loading={loading}>Tartalom generálása</PrimaryBtn></div>
        <OutputBox text={out} loading={loading} onRegenerate={run} />
      </Card>
    </div>
  );
}

/* ───────────── QR nézet ───────────── */

function QrView({ p }) {
  const cells = useMemo(() => {
    const seed = p.name.length * 7;
    return Array.from({ length: 169 }, (_, i) => ((i * 31 + seed) % 7) < 3);
  }, [p.name]);
  return (
    <div className="max-w-3xl">
      <SectionTitle eyebrow="QR-kód generátor" title="Nyomtatható QR-anyagok"
        desc="231 beolvasás e hónapban — 82% a szobákból. A vendég beolvassa, és app nélkül megnyílik az útmutató." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-6 flex flex-col items-center">
          <div className="rounded-2xl p-4" style={{ background: "#fff", border: `1px solid ${T.line}` }}>
            <div className="grid" style={{ gridTemplateColumns: "repeat(13, 10px)" }}>
              {cells.map((on, i) => (
                <div key={i} style={{ width: 10, height: 10, background: on ? T.ink : "transparent", borderRadius: 2 }} />
              ))}
            </div>
          </div>
          <div className="mt-4 text-sm font-semibold" style={{ color: T.ink }}>{p.name}</div>
          <div className="text-xs" style={{ color: T.muted }}>pensiunekit.app/boroka</div>
          <div className="mt-4 flex gap-2">
            {["PNG", "SVG", "Nyomtatás"].map((x) => (
              <span key={x} className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                style={{ border: `1px solid ${T.line}`, color: T.ink }}>{x}</span>
            ))}
          </div>
          <div className="mt-3 text-[10px] text-center" style={{ color: T.muted }}>
            Demó-minta — a kész termékben valódi, beolvasható QR-kód készül.
          </div>
        </Card>
        <div className="space-y-4">
          {[
            ["Recepciós kártya", "Álló A6-os kártya a pulthoz", "letöltve 2×"],
            ["Szobamatrica", "Kör alakú matrica mind a 8 szobába", "letöltve 8×"],
            ["Asztali QR", "Reggelizőasztalokra és a teraszra", "letöltve 6×"],
            ["Poszter", "A4 a bejárathoz és a szaunához", "letöltve 2×"],
          ].map(([t, d, m]) => (
            <Card key={t} className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: T.accentSoft }}>
                <QrCode size={16} style={{ color: T.accent }} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium" style={{ color: T.ink }}>{t}</div>
                <div className="text-xs" style={{ color: T.muted }}>{d} · {m}</div>
              </div>
              <span className="text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer" style={{ border: `1px solid ${T.line}`, color: T.ink }}>Letöltés</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────── Analitika ───────────── */

function Analytics() {
  return (
    <div>
      <SectionTitle eyebrow="Analitika" title="Mit néznek, honnan jönnek, hogyan értékelnek?"
        desc="Kihasználtság, nemzetiségek, útmutató-oldalak, vélemény-trend és marketing-teljesítmény." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="text-sm font-semibold mb-4" style={{ color: T.ink }}>Kihasználtság hónapról hónapra</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={OCCUPANCY} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${T.line}`, fontSize: 12 }} />
                <Bar dataKey="v" fill={T.accent} radius={[6, 6, 0, 0]} name="Kihasználtság %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold mb-4" style={{ color: T.ink }}>Vélemény-átlag alakulása</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SCORE_TREND} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} />
                <YAxis domain={[4.4, 5]} tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${T.line}`, fontSize: 12 }} />
                <Line type="monotone" dataKey="v" stroke={T.amber} strokeWidth={2.5} dot={{ fill: T.amber, r: 3 }} name="Átlag" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold mb-4" style={{ color: T.ink }}>Vendégek nemzetiség szerint</div>
          {NATIONS.map((x) => (
            <div key={x.n} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: T.ink }}>{x.n}</span><span style={{ color: T.muted }}>{x.v}%</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: T.line }}>
                <div className="h-2 rounded-full" style={{ width: `${x.v}%`, background: T.accent }} />
              </div>
            </div>
          ))}
          <div className="mt-4 text-xs rounded-xl p-3 flex items-start gap-2" style={{ background: T.accentSoft, color: T.accentDark }}>
            <Sparkles size={14} className="mt-0.5 shrink-0" />
            A német vendégek aránya 3 hónap alatt 6%-ról 9%-ra nőtt — a német nyelvű útmutató működik.
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold mb-4" style={{ color: T.ink }}>Marketing-teljesítmény (kattintások)</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MKT_PERF} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
                <XAxis dataKey="n" tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${T.line}`, fontSize: 12 }} />
                <Bar dataKey="v" fill="#4F6B7A" radius={[6, 6, 0, 0]} name="Kattintás" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <div className="text-sm font-semibold mb-4" style={{ color: T.ink }}>Legnézettebb útmutató-oldalak és látnivalók</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <div>
              {TOP_PAGES.map((a) => (
                <div key={a.n} className="flex items-center justify-between py-2 text-sm" style={{ borderBottom: `1px solid ${T.line}` }}>
                  <span style={{ color: T.ink }}>{a.n}</span>
                  <span className="text-xs" style={{ color: T.muted }}>{a.v} megnyitás</span>
                </div>
              ))}
            </div>
            <div>
              {[["Fátyol-vízesés", 176], ["Madarasi Hargita túra", 154], ["Szent Anna-tó", 132], ["Mikó-vár", 98], ["Termelői piac", 84], ["Falumúzeum", 61]].map(([n, v]) => (
                <div key={n} className="flex items-center justify-between py-2 text-sm" style={{ borderBottom: `1px solid ${T.line}` }}>
                  <span style={{ color: T.ink }}>{n}</span>
                  <span className="text-xs" style={{ color: T.muted }}>{v} megnyitás</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ───────────── Nyilvános weboldal ───────────── */

function Website({ p }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", from: "", to: "", guests: "2 felnőtt", msg: "" });
  const sf = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

  return (
    <div>
      <SectionTitle eyebrow="Nyilvános weboldal" title="Így látják a vendégek a borokavendeghaz.ro oldalt"
        desc="A PensiuneKit automatikusan generálja a szállás prémium weboldalát a megadott adatokból." />
      <Card className="overflow-hidden" style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}>
        {/* website nav */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #EDE9E1", background: "#FDFBF7" }}>
          <div className="flex items-center gap-2">
            <Trees size={18} style={{ color: T.accent }} />
            <span className="font-semibold" style={{ ...serif, color: T.ink }}>Boróka Vendégház</span>
          </div>
          <div className="hidden sm:flex gap-5 text-xs font-medium" style={{ color: T.muted }}>
            {["Szobák", "Szolgáltatások", "Környék", "Vélemények", "Kapcsolat"].map((x) => <span key={x} className="cursor-pointer">{x}</span>)}
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-white" style={{ background: T.accent }}>Foglalás</span>
        </div>

        {/* hero */}
        <div className="relative flex flex-col items-center justify-center text-center px-6" style={{ height: 320, background: "linear-gradient(160deg, #1d5238 0%, #2F6B4F 55%, #46795B 100%)" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 10%, rgba(255,255,255,0.2), transparent 45%)" }} />
          <div className="relative text-3xl sm:text-4xl text-white" style={serif}>Hegyi csend, erdei kilátás,<br />házi reggeli.</div>
          <p className="relative mt-3 text-sm max-w-md" style={{ color: "rgba(255,255,255,0.85)" }}>
            8 szobás családi vendégház Hargita megye fenyvesei között — ahol a nap madárcsicsergéssel és frissen sült kenyér illatával kezdődik.
          </p>
          <div className="relative mt-5 flex gap-3">
            <span className="px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer" style={{ background: "#fff", color: T.accentDark }}>Szobák megtekintése</span>
            <span className="px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer text-white" style={{ border: "1px solid rgba(255,255,255,0.5)" }}>Galéria</span>
          </div>
        </div>

        {/* gallery strip */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-2" style={{ background: "#FDFBF7" }}>
          {["A ház télen", "Erdei terasz", "Deluxe szoba", "Reggelink", "Szauna", "Naplemente"].map((l, i) => (
            <Photo key={l} label={l} h={i} height={90} icon={Camera} />
          ))}
        </div>

        {/* rooms */}
        <div className="px-6 py-10" style={{ background: "#fff" }}>
          <div className="text-center mb-8">
            <div className="text-xs font-semibold tracking-widest uppercase" style={{ color: T.accent }}>Szobáink</div>
            <div className="text-2xl mt-1" style={{ ...serif, color: T.ink }}>Négy szobatípus, egy közös nevező: a nyugalom</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              ["Kétágyas szoba", "€80–85 / éj", "2 fő · erkély · erdei kilátás", 0],
              ["Deluxe szoba", "€110 / éj", "2 fő · kandalló · panoráma", 2],
              ["Családi szoba", "€120–125 / éj", "2+2 fő · kiságy · játéksarok", 1],
              ["Apartman", "€150 / éj", "4 fő · konyha · nappali", 3],
            ].map(([t, pr, d, h]) => (
              <div key={t} className="rounded-2xl overflow-hidden" style={{ border: "1px solid #EDE9E1" }}>
                <Photo label={t} h={h} height={110} icon={BedDouble} />
                <div className="p-4">
                  <div className="text-sm font-semibold" style={{ color: T.ink }}>{t}</div>
                  <div className="text-xs mt-0.5" style={{ color: T.muted }}>{d}</div>
                  <div className="text-sm font-semibold mt-2" style={{ color: T.accentDark }}>{pr}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* services */}
        <div className="px-6 py-10" style={{ background: "#FDFBF7", borderTop: "1px solid #EDE9E1" }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto text-center">
            {[
              [Coffee, "Házi reggeli", "termelői alapanyagokból"],
              [Flame, "Szauna", "esti idősávokkal"],
              [Car, "Zárt parkoló", "ingyenes, kamerás"],
              [Wifi, "Gyors WiFi", "minden szobában"],
              [PawPrint, "Kutyabarát", "tálkával, pléddel"],
              [Baby, "Családbarát", "kiságy, játéksarok"],
            ].map(([I, t, d]) => (
              <div key={t}>
                <div className="w-11 h-11 mx-auto rounded-2xl flex items-center justify-center" style={{ background: T.accentSoft }}>
                  <I size={18} style={{ color: T.accent }} />
                </div>
                <div className="text-sm font-semibold mt-2" style={{ color: T.ink }}>{t}</div>
                <div className="text-[11px]" style={{ color: T.muted }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* attractions */}
        <div className="px-6 py-10" style={{ background: "#fff", borderTop: "1px solid #EDE9E1" }}>
          <div className="text-center mb-8">
            <div className="text-xs font-semibold tracking-widest uppercase" style={{ color: T.accent }}>A környék</div>
            <div className="text-2xl mt-1" style={{ ...serif, color: T.ink }}>Vízesések, csúcsok, kráter-tó</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {GUIDE.nature.map((x, i) => (
              <div key={x.n} className="rounded-2xl overflow-hidden" style={{ border: "1px solid #EDE9E1" }}>
                <Photo label={x.n} h={i + 3} height={100} icon={x.i} />
                <div className="p-4">
                  <div className="text-sm font-semibold" style={{ color: T.ink }}>{x.n}</div>
                  <div className="text-xs mt-1 leading-relaxed" style={{ color: T.muted }}>{x.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* reviews */}
        <div className="px-6 py-10" style={{ background: "#FDFBF7", borderTop: "1px solid #EDE9E1" }}>
          <div className="text-center mb-8">
            <div className="text-xs font-semibold tracking-widest uppercase" style={{ color: T.accent }}>Vendégeink mondták</div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Stars n={5} size={16} />
              <span className="text-sm font-semibold" style={{ color: T.ink }}>4.9 · 128 vélemény</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[REVIEWS[0], REVIEWS[4], REVIEWS[7]].map((r) => (
              <div key={r.name} className="rounded-2xl p-5 bg-white" style={{ border: "1px solid #EDE9E1" }}>
                <Stars n={r.rating} />
                <p className="text-sm mt-3 leading-relaxed" style={{ ...serif, color: T.ink }}>„{r.text}”</p>
                <div className="text-xs mt-3 font-medium" style={{ color: T.muted }}>{r.name} · {r.pf}</div>
              </div>
            ))}
          </div>
        </div>

        {/* contact + booking */}
        <div className="px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto" style={{ borderTop: "1px solid #EDE9E1" }}>
          <div>
            <div className="text-2xl" style={{ ...serif, color: T.ink }}>Kapcsolat</div>
            <div className="mt-4 space-y-2.5 text-sm" style={{ color: T.ink }}>
              <div className="flex items-center gap-2.5"><MapPin size={15} style={{ color: T.accent }} /> {p.address}</div>
              <div className="flex items-center gap-2.5"><Phone size={15} style={{ color: T.accent }} /> {p.phone}</div>
              <div className="flex items-center gap-2.5"><Mail size={15} style={{ color: T.accent }} /> {p.email}</div>
            </div>
            <div className="mt-5 rounded-2xl overflow-hidden" style={{ border: "1px solid #EDE9E1" }}>
              <div className="h-40 flex items-center justify-center gap-2 text-sm font-medium"
                style={{ background: "linear-gradient(145deg, #DEE8E1, #C9D8CD)", color: T.accentDark }}>
                <MapPin size={16} /> Google Térkép — Boróka Vendégház
              </div>
            </div>
          </div>
          <div className="rounded-2xl p-6" style={{ background: "#FDFBF7", border: "1px solid #EDE9E1" }}>
            <div className="text-lg font-semibold" style={{ color: T.ink }}>Foglalási kérés</div>
            <div className="text-xs mt-0.5 mb-4" style={{ color: T.muted }}>24 órán belül válaszolunk — kötelezettség nélkül.</div>
            {sent ? (
              <div className="rounded-xl p-5 text-center" style={{ background: T.accentSoft }}>
                <Check size={24} className="mx-auto" style={{ color: T.accentDark }} />
                <div className="text-sm font-semibold mt-2" style={{ color: T.accentDark }}>Kérés elküldve!</div>
                <div className="text-xs mt-1" style={{ color: T.accentDark }}>Hamarosan jelentkezünk a(z) {form.email || "megadott"} címen.</div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input value={form.name} onChange={sf("name")} placeholder="Név" className="rounded-xl px-3 py-2.5 text-sm outline-none bg-white" style={{ border: "1px solid #EDE9E1", color: T.ink }} />
                  <input value={form.email} onChange={sf("email")} placeholder="E-mail" className="rounded-xl px-3 py-2.5 text-sm outline-none bg-white" style={{ border: "1px solid #EDE9E1", color: T.ink }} />
                  <input value={form.from} onChange={sf("from")} placeholder="Érkezés (pl. júl. 18.)" className="rounded-xl px-3 py-2.5 text-sm outline-none bg-white" style={{ border: "1px solid #EDE9E1", color: T.ink }} />
                  <input value={form.to} onChange={sf("to")} placeholder="Távozás (pl. júl. 21.)" className="rounded-xl px-3 py-2.5 text-sm outline-none bg-white" style={{ border: "1px solid #EDE9E1", color: T.ink }} />
                </div>
                <input value={form.guests} onChange={sf("guests")} placeholder="Vendégek (pl. 2 felnőtt, 1 gyerek)" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none bg-white" style={{ border: "1px solid #EDE9E1", color: T.ink }} />
                <textarea value={form.msg} onChange={sf("msg")} rows={3} placeholder="Üzenet (kérések, kérdések)…" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none bg-white" style={{ border: "1px solid #EDE9E1", color: T.ink }} />
                <button onClick={() => setSent(true)} className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ background: T.accent }}>
                  Foglalási kérés elküldése
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-5 text-center text-xs" style={{ background: "#17181A", color: "rgba(255,255,255,0.6)" }}>
          © 2026 Boróka Vendégház · Hargita megye, Románia · Készült a <span style={{ color: "#fff" }}>PensiuneKit</span>-tel
        </div>
      </Card>
    </div>
  );
}

/* ───────────── App shell ───────────── */

const NAV = [
  { id: "dashboard", label: "Vezérlőpult", icon: LayoutDashboard },
  { id: "rooms", label: "Szobák", icon: BedDouble },
  { id: "guests", label: "Vendégek", icon: Users },
  { id: "guide", label: "Vendégútmutató", icon: BookOpen },
  { id: "website", label: "Weboldal", icon: Globe },
  { id: "assistant", label: "AI Asszisztens", icon: Sparkles },
  { id: "reviews", label: "Vélemények", icon: MessageSquareQuote },
  { id: "templates", label: "Üzenetsablonok", icon: Mail },
  { id: "marketing", label: "Marketing Studio", icon: Megaphone },
  { id: "qr", label: "QR-kódok", icon: QrCode },
  { id: "analytics", label: "Analitika", icon: BarChart3 },
];

export default function PensiuneKit({ initialProperty, onSaveProperty, onLogout, userEmail, demoBanner }) {
  const [view, setView] = useState("dashboard");
  const [p, setP] = useState(initialProperty || PROPERTY_INIT);

  // Ha a mentett adatok később érkeznek meg az adatbázisból, frissítünk
  React.useEffect(() => {
    if (initialProperty) setP(initialProperty);
  }, [initialProperty]);

  const views = {
    dashboard: <Dashboard go={setView} />,
    rooms: <Rooms />,
    guests: <Guests />,
    guide: <GuideEditor p={p} setP={setP} onSave={onSaveProperty ? () => onSaveProperty(p) : null} />,
    website: <Website p={p} />,
    assistant: <AiAssistant p={p} />,
    reviews: <Reviews p={p} />,
    templates: <Templates p={p} />,
    marketing: <Marketing p={p} />,
    qr: <QrView p={p} />,
    analytics: <Analytics />,
  };

  return (
    <div className="min-h-screen flex" style={{ background: T.bg, fontFamily: "ui-sans-serif, -apple-system, 'Segoe UI', Roboto, sans-serif" }}>
      <aside className="hidden md:flex flex-col w-60 shrink-0 p-4" style={{ borderRight: `1px solid ${T.line}`, background: "#FCFCFB" }}>
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: T.accent }}>
            <Mountain size={16} color="#fff" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight" style={{ color: T.ink }}>PensiuneKit</div>
            <div className="text-[10px]" style={{ color: T.muted }}>Vendégélmény-platform</div>
          </div>
        </div>
        <button className="mt-3 mb-4 flex items-center justify-between px-3 py-2.5 rounded-xl text-sm"
          style={{ border: `1px solid ${T.line}`, background: "#fff", color: T.ink }}>
          <span className="font-medium truncate">{p.name}</span>
          <ChevronDown size={14} style={{ color: T.muted }} />
        </button>
        <nav className="space-y-0.5 flex-1">
          {NAV.map((n) => {
            const active = view === n.id;
            return (
              <button key={n.id} onClick={() => setView(n.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                style={{ background: active ? T.accentSoft : "transparent", color: active ? T.accentDark : T.muted }}>
                <n.icon size={16} />{n.label}
              </button>
            );
          })}
        </nav>
        {userEmail ? (
          <div className="rounded-xl p-3 text-xs" style={{ background: T.accentSoft, color: T.accentDark }}>
            <div className="font-semibold mb-0.5 truncate">{userEmail}</div>
            <button onClick={onLogout} className="underline" style={{ opacity: 0.85 }}>Kijelentkezés</button>
          </div>
        ) : demoBanner ? (
          <div className="rounded-xl p-3 text-xs" style={{ background: "#FDF0DC", color: "#8A5A16" }}>
            <div className="font-semibold mb-0.5">Demó mód — fiók nélkül</div>
            <div style={{ opacity: 0.85 }}>A módosítások nem mentődnek.</div>
            {onLogout && <button onClick={onLogout} className="underline mt-1">Kilépés</button>}
          </div>
        ) : (
          <div className="rounded-xl p-3 text-xs" style={{ background: T.accentSoft, color: T.accentDark }}>
            <div className="font-semibold mb-0.5">Pro csomag · aktív</div>
            <div style={{ opacity: 0.8 }}>Következő számlázás: aug. 1. · €29/hó</div>
          </div>
        )}
      </aside>

      <div className="flex-1 min-w-0">
        <div className="md:hidden flex gap-1.5 overflow-x-auto p-3" style={{ borderBottom: `1px solid ${T.line}`, background: "#FCFCFB" }}>
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setView(n.id)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: view === n.id ? T.ink : "#fff",
                color: view === n.id ? "#fff" : T.muted,
                border: `1px solid ${view === n.id ? T.ink : T.line}`,
              }}>{n.label}</button>
          ))}
        </div>
        <main className="p-5 md:p-8 max-w-6xl">{views[view]}</main>
      </div>
    </div>
  );
}
