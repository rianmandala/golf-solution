/**
 * Typography + layout helpers matching Figma GS landing (Oswald).
 *
 * Breakpoint map (Tailwind defaults):
 * - < md (768): mobile Figma 375
 * - md–lg: tablet interpolate
 * - lg (1024)–xl: large / laptop — fluid layouts, scaled type (NOT 1440 px tracks)
 * - xl (1280)+ / near 1440: Figma desktop lock
 */

/** Shared section gutters — mobile `px-5 py-10`; desktop `px-10 py-[88px]` from xl */
export const sectionPad =
  "px-5 py-10 md:px-8 md:py-14 lg:px-10 lg:py-16 xl:py-[88px]" as const;

export const type = {
  /** Announcement bar */
  announcement: "text-[12px] font-normal leading-[17px] tracking-normal text-white",
  /** Nav MENU label — Oswald Bold 11.5 / tracking 1.38 / uppercase */
  navMenu: "text-[11.5px] font-bold uppercase leading-[11.5px] tracking-[1.38px] text-[#111]",
  /** Search placeholder — Oswald Light 13 */
  searchPlaceholder:
    "text-[13px] font-light leading-normal text-[#767676] placeholder:text-[#767676]",
  /** Primary CTA in header — Oswald Bold 12 / tracking 0.6 — Title Case, NOT uppercase */
  headerCta: "text-[12px] font-bold leading-[18.6px] tracking-[0.6px]",
  /** Section eyebrow — Oswald Bold 11 / tracking 0.66 */
  eyebrow: "text-[11px] font-bold leading-[17.05px] tracking-[0.66px] text-[#111]",
  /**
   * Large display H2 — mobile 34 → tablet 44 → lg fluid → xl 56.107 (1440 lock)
   */
  displayH2:
    "text-[34.065px] font-normal leading-[34.746px] tracking-[0.4088px] text-[#111] md:text-[44px] md:leading-[1.02] lg:text-[clamp(2.75rem,4.2vw,3.5rem)] lg:leading-[1.02] xl:text-[56.107px] xl:leading-[57.229px] xl:tracking-[0.6733px]",
  /**
   * Hero H1 — mobile 32 → md 64 → lg fluid vw → xl 115.42 (1440 lock).
   * Do NOT apply 115px at lg (1024) — it overflows and clips the hero.
   */
  heroH1:
    "text-[32.312px] font-light leading-[32.958px] tracking-[0.3877px] text-white md:text-[64px] md:leading-[1.02] lg:text-[clamp(3.75rem,8.2vw,7.214rem)] lg:leading-[1.02] xl:text-[115.42px] xl:leading-[117.728px] xl:tracking-[1.385px]",
  /** Hero H1 emphasis — Oswald Medium */
  heroH1Em: "font-medium",
  /** Hero subtitle — mobile 15 / desktop 16 */
  heroSub:
    "text-[15px] font-normal leading-[23.25px] tracking-[0.3px] text-white/90 md:text-[16px] md:leading-[24.8px] md:tracking-[0.32px]",
  /** Body muted — Oswald Regular 14.5 / leading 22.475 */
  bodyMuted: "text-[14.5px] font-normal leading-[22.475px] text-[#767676]",
  /** Button / link CTA — Oswald Bold 12 / tracking 0.6 */
  cta: "text-[12px] font-bold leading-[18.6px] tracking-[0.6px]",
  /** Small uppercase label in cards — Oswald Bold 10.5 / tracking 0.735 */
  labelUpper:
    "text-[10.5px] font-bold uppercase leading-[16.275px] tracking-[0.735px] text-[#111]",
  /** Spec row label — Oswald Bold 11 / tracking 0.55 / #767676 */
  specLabel: "text-[11px] font-bold leading-[17.05px] tracking-[0.55px] text-[#767676]",
  /** Spec row value — Oswald Regular 13 */
  specValue: "text-[13px] font-normal leading-[20.15px] text-[#111]",
} as const;

/** Wrapper class for Figma italic/skew display lines */
export const displaySkew = "-skew-x-[5deg]";
