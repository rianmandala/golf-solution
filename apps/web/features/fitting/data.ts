import { formatRp } from "@gs/format";
import {
  buildMonthCalendar as buildCoachMonthCalendar,
  defaultSelectableDate as defaultCoachSelectableDate,
  endTime,
  formatBookingWhen as formatCoachWhen,
  formatDayHeading,
  formatMonthTitle,
  isDaySelectable,
  jakartaToday,
  slotsForCoachDay,
  summarizeDay as summarizeCoachDay,
  type CalendarDay,
  type DaySlots,
  type SlotType,
  type YearMonth,
} from "@/features/coaching/data";

export type { CalendarDay, DaySlots, SlotType, YearMonth };
export {
  endTime,
  formatDayHeading,
  formatMonthTitle,
  isDaySelectable,
  jakartaToday,
};

export type FittingPackageId =
  | "full_bag"
  | "driver"
  | "fairway"
  | "hybrid"
  | "iron"
  | "wedge"
  | "putter"
  | "gapping";

export type FittingPackage = {
  id: FittingPackageId;
  title: string;
  /** Strikethrough “from” price in IDR (display only — charged is 0). */
  fromPrice: number;
  durationMinutes: number;
};

/** Figma: all fittings currently free (Rp 0) with struck-through list price. */
export const FITTING_PACKAGES: FittingPackage[] = [
  {
    id: "full_bag",
    title: "FULL BAG FITTING",
    fromPrice: 888_888,
    durationMinutes: 120,
  },
  {
    id: "driver",
    title: "DRIVING FITTING",
    fromPrice: 500_000,
    durationMinutes: 60,
  },
  {
    id: "fairway",
    title: "FAIRWAY WOOD FITTING",
    fromPrice: 500_000,
    durationMinutes: 60,
  },
  {
    id: "hybrid",
    title: "HYBIRD FITTING",
    fromPrice: 500_000,
    durationMinutes: 60,
  },
  {
    id: "iron",
    title: "IRON FITTING",
    fromPrice: 500_000,
    durationMinutes: 60,
  },
  {
    id: "wedge",
    title: "WEDGE FITTING",
    fromPrice: 500_000,
    durationMinutes: 60,
  },
  {
    id: "putter",
    title: "PUTTER FITTING",
    fromPrice: 500_000,
    durationMinutes: 60,
  },
  {
    id: "gapping",
    title: "CLUB GAPPING / LOFT & LIE",
    fromPrice: 350_000,
    durationMinutes: 45,
  },
];

export const FITTER = {
  id: "aaron" as const,
  name: "Aaron",
  title: "Master fitter",
  image: "/landing/aaron.png",
};

export function getFittingPackage(
  id: FittingPackageId | string | null | undefined,
): FittingPackage | undefined {
  return FITTING_PACKAGES.find((p) => p.id === id);
}

export function packageLabel(pkg: FittingPackage): string {
  return `${pkg.title} (${pkg.durationMinutes} min)`;
}

export function formatFromPrice(amount: number): string {
  return `From ${formatRp(amount)}`;
}

/**
 * Mock availability until BE — reuse coaching schedule seed (Wonjun offsets)
 * so the calendar stays interactive in demos.
 */
export function slotsForFittingDay(
  date: string,
  today = jakartaToday(),
): DaySlots {
  return slotsForCoachDay("wonjun", date, today);
}

export function summarizeFittingDay(date: string, today = jakartaToday()) {
  return summarizeCoachDay("wonjun", date, today);
}

export function buildFittingMonthCalendar(
  ym: YearMonth,
  today = jakartaToday(),
): CalendarDay[] {
  return buildCoachMonthCalendar("wonjun", ym, today);
}

export function defaultFittingSelectableDate(today = jakartaToday()): string {
  return defaultCoachSelectableDate("wonjun", today);
}

export function formatFittingWhen(
  dateIso: string,
  time: string,
  durationMinutes: number,
): string {
  return formatCoachWhen(dateIso, time, durationMinutes);
}

export {
  canNavigateMonth,
  parseIsoDate,
  shiftYearMonth,
} from "@/features/coaching/data";
