/**
 * Shared micro-interaction classes for GS landing.
 * Resting styles stay Figma-accurate; these only add hover/focus/active motion.
 * Always pair with motion-reduce where transforms run.
 */

export const ix = {
  cursor: "cursor-pointer",

  /** Black filled CTA */
  btnDark:
    "cursor-pointer transition-colors duration-200 hover:bg-[#2a2a2a] active:bg-[#000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]",

  /** White filled CTA on dark hero */
  btnLight:
    "cursor-pointer transition-colors duration-200 hover:bg-white/90 active:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",

  /** Ghost / outline on dark */
  btnGhostDark:
    "cursor-pointer transition-colors duration-200 hover:bg-white/10 active:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",

  /** Ghost / outline on light */
  btnGhostLight:
    "cursor-pointer transition-colors duration-200 hover:bg-[#f5f5f5] active:bg-[#ebebeb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]",

  /** Square icon / chevron controls */
  iconSquare:
    "cursor-pointer transition-colors duration-200 hover:bg-[#111] hover:border-[#111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111] [&_img]:transition-[filter] [&_img]:duration-200 hover:[&_img]:invert hover:[&_img]:brightness-0 hover:[&_img]:contrast-[100%]",

  /** Header circular icon buttons */
  iconRound:
    "cursor-pointer transition-colors duration-200 hover:bg-[#f5f5f5] active:bg-[#ebebeb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]",

  /** Text link with underline (coach / reserve) */
  textUnderline:
    "cursor-pointer transition-opacity duration-200 hover:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111]",

  /** Footer / muted links */
  textMuted:
    "cursor-pointer transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",

  /** Card media zoom inside overflow-hidden */
  imgZoom:
    "transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none",

  /** Arrow nudge on card hover */
  arrowNudge:
    "transition-transform duration-300 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none",

  /** Soft card border lift */
  cardHover:
    "cursor-pointer transition-[border-color,box-shadow] duration-300 hover:border-[#111] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] motion-reduce:transition-colors",

  /** Form chip / interest toggle */
  chip:
    "cursor-pointer transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]",

  /** Slide tab track hover */
  slideTab:
    "cursor-pointer transition-opacity duration-200 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
} as const;
