# Connexa Studios — Linea Creativa

Documento vincolante. Ogni modifica al sito deve rispettare queste regole.
Se una scelta non è coperta qui, si decide insieme e si aggiorna questo file.

## 1. Colori (SOLO questi quattro)

| Nome | Hex | Uso |
|---|---|---|
| Nero profondo | `#0b0b0b` | Sfondo dominante, testo su lime |
| Nero superficie | `#0f0f0f` | Superfici secondarie scure |
| Verde Lime | `#c8f504` | Blocchi statement, CTA, enfasi, pattern, numeri |
| Bianco | `#ffffff` | Testo su nero |
| Grigio neutro | `#c6c6c6` | SOLO testi secondari/mute (mai come sfondo pieno) |

**Regole:**
- Il lime si usa in DUE modi: blocco pieno (sezioni intere, testo nero sopra) o segnale puntuale (parola chiave, numero, underline). Mai gradienti, mai trasparenze decorative.
- Alternanza dura tra sezioni: nero → lime → nero. Mai mezzi toni.
- Vietati: qualsiasi altro colore, gradienti, glassmorphism, ombre colorate.

## 2. Tipografia (SOLO questi font)

| Font | Peso | Uso |
|---|---|---|
| **Encode Sans** | 800 | Titoli display (hero, sezioni), UPPERCASE, letter-spacing -0.02em |
| **Encode Sans** | 700 | Sottotitoli, nomi progetto, bottoni, label |
| **Kanit** | 300/400 | Testi correnti, paragrafi |
| **Kanit** | 500 | Testi in evidenza dentro i paragrafi |
| Chakra Petch | 700 | SOLO wordmark logo in nav/footer (provvisorio, in attesa del logo definitivo) |

**Regole:**
- I titoli display sono SEMPRE uppercase.
- NIENTE corsivi: Encode Sans non ha l'italic, il finto corsivo è vietato. L'enfasi si fa col lime.
- Micro-label (eyebrow): 11px, uppercase, letter-spacing 0.24em, peso 700, trattino lime prima.
- Testo outline (`-webkit-text-stroke`) ammesso per parole giganti decorative (PARLIAMONE, RESTIAMO CONNESSI, ghost numbers).

## 3. Elementi firma

- **Pattern C**: la C del logo ripetuta in fila orizzontale (nera su lime, lime su nero). È l'equivalente della zigzag Verkz. Si usa: sotto i manifesti, sotto gli hero interni.
- **Ghost numbers**: numeri giganti outline (01/02/03) dietro le righe di contenuto.
- **Statement band**: striscia lime a tutta larghezza con tipografia gigante nera che scorre con lo scroll.
- **Punchline finale**: parola gigante outline che si riempie al hover (PARLIAMONE).
- **Rotor badge**: testo circolare rotante "RESTIAMO CONNESSI · CREATIVE STUDIO".

## 4. Componenti

- **Bottoni**: pillola (border-radius 999px), Encode Sans 700 uppercase, 13px, letter-spacing 0.1em. Primario: lime/nero. Su sfondo lime: nero/lime. Ghost: bordo hairline.
- **Card/blocchi**: angoli VIVI (border-radius 0) per tutto ciò che non è bottone.
- **Copertine progetti**: tipografiche, alternanza nero/lime, nome in Encode Sans 800 outline che si riempie al hover, micro-label settore, C nell'angolo. (In attesa delle copertine art-directed.)
- **Hairline**: bordi 1px rgba bianco 12% su nero, nero 14% su lime.

## 5. Motion

- Smooth scroll Lenis. Easing standard: `cubic-bezier(.32,.72,0,1)`. Mai `linear` o `ease-in-out` sulle interazioni.
- Reveal: fade-up 50px, ~1s. Con rete di sicurezza (nessun contenuto può restare nascosto).
- Scroll-driven (scrub): manifesto parola-per-parola, gallery orizzontale pinnata, statement band, wordmark hero che affonda, pattern C che marcia.
- Hover: scramble sui link grandi, fill verticale sui bottoni, magnetici sui CTA.
- Transizione pagina: tenda lime+nera con la C.
- VIETATO: 3D/WebGL (deciso il 2026-07-12), tilt 3D, skew da velocità, parallax aggressivi.

## 6. Tono di voce (copy)

- Frasi corte. A scatti. "Strategia. Esecuzione. Risultato."
- Niente retorica commerciale ("venite a trovarci", "sblocca il tuo potenziale").
- Sicurezza senza esagerazione: si afferma, non si promette.
- Italiano, uppercase nei display.

## 7. Riferimento

La stella polare visiva è il brand system **Verkz Company** (board Instagram condivisi il 2026-07-12): blocchi lime, tipografia bold tagliata, pattern geometrici ripetuti, alternanza nero/lime, mockup dark.

## 8. File

- `assets/css/main.css` — stili (le sezioni in coda al file sono i pass evolutivi; la cascata vince in basso)
- `assets/js/main.js` — motion condiviso
- `assets/img/logo-mark.png` — C lime (simbolo)
- `assets/img/logo-full.png` — wordmark completo (in revisione da parte di Carmine)
- Cache-busting: ogni deploy aggiorna `?v=` su CSS/JS

---

## Aggiornamenti 12/07/2026 (sera)

- **Regola enfasi definitiva**: ogni parola enfatizzata è un chip `#0b0b0b` con testo lime, su qualsiasi sfondo. Mai sottolineature dello stesso colore dello sfondo.
- **Logo definitivo**: SVG di Carmine (C + connexa ottagonale + ©), 5 varianti in `assets/img/`. Favicon = app icon lime (Asset 24).
- **Cover progetti**: board art-directed in `assets/img/covers/` (web 1400×830 + Instagram 1080×1080). Sorgente rigenerabile: `covers.html` nello scratchpad di sessione.
- **Pattern pagina interna**: hero → banda statement lime → contenuto → CTA lime. Case study: cover come sfondo hero + banda payoff + nav prev/next.
- **Sezioni firma home**: card servizi impilate (sticky+squash), position statement ("Il mercato non premia il migliore..."), gallery orizzontale pinnata con cover.
- **Easter egg**: 5 click rapidi sul logo → flash lime "RESTIAMO CONNESSI".
- **Vincoli tecnici**: Lenis syncTouch su mobile; niente `filter` animati (solo transform/opacity); grana statica; cache-busting `?v=` a ogni deploy; verifica SEMPRE con screenshot Playwright prima del push.
