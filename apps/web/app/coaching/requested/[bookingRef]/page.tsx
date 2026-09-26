import type { Metadata } from "next";
import { ConfirmedView } from "@/features/coaching/confirmed-view";

export const metadata: Metadata = {
  title: "Request sent",
};

export default function Page() {
  return <ConfirmedView />;
}
