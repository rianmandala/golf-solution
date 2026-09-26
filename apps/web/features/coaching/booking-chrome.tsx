import { cn } from "@/lib/utils";

export function BookingStepper({ step }: { step: 1 | 2 }) {
  return (
    <nav aria-label="Booking steps" className="flex items-center">
      <div className="flex items-center gap-[11px]">
        <span
          className={cn(
            "flex size-[30px] items-center justify-center rounded-full border border-solid text-[12px] font-bold leading-[18.6px]",
            step === 1
              ? "border-[#111] bg-[#111] text-white"
              : "border-[#111] bg-[#111] text-white",
          )}
        >
          1
        </span>
        <span
          className={cn(
            "text-[13px] leading-5",
            step === 1 ? "font-bold text-[#111]" : "font-bold text-[#111]",
          )}
        >
          Coach & time
        </span>
      </div>
      <div className="flex items-center gap-[11px]">
        <span className="px-[14px]">
          <span className="block h-px w-[72px] bg-[#111]" />
        </span>
        <span
          className={cn(
            "flex size-[30px] items-center justify-center rounded-full border border-solid text-[12px] font-bold leading-[18.6px]",
            step === 2
              ? "border-[#111] bg-[#111] text-white"
              : "border-[#e5e5e5] bg-white text-[#767676]",
          )}
        >
          2
        </span>
        <span
          className={cn(
            "text-[13px] leading-5",
            step === 2 ? "font-bold text-[#111]" : "font-normal text-[#767676]",
          )}
        >
          Your details
        </span>
      </div>
    </nav>
  );
}

export function CoachingPageHeader({
  step,
  title = "Book a seassion.",
}: {
  step: 1 | 2;
  /** Match Figma typo on step frames unless corrected later. */
  title?: string;
}) {
  return (
    <div className="w-full bg-[#f5f5f5] py-8 md:py-10">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 md:flex-row md:items-end md:justify-between md:px-8 lg:px-10">
        <div className="flex max-w-[390px] flex-col gap-3">
          <p className="text-[15px] font-normal uppercase leading-[23px] text-[#111]">
            Coaching
          </p>
          <h1 className="-skew-x-[5deg] origin-left text-[40px] font-normal uppercase leading-[1.02] text-[#111] md:text-[56px] md:leading-[57px]">
            {title}
          </h1>
          <BookingStepper step={step} />
        </div>
        <p className="max-w-[323px] text-[15px] font-normal leading-[23px] text-[#767676]">
          Pick your coach, choose an open slot, and we&apos;ll confirm by
          WhatsApp. Every session is measured on TrackMan — so progress is a
          number, not a feeling.
        </p>
      </div>
    </div>
  );
}
