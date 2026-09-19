"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { displaySkew, type } from "./typography";

export function FadeInSection({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

export function SectionEyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn(type.eyebrow, className)}>{children}</p>;
}

export function SectionDisplayTitle({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={cn(displaySkew, "origin-left")}>
      <Tag
        className={cn(type.displayH2, className)}
      >
        {children}
      </Tag>
    </div>
  );
}

/** Eyebrow + title left; optional description right; optional actions (carousel arrows). */
export function SectionHeadingSplit({
  eyebrow,
  title,
  description,
  actions,
  className,
  titleClassName,
  descriptionClassName,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="max-w-[412px] shrink-0">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <div className="pt-3">
          <SectionDisplayTitle className={titleClassName}>{title}</SectionDisplayTitle>
        </div>
      </div>
      {(description || actions) && (
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:gap-10">
          {description ? (
            <p className={cn(type.bodyMuted, "max-w-[355px]", descriptionClassName)}>
              {description}
            </p>
          ) : null}
          {actions}
        </div>
      )}
    </div>
  );
}

/** @deprecated Prefer SectionHeadingSplit or SectionHeadingWithBody */
export const SectionHeading = SectionHeadingSplit;

/** Ambassadors pattern: title block includes description under title; arrows on the right. */
export function SectionHeadingWithBody({
  eyebrow,
  title,
  description,
  actions,
  className,
  titleClassName,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  actions?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="min-w-0 max-w-full shrink-0 sm:max-w-[430px]">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <div className="pt-3">
          <SectionDisplayTitle className={titleClassName}>{title}</SectionDisplayTitle>
        </div>
        <p className={cn(type.bodyMuted, "mt-3 max-w-[355px]")}>{description}</p>
      </div>
      {actions}
    </div>
  );
}
