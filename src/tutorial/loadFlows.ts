import type { Tour } from "onborda/dist/types";
import { createTourFromFlow } from "./createTour";
import { TutorialFlowConfig, TutorialTour } from "./types";

export async function loadAllFlows(): Promise<TutorialTour[]> {
  // TODO: Change file names according to client's project (delete existing and add new ones)
  const flowFiles = ["example.flow.json"];

  const tours: TutorialTour[] = [];
  for (const file of flowFiles) {
    const module = await import(`./flows/${file}`);
    const flow = module.default as TutorialFlowConfig;
    tours.push(createTourFromFlow(flow));
  }

  return tours;
}
