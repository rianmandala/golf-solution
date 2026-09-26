"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { type } from "@/features/landing/typography";
import { ix } from "@/features/landing/interactions";
import { useAuth } from "@/features/account/auth-provider";
import { AccountDrawer } from "@/features/account/account-drawer";
import { MenuDrawer } from "./menu-drawer";

const footerLinks = {
  services: [
    { label: "Club Fitting", href: "/fitting" },
    { label: "Coaching", href: "/coaching" },
    { label: "Pro Shop", href: "/clubs" },
    { label: "Fitting Results", href: "/fitting" },
  ],
  company: [
    { label: "Ambassadors", href: "/#ambassadors" },
    { label: "Locations", href: "/#locations" },
    { label: "Instagram", href: "#" },
    { label: "WhatsApp", href: "#" },
  ],
};

export function AnnouncementBar() {
  return (
    <div className="flex h-9 w-full items-center justify-center bg-[#111] px-5 md:px-8 lg:px-10">
      <p className="text-center text-[12px] font-normal leading-[17px] text-white">
        Trade-in is back · bring your old set, we quote while you wait
      </p>
    </div>
  );
}

function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 py-2 transition-opacity duration-200 hover:opacity-65",
        ix.cursor,
      )}
      aria-label="Open menu"
      aria-haspopup="dialog"
    >
      <span className="relative h-[1.8px] w-6 bg-[#111] transition-colors duration-200 group-hover:bg-[#444] lg:w-[22px]">
        <span className="absolute left-0 top-[-7px] h-[1.8px] w-full bg-[#111] transition-colors duration-200 group-hover:bg-[#444]" />
        <span className="absolute left-0 top-[7px] h-[1.8px] w-full bg-[#111] transition-colors duration-200 group-hover:bg-[#444]" />
      </span>
      <span className={cn(type.navMenu, "hidden xl:inline")}>Menu</span>
    </button>
  );
}

function HeaderIconLink({
  href,
  label,
  src,
}: {
  href: string;
  label: string;
  src: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "flex size-11 items-center justify-center rounded-full lg:size-10",
        ix.iconRound,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={21} height={21} className="size-[21px]" />
    </Link>
  );
}

function HeaderIconButton({
  label,
  src,
  onClick,
}: {
  label: string;
  src: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-11 items-center justify-center rounded-full lg:size-10",
        ix.iconRound,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={21} height={21} className="size-[21px]" />
    </button>
  );
}

