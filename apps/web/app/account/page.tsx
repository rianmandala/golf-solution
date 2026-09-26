import type { Metadata } from "next";
import { AccountDashboard } from "@/features/account/account-dashboard";

export const metadata: Metadata = {
  title: "Account",
};

export default function Page() {
  return <AccountDashboard />;
}
