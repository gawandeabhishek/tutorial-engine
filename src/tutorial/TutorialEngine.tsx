"use client";

import { usePathname, useRouter } from "next/navigation";
import { Onborda, OnbordaProvider, useOnborda } from "onborda";
import { useEffect, useRef } from "react";

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

let currentAudio: HTMLAudioElement | null = null;

function playStepAudio(tourId: string, stepIndex: number) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  const audio = new Audio(`/tutorials/${tourId}/${stepIndex}.mp3`);
  currentAudio = audio;
  audio.play().catch((err) => console.error("Audio play error:", err));
}

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
  const lastSpokenStep = useRef<number | null>(null);

  useEffect(() => {
    if (!tutorialId || !active) {
      closeOnborda();
      lastSpokenStep.current = null;
      return;
    }

    const tour = tours.find((t) => t.tour === tutorialId);
    if (!tour) {
      closeOnborda();
      lastSpokenStep.current = null;
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

      playStepAudio(tutorialId, step);
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
    let cleanup: (() => void) | undefined;

    waitForElement(currentStep.selector).then((el) => {
      if (cancelled || !el) return;

      const goNext = () => {
        const nextRoute = currentStep.nextRoute;
        if (nextRoute) router.push(nextRoute);

        const nextStep = step + 1;
        if (nextStep < tour.steps.length) goTo(nextStep);
        else stop();
      };

      const tag = el.tagName.toLowerCase();

      if (tag === "input" || tag === "textarea") {
        const inputEl = el as HTMLInputElement | HTMLTextAreaElement;

        const keyHandler = (e: KeyboardEvent) => {
          if (e.key === "Enter") goNext();
        };

        const blurHandler = () => goNext();

        inputEl.addEventListener("keydown", keyHandler as EventListener);
        inputEl.addEventListener("blur", blurHandler as EventListener);

        cleanup = () => {
          inputEl.removeEventListener("keydown", keyHandler as EventListener);
          inputEl.removeEventListener("blur", blurHandler as EventListener);
        };
      } else {
        const clickHandler = () => goNext();
        el.addEventListener("click", clickHandler);

        cleanup = () => el.removeEventListener("click", clickHandler);
      }
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [tutorialId, step, tours, router, active, goTo, stop]);

  return null;
}
