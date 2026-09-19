import { z } from "zod";

export const OrderStatusSchema = z.enum([
  "AWAITING_PAYMENT",
  "PROCESSING",
  "READY_FOR_PICKUP",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED_AUTO",
  "CANCELLED_STAFF",
  "RETURNED",
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const BookingStatusSchema = z.enum([
  "PENDING_APPROVAL",
  "CONFIRMED",
  "DECLINED",
  "EXPIRED",
  "PAYMENT_FAILED",
  "CANCELLED",
  "COMPLETED",
]);
export type BookingStatus = z.infer<typeof BookingStatusSchema>;

export const SlotTypeSchema = z.enum(["regular", "by_request"]);
export const PaymentTypeSchema = z.enum(["credit", "cash"]);
export const FulfilmentMethodSchema = z.enum(["pickup", "delivery"]);
export const PaymentMethodSchema = z.enum(["bank_transfer", "qris"]);

/** Vendor-agnostic until BE confirms Xendit vs Midtrans. */
export const PaymentInstructionsSchema = z.object({
  orderNo: z.string(),
  method: PaymentMethodSchema,
  expiresAt: z.string().datetime(),
  amount: z.number().int().nonnegative(),
  bankTransfer: z
    .object({
      bankName: z.string(),
      accountName: z.string(),
      accountNumber: z.string(),
    })
    .optional(),
  qris: z
    .object({
      qrPayload: z.string(),
      imageUrl: z.string().url().optional(),
    })
    .optional(),
});
export type PaymentInstructions = z.infer<typeof PaymentInstructionsSchema>;

export const ProductVariantSchema = z.object({
  id: z.string(),
  sku: z.string(),
  axes: z.record(z.string()),
  price: z.number().int().nonnegative(),
  onHand: z.number().int(),
  held: z.number().int(),
  available: z.number().int(),
  imageUrls: z.array(z.string()).default([]),
});

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  categoryId: z.string(),
  brandId: z.string().optional(),
  basePrice: z.number().int().nonnegative(),
  description: z.string().optional(),
  rating: z.number().optional(),
  reviewCount: z.number().int().optional(),
  images: z.array(z.string()).default([]),
  variants: z.array(ProductVariantSchema).default([]),
  status: z.enum(["live", "draft"]).default("live"),
});
export type Product = z.infer<typeof ProductSchema>;

export const CartLineSchema = z.object({
  id: z.string(),
  variantId: z.string(),
  productName: z.string(),
  qty: z.number().int().positive(),
  unitPrice: z.number().int().nonnegative(),
  specSnapshot: z.record(z.string()).optional(),
});

export const CartSchema = z.object({
  id: z.string(),
  lines: z.array(CartLineSchema),
  savedForLater: z.array(CartLineSchema).default([]),
  promoCode: z.string().nullable().optional(),
  subtotal: z.number().int().nonnegative(),
});
export type Cart = z.infer<typeof CartSchema>;

export const OrderSchema = z.object({
  orderNo: z.string(),
  status: OrderStatusSchema,
  placedAt: z.string().datetime(),
  fulfilmentMethod: FulfilmentMethodSchema,
  paymentMethod: PaymentMethodSchema,
  paymentExpiresAt: z.string().datetime().nullable(),
  subtotal: z.number().int().nonnegative(),
  deliveryAmount: z.number().int().nonnegative(),
  discountAmount: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  trackingNumber: z.string().nullable().optional(),
  lines: z.array(CartLineSchema),
});
export type Order = z.infer<typeof OrderSchema>;

export const CoachSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  role: z.enum(["coach", "fitter"]),
  specialism: z.string().optional(),
  rating: z.number().optional(),
  reviewCount: z.number().int().optional(),
  fromPrice: z.number().int().nonnegative().optional(),
});
export type Coach = z.infer<typeof CoachSchema>;

export const SlotSchema = z.object({
  startsAt: z.string().datetime(),
  slotType: SlotTypeSchema,
  status: z.enum(["open", "held", "booked", "blocked"]),
});

export const BookingSchema = z.object({
  ref: z.string(),
  coachId: z.string(),
  sessionType: z.enum(["coaching", "fitting"]),
  startsAt: z.string().datetime(),
  durationMinutes: z.number().int().positive(),
  slotType: SlotTypeSchema,
  paymentType: PaymentTypeSchema,
  status: BookingStatusSchema,
  amount: z.number().int().nonnegative().optional(),
  creditsUsed: z.number().int().optional(),
});
export type Booking = z.infer<typeof BookingSchema>;

export const FittingSpecSchema = z.object({
  customerId: z.string(),
  version: z.number().int().positive(),
  hand: z.string().optional(),
  driverShaft: z.string().optional(),
  driverFlex: z.string().optional(),
  driverLoft: z.string().optional(),
  lie: z.string().optional(),
  length: z.string().optional(),
  ironShaft: z.string().optional(),
  ironFlex: z.string().optional(),
  grip: z.string().optional(),
  gripSize: z.string().optional(),
  createdAt: z.string().datetime(),
  sourceFittingId: z.string().optional(),
});
export type FittingSpec = z.infer<typeof FittingSpecSchema>;

export const CustomerPackageSchema = z.object({
  id: z.string(),
  coachId: z.string(),
  coachName: z.string(),
  creditsTotal: z.number().int().nonnegative(),
  creditsUsed: z.number().int().nonnegative(),
  creditsReserved: z.number().int().nonnegative(),
  validUntil: z.string().datetime(),
});

export const CustomerSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  marketingOptIn: z.boolean().default(false),
  package: CustomerPackageSchema.nullable().optional(),
});
export type Customer = z.infer<typeof CustomerSchema>;

export const AnnouncementSchema = z.object({
  id: z.string(),
  message: z.string(),
  href: z.string().optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
});
export type Announcement = z.infer<typeof AnnouncementSchema>;

export const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  hours: z.string(),
  phone: z.string(),
  acceptsPickup: z.boolean().default(false),
});
export type Location = z.infer<typeof LocationSchema>;
