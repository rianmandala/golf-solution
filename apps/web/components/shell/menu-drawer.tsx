"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { displaySkew } from "@/features/landing/typography";
import { ix } from "@/features/landing/interactions";

type MenuDrawerProps = {
  open: boolean;
  onClose: () => void;
};

type MenuView = "root" | "clubs" | "fitting";

const primaryNav = [
  { id: "clubs" as const, label: "Clubs", kind: "branch" as const },
  { id: "fitting" as const, label: "Fitting", kind: "branch" as const },
  { id: "coaching", label: "Coaching", href: "/coaching", kind: "link" as const },
  { id: "bags", label: "The Bags", href: "/#ambassadors", kind: "link" as const },
  { id: "about", label: "About", href: "/#about", kind: "link" as const },
  { id: "locations", label: "Locations", href: "/#locations", kind: "link" as const },
];

const serviceNav = [
  { label: "Built to your specs", href: "/fitting" },
  /** Phase 1: no trade-in route — route to inquiry */
  { label: "Trade-in", href: "/#inquiry" },
  { label: "Book a fitting", href: "/fitting" },
] as const;

const clubProducts = [
  "Qi35 Driver",
  "Quantum Max Driver",
  "AI-200 Irons",
  "Ping i240 Irons",
  "Blueprint S Irons",
  "Itobori Straight Flush",
  "L.A.B. DF3 Putter",
  "G440 Fairway",
] as const;

const fittingQuickLinks = [
  { label: "Book a fitting", href: "/fitting" },
  { label: "See the numbers", href: "/fitting" },
  { label: "Online selector", href: "/fitting" },
] as const;

const navItemClass =
  "flex h-[53.25px] w-full items-center justify-between pl-6 pr-[26px] py-[15px] text-left text-[15px] font-bold uppercase leading-[23.25px] tracking-[1.8px] text-[#111] transition-colors duration-200";

