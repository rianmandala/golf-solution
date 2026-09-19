import Image from "next/image";
import Link from "next/link";
import { FadeInSection, SectionHeadingSplit } from "./primitives";
import { sectionPad, type } from "./typography";
import { ix } from "./interactions";
import { cn } from "@/lib/utils";

const locations = [
  {
    name: "Golf Solutions PIK",
    lines: ["Pantai Indah Kapuk, North Jakarta", "Mon–Sun · 09:00–21:00"],
  },
  {
    name: "Sedayu Indo Golf",
    lines: ["Pantai Indah Kapuk 2", "Mon–Sun · 06:00–22:00"],
  },
];

export function Locations() {
  return (
    <FadeInSection id="locations" className={cn("bg-[#f5f5f5]", sectionPad)}>
      <div className="mx-auto max-w-[1360px]">
        <SectionHeadingSplit
          eyebrow="Jakarta"
          title={
            <>
              <span className="block">Two locations.</span>
              <span className="block">Come by.</span>
            </>
          }
          description="Fittings are by appointment. Everything else, just drop in during opening hours."
          descriptionClassName="max-w-[355px]"
        />

        <div className="mt-11 grid w-full min-w-0 grid-cols-1 border border-solid border-[#e5e5e5] bg-white lg:grid-cols-[1.35fr_1fr] xl:grid-cols-[minmax(0,780px)_minmax(0,1fr)]">
          <div className="relative h-[200px] min-w-0 overflow-hidden md:h-[280px] lg:h-auto lg:min-h-[360px] xl:h-[455.305px]">
            <Image
              src="/landing/locations-range.png"
              alt="Golf Solutions driving range"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>

          <div className="flex min-w-0 flex-col justify-center px-5 py-6 md:px-8 md:py-8 lg:px-8 lg:py-10 xl:px-[42px]">
            {locations.map((location) => (
              <div
                key={location.name}
                className="border-b border-solid border-[#e5e5e5] py-[15px] lg:py-6 xl:py-[30px]"
              >
                <h3 className="text-[18px] font-medium leading-[27.9px] tracking-[0.54px] text-[#111]">
                  {location.name}
                </h3>
                <div className="pt-[7px] text-[13.5px] font-normal leading-[20.925px] text-[#767676]">
                  {location.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}

            <div className="border-b border-solid border-[#e5e5e5] py-[15px] xl:border-0 xl:py-0 xl:pt-[26px]">
              <h3 className="text-[18px] font-medium leading-[27.9px] tracking-[0.54px] text-[#111] xl:hidden">
                Need it sooner?
              </h3>
              <p className="pt-[7px] text-[13.5px] font-normal leading-[20.925px] text-[#767676] xl:hidden">
                Ask about fitting slots or club stock straight over WhatsApp.
              </p>
              <div className="grid grid-cols-1 gap-2 pt-5 sm:grid-cols-2 lg:grid-cols-1 xl:block xl:pt-0">
                <Link
                  href="#"
                  className={cn(
                    type.cta,
                    ix.btnDark,
                    "inline-flex h-12 min-h-12 w-full items-center justify-center rounded-[2px] border border-[#111] bg-[#111] px-4 text-white xl:hidden",
                  )}
                >
                  WhatsApp
                </Link>
                <Link
                  href="/locations"
                  className={cn(
                    type.cta,
                    ix.btnDark,
                    "inline-flex h-12 min-h-12 w-full items-center justify-center rounded-[2px] border border-[#111] bg-[#111] px-4 text-white xl:w-auto xl:px-8",
                  )}
                >
                  <span className="xl:hidden">Get directions</span>
                  <span className="hidden xl:inline">Get Directions</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
