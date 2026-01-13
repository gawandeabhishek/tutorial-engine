export interface TutorialStep {
  selector: string;
  nextRoute?: string;
}

export interface TutorialFlowConfig {
  description: string;
  steps: TutorialStep[];
}
