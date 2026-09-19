import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
  if (typeof window === "undefined" || initialized) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: true,
    persistence: "localStorage+cookie",
  });
  initialized = true;
}

export function track(
  event: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
) {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", event, properties);
    }
    return;
  }
  posthog.capture(event, properties);
}

/** PRD §16 minimum event names — use these constants at call sites. */
export const AnalyticsEvent = {
  pageView: "page_view",
  heroCtaClick: "hero_cta_click",
  addToCart: "add_to_cart",
  checkoutStart: "checkout_start",
  orderPlaced: "order_placed",
  bookingSubmit: "booking_submit",
  bookingConfirmed: "booking_confirmed",
  bookingRequested: "booking_requested",
  whatsappCtaClick: "whatsapp_cta_click",
  signupComplete: "signup_complete",
  loginComplete: "login_complete",
} as const;
