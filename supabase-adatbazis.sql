-- ─────────────────────────────────────────────────────────────
--  PensiuneKit adatbázis-beállítás
--  Ezt a teljes szöveget másold be a Supabase SQL Editor-ba,
--  majd kattints a RUN gombra. Egyszer kell lefuttatni.
-- ─────────────────────────────────────────────────────────────

-- A szállások adatai (felhasználónként egy sor)
create table if not exists public.properties (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Biztonság: mindenki csak a SAJÁT adatait éri el
alter table public.properties enable row level security;

create policy "Sajat adat olvasasa"
  on public.properties for select
  using (auth.uid() = user_id);

create policy "Sajat adat letrehozasa"
  on public.properties for insert
  with check (auth.uid() = user_id);

create policy "Sajat adat modositasa"
  on public.properties for update
  using (auth.uid() = user_id);
