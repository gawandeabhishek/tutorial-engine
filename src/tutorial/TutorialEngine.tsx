"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Onborda, OnbordaProvider, useOnborda } from "onborda";
import type { Tour } from "onborda/dist/types";

import { useTutorialStore } from "./tutorial.store";
import SpotlightNoCard from "./SpotlightNoCard";
import { loadAllFlows } from "./loadFlows";

export function TutorialEngine({ children }: { children: React.ReactNode }) {
  const { active, tutorialId, step } = useTutorialStore();
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    loadAllFlows().then(setTours);
  }, []);

  return (
    <OnbordaProvider>
      <Onborda
        steps={tours}
        showOnborda={active}
        interact
        cardComponent={SpotlightNoCard}
        shadowRgb="0,0,0"
        shadowOpacity="0.25"
      >
        <StepSync tours={tours} step={step} tutorialId={tutorialId} />
        <StepAdvance tours={tours} step={step} tutorialId={tutorialId} />
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
  const { startOnborda, setCurrentStep, closeOnborda } = useOnborda();

  useEffect(() => {
    if (!tutorialId) {
      closeOnborda();
      return;
    }

    const tour = tours.find((t) => t.tour === tutorialId);
    if (!tour) {
      closeOnborda();
      return;
    }

    if (step < 0 || step >= tour.steps.length) return;

    startOnborda(tutorialId);

    const sync = () => {
      const el = document.querySelector(tour.steps[step].selector);
      if (!el) {
        requestAnimationFrame(sync);
        return;
      }
      setCurrentStep(step);
    };

    requestAnimationFrame(sync);
  }, [tutorialId, step, tours]);

  return null;
}

function StepAdvance({
  step,
  tutorialId,
  tours,
}: {
  step: number;
  tutorialId: string | null;
  tours: Tour[];
}) {
  const router = useRouter();

  useEffect(() => {
    if (!tutorialId) return;

    const tour = tours.find((t) => t.tour === tutorialId);
    if (!tour) return;

    const currentStep = tour.steps[step];
    if (!currentStep) return;

    const el = document.querySelector(currentStep.selector);
    if (!el) return;

    const handler = () => {
      requestAnimationFrame(() => {
        const nextRoute = currentStep.nextRoute;

        if (nextRoute) {
          router.push(nextRoute);
        }

        const nextStep = step + 1;
        if (nextStep < tour.steps.length) {
          useTutorialStore.getState().goTo(nextStep);
        } else {
          useTutorialStore.getState().stop();
        }
      });
    };

    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }, [tutorialId, step, tours, router]);

  return null;
}
