export interface TutorialStep {
  selector: string;
  nextRoute?: string;
}

export interface TutorialFlowConfig {
  tour: string;
  ai_steps: string;
  description: string;
  steps: TutorialStep[];
}
