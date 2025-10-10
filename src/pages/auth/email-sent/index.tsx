import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { Mail, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/auth/auth-layout";

export default function LoginEmailSentIndex() {
  const navigate = useNavigate();
  const location = useLocation();

  // Mock route guard: Check if coming from magic-link, allow direct access for testing
  useEffect(() => {
    if (location.state?.from && !location.state.from.includes("/magic-link")) {
      navigate("/login");
    }
  }, [location, navigate]);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-start pt-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-xl">
          <CardContent className="p-0">
            <div className="space-y-8 text-center">
              {/* Icon */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <Mail className="h-12 w-12 text-indigo-600 dark:text-indigo-300" />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl animate-fade-in text-balance">
                  Check Your Email
                </h1>
                {/* <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg text-pretty">
                  We’ve sent a magic link to your inbox. Please click the link
                  to sign in.
                </p> */}
                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg text-pretty">
                  We've sent a confirmation email to your inbox. Please click
                  the link in the email to verify your account.
                </p>
              </div>

              {/* Go to back button */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="outline"
                  className="w-full bg-transparent rounded-md border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  asChild
                >
                  <Link to="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go to back
                  </Link>
                </Button>
              </div>

              {/* Helpful tip section */}
              <div className="pt-4 border-t border-gray-300 dark:border-gray-600">
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  Didn’t receive the email? Check your spam folder or try
                  signing in again.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
