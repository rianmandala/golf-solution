import * as React from "react";
import { cn } from "cn";

/** GS Figma textarea — booking notes field. */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[89px] w-full resize-none rounded-[2px] border border-solid border-[#c8c8c8] bg-white px-3.5 py-3 text-[15px] font-normal leading-[21px] text-[#111] shadow-none outline-none transition-colors duration-200",
        "placeholder:text-[#919191]",
        "focus-visible:border-[#111] focus-visible:ring-0",
        "aria-invalid:border-[#b42318] aria-invalid:ring-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
