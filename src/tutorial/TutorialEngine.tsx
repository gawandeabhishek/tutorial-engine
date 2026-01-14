"use client";

import { usePathname, useRouter } from "next/navigation";
import { Onborda, OnbordaProvider, useOnborda } from "onborda";
import { useEffect } from "react";

import SpotlightNoCard from "./SpotlightNoCard";
import { loadAllFlows } from "./loadFlows";
import { useTutorialStore } from "./tutorial.store";

const waitForElement = (selector: string): Promise<Element> => {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
};

export function TutorialEngine({ children }: { children: React.ReactNode }) {
  const { active, tours, setTours } = useTutorialStore();

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
        <StepSync />
        <StepAdvance />
        {children}
      </Onborda>
    </OnbordaProvider>
  );
}

function StepSync() {
  const pathname = usePathname();
  const { startOnborda, setCurrentStep, closeOnborda } = useOnborda();
  const { tutorialId, step, tours, active } = useTutorialStore();

  useEffect(() => {
    if (!tutorialId || !active) {
      closeOnborda();
      return;
    }

    const tour = tours.find((t) => t.tour === tutorialId);
    if (!tour) {
      closeOnborda();
      return;
    }

    if (step < 0 || step >= tour.steps.length) return;

    const current = tour.steps[step];
    if (!current) return;

    let cancelled = false;
    startOnborda(tutorialId);

    waitForElement(current.selector).then(() => {
      if (cancelled) return;
      setCurrentStep(step);
    });

    return () => {
      cancelled = true;
    };
  }, [
    tutorialId,
    step,
    tours,
    pathname,
    active,
    startOnborda,
    setCurrentStep,
    closeOnborda,
  ]);

  return null;
}

function StepAdvance() {
  const router = useRouter();
  const { goTo, stop, tutorialId, step, tours, active } = useTutorialStore();

  useEffect(() => {
    if (!tutorialId || !active) return;

    const tour = tours.find((t) => t.tour === tutorialId);
    if (!tour) return;

    const currentStep = tour.steps[step];
    if (!currentStep) return;

    let cancelled = false;

    waitForElement(currentStep.selector).then((el) => {
      if (cancelled) return;

      const handler = () => {
        requestAnimationFrame(() => {
          const nextRoute = currentStep.nextRoute;
          if (nextRoute) router.push(nextRoute);

          const nextStep = step + 1;
          if (nextStep < tour.steps.length) goTo(nextStep);
          else stop();
        });
      };

      el.addEventListener("click", handler);
      return () => el.removeEventListener("click", handler);
    });

    return () => {
      cancelled = true;
    };
  }, [tutorialId, step, tours, router, active, goTo, stop]);

  return null;
}
