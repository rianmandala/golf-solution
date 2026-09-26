"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Customer, CustomerPackage } from "@gs/contracts";
import { cn } from "@/lib/utils";
import { displaySkew } from "@/features/landing/typography";
import { ix } from "@/features/landing/interactions";
import { useAuth, type AccountSession } from "./auth-provider";

type AccountTab =
  | "dashboard"
  | "orders"
  | "fitting"
  | "coaching"
  | "manage";

const tabs: { id: AccountTab; label: string }[] = [
  { id: "dashboard", label: "Account dashboard" },
  { id: "orders", label: "Orders" },
  { id: "fitting", label: "My fitting" },
  { id: "coaching", label: "My coaching" },
  { id: "manage", label: "Manage account" },
];

function packagesFor(customer: AccountSession): CustomerPackage[] {
  if (customer.packages?.length) return customer.packages;
  if (customer.package) return [customer.package];
  return [];
}

function creditsLeft(pkg: CustomerPackage) {
  return Math.max(0, pkg.creditsTotal - pkg.creditsUsed - pkg.creditsReserved);
}

function welcomeName(customer: Customer) {
  return (customer.firstName || "Player").toUpperCase();
}

function displayName(customer: Customer) {
  return [customer.firstName, customer.lastName].filter(Boolean).join(" ");
}

export function AccountDashboard() {
  const router = useRouter();
  const { customer, isAuthenticated, ready, logout } = useAuth();
  const [tab, setTab] = useState<AccountTab>("dashboard");

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) router.replace("/");
  }, [ready, isAuthenticated, router]);

  if (!ready || !isAuthenticated || !customer) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-[1440px] items-center justify-center px-5 py-10 lg:px-10">
        <p className="text-[14px] font-normal text-[#767676]">Loading account…</p>
      </div>
    );
  }

  const pkgs = packagesFor(customer);

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-8 md:px-8 md:py-10 lg:px-10 lg:py-10">
      <Link
        href="/"
        className={cn(
          "inline-flex h-[18.6px] items-center gap-2 text-[12px] font-semibold leading-3 text-[#111]",
          ix.textUnderline,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/landing/icon-back.svg"
          alt=""
          width={14}
          height={14}
          className="size-[14px]"
        />
        Back to site
      </Link>

      <div className="mt-[22px] border-b border-solid border-[#111] pb-[22px]">
        <div className={cn(displaySkew, "origin-left w-fit")}>
          <h1 className="text-[28px] font-medium uppercase leading-10 text-[#111] md:text-[34px]">
            Account dashboard
          </h1>
        </div>
      </div>

      <div className="mt-[22px] flex flex-col gap-8 lg:flex-row lg:gap-[22px]">
        <nav
          aria-label="Account sections"
          className="flex shrink-0 gap-1 overflow-x-auto lg:w-[200px] lg:flex-col lg:gap-0.5 lg:overflow-visible"
        >
          {tabs.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "shrink-0 border-b-[3px] border-solid px-[18px] py-3.5 text-left text-[12px] font-semibold uppercase leading-3 lg:w-full lg:border-b-0 lg:border-r-[3px] lg:text-right",
                  ix.cursor,
                  active
                    ? "border-[#111] bg-white text-[#111]"
                    : "border-transparent text-[#111] transition-colors duration-200 hover:bg-[#fafafa]",
                )}
              >
                {item.label}
              </button>
            );
          })}
          <div className="hidden pt-[18px] lg:block">
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/");
              }}
              className={cn(
                "flex w-full items-center justify-end border-r-[3px] border-solid border-transparent px-[18px] py-3.5 text-[11.5px] font-bold uppercase leading-[17.825px] tracking-[1.15px] text-[#767676]",
                ix.cursor,
                "transition-colors duration-200 hover:text-[#111]",
              )}
            >
              Log out
            </button>
          </div>
        </nav>

        <div className="min-w-0 flex-1">
          {tab === "dashboard" ? (
            <DashboardPanel customer={customer} packages={pkgs} />
          ) : (
            <PlaceholderPanel tab={tab} />
          )}
        </div>
      </div>

      <div className="mt-8 lg:hidden">
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className={cn(
            "text-[11.5px] font-bold uppercase leading-[17.825px] tracking-[1.15px] text-[#767676]",
            ix.cursor,
            "transition-colors duration-200 hover:text-[#111]",
          )}
        >
          Log out
        </button>
      </div>
    </section>
  );
}

