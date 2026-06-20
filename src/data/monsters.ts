export type Monster = {
  id: string;
  name: string;
  flavor: string;
  caffeine: string;
  cat: 'Original' | 'Ultra' | 'Juice' | 'Java' | 'Rehab' | 'Special';
  c1: string;
  c2: string;
  str: string;
  lbl: string;
};

export const MONSTERS: Monster[] = [
  // ── Original ──────────────────────────────────────────────────────────────
  { id: 'og',            name: 'Original',           flavor: 'Classic Green OG',      caffeine: '160mg', cat: 'Original', c1: '#111',    c2: '#39FF14', str: '#39FF14', lbl: '#39FF14' },
  { id: 'zero',          name: 'Zero Sugar',          flavor: 'Zero Sugar',            caffeine: '160mg', cat: 'Original', c1: '#111',    c2: '#39FF14', str: '#39FF14', lbl: '#39FF14' },
  { id: 'locarb',        name: 'Lo-Carb',             flavor: 'Blue',                  caffeine: '140mg', cat: 'Original', c1: '#0a1a44', c2: '#1144cc', str: '#4488ff', lbl: '#fff'    },
  { id: 'import',        name: 'Import',              flavor: 'Super Premium',         caffeine: '160mg', cat: 'Original', c1: '#111',    c2: '#888',    str: '#aaa',    lbl: '#aaa'    },
  { id: 'nitro',         name: 'Nitro Super Dry',     flavor: 'Nitro',                 caffeine: '160mg', cat: 'Original', c1: '#0a0a0a', c2: '#333',    str: '#666',    lbl: '#39FF14' },
  { id: 'electric-blue', name: 'Electric Blue',       flavor: 'Blue',                  caffeine: '160mg', cat: 'Original', c1: '#001a55', c2: '#0055ff', str: '#4499ff', lbl: '#fff'    },
  { id: 'orange-dream',  name: 'Orange Dreamsicle',   flavor: 'Orange Cream',          caffeine: '160mg', cat: 'Original', c1: '#552200', c2: '#ff8800', str: '#ffaa44', lbl: '#fff'    },
  { id: 'strawberry',    name: 'Strawberry',          flavor: 'Strawberry',            caffeine: '160mg', cat: 'Original', c1: '#550011', c2: '#ff1144', str: '#ff6688', lbl: '#fff'    },
  { id: 'lando',         name: 'Lando Norris',        flavor: 'Formula 1 Edition',     caffeine: '160mg', cat: 'Original', c1: '#ff4400', c2: '#ff8800', str: '#ffcc00', lbl: '#fff'    },

  // ── Ultra (Zero Sugar) ────────────────────────────────────────────────────
  { id: 'ultra-white',       name: 'Ultra White',             flavor: 'Zero Sugar',              caffeine: '150mg', cat: 'Ultra', c1: '#d0d0d0', c2: '#f0f0f0', str: '#bbb',    lbl: '#222' },
  { id: 'ultra-red',         name: 'Ultra Red',               flavor: 'Zero Sugar Red',          caffeine: '150mg', cat: 'Ultra', c1: '#880000', c2: '#ff2222', str: '#ff6666', lbl: '#fff' },
  { id: 'ultra-blue',        name: 'Ultra Blue',              flavor: 'Zero Sugar Blue',         caffeine: '150mg', cat: 'Ultra', c1: '#001566', c2: '#0055cc', str: '#4488ff', lbl: '#fff' },
  { id: 'ultra-black',       name: 'Ultra Black',             flavor: 'Zero Sugar Black',        caffeine: '150mg', cat: 'Ultra', c1: '#0a0a0a', c2: '#333',    str: '#666',    lbl: '#fff' },
  { id: 'ultra-sunrise',     name: 'Ultra Sunrise',           flavor: 'Zero Sugar Orange',       caffeine: '150mg', cat: 'Ultra', c1: '#993300', c2: '#ff6600', str: '#ffaa44', lbl: '#fff' },
  { id: 'ultra-watermelon',  name: 'Ultra Watermelon',        flavor: 'Zero Sugar Pink',         caffeine: '150mg', cat: 'Ultra', c1: '#660033', c2: '#ff2277', str: '#ff66aa', lbl: '#fff' },
  { id: 'ultra-paradise',    name: 'Ultra Paradise',          flavor: 'Zero Sugar Green',        caffeine: '150mg', cat: 'Ultra', c1: '#004422', c2: '#00cc66', str: '#44ff99', lbl: '#fff' },
  { id: 'ultra-violet',      name: 'Ultra Violet',            flavor: 'Zero Sugar Purple',       caffeine: '150mg', cat: 'Ultra', c1: '#2a0066', c2: '#8800ff', str: '#cc66ff', lbl: '#fff' },
  { id: 'ultra-rosa',        name: 'Ultra Rosá',              flavor: 'Zero Sugar Rosé',         caffeine: '150mg', cat: 'Ultra', c1: '#880044', c2: '#ff4499', str: '#ffaacc', lbl: '#fff' },
  { id: 'ultra-gold',        name: 'Ultra Gold',              flavor: 'Zero Sugar Mango',        caffeine: '150mg', cat: 'Ultra', c1: '#7a5500', c2: '#FFD700', str: '#FFD700', lbl: '#222' },
  { id: 'ultra-fiesta',      name: 'Ultra Fiesta',            flavor: 'Zero Sugar Mango',        caffeine: '150mg', cat: 'Ultra', c1: '#aa4400', c2: '#ff8800', str: '#FFD700', lbl: '#fff' },
  { id: 'ultra-peachy',      name: 'Ultra Peachy Keen',       flavor: 'Zero Sugar Peach',        caffeine: '150mg', cat: 'Ultra', c1: '#993311', c2: '#ff8855', str: '#ffbbaa', lbl: '#fff' },
  { id: 'ultra-rubred',      name: 'Ultra Fantasy Ruby Red',  flavor: 'Zero Sugar Grapefruit',   caffeine: '150mg', cat: 'Ultra', c1: '#880022', c2: '#dd0044', str: '#ff6688', lbl: '#fff' },
  { id: 'ultra-wild',        name: 'Ultra Wild Passion',      flavor: 'Zero Sugar Passion Fruit', caffeine: '150mg', cat: 'Ultra', c1: '#440066', c2: '#9900cc', str: '#cc55ff', lbl: '#fff' },
  { id: 'ultra-strawb',      name: 'Ultra Strawberry Dreams', flavor: 'Zero Sugar Strawberry',   caffeine: '150mg', cat: 'Ultra', c1: '#660022', c2: '#ff3366', str: '#ff99bb', lbl: '#fff' },
  { id: 'ultra-vice',        name: 'Ultra Vice Guava',        flavor: 'Zero Sugar Guava',        caffeine: '150mg', cat: 'Ultra', c1: '#773300', c2: '#ff6633', str: '#ffaa77', lbl: '#fff' },
  { id: 'ultra-punk',        name: 'Ultra Punk Punch',        flavor: 'Zero Sugar Punch',        caffeine: '150mg', cat: 'Ultra', c1: '#440077', c2: '#aa00ff', str: '#dd66ff', lbl: '#fff' },

  // ── Juice Monster ─────────────────────────────────────────────────────────
  { id: 'mango-loco', name: 'Mango Loco',    flavor: 'Mango + Passion Fruit', caffeine: '160mg', cat: 'Juice', c1: '#994400', c2: '#ff8800', str: '#FFD700', lbl: '#fff' },
  { id: 'pipeline',   name: 'Pipeline Punch', flavor: 'Hawaiian Punch',        caffeine: '160mg', cat: 'Juice', c1: '#660088', c2: '#cc00ff', str: '#ff44ff', lbl: '#fff' },
  { id: 'pacific',    name: 'Pacific Punch',  flavor: 'Tropical Punch',        caffeine: '140mg', cat: 'Juice', c1: '#990033', c2: '#ff0055', str: '#ff4488', lbl: '#fff' },
  { id: 'khaos',      name: 'Khaos',          flavor: 'Orange Juice',          caffeine: '70mg',  cat: 'Juice', c1: '#774400', c2: '#ff8800', str: '#ffaa44', lbl: '#fff' },
  { id: 'riopunch',   name: 'Rio Punch',       flavor: 'Tropical Punch',        caffeine: '140mg', cat: 'Juice', c1: '#cc3300', c2: '#ff5500', str: '#ff9944', lbl: '#fff' },
  { id: 'mule',       name: 'Monster Mule',    flavor: 'Moscow Mule',           caffeine: '160mg', cat: 'Juice', c1: '#2a6600', c2: '#55cc00', str: '#88ff44', lbl: '#fff' },

  // ── Java Monster (Coffee) ─────────────────────────────────────────────────
  { id: 'java-bean',     name: 'Mean Bean',      flavor: 'Vanilla Coffee',         caffeine: '188mg', cat: 'Java', c1: '#2a1500', c2: '#8b4513', str: '#c87941', lbl: '#fff' },
  { id: 'java-moca',     name: 'Loca Moca',      flavor: 'Mocha Coffee',           caffeine: '188mg', cat: 'Java', c1: '#1a0d00', c2: '#5c3317', str: '#8b5e3c', lbl: '#fff' },
  { id: 'java-caramel',  name: 'Salted Caramel', flavor: 'Salted Caramel Coffee',  caffeine: '188mg', cat: 'Java', c1: '#5c3300', c2: '#cc7722', str: '#ddaa44', lbl: '#fff' },
  { id: 'java-latte',    name: 'Café Latte',      flavor: 'Latte Coffee',           caffeine: '188mg', cat: 'Java', c1: '#3d2200', c2: '#996633', str: '#cc9966', lbl: '#fff' },
  { id: 'java-irish',    name: 'Irish Cream',     flavor: 'Irish Cream Coffee',     caffeine: '188mg', cat: 'Java', c1: '#1a3300', c2: '#336600', str: '#55aa00', lbl: '#fff' },

  // ── Rehab Monster ─────────────────────────────────────────────────────────
  { id: 'rehab-tea',         name: 'Rehab Tea',          flavor: 'Tea + Lemonade',  caffeine: '161mg', cat: 'Rehab', c1: '#4a2e00', c2: '#cc8800', str: '#ddaa00', lbl: '#fff' },
  { id: 'rehab-peach',       name: 'Rehab Peach Tea',    flavor: 'Peach Tea',       caffeine: '161mg', cat: 'Rehab', c1: '#884422', c2: '#ffaa66', str: '#ffcc99', lbl: '#fff' },
  { id: 'rehab-watermelon',  name: 'Rehab Watermelon',   flavor: 'Watermelon Tea',  caffeine: '161mg', cat: 'Rehab', c1: '#550022', c2: '#ff3366', str: '#ff88aa', lbl: '#fff' },

  // ── Special ───────────────────────────────────────────────────────────────
  { id: 'assault',        name: 'Assault',         flavor: 'Cherry Cola',     caffeine: '160mg', cat: 'Special', c1: '#330000', c2: '#880000', str: '#cc2200', lbl: '#fff'    },
  { id: 'absolutely-zero', name: 'Absolutely Zero', flavor: 'Triple Zero',     caffeine: '150mg', cat: 'Special', c1: '#0a0a0a', c2: '#444',    str: '#777',    lbl: '#39FF14' },
  { id: 'hydro',           name: 'Hydro Blue Ice',  flavor: 'Non-Carbonated',  caffeine: '125mg', cat: 'Special', c1: '#002244', c2: '#0055aa', str: '#44aaff', lbl: '#fff'    },
];

