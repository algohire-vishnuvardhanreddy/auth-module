"use client";

import { useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { mockAuth } from "@/lib/mock-auth";
import { useToast } from "@/hooks/use-toast";
import { OtpInput } from "@/components/auth/otp-input";

// Zod schema for form validation
const mfaVerifySchema = z.object({
  code: z.string().length(6, "Please enter a 6-digit code"),
});

type MfaVerifyFormValues = z.infer<typeof mfaVerifySchema>;

export default function MfaVerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [attempts, setAttempts] = useState(0);

  const portal = searchParams.get("portal") as "recruiter" | "client" | null;

  // Initialize React Hook Form with Zod validation
  const form = useForm<MfaVerifyFormValues>({
    resolver: zodResolver(mfaVerifySchema),
    defaultValues: {
      code: "",
    },
  });

  const handleVerify = async (values: MfaVerifyFormValues) => {
    try {
      const isValid = await mockAuth.verifyMfaCode(values.code, "mock_secret");

      if (!isValid) {
        setAttempts((prev) => prev + 1);
        form.setError("code", {
          type: "manual",
          message: "The code you entered is incorrect. Please try again.",
        });
        form.resetField("code");
        toast({
          title: "Incorrect Code",
          description: "The code you entered is incorrect. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Verified",
        description: "Authentication successful",
      });

      setTimeout(() => {
        const session = mockAuth.getSession();

        if (portal && session.user) {
          mockAuth.setPortal(portal);
          const signedToken = mockAuth.generateSignedToken({
            ...session.user,
            portal,
          });
          const redirectUrl = mockAuth.getPortalRedirectUrl(
            portal,
            signedToken
          );
          navigate(redirectUrl);
        } else if (session.user) {
          navigate("/select-portal");
        } else {
          navigate("/login");
        }
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRecovery = () => {
    toast({
      title: "Recovery Option",
      description: "Contact support for account recovery",
    });
  };

  const icon = (
    <div className="relative">
      <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Shield className="h-8 w-8 text-primary" />
      </div>
    </div>
  );

  return (
    <AuthCard
      title="Two-Factor Authentication"
      description="Enter the 6-digit code from your authenticator app"
      icon={icon}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-center block">Authentication Code</Label>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleVerify)}>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <OtpInput
                        length={6}
                        value={field.value}
                        onChange={field.onChange}
                        onComplete={() => form.handleSubmit(handleVerify)()}
                        error={!!form.formState.errors.code}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        {attempts > 0 && (
          <p className="text-sm text-destructive text-center">
            {attempts} failed {attempts === 1 ? "attempt" : "attempts"}
          </p>
        )}

        <Button
          onClick={form.handleSubmit(handleVerify)}
          disabled={
            form.formState.isSubmitting || form.watch("code").length !== 6
          }
          className="w-full"
        >
          {form.formState.isSubmitting ? "Verifying..." : "Verify"}
        </Button>

        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={handleRecovery}
            className="w-full text-sm"
          >
            Lost access? Get help
          </Button>
        </div>
      </div>
    </AuthCard>
  );
}
