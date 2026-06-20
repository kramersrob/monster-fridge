import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_SHELVES } from '../data/monsters';
import type { Shelf } from '../data/monsters';

export type LogEntry = {
  id: string;
  monsterId: string;
  name: string;
  flavor: string;
  cat: string;
  ratingVal: number;
  note: string;
  date: string;
  c1: string;
  c2: string;
  lbl: string;
  str: string;
};

type State = {
  shelves: Shelf[];
  canOrder: Record<string, string[]>;
  fridgeOpen: boolean;
  log: LogEntry[];
  openFridge: () => void;
  closeFridge: () => void;
  setShelves: (s: Shelf[]) => void;
  setCanOrder: (shelfId: string, ids: string[]) => void;
  addLog: (entry: LogEntry) => void;
  deleteLog: (id: string) => void;
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      shelves:    DEFAULT_SHELVES,
      canOrder:   Object.fromEntries(DEFAULT_SHELVES.map(s => [s.id, s.ids])),
      fridgeOpen: false,
      log:        [],

      openFridge:  () => set({ fridgeOpen: true }),
      closeFridge: () => set({ fridgeOpen: false }),
      setShelves:  (shelves) => set({ shelves }),
      setCanOrder: (shelfId, ids) =>
        set((s) => ({ canOrder: { ...s.canOrder, [shelfId]: ids } })),
      addLog:  (entry) => set((s) => ({ log: [entry, ...s.log] })),
      deleteLog: (id)  => set((s) => ({ log: s.log.filter(e => e.id !== id) })),
    }),
    { name: 'monster-fridge-storage' }
  )
);
