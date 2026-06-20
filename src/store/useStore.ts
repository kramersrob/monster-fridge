import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_SHELVES } from '../data/monsters';
import type { Shelf } from '../data/monsters';

// Store beheert alleen UI state + drag-and-drop volgorde.
// Log data gaat via Supabase (zie src/hooks/useLog.ts).

type State = {
  shelves: Shelf[];
  canOrder: Record<string, string[]>;
  fridgeOpen: boolean;

  openFridge: () => void;
  setShelves: (s: Shelf[]) => void;
  setCanOrder: (shelfId: string, ids: string[]) => void;
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      shelves:   DEFAULT_SHELVES,
      canOrder:  Object.fromEntries(DEFAULT_SHELVES.map(s => [s.id, s.ids])),
      fridgeOpen: false,

      openFridge:   () => set({ fridgeOpen: true }),
      setShelves:   (shelves) => set({ shelves }),
      setCanOrder:  (shelfId, ids) =>
        set((state) => ({ canOrder: { ...state.canOrder, [shelfId]: ids } })),
    }),
    { name: 'monster-fridge-storage' }
  )
);