function DashboardPanel({
  customer,
  packages,
}: {
  customer: Customer;
  packages: CustomerPackage[];
}) {
  return (
    <div className="flex flex-col gap-[22px]">
      <div>
        <p className="text-[12px] font-medium uppercase leading-[14px] text-[#767676]">
          Welcome back
        </p>
        <p className="pt-1.5 text-[40px] font-normal uppercase leading-[1.02] text-[#111] md:text-[56px] md:leading-[57px]">
          {welcomeName(customer)}
        </p>
      </div>

      <div className="flex flex-col gap-3 border border-solid border-[#e5e5e5] bg-white p-5">
        <h2 className="text-[13px] font-normal uppercase leading-5 text-[#767676]">
          My info
        </h2>
        <div>
          <InfoRow label="Name" value={displayName(customer)} />
          <InfoRow label="Email" value={customer.email} />
          <div className="flex flex-col gap-3 py-[13px] sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <p className="shrink-0 text-[13px] font-normal leading-5 text-[#767676]">
              Coaching sessions
            </p>
            <div className="flex flex-wrap items-start justify-start gap-1.5 sm:justify-end">
              {packages.length > 0 ? (
                packages.map((pkg) => (
                  <span
                    key={pkg.id}
                    className="inline-flex items-center border border-solid border-[#e5e5e5] bg-white px-2.5 py-1 text-[11px] font-bold leading-[14px] text-[#111]"
                  >
                    {creditsLeft(pkg)} of {pkg.creditsTotal} · {pkg.coachName}
                  </span>
                ))
              ) : (
                <span className="text-[15px] font-normal leading-[23px] text-[#111]">
                  None yet
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-6">
        <PromoCard
          imageSrc="/account/fitting-promo.png"
          imageAlt="Tour-level fitting irons"
          title="In-person fitting"
          body="Experience the difference of a tour-level fitting — personalized, precise, and powered by golf’s most advanced equipment."
          ctaLabel="Book fitting"
          href="/fitting"
        />
        <PromoCard
          imageSrc="/account/coaching-promo.png"
          imageAlt="Coaching session on the bay"
          title="The range, on your schedule"
          body="Never lose momentum between sessions. Coaching sessions book in one tap — pause or top up anytime."
          ctaLabel="Start coaching"
          href="/coaching"
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-solid border-[#e5e5e5] py-[13px]">
      <p className="text-[13px] font-normal leading-5 text-[#767676]">{label}</p>
      <p className="text-right text-[15px] font-normal leading-[23px] text-[#111]">
        {value}
      </p>
    </div>
  );
}

function PromoCard({
  imageSrc,
  imageAlt,
  title,
  body,
  ctaLabel,
  href,
}: {
  imageSrc: string;
  imageAlt: string;
  title: string;
  body: string;
  ctaLabel: string;
  href: string;
}) {
  return (
    <article className="flex flex-col gap-3 border border-solid border-[#e5e5e5] bg-white p-5">
      <div className="relative mb-[6px] aspect-[492/307] w-full overflow-hidden bg-[#eee]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <h3 className="text-[22px] font-medium uppercase leading-7 text-[#111]">
        {title}
      </h3>
      <p className="text-[13px] font-normal leading-5 text-[#767676]">{body}</p>
      <div className="flex h-12 items-center">
        <Link
          href={href}
          className={cn(
            "inline-flex min-h-12 items-center justify-center border border-solid border-[#111] bg-[#111] px-6 text-[14px] font-semibold uppercase leading-[14px] text-white",
            ix.btnDark,
          )}
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}

function PlaceholderPanel({ tab }: { tab: AccountTab }) {
  const titles: Record<Exclude<AccountTab, "dashboard">, string> = {
    orders: "Orders",
    fitting: "My fitting",
    coaching: "My coaching",
    manage: "Manage account",
  };
  const title = titles[tab as Exclude<AccountTab, "dashboard">];

  return (
    <div className="border border-solid border-[#e5e5e5] bg-white p-5 md:p-8">
      <h2 className="text-[22px] font-medium uppercase leading-7 text-[#111]">
        {title}
      </h2>
      <p className="mt-3 max-w-md text-[13px] font-normal leading-5 text-[#767676]">
        This section will connect when the account API is ready. Use Account
        dashboard for your profile and quick booking shortcuts.
      </p>
    </div>
  );
}