export const MONSTER_MAP = new Map<string, Monster>(MONSTERS.map(m => [m.id, m]));

export type Shelf = { id: string; label: string; ids: string[] };

export const DEFAULT_SHELVES: Shelf[] = [
  { id: 's0', label: 'Original',              ids: ['og','zero','locarb','import','nitro','electric-blue','orange-dream','strawberry','lando'] },
  { id: 's1', label: 'Ultra (Zero Sugar)',     ids: ['ultra-white','ultra-red','ultra-blue','ultra-black','ultra-sunrise','ultra-watermelon','ultra-paradise','ultra-violet','ultra-rosa','ultra-gold','ultra-fiesta','ultra-peachy','ultra-rubred','ultra-wild','ultra-strawb','ultra-vice','ultra-punk'] },
  { id: 's2', label: 'Juice Monster',          ids: ['mango-loco','pipeline','pacific','khaos','riopunch','mule'] },
  { id: 's3', label: 'Java Monster (Coffee)',  ids: ['java-bean','java-moca','java-caramel','java-latte','java-irish'] },
  { id: 's4', label: 'Rehab',                  ids: ['rehab-tea','rehab-peach','rehab-watermelon'] },
  { id: 's5', label: 'Special',                ids: ['assault','absolutely-zero','hydro'] },
];
