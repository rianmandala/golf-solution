"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { displaySkew } from "@/features/landing/typography";
import { ix } from "@/features/landing/interactions";
import { loadConfirmed, type ConfirmedBooking } from "./booking-draft";

export function ConfirmedView() {
  const params = useParams<{ bookingRef: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<ConfirmedBooking | null>(null);

  useEffect(() => {
    const ref = params.bookingRef;
    if (!ref) return;
    const b = loadConfirmed(ref);
    if (!b) {
      router.replace("/coaching");
      return;
    }
    setBooking(b);
  }, [params.bookingRef, router]);

  if (!booking) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 py-16 text-center text-[#767676]">
        Loading…
      </div>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 pb-16 pt-12 md:px-8 md:pb-20 md:pt-16 lg:px-10">
      <div className="flex w-full max-w-[560px] flex-col items-center gap-[22px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/coaching/icon-confirmed.svg"
          alt=""
          width={34}
          height={34}
          className="size-[34px]"
        />

        <h1
          className={cn(
            displaySkew,
            "text-center text-[36px] font-normal leading-[45px] tracking-[0.529px] text-[#111] md:text-[44.084px] md:leading-[44.966px]",
          )}
        >
          Booking confirmed
        </h1>

        <p className="max-w-[480px] text-center text-[15px] font-light leading-[24.75px] text-[#767676]">
          You&apos;re all set. A receipt and the studio address are on their way
          to{" "}
          <span className="font-bold text-[#111]">{booking.whatsapp}</span>.
        </p>

        <div className="inline-flex h-[39.375px] items-center gap-[7px] rounded-[2px] border border-solid border-[#e5e5e5] px-[15px] py-[9px]">
          <span className="size-1.5 rounded-[3px] bg-[#111]" />
          <span className="text-[12.5px] font-bold uppercase tracking-[0.5px] text-[#111]">
            Your spot is locked in
          </span>
        </div>

        <dl className="w-full border-t border-solid border-[#e5e5e5]">
          {(
            [
              ["Coach", booking.coachName],
              ["Date & time", booking.whenLabel],
              ["Package", booking.packageLabel],
              ["Paid", booking.paidLabel],
            ] as const
          ).map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-solid border-[#e5e5e5] pb-4 pt-[15px]"
            >
              <dt className="text-[12px] font-light leading-[18.6px] text-[#767676]">
                {label}
              </dt>
              <dd
                className={cn(
                  "text-right font-bold text-[#111]",
                  label === "Paid"
                    ? "text-[15px] leading-[23px]"
                    : "text-[13.5px] leading-[20.925px]",
                )}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="text-center text-[12.5px] font-light leading-[19.375px] text-[#767676]">
          Need to move it? Message us at least 24 hours ahead.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-5">
          <Link
            href="/coaching"
            className={cn(
              "inline-flex min-h-12 items-center justify-center rounded-[2px] border border-solid border-[#111] bg-[#111] px-8 text-[12px] font-bold tracking-[0.6px] text-white",
              ix.btnDark,
            )}
          >
            Book another session
          </Link>
          <Link
            href="/"
            className={cn(
              "inline-flex border-b-2 border-solid border-[#111] pb-[3px] text-[12px] font-bold tracking-[0.6px] text-[#111]",
              ix.textUnderline,
            )}
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
