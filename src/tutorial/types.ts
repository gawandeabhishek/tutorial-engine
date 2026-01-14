export interface TutorialStep {
  selector: string;
  nextRoute?: string;
}

export interface TutorialFlowConfig {
  tour: string;
  description: string;
  steps: TutorialStep[];
}
