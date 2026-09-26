import type { PaymentMethodId } from "./booking-draft";

export type VaBankId =
  | "bca"
  | "mandiri"
  | "bni"
  | "bri"
  | "permata"
  | "cimb";

export const VA_BANKS: {
  id: VaBankId;
  method: PaymentMethodId;
  label: string;
  logo: string;
}[] = [
  {
    id: "bca",
    method: "va_bca",
    label: "Bank BCA",
    logo: "/coaching/bank-bca.svg",
  },
  {
    id: "mandiri",
    method: "va_mandiri",
    label: "Bank Mandiri",
    logo: "/coaching/bank-mandiri.svg",
  },
  {
    id: "bni",
    method: "va_bni",
    label: "Bank BNI",
    logo: "/coaching/bank-bni.svg",
  },
  {
    id: "bri",
    method: "va_bri",
    label: "Bank BRI",
    logo: "/coaching/bank-bri.svg",
  },
  {
    id: "permata",
    method: "va_permata",
    label: "Bank Permata",
    logo: "/coaching/bank-permata.svg",
  },
  {
    id: "cimb",
    method: "va_cimb",
    label: "Bank CIMB Niaga",
    logo: "/coaching/bank-cimb.svg",
  },
];

export function isVaPayment(method?: PaymentMethodId | null): boolean {
  return Boolean(method?.startsWith("va_"));
}

export function vaBankLabel(method?: PaymentMethodId | null): string {
  if (!method || method === "qris") return "BCA";
  const bank = VA_BANKS.find((b) => b.method === method);
  return bank?.label.replace(/^Bank /, "") ?? "BCA";
}
