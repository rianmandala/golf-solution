import * as React from "react";
import { cn } from "cn";

/** GS Figma form input — match account / booking fields (47px, 2px radius, #c8c8c8). */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-[47px] w-full min-w-0 rounded-[2px] border border-solid border-[#c8c8c8] bg-white px-[14px] py-3 text-[15px] font-normal leading-5 text-[#111] shadow-none outline-none transition-colors duration-200",
        "placeholder:text-[#111]/55",
        "focus-visible:border-[#111] focus-visible:ring-0",
        "aria-invalid:border-[#b42318] aria-invalid:ring-0",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
