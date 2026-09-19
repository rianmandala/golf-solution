import Image from "next/image";
import Link from "next/link";
import { FadeInSection } from "./primitives";
import { sectionPad } from "./typography";
import { ix } from "./interactions";
import { cn } from "@/lib/utils";

const products = [
  {
    title: "Iron set 5–PW — forgiving cavity",
    price: "Rp 24.000.000",
    image: "/landing/product-1.png",
  },
  {
    title: "Driver — max forgiveness head",
    price: "Rp 11.900.000",
    image: "/landing/product-2.png",
  },
  {
    title: "Stand bag",
    price: "Rp 4.200.000",
    image: "/landing/product-3.png",
  },
];

export function FeaturedProducts() {
  return (
    <FadeInSection className={cn("bg-white", sectionPad)}>
      <div className="mx-auto max-w-[1360px]">
        <h2 className="text-center text-[22px] font-normal leading-[1.05] tracking-[0.6px] text-[#111] sm:text-[32px] md:text-[40px] lg:text-[clamp(2.25rem,4vw,3.3125rem)] xl:text-[53px] xl:leading-[53px] xl:tracking-[0.8px]">
          MYGOLFSPY BEST DRIVER OF THE YEAR
        </h2>

        <div className="mt-9 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.title}
              href="/clubs"
              className={cn("group block min-w-0 text-center", ix.cursor)}
            >
              <div className="relative h-[280px] overflow-hidden bg-[#f5f5f5] transition-colors duration-300 group-hover:bg-[#efefef] sm:h-[360px] lg:h-[min(380px,28vw)] xl:h-[440px]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className={cn("object-cover", ix.imgZoom)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 440px"
                />
              </div>
              <h3 className="pt-4 text-[18px] font-normal leading-[24px] text-[#111] transition-opacity duration-200 group-hover:opacity-70 sm:text-[20px] sm:leading-[25px]">
                {product.title}
              </h3>
              <p className="pt-[3px] text-[13.5px] font-normal leading-[21px] text-[#767676]">
                {product.price}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
