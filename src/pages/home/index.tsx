"use client";

import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, ArrowRight } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";

export default function SelectPortalPage() {
  const navigate = useNavigate();

  // Handle portal selection
  const handlePortalSelect = (portal: "recruiter" | "client") => {
    navigate(`/sign-in?portal=${portal}`);
  };

  return (
    <AuthCard
      title="Where do you want to go?"
      description="Select the portal you want to access"
    >
      <div className="grid gap-4">
        <Card
          className="group cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => handlePortalSelect("recruiter")}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
              <Users className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                Recruiter Portal
              </h3>
              <p className="text-sm text-muted-foreground">app.algohire.ai</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
          </CardContent>
        </Card>

        <Card
          className="group cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => handlePortalSelect("client")}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
              <Building2 className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Client Portal</h3>
              <p className="text-sm text-muted-foreground">
                client.algohire.ai
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
          </CardContent>
        </Card>
      </div>
    </AuthCard>
  );
}