export function SiteHeader({
  onOpenMenu,
  onOpenAccount,
  onBookFitting,
}: {
  onOpenMenu: () => void;
  onOpenAccount: () => void;
  onBookFitting: () => void;
}) {
  return (
    <header className="border-b border-solid border-[#e5e5e5] bg-white">
      {/* Compact header until xl */}
      <div className="relative mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-8 lg:px-10 xl:hidden">
        <MenuButton onClick={onOpenMenu} />
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 hover:opacity-80"
        >
          <Image
            src="/landing/logo.png"
            alt="Golf Solutions"
            width={79}
            height={42}
            className="h-[42px] w-[79px]"
            priority
          />
        </Link>
        <div className="flex shrink-0 items-center">
          <HeaderIconButton
            label="Account"
            src="/landing/icon-account.svg"
            onClick={onOpenAccount}
          />
          <HeaderIconLink href="/cart" label="Bag" src="/landing/icon-bag.svg" />
        </div>
      </div>

      {/* Desktop header — xl+ */}
      <div className="mx-auto hidden h-16 max-w-[1440px] items-center gap-10 px-10 xl:flex">
        <MenuButton onClick={onOpenMenu} />
        <Link
          href="/"
          className="shrink-0 transition-opacity duration-200 hover:opacity-80"
        >
          <Image
            src="/landing/logo.png"
            alt="Golf Solutions"
            width={79}
            height={42}
            className="h-[42px] w-[78.75px]"
            priority
          />
        </Link>
        <form
          className="flex h-10 min-w-0 flex-1 items-center gap-2 bg-[#f5f5f5] px-4 transition-colors duration-200 focus-within:bg-[#efefef]"
          role="search"
        >
          <label htmlFor="site-search" className="sr-only">
            Search
          </label>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/landing/icon-search.svg" alt="" width={16} height={16} className="size-4" />
          <input
            id="site-search"
            type="search"
            placeholder="Search"
            className={cn(
              type.searchPlaceholder,
              "h-full w-full bg-transparent outline-none",
            )}
          />
        </form>
        <div className="flex shrink-0 items-center gap-3">
          <HeaderIconButton
            label="Account"
            src="/landing/icon-account.svg"
            onClick={onOpenAccount}
          />
          <HeaderIconLink href="/cart" label="Bag" src="/landing/icon-bag.svg" />
          <button
            type="button"
            onClick={onBookFitting}
            className={cn(
              type.headerCta,
              ix.btnDark,
              "inline-flex min-h-[42px] items-center justify-center rounded-[2px] border border-[#111] bg-[#111] px-[22px] text-white",
            )}
          >
            Book a Fitting
          </button>
        </div>
      </div>
    </header>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[11.5px] font-bold leading-[17.825px] tracking-[0.575px] text-white/55">
        {title}
      </h3>
      <div className="mt-4 space-y-0 text-[13.5px] font-normal leading-[20.925px] text-white/85">
        {children}
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer id="footer" className="border-t border-solid border-[#2a2a2a] bg-[#111] text-white">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-10">
        <div className="flex flex-col gap-8 border-b border-solid border-[#2a2a2a] py-10 md:flex-row md:items-center md:justify-between md:gap-10 lg:py-11">
          <div className="max-w-[376px]">
            <h2 className="text-[22px] font-normal leading-[34px] text-white md:text-[24px] md:leading-[37.2px]">
              Notes from the bay
            </h2>
            <p className="pt-1.5 text-[13px] font-normal leading-[20.15px] text-white/55">
              Fitting findings, new stock, and open coaching slots — once a month. No promos, just
              what changed and why it matters.
            </p>
          </div>
          <form className="flex min-h-[46px] w-full max-w-[320px] items-start border-b-2 border-solid border-white transition-colors duration-200 focus-within:border-white/70 md:min-w-[280px] lg:min-w-[320px]">
            <label htmlFor="footer-email" className="sr-only">
              Email
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="you@email.com"
              className="h-[45.7px] flex-1 bg-transparent px-0.5 py-3 text-[14px] font-normal text-white outline-none placeholder:text-white/40"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className={cn(
                "flex h-[45.7px] items-center px-2 transition-opacity duration-200 hover:opacity-70",
                ix.cursor,
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/landing/icon-subscribe.svg" alt="" width={20} height={20} className="size-5" />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-12">
          <FooterColumn title="Golf Solutions PIK">
            <p>
              Pantai Indah Kapuk
              <br />
              North Jakarta 14470
            </p>
            <p className="pt-1 text-[12px] leading-[18.6px] text-white/45">Mon–Sun · 09:00–21:00</p>
            <a href="tel:+622112345678" className={cn("block pt-2.5", ix.textMuted)}>
              +62 21 1234 5678
            </a>
          </FooterColumn>

          <FooterColumn title="Sedayu Indo Golf">
            <p>
              Pantai Indah Kapuk 2
              <br />
              Greater Jakarta
            </p>
            <p className="pt-1 text-[12px] leading-[18.6px] text-white/45">Mon–Sun · 06:00–22:00</p>
            <a href="tel:+622187654321" className={cn("block pt-2.5", ix.textMuted)}>
              +62 21 8765 4321
            </a>
          </FooterColumn>

          <FooterColumn title="Services">
            {footerLinks.services.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn("block pt-2.5 first:pt-4", ix.textMuted)}
              >
                {item.label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Company">
            {footerLinks.company.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn("block pt-2.5 first:pt-4", ix.textMuted)}
              >
                {item.label}
              </Link>
            ))}
          </FooterColumn>
        </div>

        <div className="flex flex-col items-start gap-4 border-t border-solid border-[#2a2a2a] pb-[30px] pt-[22px] sm:flex-row sm:items-center sm:justify-between">
          <Image
            src="/landing/logo-footer.png"
            alt="Golf Solutions"
            width={68}
            height={36}
            className="h-9 w-[67.5px]"
          />
          <p className="text-[11.5px] font-normal leading-[17.825px] text-white/40">
            © 2026 Golf Solutions Jakarta · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, ready } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [afterLoginHref, setAfterLoginHref] = useState<string | null>(null);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openAccount = useCallback(() => {
    setMenuOpen(false);
    setAfterLoginHref(null);
    setAccountOpen(true);
  }, []);
  const closeAccount = useCallback(() => {
    setAccountOpen(false);
    setAfterLoginHref(null);
  }, []);

  const bookFitting = useCallback(() => {
    if (!ready) return;
    if (isAuthenticated) {
      router.push("/fitting/book");
      return;
    }
    setMenuOpen(false);
    setAfterLoginHref("/fitting/book");
    setAccountOpen(true);
  }, [isAuthenticated, ready, router]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111]">
      <AnnouncementBar />
      <SiteHeader
        onOpenMenu={openMenu}
        onOpenAccount={openAccount}
        onBookFitting={bookFitting}
      />
      <MenuDrawer open={menuOpen} onClose={closeMenu} onOpenAccount={openAccount} />
      <AccountDrawer
        open={accountOpen}
        onClose={closeAccount}
        afterLoginHref={afterLoginHref}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
