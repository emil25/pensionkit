-- ─────────────────────────────────────────────────────────────

begin;
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

drop policy if exists "Sajat adat olvasasa" on public.properties;
create policy "Sajat adat olvasasa"
  on public.properties for select
  using (auth.uid() = user_id);

drop policy if exists "Sajat adat letrehozasa" on public.properties;
create policy "Sajat adat letrehozasa"
  on public.properties for insert
  with check (auth.uid() = user_id);

-- A régi frissítés a teljes properties táblát nyilvánossá tette.
-- A vendégútmutató ezentúl csak a külön public_guides táblából olvasható.
drop policy if exists "Nyilvanos utmutato olvasasa" on public.properties;

-- Foglalások, vendégadatok, teendők: kizárólag a tulajdonos olvashatja.
create table if not exists public.workspaces (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  updated_at timestamptz not null default now()
);
alter table public.workspaces enable row level security;
revoke all on public.workspaces from anon;
grant select, insert, update, delete on public.workspaces to authenticated;
drop policy if exists "Sajat munkaterulet" on public.workspaces;
create policy "Sajat munkaterulet" on public.workspaces
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Publikus útmutatók: csak a vendégeknek szánt, felsorolt tudnivalók.
create table if not exists public.public_guides (
  user_id uuid primary key references auth.users (id) on delete cascade,
  slug text not null,
  published boolean not null default true,
  data jsonb not null check (
    jsonb_typeof(data) = 'object' and
    data - array['name','tagline','desc','address','phone','email','checkin','checkout',
                 'wifiName','wifiPass','breakfast','parking','rules','guideUrl']::text[] = '{}'::jsonb
  ),
  updated_at timestamptz not null default now()
);
create index if not exists public_guides_slug_idx on public.public_guides (slug);
alter table public.public_guides enable row level security;
grant select on public.public_guides to anon, authenticated;
grant insert, update, delete on public.public_guides to authenticated;
drop policy if exists "Kozzetett utmutatok" on public.public_guides;
create policy "Kozzetett utmutatok" on public.public_guides
  for select to anon, authenticated using (published = true or auth.uid() = user_id);
drop policy if exists "Sajat utmutato" on public.public_guides;
create policy "Sajat utmutato" on public.public_guides
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- A korábbi QR-linkek a megadott sluggal tovább használhatók.
-- Vendéglista, foglalás, szobabeosztás vagy teendő soha nem kerül ide.
insert into public.public_guides (user_id, slug, data)
select p.user_id, p.data->>'slug', (
  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb)
  from jsonb_each(p.data)
  where key = any(array['name','tagline','desc','address','phone','email','checkin','checkout',
                       'wifiName','wifiPass','breakfast','parking','rules','guideUrl'])
    and jsonb_typeof(value) = 'string'
)
from public.properties p
where jsonb_typeof(p.data->'name') = 'string'
  and nullif(trim(p.data->>'slug'), '') is not null
on conflict (user_id) do nothing;

drop policy if exists "Sajat adat modositasa" on public.properties;
create policy "Sajat adat modositasa"
  on public.properties for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

commit;
