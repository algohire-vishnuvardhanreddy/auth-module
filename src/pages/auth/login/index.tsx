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
import { useAuth } from "@/context/auth-context";
import apiClient from "@/lib/apis";
import { getCookie } from "@/lib/cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { motion } from "framer-motion";
import { Chrome, Eye, EyeOff, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import * as z from "zod";

// Zod schema for form validation
const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z.string().optional(),
  loginMethod: z.enum(["password", "magic"]),
  showPassword: z.boolean().optional(),
});
// .refine(
//   (data) => {
//     if (data.loginMethod === "password") {
//       return data.password && data.password.length >= 12;
//     }
//     return true;
//   },
//   {
//     message: "Password must be at least 8 characters",
//     path: ["password"],
//   }
// )
// .refine(
//   (data) => {
//     if (data.loginMethod === "password") {
//       return !!data.password;
//     }
//     return true;
//   },
//   {
//     message: "Password is required",
//     path: ["password"],
//   }
// );

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = searchParams.get("portal");

  const { login, signInWithProvider } = useAuth();

  console.log(redirectTo);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      loginMethod: "password",
      showPassword: false,
    },
  });

  const sendMagicLinkFn = useMutation({
    mutationFn: async ({
      email,
      portal,
    }: {
      email: string;
      portal: string;
    }) => {
      const response = await apiClient.post("/auth/sign-in/send-magic-link", {
        email,
        portal,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Magic link sent!", {
        description: "Check your email to continue",
      });
    },
    onError: (e: AxiosError<{ message: string }>) => {
      const errorMessage = e?.response?.data?.message || "Something went wrong";
      toast.error("Signup Failed", {
        description: errorMessage,
      });
    },
  });

  // Form submission handler
  const onSubmit = async (values: LoginFormValues) => {
    try {
      const portal = getCookie("portal");
      if (values.loginMethod === "password") {
        const user = await login(
          values.email,
          values.password || "",
          portal || "recruiter"
        );
        if (!user.success) {
          toast.error("Login Failed");
          return;
        }
      }
      if (values.loginMethod === "magic") {
        sendMagicLinkFn.mutate({
          email: values.email,
          portal: portal || "recruiter",
        });
      }
    } catch (error) {
      form.setError("email", {
        type: "manual",
        message: error instanceof Error ? error.message : "Invalid credentials",
      });
      toast.error("Login Failed", {
        description:
          error instanceof Error ? error.message : "Invalid credentials",
      });
    }
  };

  const handleGoogleLogin = async () => {
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
          navigate("/sign-in?portal=" + res.portal);
        }
      }
      form.reset();
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
          <h1 className="text-3xl font-bold text-neutral-900">Welcome Back</h1>
          <p className="text-neutral-600">
            {form.watch("loginMethod") === "password"
              ? "Enter your email and password to access your account."
              : "Enter your email to receive a magic link."}
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
            {/* Email Field */}
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

            {/* Password Field - Only show for password method */}
            {form.watch("loginMethod") === "password" && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-neutral-900 font-medium">
                        Password
                      </FormLabel>
                      {form.watch("loginMethod") === "password" && (
                        <div className="flex items-center justify-between">
                          <div></div>
                          <Link
                            to="/forgot-password"
                            className="text-sm text-neutral-900 hover:text-neutral-700 font-medium transition-colors"
                          >
                            Forgot Your Password?
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <FormControl>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          {...field}
                          className={`h-12 bg-white border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900 pr-10 ${
                            form.formState.errors.password
                              ? "border-red-500"
                              : ""
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
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                form.formState.isSubmitting || sendMagicLinkFn.isPending
              }
              className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-base transition-colors"
            >
              {form.formState.isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {form.watch("loginMethod") === "password"
                    ? "Logging in..."
                    : "Sending..."}
                </span>
              ) : form.watch("loginMethod") === "password" ? (
                "Log In"
              ) : (
                <span className="flex items-center gap-2">
                  Send Magic Link
                  {sendMagicLinkFn.isPending ? (
                    <span className="ml-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </span>
              )}
            </Button>

            {/* Toggle Login Method */}
            <div className="text-center">
              <button
                type="button"
                onClick={() =>
                  form.setValue(
                    "loginMethod",
                    form.watch("loginMethod") === "password"
                      ? "magic"
                      : "password"
                  )
                }
                className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {form.watch("loginMethod") === "password"
                  ? "Or use magic link instead"
                  : "Or use password instead"}
              </button>
            </div>
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
          onClick={handleGoogleLogin}
          className="w-full h-12 bg-white border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400"
        >
          <Chrome className="mr-2 h-5 w-5" />
          Google
        </Button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-neutral-600">
          Don't Have An Account?{" "}
          <Link
            to="/sign-up"
            className="text-neutral-900 hover:text-neutral-700 font-medium"
          >
            Register Now.
          </Link>
        </p>
      </div>
    </SplitLayout>
  );
}
