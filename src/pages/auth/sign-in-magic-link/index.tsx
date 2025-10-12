"use client";

import { SplitLayout } from "@/components/auth/split-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import apiClient from "@/lib/apis";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

type VerifyMagicLinkResponse = {
  status: "success";
  message: string;
  data: {
    profile_completed: boolean;
    token: string;
    redirect_url: string;
    portal: string;
  };
};

export default function SignInMagicLink() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Mutation for verifying the magic link
  const { mutate: verifyMagicLink, isPending } = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Verification token is missing");
      }
      const response = await apiClient.post<VerifyMagicLinkResponse>(
        "/auth/sign-in/verify-magic-link",
        {
          token,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setIsVerified(true);
      if (data.data.redirect_url && data.data.profile_completed) {
        window.location.href = data.data.redirect_url;
      } else if (!data.data.profile_completed) {
        navigate("/sign-up/set-profile");
      } else {
        navigate("/sign-in");
      }
      toast.success("Email verified successfully!", {
        description: "You're now logged in to your account.",
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      navigate("/sign-in");
      setIsVerified(false);
      const errorMsg =
        error?.response?.data?.message || "Failed to verify email";
      setErrorMessage(errorMsg);
      toast.error("Verification Failed", {
        description: errorMsg,
      });
    },
  });

  // Auto-verify when component mounts
  useEffect(() => {
    if (token) {
      verifyMagicLink();
    } else {
      setIsVerified(false);
      setErrorMessage("Verification token is missing or invalid");
      toast.error("Invalid Link", {
        description: "The verification link is invalid or has expired.",
      });
      navigate("/sign-in");
    }
  }, [token, verifyMagicLink, navigate]);

  return (
    <SplitLayout>
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-neutral-900">
              Email Verification
            </h1>
            <p className="text-neutral-600">
              {isPending
                ? "Verifying your email address..."
                : isVerified
                ? "Your email has been verified successfully!"
                : "We couldn't verify your email address."}
            </p>
          </div>

          {/* Verification Status Card */}
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                {isPending ? (
                  <>
                    <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
                    <p className="text-neutral-600 text-center max-w-sm">
                      Please wait while we verify your email address...
                    </p>
                  </>
                ) : isVerified ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    </motion.div>
                    <p className="text-neutral-600 text-center max-w-sm">
                      You will be redirected to your dashboard shortly.
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle className="h-16 w-16 text-red-500" />
                    <p className="text-neutral-600 text-center max-w-sm">
                      {errorMessage ||
                        "The verification link is invalid or has expired."}
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {isVerified ? (
              <Button
                className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white font-medium"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full h-12 border-neutral-300 hover:bg-neutral-50"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </>
            )}
          </div>

          {/* Help Text */}
          <div className="text-center text-sm text-neutral-500">
            <p>
              Need help?{" "}
              <a
                href="mailto:support@algohire.com"
                className="text-neutral-900 hover:text-neutral-700 font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </SplitLayout>
  );
}
