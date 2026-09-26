"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { ix } from "@/features/landing/interactions";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onSuccess: (email: string) => void;
};

const labelClass =
  "text-[11px] font-bold uppercase leading-[14px] text-[#767676]";

const inputClass =
  "h-[47px] w-full rounded-[2px] border border-solid border-[#c8c8c8] bg-white px-[14px] py-3 text-[15px] font-normal leading-5 text-[#111] outline-none transition-colors duration-200 placeholder:text-[#111]/55 focus:border-[#111]";

const errorClass = "pt-1 text-[12px] font-normal leading-[17px] text-[#b42318]";

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  return (
    <form
      className="flex w-full flex-col gap-[22px]"
      onSubmit={handleSubmit((values) => onSuccess(values.email))}
      noValidate
    >
      <div className="flex w-full flex-col gap-1.5">
        <label htmlFor="account-email" className={labelClass}>
          Email
        </label>
        <input
          id="account-email"
          type="text"
          autoComplete="email"
          placeholder="you@email.com"
          aria-invalid={Boolean(errors.email)}
          className={cn(inputClass, errors.email && "border-[#b42318]")}
          {...register("email")}
        />
        {errors.email ? <p className={errorClass}>{errors.email.message}</p> : null}
      </div>

      <div className="flex w-full flex-col gap-1.5">
        <label htmlFor="account-password" className={labelClass}>
          Password
        </label>
        <div className="relative">
          <input
            id="account-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={Boolean(errors.password)}
            className={cn(
              inputClass,
              "pr-12",
              errors.password && "border-[#b42318]",
            )}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className={cn(
              "absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-sm",
              ix.cursor,
              "transition-opacity duration-200 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                showPassword
                  ? "/landing/icon-eye.svg"
                  : "/landing/icon-eye-off.svg"
              }
              alt=""
              width={24}
              height={24}
              className="size-6"
            />
          </button>
        </div>
        {errors.password ? (
          <p className={errorClass}>{errors.password.message}</p>
        ) : null}
      </div>

      <a
        href="#forgot-password"
        onClick={(event) => event.preventDefault()}
        className={cn(
          "inline-flex h-[27px] w-fit border-b-2 border-solid border-[#111] text-[14px] font-semibold leading-[14px] text-[#111]",
          ix.textUnderline,
        )}
      >
        Forgot password?
      </a>

      <button
        type="submit"
        className={cn(
          "flex min-h-12 w-full items-center justify-center border border-solid border-[#111] bg-[#111] px-6 text-[14px] font-semibold uppercase leading-[14px] text-white",
          ix.btnDark,
        )}
      >
        Log in
      </button>
    </form>
  );
}

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type SignupValues = z.infer<typeof signupSchema>;

export function SignupForm({ onSuccess }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onSubmit",
  });

  return (
    <form
      className="flex w-full flex-col gap-[22px]"
      onSubmit={handleSubmit((values) => onSuccess(values.email))}
      noValidate
    >
      <div className="flex w-full flex-col gap-1.5">
        <label htmlFor="signup-name" className={labelClass}>
          Full name
        </label>
        <input
          id="signup-name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          aria-invalid={Boolean(errors.name)}
          className={cn(inputClass, errors.name && "border-[#b42318]")}
          {...register("name")}
        />
        {errors.name ? <p className={errorClass}>{errors.name.message}</p> : null}
      </div>

      <div className="flex w-full flex-col gap-1.5">
        <label htmlFor="signup-email" className={labelClass}>
          Email
        </label>
        <input
          id="signup-email"
          type="text"
          autoComplete="email"
          placeholder="you@email.com"
          aria-invalid={Boolean(errors.email)}
          className={cn(inputClass, errors.email && "border-[#b42318]")}
          {...register("email")}
        />
        {errors.email ? <p className={errorClass}>{errors.email.message}</p> : null}
      </div>

      <div className="flex w-full flex-col gap-1.5">
        <label htmlFor="signup-password" className={labelClass}>
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          aria-invalid={Boolean(errors.password)}
          className={cn(inputClass, errors.password && "border-[#b42318]")}
          {...register("password")}
        />
        {errors.password ? (
          <p className={errorClass}>{errors.password.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        className={cn(
          "flex min-h-12 w-full items-center justify-center border border-solid border-[#111] bg-[#111] px-6 text-[14px] font-semibold uppercase leading-[14px] text-white",
          ix.btnDark,
        )}
      >
        Sign up
      </button>
    </form>
  );
}
