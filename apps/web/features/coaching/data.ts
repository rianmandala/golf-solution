import { formatRp } from "@gs/format";

export type CoachId = "wonjun" | "shern-wei";

export type SlotType = "regular" | "by_request";

export type PackageOptionId = "credit" | "single" | "pack10" | "pack20";

export type Coach = {
  id: CoachId;
  slug: CoachId;
  name: string;
  specialism: string;
  fromPrice: number;
  image: string;
  durationMinutes: number;
};

export const coaches: Coach[] = [
  {
    id: "wonjun",
    slug: "wonjun",
    name: "Wonjun",
    specialism:
      "Full-swing rebuilds · Tempo, sequence, and strike — tracked week over week.",
    fromPrice: 1_750_000,
    image: "/coaching/coach-wonjun.png",
    durationMinutes: 60,
  },
  {
    id: "shern-wei",
    slug: "shern-wei",
    name: "Shern Wei",
    specialism:
      "Short game & strategy · Fundamentals down to single digits, on and around the green.",
    fromPrice: 2_250_000,
    image: "/coaching/coach-shern.png",
    durationMinutes: 60,
  },
];

export function getCoach(id: string | null | undefined): Coach | undefined {
  return coaches.find((c) => c.id === id || c.slug === id);
}

/** Regular hours 10:00–18:00; by-request early / late (PRD §10.1). */
export const REGULAR_SLOTS = [
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
] as const;

export const BY_REQUEST_SLOTS = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "19:00",
  "20:00",
  "21:00",
] as const;

/** Inclusive: today + next 29 days = 30 bookable days. */
export const BOOKING_HORIZON_DAYS = 90;

export type DayKind =
  | "available"
  | "closed"
  | "full"
  | "empty"
  | "past"
  | "beyond";

export type CalendarDay = {
  date: string; // YYYY-MM-DD
  day: number;
  kind: DayKind;
  slotsLeft: number | null;
  label: string | null;
};

export type DaySlots = {
  regular: { time: string; open: boolean }[];
  byRequest: { time: string; open: boolean }[];
};

export type YearMonth = { year: number; month: number }; // month 1–12

type CoachAvailabilityMock = {
  /** Extra closed dates as offsets from today (weekends stay open unless listed). */
  closedOffsets: number[];
  /** Offsets where every regular slot is taken (by-request may still open). */
  fullRegularOffsets: number[];
  /** Offsets where a specific regular time is taken. */
  takenRegular: { offset: number; times: string[] }[];
  /** Offsets where a specific by-request time is taken. */
  takenByRequest: { offset: number; times: string[] }[];
};

/**
 * Hardcoded mock until BE availability API exists.
 * Relative to Jakarta "today" so demos always have a usable window.
 */
