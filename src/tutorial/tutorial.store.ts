import { create } from "zustand";
import { TutorialTour } from "./types";

export interface TutorialState {
  active: boolean;
  tutorialId: string | null;
  step: number;
  tours: TutorialTour[];
}

interface TutorialStore extends TutorialState {
  start: (id: string, step?: number) => void;
  goTo: (step: number) => void;
  stop: () => void;
  setTours: (tours: TutorialTour[]) => void;
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

  setTours: (tours) => set({ tours }),

  setId: (id) => set({ tutorialId: id }),
}));
