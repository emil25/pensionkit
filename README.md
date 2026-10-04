# PensiuneKit — kis szállás, nagy odafigyelés

Kis panziók, családi vendégházak és kiadó házak napi munkájára készült felület. A főoldal és a munkaterület 2026. október 4-én kapott új megjelenést és működő foglaláskezelést.

## Kipróbálás

1. `npm ci`
2. `npm run dev`
3. Nyisd meg a terminálban megjelenő helyi címet.

Útvonalak:

- `/`: bemutatkozó főoldal.
- `/#demo`: mintaszállás, külön mentéssel. A Beállításokban újraindítható.
- `/#app`: saját szállás. Beállított Supabase esetén belépés, különben helyi munkaterület.
- `/#local`: saját helyi munkaterület bejelentkezés nélkül.

## Ami működik

- Háromlépéses első szállásbeállítás: alapadatok és pénznem, külön szobák vagy teljes kiadó ház, vendégtudnivalók. A befejezéskor egyben ment; a már felvett szobákat és foglalásokat nem írhatja felül.
- Indulási lista a saját áttekintésen, valós mentett adatokból számolt előrehaladással és az első foglaláshoz vezető gombbal.
- Saját szállásbeállítások, szobák és teljes kiadó házak felvétele.
- Foglalás rögzítése, szerkesztése, lemondása és keresése.
- Időpontütközés, férőhely, érvényes dátum és befizetés ellenőrzése.
- Kéthetes szobánkénti naptár. A távozás napja újra foglalható.
- Napi érkezések, várható távozások, foglalt szobák és takarítási állapot.
- Érkeztetés tiszta szobába, távozáskor takarításra jelölés.
- Saját teendőlista.
- Magyar, román, angol és német szerkeszthető vendégüzenetek. A szövegsegéd sablonokat használ.
- Szerkeszthető magyar marketingvázlat saját időponthoz és ajánlathoz.
- Vendégútmutató szerkesztése, mobilos előnézet és önálló HTML-letöltés.
- Nyilvános útmutatócímhez valódi QR-kód, nyomtatható SVG-letöltéssel.
- Saját bemutatkozó szállásweboldal előnézete és HTML-letöltése.
- Foglalási CSV-export, teljes JSON-biztonsági másolat és ellenőrzött visszaállítás.
- Automatikus helyi mentés, külön kulccsal a demóhoz, a saját helyi munkaterülethez és az egyes belépett fiókokhoz.

## Felhőbe mentés

A meglévő Supabase-fiókhoz használható. Állítsd be a Vercel környezeti változóit a `.env.example` alapján, vagy tartsd meg a meglévő `config.js` nyilvános Supabase-beállításait. A `service_role` kulcsot soha ne add meg a böngészőben futó alkalmazásnak.

A `supabase-adatbazis.sql` (és az azonos `supabase-frissites.sql`) külön védett `workspaces` táblát hoz létre a foglalásoknak és vendégadatoknak. A régi `properties` tábla nyilvános olvasási szabályát megszünteti, és a korábbi vendégútmutatók kizárólag szűrt, publikus tudnivalóit külön `public_guides` táblába másolja. A régi `#g/slug` QR-linkek tovább működhetnek. A teljes munkaterület soha nem kerül a régi nyilvános táblába. A migrációt a Supabase SQL-szerkesztőben egyszer le kell futtatni; amíg hiányzik a védett tábla, a felhőmentés le van tiltva, a helyi mentés használható. A SQL ismételten futtatható. A jelszó-visszaállító és megerősítő levél visszairányításához engedélyezd a saját webcímedet a Supabase-ben.

A felhőmentés kézzel indul a felső sávban. Ez a változat egy szállás egyetlen tulajdonosának munkaterületére készült; nem biztosít egyidejű többfelhasználós szerkesztést vagy változásösszefésülést. A sikeres felhőmentés előtt az adatokat helyben tartja meg. A felhőbe történő mentés a teljes aktuális munkaterületet menti el.

## Közzététel a meglévő Vercel-projektben

1. A projekt gyökerében lévő forrásfájlokat töltsd fel a meglévő GitHub-tárhelyre. A `node_modules`, `original-source`, `artifacts`, `.env` és ZIP-fájlok nem részei a feltöltendő forrásnak.
2. Vercel: Vite projekt, build parancs `npm run build`, kimeneti mappa `dist`.
3. A meglévő Supabase-beállításokat őrizd meg. A közzététel nem hoz létre adatbázist és nem állít be külső szolgáltatásokat magától.

A letölthető vendégútmutatót külön nyilvános címre kell feltölteni a QR-kódos megosztáshoz. A letölthető szállásweboldal érdeklődésgombja e-mailt nyit, nem foglal automatikusan.

## Még nincs bekötve

Automatikus Booking.com/Airbnb szinkron, valódi AI-végpont, automatikus üzenetküldés, online fizetés, számlázás és nyilvános útmutató automatikus publikálása. Ezeket a felület nem jelzi kész szolgáltatásként. A Supabase-belépés és felhőmentés élő ellenőrzése a szolgáltatás beállítása után végezhető el.

## Ellenőrzés

`npm run build` és `node --test model.test.js cloud.test.js setup.test.js` (19 teszt).

A böngészős ellenőrzés lefedte a foglalás létrehozását, az ütközésjelzést, az újratöltés utáni mentést, a takarítás–érkeztetés–távozás folyamatát, a QR-kód elkészítését, az üzenetsablonokat és a mobilos navigációt.

Az eredeti helyi forrás másolata a fejlesztési munkamappa `original-source` almappájában maradt meg.

A főoldal Árak szakasza (#pricing) az eredeti díjakat mutatja: Ingyenes 0 €, Starter 12 €/hó (évesen 108 €), Pro 29 €/hó (évesen 288 €). A Starter és Pro egyértelműen tervezett csomagok; a felsorolt bővítések nem aktív fizetős szolgáltatások. Fizetés és előfizetés nem történik. A jelenlegi helyi munkaterület összes funkciója ingyen elérhető. Az új főoldal saját landing.css stíluslapot használ.
