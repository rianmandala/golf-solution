"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatRp } from "@gs/format";
import { cn } from "@/lib/utils";
import { displaySkew } from "@/features/landing/typography";
import { ix } from "@/features/landing/interactions";
import { track, AnalyticsEvent } from "@/lib/analytics/posthog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  clearPending,
  loadPending,
  saveConfirmed,
  saveDraft,
  type PendingPayment,
} from "./booking-draft";
import { isVaPayment } from "./payment-methods";

function useCountdown(expiresAt: string | null) {
  const [left, setLeft] = useState("--:--");

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const ms = new Date(expiresAt).getTime() - Date.now();
      if (ms <= 0) {
        setLeft("00:00");
        return;
      }
      const totalSec = Math.floor(ms / 1000);
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      setLeft(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [expiresAt]);

  return left;
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value.replace(/\s/g, ""));
  } catch {
    // ignore demo clipboard failures
  }
}

const HOW_TO_PAY_VA = [
  {
    id: "mbanking",
    title: "How to pay — m-Banking (BCA mobile)",
    steps: [
      "Open BCA mobile, choose m-Transfer → Antar Rekening.",
      "Enter account number 8830 1122 7788.",
      "Enter the exact amount shown above.",
      "Confirm with your PIN and keep the receipt.",
    ],
  },
  {
    id: "atm",
    title: "How to pay — ATM BCA",
    steps: [
      "Insert your card, choose Transfer → Ke Rek BCA.",
      "Enter 8830 1122 7788 and the exact amount.",
      "Finish and keep the printed receipt.",
    ],
  },
  {
    id: "ib",
    title: "How to pay — Internet banking",
    steps: [
      "Log in to KlikBCA, choose Fund Transfer.",
      "Add 8830 1122 7788 as destination and transfer the exact amount.",
      "Approve with keyBCA.",
    ],
  },
] as const;

const HOW_TO_PAY_QRIS = [
  "Open your banking or payment app.",
  "Select the option to scan QR code.",
  "Point your camera at the QRIS code.",
  "Enter the payment amount if required.",
  "Confirm and complete the payment.",
] as const;

