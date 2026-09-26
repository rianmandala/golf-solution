import type { Metadata } from "next";
import { FittingConfirmedView } from "@/features/fitting/confirmed-view";

export const metadata: Metadata = {
  title: "Fitting request sent",
};

export default function Page() {
  return <FittingConfirmedView />;
}
