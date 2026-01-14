import type { Tour } from "onborda/dist/types";
import { createTourFromFlow } from "./createTour";
import { TutorialFlowConfig } from "./types";

export async function loadAllFlows(): Promise<Tour[]> {
  // TODO: Change file names according to client's project (delete existing and add new ones)
  const flowFiles = ["example.flow.json"];

  const tours: Tour[] = [];

  for (const file of flowFiles) {
    const module = await import(`./flows/${file}`);
    const flow = module.default as TutorialFlowConfig;
    tours.push(createTourFromFlow(flow));
  }

  return tours;
}

export function createFlowMap(tours: Tour[]): Record<string, Tour> {
  const map: Record<string, Tour> = {};
  tours.forEach((t) => (map[t.tour] = t));
  return map;
}
