import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

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

import { Mail, ArrowLeft, Chrome, KeyRound } from "lucide-react";
import { mockAuth } from "@/lib/mock-auth";
import { toast } from "sonner";
import { SplitLayout } from "@/components/auth/split-layout";

// Zod schema for form validation
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Initialize React Hook Form with Zod validation
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Form submission handler
  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      // Use mockAuth to send a password reset link
      await mockAuth.sendMagicLink(values.email);

      toast.success("Reset link sent!", {
        description: "Check your email for password reset instructions",
      });

      setTimeout(() => {
        navigate("/forgot-password/success");
      }, 1000);
    } catch (error) {
      form.setError("email", {
        type: "manual",
        message: error instanceof Error ? error.message : "Please try again",
      });
      toast.success("Failed to send reset link", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  return (
    <SplitLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <KeyRound className="h-6 w-6 text-neutral-900" />
            <h1 className="text-3xl font-bold text-neutral-900">
              Reset Password
            </h1>
          </div>
          <p className="text-neutral-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            onSubmit={form.handleSubmit(handleSubmit)}
            className={`space-y-5 ${
              form.formState.errors.email ? "animate-shake" : ""
            }`}
          >
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-neutral-900 font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
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
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send Reset Link
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
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
              OR LOGIN WITH
            </span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/callback/oauth?provider=google`)}
          className="w-full h-12 bg-white border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400"
        >
          <Chrome className="mr-2 h-5 w-5" />
          Google
        </Button>

        {/* Back to Login Link */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </SplitLayout>
  );
}
