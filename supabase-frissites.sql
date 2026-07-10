-- ─────────────────────────────────────────────
--  FRISSÍTÉS: a vendégútmutató nyilvános elérése
--  (a QR-kódról megnyitott oldalnak kell)
-- ─────────────────────────────────────────────
create policy "Nyilvanos utmutato olvasasa"
  on public.properties for select
  using (true);
