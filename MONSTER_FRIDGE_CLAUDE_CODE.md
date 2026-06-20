# 🟢 Monster Energy Fridge App — Claude Code Spec

## Wat te bouwen

Een **React + Vite** web-app: een interactieve Monster Energy koelkast waar je alle smaken kunt browsen, dranken kunt loggen met een rating, en de volgorde van blikjes zelf kunt bepalen via drag & drop.

---

## Stack

- **React 18** (met Vite)
- **TypeScript**
- **Tailwind CSS** (voor utilities)
- **@dnd-kit/core + @dnd-kit/sortable** (drag & drop)
- **Zustand** (state management)
- **localStorage** (persistentie — geen backend nodig)

---

## Installatie & start

```bash
npm create vite@latest monster-fridge -- --template react-ts
cd monster-fridge
npm install
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities zustand
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

---

## Fonts (index.html `<head>`)

```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

---

## CSS variabelen (globals.css)

```css
:root {
  --green: #39FF14;
  --green-dim: rgba(57, 255, 20, 0.15);
  --green-glow: 0 0 20px rgba(57, 255, 20, 0.5);
  --dark: #050505;
  --metal: #1a1a1a;
  --metal2: #252525;
}

body {
  background: var(--dark);
  color: #fff;
  font-family: 'Inter', sans-serif;
}
```

---

## Data — alle smaken (`src/data/monsters.ts`)

Maak een array `MONSTERS: Monster[]` met dit type:

```ts
export type Monster = {
  id: string;
  name: string;
  flavor: string;
  caffeine: string;
  cat: 'Original' | 'Ultra' | 'Juice' | 'Java' | 'Rehab' | 'Special';
  // Blikje kleuren
  c1: string;  // donkere kleur
  c2: string;  // lichte/accent kleur
  str: string; // streep/highlight kleur
  lbl: string; // tekstkleur op blikje (#fff of #000 of #39FF14)
};
```

Vul de volgende smaken in (per categorie):

### Original (9 stuks)
| id | name | flavor | caffeine | c1 | c2 | str | lbl |
|----|------|--------|----------|----|----|-----|-----|
| og | Original | Classic Green OG | 160mg | #111 | #39FF14 | #39FF14 | #39FF14 |
| zero | Zero Sugar | Zero Sugar | 160mg | #111 | #39FF14 | #39FF14 | #39FF14 |
| locarb | Lo-Carb | Blue | 140mg | #0a1a44 | #1144cc | #4488ff | #fff |
| import | Import | Super Premium | 160mg | #111 | #888 | #aaa | #aaa |
| nitro | Nitro Super Dry | Nitro | 160mg | #0a0a0a | #333 | #666 | #39FF14 |
| electric-blue | Electric Blue | Blue | 160mg | #001a55 | #0055ff | #4499ff | #fff |
| orange-dream | Orange Dreamsicle | Orange Cream | 160mg | #552200 | #ff8800 | #ffaa44 | #fff |
| strawberry | Strawberry | Strawberry | 160mg | #550011 | #ff1144 | #ff6688 | #fff |
| lando | Lando Norris | Formula 1 Edition | 160mg | #ff4400 | #ff8800 | #ffcc00 | #fff |

