import { TutorialFlowConfig, TutorialTour } from "./types";

export function createTourFromFlow(flow: TutorialFlowConfig): TutorialTour {
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
      step_desc: step.step_desc || "",
    })),
  };
}
