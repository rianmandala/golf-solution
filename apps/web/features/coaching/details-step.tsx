"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { displaySkew } from "@/features/landing/typography";
import { ix } from "@/features/landing/interactions";
import { useAuth } from "@/features/account/auth-provider";
import { track, AnalyticsEvent } from "@/lib/analytics/posthog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CoachingPageHeader } from "./booking-chrome";
import {
  clearDraft,
  loadDraft,
  makeBookingRef,
  paymentExpiresIn,
  saveConfirmed,
  saveDraft,
  savePending,
  type CoachingDraft,
  type PaymentMethodId,
} from "./booking-draft";
import {
  formatBookingWhen,
  getCoach,
  packageOptions,
  type PackageOptionId,
} from "./data";
import { isVaPayment, VA_BANKS, vaBankLabel } from "./payment-methods";

function packageForCoach(
  packages:
    | {
        coachId: string;
        coachName: string;
        creditsTotal: number;
        creditsUsed: number;
        creditsReserved: number;
      }[]
    | undefined,
  coachId: string,
) {
  if (!packages?.length) return null;
  return (
    packages.find((p) => {
      if (coachId === "wonjun") {
        return p.coachId === "c-wonjun" || /wonjun/i.test(p.coachName);
      }
      return p.coachId === "c-shern" || /shern/i.test(p.coachName);
    }) ?? null
  );
}

const PACKAGE_PRICES: Record<Exclude<PackageOptionId, "credit">, number> = {
  single: 1_750_000,
  pack10: 16_500_000,
  pack20: 30_000_000,
};

