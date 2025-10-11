"use client";

import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { SplitLayout } from "@/components/auth/split-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Chrome, Sparkles } from "lucide-react";
import { mockAuth } from "@/lib/mock-auth";

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
  const { toast } = useToast();

  // Initialize React Hook Form with Zod validation
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: SignupFormValues) => {
    try {
      // Simulate async operation with mockAuth
      await mockAuth.sendMagicLink(values.email);

      toast({
        title: "Magic link sent!",
        description: "Check your email to continue",
      });

      setTimeout(() => {
        navigate(
          `/magic-link/sent?email=${encodeURIComponent(
            values.email
          )}&signup=true`
        );
      }, 800);
    } catch (error) {
      toast({
        title: "Signup Failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignup = () => {
    navigate(`/callback/oauth?provider=google&signup=true`);
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
            onSubmit={form.handleSubmit(onSubmit)}
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-base transition-colors"
            >
              {form.formState.isSubmitting ? (
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
