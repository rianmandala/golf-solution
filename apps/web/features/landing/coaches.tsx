import Image from "next/image";
import Link from "next/link";
import { FadeInSection, SectionHeadingSplit } from "./primitives";
import { sectionPad } from "./typography";
import { ix } from "./interactions";
import { cn } from "@/lib/utils";

const coaches = [
  {
    number: "01",
    name: "Wonjun",
    role: "Coach",
    description:
      "Full-swing rebuilds: tempo, sequence, and strike, tracked week over week.",
    cta: "Train with Wonjun",
    image: "/landing/coach-wonjun.png",
  },
  {
    number: "02",
    name: "Shern Wei",
    role: "Coach",
    description:
      "Short game & course strategy, from fundamentals down to single digits.",
    cta: "Train with Shern Wei",
    image: "/landing/coach-shern.png",
  },
];

export function Coaches() {
  return (
    <FadeInSection className={cn("bg-[#f5f5f5]", sectionPad)}>
      <div className="mx-auto max-w-[1360px]">
        <SectionHeadingSplit
          eyebrow="Coaching"
          title="The coaches"
          description="Two coaches, one method: every session ends in numbers you can compare with last week's."
        />

        <div className="mt-11 flex flex-col gap-12 md:gap-16 lg:flex-row lg:gap-[100px]">
          {coaches.map((coach) => (
            <article key={coach.name} className="group w-full max-w-[630px]">
              <div className="relative h-[420px] overflow-hidden border border-solid border-[#e5e5e5] md:h-[520px] lg:h-[min(560px,55vw)] xl:h-[660px]">
                <Image
                  src={coach.image}
                  alt={coach.name}
                  fill
                  className={cn("object-cover", ix.imgZoom)}
                  sizes="(max-width: 1280px) 100vw, 630px"
                />
                <span className="absolute left-[18px] top-4 text-[13px] font-bold leading-[20.15px] tracking-[1.82px] text-white">
                  {coach.number}
                </span>
              </div>
              <div className="relative flex h-[54.9px] items-center justify-between border-b border-solid border-[#e5e5e5]">
                <h3 className="text-[20px] font-normal leading-[27.9px] tracking-[0.18px] text-[#111] md:text-[24px]">
                  {coach.name}
                </h3>
                <span className="text-[13px] font-normal leading-[20.15px] text-[#767676]">
                  {coach.role}
                </span>
              </div>
              <p className="pt-4 text-[15px] font-normal leading-[22px] text-[#767676] md:text-[18px] md:leading-[22.4px]">
                {coach.description}
              </p>
              <Link
                href={`/coaching/${coach.name === "Wonjun" ? "wonjun" : "shern-wei"}`}
                className={cn(
                  "mt-4 inline-flex border-b-2 border-solid border-[#111] pb-[3px] text-[13px] font-bold leading-[20.15px] tracking-[0.65px] text-[#111]",
                  ix.textUnderline,
                )}
              >
                {coach.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
