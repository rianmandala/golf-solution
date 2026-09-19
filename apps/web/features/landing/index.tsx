import { AboutMarquee } from "./about-marquee";
import { Ambassadors } from "./ambassadors";
import { Camps } from "./camps";
import { Coaches } from "./coaches";
import { FeaturedProducts } from "./featured-products";
import { FittingBay } from "./fitting-bay";
import { Hero } from "./hero";
import { Inquiry } from "./inquiry";
import { Locations } from "./locations";
import { Selectors } from "./selectors";
import { ThreeWays } from "./three-ways";

export function LandingPage() {
  return (
    <>
      <Hero />
      <Ambassadors />
      <ThreeWays />
      <FittingBay />
      <Selectors />
      <Coaches />
      <Camps />
      <FeaturedProducts />
      <AboutMarquee />
      <Locations />
      <Inquiry />
    </>
  );
}

export { Hero } from "./hero";
export { Ambassadors } from "./ambassadors";
export { ThreeWays } from "./three-ways";
export { FittingBay } from "./fitting-bay";
export { Selectors } from "./selectors";
export { Coaches } from "./coaches";
export { Camps } from "./camps";
export { FeaturedProducts } from "./featured-products";
export { AboutMarquee } from "./about-marquee";
export { Locations } from "./locations";
export { Inquiry } from "./inquiry";
