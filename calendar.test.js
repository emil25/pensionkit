import test from 'node:test';
import assert from 'node:assert/strict';
import { monthDays, dayAvailability } from './calendar.js';
const state = { rooms: [{id:'a'}, {id:'b'}], bookings: [{id:'x',roomId:'a',from:'2026-10-04',to:'2026-10-06',status:'confirmed'}, {id:'cancel',roomId:'b',from:'2026-10-04',to:'2026-10-06',status:'cancelled'}, {id:'left',roomId:'b',from:'2026-10-01',to:'2026-10-04',status:'checked-out'}] };
test('Month weeks begin on Monday and include all dates including leap February',()=>{
  const october=monthDays('2026-10'); assert.equal(october[0],'2026-09-28'); assert.equal(october.at(-1),'2026-11-01'); assert.equal(october.length,35);
  assert.ok(monthDays('2028-02').includes('2028-02-29')); assert.equal(monthDays('2026-02').length,35);
});
test('Six-week month and year boundaries retain complete calendar dates',()=>{assert.equal(monthDays('2026-03').length,42);assert.ok(monthDays('2026-12').includes('2027-01-01'));assert.throws(()=>monthDays('2026-13'));});
test('Arrival occupies a night, departure frees the room, cancellation does not occupy',()=>{const day=dayAvailability(state,'2026-10-04');assert.equal(day.stays.length,1);assert.equal(day.arrivals.length,1);assert.deepEqual(day.free.map(r=>r.id),['b']);assert.equal(dayAvailability(state,'2026-10-06').free.length,2);});
test('Room filter applies to guests and availability while preserving departure history',()=>{const day=dayAvailability(state,'2026-10-04','b');assert.equal(day.rooms.length,1);assert.equal(day.stays.length,0);assert.equal(day.free.length,1);assert.equal(day.departures[0].id,'left');assert.equal(dayAvailability(state,'2026-10-04','a').departures.length,0);});
test('Empty property has no invented guests or free rooms',()=>{const day=dayAvailability({rooms:[],bookings:[]},'2026-10-04');assert.equal(day.free.length,0);assert.equal(day.stays.length,0);});
