"use client";

import { useEffect, useState } from "react";
import { Onborda, OnbordaProvider } from "onborda";
import { useTutorialStore } from "./tutorial.store";
import SpotlightNoCard from "./SpotlightNoCard";
import type { Tour } from "onborda/dist/types";
import { loadAllFlows, createFlowMap } from "./loadFlows";

export function TutorialEngine({ children }: { children: React.ReactNode }) {
  const { active, tutorialId, step } = useTutorialStore();
  const [tours, setTours] = useState<Tour[]>([]);
  const [flowMap, setFlowMap] = useState<Record<string, Tour>>({});

  useEffect(() => {
    loadAllFlows().then((allTours) => {
      setTours(allTours);
      setFlowMap(createFlowMap(allTours));
    });
  }, []);

  // Auto-next step logic when user clicks highlighted element
  useEffect(() => {
    if (!tutorialId || tours.length === 0) return;

    const currentStep = tours.find((t) => t.tour === tutorialId)?.steps[step];
    if (!currentStep) return;

    const el = document.querySelector(currentStep.selector);
    if (!el) return;

    const handleClick = () => {
      const nextStep = step + 1;
      const maxStep =
        tours.find((t) => t.tour === tutorialId)?.steps.length || 0;
      if (nextStep < maxStep) {
        useTutorialStore.getState().goTo(nextStep);
      } else {
        useTutorialStore.getState().stop();
      }
    };

    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, [tutorialId, step, tours]);

  return (
    <OnbordaProvider>
      <Onborda
        steps={tutorialId ? [flowMap[tutorialId]] : tours}
        showOnborda={active}
        interact={true}
        cardComponent={SpotlightNoCard}
        shadowRgb="0,0,0"
        shadowOpacity="0.25"
      >
        <StepSync tours={tours} step={step} tutorialId={tutorialId} />
        {children}
      </Onborda>
    </OnbordaProvider>
  );
}

function StepSync({
  step,
  tutorialId,
  tours,
}: {
  step: number;
  tutorialId: string | null;
  tours: Tour[];
}) {
  const { setCurrentStep, startOnborda, closeOnborda } =
    require("onborda").useOnborda();

  useEffect(() => {
    if (!tutorialId) return closeOnborda();

    const tour = tours.find((t) => t.tour === tutorialId);
    if (!tour) return closeOnborda(); // invalid tutorialId

    // Guard against invalid step
    if (step < 0 || step >= tour.steps.length) {
      console.warn(
        `Tutorial "${tutorialId}" step ${step} is out of range (0..${
          tour.steps.length - 1
        })`
      );
      return;
    }

    startOnborda(tutorialId);
    setTimeout(() => setCurrentStep(step), 0);
  }, [tutorialId, step, tours]);

  return null;
}
