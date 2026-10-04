import test from 'node:test';
import assert from 'node:assert/strict';
import { financialSummary, financialCsv, shiftMonth } from './finance.js';

const booking = (id, overrides = {}) => ({ id, roomId: 'room', name: id, from: '2026-10-04', to: '2026-10-06', price: 80, deposit: 40, status: 'confirmed', source: 'Közvetlen', ...overrides });
const state = bookings => ({ rooms: [{ id: 'room', name: 'Fenyő' }], bookings });

test('Arrival month includes the full stay and excludes previous-month arrivals', () => {
  const report = financialSummary(state([booking('spans-month', { from: '2026-10-30', to: '2026-11-02' }), booking('previous', { from: '2026-09-30', to: '2026-10-02' })]), '2026-10');
  assert.equal(report.rows.length, 1);
  assert.equal(report.total, 240);
  assert.equal(report.paid, 40);
  assert.equal(report.remaining, 200);
});
test('Cancelled stays are excluded while checked-out stays remain in financial history', () => {
  const report = financialSummary(state([booking('cancelled', { status: 'cancelled' }), booking('departed', { status: 'checked-out' })]), '2026-10');
  assert.equal(report.cancelledCount, 1);
  assert.equal(report.rows[0].booking.id, 'departed');
  assert.equal(report.total, 160);
});
test('Money is summed in integer cents for partial, settled and free bookings', () => {
  const report = financialSummary(state([booking('partial', { price: 0.1, deposit: 0.1 }), booking('settled', { price: 0.15, deposit: 0.3 }), booking('free', { price: 0, deposit: 0 })]), '2026-10');
  assert.equal(report.total, 0.5);
  assert.equal(report.paid, 0.4);
  assert.equal(report.remaining, 0.1);
  assert.equal(report.unpaidCount, 1);
});
test('Manual source totals cover every included booking and use a missing-source label', () => {
  const report = financialSummary(state([booking('a'), booking('b'), booking('c', { source: 'Booking.com', price: 200 }), booking('d', { source: '' })]), '2026-10');
  assert.deepEqual(report.sources.map(({ source, count, total }) => ({ source, count, total })), [{ source: 'Booking.com', count: 1, total: 400 }, { source: 'Közvetlen', count: 2, total: 320 }, { source: 'Nem megadott', count: 1, total: 160 }]);
  assert.equal(report.sources.reduce((sum, source) => sum + source.total, 0), report.total);
});
test('Month navigation crosses year boundaries and rejects invalid periods', () => {
  assert.equal(shiftMonth('2026-12', 1), '2027-01');
  assert.equal(shiftMonth('2026-01', -1), '2025-12');
  assert.throws(() => financialSummary(state([]), '2026-13'), /Invalid month/);
  assert.equal(financialSummary(state([]), '2026-10').total, 0);
});
test('Filtered CSV preserves cents and currency, quotes text and neutralizes formulas', () => {
  const report = financialSummary(state([booking('a', { name: '=HYPERLINK("bad")', price: 80.25 }), booking('b', { name: 'Another guest' })]), '2026-10');
  const csv = financialCsv(report.rows.filter(row => row.booking.id === 'a'), 'HUF');
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes("'=HYPERLINK"));
  assert.ok(csv.includes('""bad""'));
  assert.ok(csv.includes('"160,50";"40,00";"120,50";"HUF"'));
  assert.ok(!csv.includes('Another guest'));
});
