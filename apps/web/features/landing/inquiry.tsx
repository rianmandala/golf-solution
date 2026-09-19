"use client";

import Link from "next/link";
import { useState } from "react";
import { FadeInSection, SectionDisplayTitle, SectionEyebrow } from "./primitives";
import { sectionPad, type } from "./typography";
import { ix } from "./interactions";
import { cn } from "@/lib/utils";

const interests = [
  { id: "fitting", label: "Club fitting" },
  { id: "coaching", label: "Coaching" },
  { id: "proshop", label: "Pro shop / stock" },
  { id: "partnership", label: "Partnership" },
] as const;

const fieldClass =
  "h-[45px] w-full border-b border-solid border-[#e5e5e5] bg-transparent px-0.5 py-2.5 text-[15.5px] font-normal text-[#111] outline-none transition-[border-color] duration-200 placeholder:text-[#c4c4c4] focus:border-[#111]";

const labelClass =
  "text-[11.5px] font-bold leading-[17.825px] tracking-[0.46px] text-[#767676]";

export function Inquiry() {
  const [interest, setInterest] = useState<(typeof interests)[number]["id"]>("fitting");

  return (
    <FadeInSection id="inquiry" className={cn("bg-white", sectionPad)}>
      <div className="mx-auto grid w-full min-w-0 max-w-[1360px] grid-cols-1 gap-12 md:gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 xl:grid-cols-[minmax(0,576px)_minmax(0,1fr)] xl:gap-20">
        <div className="min-w-0">
          <div className="h-[23.25px]">
            <SectionEyebrow className="pt-[6.5px]">Inquiry</SectionEyebrow>
          </div>

          <div className="pt-3.5">
            <SectionDisplayTitle className="xl:text-[58.111px] xl:leading-[59.273px] xl:tracking-[0.6973px]">
              <span className="block">Tell us what</span>
              <span className="block">you&apos;re after</span>
            </SectionDisplayTitle>
          </div>

          <p className="max-w-[351px] pt-[18px] text-[15px] font-normal leading-[23.25px] text-[#767676]">
            A fitting slot, a coaching plan, or club availability. Leave your details and a human
            replies within a day.
          </p>

          <div className="pt-[30px]">
            <div className="flex flex-col gap-3 border-t border-solid border-[#e5e5e5] pt-[22px]">
              <p className="text-[13px] font-bold leading-[20.15px] text-[#111]">In a hurry?</p>
              <Link
                href="#"
                className={cn(
                  "inline-flex w-fit border-b-2 border-solid border-[#111] pb-[3px] text-[14px] font-bold leading-[21.7px] tracking-[0.7px] text-[#111]",
                  ix.textUnderline,
                )}
              >
                Chat on WhatsApp
              </Link>
              <Link
                href="tel:+622112345678"
                className={cn(
                  "inline-flex w-fit border-b-2 border-solid border-[#111] pb-[3px] text-[14px] font-bold leading-[21.7px] tracking-[0.7px] text-[#111]",
                  ix.textUnderline,
                )}
              >
                +62 21 1234 5678
              </Link>
              <p className="text-[12.5px] font-normal leading-[19.375px] text-[#767676]">
                Mon–Sun · 09:00–21:00
              </p>
            </div>
          </div>
        </div>

        <form
          className="pt-2.5"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <fieldset>
            <legend className="sr-only">I&apos;m interested in</legend>
            <div className="flex flex-wrap gap-2.5">
              {interests.map((item) => {
                const active = interest === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setInterest(item.id)}
                    className={cn(
                      ix.chip,
                      "min-h-[45px] rounded-[2px] border border-solid px-5 py-3 text-[13.5px] font-medium leading-[20.925px] tracking-[0.46px]",
                      active
                        ? "border-[#111] bg-[#111] text-white"
                        : "border-[#e5e5e5] bg-white text-[#767676] hover:border-[#111] hover:text-[#111]",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-[30px] grid grid-cols-1 gap-9 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Name</span>
              <input type="text" name="name" placeholder="Your name" className={fieldClass} />
            </label>
            <label className="block">
              <span className={labelClass}>WhatsApp</span>
              <input
                type="tel"
                name="whatsapp"
                placeholder="08xx xxxx xxxx"
                className={fieldClass}
              />
            </label>
          </div>

          <div className="mt-[26px] grid grid-cols-1 gap-9 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Preferred time</span>
              <input
                type="text"
                name="preferredTime"
                placeholder="e.g. weekend morning"
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Message</span>
              <input
                type="text"
                name="message"
                placeholder="Tell us about your game"
                className={fieldClass}
              />
            </label>
          </div>

          <div className="mt-[26px] flex flex-wrap items-center gap-[18px]">
            <button
              type="submit"
              className={cn(
                type.cta,
                ix.btnDark,
                "inline-flex h-12 min-h-12 items-center justify-center rounded-[2px] border border-[#111] bg-[#111] px-8 text-white",
              )}
            >
              Send inquiry
            </button>
            <p className="text-[12.5px] font-normal leading-[19.375px] text-[#767676]">
              One reply, from a human. No spam.
            </p>
          </div>
        </form>
      </div>
    </FadeInSection>
  );
}
