import { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router";
import { Send } from "lucide-react";
import { toast } from "sonner";
import AnimatedButton from "@/components/ui/animated-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/components/auth/auth-layout";
import { useAuth } from "@/context/auth-context";

// Mock API to simulate sending magic link
const mockSendMagicLink = async (
  data: { email: string },
  //@ts-ignore ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  headers: { [key: string]: string }
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email) {
        resolve({ success: true, token: "mock-token" });
      } else {
        reject(new Error("Invalid email"));
      }
    }, 1000);
  });
};

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

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignUpForm() {
  const [isSignUpClicked, setIsSignUpClicked] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [magicLinkToken, setMagicLinkToken] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const navigate = useNavigate();
  const { signInWithProvider } = useAuth();

  useEffect(() => {
    if (isEmailSent) {
      navigate("/sign-up/email-sent", { state: { from: "/sign-up" } });
    }
  }, [isEmailSent, navigate]);

  useEffect(() => {
    if (magicLinkToken) {
      navigate(`/set-password?token=${magicLinkToken}`);
    }
  }, [magicLinkToken, navigate]);

  const sendMagicLink = async (token: string) => {
    setIsPending(true);
    try {
      const response = await mockSendMagicLink(
        { email: form.getValues("email") },
        { "cf-turnstile-token": token }
      );
      setIsSignUpClicked(false);
      setIsEmailSent(true);
      setMagicLinkToken(
        (response as { success: boolean; token: string }).token
      );
    } catch (e) {
      setIsSignUpClicked(false);
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    window.onInvisibleSubmit = function onInvisibleSubmit(token) {
      sendMagicLink(token);
    };
  }, []);

  const handleMagicLinkClick = () => {
    form.trigger("email").then((isValid) => {
      if (!isValid) {
        setIsSignUpClicked(false);
        return;
      }

      if (window.turnstile) {
        window.turnstile.execute("#turnstile-widget", { action: "sign-up" });
      } else {
        toast.error("Please refresh the page.");
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!(isSignUpClicked || isPending)) {
      setIsSignUpClicked(true);
      handleMagicLinkClick();
    }
  };

  const OAuthSign = async () => {
    try {
      const res = await signInWithProvider();
      if (res && res.success) {
        navigate("/");
      }
    } catch {
      toast.error("Authentication failed. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-start pt-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="space-y-4">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl animate-fade-in">
                Sign up for free
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-300 sm:text-lg">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline underline-offset-4 transition-colors duration-200"
                >
                  Sign in
                </Link>
                .
              </p>
            </div>

            <Form {...form}>
              <form className="space-y-3" onSubmit={handleSubmit}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="joe@company.com"
                          className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-200"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSubmit(e);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <div
                  id="turnstile-widget"
                  className="cf-turnstile"
                  data-sitekey="mock-sitekey"
                  data-size="invisible"
                  data-callback="onInvisibleSubmit"
                  data-action="sign-up"
                ></div>

                <AnimatedButton
                  type="submit"
                  disabled={isSignUpClicked || isPending}
                  loading={isPending}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!(isSignUpClicked || isPending)) {
                      setIsSignUpClicked(true);
                      handleMagicLinkClick();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      if (!(isSignUpClicked || isPending)) {
                        e.preventDefault();
                        setIsSignUpClicked(true);
                        handleMagicLinkClick();
                      }
                    }
                  }}
                  icon={<Send size={16} />}
                  //@ts-ignore ignore
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-200 rounded-md"
                >
                  Send me a magic link
                </AnimatedButton>
              </form>
            </Form>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              disabled={isSignUpClicked || isPending}
              onClick={() => {
                OAuthSign();
                setIsSignUpClicked(true);
              }}
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 rounded-md border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="h-5 w-5"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>

            <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              By creating an account, you agree to our{" "}
              <a
                target="_blank"
                href="https://algohire.ai/terms-and-conditions"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline underline-offset-4 transition-colors duration-200"
              >
                Terms of Service
              </a>{" "}
              and our{" "}
              <a
                target="_blank"
                href="https://algohire.ai/privacy-policy"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline underline-offset-4 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </Card>
      </div>
    </AuthLayout>
  );
}
