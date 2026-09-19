"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { displaySkew, type } from "./typography";
import { ix } from "./interactions";

const SLIDE_MS = 6000;
const TICK_MS = 50;

const slides = [
  {
    id: 1,
    image: "/landing/hero.png",
    subtitle: "Data-driven fitting. No guesswork.",
  },
  {
    id: 2,
    image: "/landing/hero.png",
    subtitle: "Data-driven fitting. No guesswork.",
  },
  {
    id: 3,
    image: "/landing/hero.png",
    subtitle: "Data-driven fitting. No guesswork.",
  },
];

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  /** Bumps on every tab click so the timer always restarts immediately */
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setProgress(1);
      return;
    }

    setProgress(0);

    let elapsed = 0;
    let last = performance.now();
    let advanced = false;

    const id = window.setInterval(() => {
      if (advanced) return;

      const now = performance.now();
      const delta = now - last;
      last = now;

      if (document.hidden) return;

      elapsed += delta;
      const next = Math.min(1, elapsed / SLIDE_MS);
      setProgress(next);

      if (next >= 1) {
        advanced = true;
        setActiveSlide((current) => (current + 1) % slides.length);
      }
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [activeSlide, progressKey, reduceMotion]);

  const goToSlide = (index: number) => {
    setActiveSlide(index);
    setProgressKey((key) => key + 1);
  };

  const tabs = (
    <div
      className="flex items-center gap-1.5 py-3 xl:gap-2 xl:py-0"
      role="tablist"
      aria-label="Hero slides"
    >
      {slides.map((slide, index) => {
        const isActive = activeSlide === index;

        return (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToSlide(index)}
            className={cn(
              "relative flex size-11 items-center justify-center xl:h-12 xl:w-[26px]",
              ix.slideTab,
            )}
          >
            <span className="pointer-events-none relative h-[3px] w-[26px] overflow-hidden bg-white/35">
              <span
                className="absolute inset-y-0 left-0 bg-white transition-[width] duration-75 ease-linear"
                style={{ width: `${(isActive ? progress : 0) * 100}%` }}
              />
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-[#111] text-white",
        /* Mobile Figma: 500px; md+: fill viewport under announcement + header */
        "h-[500px] min-h-[500px]",
        "md:h-[calc(100dvh-6.25rem)] md:min-h-[560px]",
        "xl:min-h-[700px]",
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={slides[activeSlide]?.id}
          className="absolute inset-0 size-full"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
        >
          <Image
            src={slides[activeSlide].image}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.25)] via-[rgba(0,0,0,0)] via-[35%] to-[rgba(0,0,0,0.72)]" />
        </motion.div>
      </AnimatePresence>

      {/* Search in hero until desktop header takes over (xl) */}
      <div className="absolute left-0 right-0 top-0 z-10 px-5 py-3 md:px-8 lg:px-10 xl:hidden">
        <form
          className="flex h-10 w-full items-center gap-2 bg-white/20 px-4 transition-colors duration-200 focus-within:bg-white/25"
          role="search"
        >
          <label htmlFor="hero-search" className="sr-only">
            Search
          </label>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/landing/icon-search.svg"
            alt=""
            width={16}
            height={16}
            className="size-4 brightness-0 invert"
          />
          <input
            id="hero-search"
            type="search"
            placeholder="Search"
            className="h-full w-full bg-transparent text-[13px] font-light text-white outline-none placeholder:text-white/80"
          />
        </form>
      </div>

      <div
        className={cn(
          "relative z-[1] mx-auto flex h-full w-full max-w-[1440px] min-w-0 flex-col",
          "justify-end px-5 pb-0 pt-[120px]",
          "md:px-8",
          "lg:px-10 lg:justify-center lg:pb-16 lg:pt-[100px]",
          "xl:pb-[96px] xl:pt-[120px]",
        )}
      >
        <div className={cn(displaySkew, "origin-left")}>
          <h1 className={type.heroH1}>
            <span className="block">Play the golf</span>
            <span className="block">
              you&apos;re <span className={type.heroH1Em}>capable of</span>
            </span>
          </h1>
        </div>

        <p className={cn(type.heroSub, "pt-4 xl:pt-5")}>{slides[activeSlide].subtitle}</p>

        <div className="flex flex-wrap gap-[14px] pt-[30px]">
          <Link
            href="/fitting"
            className={cn(
              type.cta,
              ix.btnLight,
              "inline-flex h-12 min-h-12 items-center justify-center rounded-[2px] border border-white bg-white px-8 text-[#111]",
            )}
          >
            Get Fitted
          </Link>
          <Link
            href="/clubs"
            className={cn(
              type.cta,
              ix.btnGhostDark,
              "inline-flex h-12 min-h-12 items-center justify-center rounded-[2px] border-[1.5px] border-white bg-transparent px-6 text-[11.5px] uppercase tracking-[1.15px] text-white xl:border xl:px-8 xl:text-[12px] xl:normal-case xl:tracking-[0.6px]",
            )}
          >
            Explore Clubs
          </Link>
        </div>

        {/* In-flow tabs until xl desktop chrome */}
        <div className="xl:hidden">{tabs}</div>
      </div>

      <div className="absolute bottom-[12%] right-10 z-10 hidden xl:block 2xl:bottom-[153px]">
        {tabs}
      </div>
    </section>
  );
}
