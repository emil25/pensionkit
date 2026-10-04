import test from 'node:test';
import assert from 'node:assert/strict';
import { createState } from './model.js';
import { loadWorkspace, saveWorkspace } from './cloud.js';

function clientFixture(results) {
  const calls = [];
  return { calls, from(table) {
    calls.push({ action: 'from', table });
    return { select() { return this; }, eq(key, value) { calls.push({ action: 'filter', key, value }); return this; }, async maybeSingle() { return results[table] || { data: null, error: null }; }, async upsert(data) { calls.push({ action: 'upsert', table, data }); return results[table] || { error: null }; } };
  } };
}
test('Private reservations are written only to the protected workspace table', async () => {
  const client = clientFixture({}); const state = createState(true);
  await saveWorkspace(client, 'owner', state);
  assert.deepEqual(client.calls.filter(c => c.action === 'from').map(c => c.table), ['workspaces']);
  assert.equal(client.calls.find(c => c.action === 'upsert').data.user_id, 'owner');
});
test('Missing private table permits legacy reads and disables cloud writes with a warning', async () => {
  const client = clientFixture({ workspaces: { error: { code: '42P01' } }, properties: { data: { data: { name: 'Régi vendégház' } }, error: null } });
  const result = await loadWorkspace(client, 'owner');
  assert.equal(result.state.property.name, 'Régi vendégház'); assert.equal(result.state.bookings.length, 0); assert.match(result.warning, /adatbázis frissítése/);
  assert.ok(client.calls.filter(c => c.action === 'filter').every(c => c.key === 'user_id' && c.value === 'owner'));
});
test('Existing private data loads without querying the public legacy table', async () => {
  const state = createState(true); const client = clientFixture({ workspaces: { data: { data: state }, error: null } });
  const result = await loadWorkspace(client, 'owner'); assert.equal(result.state, state); assert.equal(result.warning, '');
  assert.deepEqual(client.calls.filter(c => c.action === 'from').map(c => c.table), ['workspaces']);
});
test('Cloud errors cannot be reported as successful saves', async () => {
  const client = clientFixture({ workspaces: { error: { code: 'network' } } });
  await assert.rejects(saveWorkspace(client, 'owner', createState(false)), /helyi példány megmaradt/);
});
