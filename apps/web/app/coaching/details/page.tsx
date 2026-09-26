import type { Metadata } from "next";
import { DetailsStep } from "@/features/coaching/details-step";

export const metadata: Metadata = {
  title: "Your details",
};

export default function Page() {
  return <DetailsStep />;
}
