"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { FadeInSection, SectionHeadingSplit } from "./primitives";
import { displaySkew, sectionPad } from "./typography";
import { ix } from "./interactions";
import { cn } from "@/lib/utils";

const camps = [
  {
    type: "Camp",
    month: "Oct",
    day: "19–21",
    year: "2026",
    title: "Short Game Scoring Camp",
    location: "Forest City Golf Resort, Johor Bahru",
    description:
      "Every shot that saves strokes around the green — delicate chips, confident bunker play — then tested on the Legacy and Classic courses.",
    meta: ["3 days", "All levels", "12 spots"],
    image: "/landing/camp-1.png",
  },
  {
    type: "Clinic",
    month: "Nov",
    day: "08",
    year: "2026",
    title: "Driver Distance Clinic",
    location: "Golf Solutions PIK, Jakarta",
    description:
      "One afternoon on TrackMan finding your launch window. Attack angle, spin, and strike — measured before and after.",
    meta: ["Half day", "Hcp 10–24", "8 spots"],
    image: "/landing/camp-2.png",
  },
  {
    type: "Camp",
    month: "Dec",
    day: "12–14",
    year: "2026",
    title: "Junior Performance Camp",
    location: "Sedayu Indo Golf, Jakarta",
    description:
      "Three days built for juniors: swing fundamentals, on-course strategy, and a fitting check as they grow into their clubs.",
    meta: ["3 days", "Age 10–17", "16 spots"],
    image: "/landing/camp-3.png",
  },
];

function NavButton({
  label,
  src,
  onClick,
}: {
  label: string;
  src: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-[46px] items-center justify-center rounded-[2px] border border-solid border-[#111]",
        ix.iconSquare,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={17} height={17} className="size-[17px]" />
    </button>
  );
}

export function Camps() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (direction: number) => {
    scrollerRef.current?.scrollBy({
      left: direction * 459.328,
      behavior: "smooth",
    });
  };

  const nav = (
    <div className="flex gap-[10px]">
      <NavButton
        label="Previous camps"
        src="/landing/icon-chevron-left.svg"
        onClick={() => scrollByAmount(-1)}
      />
      <NavButton
        label="Next camps"
        src="/landing/icon-chevron-right.svg"
        onClick={() => scrollByAmount(1)}
      />
    </div>
  );

  return (
    <FadeInSection className={cn("bg-white", sectionPad)}>
      <div className="mx-auto max-w-[1360px]">
        <SectionHeadingSplit
          eyebrow="What’s on"
          title={
            <>
              <span className="block">Upcoming camps</span>
              <span className="block">&amp; clinics</span>
            </>
          }
          description="Small groups, real course time, and the same TrackMan numbers we fit with. Spots are limited — each camp runs once."
          descriptionClassName="max-w-[401px]"
          actions={<div className="hidden lg:block">{nav}</div>}
        />

        <div
          ref={scrollerRef}
          className="mt-11 flex gap-[14px] overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-[18px] [&::-webkit-scrollbar]:hidden"
        >
          {camps.map((camp) => (
            <article
              key={`${camp.title}-${camp.month}`}
              className="group w-[min(85vw,320px)] shrink-0 overflow-hidden rounded-[2px] border border-solid border-[#e5e5e5] bg-white sm:w-[380px] lg:w-[441.328px]"
            >
              <div className="relative h-[180px] overflow-hidden bg-[#f5f5f5] sm:h-[220px] lg:h-[274.578px]">
                <Image
                  src={camp.image}
                  alt={camp.title}
                  fill
                  className={cn("object-cover", ix.imgZoom)}
                  sizes="(max-width: 640px) 85vw, 441px"
                />
                <span className="absolute left-0 top-0 bg-[#111] px-[11px] py-[6px] text-[10px] font-bold uppercase leading-[15.5px] tracking-[0.8px] text-white">
                  {camp.type}
                </span>
              </div>

              <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-[22px]">
                <div className="flex h-[44.594px] items-end gap-[14px] border-b border-solid border-[#e5e5e5] pb-1.5">
                  <span className="pb-0.5 text-[11px] font-bold uppercase leading-[17.05px] tracking-[1.1px] text-[#767676]">
                    {camp.month}
                  </span>
                  <span className="text-[26px] font-medium leading-[26px] text-[#111]">{camp.day}</span>
                  <span className="pb-0.5 text-[12px] font-normal leading-[18.6px] text-[#767676]">
                    {camp.year}
                  </span>
                </div>

                <div className="pt-4">
                  <div className={cn(displaySkew, "origin-left")}>
                    <h3 className="text-[20px] font-normal leading-[1.05] tracking-[0.2765px] text-[#111] sm:whitespace-nowrap sm:text-[23.044px] sm:leading-[23.505px]">
                      {camp.title}
                    </h3>
                  </div>
                  <p className="pt-2 text-[13px] font-bold leading-[20.15px] text-[#111]">
                    {camp.location}
                  </p>
                  <p className="pt-2.5 text-[13.5px] font-normal leading-[20.925px] text-[#767676]">
                    {camp.description}
                  </p>
                  <ul className="flex flex-wrap gap-[7px] pt-4">
                    {camp.meta.map((item) => (
                      <li
                        key={item}
                        className="rounded-[2px] border border-solid border-[#e5e5e5] px-[9px] py-[5px] text-[10px] font-bold uppercase leading-[15.5px] tracking-[0.5px] text-[#767676]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/coaching"
                  className={cn(
                    "group/reserve mt-5 inline-flex items-center gap-2 border-b-2 border-solid border-[#111] pb-[3px] text-[12px] font-bold uppercase leading-[18.6px] tracking-[0.6px] text-[#111]",
                    ix.textUnderline,
                  )}
                >
                  Reserve a spot
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/landing/icon-arrow-sm.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="size-4 transition-transform duration-300 ease-out group-hover/reserve:translate-x-0.5 motion-reduce:transform-none"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 lg:hidden">{nav}</div>
      </div>
    </FadeInSection>
  );
}
