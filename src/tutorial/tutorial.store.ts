import { Tour } from "onborda/dist/types";
import { create } from "zustand";

export interface TutorialState {
  active: boolean;
  tutorialId: string | null;
  step: number;
  tours: Tour[];
}

interface TutorialStore extends TutorialState {
  start: (id: string, step?: number) => void;
  goTo: (step: number) => void;
  stop: () => void;
  sync: (state: TutorialState) => void;
  setTours: (tours: Tour[]) => void;
  setId: (id: string) => void;
}

export const useTutorialStore = create<TutorialStore>((set) => ({
  active: false,
  tutorialId: null,
  step: 0,
  tours: [],

  start: (id, step = 0) => set({ active: true, tutorialId: id, step }),

  goTo: (step) => set({ step }),

  stop: () => set({ active: false, tutorialId: null, step: 0 }),

  sync: (state) => set(state),

  setTours: (tours) => set({ tours }),

  setId: (id) => set({ tutorialId: id }),
}));
