# A kapott pensionkit.zip átvizsgálása és átvétele

Forrás: a 2026. október 8-án kapott ZIP. A meglévő, működő PensiuneKitbe célzottan kerültek át a hasznos ötletek; a korábbi helyi és felhőmentés, foglalási adatok és mobilos havi naptár megmaradtak.

## Átvett és továbbjavított elemek

- Krémszínű háttér, karakteresebb főcím, sötétzöld házigazda-kártya; előrébb kerülő termékelőnézet és hangsúlyos, sötétzöld árblokk.
- Választható vendégtelefonszám, hívás és WhatsApp-megnyitás; az üzenetsegéd a szerkesztett szöveget készíti elő. Automatikus üzenetküldés nincs.
- Külső .ics naptárfájlok szobánkénti beolvasása: előzetes áttekintés, ütközések és ismételt UID-k ellenőrzése, hibás és nem támogatott események listája. Ár nincs kitalálva: 0-ról kézzel egészíthető ki.
- Szobánkénti, vendégadatok nélküli iCal-export; stabil eseményazonosítók, UTF-8 szerinti sorhajtás és kizáró távozási dátum az [iCalendar szabvány](https://www.rfc-editor.org/info/rfc5545/) alapján.
- Négy nyelven választható vendégútmutató, külön szerkeszthető román, angol és német szövegekkel. Hiányzó fordításnál a magyar tartalom marad meg, ezt az adott nyelven jelzi. Az útmutató nyelvválasztása JavaScript nélkül is működik.
- Letölthető, A5-ös nyomtatásra kész QR-kártya a szállás és WiFi adataival. A QR-kódhoz a saját, közzétett útmutató tényleges webcíme szükséges.
- Foglalás visszavonása az adatok megtartásával; foglalás nélküli szoba megerősített törlése. A foglalással rendelkező szobák törlése tiltott, történeti hivatkozások is megmaradnak.
- Megosztási előnézethez szükséges OpenGraph-adatok.

## Amit pontosítottunk

A ZIP „szinkronként” hirdetett funkciója kézi fájlimport és -export. Nem állítunk automatikus Booking.com/Airbnb frissítést vagy közzétett naptárfeedet. A beolvasás nem törli és nem módosítja automatikusan a korábbi foglalásokat; változott és lemondott külső eseményeket a gazdának kell egyeztetnie. Ismétlődő és óra szerinti eseményeket külön jelzünk, nem alakítjuk őket találgatással szállásfoglalássá.

A ZIP útmutatója csak a címeket fordította; a saját tartalomhoz valódi fordításmezők készültek. A honlapra nem került át a fejlesztői audit és az eredeti oldalra vonatkozó, részben elavult hibalista. A fizetős csomagok tervezett státusza egyértelmű maradt. A pénzügyek továbbra is választhatóak, IFA- vagy kötelező fizetési folyamatot nem építettünk be.

## Ellenőrzés

42 automatikus ellenőrzés, sikeres gyártási build; helyi böngészős próbában import, telefonszám mentés, hívás/WhatsApp link, saját fordítás mentése és QR-kártya tényleges letöltése. A korábbi, telefonszám és fordítások nélküli mentések továbbra is érvényesek.
