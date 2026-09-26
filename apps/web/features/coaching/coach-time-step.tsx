"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatRp } from "@gs/format";
import { cn } from "@/lib/utils";
import { displaySkew } from "@/features/landing/typography";
import { ix } from "@/features/landing/interactions";
import { CoachingPageHeader } from "./booking-chrome";
import { saveDraft } from "./booking-draft";
import {
  buildAugust2026Calendar,
  coaches,
  formatDayHeading,
  getCoach,
  slotsForDay,
  type CoachId,
  type SlotType,
} from "./data";

export function CoachTimeStep() {
  const router = useRouter();
  const calendar = useMemo(() => buildAugust2026Calendar(), []);
  const [coachId, setCoachId] = useState<CoachId>("wonjun");
  const [date, setDate] = useState("2026-08-14");
  const [time, setTime] = useState<string | null>(null);
  const [slotType, setSlotType] = useState<SlotType | null>(null);

  const coach = getCoach(coachId)!;
  const daySlots = slotsForDay(date);
  const regularOpen = daySlots.regular.filter((s) => s.open).length;
  const requestOpen = daySlots.byRequest.filter((s) => s.open).length;
  const canContinue = Boolean(coachId && date && time && slotType);

  return (
    <>
      <CoachingPageHeader step={1} />
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[22px] px-5 py-8 md:px-8 lg:px-10 lg:py-10">
        <section className="flex flex-col gap-[22px] py-4">
          <h2 className={cn(displaySkew, "origin-left w-fit text-[28px] font-medium leading-10 text-[#111] md:text-[34px]")}>
            Pick your coach
          </h2>
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {coaches.map((c) => {
              const selected = c.id === coachId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCoachId(c.id);
                    setTime(null);
                    setSlotType(null);
                  }}
                  className={cn(
                    "flex items-center gap-[22px] rounded-[2px] border border-solid bg-white p-5 text-left",
                    ix.cursor,
                    selected
                      ? "border-[#111]"
                      : "border-[#e5e5e5] transition-colors duration-200 hover:border-[#111]",
                  )}
                >
                  <div className="relative size-24 shrink-0 overflow-hidden border border-solid border-[#e5e5e5]">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      className="object-cover object-center"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <p className="text-[22px] font-medium leading-7 text-[#111]">
                      {c.name}
                    </p>
                    <p className="text-[13px] font-normal leading-5 text-[#767676]">
                      {c.specialism}
                    </p>
                    <p className="text-[12px] font-medium leading-[14px] text-[#111]">
                      From {formatRp(c.fromPrice)} / session
                    </p>
                    <Link
                      href={`/coaching/${c.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "mt-0.5 inline-flex w-fit border-b border-solid border-[#111] text-[14px] font-semibold leading-[14px] text-[#111]",
                        ix.textUnderline,
                      )}
                    >
                      View profile
                    </Link>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-3 py-4">
          <h2 className={cn(displaySkew, "origin-left w-fit text-[28px] font-medium leading-10 text-[#111] md:text-[34px]")}>
            Pick time
          </h2>

          <div className="flex flex-col items-start gap-6 xl:flex-row">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 pb-5">
                <p className="text-[22px] font-medium leading-7 text-[#767676]">
                  August 2026
                </p>
                <div className="flex gap-2">
                  <span className="flex size-10 items-center justify-center rounded-[2px] border border-solid border-[#e5e5e5] bg-white opacity-35">
                    ‹
                  </span>
                  <span className="flex size-10 items-center justify-center rounded-[2px] border border-solid border-[#e5e5e5] bg-white text-[15px] text-[#767676]">
                    ›
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div
                    key={d}
                    className="border-b border-solid border-[#111] pb-2 text-center text-[10.5px] font-bold uppercase leading-[16.275px] tracking-[1.05px] text-[#767676]"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-7 gap-1.5">
                {calendar.map((cell, idx) => {
                  if (cell.kind === "empty") {
                    return <div key={`e-${idx}`} className="aspect-square" />;
                  }
                  const selected = cell.date === date;
                  const selectable =
                    cell.kind === "available" || cell.kind === "by_request";
                  return (
                    <button
                      key={cell.date || idx}
                      type="button"
                      disabled={!selectable}
                      onClick={() => {
                        if (!selectable) return;
                        setDate(cell.date);
                        setTime(null);
                        setSlotType(null);
                      }}
                      className={cn(
                        "flex aspect-square flex-col items-center justify-center gap-1 rounded-[2px] border border-solid",
                        selected
                          ? "border-[#111] bg-[#111] text-white"
                          : cell.kind === "closed"
                            ? "cursor-not-allowed border-[#e5e5e5] bg-[#f2f4ef] text-[#919191]"
                            : cell.kind === "by_request"
                              ? "border-[#e5e5e5] bg-white text-[#111] hover:border-[#111]"
                              : "border-[#e5e5e5] bg-white text-[#111] hover:border-[#111]",
                        selectable && ix.cursor,
                      )}
                    >
                      <span className="text-[19px] font-normal leading-[19px]">
                        {cell.day}
                      </span>
                      {selected ? (
                        <span className="text-[10px] font-bold uppercase tracking-[0.3px]">
                          Your pick
                        </span>
                      ) : cell.label ? (
                        <span
                          className={cn(
                            "text-[10px] font-bold tracking-[0.3px]",
                            cell.kind === "closed" || cell.kind === "by_request"
                              ? "uppercase"
                              : "",
                          )}
                        >
                          {cell.label}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-[#767676]">
                <span className="inline-flex items-center gap-2">
                  <span className="size-3 border border-[#e5e5e5] bg-white" /> Available
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="size-3 border border-[#e5e5e5] bg-[#f2f4ef]" /> Full / closed
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="size-3 bg-[#111]" /> Your pick
                </span>
              </div>
            </div>

            <aside className="w-full shrink-0 border border-solid border-[#e5e5e5] bg-white p-5 xl:w-[380px]">
              <p className="text-[22px] font-medium leading-7 text-[#111]">
                {formatDayHeading(date)}
              </p>
              <p className="pt-1 text-[13px] font-normal leading-5 text-[#767676]">
                {coach.name} · 60 minutes per session
              </p>

              <div className="mt-5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[15px] font-bold text-[#111]">Regular hours</p>
                  <span className="text-[11px] font-bold text-[#767676]">
                    {regularOpen} open
                  </span>
                </div>
                <p className="pt-1 text-[12px] text-[#767676]">
                  Pay now — confirmed instantly.
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
                          !s.open && "cursor-not-allowed bg-[#f5f5f5] text-[#919191]",
                          s.open && !active && "border-[#e5e5e5] bg-white hover:border-[#111]",
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
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[15px] font-bold text-[#111]">By request</p>
                  <span className="text-[11px] font-bold text-[#767676]">
                    {requestOpen} open
                  </span>
                </div>
                <p className="pt-1 text-[12px] text-[#767676]">
                  {coach.name} confirms first, then you pay.
                </p>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {daySlots.byRequest.map((s) => {
                    const active = time === s.time && slotType === "by_request";
                    return (
                      <button
                        key={s.time}
                        type="button"
                        onClick={() => {
                          setTime(s.time);
                          setSlotType("by_request");
                        }}
                        className={cn(
                          "min-h-10 border border-solid text-[13px] font-medium",
                          !active && "border-[#e5e5e5] bg-[#fafafa] hover:border-[#111]",
                          active && "border-[#111] bg-[#111] text-white",
                          ix.cursor,
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
                    coachId,
                    date,
                    time,
                    slotType,
                    packageId: "credit",
                    notes: "",
                  });
                  router.push("/coaching/details");
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
