"use client";

import { cn } from "@/lib/utils";
import { ix } from "@/features/landing/interactions";
import type { CalendarDay } from "@/features/coaching/data";
import { isDaySelectable } from "@/features/coaching/data";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function statusLabels(cell: CalendarDay, selected: boolean) {
  if (selected) {
    return { mobile: "Pick", desktop: "Your pick", upper: true };
  }
  if (!cell.label) return null;
  const leftMatch = /^(\d+)\s+left$/i.exec(cell.label);
  if (leftMatch) {
    return { mobile: leftMatch[1], desktop: cell.label, upper: false };
  }
  return { mobile: cell.label, desktop: cell.label, upper: true };
}

export function BookingMonthGrid({
  calendar,
  selectedDate,
  onSelectDate,
}: {
  calendar: CalendarDay[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="border-b border-solid border-[#111] pb-1.5 text-center text-[9px] font-bold uppercase leading-tight tracking-[0.8px] text-[#767676] sm:pb-2 sm:text-[10.5px] sm:leading-[16.275px] sm:tracking-[1.05px]"
          >
            <span className="sm:hidden">{d.slice(0, 1)}</span>
            <span className="hidden sm:inline">{d}</span>
          </div>
        ))}
      </div>

      <div className="mt-1.5 grid grid-cols-7 gap-1 sm:mt-2 sm:gap-1.5">
        {calendar.map((cell, idx) => {
          if (cell.kind === "empty") {
            return (
              <div
                key={`e-${idx}`}
                className="min-h-[48px] sm:aspect-square sm:min-h-0"
              />
            );
          }
          const selected = cell.date === selectedDate;
          const selectable = isDaySelectable(cell.kind);
          const muted =
            cell.kind === "closed" ||
            cell.kind === "full" ||
            cell.kind === "past" ||
            cell.kind === "beyond";
          const labels = statusLabels(cell, selected);

          return (
            <button
              key={cell.date || idx}
              type="button"
              disabled={!selectable}
              onClick={() => onSelectDate(cell.date)}
              aria-label={
                selected
                  ? `${cell.day}, your pick`
                  : cell.label
                    ? `${cell.day}, ${cell.label}`
                    : String(cell.day)
              }
              className={cn(
                "flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-[2px] border border-solid px-0.5 py-1 sm:aspect-square sm:min-h-0 sm:gap-1 sm:px-0 sm:py-0",
                selected
                  ? "border-[#111] bg-[#111] text-white"
                  : muted
                    ? "cursor-not-allowed border-[#e5e5e5] bg-[#f2f4ef] text-[#919191]"
                    : "border-[#e5e5e5] bg-white text-[#111] hover:border-[#111]",
                selectable && ix.cursor,
              )}
            >
              <span className="text-[15px] font-normal leading-none sm:text-[19px] sm:leading-[19px]">
                {cell.day}
              </span>
              {labels ? (
                <>
                  <span
                    className={cn(
                      "max-w-full truncate text-center text-[8px] font-bold leading-tight tracking-[0.2px] sm:hidden",
                      labels.upper && "uppercase",
                    )}
                  >
                    {labels.mobile}
                  </span>
                  <span
                    className={cn(
                      "hidden max-w-full truncate text-center text-[10px] font-bold tracking-[0.3px] sm:inline",
                      labels.upper && "uppercase",
                    )}
                  >
                    {labels.desktop}
                  </span>
                </>
              ) : null}
            </button>
          );
        })}
      </div>
    </>
  );
}

export function ByRequestHeading({ openCount }: { openCount: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="inline-flex items-center gap-1.5 text-[15px] font-bold text-[#111]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/coaching/icon-by-request-clock.svg"
          alt=""
          width={13}
          height={13}
          className="size-[13px] shrink-0"
        />
        By request
      </p>
      <span className="text-[11px] font-bold text-[#767676]">
        {openCount} open
      </span>
    </div>
  );
}

export function BookingCalendarLegend() {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#767676] sm:mt-4">
      <span className="inline-flex items-center gap-2">
        <span className="size-3 shrink-0 border border-[#e5e5e5] bg-white" />{" "}
        Available
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="size-3 shrink-0 border border-[#e5e5e5] bg-[#f2f4ef]" />{" "}
        Full / closed
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="size-3 shrink-0 bg-[#111]" /> Your pick
      </span>
    </div>
  );
}
