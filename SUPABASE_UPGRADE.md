# 🟢 Monster Fridge — Supabase Upgrade Spec

## Wat we toevoegen

De app heeft nu localStorage. We upgraden naar **Supabase** zodat:
- Twee gebruikers (jij + je broertje) elk een eigen account hebben
- De log gedeeld is in de cloud — jullie zien elkaars ratings
- Er een vergelijkingstab komt met elkaars stats

---

## Stap 1 — Supabase project aanmaken

1. Ga naar [supabase.com](https://supabase.com) en maak een gratis account
2. Maak een nieuw project aan — noem het `monster-fridge`
3. Kies een regio dicht bij jullie (Europe West)
4. Bewaar het **Project URL** en de **anon public key** — die heb je zo nodig

---

## Stap 2 — Database tabellen aanmaken

Ga in Supabase naar **SQL Editor** en run deze queries:

```sql
-- Gebruikersprofielen (naam weergeven in de vergelijkingstab)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text not null,
  created_at timestamp with time zone default now()
);

-- Log entries per gebruiker
create table log_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  monster_id text not null,
  monster_name text not null,
  monster_flavor text not null,
  monster_cat text not null,
  rating_val numeric(3,1) default 0,  -- 0–10, stappen van 0.5
  note text default '',
  c1 text not null,   -- blikjekleuren voor weergave
  c2 text not null,
  lbl text not null,
  str text not null,
  logged_at timestamp with time zone default now()
);

-- Row Level Security: gebruikers zien ALLE logs (voor vergelijking)
-- maar kunnen alleen hun eigen logs aanmaken/verwijderen
alter table log_entries enable row level security;
alter table profiles enable row level security;

create policy "Iedereen kan alle logs lezen"
  on log_entries for select using (true);

create policy "Gebruiker kan eigen logs toevoegen"
  on log_entries for insert with check (auth.uid() = user_id);

create policy "Gebruiker kan eigen logs verwijderen"
  on log_entries for delete using (auth.uid() = user_id);

create policy "Iedereen kan profielen lezen"
  on profiles for select using (true);

create policy "Gebruiker kan eigen profiel aanmaken"
  on profiles for insert with check (auth.uid() = id);

create policy "Gebruiker kan eigen profiel updaten"
  on profiles for update using (auth.uid() = id);
```

---

## Stap 3 — Supabase instellen in de app

### .env bestand (in de root van het project)

```bash
VITE_SUPABASE_URL=https://jouw-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=jouw-anon-key-hier
```

Voeg `.env` toe aan `.gitignore` zodat de keys niet publiek komen!

### Installeer de Supabase client

```bash
npm install @supabase/supabase-js
```

### `src/lib/supabase.ts` — client aanmaken

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## Stap 4 — Auth toevoegen

### `src/components/AuthScreen.tsx`

Een simpel inlogscherm met **magic link** (geen wachtwoord nodig — je krijgt een link in je email):

```tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (!error) setSent(true);
    setLoading(false);
  };

  // Styling: zelfde dark theme als de rest van de app
  // Bebas Neue voor titels, Orbitron voor labels
  // Neon groene accenten (#39FF14)
  // Grote centered layout met Monster logo erboven

  if (sent) {
    return (
      <div>
        {/* Toon bevestiging: "Check je email voor de inloglink!" */}
        {/* Orbitron font, neon groen */}
      </div>
    );
  }

  return (
    <div>
      {/* Monster logo */}
      {/* "UNLEASH THE BEAST" subtitel */}
      {/* Email input veld */}
      {/* "⚡ STUUR INLOGLINK" knop */}
    </div>
  );
}
```

### `src/hooks/useAuth.ts`

```ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Huidige sessie ophalen
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Luister naar auth veranderingen (inloggen, uitloggen, magic link klik)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = () => supabase.auth.signOut();

  return { user, loading, signOut };
}
```

---

## Stap 5 — Zustand store updaten

Vervang de localStorage logica in `useStore.ts`. De store beheert nu alleen UI state (welk scherm, welke monster geselecteerd). Data gaat via Supabase.

Maak een nieuwe `src/hooks/useLog.ts` voor alle database operaties:

```ts
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { LogEntry } from '../store/useStore';

export function useLog(userId: string | null) {
  const [log, setLog] = useState<(LogEntry & { user_id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLog = useCallback(async () => {
    const { data, error } = await supabase
      .from('log_entries')
      .select('*')
      .order('logged_at', { ascending: false });

    if (!error && data) setLog(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLog();

    // Realtime updates — als je broertje iets logt zie jij het meteen
    const channel = supabase
      .channel('log_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'log_entries',
      }, () => fetchLog())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchLog]);

  const addLog = useCallback(async (entry: Omit<LogEntry, 'date'> & {
    monster_id: string;
    monster_name: string;
    monster_flavor: string;
    monster_cat: string;
  }) => {
    if (!userId) return;
    const { error } = await supabase.from('log_entries').insert({
      user_id: userId,
      ...entry,
      logged_at: new Date().toISOString(),
    });
    if (!error) fetchLog();
  }, [userId, fetchLog]);

  return { log, loading, addLog, refetch: fetchLog };
}
```

---

## Stap 6 — Vergelijkingstab toevoegen

### `src/components/CompareView.tsx`

Nieuwe tab naast "Koelkast" en "Mijn Log". Toont stats van beide gebruikers naast elkaar.

```tsx
// Props: log entries van iedereen, huidige userId, profielen
// 
// Layout:
// ┌─────────────────┬─────────────────┐
// │   JOUW NAAM     │  BROERTJE NAAM  │
// │                 │                 │
// │  42 gedronken   │  38 gedronken   │
// │  18 smaken      │  15 smaken      │
// │  gem. 7.5/10    │  gem. 8.2/10    │
// └─────────────────┴─────────────────┘
//
// Daarna: "Beiden gedronken" sectie
// Smaken die jullie allebei hebben gelogd, met jullie ratings naast elkaar
// Bv: Original — jij: 9.0  broertje: 8.5
//
// Dan: "Alleen jij" en "Alleen broertje" secties
// Smaken die de ander nog niet heeft gehad — aanraders!
```

De vergelijkingstab heeft **realtime updates** via de Supabase channel uit `useLog` — als je broertje een Monster logt terwijl jij kijkt, verschijnt het meteen.

---

## Stap 7 — App.tsx updaten

```tsx
import { useAuth } from './hooks/useAuth';
import { AuthScreen } from './components/AuthScreen';

function App() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <AuthScreen />;

  // Rest van de app zoals hij al is, maar nu met userId doorgeven
  // Voeg een kleine "Uitloggen" knop toe ergens in de navigatiebalk
  return (
    // ... bestaande app structuur
    // Navigatiebalk: Koelkast | Mijn Log | Vergelijk
  );
}
```

---

## Stap 8 — Profiel aanmaken bij eerste login

Na de eerste login moet een gebruiker een gebruikersnaam kiezen (zodat je broertje zichzelf herkent in de vergelijkingstab):

```tsx
// src/components/SetupProfile.tsx
// Simpel scherm: "Kies je naam" 
// Sla op in de profiles tabel via supabase.from('profiles').insert(...)
// Toon dit scherm als user is ingelogd maar nog geen profiel heeft
```

Check bij app start:
```ts
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

if (!profile) {
  // Toon SetupProfile scherm
}
```

---

## Volgorde van bouwen (voor Claude Code)

1. `.env` aanmaken met Supabase credentials
2. `npm install @supabase/supabase-js`
3. `src/lib/supabase.ts` — client
4. `src/hooks/useAuth.ts` — auth hook
5. `src/components/AuthScreen.tsx` — inlogscherm (magic link)
6. `src/components/SetupProfile.tsx` — gebruikersnaam kiezen
7. `src/hooks/useLog.ts` — database operaties
8. `src/components/CompareView.tsx` — vergelijkingstab
9. `src/App.tsx` updaten — auth check + nieuwe tab
10. `DetailScreen.tsx` updaten — `addLog` nu via `useLog` hook
11. Testen: log in op twee verschillende browsers/apparaten

---

## Hoe te starten met Claude Code

Drop dit bestand in de root van het project (naast `MONSTER_FRIDGE_CLAUDE_CODE.md`) en geef Claude Code deze prompt:

```
Lees SUPABASE_UPGRADE.md en upgrade de bestaande Monster Fridge app 
met Supabase auth en een gedeelde database. De basis app staat al — 
voeg alleen de nieuwe bestanden toe en pas de bestaande aan waar nodig.
Zorg dat de bestaande drag & drop en rating functionaliteit blijft werken.
```

---

## Checklist voor jou (voor je Claude Code start)

- [ ] Supabase account aangemaakt op supabase.com
- [ ] Nieuw project aangemaakt (`monster-fridge`, Europe West)
- [ ] SQL uit Stap 2 gerund in de SQL Editor
- [ ] Project URL en anon key gekopieerd
- [ ] `.env` bestand aangemaakt in de project root met de keys
- [ ] `.env` staat in `.gitignore`
- [ ] Basis app werkt al (van `MONSTER_FRIDGE_CLAUDE_CODE.md`)

---

*Supabase gratis tier is ruim voldoende: 500MB database, onbeperkte auth gebruikers, realtime inbegrepen.*
