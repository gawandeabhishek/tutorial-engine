import type { Tour } from "onborda/dist/types";
import { SpotlightFlowConfig } from "./types";

export function createTourFromFlow(flow: SpotlightFlowConfig): Tour {
  return {
    tour: flow.id,
    steps: flow.steps.map((step) => ({
      selector: step.selector,
      title: "",
      content: null,
      showControls: false,
      icon: null,
    })),
  };
}
