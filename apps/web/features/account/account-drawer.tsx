"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ix } from "@/features/landing/interactions";
import { useAuth } from "./auth-provider";
import { LoginForm, SignupForm } from "./login-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AccountDrawerProps = {
  open: boolean;
  onClose: () => void;
  /** After a successful login/signup, navigate here then close (e.g. fitting book). */
  afterLoginHref?: string | null;
};

type AuthTab = "login" | "signup";

export function AccountDrawer({
  open,
  onClose,
  afterLoginHref = null,
}: AccountDrawerProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<AuthTab>("login");
  const { customer, isAuthenticated, login, logout } = useAuth();

  function completeAuth(email: string, source: "login" | "signup" | "google") {
    login(email, source);
    if (afterLoginHref) {
      onClose();
      router.push(afterLoginHref);
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) setTab("login");
  }, [open]);

  if (!mounted) return null;

  const displayName = customer
    ? `${customer.firstName} ${customer.lastName}`.toUpperCase()
    : "";
  const pkg = customer?.package ?? null;
  const creditsLeft = pkg
    ? Math.max(0, pkg.creditsTotal - pkg.creditsUsed - pkg.creditsReserved)
    : 0;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="account-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[110] flex justify-end bg-black/40"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className={cn(
              "flex h-full max-h-[100dvh] w-full flex-col bg-[#f6f6f6] shadow-[0_0_40px_rgba(0,0,0,0.12)]",
              "md:max-w-[480px]",
            )}
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? undefined : { x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={titleId} className="sr-only">
              {isAuthenticated ? "Your account" : "Log in or sign up"}
            </h2>

            <div className="flex shrink-0 items-center justify-between px-8 pt-[26px]">
              <Link
                href="/"
                onClick={onClose}
                className="transition-opacity duration-200 hover:opacity-80"
              >
                <Image
                  src="/landing/logo.png"
                  alt="Golf Solutions"
                  width={148}
                  height={79}
                  className="h-[79px] w-[148px] object-contain object-left"
                  priority
                />
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className={cn(
                  "flex size-10 items-center justify-center rounded-full",
                  ix.iconRound,
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/landing/icon-close-account.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="size-[18px]"
                />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-8 pb-11 [-webkit-overflow-scrolling:touch]">
              {isAuthenticated && customer ? (
                <div className="flex min-h-full flex-col py-5">
                  <p className="text-[13px] font-normal leading-5 text-[#3c3c3c]">
                    Welcome back,
                  </p>
                  <h3 className="pb-6 pt-1 text-[34px] font-medium leading-10 text-[#111]">
                    {displayName}
                  </h3>

                  <Link
                    href="/account"
                    onClick={onClose}
                    className={cn(
                      "inline-flex min-h-12 w-fit items-center justify-center gap-2 border border-solid border-[#111] bg-[#111] px-6 text-[14px] font-semibold leading-[14px] text-white",
                      ix.btnDark,
                    )}
                  >
                    Account dashboard
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/landing/icon-chevron-right.svg"
                      alt=""
                      width={17}
                      height={17}
                      className="size-[17px] brightness-0 invert"
                    />
                  </Link>

                  {pkg ? (
                    <div className="flex flex-1 flex-col pt-[26px]">
                      <div className="flex w-full flex-col gap-3 rounded-[10px] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.09)]">
                        <div className="flex items-start justify-between">
                          <p className="text-[13px] font-normal leading-5 text-[#111]">
                            Coaching package
                          </p>
                          <p className="text-[15px] font-normal uppercase leading-[23px] text-[#111]">
                            Sessions
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[34px] font-medium uppercase leading-10 text-[#111]">
                            {pkg.coachName}
                          </p>
                          <p className="text-[22px] font-medium leading-7 text-[#111]">
                            <span className="text-[#5f7031]">{creditsLeft}</span>
                            {` of ${pkg.creditsTotal} left`}
                          </p>
                        </div>
                        <div className="h-px w-full bg-[#e5e5e5]" />
                        <p className="text-center text-[12px] font-normal leading-[17px] text-[#111]">
                          Book coaching in one tap — no details needed while you
                          have sessions.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1" />
                  )}

                  <div className="pt-7">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className={cn(
                        "inline-flex h-[27px] border-b-2 border-solid border-[#111] font-[Helvetica_Neue,Helvetica,Arial,sans-serif] text-[15px] font-bold uppercase leading-[23.25px] tracking-[0.9px] text-[#111]",
                        ix.textUnderline,
                      )}
                    >
                      Log out
                    </button>
                    <p className="pt-4 font-[HelveticaNeue,Helvetica,Arial,sans-serif] text-[12px] font-light leading-[18.6px] text-[#646464]">
                      Your account is saved on this browser.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="pt-6">
                    <Tabs
                      value={tab}
                      onValueChange={(value) =>
                        setTab(value as "login" | "signup")
                      }
                      className="gap-0"
                    >
                      <TabsList
                        variant="line"
                        className="h-auto w-full justify-start rounded-none border-b border-solid border-[#e5e5e5] bg-transparent p-0"
                      >
                        <TabsTrigger
                          value="login"
                          className={cn(
                            "h-10 min-h-10 flex-none rounded-none border-0 bg-transparent px-[18px] text-[15px] font-normal uppercase leading-[23px] text-[#767676] shadow-none",
                            "after:hidden",
                            "data-[state=active]:-mb-px data-[state=active]:border-b-[3px] data-[state=active]:border-solid data-[state=active]:border-[#111] data-[state=active]:bg-transparent data-[state=active]:text-[#111] data-[state=active]:shadow-none",
                            "hover:text-[#111]",
                            ix.cursor,
                          )}
                        >
                          Log in
                        </TabsTrigger>
                        <TabsTrigger
                          value="signup"
                          className={cn(
                            "h-10 min-h-10 flex-none rounded-none border-0 bg-transparent px-[18px] text-[15px] font-normal uppercase leading-[23px] text-[#767676] shadow-none",
                            "after:hidden",
                            "data-[state=active]:-mb-px data-[state=active]:border-b-[3px] data-[state=active]:border-solid data-[state=active]:border-[#111] data-[state=active]:bg-transparent data-[state=active]:text-[#111] data-[state=active]:shadow-none",
                            "hover:text-[#111]",
                            ix.cursor,
                          )}
                        >
                          Sign up
                        </TabsTrigger>
                      </TabsList>

                      <div className="flex flex-col gap-[22px] pt-5">
                        <TabsContent value="login" className="mt-0">
                          <LoginForm
                            onSuccess={(email) => completeAuth(email, "login")}
                          />
                        </TabsContent>
                        <TabsContent value="signup" className="mt-0">
                          <SignupForm
                            onSuccess={(email) => completeAuth(email, "signup")}
                          />
                        </TabsContent>

                        <p className="text-center text-[14px] font-light leading-[21.7px] text-[#767676]">
                          Or continue with
                        </p>

                        <Button type="button" variant="soft" size="soft">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/landing/icon-google.svg"
                            alt=""
                            width={30}
                            height={30}
                            className="size-[30px]"
                          />
                          Login with Google
                        </Button>
                      </div>
                    </Tabs>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
