import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, validateState } from './model.js';
import { prepareSetup, setupSteps } from './setup.js';

const room = (extra = {}) => ({ id: 'first-room', name: ' Fenyő ', number: ' 01 ', capacity: '2', price: '120.50', ...extra });
const property = (state, extra = {}) => ({ ...state.property, name: ' Kis Vendégház ', ...extra });

test('Setup creates a valid workspace atomically and preserves previous details and tasks', () => {
  const state = createState(false);
  state.property.desc = 'A már megadott bemutatkozás';
  state.tasks.push({ id: 't1', text: 'Reggeli egyeztetése', done: false });
  const before = JSON.stringify(state);
  const next = prepareSetup(state, property(state, { currency: 'HUF', wifiName: 'VendegWifi' }), [room()]);
  assert.equal(JSON.stringify(state), before);
  assert.equal(next.property.name, 'Kis Vendégház');
  assert.equal(next.property.currency, 'HUF');
  assert.equal(next.property.desc, state.property.desc);
  assert.deepEqual(next.tasks, state.tasks);
  assert.equal(next.rooms[0].price, 120.5);
  assert.equal(next.rooms[0].name, 'Fenyő');
  assert.equal(next.rooms[0].clean, true);
  assert.equal(validateState(next), true);
});

test('Setup refuses to replace established rooms or reservations', () => {
  const state = createState(true);
  const before = JSON.stringify(state);
  assert.throws(() => prepareSetup(state, property(state), [room()]), /már elindítottad/);
  assert.equal(JSON.stringify(state), before);
});

test('Invalid capacity and room prices cannot enter the workspace through setup', () => {
  const state = createState(false);
  for (const capacity of ['', '0', '1.5', '51', 'invalid']) assert.throws(() => prepareSetup(state, property(state), [room({ capacity })]), /férőhely/);
  for (const price of ['', '-1', 'Infinity', 'invalid']) assert.throws(() => prepareSetup(state, property(state), [room({ price })]), /árat/);
  assert.equal(prepareSetup(state, property(state), [room({ price: '0' })]).rooms[0].price, 0);
  assert.equal(state.rooms.length, 0);
});

test('Setup checks required details, times, currency, room labels and duplicate identifiers', () => {
  const state = createState(false);
  assert.throws(() => prepareSetup(state, property(state, { name: ' ' }), [room()]), /nevét/);
  assert.throws(() => prepareSetup(state, property(state, { currency: 'USD' }), [room()]), /pénznemet/);
  assert.throws(() => prepareSetup(state, property(state, { checkin: '25:00' }), [room()]), /időt/);
  assert.throws(() => prepareSetup(state, property(state, { email: 'bad@example' }), [room()]), /e-mail/);
  assert.throws(() => prepareSetup(state, property(state), []), /legalább/);
  assert.throws(() => prepareSetup(state, property(state), [room({ number: ' ' })]), /jelölést/);
  assert.throws(() => prepareSetup(state, property(state), [room(), room({ id: 'second-room' })]), /különböző/);
  assert.throws(() => prepareSetup(state, property(state), [room(), room({ number: '02' })]), /nem menthetők/);
});

test('Setup checklist reflects saved data; default times alone do not complete guest information', () => {
  const state = createState(false);
  assert.deepEqual(setupSteps(state).map(step => step.done), [false, false, false, false]);
  const ready = prepareSetup(state, property(state, { parking: 'Az udvarban.' }), [room()]);
  assert.deepEqual(setupSteps(ready).map(step => step.done), [true, true, true, false]);
  assert.deepEqual(setupSteps(createState(true)).map(step => step.done), [true, true, true, true]);
});
