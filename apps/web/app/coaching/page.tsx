import type { Metadata } from "next";
import { CoachTimeStep } from "@/features/coaching/coach-time-step";

export const metadata: Metadata = {
  title: "Book a session",
};

export default function Page() {
  return <CoachTimeStep />;
}
