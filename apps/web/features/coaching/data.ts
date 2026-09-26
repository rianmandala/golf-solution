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

export type DayKind = "available" | "closed" | "by_request" | "empty" | "past";

export type CalendarDay = {
  date: string; // YYYY-MM-DD
  day: number;
  kind: DayKind;
  slotsLeft: number | null;
  label: string | null;
};

/** Mock month matching Figma: August 2026 (Sat 1 … Mon 31). */
export function buildAugust2026Calendar(): CalendarDay[] {
  const days: CalendarDay[] = [];
  // Leading empties: Mon–Fri before Sat 1
  for (let i = 0; i < 5; i++) {
    days.push({ date: "", day: 0, kind: "empty", slotsLeft: null, label: null });
  }

  const closed = new Set([2, 9, 15, 16, 22, 23, 29, 30]);
  const byRequest = new Set([16]); // Figma shows Sun 16 as BY REQUEST; also closed styling — prefer by_request
  closed.delete(16);

  const leftByDay: Record<number, number> = {
    10: 6,
    11: 5,
    12: 4,
    13: 4,
    14: 6,
    17: 5,
    18: 4,
    19: 3,
    20: 4,
    21: 6,
    24: 5,
    25: 4,
    26: 3,
    27: 4,
    28: 5,
    31: 4,
  };

  for (let d = 1; d <= 31; d++) {
    const date = `2026-08-${String(d).padStart(2, "0")}`;
    if (byRequest.has(d)) {
      days.push({
        date,
        day: d,
        kind: "by_request",
        slotsLeft: 2,
        label: "By request",
      });
    } else if (closed.has(d) || d < 10) {
      // Early Aug greyed in Figma (1–8 past/closed feel)
      const isWeekendClosed = closed.has(d);
      days.push({
        date,
        day: d,
        kind: isWeekendClosed || d < 10 ? "closed" : "closed",
        slotsLeft: null,
        label: isWeekendClosed || d === 2 || d === 9 ? "Closed" : null,
      });
    } else {
      days.push({
        date,
        day: d,
        kind: "available",
        slotsLeft: leftByDay[d] ?? 4,
        label: `${leftByDay[d] ?? 4} left`,
      });
    }
  }

  return days;
}

export type DaySlots = {
  regular: { time: string; open: boolean }[];
  byRequest: { time: string; open: boolean }[];
};

export function slotsForDay(date: string): DaySlots {
  // Default mock: Fri 14 / 21 style — 18:00 taken on some days
  const take18 = date.endsWith("-14") || date.endsWith("-21");
  return {
    regular: REGULAR_SLOTS.map((time) => ({
      time,
      open: !(take18 && time === "18:00"),
    })),
    byRequest: BY_REQUEST_SLOTS.map((time) => ({ time, open: true })),
  };
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

export function formatBookingWhen(dateIso: string, time: string): string {
  const d = new Date(`${dateIso}T12:00:00`);
  const weekday = d.toLocaleDateString("en-GB", { weekday: "short" });
  const day = d.getDate();
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  return `${weekday} ${day} ${month}, ${time} - ${endTime(time)}`;
}

export function formatDayHeading(dateIso: string): string {
  const d = new Date(`${dateIso}T12:00:00`);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
