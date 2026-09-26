import type { Metadata } from "next";
import { AwaitingPaymentView } from "@/features/coaching/awaiting-payment";

export const metadata: Metadata = {
  title: "Awaiting payment",
};

export default function Page() {
  return <AwaitingPaymentView />;
}
