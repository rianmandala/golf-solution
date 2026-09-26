import type { Metadata } from "next";
import { ConfirmedView } from "@/features/coaching/confirmed-view";

export const metadata: Metadata = {
  title: "Booking confirmed",
};

export default function Page() {
  return <ConfirmedView />;
}