### Ultra — Zero Sugar (17 stuks)
| id | name | flavor | caffeine | c1 | c2 | str | lbl |
|----|------|--------|----------|----|----|-----|-----|
| ultra-white | Ultra White | Zero Sugar | 150mg | #d0d0d0 | #f0f0f0 | #bbb | #222 |
| ultra-red | Ultra Red | Zero Sugar Red | 150mg | #880000 | #ff2222 | #ff6666 | #fff |
| ultra-blue | Ultra Blue | Zero Sugar Blue | 150mg | #001566 | #0055cc | #4488ff | #fff |
| ultra-black | Ultra Black | Zero Sugar Black | 150mg | #0a0a0a | #333 | #666 | #fff |
| ultra-sunrise | Ultra Sunrise | Zero Sugar Orange | 150mg | #993300 | #ff6600 | #ffaa44 | #fff |
| ultra-watermelon | Ultra Watermelon | Zero Sugar Pink | 150mg | #660033 | #ff2277 | #ff66aa | #fff |
| ultra-paradise | Ultra Paradise | Zero Sugar Green | 150mg | #004422 | #00cc66 | #44ff99 | #fff |
| ultra-violet | Ultra Violet | Zero Sugar Purple | 150mg | #2a0066 | #8800ff | #cc66ff | #fff |
| ultra-rosa | Ultra Rosá | Zero Sugar Rosé | 150mg | #880044 | #ff4499 | #ffaacc | #fff |
| ultra-gold | Ultra Gold | Zero Sugar Mango | 150mg | #7a5500 | #FFD700 | #FFD700 | #222 |
| ultra-fiesta | Ultra Fiesta | Zero Sugar Mango | 150mg | #aa4400 | #ff8800 | #FFD700 | #fff |
| ultra-peachy | Ultra Peachy Keen | Zero Sugar Peach | 150mg | #993311 | #ff8855 | #ffbbaa | #fff |
| ultra-rubred | Ultra Fantasy Ruby Red | Zero Sugar Grapefruit | 150mg | #880022 | #dd0044 | #ff6688 | #fff |
| ultra-wild | Ultra Wild Passion | Zero Sugar Passion Fruit | 150mg | #440066 | #9900cc | #cc55ff | #fff |
| ultra-strawb | Ultra Strawberry Dreams | Zero Sugar Strawberry | 150mg | #660022 | #ff3366 | #ff99bb | #fff |
| ultra-vice | Ultra Vice Guava | Zero Sugar Guava | 150mg | #773300 | #ff6633 | #ffaa77 | #fff |
| ultra-punk | Ultra Punk Punch | Zero Sugar Punch | 150mg | #440077 | #aa00ff | #dd66ff | #fff |

### Juice Monster (6 stuks)
| id | name | flavor | caffeine | c1 | c2 | str | lbl |
|----|------|--------|----------|----|----|-----|-----|
| mango-loco | Mango Loco | Mango + Passion Fruit | 160mg | #994400 | #ff8800 | #FFD700 | #fff |
| pipeline | Pipeline Punch | Hawaiian Punch | 160mg | #660088 | #cc00ff | #ff44ff | #fff |
| pacific | Pacific Punch | Tropical Punch | 140mg | #990033 | #ff0055 | #ff4488 | #fff |
| khaos | Khaos | Orange Juice | 70mg | #774400 | #ff8800 | #ffaa44 | #fff |
| riopunch | Rio Punch | Tropical Punch | 140mg | #cc3300 | #ff5500 | #ff9944 | #fff |
| mule | Monster Mule | Moscow Mule | 160mg | #2a6600 | #55cc00 | #88ff44 | #fff |

### Java Monster — Coffee (5 stuks)
| id | name | flavor | caffeine | c1 | c2 | str | lbl |
|----|------|--------|----------|----|----|-----|-----|
| java-bean | Mean Bean | Vanilla Coffee | 188mg | #2a1500 | #8b4513 | #c87941 | #fff |
| java-moca | Loca Moca | Mocha Coffee | 188mg | #1a0d00 | #5c3317 | #8b5e3c | #fff |
| java-caramel | Salted Caramel | Salted Caramel Coffee | 188mg | #5c3300 | #cc7722 | #ddaa44 | #fff |
| java-latte | Café Latte | Latte Coffee | 188mg | #3d2200 | #996633 | #cc9966 | #fff |
| java-irish | Irish Cream | Irish Cream Coffee | 188mg | #1a3300 | #336600 | #55aa00 | #fff |

### Rehab Monster (3 stuks)
| id | name | flavor | caffeine | c1 | c2 | str | lbl |
|----|------|--------|----------|----|----|-----|-----|
| rehab-tea | Rehab Tea | Tea + Lemonade | 161mg | #4a2e00 | #cc8800 | #ddaa00 | #fff |
| rehab-peach | Rehab Peach Tea | Peach Tea | 161mg | #884422 | #ffaa66 | #ffcc99 | #fff |
| rehab-watermelon | Rehab Watermelon | Watermelon Tea | 161mg | #550022 | #ff3366 | #ff88aa | #fff |

