export const STORE_VERSION = 2;
export const today = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Bucharest' }).format(new Date());
export function addDays(value, days) {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export const nights = (a, b) => Math.round((new Date(`${b}T12:00:00Z`) - new Date(`${a}T12:00:00Z`)) / 86400000);
export const money = (n, currency = 'EUR') => new Intl.NumberFormat('hu-HU', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);
export const shortDate = value => new Intl.DateTimeFormat('hu-HU', { month: 'short', day: 'numeric' }).format(new Date(`${value}T12:00:00Z`));
export const uid = () => crypto.randomUUID();
export const DEFAULT_PROPERTY = {
  name: '', tagline: '', desc: '', address: '', phone: '', email: '', currency: 'EUR',
  checkin: '15:00', checkout: '11:00', wifiName: '', wifiPass: '', breakfast: '', parking: '', rules: '', guideUrl: '',
};
export function createState(demo = true) {
  const day = today();
  const rooms = demo ? [
    { id: 'r1', name: 'Fenyő', number: '01', capacity: 2, price: 80, clean: true },
    { id: 'r2', name: 'Boróka', number: '02', capacity: 2, price: 85, clean: true },
    { id: 'r3', name: 'Napfény', number: '03', capacity: 2, price: 90, clean: false },
    { id: 'r4', name: 'Családi', number: '04', capacity: 4, price: 120, clean: false },
    { id: 'r5', name: 'Panoráma', number: '05', capacity: 2, price: 110, clean: true },
    { id: 'r6', name: 'Kisház', number: '06', capacity: 4, price: 150, clean: true },
  ] : [];
  return {
    version: STORE_VERSION,
    property: demo ? { ...DEFAULT_PROPERTY, name: 'Boróka Vendégház', tagline: 'Hegyi csend. Otthonos pillanatok.', desc: 'Családi vendégház az erdő szélén. Hat otthonos szoba, házi reggeli és figyelmes vendéglátás.', address: 'Hargita megye, Románia', breakfast: '8:00–10:00 között a földszinti étkezőben. Különleges étrendet kérjük, előre jelezzen.', parking: 'A ház előtti udvarban, díjmentesen.', rules: 'Csendes időszak: 22:00–8:00.\nDohányozni a kijelölt teraszon lehet.\nHáziállat előzetes egyeztetéssel hozható.', wifiName: 'Boroka_Guest', wifiPass: 'demo-jelszo' } : { ...DEFAULT_PROPERTY },
    rooms,
    bookings: demo ? [
      { id: 'b1', name: 'Nagy Eszter', email: '', roomId: 'r1', from: day, to: addDays(day, 3), guests: 2, price: 80, deposit: 80, status: 'confirmed', source: 'Közvetlen', note: 'Kutyával érkeznek · várhatóan 15:00', language: 'hu' },
      { id: 'b2', name: 'Hannah Müller', email: '', roomId: 'r4', from: day, to: addDays(day, 4), guests: 4, price: 120, deposit: 120, status: 'confirmed', source: 'Booking.com', note: 'Vegetáriánus reggeli · várhatóan 16:00', language: 'de' },
      { id: 'b3', name: 'Kovács család', email: '', roomId: 'r3', from: addDays(day, -3), to: day, guests: 2, price: 90, deposit: 270, status: 'checked-in', source: 'Közvetlen', note: 'Távozás 11:00-ig', language: 'hu' },
      { id: 'b4', name: 'Andrei Popescu', email: '', roomId: 'r2', from: addDays(day, -1), to: addDays(day, 2), guests: 2, price: 85, deposit: 85, status: 'checked-in', source: 'Airbnb', note: '', language: 'ro' },
      { id: 'b5', name: 'Emma Wilson', email: '', roomId: 'r5', from: addDays(day, -2), to: addDays(day, 2), guests: 2, price: 110, deposit: 440, status: 'checked-in', source: 'Közvetlen', note: '', language: 'en' },
      { id: 'b6', name: 'Szabó Péter', email: '', roomId: 'r6', from: addDays(day, 3), to: addDays(day, 6), guests: 3, price: 150, deposit: 0, status: 'confirmed', source: 'Telefon', note: 'Kerékpártároló iránt érdeklődik', language: 'hu' },
    ] : [],
    tasks: demo ? [{ id: 't1', text: 'Vegetáriánus reggeli egyeztetése', done: false }, { id: 't2', text: 'Kutyatál bekészítése a Fenyő szobába', done: false }, { id: 't3', text: 'Friss törölközők előkészítése', done: true }] : [],
  };
}
export const activeBooking = b => !['cancelled', 'checked-out'].includes(b.status);
export function conflict(bookings, draft) {
  return bookings.find(b => b.id !== draft.id && b.roomId === draft.roomId && activeBooking(b) && activeBooking(draft) && draft.from < b.to && draft.to > b.from);
}
export function validateBooking(draft, state) {
  if (!draft.name?.trim()) return 'Add meg a vendég nevét.';
  const room = state.rooms.find(r => r.id === draft.roomId);
  if (!room) return 'Válassz szobát.';
  const validDay = value => { if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false; const date = new Date(`${value}T12:00:00Z`); return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value; };
  if (!validDay(draft.from) || !validDay(draft.to) || nights(draft.from, draft.to) <= 0) return 'A távozás legyen később, mint az érkezés.';
  if (!Number.isInteger(Number(draft.guests)) || Number(draft.guests) < 1 || Number(draft.guests) > room.capacity) return `Ebben a szobában legfeljebb ${room.capacity} vendég fér el.`;
  if (!Number.isFinite(Number(draft.price)) || Number(draft.price) < 0 || !Number.isFinite(Number(draft.deposit)) || Number(draft.deposit) < 0) return 'Az ár és a befizetés nem lehet negatív.';
  if (Number(draft.deposit) > Number(draft.price) * nights(draft.from, draft.to)) return 'A befizetés nem lehet több a teljes szállásdíjnál.';
  const overlap = conflict(state.bookings, draft);
  if (overlap) return `Erre az időszakra már van foglalás: ${overlap.name} (${shortDate(overlap.from)} – ${shortDate(overlap.to)}).`;
  return '';
}
export function validateState(s) {
  if (!s || s.version !== STORE_VERSION || !s.property || typeof s.property.name !== 'string' || !['EUR', 'HUF', 'RON'].includes(s.property.currency) || !Array.isArray(s.rooms) || !Array.isArray(s.bookings) || !Array.isArray(s.tasks)) return false;
  if (Object.entries(DEFAULT_PROPERTY).some(([key]) => typeof s.property[key] !== 'string')) return false;
  const unique = list => list.every(x => x && typeof x === 'object') && new Set(list.map(x => x.id)).size === list.length;
  if (![s.rooms, s.bookings, s.tasks].every(unique)) return false;
  if (!s.rooms.every(r => typeof r.id === 'string' && typeof r.name === 'string' && typeof r.number === 'string' && Number.isInteger(r.capacity) && r.capacity > 0 && Number.isFinite(r.price) && r.price >= 0 && typeof r.clean === 'boolean')) return false;
  if (!s.tasks.every(t => typeof t.id === 'string' && typeof t.text === 'string' && typeof t.done === 'boolean')) return false;
  return s.bookings.every(b => typeof b.id === 'string' && typeof b.name === 'string' && typeof b.email === 'string' && typeof b.note === 'string' && typeof b.source === 'string' && b.language in LANGUAGES && ['confirmed', 'checked-in', 'checked-out', 'cancelled'].includes(b.status) && !validateBooking(b, s));
}
export function migrateProperty(data) {
  if (validateState(data)) return data;
  if (data?.version === STORE_VERSION) throw new Error('Invalid saved workspace');
  const s = createState(false);
  if (data && typeof data === 'object') s.property = { ...DEFAULT_PROPERTY, ...Object.fromEntries(Object.entries(data).filter(([k]) => k in DEFAULT_PROPERTY)) };
  for (const key of ['checkin', 'checkout']) s.property[key] = typeof s.property[key] === 'string' ? s.property[key].match(/\d{2}:\d{2}/)?.[0] || DEFAULT_PROPERTY[key] : DEFAULT_PROPERTY[key];
  return s;
}
export const STATUS = { confirmed: 'Visszaigazolva', 'checked-in': 'Megérkezett', 'checked-out': 'Távozott', cancelled: 'Lemondva' };
export const LANGUAGES = { hu: 'Magyar', ro: 'Román', en: 'Angol', de: 'Német' };
export function messageFor(type, language, property, booking, room) {
  const name = booking?.name || 'Vendégünk';
  const p = property;
  const locale = { hu: 'hu-HU', ro: 'ro-RO', en: 'en-GB', de: 'de-DE' }[language] || 'hu-HU';
  const messageDate = value => new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(`${value}T12:00:00Z`));
  const stay = booking ? `${messageDate(booking.from)} – ${messageDate(booking.to)}` : '';
  const guide = p.guideUrl ? `\n${p.guideUrl}` : '';
  const dict = {
    hu: { arrival: `Kedves ${name}!\n\nSzeretettel várjuk a(z) ${p.name} szálláshelyen${stay ? ` (${stay})` : ''}! A szobát ${p.checkin}-tól tudják elfoglalni.${p.address ? `\nCímünk: ${p.address}` : ''}${p.parking ? `\nParkolás: ${p.parking}` : ''}\n\nKérjük, jelezzék a várható érkezés időpontját.${guide}\n\nÜdvözlettel,\n${p.name}`, thanks: `Kedves ${name}!\n\nKöszönjük, hogy a(z) ${p.name} vendégei voltak! Reméljük, kellemes emlékekkel tértek haza. Örömmel fogadjuk visszajelzésüket, és szeretettel várjuk vissza Önöket.\n\nÜdvözlettel,\n${p.name}`, confirm: `Kedves ${name}!\n\nVisszaigazoljuk foglalásukat a(z) ${p.name} szálláshelyen.\nIdőszak: ${stay}\nSzoba: ${room?.name || 'egyeztetés szerint'}\nVendégek: ${booking?.guests || 'egyeztetés szerint'}\n\nKérdés esetén keressenek minket bizalommal!\n${p.name}` },
    ro: { arrival: `Bună, ${name}!\n\nVă așteptăm cu drag la ${p.name}${stay ? ` (${stay})` : ''}. Check-in de la ${p.checkin}.${p.address ? `\nAdresa: ${p.address}` : ''}\n\nVă rugăm să ne comunicați ora estimată a sosirii.${guide}\n\nCu drag,\n${p.name}`, thanks: `Bună, ${name}!\n\nVă mulțumim că ați ales ${p.name}! Sperăm că ați avut o ședere plăcută. Ne-ar face plăcere să primim feedbackul dumneavoastră. Vă așteptăm din nou cu drag!\n\n${p.name}`, confirm: `Bună, ${name}!\n\nConfirmăm rezervarea la ${p.name}.\nPerioada: ${stay}\nCamera: ${room?.name || 'de stabilit'}\nOaspeți: ${booking?.guests || 'de stabilit'}\n\nPentru întrebări, ne puteți contacta oricând.\n${p.name}` },
    en: { arrival: `Dear ${name},\n\nWe look forward to welcoming you to ${p.name}${stay ? ` (${stay})` : ''}! Check-in is from ${p.checkin}.${p.address ? `\nAddress: ${p.address}` : ''}\n\nPlease let us know your estimated arrival time.${guide}\n\nWarm regards,\n${p.name}`, thanks: `Dear ${name},\n\nThank you for staying at ${p.name}! We hope you enjoyed your visit. We would love to hear your feedback and welcome you back soon.\n\nWarm regards,\n${p.name}`, confirm: `Dear ${name},\n\nYour reservation at ${p.name} is confirmed.\nDates: ${stay}\nRoom: ${room?.name || 'to be agreed'}\nGuests: ${booking?.guests || 'to be agreed'}\n\nPlease contact us with any questions.\n${p.name}` },
    de: { arrival: `Liebe/r ${name},\n\nwir freuen uns auf Ihren Besuch bei ${p.name}${stay ? ` (${stay})` : ''}! Der Check-in ist ab ${p.checkin} möglich.${p.address ? `\nAdresse: ${p.address}` : ''}\n\nBitte teilen Sie uns Ihre voraussichtliche Ankunftszeit mit.${guide}\n\nHerzliche Grüße,\n${p.name}`, thanks: `Liebe/r ${name},\n\nvielen Dank für Ihren Aufenthalt bei ${p.name}! Wir hoffen, Sie haben sich wohlgefühlt. Wir freuen uns über Ihr Feedback und auf ein Wiedersehen.\n\nHerzliche Grüße,\n${p.name}`, confirm: `Liebe/r ${name},\n\nwir bestätigen Ihre Buchung bei ${p.name}.\nZeitraum: ${stay}\nZimmer: ${room?.name || 'nach Absprache'}\nGäste: ${booking?.guests || 'nach Absprache'}\n\nBei Fragen sind wir gerne für Sie da.\n${p.name}` },
  };
  return dict[language]?.[type] || dict.hu.arrival;
}
