"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockAuth } from "@/lib/mock-auth";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(mockAuth.getSession().user);

  useEffect(() => {
    const session = mockAuth.getSession();
    if (!session.user) {
      navigate("/login");
    } else {
      setUser(session.user);
    }
  }, [navigate]);

  const handleLogout = () => {
    navigate("/logout?redirectTo=/login");
  };

  const handleExpireSession = () => {
    mockAuth.expireSession();
    navigate("/session-expired?redirectTo=/dashboard");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.displayName}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Portal</p>
                <p className="font-medium">{user.portal || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MFA Status</p>
                <p className="font-medium">
                  {user.mfaEnabled ? `Enabled (${user.mfaMethod})` : "Disabled"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!user.mfaEnabled && (
                <Button
                  onClick={() => navigate("/mfa/setup")}
                  className="w-full"
                >
                  Enable MFA
                </Button>
              )}
              <Button
                onClick={handleExpireSession}
                variant="outline"
                className="w-full bg-transparent"
              >
                Test Session Expiry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
