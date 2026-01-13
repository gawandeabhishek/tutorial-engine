import { createTourFromFlow } from "./createTour";
import type { Tour } from "onborda/dist/types";
import { SpotlightFlowConfig } from "./types";

export async function loadAllFlows(): Promise<Tour[]> {
  const flowFiles = [
    "upload.flow.json",
    "chat.flow.json",
    "settings.flow.json",
  ];

  const tours: Tour[] = [];

  for (const file of flowFiles) {
    const module = await import(`./flows/${file}`);
    const flow = module.default as SpotlightFlowConfig;
    tours.push(createTourFromFlow(flow));
  }

  return tours;
}

export function createFlowMap(tours: Tour[]): Record<string, Tour> {
  const map: Record<string, Tour> = {};
  tours.forEach((t) => (map[t.tour] = t));
  return map;
}