export function AwaitingPaymentView() {
  const params = useParams<{ bookingRef: string }>();
  const router = useRouter();
  const [pending, setPending] = useState<PendingPayment | null>(null);
  const countdown = useCountdown(pending?.paymentExpiresAt ?? null);

  useEffect(() => {
    const ref = params.bookingRef;
    if (!ref) return;
    const p = loadPending(ref);
    if (!p) {
      router.replace("/coaching");
      return;
    }
    setPending(p);
  }, [params.bookingRef, router]);

  if (!pending) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 py-16 text-[#767676]">
        Loading…
      </div>
    );
  }

  const isQris = !isVaPayment(pending.paymentMethod);

  function markPaid() {
    if (!pending) return;
    const confirmed = {
      ...pending,
      status: "CONFIRMED" as const,
      paidLabel: formatRp(pending.amount),
    };
    saveConfirmed(confirmed);
    clearPending(pending.ref);
    track(AnalyticsEvent.bookingConfirmed, {
      ref: pending.ref,
      payment: isQris ? "qris" : "va",
    });
    router.push(`/coaching/confirmed/${pending.ref}`);
  }

  function restoreDraft() {
    if (!pending) return;
    saveDraft({
      coachId: pending.coachId,
      date: pending.date,
      time: pending.time,
      slotType: pending.slotType,
      packageId: pending.packageId,
      notes: pending.notes,
      fullName: pending.fullName,
      whatsapp: pending.whatsapp,
      paymentMethod: pending.paymentMethod,
    });
  }

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-5 md:px-8 lg:px-10 lg:py-5">
      <div className="flex flex-col gap-6 pt-6 lg:flex-row lg:gap-[22px] lg:pt-[34px]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/coaching/icon-awaiting-clock-box.svg"
              alt=""
              width={46}
              height={46}
              className="size-[46px] shrink-0"
            />
            <div className="flex flex-col gap-1.5">
              <h1 className="text-[28px] font-medium uppercase leading-9 text-[#111] md:text-[34px] md:leading-10">
                Awaiting payment
              </h1>
              <p className="max-w-xl text-[12px] font-normal leading-[17px] text-[#767676]">
                Complete your payment before the timer runs out — unpaid orders
                are cancelled automatically.
              </p>
            </div>
          </div>

          <div className="mt-6 border border-solid border-[#e5e5e5] bg-white">
            <div className="flex items-center justify-center gap-3 bg-[#8a5a00] px-5 py-[5px] text-white">
              <span className="text-[15px] font-normal leading-[23px]">
                Time left to pay
              </span>
              <span className="text-[22px] font-medium leading-7 tabular-nums">
                {countdown}
              </span>
            </div>

            <div className="flex flex-col gap-3 px-[26px] pb-5 pt-[22px]">
              {isQris ? (
                <div className="flex flex-col gap-3 lg:flex-row">
                  <div className="flex flex-1 items-center justify-center bg-[#f5f5f5] p-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/coaching/qris-payment.png"
                      alt="QRIS payment code"
                      width={397}
                      height={503}
                      className="h-auto w-full max-w-[397px] object-contain"
                    />
                  </div>

                  <div className="flex w-full flex-col gap-3 lg:max-w-[437px]">
                    <div className="flex flex-col gap-3 bg-[#f5f5f5] p-5">
                      <p className="text-[12px] font-normal leading-[17px] text-[#767676]">
                        Transfer amount
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-[28px] font-medium leading-10 text-[#111] md:text-[34px]">
                          {formatRp(pending.amount)}
                        </p>
                        <button
                          type="button"
                          onClick={() => copyText(String(pending.amount))}
                          className={cn(
                            "px-2 py-2.5 text-[12px] font-semibold uppercase underline",
                            ix.cursor,
                          )}
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/coaching/icon-warning.svg"
                        alt=""
                        width={15}
                        height={15}
                        className="mt-0.5 size-[15px] shrink-0"
                      />
                      <p className="text-[12px] font-normal leading-[17px] text-[#767676]">
                        Transfer{" "}
                        <span className="text-[#111]">
                          the exact amount, down to the last digit
                        </span>
                        , so auto-verification can match your payment. Proof of
                        transfer can be sent via WhatsApp.
                      </p>
                    </div>

                    <Accordion
                      type="single"
                      collapsible
                      className="border-t border-solid border-[#e5e5e5]"
                    >
                      <AccordionItem
                        value="qris"
                        className="border-b border-solid border-[#e5e5e5]"
                      >
                        <AccordionTrigger className="px-0.5 py-[13px] hover:no-underline">
                          <span className="text-[13px] font-normal leading-5 text-[#111]">
                            How to pay — QRIS
                          </span>
                          <span className="text-[15px] font-bold tracking-[0.5px] text-[#111] group-data-[state=open]:hidden">
                            +
                          </span>
                          <span className="hidden text-[15px] font-bold tracking-[0.5px] text-[#111] group-data-[state=open]:inline">
                            −
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-3.5">
                          <div className="flex flex-col gap-2">
                            {HOW_TO_PAY_QRIS.map((step, i) => (
                              <div
                                key={step}
                                className="flex gap-2 text-[12px] font-normal leading-[17px] text-[#808080]"
                              >
                                <span className="w-4 shrink-0">{i + 1}.</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="flex flex-col gap-3 bg-[#f5f5f5] p-5">
                      <p className="text-[12px] font-normal uppercase leading-[17px] text-[#767676]">
                        Virtual account {pending.vaBank}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-[28px] font-medium leading-10 text-[#111] md:text-[34px]">
                          {pending.vaNumber}
                        </p>
                        <button
                          type="button"
                          onClick={() => copyText(pending.vaNumber)}
                          className={cn(
                            "px-2 py-2.5 text-[12px] font-semibold uppercase underline",
                            ix.cursor,
                          )}
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-[12px] font-normal leading-[17px] text-[#767676]">
                        {pending.vaBank} — {pending.vaAccountName}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 bg-[#f5f5f5] p-5">
                      <p className="text-[12px] font-normal leading-[17px] text-[#767676]">
                        Transfer amount
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-[28px] font-medium leading-10 text-[#111] md:text-[34px]">
                          {formatRp(pending.amount)}
                        </p>
                        <button
                          type="button"
                          onClick={() => copyText(String(pending.amount))}
                          className={cn(
                            "px-2 py-2.5 text-[12px] font-semibold uppercase underline",
                            ix.cursor,
                          )}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/coaching/icon-warning.svg"
                      alt=""
                      width={15}
                      height={15}
                      className="mt-0.5 size-[15px] shrink-0"
                    />
                    <p className="text-[12px] font-normal leading-[17px] text-[#767676]">
                      Transfer{" "}
                      <span className="text-[#111]">
                        the exact amount, down to the last digit
                      </span>
                      , so auto-verification can match your payment. Proof of
                      transfer can be sent via WhatsApp.
                    </p>
                  </div>

                  <Accordion
                    type="single"
                    collapsible
                    className="border-t border-solid border-[#e5e5e5]"
                  >
                    {HOW_TO_PAY_VA.map((item) => (
                      <AccordionItem
                        key={item.id}
                        value={item.id}
                        className="border-b border-solid border-[#e5e5e5] last:border-b-0"
                      >
                        <AccordionTrigger className="px-0.5 py-[13px] hover:no-underline">
                          <span className="text-[13px] font-normal leading-5 text-[#111]">
                            {item.title}
                          </span>
                          <span className="text-[15px] font-bold tracking-[0.5px] text-[#111] group-data-[state=open]:hidden">
                            +
                          </span>
                          <span className="hidden text-[15px] font-bold tracking-[0.5px] text-[#111] group-data-[state=open]:inline">
                            −
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-3.5 pl-[18px] pr-0.5">
                          <ol className="space-y-0">
                            {item.steps.map((step, i) => (
                              <li
                                key={step}
                                className="flex gap-2 text-[12.5px] font-light leading-[21.875px] text-[#767676]"
                              >
                                <span className="w-4 shrink-0">{i + 1}.</span>
                                <span>
                                  {item.id === "mbanking" && i === 1 ? (
                                    <>
                                      Enter account number{" "}
                                      <span className="font-bold">
                                        8830 1122 7788
                                      </span>
                                      .
                                    </>
                                  ) : (
                                    step
                                  )}
                                </span>
                              </li>
                            ))}
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </>
              )}
            </div>

            <div className="flex flex-col gap-3.5 border-t border-solid border-[#e5e5e5] px-[26px] py-4 sm:flex-row sm:items-center">
              <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-1.5">
                <Button
                  type="button"
                  variant="auth"
                  size="auth"
                  className="w-auto min-w-0 px-6"
                  onClick={markPaid}
                >
                  I have paid
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  className="px-6 text-[14px] font-semibold tracking-normal"
                  asChild
                >
                  <Link href="/coaching/details" onClick={restoreDraft}>
                    Change payment method
                  </Link>
                </Button>
              </div>
              <Button
                type="button"
                variant="link"
                size="link"
                className="text-[11.5px] tracking-[0.92px] no-underline sm:ml-auto"
                onClick={() => {
                  clearPending(pending.ref);
                  router.push("/coaching");
                }}
              >
                Cancel order
              </Button>
            </div>
          </div>
        </div>

        <aside className="h-fit w-full shrink-0 border border-solid border-[#111] px-5 py-[18px] lg:w-[380px]">
          <h2
            className={cn(
              displaySkew,
              "origin-left w-fit text-[22px] font-medium uppercase leading-7 text-[#111]",
            )}
          >
            Your booking
          </h2>
          <dl className="mt-[22px]">
            <div className="flex justify-between border-b border-[#e5e5e5] py-3">
              <dt className="text-[12px] font-light text-[#767676]">Coach</dt>
              <dd className="text-[13.5px] font-bold">{pending.coachName}</dd>
            </div>
            <div className="flex justify-between border-b border-[#e5e5e5] py-3">
              <dt className="text-[12px] font-light text-[#767676]">
                Date & time
              </dt>
              <dd className="text-right text-[13.5px] font-bold">
                {pending.whenLabel}
              </dd>
            </div>
            <div className="flex justify-between border-b border-[#e5e5e5] py-3">
              <dt className="text-[12px] font-light text-[#767676]">Package</dt>
              <dd className="text-right text-[13.5px] font-bold">
                {pending.packageLabel}
              </dd>
            </div>
            <div className="flex justify-between py-3.5">
              <dt className="text-[12px] font-light text-[#767676]">Total</dt>
              <dd className="text-[22px] font-normal leading-[34px]">
                {formatRp(pending.amount)}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
