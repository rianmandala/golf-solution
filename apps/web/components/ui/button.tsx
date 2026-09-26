import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";
import { ix } from "@/features/landing/interactions";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap outline-none disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Figma primary — black fill, white type */
        default: cn(
          "rounded-[2px] border border-solid border-[#111] bg-[#111] text-[12px] font-bold uppercase tracking-[0.6px] text-white",
          ix.btnDark,
        ),
        /** Figma secondary — white fill, black border */
        outline: cn(
          "rounded-[2px] border border-solid border-[#111] bg-white text-[12px] font-bold uppercase tracking-[0.6px] text-[#111]",
          ix.btnGhostLight,
        ),
        /** Login submit (14px semibold) */
        auth: cn(
          "rounded-none border border-solid border-[#111] bg-[#111] text-[14px] font-semibold uppercase leading-[14px] text-white",
          ix.btnDark,
        ),
        /** Google / soft card CTA */
        soft: cn(
          "rounded-lg bg-white text-[14px] font-semibold leading-[14px] text-[#111] shadow-[0_1px_2.5px_rgba(0,0,0,0.1)]",
          ix.cursor,
          "transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]",
        ),
        ghost:
          "bg-transparent text-[#111] hover:bg-[#f5f5f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]",
        link: cn(
          "rounded-none border-0 bg-transparent p-0 text-[12px] font-bold uppercase tracking-[0.6px] text-[#111]",
          ix.textUnderline,
        ),
      },
      size: {
        default: "min-h-12 px-8",
        auth: "min-h-12 w-full px-6",
        soft: "min-h-16 w-full gap-2",
        sm: "min-h-10 px-6 text-[12px]",
        lg: "min-h-12 px-8",
        link: "h-auto min-h-0 px-0",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
