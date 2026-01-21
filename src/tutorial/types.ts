import { Step, Tour } from "onborda/dist/types";

export interface Steps {
  selector: string;
  prevRoute?: string;
  nextRoute?: string;
  step_desc?: string;
}

export interface TutorialFlowConfig {
  tour: string;
  description: string;
  steps: Steps[];
}

export interface TutorialStep extends Step {
  step_desc: string;
}

export interface TutorialTour extends Tour {
  steps: TutorialStep[];
}
