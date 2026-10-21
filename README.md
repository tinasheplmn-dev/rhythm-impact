# Rhythm Impact, website

Statische website (6 pagina's) voor Rhythm Impact, drum- en slagwerkschool in Berlicum en Sint-Michielsgestel. Visueel herbouwd in oktober 2026 volgens de website-bouwen-skill; de inhoud van de vorige versie (teksten, tarieven, lestijden, verenigingen, formulieren, contactgegevens) is behouden. De vorige versie staat in `_bouw/vorige-versie/`.

## Concept: het moment van de slag

De site draait om de fractie waarin de stok het vel raakt: de impact uit de naam, en wat de school belooft (vanaf de eerste les meteen spelen).

- **Hero**: beeldvullende foto van een drummer op het raakmoment, in paars podiumlicht. Daaroverheen een ingetogen schokgolf die op de beat (96 BPM) vanuit het raakpunt van de stok door het beeld gaat, met op elke vierde tel de spikes uit het woordmerk. Geen klik- of tikbediening, geen geluid, geen hint. Lichter op mobiel, uit bij verminderde beweging, pauzeert buiten beeld (`js/hero-slag.js`). De oude tik-code, de count-in en de WebAudio-drums zijn verwijderd.
- **Eén idee per sectie**: USP's als vastgeplakte setlists, disciplines als flightcases met metalen hoeken en maatsoort, routes op een notenbalk, het verhaal met de oprichter, filmstroken met eigen beeld die tegen elkaar in schuiven op scroll (het scroll-effect van de site), twee studio's als beeldtegels, donkere slotband.
- **Motion**: secties zweven op met stagger (fail-open, vier vangnetten), hero-opening waarin de kop erin slaat, zwevend naamkaartje bij de oprichter, hover-lift. Verminderde beweging krijgt zachte fades.
- **Mobiel**: hero als beeldband met de tekst eronder, rijen van drie als carrousel, vaste actiebalk (Boek een proefles + Contact) zodra de paginakop uit beeld is, lange verenigingenlijst ingeklapt.

## Keuzes

| | Keuze | Waarom |
|---|---|---|
| Basis | #0b0812 podiumzwart, #140d1f fluweel, #1d1430 kaarten | Klantwens: donker. Fluweel geeft ritme zonder lichte secties. |
| Merk | #c211b8 impact-paars voor knoppen en lijnen | Bestaande merkkleur, op verzoek behouden. Knoptekst staat in Khand 700 op 19,5 px of groter, zodat wit op paars (5,2:1) aan de lat voor grote tekst voldoet. |
| Kleine paarse tekst | #f27be8 | #c211b8 haalt als kleine tekst op donker geen 7:1; deze tint wel (8:1). |
| Tweede kleur | #dcb56f koper | Het bekken. Alleen voor onderscheidingen, maatsoort en lestijden. |
| Tekst | #f4f0f7 en #cfc5da | Beide ruim boven 7:1 op elke donkere ondergrond. |
| Koppen en knoppen | Khand | Uit de bestaande huisstijl, smal en krachtig. |
| Tekst | Switzer | Uit de bestaande huisstijl, rustig op donker. |
| Labels | Martian Mono | Vervangt JetBrains Mono, dat in te veel sites zit. |
| Vorm | Kaarten bijna scherp (2 px), knoppen en labels schuin (-9 graden) | Volgt de hoek van het woordmerk. |

Het SVG-woordmerk (RHYTHM / IMPACT met inslag-spikes) en de favicon zijn ongewijzigd. Alle fonts en iconen staan lokaal (`assets/fonts`, `assets/iconen.svg`).

## Beeld

Alle stock komt van Unsplash; per bestand staan fotograaf, id en bewerking in `_bouw/stock/bronnen.md`. De hero is "drummer on stage" van **Aliane Schwartzhaupt** (gespiegeld, turquoise licht naar paars verschoven). Verder: Josh Sorenson, Kwami Fattah Al Sissi, Alex Cooper, Vitalii Khodzinskyi, Diane Picchiottino, kevin Baquerizo, WolffStudios W!, Marcelo Leal, Matthijs Smit, israel palacio, Laura Rivera, John Matychuk en Abib.

Eigen foto's van Rhythm Impact zijn gebruikt waar ze scherp en groot genoeg zijn: Tonn van de Veerdonk (verhaal), de studio's in Berlicum en De Meander, en een filmstrook met voorspeelmiddag, optreden, drumles, workshoptrommels en lesstudio's. De drie oude lesaanbodfoto's zijn vervangen. Nergens stock bij reviews.

## Draaien en uitrollen

```bash
node server.js            # http://localhost:8057
node _bouw/bouw.mjs       # na een wijziging in _bouw/paginas/ of in de kop/voet
```

De pagina's in de root worden gegenereerd uit `_bouw/bouw.mjs` (kop, menu, footer, actiebalk, meta) en `_bouw/paginas/*.html` (inhoud). Wijzig de inhoud daar en draai het bouwscript; wijzig de root-bestanden niet met de hand.

Uitrollen: de map naar elke statische host (Vercel, Netlify, gewone webhosting). `vercel.json` staat klaar; `.vercelignore` laat `_bouw`, `server.js` en deze README buiten de upload. Bij andere hosts: upload alles behalve `_bouw/` en `server.js`.

## Formulieren

Via mailto, zonder server: proefles en samenwerking naar info@rhythmimpact.nl, workshops naar patrick@rhythmimpact.nl. Het formulier controleert de verplichte velden en opent het mailprogramma met een net opgemaakt bericht.

## Reviews

Er zijn geen echte reviews aangeleverd. De verzonnen voorbeeldquotes uit de vorige versie zijn verwijderd en de sectie staat bewust niet op de site: een lege reviewsectie oogt onaf. De sectie is wel gebouwd (uitgelichte review groot plus raster, op mobiel een carrousel) en staat klaar in `_bouw/reviews-voorbeeld.html` (lokaal te bekijken op http://localhost:8057/_bouw/reviews-voorbeeld.html). De CSS staat al in `css/style.css`. Zodra er echte reviews zijn: volg de stappen bovenin dat bestand (sectie naar `_bouw/paginas/index.html`, kaarten vullen met echte tekst en naam, link naar het Google-profiel met het echte aantal, `node _bouw/bouw.mjs`).

## Open punten (vóór livegang bevestigen)

1. **Reviews**: 5 tot 10 echte reviews van leerlingen of ouders aanleveren, plus de link naar het Google-bedrijfsprofiel en de score.
2. **Tarieven** (lesaanbod) zijn overgenomen van de vorige site: bevestigen dat ze voor het huidige seizoen kloppen, inclusief losse lessen en examentarieven.
3. **Lestijden** ma-vr 8.30-21.00 en za 8.30-13.00 bevestigen (ook gebruikt in de structured data).
4. **"Zo'n 600 leerlingen"** en **"ruim 75 jaar ervaring"** staan op de huidige over-ons-pagina; bevestigen dat ze nog actueel zijn.
5. **Leeftijd jeugd**: de vorige versie noemde "vanaf ±6 jaar"; dat stond niet in de bron en is weggelaten. Wil je een minimumleeftijd noemen, geef hem door.
6. **Proefles**: de oude paginatitel noemde de proefles gratis; dat is niet bevestigd en weggehaald. Is de proefles gratis, dan is dat een sterk punt voor de hero en de proeflespagina.
7. **Eigen beeld**: een korte fotoshoot in de studio's (leerlingen achter het stel, docenten in actie, liefst bij gedimd of gekleurd licht) kan de stockfoto's bij de disciplines en de paginakoppen vervangen. Zelfde bestandsnamen terugzetten is genoeg.
8. **Teamfoto's** van de andere docenten zijn te klein (300 tot 700 px) voor een teamsectie; grotere versies aanleveren als er een teampagina moet komen.
9. **Domein**: canonical, sitemap en Open Graph verwijzen naar https://rhythmimpact.nl. Pas `DOMEIN` in `_bouw/bouw.mjs` aan als de site ergens anders komt.

## Controle

- Keuring (`keuring.mjs`): 0 fouten, 0 waarschuwingen.
- Contrast (`contrast.js`) op alle 6 pagina's op 1440 en 375 breed: 0 meldingen.
- Metingen (`meten.js`): geen horizontale scroll, bullets en subkoppen op één regel, tikdoelen in orde. Bewust laten staan: (a) "onzichtbare inhoud" op mobiel is het dichte uitschuifmenu; (b) leesbreedte op de home meet de tekst in een USP-kaart (38 tekens in een raster van drie); (c) op de proeflespagina telt de paginakop op mobiel niet als "sectie met padding", omdat de foto daar zonder bovenmarge tegen de header staat.
