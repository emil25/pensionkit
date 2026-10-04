import { nights, STATUS } from './model.js';

export function shiftMonth(period, amount) {
  if (!/^\d{4}-(?:0[1-9]|1[0-2])$/.test(period)) throw new Error('Invalid month');
  const date = new Date(`${period}-01T12:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + amount);
  return date.toISOString().slice(0, 7);
}

export function financialSummary(state, period) {
  shiftMonth(period, 0);
  const bookings = state.bookings.filter(booking => booking.from.startsWith(period));
  const rows = bookings.filter(booking => booking.status !== 'cancelled').map(booking => {
    const totalCents = Math.round(nights(booking.from, booking.to) * booking.price * 100);
    const paidCents = Math.round(booking.deposit * 100);
    const remainingCents = Math.max(0, totalCents - paidCents);
    return { booking, room: state.rooms.find(room => room.id === booking.roomId), total: totalCents / 100, paid: paidCents / 100, remaining: remainingCents / 100, totalCents, paidCents, remainingCents };
  }).sort((a, b) => a.booking.from.localeCompare(b.booking.from) || a.booking.name.localeCompare(b.booking.name, 'hu'));
  const sum = key => rows.reduce((total, row) => total + row[key], 0) / 100;
  const sources = new Map();
  for (const row of rows) {
    const source = row.booking.source || 'Nem megadott';
    const item = sources.get(source) || { source, count: 0, totalCents: 0 };
    item.count++;
    item.totalCents += row.totalCents;
    sources.set(source, item);
  }
  return { rows, total: sum('totalCents'), paid: sum('paidCents'), remaining: sum('remainingCents'), unpaidCount: rows.filter(row => row.remainingCents > 0).length, cancelledCount: bookings.filter(booking => booking.status === 'cancelled').length, sources: [...sources.values()].sort((a, b) => b.totalCents - a.totalCents).map(item => ({ ...item, total: item.totalCents / 100 })) };
}

export function financialCsv(rows, currency) {
  const cell = value => { let text = String(value ?? ''); if (/^[=+@\-\t\r]/.test(text)) text = `'${text}`; return `"${text.replace(/"/g, '""')}"`; };
  const number = value => value.toFixed(2).replace('.', ',');
  const data = [['Vendég', 'Szállásegység', 'Érkezés', 'Távozás', 'Teljes szállásdíj', 'Eddig befizetve', 'Még befizetendő', 'Pénznem', 'Állapot', 'Forrás'], ...rows.map(row => [row.booking.name, row.room?.name || '', row.booking.from, row.booking.to, number(row.total), number(row.paid), number(row.remaining), currency, STATUS[row.booking.status], row.booking.source])];
  return '\uFEFF' + data.map(row => row.map(cell).join(';')).join('\r\n');
}
