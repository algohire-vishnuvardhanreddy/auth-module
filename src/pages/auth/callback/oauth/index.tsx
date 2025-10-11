"use client";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AuthCard } from "@/components/auth/auth-card";
import { LoadingState } from "@/components/auth/loading-state";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { mockAuth } from "@/lib/mock-auth";
import { useToast } from "@/hooks/use-toast";

type Step = { label: string; status: "complete" | "active" | "pending" };

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [steps, setSteps] = useState<Step[]>([
    { label: "OAuth Redirect", status: "active" },
    { label: "Firebase Sign-In", status: "pending" },
    { label: "Token Received", status: "pending" },
  ]);
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [error, setError] = useState<string | null>(null);
  const [isStuck, setIsStuck] = useState(false);

  const provider = searchParams.get("provider") || "google";
  const portal = searchParams.get("portal") as "recruiter" | "client" | null;

  useEffect(() => {
    // Set timeout for stuck detection
    const stuckTimer = setTimeout(() => {
      if (status === "processing") {
        setIsStuck(true);
      }
    }, 10000);

    const handleOAuthCallback = async () => {
      try {
        // Step 1: OAuth redirect complete
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSteps((prev) => [
          { ...prev[0], status: "complete" },
          { ...prev[1], status: "active" },
          prev[2],
        ]);

        // Step 2: Firebase sign-in
        const user = await mockAuth.signInWithOAuth(provider);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSteps((prev) => [
          prev[0],
          { ...prev[1], status: "complete" },
          { ...prev[2], status: "active" },
        ]);

        // Step 3: Token received
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSteps((prev) => [
          prev[0],
          prev[1],
          { ...prev[2], status: "complete" },
        ]);

        setStatus("success");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (portal) {
          mockAuth.setPortal(portal);
          const signedToken = mockAuth.generateSignedToken({ ...user, portal });
          const redirectUrl = mockAuth.getPortalRedirectUrl(
            portal,
            signedToken
          );
          navigate(redirectUrl);
        } else {
          // No portal specified, go to portal selection
          navigate("/select-portal");
        }
      } catch (err) {
        setStatus("error");
        setError(
          err instanceof Error ? err.message : "OAuth authentication failed"
        );
        toast({
          title: "Authentication Failed",
          description: "OAuth failed. Please try again.",
          variant: "destructive",
        });
      }
    };

    handleOAuthCallback();

    return () => clearTimeout(stuckTimer);
  }, [provider, portal, navigate, status, toast]);

  const handleRetry = () => {
    navigate("/login");
  };

  if (status === "error") {
    const icon = (
      <div className="relative">
        <div className="absolute inset-0 animate-pulse rounded-full bg-destructive/20 blur-xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
      </div>
    );

    return (
      <AuthCard
        title="Authentication Failed"
        description={
          error || "Something went wrong during OAuth authentication"
        }
        icon={icon}
      >
        <Button onClick={handleRetry} className="w-full">
          Return to Login
        </Button>
      </AuthCard>
    );
  }

  if (status === "success") {
    const icon = (
      <div className="relative">
        <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/20 blur-xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
      </div>
    );

    return (
      <AuthCard
        title="Success!"
        description={
          portal
            ? `Redirecting to ${portal} portal...`
            : "Authentication complete. Redirecting..."
        }
        icon={icon}
      >
        <LoadingState message="Taking you to your portal..." />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Finishing up..."
      description="Completing your authentication"
    >
      <LoadingState steps={steps} />

      {isStuck && (
        <div className="mt-6 space-y-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
          <p className="text-sm text-muted-foreground text-center">
            Taking longer than expected?
          </p>
          <Button
            onClick={handleRetry}
            variant="outline"
            className="w-full bg-transparent"
          >
            Try Again
          </Button>
        </div>
      )}
    </AuthCard>
  );
}