### Special (3 stuks)
| id | name | flavor | caffeine | c1 | c2 | str | lbl |
|----|------|--------|----------|----|----|-----|-----|
| assault | Assault | Cherry Cola | 160mg | #330000 | #880000 | #cc2200 | #fff |
| absolutely-zero | Absolutely Zero | Triple Zero | 150mg | #0a0a0a | #444 | #777 | #39FF14 |
| hydro | Hydro Blue Ice | Non-Carbonated | 125mg | #002244 | #0055aa | #44aaff | #fff |

Exporteer ook deze schappen:

```ts
export type Shelf = { id: string; label: string; ids: string[] };

export const DEFAULT_SHELVES: Shelf[] = [
  { id: 's0', label: 'Original', ids: ['og','zero','locarb','import','nitro','electric-blue','orange-dream','strawberry','lando'] },
  { id: 's1', label: 'Ultra (Zero Sugar)', ids: ['ultra-white','ultra-red','ultra-blue','ultra-black','ultra-sunrise','ultra-watermelon','ultra-paradise','ultra-violet','ultra-rosa','ultra-gold','ultra-fiesta','ultra-peachy','ultra-rubred','ultra-wild','ultra-strawb','ultra-vice','ultra-punk'] },
  { id: 's2', label: 'Juice Monster', ids: ['mango-loco','pipeline','pacific','khaos','riopunch','mule'] },
  { id: 's3', label: 'Java Monster (Coffee)', ids: ['java-bean','java-moca','java-caramel','java-latte','java-irish'] },
  { id: 's4', label: 'Rehab', ids: ['rehab-tea','rehab-peach','rehab-watermelon'] },
  { id: 's5', label: 'Special', ids: ['assault','absolutely-zero','hydro'] },
];
```

---

## State (`src/store/useStore.ts`) — Zustand

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_SHELVES, Shelf } from '../data/monsters';

export type LogEntry = {
  id: string;
  name: string;
  flavor: string;
  ratingVal: number; // 0–10, stappen van 0.5
  note: string;
  date: string;
  // blikjekleuren voor weergave in log
  c1: string; c2: string; lbl: string; str: string;
};

