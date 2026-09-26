import type { FittingPackageId } from "./data";
import type { SlotType } from "@/features/coaching/data";

const DRAFT_KEY = "gs.fitting.draft";
const BOOKING_KEY = "gs.fitting.booking";

export type FittingDraft = {
  packageId: FittingPackageId;
  date: string;
  time: string;
  slotType: SlotType;
  notes: string;
  fullName?: string;
  whatsapp?: string;
};

export type ConfirmedFitting = FittingDraft & {
  ref: string;
  fitterName: string;
  whenLabel: string;
  packageLabel: string;
  /** Display line e.g. struck-through from + Rp 0 */
  paidLabel: string;
  fromPriceLabel: string;
  chargedLabel: string;
  whatsapp: string;
  status: "CONFIRMED" | "REQUESTED";
};

export function saveDraft(draft: FittingDraft) {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function loadDraft(): FittingDraft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FittingDraft;
  } catch {
    return null;
  }
}

export function clearDraft() {
  sessionStorage.removeItem(DRAFT_KEY);
}

export function saveConfirmed(booking: ConfirmedFitting) {
  sessionStorage.setItem(
    `${BOOKING_KEY}.${booking.ref}`,
    JSON.stringify(booking),
  );
}

export function loadConfirmed(ref: string): ConfirmedFitting | null {
  try {
    const raw = sessionStorage.getItem(`${BOOKING_KEY}.${ref}`);
    if (!raw) return null;
    return JSON.parse(raw) as ConfirmedFitting;
  } catch {
    return null;
  }
}

export function makeFittingRef(): string {
  return `GS-F-${Date.now().toString(36).toUpperCase()}`;
}
