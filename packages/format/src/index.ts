/** Indonesian Rupiah: Rp 24.000.000 (dot thousands, no decimals). */
export function formatRp(amount: number): string {
  const rounded = Math.round(amount);
  const withDots = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const sign = rounded < 0 ? "-" : "";
  return `${sign}Rp\u00A0${withDots}`;
}

/** Display dates like "25 Aug" or "Friday 14 August". */
export function formatDateShort(date: Date, locale = "en-GB"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function formatDateLong(date: Date, locale = "en-GB"): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

/** 24-hour time: 09:00 */
export function formatTime24(date: Date, locale = "en-GB"): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Normalize Indonesian mobile input toward E.164 (+62...).
 * Display stays as the user typed; storage uses this.
 */
export function toE164Id(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) return `+${digits}`;
  if (digits.startsWith("0")) return `+62${digits.slice(1)}`;
  return `+${digits}`;
}
