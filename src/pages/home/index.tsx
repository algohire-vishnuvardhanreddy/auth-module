"use client";

import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthCard } from "@/components/auth/auth-card";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Building2, Users, ArrowRight } from "lucide-react";
import { mockAuth } from "@/lib/mock-auth";

// Zod schema for portal selection
const portalSchema = z.object({
  portal: z.enum(["recruiter", "client"], {
    required_error: "Please select a portal",
  }),
});

type PortalFormValues = z.infer<typeof portalSchema>;

export default function SelectPortalPage() {
  const navigate = useNavigate();

  // Initialize React Hook Form with Zod validation
  const form = useForm<PortalFormValues>({
    resolver: zodResolver(portalSchema),
    defaultValues: {
      portal: undefined,
    },
  });

  // Handle portal selection (via card click or form submission)
  const handlePortalSelect = (portal: "recruiter" | "client") => {
    // Set form value (optional, for form submission)
    form.setValue("portal", portal);

    const session = mockAuth.getSession();

    if (session.user) {
      mockAuth.setPortal(portal);
      const signedToken = mockAuth.generateSignedToken({
        ...session.user,
        portal,
      });
      const redirectUrl = mockAuth.getPortalRedirectUrl(portal, signedToken);
      navigate(redirectUrl);
    } else {
      navigate(`/login?portal=${portal}`);
    }
  };

  // Form submission handler (optional, for demonstration)
  const onSubmit = (data: PortalFormValues) => {
    handlePortalSelect(data.portal);
  };

  return (
    <AuthCard
      title="Where do you want to go?"
      description="Select the portal you want to access"
    >
      {/* Hidden form for demonstration of React Hook Form and Zod */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="hidden">
          <FormField
            control={form.control}
            name="portal"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input type="hidden" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>

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