const COACH_AVAILABILITY: Record<CoachId, CoachAvailabilityMock> = {
  wonjun: {
    closedOffsets: [3, 10, 17, 24],
    fullRegularOffsets: [5],
    takenRegular: [
      { offset: 0, times: ["18:00"] },
      { offset: 1, times: ["10:00", "11:00"] },
      { offset: 2, times: ["13:00"] },
      { offset: 4, times: ["17:00", "18:00"] },
      { offset: 7, times: ["14:00", "15:00"] },
      { offset: 8, times: ["18:00"] },
      { offset: 14, times: ["10:00", "16:00", "17:00"] },
    ],
    takenByRequest: [
      { offset: 0, times: ["06:00"] },
      { offset: 2, times: ["21:00"] },
      { offset: 5, times: ["06:00", "07:00"] },
    ],
  },
  "shern-wei": {
    closedOffsets: [2, 9, 16, 23],
    fullRegularOffsets: [6],
    takenRegular: [
      { offset: 0, times: ["10:00", "18:00"] },
      { offset: 1, times: ["13:00", "14:00"] },
      { offset: 4, times: ["11:00"] },
      { offset: 7, times: ["17:00", "18:00"] },
      { offset: 11, times: ["15:00", "16:00"] },
      { offset: 18, times: ["10:00", "11:00", "13:00"] },
    ],
    takenByRequest: [
      { offset: 1, times: ["09:00"] },
      { offset: 6, times: ["19:00", "20:00"] },
      { offset: 12, times: ["06:00"] },
    ],
  },
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

/** Calendar date in Asia/Jakarta as YYYY-MM-DD. */
export function jakartaToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Current HH:mm in Asia/Jakarta (24h, zero-padded for string compare). */
export function jakartaNowHm(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${pad2(Number(hour))}:${pad2(Number(minute))}`;
}

export function parseIsoDate(iso: string): YearMonth & { day: number } {
  const [y, m, d] = iso.split("-").map(Number);
  return { year: y, month: m, day: d };
}

export function addDaysIso(iso: string, days: number): string {
  const { year, month, day } = parseIsoDate(iso);
  const utc = Date.UTC(year, month - 1, day + days, 5, 0, 0);
  const d = new Date(utc);
  return toIsoDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

export function bookingHorizonEnd(today = jakartaToday()): string {
  return addDaysIso(today, BOOKING_HORIZON_DAYS - 1);
}

export function compareIso(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Monday = 0 … Sunday = 6 for YYYY-MM-DD (Jakarta calendar day). */
export function weekdayMon0(iso: string): number {
  const { year, month, day } = parseIsoDate(iso);
  const jsDay = new Date(Date.UTC(year, month - 1, day, 5, 0, 0)).getUTCDay();
  return (jsDay + 6) % 7;
}

export function shiftYearMonth(
  ym: YearMonth,
  deltaMonths: number,
): YearMonth {
  const idx = ym.year * 12 + (ym.month - 1) + deltaMonths;
  return { year: Math.floor(idx / 12), month: (idx % 12) + 1 };
}

export function formatMonthTitle(ym: YearMonth): string {
  const d = new Date(Date.UTC(ym.year, ym.month - 1, 1, 5, 0, 0));
  return d.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function offsetFromToday(date: string, today: string): number | null {
  const t0 = parseIsoDate(today);
  const t1 = parseIsoDate(date);
  const a = Date.UTC(t0.year, t0.month - 1, t0.day);
  const b = Date.UTC(t1.year, t1.month - 1, t1.day);
  return Math.round((b - a) / 86_400_000);
}

function isClosedDay(coachId: CoachId, date: string, today: string): boolean {
  const offset = offsetFromToday(date, today);
  if (offset === null) return false;
  return COACH_AVAILABILITY[coachId].closedOffsets.includes(offset);
}

function takenSet(
  entries: { offset: number; times: string[] }[],
  offset: number,
): Set<string> {
  const set = new Set<string>();
  for (const row of entries) {
    if (row.offset === offset) {
      for (const t of row.times) set.add(t);
    }
  }
  return set;
}

/**
 * Hardcoded day slots for a coach + date.
 * Past clock times on "today" are closed. Outside horizon → all closed.
 */
export function slotsForCoachDay(
  coachId: CoachId,
  date: string,
  today = jakartaToday(),
  nowHm = jakartaNowHm(),
): DaySlots {
  const horizonEnd = bookingHorizonEnd(today);
  const outOfWindow =
    compareIso(date, today) < 0 || compareIso(date, horizonEnd) > 0;
  const closed = outOfWindow || isClosedDay(coachId, date, today);
  const offset = offsetFromToday(date, today) ?? -1;
  const mock = COACH_AVAILABILITY[coachId];
  const fullRegular = mock.fullRegularOffsets.includes(offset);
  const takenRegular = takenSet(mock.takenRegular, offset);
  const takenByRequest = takenSet(mock.takenByRequest, offset);
  const isToday = date === today;

  return {
    regular: REGULAR_SLOTS.map((time) => ({
      time,
      open:
        !closed &&
        !fullRegular &&
        !takenRegular.has(time) &&
        !(isToday && time <= nowHm),
    })),
    byRequest: BY_REQUEST_SLOTS.map((time) => ({
      time,
      open:
        !closed &&
        !takenByRequest.has(time) &&
        !(isToday && time <= nowHm),
    })),
  };
}

/** @deprecated Use slotsForCoachDay — kept for any stray imports. */
export function slotsForDay(date: string): DaySlots {
  return slotsForCoachDay("wonjun", date);
}

export function summarizeDay(
  coachId: CoachId,
  date: string,
  today = jakartaToday(),
  nowHm = jakartaNowHm(),
): Pick<CalendarDay, "kind" | "slotsLeft" | "label"> {
  const horizonEnd = bookingHorizonEnd(today);
  if (compareIso(date, today) < 0) {
    return { kind: "past", slotsLeft: null, label: null };
  }
  if (compareIso(date, horizonEnd) > 0) {
    return { kind: "beyond", slotsLeft: null, label: null };
  }
  if (isClosedDay(coachId, date, today)) {
    return { kind: "closed", slotsLeft: null, label: "Closed" };
  }

  const slots = slotsForCoachDay(coachId, date, today, nowHm);
  const regularOpen = slots.regular.filter((s) => s.open).length;
  const requestOpen = slots.byRequest.filter((s) => s.open).length;

  if (regularOpen > 0) {
    return {
      kind: "available",
      slotsLeft: regularOpen,
      label: `${regularOpen} left`,
    };
  }
  if (requestOpen > 0) {
    // By-request only — no cell label (lives in side panel).
    return { kind: "available", slotsLeft: 0, label: null };
  }
  return { kind: "full", slotsLeft: 0, label: "Full" };
}

export function isDaySelectable(kind: DayKind): boolean {
  return kind === "available";
}

/** Mon-start month grid for one coach. */
export function buildMonthCalendar(
  coachId: CoachId,
  ym: YearMonth,
  today = jakartaToday(),
  nowHm = jakartaNowHm(),
): CalendarDay[] {
  const days: CalendarDay[] = [];
  const firstIso = toIsoDate(ym.year, ym.month, 1);
  const leading = weekdayMon0(firstIso);
  for (let i = 0; i < leading; i++) {
    days.push({ date: "", day: 0, kind: "empty", slotsLeft: null, label: null });
  }

  const dim = daysInMonth(ym.year, ym.month);
  for (let d = 1; d <= dim; d++) {
    const date = toIsoDate(ym.year, ym.month, d);
    const summary = summarizeDay(coachId, date, today, nowHm);
    days.push({
      date,
      day: d,
      kind: summary.kind,
      slotsLeft: summary.slotsLeft,
      label: summary.label,
    });
  }

  return days;
}

/** First selectable day in the 30-day window (today preferred). */
export function defaultSelectableDate(
  coachId: CoachId,
  today = jakartaToday(),
  nowHm = jakartaNowHm(),
): string {
  const end = bookingHorizonEnd(today);
  let cursor = today;
  while (compareIso(cursor, end) <= 0) {
    const { kind } = summarizeDay(coachId, cursor, today, nowHm);
    if (isDaySelectable(kind)) return cursor;
    cursor = addDaysIso(cursor, 1);
  }
  return today;
}

export function canNavigateMonth(
  ym: YearMonth,
  direction: -1 | 1,
  today = jakartaToday(),
): boolean {
  const horizonEnd = bookingHorizonEnd(today);
  const next = shiftYearMonth(ym, direction);
  if (direction < 0) {
    const todayYm = parseIsoDate(today);
    return (
      next.year > todayYm.year ||
      (next.year === todayYm.year && next.month >= todayYm.month)
    );
  }
  const endYm = parseIsoDate(horizonEnd);
  return (
    next.year < endYm.year ||
    (next.year === endYm.year && next.month <= endYm.month)
  );
}

export function packageOptions(coach: Coach, creditLeft: number | null) {
  const options: {
    id: PackageOptionId;
    title: string;
    subtitle?: string;
    priceLabel: string;
    meta?: string;
    save?: string;
    creditOnly?: boolean;
  }[] = [];

  if (creditLeft !== null && creditLeft >= 1) {
    options.push({
      id: "credit",
      title: "From your package",
      subtitle: coach.name.toUpperCase(),
      priceLabel: `${creditLeft} sessions left`,
      meta: "Uses 1 · nothing more to pay",
      creditOnly: true,
    });
  }

  options.push(
    {
      id: "single",
      title: "1 session (60 min)",
      priceLabel: formatRp(coach.fromPrice),
    },
    {
      id: "pack10",
      title: "10-session package",
      priceLabel: formatRp(16_500_000),
      meta: `${formatRp(1_650_000)} per session`,
      save: "SAVE 6%",
    },
    {
      id: "pack20",
      title: "20-session package",
      priceLabel: formatRp(30_000_000),
      meta: `${formatRp(1_500_000)} per session`,
      save: "SAVE 14%",
    },
  );

  return options;
}

export function endTime(start: string, durationMinutes = 60): string {
  const [h, m] = start.split(":").map(Number);
  const total = h * 60 + m + durationMinutes;
  const eh = Math.floor(total / 60) % 24;
  const em = total % 60;
  return `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
}

export function formatBookingWhen(
  dateIso: string,
  time: string,
  durationMinutes = 60,
): string {
  const d = new Date(`${dateIso}T12:00:00`);
  const weekday = d.toLocaleDateString("en-GB", { weekday: "short" });
  const day = d.getDate();
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  return `${weekday} ${day} ${month}, ${time} - ${endTime(time, durationMinutes)}`;
}

export function formatDayHeading(dateIso: string): string {
  const d = new Date(`${dateIso}T12:00:00`);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
