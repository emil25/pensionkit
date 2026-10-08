import { multilingualGuideHtml } from './guide.js';
import { money } from './model.js';
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[x]));
export function download(name, content, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const pageCss = `*{box-sizing:border-box}body{margin:0;background:#f6f5ef;color:#24382c;font:16px/1.65 system-ui,sans-serif}header{background:#254d3a;color:#fff;padding:72px 24px;text-align:center}h1{font:normal 52px/1.15 Georgia,serif;margin:16px 0}h2{font:normal 30px Georgia,serif}h3{margin:0 0 12px}main{max-width:1000px;margin:auto;padding:32px 20px}section{background:#fff;border:1px solid #e4e7de;border-radius:18px;padding:28px;margin:18px 0}p{white-space:pre-line}a{color:#254d3a}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}.room{background:#f3f4ed;padding:22px;border-radius:12px}.eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:3px;opacity:.7}.button{display:inline-block;background:#dce7b7;color:#24382c;padding:12px 22px;border-radius:9px;text-decoration:none;font-weight:600}footer{text-align:center;padding:32px;font-size:13px;color:#657368}@media(max-width:600px){h1{font-size:36px}header{padding:44px 20px}}`;
const shell = (p, title, body) => `<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escapeHtml(p.desc)}"><title>${escapeHtml(title)} · ${escapeHtml(p.name)}</title><style>${pageCss}</style></head><body><header><div class="eyebrow">${escapeHtml(title)}</div><h1>${escapeHtml(p.name)}</h1><p>${escapeHtml(p.tagline)}</p></header><main>${body}</main><footer>${escapeHtml(p.name)} · Készült a PensiuneKit segítségével</footer></body></html>`;
export function guideHtml(p, language) {
  return multilingualGuideHtml(p, language);
}
export function websiteHtml(p, rooms) {
  const contact = p.email ? `<a class="button" href="mailto:${encodeURIComponent(p.email)}?subject=${encodeURIComponent('Foglalási érdeklődés — ' + p.name)}">Érdeklődés e-mailben →</a>` : '<p>Foglalási érdeklődéshez keressen minket az alábbi elérhetőségen.</p>';
  return shell(p, 'Kis szállás. Nagy odafigyelés.', `<section><h2>Érezze magát otthon!</h2><p>${escapeHtml(p.desc)}</p></section><section><h2>Szobáink</h2><div class="grid">${rooms.map(r => `<article class="room"><h3>${escapeHtml(r.name)}</h3><p>${r.capacity} vendég · ${escapeHtml(money(r.price, p.currency))} / éj</p></article>`).join('')}</div><p>Az árak tájékoztató jellegűek. A szabad időpontokat és a végleges árat érdeklődéskor egyeztetjük.</p></section>${p.breakfast ? `<section><h2>Így indul a reggel</h2><p>${escapeHtml(p.breakfast)}</p></section>` : ''}<section><h2>Tervezzük meg a pihenését!</h2><p>${escapeHtml([p.address, p.phone, p.email].filter(Boolean).join('\n'))}</p>${contact}<p>Az érdeklődés önmagában nem jelent visszaigazolt foglalást.</p></section>`);
}
export function bookingCsv(bookings, rooms) {
  const cell = value => { let v = String(value ?? ''); if (/^[=+@\-\t\r]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; };
  return '\uFEFF' + [['Vendég', 'Telefonszám', 'Szoba', 'Érkezés', 'Távozás', 'Fő', 'Ár / éj', 'Befizetés', 'Állapot', 'Forrás', 'Megjegyzés'], ...bookings.map(b => [b.name, b.phone || '', rooms.find(r => r.id === b.roomId)?.name, b.from, b.to, b.guests, b.price, b.deposit, b.status, b.source, b.note])].map(row => row.map(cell).join(';')).join('\r\n');
}
