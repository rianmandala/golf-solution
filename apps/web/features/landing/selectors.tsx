import Image from "next/image";
import Link from "next/link";
import { FadeInSection, SectionEyebrow } from "./primitives";
import { displaySkew, sectionPad, type } from "./typography";
import { ix } from "./interactions";
import { cn } from "@/lib/utils";

const selectors = [
  {
    title: (
      <>
        Drivers
        <br />
        SELECTORS
      </>
    ),
    label: "Drivers SELECTORS",
    image: "/landing/selector-driver.png",
  },
  {
    title: (
      <>
        IRON
        <br />
        SELECTOR
      </>
    ),
    label: "IRON SELECTOR",
    image: "/landing/selector-iron.png",
  },
  {
    title: (
      <>
        WEDGE
        <br />
        SELECTOR
      </>
    ),
    label: "WEDGE SELECTOR",
    image: "/landing/selector-wedge.png",
  },
];

export function Selectors() {
  return (
    <FadeInSection className={cn(sectionPad, "xl:py-11")}>
      <div className="mx-auto flex w-full min-w-0 max-w-[1360px] flex-col gap-5">
        <div className="mx-auto flex max-w-[660px] flex-col items-center text-center xl:mx-0 xl:max-w-none xl:items-stretch xl:text-left">
          <SectionEyebrow className="text-center xl:text-left">The online selector</SectionEyebrow>
          <div className="pt-3">
            <div className={cn(displaySkew, "origin-center xl:origin-left")}>
              <h2
                className={cn(
                  type.displayH2,
                  "text-center text-[30.057px] leading-[30.658px] tracking-[0.3607px] xl:text-left",
                )}
              >
                <span className="xl:hidden">Find the right fit, right now.</span>
                <span className="hidden xl:block">
                  <span className="block">Find the right fit,</span>
                  <span className="block">right now.</span>
                </span>
              </h2>
            </div>
          </div>
          <p className={cn(type.bodyMuted, "mx-auto max-w-[355px] pt-3.5 text-center text-[rgba(17,17,17,0.6)] xl:mx-0 xl:max-w-[480px] xl:pt-0 xl:text-left xl:text-[#767676]")}>
            Pick what we&apos;re fitting. Six quick questions, a real recommendation from our shelf
            — and your profile lands with Aaron before you even book.
          </p>
        </div>

        <div className="flex gap-2 pt-5 md:gap-3 lg:gap-4 xl:gap-5">
          {selectors.map((selector) => (
            <Link
              key={selector.label}
              href="/fitting"
              className={cn(
                "group relative flex min-h-[180px] min-w-0 flex-1 flex-col overflow-hidden rounded-[2px] border border-solid border-[#e5e5e5] bg-[#f5f5f5] lg:min-h-[320px] xl:min-h-[400px]",
                ix.cardHover,
              )}
            >
              <div className="relative min-h-[120px] flex-1 overflow-hidden lg:min-h-[240px] xl:h-[400px] xl:min-h-[400px] xl:flex-none">
                <Image
                  src={selector.image}
                  alt={selector.label}
                  fill
                  className={cn("object-cover object-center", ix.imgZoom)}
                  sizes="(max-width: 1280px) 33vw, 440px"
                />
              </div>
              <div className="relative z-10 w-full rounded-[2px] bg-[#f5f5f5] px-2 py-[11px] text-center transition-colors duration-300 group-hover:bg-white xl:absolute xl:bottom-[13px] xl:left-1/2 xl:w-[min(400px,calc(100%-16px))] xl:-translate-x-1/2">
                <p className="text-[11px] font-bold uppercase leading-[17.05px] tracking-[0.88px] text-[#111]">
                  <span className="xl:hidden">{selector.title}</span>
                  <span className="hidden xl:inline">{selector.label}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-col items-center gap-5 border border-solid border-[#e5e5e5] bg-[#fafaf8] px-5 py-[22px] md:px-[30px] md:py-[26px]">
          <div className="flex flex-col items-center text-center">
            <p className="text-[11px] font-bold leading-[17.05px] tracking-[0.66px] text-[#767676]">
              Prefer to just ask?
            </p>
            <div className={cn(displaySkew, "origin-center pt-[9px]")}>
              <p className="text-center text-[20.038px] font-normal leading-[23.044px] tracking-[0.2405px] text-[#111] md:text-[23.044px] md:leading-[26.5px]">
                Book your fitting on WhatsApp.
              </p>
            </div>
            <p className="max-w-[289px] pt-[7px] text-[13.5px] font-normal leading-[20.25px] text-[#767676] md:max-w-none">
              Send one message and we&apos;ll set the slot with Aaron — no form to fill in.
            </p>
          </div>
          <Link
            href="/fitting"
            className={cn(
              type.cta,
              ix.btnDark,
              "inline-flex h-12 min-h-12 w-full max-w-[289px] items-center justify-center gap-2.5 rounded-[2px] border border-[#111] bg-[#111] px-8 text-white md:w-auto md:max-w-none",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/landing/icon-whatsapp.svg"
              alt=""
              width={15}
              height={15}
              className="size-[15px]"
            />
            Chat on WhatsApp
          </Link>
        </div>
      </div>
    </FadeInSection>
  );
}
