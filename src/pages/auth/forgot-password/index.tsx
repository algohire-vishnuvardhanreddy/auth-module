"use client";

import type React from "react";
import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { AuthCard } from "@/components/auth/auth-card";
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
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import { mockAuth } from "@/lib/mock-auth";

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
  const { toast } = useToast();

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

      toast({
        title: "Reset link sent!",
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
      toast({
        title: "Failed to send reset link",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <AuthCard
          title={
            <div className="flex items-center justify-center gap-2">
              <KeyRound className="h-6 w-6 text-primary" />
              <span>Reset Password</span>
            </div>
          }
          description="Enter your email to receive a password reset link"
        >
          <Form {...form}>
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              onSubmit={form.handleSubmit(handleSubmit)}
              className={`space-y-4 ${
                form.formState.errors.email ? "animate-shake" : ""
              }`}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel
                      htmlFor="email"
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        {...field}
                        className={`transition-all focus:scale-[1.01] ${
                          form.formState.errors.email ? "border-red-500" : ""
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full group"
                size="lg"
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
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

          <Link to="/login">
            <Button variant="ghost" className="w-full group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Button>
          </Link>
        </AuthCard>
      </motion.div>
    </div>
  );
}
