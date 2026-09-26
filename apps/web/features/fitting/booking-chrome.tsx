"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ix } from "@/features/landing/interactions";

const STEPS = [
  { n: 1 as const, label: "Fitter & time", href: "/fitting/book" },
  { n: 2 as const, label: "Your details", href: "/fitting/book/details" },
];

export function FittingStepper({ step }: { step: 1 | 2 }) {
  return (
    <nav aria-label="Booking steps" className="flex items-center">
      {STEPS.map((s, i) => {
        const isCurrent = s.n === step;
        const isPast = s.n < step;
        const canNavigate = isPast;

        const circle = (
          <span
            className={cn(
              "flex size-[30px] shrink-0 items-center justify-center rounded-full border border-solid text-[12px] font-bold leading-[18.6px]",
              isCurrent || isPast
                ? "border-[#111] bg-[#111] text-white"
                : "border-[#e5e5e5] bg-white text-[#767676]",
            )}
          >
            {s.n}
          </span>
        );

        const label = (
          <span
            className={cn(
              "text-[13px] leading-5",
              isCurrent || isPast
                ? "font-bold text-[#111]"
                : "font-normal text-[#767676]",
            )}
          >
            {s.label}
          </span>
        );

        return (
          <div key={s.n} className="flex items-center gap-[11px]">
            {i > 0 ? (
              <span className="px-[14px]">
                <span className="block h-px w-[72px] bg-[#111]" />
              </span>
            ) : null}
            {canNavigate ? (
              <Link
                href={s.href}
                className={cn(
                  "inline-flex items-center gap-[11px]",
                  ix.cursor,
                  "hover:opacity-80",
                )}
              >
                {circle}
                {label}
              </Link>
            ) : (
              <span
                className="inline-flex items-center gap-[11px]"
                aria-current={isCurrent ? "step" : undefined}
              >
                {circle}
                {label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function FittingPageHeader({ step }: { step: 1 | 2 }) {
  return (
    <div className="w-full bg-[#f5f5f5] py-8 md:py-10">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 md:flex-row md:items-end md:justify-between md:px-8 lg:px-10">
        <div className="flex max-w-[390px] flex-col gap-3">
          <p className="text-[15px] font-normal uppercase leading-[23px] text-[#111]">
            Fitting
          </p>
          <h1 className="-skew-x-[5deg] origin-left text-[40px] font-normal uppercase leading-[1.02] text-[#111] md:text-[56px] md:leading-[57px]">
            Book a fitting.
          </h1>
          <FittingStepper step={step} />
        </div>
        <p className="max-w-[323px] text-[15px] font-normal leading-[23px] text-[#767676]">
          Pick your package, choose an open slot with Aaron, and we&apos;ll
          confirm by WhatsApp. Every swing is measured on TrackMan — so the
          build matches your numbers.
        </p>
      </div>
    </div>
  );
}
