"use client";

import * as React from "react";
import { cn } from "cn";
import { Label as LabelPrimitive } from "radix-ui";

/** GS Figma form label — 11px bold uppercase muted. */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-[11px] font-bold uppercase leading-[14px] text-[#767676] select-none",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
