"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Customer } from "@gs/contracts";
import { track, AnalyticsEvent } from "@/lib/analytics/posthog";

const STORAGE_KEY = "gs.account.session";

/** Mock customer shown after a successful login (BE not ready). */
export function buildMockCustomer(email: string): Customer {
  return {
    id: "cust-sandika",
    firstName: "Sandika",
    lastName: "Galih",
    email: email.trim() || "sandika.galih@gmail.com",
    marketingOptIn: false,
    package: {
      id: "pkg-wonjun",
      coachId: "c-wonjun",
      coachName: "Wonjun",
      creditsTotal: 10,
      creditsUsed: 1,
      creditsReserved: 0,
      validUntil: "2027-12-31T00:00:00.000Z",
    },
  };
}

type AuthContextValue = {
  customer: Customer | null;
  isAuthenticated: boolean;
  ready: boolean;
  login: (email: string, source?: "login" | "signup" | "google") => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Customer;
        if (parsed?.id && parsed?.email) setCustomer(parsed);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  const login = useCallback((email: string, source: "login" | "signup" | "google" = "login") => {
    const next = buildMockCustomer(email);
    setCustomer(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (source === "signup") {
      track(AnalyticsEvent.signupComplete, { method: "password" });
    } else {
      track(AnalyticsEvent.loginComplete, {
        method: source === "google" ? "google" : "password",
      });
    }
  }, []);

  const logout = useCallback(() => {
    setCustomer(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      customer,
      isAuthenticated: customer !== null,
      ready,
      login,
      logout,
    }),
    [customer, ready, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
