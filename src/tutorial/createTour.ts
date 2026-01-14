import type { Tour } from "onborda/dist/types";
import { TutorialFlowConfig } from "./types";

export function createTourFromFlow(flow: TutorialFlowConfig): Tour {
  return {
    tour: flow.tour,
    steps: flow.steps.map((step) => ({
      selector: step.selector,
      title: "",
      content: null,
      showControls: false,
      icon: null,
      nextRoute: step.nextRoute,
      prevRoute: step.prevRoute,
    })),
  };
}
