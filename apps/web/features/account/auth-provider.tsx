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
import { useRouter } from "next/navigation";
import type { Customer, CustomerPackage } from "@gs/contracts";
import { track, AnalyticsEvent } from "@/lib/analytics/posthog";

const STORAGE_KEY = "gs.account.session";

/** Demo personas for client walkthroughs (BE not ready). */
export type DemoPersona = "with_sessions" | "no_sessions";

export type AccountSession = Customer & {
  packages: CustomerPackage[];
  persona: DemoPersona;
};

export const DEMO_USERS = {
  with_sessions: {
    persona: "with_sessions" as const,
    email: "rian@golfsolutions.id",
    password: "sessions123",
    firstName: "Rian",
    lastName: "Putra",
    whatsapp: "0811111111",
  },
  no_sessions: {
    persona: "no_sessions" as const,
    email: "ghaist@golfsolutions.id",
    password: "no-sessions123",
    firstName: "Ghaist",
    lastName: "Hatta",
    whatsapp: "0817665524241",
  },
} as const;

function packagesForPersona(persona: DemoPersona): CustomerPackage[] {
  if (persona === "no_sessions") return [];
  return [
    {
      id: "pkg-wonjun",
      coachId: "c-wonjun",
      coachName: "Wonjun",
      creditsTotal: 10,
      creditsUsed: 1,
      creditsReserved: 0,
      validUntil: "2027-12-31T00:00:00.000Z",
    },
    {
      id: "pkg-shern",
      coachId: "c-shern",
      coachName: "Shern Wei",
      creditsTotal: 5,
      creditsUsed: 2,
      creditsReserved: 0,
      validUntil: "2027-12-31T00:00:00.000Z",
    },
  ];
}

/** Exact demo emails → persona; anything else defaults to with_sessions. */
export function resolveDemoPersona(email: string): DemoPersona {
  const e = email.trim().toLowerCase();
  if (e === DEMO_USERS.no_sessions.email) return "no_sessions";
  return "with_sessions";
}

export function buildMockCustomer(
  email: string,
  persona?: DemoPersona,
): AccountSession {
  const resolved = persona ?? resolveDemoPersona(email);
  const demo =
    resolved === "no_sessions" ? DEMO_USERS.no_sessions : DEMO_USERS.with_sessions;
  const packages = packagesForPersona(resolved);

  return {
    id: resolved === "no_sessions" ? "cust-ghaist" : "cust-rian",
    firstName: demo.firstName,
    lastName: demo.lastName,
    email: email.trim() || demo.email,
    whatsapp: demo.whatsapp,
    marketingOptIn: false,
    package: packages[0] ?? null,
    packages,
    persona: resolved,
  };
}

type AuthContextValue = {
  customer: AccountSession | null;
  isAuthenticated: boolean;
  ready: boolean;
  login: (email: string, source?: "login" | "signup" | "google") => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<AccountSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AccountSession;
        if (parsed?.id && parsed?.email) {
          const persona = parsed.persona ?? resolveDemoPersona(parsed.email);
          const fresh = buildMockCustomer(parsed.email, persona);
          // Prefer live demo identity (name/whatsapp) over stale localStorage.
          const next: AccountSession = {
            ...parsed,
            ...fresh,
            persona,
            packages:
              persona === "no_sessions"
                ? []
                : parsed.packages?.length
                  ? parsed.packages
                  : fresh.packages,
            package:
              persona === "no_sessions"
                ? null
                : (parsed.package ?? fresh.package),
          };
          setCustomer(next);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  const persist = useCallback((next: AccountSession) => {
    setCustomer(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const login = useCallback(
    (email: string, source: "login" | "signup" | "google" = "login") => {
      const next = buildMockCustomer(email);
      persist(next);
      if (source === "signup") {
        track(AnalyticsEvent.signupComplete, { method: "password" });
      } else {
        track(AnalyticsEvent.loginComplete, {
          method: source === "google" ? "google" : "password",
          persona: next.persona,
        });
      }
    },
    [persist],
  );

  const logout = useCallback(() => {
    setCustomer(null);
    window.localStorage.removeItem(STORAGE_KEY);
    router.push("/");
  }, [router]);

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
