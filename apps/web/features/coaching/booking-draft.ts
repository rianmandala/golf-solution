import type { CoachId, PackageOptionId, SlotType } from "./data";

const DRAFT_KEY = "gs.coaching.draft";
const BOOKING_KEY = "gs.coaching.booking";
const PENDING_KEY = "gs.coaching.pending";

export type PaymentMethodId =
  | "qris"
  | "va_bca"
  | "va_mandiri"
  | "va_bni"
  | "va_bri"
  | "va_permata"
  | "va_cimb";

export type CoachingDraft = {
  coachId: CoachId;
  date: string;
  time: string;
  slotType: SlotType;
  packageId: PackageOptionId;
  notes: string;
  fullName?: string;
  whatsapp?: string;
  paymentMethod?: PaymentMethodId;
};

export type ConfirmedBooking = CoachingDraft & {
  ref: string;
  coachName: string;
  whenLabel: string;
  packageLabel: string;
  paidLabel: string;
  whatsapp: string;
  creditsLeftAfter: number | null;
  /** Regular confirm vs by-request awaiting coach approval */
  status: "CONFIRMED" | "REQUESTED";
  paymentKind?: "credit" | "cash";
};

export type PendingPayment = Omit<ConfirmedBooking, "status"> & {
  status: "AWAITING_PAYMENT";
  amount: number;
  paymentExpiresAt: string;
  vaNumber: string;
  vaBank: string;
  vaAccountName: string;
};

export function saveDraft(draft: CoachingDraft) {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function loadDraft(): CoachingDraft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CoachingDraft;
  } catch {
    return null;
  }
}

export function clearDraft() {
  sessionStorage.removeItem(DRAFT_KEY);
}

export function saveConfirmed(booking: ConfirmedBooking) {
  sessionStorage.setItem(`${BOOKING_KEY}.${booking.ref}`, JSON.stringify(booking));
}

export function loadConfirmed(ref: string): ConfirmedBooking | null {
  try {
    const raw = sessionStorage.getItem(`${BOOKING_KEY}.${ref}`);
    if (!raw) return null;
    return JSON.parse(raw) as ConfirmedBooking;
  } catch {
    return null;
  }
}

export function savePending(pending: PendingPayment) {
  sessionStorage.setItem(`${PENDING_KEY}.${pending.ref}`, JSON.stringify(pending));
}

export function loadPending(ref: string): PendingPayment | null {
  try {
    const raw = sessionStorage.getItem(`${PENDING_KEY}.${ref}`);
    if (!raw) return null;
    return JSON.parse(raw) as PendingPayment;
  } catch {
    return null;
  }
}

export function clearPending(ref: string) {
  sessionStorage.removeItem(`${PENDING_KEY}.${ref}`);
}

export function makeBookingRef(): string {
  return `GS-C-${Date.now().toString(36).toUpperCase()}`;
}

/** Demo soft lock window — 60 minutes from creation (mock until BE). */
export function paymentExpiresIn(minutes = 60): string {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}
