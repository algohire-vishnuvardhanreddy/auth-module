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
import { auth } from "@/services/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    password: z
      .string()
      .min(12, { message: "Password must be at least 12 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SetPasswordForm({
  token,
  portal,
}: {
  token: string;
  portal?: string | null;
}) {
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: {
      password: string;
      token: string;
      portal?: string | null;
    }) => {
      const response = await apiClient.post("/auth/sign-up/set-password", data);
      return response;
    },
    onSuccess: async (data) => {
      try {
        setIsSigningIn(true);
        console.log(data);
        const token = data.data.auth_token;
        await signInWithCustomToken(auth, token);
        navigate("/sign-up/set-profile");
        toast.success("Your password has been set successfully");
      } catch (error) {
        console.error("Error signing in:", error);
        toast.error("Failed to sign in after setting password");
      } finally {
        setIsSigningIn(false);
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message ||
          "Failed to set password. The link may have expired."
      );
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const values = {
        password: data.password,
        token,
        portal,
      };
      mutate(values);
    } catch (error) {
      console.error("Error setting password:", error);
      toast.error("Failed to set password. The link may have expired.");
    }
  }

  // Combined loading state for both API call and Firebase auth
  const isLoading = isPending || isSigningIn;

  return (
    <SplitLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-neutral-900">
            Set Your Password
          </h1>
          <p className="text-neutral-600">
            Create a secure password for your account.
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
              form.formState.errors.password ? "animate-shake" : ""
            }`}
          >
            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-neutral-900 font-medium">
                    New Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        {...field}
                        className={`h-12 bg-white border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900 pr-10 ${
                          form.formState.errors.password ? "border-red-500" : ""
                        }`}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-neutral-900 font-medium">
                    Confirm Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        {...field}
                        className={`h-12 bg-white border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900 pr-10 ${
                          form.formState.errors.confirmPassword
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-base transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isSigningIn ? "Signing In..." : "Setting Password..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  Set Password
                </span>
              )}
            </Button>
          </motion.form>
        </Form>

        {/* Sign In Link */}
        <p className="text-center text-sm text-neutral-600">
          Already Have An Account?{" "}
          <Link
            to="/"
            className="text-neutral-900 hover:text-neutral-700 font-medium"
          >
            Portals
          </Link>
        </p>
      </div>
    </SplitLayout>
  );
}
