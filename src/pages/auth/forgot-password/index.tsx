import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import * as z from "zod";

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

import { SplitLayout } from "@/components/auth/split-layout";
import { auth } from "@/services/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import { toast } from "sonner";

// Zod schema for form validation
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await sendPasswordResetEmail(auth, values.email, {
        url: `${window.location.origin}/forgot-password/success`,
        handleCodeInApp: false,
      });
      form.reset();

      toast.success("Reset link sent!", {
        description: "Check your email for password reset instructions",
      });
    } catch (error) {
      form.setError("email", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : " 'If an account exists with this email, you will receive password reset instructions.'",
      });
      toast.error("Failed to send reset link", {
        description:
          error instanceof Error
            ? error.message
            : " 'If an account exists with this email, you will receive password reset instructions.'",
      });
    }
  };

  return (
    <SplitLayout>
      <div className="space-y-8">
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

        <div className="text-center">
          <Link
            to="/sign-in"
            className="inline-flex hover:underline items-center text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </SplitLayout>
  );
}
