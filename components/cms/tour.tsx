"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Compass } from "lucide-react";
import { tours, type TourKey } from "@/lib/cms/tours";
import { Button } from "@/components/ui/button";

const SEEN = "margins-cms-tour-seen";

export function startTour(key: TourKey) {
  // only steps whose target is on this screen
  const steps = tours[key]
    .filter((step) => !step.element || document.querySelector(step.element))
    .map(({ element, title, description }) => ({ element, popover: { title, description } }));
  if (steps.length === 0) return;
  driver({ showProgress: true, allowClose: true, overlayOpacity: 0.55, stagePadding: 6, stageRadius: 10, popoverClass: "cms-tour", steps }).drive();
}

export function TourButton({ tour, label = "Tour this page" }: { tour: TourKey; label?: string }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={() => startTour(tour)}>
      <Compass className="size-4" />
      {label}
    </Button>
  );
}

/** Runs the shell tour once per browser, the first time someone lands in the CMS. */
export function FirstVisitTour() {
  useEffect(() => {
    try {
      if (localStorage.getItem(SEEN)) return;
      localStorage.setItem(SEEN, "1");
    } catch {
      return; // storage blocked → never auto-start, the button still works
    }
    const timer = setTimeout(() => startTour("shell"), 600);
    return () => clearTimeout(timer);
  }, []);
  return null;
}
