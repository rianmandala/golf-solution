import type { Metadata } from "next";
import { FittingDetailsStep } from "@/features/fitting/details-step";

export const metadata: Metadata = {
  title: "Fitting details",
};

export default function Page() {
  return <FittingDetailsStep />;
}
