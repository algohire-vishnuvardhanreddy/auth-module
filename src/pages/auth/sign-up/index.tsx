"use client";

import { SplitLayout } from "@/components/auth/split-layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/apis";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Chrome, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import * as z from "zod";
import type { AxiosError } from "axios";
import env from "@/lib/env";
import { getCookie } from "@/lib/cookie";
import { useAuth } from "@/context/auth-context";

declare global {
  interface Window {
    turnstile?: {
      execute: (
        selector: string | HTMLElement,
        options: { action: string }
      ) => void;
    };
    onInvisibleSubmit?: (token: string) => void;
  }
}

// Zod schema for form validation
const signupSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const [isSignUpClicked, setIsSignUpClicked] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const portal = getCookie("portal");

  // Initialize React Hook Form with Zod validation
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
    },
  });

  const { signInWithProvider } = useAuth();

  // Navigate to email sent page when email is sent
  useEffect(() => {
    if (isEmailSent) {
      navigate(
        `/sign-up/email-sent?email=${encodeURIComponent(
          form.getValues("email")
        )}&signup=true`
      );
    }
  }, [isEmailSent, navigate, form]);

  const { mutate: sendMagicLlinkFn, isPending: sendMagicLlinkPending } =
    useMutation({
      mutationFn: async (token: string) => {
        const response = await apiClient.post(
          "/auth/sign-up/init",
          {
            email: form.getValues("email"),
            portal,
          },
          {
            headers: { "cf-turnstile-token": token },
          }
        );
        return response.data;
      },
      onSuccess: () => {
        setIsSignUpClicked(false);
        form.reset();
        setIsEmailSent(true);
        toast.success("Magic link sent!", {
          description: "Check your email to continue",
        });
      },
      onError: (e: AxiosError<{ message: string }>) => {
        setIsSignUpClicked(false);
        const errorMessage =
          e?.response?.data?.message || "Something went wrong";
        toast.error("Signup Failed", {
          description: errorMessage,
        });
      },
    });

  // Setup Turnstile callback
  useEffect(() => {
    window.onInvisibleSubmit = function onInvisibleSubmit(token) {
      sendMagicLlinkFn(token);
    };
  }, [sendMagicLlinkFn]);

  const handleMagicLinkClick = () => {
    form.trigger("email").then((isValid) => {
      if (!isValid) {
        setIsSignUpClicked(false);
        return;
      }

      if (window.turnstile) {
        window.turnstile.execute("#turnstile-widget", {
          action: "sign-up",
        });
      } else {
        toast.error("Please refresh the page.");
        setIsSignUpClicked(false);
      }
    });
  };

  // Handle form submission (when Enter is pressed)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!(isSignUpClicked || sendMagicLlinkPending)) {
      setIsSignUpClicked(true);
      handleMagicLinkClick();
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const portal = getCookie("portal");
      if (!portal) {
        navigate("/");
        toast.warning("Portal not found");
        return;
      }
      const res = await signInWithProvider(portal);
      if (res && res.success) {
        if (res.profileCompleted && res.redirectUrl) {
          navigate(res.redirectUrl);
        } else if (!res.profileCompleted) {
          navigate("/sign-up/set-profile");
        } else {
          navigate("/sign-up?portal=" + res.portal);
        }
      }
    } catch (error) {
      toast.error("Authentication failed. Please try again.");
      console.log(error);
    }
  };

  return (
    <SplitLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-neutral-900">
            Create Account
          </h1>
          <p className="text-neutral-600">
            Create a new account to get started with AlgoHire.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className={`space-y-5 ${
              form.formState.errors.email ? "animate-shake" : ""
            }`}
          >
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-neutral-900 font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@company.com"
                      {...field}
                      className={`h-12 bg-white border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900 ${
                        form.formState.errors.email ? "border-red-500" : ""
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Turnstile Widget */}
            <div
              id="turnstile-widget"
              className="cf-turnstile"
              data-sitekey={env.turnstile_site_key}
              data-size="invisible"
              data-callback="onInvisibleSubmit"
              data-action="sign-up"
            ></div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSignUpClicked || sendMagicLlinkPending}
              className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-base transition-colors"
              onClick={(e) => {
                e.preventDefault();
                if (!(isSignUpClicked || sendMagicLlinkPending)) {
                  setIsSignUpClicked(true);
                  handleMagicLinkClick();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  if (!(isSignUpClicked || sendMagicLlinkPending)) {
                    e.preventDefault();
                    setIsSignUpClicked(true);
                    handleMagicLinkClick();
                  }
                }
              }}
            >
              {sendMagicLlinkPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending Magic Link...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Continue with Magic Link
                  <Sparkles className="h-4 w-4" />
                </span>
              )}
            </Button>
          </motion.form>
        </Form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-neutral-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-neutral-50 px-3 text-neutral-500 font-medium">
              OR SIGN UP WITH
            </span>
          </div>
        </div>

        {/* OAuth Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignup}
          disabled={isSignUpClicked || sendMagicLlinkPending}
          className="w-full h-12 bg-white border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400"
        >
          <Chrome className="mr-2 h-5 w-5" />
          Google
        </Button>

        {/* Sign In Link */}
        <p className="text-center text-sm text-neutral-600">
          Already Have An Account?{" "}
          <Link
            to="/login"
            className="text-neutral-900 hover:text-neutral-700 font-medium"
          >
            Sign In.
          </Link>
        </p>
      </div>
    </SplitLayout>
  );
}
