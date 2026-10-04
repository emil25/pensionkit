import { migrateProperty } from './model.js';

export async function loadWorkspace(client, userId) {
  const result = await client.from('workspaces').select('data').eq('user_id', userId).maybeSingle();
  if (!result.error && result.data) return { state: migrateProperty(result.data.data), warning: '' };
  const legacy = await client.from('properties').select('data').eq('user_id', userId).maybeSingle();
  const state = legacy.data ? migrateProperty(legacy.data.data) : null;
  const warning = result.error
    ? ['42P01', 'PGRST205'].includes(result.error.code)
      ? 'A védett felhőmentéshez még szükséges az adatbázis frissítése. Addig az adataid ezen az eszközön mentődnek.'
      : 'A felhőadatokat most nem sikerült betölteni. Addig az adataid ezen az eszközön mentődnek.'
    : legacy.error ? 'A korábbi szállásadatok most nem tölthetők be. A felhőmentés egyelőre nem elérhető.' : '';
  return { state, warning };
}

export async function saveWorkspace(client, userId, state) {
  // The legacy properties table may have a public SELECT policy. Never put
  // reservations, guest details or task notes into it.
  const { error } = await client.from('workspaces').upsert({ user_id: userId, data: state, updated_at: new Date().toISOString() });
  if (error) throw new Error('A felhőmentés nem sikerült. A helyi példány megmaradt.');
}
