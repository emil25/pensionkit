import { addDays, uid, validateBooking } from './model.js';

const escapeText = value => String(value).replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
const unescapeText = value => value.replace(/\\([nN,;\\])/g, (_, char) => /n/i.test(char) ? '\n' : char);
function fold(line) {
  const encoder = new TextEncoder(); let result = ''; let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > 75) { result += '\r\n '; bytes = 1; }
    result += char; bytes += size;
  }
  return result;
}
export function exportIcal(state, roomId) {
  if (!state.rooms.some(room => room.id === roomId)) throw new Error('Válassz szobát vagy kiadó házat.');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  const events = state.bookings.filter(b => b.roomId === roomId && b.status !== 'cancelled').flatMap(b => [
    'BEGIN:VEVENT', `UID:${escapeText(`${b.id}@pensiunekit.local`)}`, `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${b.from.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${b.to.replace(/-/g, '')}`,
    'SUMMARY:Foglalt', 'TRANSP:OPAQUE', 'END:VEVENT',
  ]);
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PensiuneKit//Room calendar//HU', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR', ''].map(fold).join('\r\n');
}
export function previewIcal(text, state, roomId, source = 'Egyéb') {
  const room = state.rooms.find(r => r.id === roomId);
  if (!room) throw new Error('Válassz célként egy szobát vagy kiadó házat.');
  if (new TextEncoder().encode(text).length > 1024 * 1024) throw new Error('A naptárfájl legfeljebb 1 MB lehet.');
  const unfolded = text.replace(/^\uFEFF/, '').replace(/\r?\n[ \t]/g, '');
  if (!/^BEGIN:VCALENDAR\s*$/im.test(unfolded) || !/^END:VCALENDAR\s*$/im.test(unfolded)) throw new Error('Ez nem érvényes .ics naptárfájl.');
  const blocks = [...unfolded.matchAll(/^BEGIN:VEVENT\s*\r?\n([\s\S]*?)^END:VEVENT\s*$/gim)];
  if (blocks.length > 2000) throw new Error('Egyszerre legfeljebb 2000 naptáresemény olvasható be.');
  const accepted = []; const skipped = [];
  for (const [, block] of blocks) {
    const fields = {};
    let nested = 0;
    for (const line of block.split(/\r?\n/)) {
      if (/^BEGIN:/i.test(line)) { nested++; continue; }
      if (/^END:/i.test(line)) { nested--; continue; }
      if (nested) continue;
      const match = /^([A-Z-]+)(;[^:]*)?:(.*)$/i.exec(line);
      if (match) fields[match[1].toUpperCase()] = { params: match[2] || '', value: match[3].trim() };
    }
    const get = key => fields[key]?.value || '';
    const name = unescapeText(get('SUMMARY')).slice(0, 100) || 'Külső foglalás';
    const skip = reason => skipped.push({ name, reason });
    if (get('STATUS').toUpperCase() === 'CANCELLED' || get('TRANSP').toUpperCase() === 'TRANSPARENT') { skip('Lemondott vagy szabad időpontot jelöl.'); continue; }
    if (['RRULE', 'RDATE', 'EXDATE', 'RECURRENCE-ID', 'DURATION'].some(key => fields[key])) { skip('Ismétlődő vagy időtartammal megadott esemény: kézi ellenőrzés szükséges.'); continue; }
    const date = key => {
      const value = get(key);
      if (!/^\d{8}$/.test(value)) return '';
      const day = `${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}`;
      const parsed = new Date(`${day}T12:00:00Z`);
      return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0,10) === day ? day : '';
    };
    const from = date('DTSTART'); const to = fields.DTEND ? date('DTEND') : from ? addDays(from, 1) : '';
    if (!from || !to || to <= from) { skip('Csak érvényes, egész napos tartózkodás importálható.'); continue; }
    const externalUid = unescapeText(get('UID')).slice(0, 500);
    if (!externalUid) { skip('Hiányzó eseményazonosító (UID).'); continue; }
    const existing = [...state.bookings, ...accepted].find(b => b.roomId === roomId && (b.externalUid === externalUid || `${b.id}@pensiunekit.local` === externalUid));
    if (existing) { skip(existing.from === from && existing.to === to ? 'Már beolvasott esemény.' : 'Korábban beolvasott, megváltozott esemény: módosítsd kézzel a meglévő foglalást.'); continue; }
    const booking = { id: uid(), externalUid, name, phone: '', email: '', roomId, from, to, guests: Math.min(2, room.capacity), price: 0, deposit: 0, status: 'confirmed', source: ['Booking.com', 'Airbnb'].includes(source) ? source : 'Egyéb', language: 'hu', note: 'Külső naptárból beolvasva. A vendégszámot, árat és elérhetőséget egyeztesd.' };
    const error = validateBooking(booking, { ...state, bookings: [...state.bookings, ...accepted] });
    if (error) { skip(error); continue; }
    accepted.push(booking);
  }
  return { accepted, skipped, events: blocks.length };
}