type State = {
  shelves: Shelf[];
  canOrder: Record<string, string[]>;
  log: LogEntry[];
  fridgeOpen: boolean;

  openFridge: () => void;
  setShelves: (s: Shelf[]) => void;
  setCanOrder: (shelfId: string, ids: string[]) => void;
  addLog: (entry: LogEntry) => void;
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      shelves: DEFAULT_SHELVES,
      canOrder: Object.fromEntries(DEFAULT_SHELVES.map(s => [s.id, s.ids])),
      log: [],
      fridgeOpen: false,
      openFridge: () => set({ fridgeOpen: true }),
      setShelves: (shelves) => set({ shelves }),
      setCanOrder: (shelfId, ids) =>
        set((state) => ({ canOrder: { ...state.canOrder, [shelfId]: ids } })),
      addLog: (entry) => set((state) => ({ log: [entry, ...state.log] })),
    }),
    { name: 'monster-fridge-storage' }
  )
);
```

---

## Componenten structuur (`src/`)

```
src/
├── data/
│   └── monsters.ts          ← alle smaken + schappen
├── store/
│   └── useStore.ts          ← Zustand store
├── components/
│   ├── ClosedFridge.tsx     ← dichte koelkast met animatie
│   ├── CanSVG.tsx           ← SVG blikje renderer
│   ├── OpenFridge.tsx       ← open koelkast met schappen
│   ├── ShelfRow.tsx         ← één schap met dnd-kit sortable
│   ├── DetailScreen.tsx     ← smaak detail + rating + log
│   ├── StarRating.tsx       ← 1–10 rating met 0.5 stappen
│   ├── LogView.tsx          ← overzicht gedronken blikjes
│   └── Toast.tsx            ← notificatie
├── App.tsx
└── main.tsx
```

---

## Component specs

### `CanSVG.tsx`

Rendert een SVG blikje. Props: `monster: Monster`, `width?: number`, `height?: number`.

Het blikje heeft:
- Een cilinder-vorm (`rect` met `rx` voor afgeronde hoeken)
- Een `linearGradient` van `c1` → `c2` → `c1` (links naar rechts) als achtergrond
- Een donkere band in het midden voor het label-gebied
- De letter **M** groot en centraal (Bebas Neue, kleur = `lbl`)
- De naam klein daaronder (Bebas Neue, kleur = `lbl`, opacity 0.85)
- "MONSTER" als watermark achter de M (Bebas Neue, kleur = `str`, opacity 0.3)
- Een highlight-streep links (smal wit-transparant rechthoekje) voor 3D-effect
- Boven- en onderkant van de cilinder als ellipsen (#555 en #333)
- De M en ONSTER moeten als één woord MONSTER op het blikje staan — zie de M als display-element, ONSTER als suffix er direct naast op dezelfde baseline

**Belangrijk:** De M staat groot, maar MONSTER is één woord. Gebruik SVG `<text>` met twee `<tspan>` elementen of teken de volledige tekst "MONSTER" als één string met Bebas Neue — de eerste letter simpelweg groter via `font-size` op een `<tspan>`.

### `ClosedFridge.tsx`

Grote gecentreerde koelkast illustratie. Bevat:
- Koelkast body: donker metaalgrijs, afgeronde hoeken, subtiele binnenverlichting-gradient
- Bovenste deur: het Monster logo (M + ONSTER als één woord, neon groen glowing)
- Onderkant: de quote *"A Monster a day keeps the doctor away"* in Bebas Neue
- Rechts een deurhandvat (smal grijs blokje)
- Onderin: temperatuurweergave (2°C) en MONSTER brand tekst
- Mist-deeltjes die omhoog drijven met CSS keyframe animatie
- Bij klik: deur swipe-animatie (`perspective + rotateY`) dan `openFridge()` aanroepen

### `OpenFridge.tsx`

Bevat een navigatiebalk bovenaan (`Koelkast | Mijn Log`) en toont ofwel de koelkast-inhoud of de LogView. De koelkast-inhoud heeft een donkergroene achtergrond met subtiele neon groene inner glow.

### `ShelfRow.tsx`

Gebruikt `@dnd-kit/sortable` voor drag & drop van blikjes binnen een schap. Elk blikje heeft:
- Een `CanSVG` component
- Een drag handle (⠿ icoon) die verschijnt bij hover
- Een badge rechtsbovenaan met het aantal keer gedronken (groen, glowing)
- De naam onder het blikje (Orbitron, 6–7px)
- `onClick` → navigeer naar DetailScreen

Blikjes mogen ook tussen schappen gesleept worden. Gebruik `DndContext` op het niveau van `OpenFridge` en `SortableContext` per schap.

### `StarRating.tsx`

Props: `value: number` (0–10, stappen 0.5), `onChange: (v: number) => void`

Rendert 5 sterren. Elke ster heeft twee klikbare helften (links = +0.5, rechts = +1). De fill van de ster is:
- Volledig geel (`#FFD700`) als de rating de volle ster bereikt
- Half geel via SVG `linearGradient` (50% geel / 50% transparant)
- Leeg (lage opacity wit) als niet bereikt

Toon de numerieke waarde (bv. `8.5`) rechts van de sterren in Orbitron.

### `DetailScreen.tsx`

Toont:
- Terug-knop
- Groot blikje (CanSVG, 100×138px)
- Naam (Bebas Neue, 34px, neon groen)
- Categorie + smaakbeschrijving (Orbitron, 9px, dimmed)
- Cafeïne badge
- StarRating component
- Textarea voor notities
- "⚡ LOG DEZE MONSTER" knop (grote groene knop)

Bij loggen: `addLog()` aanroepen, Toast tonen, terugnavigeren.

### `LogView.tsx`

Bovenaan drie stat-kaarten: Totaal gedronken / Unieke smaken / Gemiddelde rating.

Daarna een lijst van `LogEntry` items, nieuwste bovenaan. Elk item toont:
- Klein blikje (CanSVG, 28×38px)
- Naam + datum
- Rating (als getal /10)
- Eventuele notitie