export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  /** Drill-down: root list → nested Clubs / Fitting panel (matches chevron-right) */
  const [view, setView] = useState<MenuView>("root");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (view !== "root") setView("root");
        else onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, view]);

  useEffect(() => {
    if (open) setView("root");
  }, [open]);

  if (!mounted) return null;

  const viewTitle =
    view === "clubs" ? "Clubs" : view === "fitting" ? "Fitting" : "Main menu";

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="menu-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[100] flex justify-start bg-black/40"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          {/*
            Panel: fixed height + flex column.
            Scroll lives ONLY on the body region (min-h-0 + overflow-y-auto).
            Putting overflow on the outer motion panel fights Framer transforms on mobile.
          */}
          <motion.div
            className={cn(
              "flex h-full max-h-[100dvh] w-full flex-col bg-white shadow-[0_0_40px_rgba(0,0,0,0.12)]",
              "md:max-w-[480px] lg:max-w-[520px] xl:max-w-[560px]",
            )}
            initial={reduceMotion ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? undefined : { x: "-100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={titleId} className="sr-only">
              {viewTitle}
            </h2>

            {/* Sticky chrome — never scrolls away */}
            <div className="shrink-0">
              <div className="flex h-9 w-full items-center justify-center bg-[#111] px-4">
                <p className="text-center text-[10.5px] font-bold leading-[16.275px] tracking-[0.525px] text-white md:text-[12px] md:font-normal md:leading-[17px] md:tracking-normal">
                  Trade-in is back · bring your old set, we quote while you wait
                </p>
              </div>

              <div className="relative flex h-16 items-center border-b border-solid border-[rgba(17,17,17,0.1)] bg-white">
                {view === "root" ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className={cn(
                      "relative z-10 flex h-16 items-center gap-3 bg-[#f2f2f2] px-[18px] transition-colors duration-200 hover:bg-[#ebebeb]",
                      ix.cursor,
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/landing/icon-close.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="size-5"
                    />
                    <span className="text-[12px] font-bold uppercase leading-[18.6px] tracking-[1.68px] text-[#111]">
                      Close
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setView("root")}
                    className={cn(
                      "relative z-10 flex h-16 items-center gap-3 bg-[#f2f2f2] px-[18px] transition-colors duration-200 hover:bg-[#ebebeb]",
                      ix.cursor,
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/landing/icon-chevron-left.svg"
                      alt=""
                      width={17}
                      height={17}
                      className="size-[17px]"
                    />
                    <span className="text-[12px] font-bold uppercase leading-[18.6px] tracking-[1.68px] text-[#111]">
                      Back
                    </span>
                  </button>
                )}

                <Link
                  href="/"
                  onClick={onClose}
                  className="absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 hover:opacity-80"
                >
                  <Image
                    src="/landing/logo.png"
                    alt="Golf Solutions"
                    width={79}
                    height={42}
                    className="h-[42px] w-[79px]"
                  />
                </Link>

                <div className="relative z-10 ml-auto flex items-center pr-[10px] md:pr-[18px]">
                  <Link
                    href="/account"
                    aria-label="Account"
                    onClick={onClose}
                    className={cn(
                      "flex size-11 items-center justify-center rounded-full",
                      ix.iconRound,
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/landing/icon-account.svg"
                      alt=""
                      width={22}
                      height={22}
                      className="size-[22px]"
                    />
                  </Link>
                  <Link
                    href="/cart"
                    aria-label="Bag"
                    onClick={onClose}
                    className={cn(
                      "flex size-11 items-center justify-center rounded-full",
                      ix.iconRound,
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/landing/icon-bag.svg"
                      alt=""
                      width={21}
                      height={21}
                      className="size-[21px]"
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Scroll region — min-h-0 is required for flex children to scroll */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
              <AnimatePresence mode="wait" initial={false}>
                {view === "root" ? (
                  <motion.div
                    key="root"
                    initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    <nav aria-label="Primary" className="border-b border-solid border-[rgba(17,17,17,0.08)] pb-[18px] pt-2.5">
                      {primaryNav.map((item) => {
                        if (item.kind === "branch") {
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setView(item.id)}
                              className={cn(
                                navItemClass,
                                ix.cursor,
                                "bg-white hover:bg-[#f6f6f6]",
                              )}
                            >
                              {item.label}
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="/landing/icon-chevron-right.svg"
                                alt=""
                                width={16}
                                height={16}
                                className="size-4"
                              />
                            </button>
                          );
                        }

                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={onClose}
                            className={cn(navItemClass, ix.cursor, "hover:bg-[#fafafa]")}
                          >
                            {item.label}
                          </Link>
                        );
                      })}

                      <div className="pb-2 pl-6 pr-[38px] pt-[26px]">
                        <p className="text-[11px] font-bold uppercase leading-[17.05px] tracking-[1.76px] text-[rgba(17,17,17,0.45)]">
                          Services
                        </p>
                      </div>

                      {serviceNav.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={onClose}
                          className={cn(navItemClass, ix.cursor, "hover:bg-[#fafafa]")}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </motion.div>
                ) : null}

                {view === "clubs" ? (
                  <motion.div
                    key="clubs"
                    initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, x: 16 }}
                    transition={{ duration: 0.22 }}
                    className="bg-[#f6f6f6]"
                  >
                    <div className="border-b border-solid border-[rgba(17,17,17,0.08)] bg-[#f6f6f6] px-6 py-[15px]">
                      <p className="text-[15px] font-bold uppercase leading-[23.25px] tracking-[1.8px] text-[#111]">
                        Clubs
                      </p>
                    </div>

                    <div className="px-4 pb-[50px] pt-5 md:px-6">
                      <Link
                        href="/clubs"
                        onClick={onClose}
                        className="group relative block h-[210px] w-full overflow-hidden bg-[#ddd]"
                      >
                        <Image
                          src="/landing/menu-featured-p770.png"
                          alt="TaylorMade P770 Irons"
                          fill
                          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                          sizes="(max-width: 560px) 100vw, 520px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.35)] to-transparent to-[45%]" />
                        <div
                          className={cn(
                            displaySkew,
                            "absolute bottom-[22px] left-[26px] origin-left",
                          )}
                        >
                          <p className="whitespace-nowrap text-[24.046px] font-normal leading-[24.527px] tracking-[0.2885px] text-white">
                            P·770 Irons
                          </p>
                        </div>
                        <span className="absolute bottom-[28px] right-[26px] rounded-full bg-white px-[26px] py-[13px] text-[12.5px] font-bold uppercase leading-[19.375px] tracking-[1.5px] text-[#111] transition-colors duration-200 group-hover:bg-[#111] group-hover:text-white">
                          Explore
                        </span>
                      </Link>

                      <ul className="pt-[26px]">
                        {clubProducts.map((product) => (
                          <li key={product}>
                            <Link
                              href="/clubs"
                              onClick={onClose}
                              className={cn(
                                "block py-[9px] text-[14.5px] font-medium leading-[22.475px] text-[#111] transition-opacity duration-200 hover:opacity-65",
                                ix.cursor,
                              )}
                            >
                              {product}
                            </Link>
                          </li>
                        ))}
                      </ul>

                      <Link
                        href="/clubs"
                        onClick={onClose}
                        className={cn(
                          "mt-4 inline-flex border-b-2 border-solid border-[#111] pb-[3px] text-[12px] font-bold uppercase leading-[18.6px] tracking-[0.6px] text-[#111]",
                          ix.textUnderline,
                        )}
                      >
                        View all clubs
                      </Link>
                    </div>
                  </motion.div>
                ) : null}

                {view === "fitting" ? (
                  <motion.div
                    key="fitting"
                    initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, x: 16 }}
                    transition={{ duration: 0.22 }}
                    className="bg-[#f6f6f6]"
                  >
                    <div className="border-b border-solid border-[rgba(17,17,17,0.08)] bg-[#f6f6f6] px-6 py-[15px]">
                      <p className="text-[15px] font-bold uppercase leading-[23.25px] tracking-[1.8px] text-[#111]">
                        Fitting
                      </p>
                    </div>
                    <ul className="px-4 py-5 md:px-6">
                      {fittingQuickLinks.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className={cn(
                              "block py-[9px] text-[14.5px] font-medium leading-[22.475px] text-[#111] transition-opacity duration-200 hover:opacity-65",
                              ix.cursor,
                            )}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
