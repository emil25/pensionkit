# Amplifier és Jev a fejlesztéshez

A PensiuneKit fejlesztési segédjei külön működnek a vendégház-kezelő felülettől. A weboldal nem küld vendégadatot a Jevnek, és a szállásdíjakat továbbra is a saját kódja számolja.

## Elkészült

- A hivatalos `typesafe-ai` és `amplifier-agent` Codex-skillek telepítve vannak ezen a gépen a `C:\Users\emil\.codex\skills` mappában. A következő üzenettől érhetők el az ügynök számára.
- A `tools/jev-review.mjs` fejlesztői ellenőrző a TypeSafe hivatalos API-jára kapcsolódik. Két kérdést tesz fel egy szándékosan megírt változtatásleírásról: illeszkedik-e a feladat a kis szállásokhoz, és melyik területet érdemes még ellenőrizni.
- Kulcs nélkül működő előnézet és hálózat nélküli integrációs tesztek készültek. A bemenet kizárólag a `userRequest`, `changeSummary` és `checks` szöveges mezőt tartalmazhatja; más bemeneti mezőket a segéd nem továbbít.

## Használat

Node.js 20 vagy újabb szükséges. A projekt gyökeréből:

```text
npm run dev:jev -- --preview
npm run dev:jev -- --preview sajat-valtoztatas.json
```

Az előnézet megmutatja az elküldendő kérést; nem hívja meg a szolgáltatást. A `tools/jev-review.example.json` csak bemeneti példa. A saját leírásba a tényleges teszteredményeket kell beírni. Ne másolj bele kulcsot, személyes vendégadatot vagy mentett foglalásokat.

Élő ellenőrzéshez a fejlesztői folyamat környezetében állítsd be a `TYPESAFE_API_KEY` változót, majd:

```text
npm run dev:jev -- --live sajat-valtoztatas.json
```

A kulcs nem kerülhet `VITE_` változóba, a böngészőbe vagy a GitHubra. A segéd nem olvas automatikusan `.env` fájlt. Az élő hívás a TypeSafe szolgáltatását használja és annak díjszabása szerint kerülhet pénzbe.

A visszaadott kategóriák, valószínűségek és bizonyosság fejlesztői véleményt adnak. A kimenet mindig `advisoryOnly: true` és `developer-review-required`: önmagában nem engedélyez módosítást vagy közzétételt, és nem helyettesít működési tesztet. Hiányos válasz vagy szolgáltatáshiba esetén a segéd hibát jelez.

## Ami még nincs aktiválva

Ezen a gépen nincs beállítva TypeSafe API-kulcs; élő Jev-hívást nem végeztünk. A Microsoft Amplifier Agent motorja és modellszolgáltatója sincs telepítve vagy beállítva. Az útmutató telepítése nem kapcsol be egy külön „Amplifiers módot” a Codexben.

Ha önálló Amplifier Agent futtatás is szükséges, a telepített hivatalos skill és az aktuális Microsoft-telepítési útmutató alapján kell kiválasztani a géppel kompatibilis futtatókörnyezetet és a modellszolgáltatót. A projekt jelenleg a Codexben fejleszthető; a Jev segéd a fejlesztői folyamatból külön hívható.

## Források

- [TypeSafe API](https://docs.typesafe.ai/api)
- [Jev a fejlesztői ügynökök mellett](https://docs.typesafe.ai/introduction/coding-agents)
- [TypeSafe agent skill](https://github.com/typesafe-ai/skills)
- [Microsoft Amplifier Agent](https://github.com/microsoft/amplifier-agent)
