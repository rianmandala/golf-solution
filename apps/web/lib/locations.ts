export const locations = [
  {
    id: "pik",
    name: "Golf Solutions PIK",
    address: "PIK, Jakarta",
    hours: "Mon–Sun · 09:00–21:00",
    phoneDisplay: "08xx xxxx xxxx",
    acceptsPickup: true,
  },
  {
    id: "sedayu",
    name: "Sedayu Indo Golf",
    address: "Sedayu Indo Golf, Jakarta",
    hours: "Mon–Sun · 06:00–22:00",
    phoneDisplay: "08xx xxxx xxxx",
    acceptsPickup: false,
  },
] as const;

/** Single source for shell/footer/checkout copy — replace with API when CMS ready. */
export function getLocations() {
  return locations;
}
