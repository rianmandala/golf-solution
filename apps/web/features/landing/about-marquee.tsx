"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { FadeInSection, SectionHeadingSplit } from "./primitives";
import { sectionPad } from "./typography";
import { cn } from "@/lib/utils";

const photos = [
  { src: "/landing/facility-1.png", alt: "Fitting bay Golf Solutions", width: "w-[200px] md:w-[400px] lg:w-[603px]" },
  { src: "/landing/facility-2.png", alt: "Bench Golf Solutions", width: "w-[120px] md:w-[180px] lg:w-[256px]" },
  { src: "/landing/facility-3.png", alt: "Pro shop Golf Solutions", width: "w-[200px] md:w-[400px] lg:w-[603px]" },
  { src: "/landing/facility-4.png", alt: "Coaching floor Golf Solutions", width: "w-[200px] md:w-[400px] lg:w-[603px]" },
  { src: "/landing/facility-5.png", alt: "Fitting session Golf Solutions", width: "w-[120px] md:w-[180px] lg:w-[256px]" },
  { src: "/landing/facility-6.png", alt: "Golf Solutions location", width: "w-[200px] md:w-[400px] lg:w-[603px]" },
];

const loopedPhotos = [...photos, ...photos];

export function AboutMarquee() {
  const reduceMotion = useReducedMotion();

  return (
    <FadeInSection
      id="about"
      className={cn(
        "overflow-hidden border-b border-solid border-[#d1d1d1] bg-[#f5f5f5]",
        sectionPad,
      )}
    >
      <div className="mx-auto max-w-[1360px]">
        <SectionHeadingSplit
          eyebrow="About us"
          title={
            <>
              <span className="block">One roof.</span>
              <span className="block">Whole game.</span>
            </>
          }
          description="Most golfers bounce between a shop, a coach, and a range that never talk to each other. We put all three behind one door — so the numbers follow you from bay to bench to lesson."
          descriptionClassName="max-w-[394px]"
        />
      </div>

      <div className="group/marquee relative mx-auto mt-11 max-w-[1360px] overflow-hidden">
        <div className="relative h-[180px] overflow-hidden md:h-[260px] lg:h-[340px]">
          <div
            className={
              reduceMotion
                ? "flex w-max gap-[14px]"
                : "flex w-max gap-[14px] animate-gs-marquee motion-reduce:animate-none group-hover/marquee:[animation-play-state:paused]"
            }
          >
            {loopedPhotos.map((photo, index) => (
              <div
                key={`${photo.src}-${index}`}
                className={`relative h-[180px] shrink-0 overflow-hidden border border-solid border-[#e5e5e5] md:h-[260px] lg:h-[340px] ${photo.width}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="603px"
                />
              </div>
            ))}
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[#f5f5f5] to-transparent sm:w-9"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#f5f5f5] to-transparent sm:w-9"
          />
        </div>
      </div>
    </FadeInSection>
  );
}
