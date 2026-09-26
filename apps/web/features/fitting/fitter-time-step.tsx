"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { formatRp } from "@gs/format";
import { cn } from "@/lib/utils";
import { displaySkew } from "@/features/landing/typography";
import { ix } from "@/features/landing/interactions";
import {
  BookingCalendarLegend,
  BookingMonthGrid,
  ByRequestHeading,
} from "@/features/booking/month-calendar";
import { FittingPageHeader } from "./booking-chrome";
import { loadDraft, saveDraft } from "./booking-draft";
import {
  buildFittingMonthCalendar,
  canNavigateMonth,
  defaultFittingSelectableDate,
  FITTER,
  FITTING_PACKAGES,
  formatDayHeading,
  formatMonthTitle,
  getFittingPackage,
  isDaySelectable,
  jakartaToday,
  parseIsoDate,
  shiftYearMonth,
  slotsForFittingDay,
  summarizeFittingDay,
  type FittingPackageId,
  type SlotType,
  type YearMonth,
} from "./data";

function initialFromDraft() {
  const today = jakartaToday();
  const draft = typeof window !== "undefined" ? loadDraft() : null;
  const packageId: FittingPackageId =
    draft && getFittingPackage(draft.packageId)
      ? draft.packageId
      : "full_bag";
  const date =
    draft?.date &&
    isDaySelectable(summarizeFittingDay(draft.date, today).kind)
      ? draft.date
      : defaultFittingSelectableDate(today);
  const parsed = parseIsoDate(date);
  return {
    packageId,
    date,
    viewMonth: { year: parsed.year, month: parsed.month } satisfies YearMonth,
    time: draft?.time ?? null,
    slotType: draft?.slotType ?? null,
  };
}

