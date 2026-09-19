import Image from "next/image";
import Link from "next/link";
import {
  FadeInSection,
  SectionDisplayTitle,
  SectionEyebrow,
} from "./primitives";
import { sectionPad, type } from "./typography";
import { ix } from "./interactions";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Read",
    description: "Every swing captured in TrackMan numbers",
  },
  {
    number: "02",
    title: "Test",
    description: "Heads & shafts swapped live, on your strikes",
  },
  {
    number: "03",
    title: "Build",
    description: "Built to your spec — and the spec stays on file",
  },
];

export function FittingBay() {
  return (
    <FadeInSection className={sectionPad}>
      <div className="mx-auto grid w-full min-w-0 max-w-[1440px] grid-cols-1 gap-10 md:gap-12 lg:grid-cols-[minmax(260px,0.42fr)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[460px_minmax(0,1fr)] xl:gap-16">
        <figure className="order-1 flex min-w-0 flex-col lg:order-none">
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-solid border-[#e5e5e5] md:aspect-[5/4] lg:aspect-auto lg:h-[min(611px,52vw)] xl:h-[611.328px]">
            <Image
              src="/landing/aaron.png"
              alt="Aaron"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>
          <figcaption className="relative flex h-[54.9px] items-center justify-between border-b border-solid border-[#e5e5e5] px-0.5">
            <span className="text-[18px] font-normal leading-[27.9px] tracking-[0.18px] text-[#111]">
              Aaron
            </span>
            <span className="text-[13px] font-normal leading-[20.15px] text-[#767676]">
              Master fitter
            </span>
          </figcaption>
        </figure>

        <div className="order-2 lg:order-none">
          <div className="flex items-center gap-3 pb-5 lg:order-none lg:pb-3 lg:pt-5">
            <div className="flex gap-[3px]">
              {Array.from({ length: 5 }).map((_, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={index}
                  src="/landing/icon-star.svg"
                  alt=""
                  width={19}
                  height={19}
                  className="size-[19px] lg:size-6"
                />
              ))}
            </div>
            <span className="text-[19px] font-bold leading-[19px] tracking-[-0.19px] text-[#111] lg:text-[24px] lg:leading-6 lg:tracking-[-0.24px]">
              5.0
            </span>
            <span className="text-[14px] font-normal leading-[21.7px] text-[#767676] lg:text-[16px] lg:leading-[24.8px]">
              (496 reviews)
            </span>
          </div>

          <SectionEyebrow>The fitting bay</SectionEyebrow>

          <div className="pt-3.5">
            <SectionDisplayTitle className="xl:text-[60.114px] xl:leading-[61.317px] xl:tracking-[0.7214px]">
              <span className="block">Your swing has numbers.</span>
              <span className="block">Aaron reads them.</span>
            </SectionDisplayTitle>
          </div>

          <p className="max-w-[481px] pt-5 text-[16px] font-normal leading-[25.6px] text-[#767676]">
            TrackMan reads every swing. Aaron turns the numbers into a club:
            tested against your strikes, built on the bench, finished before you
            leave.{" "}
            <span className="font-bold text-[#111]">
              One fitter, one standard.
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-[18px] pt-[26px]">
            <Link
              href="/fitting"
              className={cn(
                type.cta,
                ix.btnDark,
                "inline-flex min-h-12 items-center justify-center rounded-[2px] border border-[#111] bg-[#111] px-8 text-white",
              )}
            >
              Book a fitting
            </Link>
            <Link
              href="/fitting"
              className={cn(
                type.cta,
                ix.textUnderline,
                "border-b-2 border-solid border-[#111] pb-[3px] text-[#111]",
              )}
            >
              See the numbers
            </Link>
          </div>

          {/* Mobile: horizontal scroll steps; tablet+: 3-col grid */}
          <div className="-mx-5 mt-9 overflow-x-auto px-5 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-3.5 border-t border-solid border-[#e5e5e5] pt-6 md:grid md:min-w-0 md:grid-cols-3 md:gap-6">
              {steps.map((step) => (
                <div key={step.number} className="w-[248px] shrink-0 md:w-auto">
                  <p className="text-[15px] font-bold leading-[23.25px] text-[#767676]">
                    {step.number}
                  </p>
                  <h3 className="pt-1.5 text-[22px] font-bold leading-[34.1px] text-[#111]">
                    {step.title}
                  </h3>
                  <p className="pt-1.5 text-[13px] font-normal leading-[19.5px] text-[#767676]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
