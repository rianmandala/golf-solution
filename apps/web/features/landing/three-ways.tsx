import Image from "next/image";
import Link from "next/link";
import { FadeInSection, SectionHeadingSplit } from "./primitives";
import { ix } from "./interactions";
import { cn } from "@/lib/utils";
import { sectionPad } from "./typography";

const ways = [
  {
    title: "Fitting",
    description: "Clubs matched to your swing — every spec measured",
    href: "/fitting",
    image: "/landing/ways-fitting.png",
  },
  {
    title: "Coaching",
    description: "Every session on record — progress in numbers",
    href: "/coaching",
    image: "/landing/ways-coaching.png",
  },
  {
    title: "Pro Shop",
    description: "Off the shelf, or built to your fitting specs",
    href: "/clubs",
    image: "/landing/ways-shop.png",
  },
] as const;

export function ThreeWays() {
  return (
    <FadeInSection className={cn("bg-[#f5f5f5]", sectionPad)}>
      <div className="mx-auto max-w-[1360px]">
        <SectionHeadingSplit
          eyebrow="Start here"
          title={
            <>
              <span className="block">Three ways we</span>
              <span className="block">change your game</span>
            </>
          }
          description="Start anywhere. If you're not sure, start with a fitting: it tells you which clubs you need and what's worth practising."
        />

        <div className="mt-11 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-[14px] lg:grid-cols-3">
          {ways.map((way) => (
            <Link
              key={way.title}
              href={way.href}
              className={cn(
                "group flex flex-col border border-solid border-[#e5e5e5] bg-white",
                ix.cursor,
              )}
            >
              <div className="relative h-[166.5px] overflow-hidden bg-[#f5f5f5] md:h-[280px] lg:h-[min(420px,38vw)] xl:h-[552.5px]">
                <Image
                  src={way.image}
                  alt={way.title}
                  fill
                  className={cn("object-cover", ix.imgZoom)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 444px"
                />
              </div>
              <div className="relative flex items-center justify-between border-t border-solid border-[#e5e5e5] bg-white px-5 py-[18px] transition-colors duration-300 group-hover:border-[#111] group-hover:bg-[#111]">
                <div className="pr-4">
                  <h3 className="text-[20px] font-medium leading-[31px] tracking-[0.6px] text-[#111] transition-colors duration-300 group-hover:text-white">
                    {way.title}
                  </h3>
                  <p className="pt-[5px] text-[11.5px] font-normal leading-[17.825px] text-[#767676] transition-colors duration-300 group-hover:text-white/60">
                    {way.description}
                  </p>
                </div>
                <span className={cn("relative size-5 shrink-0", ix.arrowNudge)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/landing/icon-arrow-black.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="absolute inset-0 size-5 transition-opacity duration-300 group-hover:opacity-0"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/landing/icon-arrow-white.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="absolute inset-0 size-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