export function FitterTimeStep() {
  const router = useRouter();
  const today = useMemo(() => jakartaToday(), []);
  const [packageId, setPackageId] = useState<FittingPackageId>("full_bag");
  const [viewMonth, setViewMonth] = useState<YearMonth>(() => {
    const t = parseIsoDate(jakartaToday());
    return { year: t.year, month: t.month };
  });
  const [date, setDate] = useState(() =>
    defaultFittingSelectableDate(jakartaToday()),
  );
  const [time, setTime] = useState<string | null>(null);
  const [slotType, setSlotType] = useState<SlotType | null>(null);

  useEffect(() => {
    const init = initialFromDraft();
    setPackageId(init.packageId);
    setDate(init.date);
    setViewMonth(init.viewMonth);
    setTime(init.time);
    setSlotType(init.slotType);
  }, []);

  const pkg = getFittingPackage(packageId)!;
  const calendar = useMemo(
    () => buildFittingMonthCalendar(viewMonth, today),
    [viewMonth, today],
  );
  const daySlots = useMemo(
    () => slotsForFittingDay(date, today),
    [date, today],
  );
  const regularOpen = daySlots.regular.filter((s) => s.open).length;
  const requestOpen = daySlots.byRequest.filter((s) => s.open).length;
  const canContinue = Boolean(packageId && date && time && slotType);
  const canPrev = canNavigateMonth(viewMonth, -1, today);
  const canNext = canNavigateMonth(viewMonth, 1, today);

  function selectDate(next: string) {
    const summary = summarizeFittingDay(next, today);
    if (!isDaySelectable(summary.kind)) return;
    setDate(next);
    setTime(null);
    setSlotType(null);
  }

  function goMonth(delta: -1 | 1) {
    if (!canNavigateMonth(viewMonth, delta, today)) return;
    setViewMonth((m) => shiftYearMonth(m, delta));
  }

  return (
    <>
      <FittingPageHeader step={1} />
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[22px] px-5 py-8 md:px-8 lg:px-10 lg:py-10">
        <section className="flex flex-col gap-5 py-4">
          <h2
            className={cn(
              displaySkew,
              "origin-left w-fit text-[28px] font-medium leading-10 text-[#111] md:text-[34px]",
            )}
          >
            Pick package
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {FITTING_PACKAGES.map((p) => {
              const active = p.id === packageId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPackageId(p.id)}
                  className={cn(
                    "flex flex-col items-start gap-1.5 border border-solid px-5 py-5 text-left",
                    ix.cursor,
                    active
                      ? "border-[#111] bg-[#f5f5f5]"
                      : "border-[#e5e5e5] bg-white hover:border-[#111]",
                  )}
                >
                  <p className="text-[18px] font-medium uppercase leading-7 text-[#111]">
                    {p.title}
                  </p>
                  <p className="flex flex-wrap items-baseline gap-x-1.5 text-[15px] leading-[23px]">
                    <span className="text-[#767676]">From</span>
                    <span className="text-[#767676] line-through">
                      {formatRp(p.fromPrice)}
                    </span>
                    <span className="font-bold text-[#111]">Rp 0</span>
                    <span className="text-[12px] font-medium text-[#111]">
                      /{p.durationMinutes} mins
                    </span>
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-3 py-4">
          <h2
            className={cn(
              displaySkew,
              "origin-left w-fit text-[28px] font-medium leading-10 text-[#111] md:text-[34px]",
            )}
          >
            Pick time
          </h2>

          <div className="flex flex-col items-start gap-6 lg:flex-row">
            <div className="min-w-0 w-full flex-1">
              <div className="flex items-center gap-3 pb-4 sm:pb-5">
                <p className="text-[20px] font-medium leading-7 text-[#767676] sm:text-[22px]">
                  {formatMonthTitle(viewMonth)}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Previous month"
                    disabled={!canPrev}
                    onClick={() => goMonth(-1)}
                    className={cn(
                      "inline-flex size-10 shrink-0 items-center justify-center rounded-[2px] border border-solid border-[#e5e5e5] bg-white",
                      canPrev
                        ? cn(ix.cursor, "hover:border-[#111]")
                        : "cursor-not-allowed opacity-35",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/landing/icon-chevron-left.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="size-4"
                    />
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    disabled={!canNext}
                    onClick={() => goMonth(1)}
                    className={cn(
                      "inline-flex size-10 shrink-0 items-center justify-center rounded-[2px] border border-solid border-[#e5e5e5] bg-white",
                      canNext
                        ? cn(ix.cursor, "hover:border-[#111]")
                        : "cursor-not-allowed opacity-35",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/landing/icon-chevron-right.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="size-4"
                    />
                  </button>
                </div>
              </div>

              <BookingMonthGrid
                calendar={calendar}
                selectedDate={date}
                onSelectDate={selectDate}
              />
              <BookingCalendarLegend />
            </div>

            <aside className="w-full shrink-0 border border-solid border-[#e5e5e5] bg-white p-5 lg:w-[340px] xl:w-[380px]">
              <p className="text-[22px] font-medium leading-7 text-[#111]">
                {formatDayHeading(date)}
              </p>
              <p className="pt-1 text-[13px] font-normal leading-5 text-[#767676]">
                {FITTER.name} · {pkg.durationMinutes} minutes per session
              </p>

              <div className="mt-5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[15px] font-bold text-[#111]">
                    Regular hours
                  </p>
                  <span className="text-[11px] font-bold text-[#767676]">
                    {regularOpen} open
                  </span>
                </div>
                <p className="pt-1 text-[12px] text-[#767676]">
                  Confirmed instantly — no charge for the fitting.
                </p>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {daySlots.regular.map((s) => {
                    const active = time === s.time && slotType === "regular";
                    return (
                      <button
                        key={s.time}
                        type="button"
                        disabled={!s.open}
                        onClick={() => {
                          setTime(s.time);
                          setSlotType("regular");
                        }}
                        className={cn(
                          "min-h-10 border border-solid text-[13px] font-medium",
                          !s.open &&
                            "cursor-not-allowed bg-[#f5f5f5] text-[#919191]",
                          s.open &&
                            !active &&
                            "border-[#e5e5e5] bg-white hover:border-[#111]",
                          active && "border-[#111] bg-[#111] text-white",
                          s.open && ix.cursor,
                        )}
                      >
                        {s.time}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <ByRequestHeading openCount={requestOpen} />
                <p className="pt-1 text-[12px] text-[#767676]">
                  {FITTER.name} confirms first — still free.
                </p>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {daySlots.byRequest.map((s) => {
                    const active =
                      time === s.time && slotType === "by_request";
                    return (
                      <button
                        key={s.time}
                        type="button"
                        disabled={!s.open}
                        onClick={() => {
                          setTime(s.time);
                          setSlotType("by_request");
                        }}
                        className={cn(
                          "min-h-10 border border-solid text-[13px] font-medium",
                          !s.open &&
                            "cursor-not-allowed bg-[#f5f5f5] text-[#919191]",
                          s.open &&
                            !active &&
                            "border-[#e5e5e5] bg-[#fafafa] hover:border-[#111]",
                          active && "border-[#111] bg-[#111] text-white",
                          s.open && ix.cursor,
                        )}
                      >
                        {s.time}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                disabled={!canContinue}
                onClick={() => {
                  if (!time || !slotType) return;
                  saveDraft({
                    packageId,
                    date,
                    time,
                    slotType,
                    notes: loadDraft()?.notes ?? "",
                    fullName: loadDraft()?.fullName,
                    whatsapp: loadDraft()?.whatsapp,
                  });
                  router.push("/fitting/book/details");
                }}
                className={cn(
                  "mt-6 flex min-h-12 w-full items-center justify-center border border-solid text-[12px] font-bold uppercase tracking-[0.6px]",
                  canContinue
                    ? cn("border-[#111] bg-[#111] text-white", ix.btnDark)
                    : "cursor-not-allowed border-[#e5e5e5] bg-[#e5e5e5] text-[#919191]",
                )}
              >
                Continue
              </button>
            </aside>
          </div>
        </section>
      </div>
    </>
  );
}
