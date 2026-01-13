export interface SpotlightStep {
  selector: string;
}

export interface SpotlightFlowConfig {
  id: string;
  steps: SpotlightStep[];
}
