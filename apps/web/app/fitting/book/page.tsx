import type { Metadata } from "next";
import { FitterTimeStep } from "@/features/fitting/fitter-time-step";

export const metadata: Metadata = {
  title: "Book a fitting",
};

export default function Page() {
  return <FitterTimeStep />;
}
