"use client";

import { useEffect, useState, type ReactNode } from "react";

export function MswProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(
    () => process.env.NEXT_PUBLIC_API_MOCKING !== "true",
  );

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING !== "true") {
      setReady(true);
      return;
    }
    let cancelled = false;
    async function start() {
      const { worker } = await import("@/mocks/browser");
      await worker.start({ onUnhandledRequest: "bypass" });
      if (!cancelled) setReady(true);
    }
    void start();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;
  return children;
}
