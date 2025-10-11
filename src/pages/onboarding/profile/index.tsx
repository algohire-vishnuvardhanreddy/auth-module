"use client";

import { useNavigate, useSearchParams } from "react-router";
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
import { mockAuth } from "@/lib/mock-auth";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Sparkles } from "lucide-react";

// Zod schema for form validation
const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .nonempty("First name is required"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .nonempty("Last name is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SignupProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const email = searchParams.get("email") || "";
  // const verified = searchParams.get("verified") === "true";

  // Initialize React Hook Form with Zod validation
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Sign in with mockAuth
      const user = await mockAuth.signIn(email, "mock_password");
      const targetPortal = "recruiter";

      mockAuth.setPortal(targetPortal);
      const signedToken = mockAuth.generateSignedToken({
        ...user,
        portal: targetPortal,
        displayName: `${values.firstName} ${values.lastName}`, // Update displayName with form values
      });
      const redirectUrl = mockAuth.getPortalRedirectUrl(
        targetPortal,
        signedToken
      );

      toast({
        title: "Profile created!",
        description: "Welcome to AlgoHire",
      });

      setTimeout(() => {
        navigate(redirectUrl);
      }, 800);
    } catch (error) {
      toast({
        title: "Failed to create profile",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <SplitLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Complete Your Profile
          </h1>
          <p className="text-neutral-600">Tell us a bit about yourself</p>
        </div>

        {/* Form */}
        <Form {...form}>
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            onSubmit={form.handleSubmit(onSubmit)}
            className={`space-y-5 ${
              form.formState.errors.firstName || form.formState.errors.lastName
                ? "animate-shake"
                : ""
            }`}
          >
            {/* Email (Disabled) */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-neutral-900 font-medium flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="h-12 bg-neutral-100 border-neutral-300 text-neutral-600"
              />
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-neutral-900 font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        {...field}
                        className={`h-12 bg-white border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900 ${
                          form.formState.errors.firstName
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-neutral-900 font-medium">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        {...field}
                        className={`h-12 bg-white border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900 ${
                          form.formState.errors.lastName ? "border-red-500" : ""
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-base transition-colors"
            >
              {form.formState.isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating profile...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Complete Setup
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </span>
              )}
            </Button>
          </motion.form>
        </Form>
      </div>
    </SplitLayout>
  );
}
