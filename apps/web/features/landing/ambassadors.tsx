"use client";

import Image from "next/image";
import { useRef } from "react";
import { FadeInSection, SectionHeadingWithBody } from "./primitives";
import { sectionPad, type } from "./typography";
import { ix } from "./interactions";
import { cn } from "@/lib/utils";

const ambassadors = [
  {
    name: "Thomas Thopson",
    image: "/landing/ambassador-1.png",
    meta: "Tour-level amateur · hcp +1",
  },
  {
    name: "Samantha Lee",
    image: "/landing/ambassador-2.png",
    meta: "Tour-level amateur · hcp +1",
  },
  {
    name: "Aisha Chen",
    image: "/landing/ambassador-3.png",
    meta: "Tour-level amateur · hcp +1",
  },
  {
    name: "Liam Anderson",
    image: "/landing/ambassador-4.png",
    meta: "Tour-level amateur · hcp +1",
  },
];

const bagItems = [
  ["Driver", "10.5° draw bias"],
  ["Irons", "Players cavity 5–PW"],
  ["Hybrid", "19° · graphite"],
  ["Putter", 'Mallet, 33.5"'],
] as const;

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

export function Ambassadors() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (direction: number) => {
    scrollerRef.current?.scrollBy({
      left: direction * 295,
      behavior: "smooth",
    });
  };

  const nav = (
    <div className="flex gap-2">
      <NavButton
        label="Previous ambassadors"
        src="/landing/icon-chevron-left.svg"
        onClick={() => scrollByAmount(-1)}
      />
      <NavButton
        label="Next ambassadors"
        src="/landing/icon-chevron-right.svg"
        onClick={() => scrollByAmount(1)}
      />
    </div>
  );

  return (
    <FadeInSection id="ambassadors" className={cn("bg-white", sectionPad)}>
      <div className="mx-auto max-w-[1360px]">
        <SectionHeadingWithBody
          eyebrow="Our ambassadors"
          title={<span className="whitespace-nowrap">What&apos;s in their bags</span>}
          titleClassName="whitespace-nowrap"
          description="Players who trust the bay with their own setups. Every club below was fitted and built here."
          actions={<div className="hidden md:flex">{nav}</div>}
        />

        <div
          ref={scrollerRef}
          className="mt-6 flex gap-[14px] overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-11 [&::-webkit-scrollbar]:hidden"
        >
          {ambassadors.map((ambassador) => (
            <article
              key={ambassador.name}
              className="group flex w-[281px] shrink-0 flex-col border border-solid border-[#e5e5e5] bg-white sm:w-[300px] lg:w-[329.5px]"
            >
              <div className="relative h-[209.5px] overflow-hidden border-b border-solid border-[#e5e5e5] bg-[#f5f5f5] md:h-[320px] lg:h-[409.375px]">
                <Image
                  src={ambassador.image}
                  alt={ambassador.name}
                  fill
                  className={cn("object-cover object-top", ix.imgZoom)}
                  sizes="(max-width: 768px) 281px, 330px"
                />
              </div>
              <div className="px-4 pb-[18px] pt-4 lg:px-[22px] lg:pb-[22px] lg:pt-5">
                <h3 className="whitespace-nowrap text-[20px] font-normal leading-[31px] tracking-[0.2px] text-[#111] lg:text-[23px] lg:leading-[35.65px] lg:tracking-[0.23px]">
                  {ambassador.name}
                </h3>
                <p className="pt-1 text-[13px] font-normal leading-[20.15px] text-[#767676]">
                  {ambassador.meta}
                </p>

                <div className="mt-3 border-t border-solid border-[#e5e5e5] lg:mt-4">
                  {bagItems.map(([label, value]) => (
                    <div
                      key={label}
                      className="relative flex h-[45px] items-center justify-between border-b border-solid border-[#f5f5f5] lg:h-[39.148px]"
                    >
                      <span className={type.specLabel}>{label}</span>
                      <span className={type.specValue}>{value}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className={cn(
                    type.labelUpper,
                    ix.btnGhostLight,
                    "mt-3 flex min-h-[38px] w-full items-center justify-center border border-solid border-[#111] bg-white px-2.5 py-2 hover:bg-[#111] hover:text-white",
                  )}
                >
                  Add full bag
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile: swipe primary; chevrons optional under strip */}
        <div className="mt-6 flex md:hidden">{nav}</div>
      </div>
    </FadeInSection>
  );
}
