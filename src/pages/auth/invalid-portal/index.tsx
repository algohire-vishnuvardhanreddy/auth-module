"use client";

import { useNavigate } from "react-router";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { mockAuth } from "@/lib/mock-auth";

export default function InvalidPortalPage() {
  const navigate = useNavigate();

  const handleSwitchAccount = async () => {
    await mockAuth.signOut();
    navigate("/select-portal");
  };

  const icon = (
    <div className="relative">
      <div className="absolute inset-0 animate-pulse rounded-full bg-yellow-500/20 blur-xl" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
        <AlertTriangle className="h-8 w-8 text-yellow-600" />
      </div>
    </div>
  );

  return (
    <AuthCard
      title="Oops! Invalid Portal"
      description="You are not authorized to access this portal with the current session."
      icon={icon}
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
          <p className="text-sm text-muted-foreground">This could happen if:</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>• Your session has expired</li>
            <li>• You're trying to access the wrong portal</li>
            <li>• Your account doesn't have access to this portal</li>
          </ul>
        </div>

        <Button onClick={handleSwitchAccount} className="w-full">
          Switch Account
        </Button>

        <Button
          variant="ghost"
          onClick={() => navigate("/login")}
          className="w-full"
        >
          Back to Login
        </Button>
      </div>
    </AuthCard>
  );
}