---

## Animaties & visuele details

### Koelkast deur animatie (ClosedFridge)
```css
@keyframes doorOpen {
  from { transform: perspective(500px) rotateY(0deg); }
  to   { transform: perspective(500px) rotateY(-30deg); }
}
```
Trigger bij klik, daarna na 550ms scherm wisselen.

### Mist deeltjes (ClosedFridge + OpenFridge)
```css
@keyframes mistRise {
  0%   { opacity: 0; transform: translateY(0) scale(0.7); }
  50%  { opacity: 0.5; }
  100% { opacity: 0; transform: translateY(-55px) scale(1.4); }
}
```
Spawn elke 500ms een nieuw deeltje op random x-positie, verwijder na 3.5s.
Deeltjes zijn afgeronde divs met een radial-gradient van `rgba(180,220,255,0.3)` naar transparant.

### Can hover
```css
.can:hover { transform: translateY(-5px) scale(1.06); transition: transform 0.2s ease; }
```

### Neon glow op tekst
```css
text-shadow: 0 0 20px rgba(57,255,20,0.8), 0 0 50px rgba(57,255,20,0.35);
```

### Log knop glow
```css
box-shadow: 0 0 20px rgba(57,255,20,0.4);
/* hover: */
box-shadow: 0 0 40px rgba(57,255,20,0.7);
```

---

## Toast component

Eenvoudige vaste positie onderaan het scherm. Animate in/uit met `transform: translateY`. Verdwijnt automatisch na 2.2 seconden.

---

## Routing / schermwisseling

Gebruik **geen** react-router. Beheer de actieve view in App.tsx met een `useState`:

```ts
type Screen = 'closed' | 'open' | 'detail';
const [screen, setScreen] = useState<Screen>('closed');
const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
```

---

## Kleurenpalet samenvatting

| Token | Waarde | Gebruik |
|-------|--------|---------|
| `--green` | `#39FF14` | Neon groen — primary accent |
| `--dark` | `#050505` | Achtergrond |
| `--metal` | `#1a1a1a` | Koelkast body |
| `--metal2` | `#252525` | Hover states |
| `#FFD700` | goud | Sterren rating |
| `rgba(57,255,20,0.05–0.15)` | — | Subtiele groene glow backgrounds |

---

## Typografie

| Element | Font | Grootte | Gewicht |
|---------|------|---------|---------|
| Logo, titels, knoppen | Bebas Neue | 20–88px | 400 |
| Labels, stats, badges | Orbitron | 7–14px | 400/700 |
| Notities, body | Inter | 12–14px | 400/500 |

---

## Persistentie

Alles via Zustand `persist` middleware naar `localStorage` onder de key `monster-fridge-storage`. Geen backend, geen auth.

---

## Volgorde van bouwen (voor Claude Code)

1. `src/data/monsters.ts` — alle data
2. `src/store/useStore.ts` — Zustand store
3. `src/components/CanSVG.tsx` — blikje SVG (test dit eerst!)
4. `src/components/ClosedFridge.tsx` — gesloten koelkast
5. `src/components/StarRating.tsx` — half-ster rating
6. `src/components/DetailScreen.tsx` — detail + log formulier
7. `src/components/ShelfRow.tsx` — één schap met dnd-kit
8. `src/components/OpenFridge.tsx` — open koelkast
9. `src/components/LogView.tsx` — log overzicht
10. `src/components/Toast.tsx` — notificaties
11. `src/App.tsx` — alles samenvoegen

---

## Hoe te starten met Claude Code

```bash
# Installeer Claude Code als je dat nog niet hebt
npm install -g @anthropic-ai/claude-code

# Start in de projectmap
cd monster-fridge
claude

# Geef dit als eerste prompt:
# "Lees MONSTER_FRIDGE_CLAUDE_CODE.md en bouw de app stap voor stap. 
#  Begin met de data en store, dan de CanSVG component, dan de rest.
#  Run `npm run dev` na elke major stap om te controleren."
```

---

*Spec gemaakt op basis van de interactieve prototype — alle kleuren, smaken en animaties zijn exact overgenomen.*