export function DetailsStep() {
  const router = useRouter();
  const { customer, isAuthenticated, ready } = useAuth();
  const [draft, setDraft] = useState<CoachingDraft | null>(null);
  const [notes, setNotes] = useState("");
  const [packageId, setPackageId] = useState<PackageOptionId>("single");
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("qris");
  /** Accordion open panel — independent of selected method so panels can collapse. */
  const [paymentPanel, setPaymentPanel] = useState<"qris" | "va" | null>("qris");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    const d = loadDraft();
    if (!d) {
      router.replace("/coaching");
      return;
    }
    setDraft(d);
    setNotes(d.notes);
    setPackageId(d.packageId === "credit" ? "credit" : d.packageId);
    setFullName(
      d.fullName ||
        (customer
          ? [customer.firstName, customer.lastName].filter(Boolean).join(" ")
          : ""),
    );
    setWhatsapp(d.whatsapp || customer?.whatsapp || "");
    const method = d.paymentMethod || "qris";
    setPaymentMethod(method);
    setPaymentPanel(isVaPayment(method) ? "va" : "qris");
  }, [router, customer]);

  const coach = draft ? getCoach(draft.coachId) : undefined;
  const coachPkg = useMemo(() => {
    if (!draft || !customer) return null;
    return packageForCoach(customer.packages, draft.coachId);
  }, [customer, draft]);
  const creditLeft = coachPkg
    ? Math.max(
        0,
        coachPkg.creditsTotal - coachPkg.creditsUsed - coachPkg.creditsReserved,
      )
    : null;
  const hasSessions = (creditLeft ?? 0) >= 1;

  const options = useMemo(() => {
    if (!coach) return [];
    return packageOptions(coach, hasSessions ? creditLeft : null);
  }, [coach, creditLeft, hasSessions]);

  useEffect(() => {
    if (!options.length) return;
    if (!options.some((o) => o.id === packageId)) {
      setPackageId(options[0].id);
    }
  }, [options, packageId]);

  if (!ready || !draft || !coach) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 py-16 text-[#767676]">
        Loading…
      </div>
    );
  }

  const displayName = customer
    ? [customer.firstName, customer.lastName].filter(Boolean).join(" ")
    : "Guest";
  const whenLabel = formatBookingWhen(draft.date, draft.time);
  const selected = options.find((o) => o.id === packageId) ?? options[0];
  const isCredit = packageId === "credit";
  const isByRequest = draft.slotType === "by_request";
  const isCashPath = !isCredit;

  const packageSummaryLabel = isCredit
    ? "Package SESSIONS (1 session)"
    : selected.title;
  const totalLabel = isCredit ? "1 SESSIONS" : selected.priceLabel;
  const cashAmount =
    packageId === "credit" ? 0 : PACKAGE_PRICES[packageId] ?? coach.fromPrice;

  // Figma by-request CTAs use BOOK NOW (same as regular)
  const ctaLabel = "Book now";

  const needsIdentityFields = isCashPath;
  const qrisOpen = paymentPanel === "qris";
  const vaOpen = paymentPanel === "va";
  const canBookCredit = isAuthenticated && isCredit && hasSessions;
  const canBookCash = isCashPath && fullName.trim().length > 0;

  function book() {
    if (!draft || !coach) return;

    if (needsIdentityFields && !fullName.trim()) {
      setNameError("Name is required");
      return;
    }
    setNameError("");

    const ref = makeBookingRef();
    const wa = whatsapp.trim() || customer?.whatsapp || "0811111111";

    if (isCredit) {
      const leftAfter =
        creditLeft !== null ? Math.max(0, creditLeft - 1) : null;
      const requested = isByRequest;
      saveConfirmed({
        ...draft,
        packageId,
        notes,
        fullName: displayName,
        whatsapp: wa,
        ref,
        coachName: coach.name,
        whenLabel,
        packageLabel: packageSummaryLabel,
        paidLabel: requested
          ? "1 SESSIONS — used after approval"
          : `1 SESSIONS — ${leftAfter ?? 0} left`,
        creditsLeftAfter: leftAfter,
        status: requested ? "REQUESTED" : "CONFIRMED",
        paymentKind: "credit",
      });
      clearDraft();
      track(AnalyticsEvent.bookingSubmit, {
        slotType: draft.slotType,
        payment: "credit",
      });
      if (!requested) {
        track(AnalyticsEvent.bookingConfirmed, { ref });
      }
      router.push(
        requested
          ? `/coaching/requested/${ref}`
          : `/coaching/confirmed/${ref}`,
      );
      return;
    }

    // Cash (regular or by-request) → awaiting payment per Figma
    saveDraft({
      ...draft,
      packageId,
      notes,
      fullName: fullName.trim(),
      whatsapp: wa,
      paymentMethod,
    });
    savePending({
      ...draft,
      packageId,
      notes,
      fullName: fullName.trim(),
      whatsapp: wa,
      paymentMethod,
      ref,
      coachName: coach.name,
      whenLabel,
      packageLabel: packageSummaryLabel,
      paidLabel: selected.priceLabel,
      creditsLeftAfter: null,
      status: "AWAITING_PAYMENT",
      paymentKind: "cash",
      amount: cashAmount,
      paymentExpiresAt: paymentExpiresIn(60),
      vaNumber: isVaPayment(paymentMethod) ? "8830 1122 7788" : "",
      vaBank: isVaPayment(paymentMethod) ? vaBankLabel(paymentMethod) : "QRIS",
      vaAccountName: "PT Golf Solutions Indonesia",
    });
    clearDraft();
    track(AnalyticsEvent.bookingSubmit, {
      slotType: draft.slotType,
      payment: "cash",
    });
    router.push(`/coaching/pay/${ref}`);
  }

  return (
    <>
      <CoachingPageHeader step={2} />
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
            {isAuthenticated && hasSessions ? (
              <div className="flex flex-col gap-3 border border-solid border-[#d3d3d3] bg-[#f5f5f5] px-[18px] py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[15px] font-bold leading-[23px] text-[#111]">
                    Booking as {displayName}
                  </p>
                  <p className="text-[13px] font-normal leading-5 text-[#767676]">
                    Your details are on file — nothing to fill in.
                  </p>
                </div>
                {coachPkg ? (
                  <span className="inline-flex w-fit rounded-full border border-solid border-[#e5e5e5] bg-white px-2.5 py-1 text-[13px]">
                    <span className="font-bold text-[#5f7031]">{creditLeft}</span>
                    <span className="font-bold text-[#111]">
                      {` of ${coachPkg.creditsTotal} sessions left`}
                    </span>
                  </span>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-bold uppercase tracking-[0.48px] text-[#767676]">
                Package
              </p>
              <div
                className={cn(
                  "grid grid-cols-1 gap-3",
                  hasSessions
                    ? "sm:grid-cols-2 xl:grid-cols-4"
                    : "sm:grid-cols-3",
                )}
              >
                {options.map((opt) => {
                  const active = packageId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPackageId(opt.id)}
                      className={cn(
                        "flex flex-col items-start gap-[3px] border border-solid px-3.5 pb-3.5 pt-[13px] text-left",
                        ix.cursor,
                        active
                          ? "border-[#111] bg-[#f5f5f5]"
                          : "border-[#e5e5e5] bg-white hover:border-[#111]",
                      )}
                    >
                      {opt.creditOnly ? (
                        <p className="text-[11px] font-bold leading-[14px] text-[#5f7031]">
                          {opt.title}
                        </p>
                      ) : null}
                      <p className="text-[15px] font-normal leading-[23px] text-[#111]">
                        {opt.creditOnly ? opt.subtitle : opt.title}
                      </p>
                      <p className="text-[15px] font-bold leading-[23px] text-[#111]">
                        {opt.priceLabel}
                      </p>
                      {opt.meta ? (
                        <p className="text-[11px] font-bold leading-[14px] text-[#767676]">
                          {opt.meta}
                        </p>
                      ) : null}
                      {opt.save ? (
                        <p className="text-[11px] font-bold leading-[14px] text-[#5f7031]">
                          {opt.save}
                        </p>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {needsIdentityFields ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="booking-name">Full name</Label>
                  <Input
                    id="booking-name"
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
                  <Label htmlFor="booking-wa">
                    WhatsApp number (optional)
                  </Label>
                  {/* Compound +62 prefix — keep custom (Input alone can't match Figma) */}
                  <div className="flex h-[47px] overflow-hidden rounded-[2px] border border-solid border-[#c8c8c8] focus-within:border-[#111]">
                    <span className="flex items-center border-r border-[#e5e5e5] bg-[#f5f5f5] px-3 text-[14px] text-[#767676]">
                      +62
                    </span>
                    <input
                      id="booking-wa"
                      type="tel"
                      value={whatsapp.replace(/^\+?62/, "").replace(/^0/, "")}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="Cth: 817665524241"
                      className="h-full min-w-0 flex-1 bg-white px-3.5 text-[15px] outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="coaching-notes">
                Anything we should know (optional)
              </Label>
              <div className="relative rounded-[2px] border border-solid border-[#c8c8c8] bg-white focus-within:border-[#111]">
                <Textarea
                  id="coaching-notes"
                  value={notes}
                  maxLength={300}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Preferensi shaft, dll"
                  className="min-h-[89px] border-0 focus-visible:border-0"
                />
                <p className="px-3.5 pb-2 text-right text-[12px] text-[#919191]">
                  {notes.length} / 300
                </p>
              </div>
            </div>

            {isCashPath ? (
              <div className="flex w-full flex-col gap-[22px] border border-solid border-[#e5e5e5] bg-white p-5">
                <p className="text-[12.5px] font-bold uppercase tracking-[1.5px] text-[#111]">
                  Payment method
                </p>
                <div className="flex flex-col gap-3" role="list">
                  {/* QRIS accordion — exclusive with VA */}
                  <div
                    className="border border-solid border-[#e5e5e5] bg-white"
                    role="listitem"
                  >
                    <button
                      type="button"
                      aria-expanded={qrisOpen}
                      onClick={() => {
                        if (qrisOpen) {
                          setPaymentPanel(null);
                          return;
                        }
                        setPaymentPanel("qris");
                        setPaymentMethod("qris");
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2 text-left",
                        ix.cursor,
                      )}
                    >
                      <span className="text-[15px] font-normal uppercase leading-[23px] text-[#111]">
                        Pay using QRIS
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/coaching/icon-chevron.svg"
                        alt=""
                        width={24}
                        height={24}
                        className={cn(
                          "size-6 transition-transform duration-200",
                          !qrisOpen && "rotate-180",
                        )}
                      />
                    </button>
                    {qrisOpen ? (
                      <div className="flex items-center gap-4 px-3 pb-2">
                        <span className="relative flex size-[13px] shrink-0 items-center justify-center rounded-full border border-solid border-[#111] bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/coaching/icon-radio-check.svg"
                            alt=""
                            width={8}
                            height={8}
                            className="size-2"
                          />
                        </span>
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/coaching/logo-qris.png"
                            alt="QRIS"
                            width={24}
                            height={24}
                            className="size-6 object-contain"
                          />
                          <span className="text-[15px] font-bold leading-[23px] text-[#111]">
                            QRIS
                          </span>
                          <span className="text-[12px] font-medium leading-[14px] text-[#767676]">
                            Maximum transaction limit: Rp10,000,000
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* VA accordion — exclusive with QRIS */}
                  <div
                    className="border border-solid border-[#e5e5e5] bg-white"
                    role="listitem"
                  >
                    <button
                      type="button"
                      aria-expanded={vaOpen}
                      onClick={() => {
                        if (vaOpen) {
                          setPaymentPanel(null);
                          return;
                        }
                        setPaymentPanel("va");
                        if (!isVaPayment(paymentMethod)) {
                          setPaymentMethod("va_bca");
                        }
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2 text-left",
                        ix.cursor,
                      )}
                    >
                      <span className="text-[15px] font-normal uppercase leading-[23px] text-[#111]">
                        Transfer to virtual account
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/coaching/icon-chevron.svg"
                        alt=""
                        width={24}
                        height={24}
                        className={cn(
                          "size-6 transition-transform duration-200",
                          !vaOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {vaOpen ? (
                      <div className="flex flex-col px-3 pb-1">
                        {VA_BANKS.map((bank, index) => {
                          const selected = paymentMethod === bank.method;
                          return (
                            <div key={bank.id}>
                              {index > 0 ? (
                                <div className="h-px w-full bg-[#eee]" />
                              ) : null}
                              <button
                                type="button"
                                onClick={() => {
                                  setPaymentMethod(bank.method);
                                  setPaymentPanel("va");
                                }}
                                className={cn(
                                  "flex w-full items-center gap-4 py-3 text-left",
                                  ix.cursor,
                                )}
                              >
                                <span
                                  className={cn(
                                    "relative flex size-[13px] shrink-0 items-center justify-center rounded-full border border-solid bg-white",
                                    selected
                                      ? "border-[#111]"
                                      : "border-[#767676]",
                                  )}
                                >
                                  {selected ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src="/coaching/icon-radio-check.svg"
                                      alt=""
                                      width={8}
                                      height={8}
                                      className="size-2"
                                    />
                                  ) : null}
                                </span>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={bank.logo}
                                  alt=""
                                  width={24}
                                  height={24}
                                  className="size-6 object-contain"
                                />
                                <span className="text-[15px] font-normal leading-[23px] text-[#111]">
                                  {bank.label}
                                </span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2 px-3 pb-2">
                        {VA_BANKS.map((bank) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={bank.id}
                            src={bank.logo}
                            alt=""
                            width={32}
                            height={32}
                            className="size-8 object-contain"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
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
                <dt className="text-[12px] font-light text-[#767676]">Coach</dt>
                <dd className="text-[13.5px] font-bold text-[#111]">
                  {coach.name}
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
                  {packageSummaryLabel}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[12px] font-light text-[#767676]">Total</dt>
                <dd className="text-right">
                  <p
                    className={cn(
                      "text-[22px] font-normal leading-[34px] text-[#111]",
                      isCredit && "uppercase",
                    )}
                  >
                    {totalLabel}
                  </p>
                  {isByRequest ? (
                    <p className="text-[11px] font-normal leading-[17px] tracking-[0.11px] text-[#767676]">
                      charged after approval
                    </p>
                  ) : null}
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
                    Needs {coach.name}&apos;s approval
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
              disabled={!(canBookCredit || canBookCash)}
              onClick={book}
              className={cn(
                "w-full",
                !(canBookCredit || canBookCash) &&
                  "pointer-events-none opacity-40",
              )}
            >
              {ctaLabel}
            </Button>

            {isCredit && !isByRequest ? (
              <p className="text-[12px] font-light leading-[18.6px] text-[#767676]">
                No payment — this uses 1 credit from your package.
              </p>
            ) : isCredit && isByRequest ? (
              <p className="text-[12px] font-light leading-[18.6px] text-[#767676]">
                No payment — 1 credit is used once the coach approves.
              </p>
            ) : needsIdentityFields && !fullName.trim() ? (
              <p className="text-[12px] font-light leading-[18.6px] text-[#767676]">
                Still needed: your name.
              </p>
            ) : null}

            {!isAuthenticated && hasSessions === false ? (
              <p className="text-[12px] text-[#767676]">
                Or{" "}
                <Link href="/" className="underline">
                  log in
                </Link>{" "}
                with the demo &quot;With sessions&quot; account to use credits.
              </p>
            ) : null}
          </aside>
        </div>
      </div>
    </>
  );
}
