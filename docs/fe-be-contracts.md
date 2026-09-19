# FE ↔ BE API alignment checklist

Consumer FE (`apps/web`) currently uses **MSW mocks** (`NEXT_PUBLIC_API_MOCKING=true`).
Shared Zod shapes live in `@gs/contracts`. Align OpenAPI / handlers to these.

## Auth
- [ ] `POST /api/auth/register`
- [ ] `POST /api/auth/login`
- [ ] `POST /api/auth/social/google`
- [ ] `POST /api/auth/forgot-password`
- [ ] Session: cookie vs bearer — confirm
- [ ] Guest identity by WhatsApp; opt-in link on register/login

## Content / locations
- [ ] `GET /api/content/landing`
- [ ] `GET /api/content/announcement`
- [ ] `POST /api/newsletter`
- [ ] `POST /api/inquiries`
- [ ] Locations single source (hours/phone) for shell + checkout

## Catalog / cart
- [ ] `GET /api/catalog/products` + facets (URL-shareable filters)
- [ ] `GET /api/catalog/products/{slug}` (variants, stock: onHand/held/available)
- [ ] Cart CRUD + save-for-later + promo
- [ ] Guest cart 30 days; logged-in sync across devices

## Orders / payments / shipping
- [ ] `POST /api/orders` with **Idempotency-Key**
- [ ] Payment instructions DTO vendor-agnostic (`expiresAt`, VA / QRIS payload)
- [ ] `POST .../i-have-paid`, cancel, timeline projection
- [ ] Auto-cancel job is **server-side** (not browser)
- [ ] `GET /api/checkout/shipping-options` → Biteship

## Coaching / fitting
- [ ] Coaches, availability, slots grouped `regular` / `by_request`
- [ ] Hold → book; credit `creditsReserved`
- [ ] FittingSpec versioned read for account + PDP preselect

## Out of FE scope
WhatsApp template sends, payment webhooks, stock hold jobs, staff console.
