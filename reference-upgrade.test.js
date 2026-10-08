import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, validateState, validateBooking } from './model.js';
import { previewIcal, exportIcal } from './ical.js';
import { phoneNumber, whatsappUrl, roomRemovalError } from './guest-tools.js';
import { multilingualGuideHtml, qrCardHtml } from './guide.js';
import { bookingCsv } from './exports.js';

const event = (uid, from = '20261112', to = '20261114', extra = '') => `BEGIN:VEVENT\r\nUID:${uid}\r\nDTSTART;VALUE=DATE:${from}\r\nDTEND;VALUE=DATE:${to}\r\nSUMMARY:Anna\\, Béla\r\n${extra}END:VEVENT\r\n`;
const calendar = events => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\n${events}END:VCALENDAR\r\n`;
function state() { const s = createState(true); s.bookings = []; return s; }

test('iCal preview checks conflicts within the file and excludes the departure night', () => {
  const s = state(); const result = previewIcal(calendar(event('one')+event('overlap','20261113','20261115')+event('turnover','20261114','20261116')),s,'r1','Booking.com');
  assert.equal(result.accepted.length,2); assert.equal(result.skipped.length,1);
  assert.match(result.skipped[0].reason,/már van foglalás/);
  assert.equal(result.accepted[0].name,'Anna, Béla'); assert.equal(result.accepted[0].price,0);
  assert.equal(validateState({...s,bookings:result.accepted}),true);
});
test('Repeated and changed UIDs cannot create duplicate or silently moved bookings', () => {
  const s = state(); s.bookings = previewIcal(calendar(event('one')),s,'r1').accepted;
  const again = previewIcal(calendar(event('one')),s,'r1'); assert.equal(again.accepted.length,0); assert.match(again.skipped[0].reason,/Már beolvasott/);
  const changed = previewIcal(calendar(event('one','20261120','20261122')),s,'r1'); assert.match(changed.skipped[0].reason,/megváltozott/); assert.equal(s.bookings[0].from,'2026-11-12');
  assert.equal(previewIcal(calendar(event('one')),s,'r2').accepted.length,1);
});
test('Invalid, cancelled, timed and recurring events are reported instead of guessed', () => {
  const s = state(); const result = previewIcal(calendar(event('bad','20260230','20260303')+event('recurring','20261112','20261114','RRULE:FREQ=DAILY\r\n')+event('cancelled','20261112','20261114','STATUS:CANCELLED\r\n')+event('timed','20261112T180000Z','20261114T080000Z')),s,'r1');
  assert.equal(result.accepted.length,0); assert.equal(result.skipped.length,4);
  assert.throws(()=>previewIcal('random text',s,'r1'),/érvényes/);
  assert.throws(()=>previewIcal('x'.repeat(1024*1024+1),s,'r1'),/1 MB/);
});
test('iCal unfolds Unicode lines and ignores nested alarm summaries', () => {
  const s = state(); const text = calendar(event('one').replace('SUMMARY:Anna\\, Béla','SUMMARY:Árvíztűrő\r\n  tükörfúrógép').replace('END:VEVENT','BEGIN:VALARM\r\nSUMMARY:Wrong name\r\nEND:VALARM\r\nEND:VEVENT'));
  const result = previewIcal(text,s,'r1'); assert.equal(result.accepted[0].name,'Árvíztűrő tükörfúrógép');
});
test('Room exports contain stable IDs and no private guest information', () => {
  const s = createState(true); s.bookings[0].phone = '+40712345678'; s.bookings[0].note='PRIVATE NOTE';
  const out = exportIcal(s,'r1'); assert.ok(out.includes('SUMMARY:Foglalt')); assert.ok(!out.includes('Nagy Eszter')); assert.ok(!out.includes('40712345678')); assert.ok(!out.includes('PRIVATE NOTE'));
  assert.equal(previewIcal(out,s,'r1').accepted.length,0);
  s.bookings[0].externalUid = 'private-provider@example.com'; s.bookings[0].id = 'ű'.repeat(100); const folded = exportIcal(s,'r1');
  assert.ok(!folded.includes('private-provider'));
  assert.ok(folded.split('\r\n').every(line=>new TextEncoder().encode(line).length<=75));
  const imported = previewIcal(folded,state(),'r1'); assert.equal(imported.accepted[0].externalUid,`${s.bookings[0].id}@pensiunekit.local`);
});
test('Phone numbers stay optional and international formats build encoded WhatsApp links', () => {
  assert.equal(phoneNumber('0040 (712) 345-678'),'+40712345678'); assert.equal(phoneNumber('0712345678'),'');
  assert.equal(whatsappUrl('javascript:123456789','hello'),''); assert.equal(whatsappUrl('+40712345678','Szia & üdv!'),'https://wa.me/40712345678?text=Szia%20%26%20%C3%BCdv!');
  const s = createState(true); assert.equal(validateState(s),true); assert.match(validateBooking({...s.bookings[0],phone:'0712345678'},s),/országkóddal/);
  s.bookings[0].phone='+40712345678'; assert.equal(validateState(s),true); assert.ok(bookingCsv(s.bookings,s.rooms).includes("'+40712345678"));
});
test('Guide translations and QR cards escape host content and preserve old backups', () => {
  const s = state(); s.property.guideTranslations={en:{breakfast:'Breakfast at 8.',rules:'<script>alert(1)</script>'}};
  assert.equal(validateState(s),true); const html=multilingualGuideHtml(s.property,'en');
  assert.ok(html.includes('Breakfast at 8.')); assert.ok(html.includes('&lt;script&gt;')); assert.ok(!html.includes('<script>')); assert.ok(html.includes('The host provided this information in Hungarian.'));
  assert.ok(html.includes('name="language" id="language-en" aria-label="English" checked'));
  assert.ok(!html.includes('11:00-ig')); assert.ok(html.includes('Check-out until'));
  s.property.guideTranslations={en:{rules:17}}; assert.equal(validateState(s),false);
  const corrupt = state(); corrupt.bookings=[null]; assert.equal(validateState(corrupt),false);
  assert.throws(()=>qrCardHtml(s.property,'javascript:bad'),/QR-kód/);
  const card=qrCardHtml({...s.property,name:'<img src=x>',wifiPass:'<b>pw</b>'},'data:image/png;base64,YQ=='); assert.ok(card.includes('&lt;img')); assert.ok(card.includes('&lt;b&gt;pw')); assert.ok(card.includes('size:A5'));
});
test('Room removal cannot orphan any historic or cancelled booking', () => {
  const s = createState(true); assert.match(roomRemovalError(s,'r1'),/nem törölhető/); s.bookings[0].status='cancelled'; assert.match(roomRemovalError(s,'r1'),/nem törölhető/); assert.equal(roomRemovalError(s,'unused'),'');
});
