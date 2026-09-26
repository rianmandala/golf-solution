"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatRp } from "@gs/format";
import { cn } from "@/lib/utils";
import { displaySkew } from "@/features/landing/typography";
import { useAuth } from "@/features/account/auth-provider";
import { track, AnalyticsEvent } from "@/lib/analytics/posthog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FittingPageHeader } from "./booking-chrome";
import {
  clearDraft,
  loadDraft,
  makeFittingRef,
  saveConfirmed,
  saveDraft,
  type FittingDraft,
} from "./booking-draft";
import {
  FITTER,
  formatFittingWhen,
  getFittingPackage,
  packageLabel,
} from "./data";

export function FittingDetailsStep() {
  const router = useRouter();
  const { customer, ready } = useAuth();
  const [draft, setDraft] = useState<FittingDraft | null>(null);
  const [notes, setNotes] = useState("");
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    const d = loadDraft();
    if (!d?.time || !d.slotType) {
      router.replace("/fitting/book");
      return;
    }
    setDraft(d);
    setNotes(d.notes ?? "");
    setFullName(
      d.fullName ||
        (customer
          ? [customer.firstName, customer.lastName].filter(Boolean).join(" ")
          : ""),
    );
    setWhatsapp(d.whatsapp || customer?.whatsapp || "");
  }, [router, customer]);

  if (!ready || !draft) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 py-16 text-[#767676]">
        Loading…
      </div>
    );
  }

  const pkg = getFittingPackage(draft.packageId);
  if (!pkg) {
    router.replace("/fitting/book");
    return null;
  }

  const isByRequest = draft.slotType === "by_request";
  const whenLabel = formatFittingWhen(
    draft.date,
    draft.time,
    pkg.durationMinutes,
  );
  const pkgLabel = packageLabel(pkg);
  const canBook = fullName.trim().length > 0;

  function book() {
    if (!draft || !pkg) return;
    if (!fullName.trim()) {
      setNameError("Name is required");
      return;
    }
    setNameError("");

    const wa = whatsapp.trim() || customer?.whatsapp || "0811111111";
    const ref = makeFittingRef();
    const requested = isByRequest;

    saveDraft({
      ...draft,
      notes,
      fullName: fullName.trim(),
      whatsapp: wa,
    });

    saveConfirmed({
      ...draft,
      notes,
      fullName: fullName.trim(),
      whatsapp: wa,
      ref,
      fitterName: FITTER.name,
      whenLabel,
      packageLabel: pkgLabel,
      fromPriceLabel: `From ${formatRp(pkg.fromPrice)}`,
      chargedLabel: "Rp 0",
      paidLabel: `From ${formatRp(pkg.fromPrice)} Rp 0`,
      status: requested ? "REQUESTED" : "CONFIRMED",
    });
    clearDraft();
    track(AnalyticsEvent.bookingSubmit, {
      type: "fitting",
      slotType: draft.slotType,
      packageId: draft.packageId,
    });
    if (!requested) {
      track(AnalyticsEvent.bookingConfirmed, { ref, type: "fitting" });
    }
    router.push(
      requested
        ? `/fitting/requested/${ref}`
        : `/fitting/confirmed/${ref}`,
    );
  }

  return (
    <>
      <FittingPageHeader step={2} />
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[22px] px-5 py-8 md:px-8 lg:px-10 lg:py-10">
        <h2
          className={cn(
            displaySkew,
            "origin-left w-fit text-[28px] font-medium leading-10 text-[#111] md:text-[34px]",
          )}
        >
          Your details
        </h2>

        <div className="flex flex-col gap-[22px] lg:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fitting-name">Full name</Label>
                <Input
                  id="fitting-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  aria-invalid={Boolean(nameError)}
                  className="px-3.5"
                />
                {nameError ? (
                  <p className="text-[12px] text-[#b42318]">{nameError}</p>
                ) : null}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fitting-wa">WhatsApp number (optional)</Label>
                <div className="flex h-[47px] overflow-hidden rounded-[2px] border border-solid border-[#c8c8c8] focus-within:border-[#111]">
                  <span className="flex items-center border-r border-[#e5e5e5] bg-[#f5f5f5] px-3 text-[14px] text-[#767676]">
                    +62
                  </span>
                  <input
                    id="fitting-wa"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Cth: 817665524241"
                    className="min-w-0 flex-1 bg-white px-3.5 text-[15px] text-[#111] outline-none placeholder:text-[#919191]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fitting-notes">
                Anything we should know (optional)
              </Label>
              <Textarea
                id="fitting-notes"
                value={notes}
                maxLength={300}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Preferensi shaft, dll"
                className="min-h-[89px] resize-none px-3.5 py-3"
              />
              <p className="text-right text-[12px] text-[#919191]">
                {notes.length} / 300
              </p>
            </div>
          </div>

          <aside className="flex w-full shrink-0 flex-col gap-[22px] border border-solid border-[#111] px-5 py-[18px] lg:w-[380px]">
            <h3
              className={cn(
                displaySkew,
                "origin-left w-fit text-[22px] font-medium uppercase leading-7 text-[#111]",
              )}
            >
              Your booking
            </h3>
            <dl className="w-full">
              <div className="flex items-center justify-between border-b border-solid border-[#e5e5e5] py-3">
                <dt className="text-[12px] font-light text-[#767676]">
                  Fitter
                </dt>
                <dd className="text-[13.5px] font-bold text-[#111]">
                  {FITTER.name}
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-solid border-[#e5e5e5] py-3">
                <dt className="text-[12px] font-light text-[#767676]">
                  Date & time
                </dt>
                <dd className="text-right text-[13.5px] font-bold text-[#111]">
                  {whenLabel}
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-solid border-[#e5e5e5] py-3">
                <dt className="text-[12px] font-light text-[#767676]">
                  Package
                </dt>
                <dd className="text-right text-[13.5px] font-bold text-[#111]">
                  {pkgLabel}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[12px] font-light text-[#767676]">Total</dt>
                <dd className="flex items-baseline gap-1.5 text-right">
                  <span className="text-[15px] text-[#767676]">
                    From{" "}
                    <span className="line-through">
                      {formatRp(pkg.fromPrice)}
                    </span>
                  </span>
                  <span className="text-[22px] font-bold leading-7 text-[#111]">
                    Rp 0
                  </span>
                </dd>
              </div>
            </dl>

            {isByRequest ? (
              <div className="w-full rounded-[2px] border border-dashed border-[#e5e5e5] bg-[#f5f5f5] px-4 py-3.5">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/coaching/icon-approval-clock.svg"
                    alt=""
                    width={15}
                    height={15}
                    className="size-[15px] shrink-0"
                  />
                  <p className="text-[12px] font-bold leading-[18.6px] tracking-[0.24px] text-[#111]">
                    Needs {FITTER.name}&apos;s approval
                  </p>
                </div>
                <ul className="mt-2.5 space-y-1 pl-[15px]">
                  {[
                    "Nothing is charged yet",
                    "Reply by WhatsApp, usually within the hour",
                    "If declined, pick another slot",
                  ].map((line) => (
                    <li
                      key={line}
                      className="relative text-[12px] font-light leading-[18px] text-[#767676]"
                    >
                      <span className="absolute -left-[11px] top-2 size-[3px] rounded-[1.5px] bg-[#767676] opacity-60" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Button
              type="button"
              disabled={!canBook}
              onClick={book}
              className={cn(
                "w-full",
                !canBook && "pointer-events-none opacity-40",
              )}
            >
              Book now
            </Button>

            {!canBook ? (
              <p className="text-[12px] font-light leading-[18.6px] text-[#767676]">
                Still needed: your name
                {!whatsapp.trim() ? ", your WhatsApp number." : "."}
              </p>
            ) : null}
          </aside>
        </div>
      </div>
    </>
  );
}
