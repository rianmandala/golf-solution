import { http, HttpResponse } from "msw";
import type {
  Announcement,
  Cart,
  Coach,
  Customer,
  Location,
  Product,
} from "@gs/contracts";

const locations: Location[] = [
  {
    id: "pik",
    name: "Golf Solutions PIK",
    address: "PIK, Jakarta",
    hours: "Mon–Sun · 09:00–21:00",
    phone: "+6221PIK0000",
    acceptsPickup: true,
  },
  {
    id: "sedayu",
    name: "Sedayu Indo Golf",
    address: "Sedayu Indo Golf, Jakarta",
    hours: "Mon–Sun · 06:00–22:00",
    phone: "+6221SED0000",
    acceptsPickup: false,
  },
];

const announcement: Announcement = {
  id: "ann-1",
  message: "Trade-in is back · bring your old set, we quote while you wait",
};

const products: Product[] = [
  {
    id: "p1",
    slug: "qi35-driver",
    name: "Qi35 Driver",
    categoryId: "drivers",
    brandId: "taylormade",
    basePrice: 11_900_000,
    rating: 4.9,
    reviewCount: 144,
    images: [],
    variants: [
      {
        id: "v1",
        sku: "QI35-RH-S",
        axes: { hand: "Right", shaftFlex: "Stiff" },
        price: 11_900_000,
        onHand: 4,
        held: 1,
        available: 3,
        imageUrls: [],
      },
    ],
    status: "live",
  },
];

const cart: Cart = {
  id: "cart-guest",
  lines: [],
  savedForLater: [],
  promoCode: null,
  subtotal: 0,
};

const coaches: Coach[] = [
  {
    id: "c-wonjun",
    slug: "wonjun",
    name: "Wonjun",
    role: "coach",
    specialism: "Full-swing rebuilds · Tempo, sequence, and strike",
    rating: 4.9,
    reviewCount: 86,
    fromPrice: 1_750_000,
  },
  {
    id: "c-shern",
    slug: "shern-wei",
    name: "Shern Wei",
    role: "coach",
    specialism: "Ball flight and short game",
    rating: 4.9,
    reviewCount: 64,
    fromPrice: 2_250_000,
  },
];

const me: Customer = {
  id: "cust-1",
  firstName: "Guest",
  lastName: "Player",
  email: "guest@example.com",
  marketingOptIn: false,
  package: null,
};

export const handlers = [
  http.get("/api/content/announcement", () => HttpResponse.json(announcement)),
  http.get("/api/locations", () => HttpResponse.json(locations)),
  http.get("/api/catalog/products", () =>
    HttpResponse.json({ items: products, total: products.length }),
  ),
  http.get("/api/catalog/products/:slug", ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(product);
  }),
  http.get("/api/cart", () => HttpResponse.json(cart)),
  http.get("/api/coaches", () => HttpResponse.json(coaches)),
  http.get("/api/me", () => HttpResponse.json(me)),
];
