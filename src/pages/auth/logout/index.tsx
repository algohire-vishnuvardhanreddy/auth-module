"use client";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AuthCard } from "@/components/auth/auth-card";
import { LoadingState } from "@/components/auth/loading-state";
import { LogOut } from "lucide-react";
import { mockAuth } from "@/lib/mock-auth";

export default function LogoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"logging-out" | "complete">(
    "logging-out"
  );

  const redirectTo = searchParams.get("redirectTo") || "/login";

  useEffect(() => {
    const performLogout = async () => {
      // Step 1: Sign out from Firebase (mocked)
      await mockAuth.signOut();

      // Step 2: Invalidate server session (mocked)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 3: Clear local state (mocked)
      await new Promise((resolve) => setTimeout(resolve, 500));

      setStatus("complete");

      // Step 4: Redirect
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(redirectTo);
    };

    performLogout();
  }, [redirectTo, navigate]);

  const icon = (
    <div className="relative">
      <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <LogOut className="h-8 w-8 text-primary" />
      </div>
    </div>
  );

  return (
    <AuthCard
      title="Logging you out..."
      description="Clearing your session securely. Please wait."
      icon={icon}
    >
      <LoadingState
        message={
          status === "complete" ? "Logout complete. Redirecting..." : undefined
        }
        steps={[
          { label: "Signing out", status: "complete" },
          {
            label: "Invalidating session",
            status: status === "complete" ? "complete" : "active",
          },
          {
            label: "Redirecting",
            status: status === "complete" ? "active" : "pending",
          },
        ]}
      />
    </AuthCard>
  );
}
