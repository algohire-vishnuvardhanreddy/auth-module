"use client";

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { mockAuth } from "@/lib/mock-auth";
import { useToast } from "@/hooks/use-toast";
import { OtpInput } from "@/components/auth/otp-input";

// Zod schema for form validation
const mfaEmailSchema = z.object({
  code: z.string().length(6, "Please enter a 6-digit code"),
});

type MfaEmailFormValues = z.infer<typeof mfaEmailSchema>;

export default function MfaEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [countdown, setCountdown] = useState(0);

  const email = searchParams.get("email") || "user@example.com";
  const portal = searchParams.get("portal") as "recruiter" | "client" | null;

  // Initialize React Hook Form with Zod validation
  const form = useForm<MfaEmailFormValues>({
    resolver: zodResolver(mfaEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    // Send initial code
    sendCode();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendCode = async () => {
    try {
      await mockAuth.sendEmailCode(email);
      setCountdown(60);

      toast({
        title: "Code Sent",
        description: `Verification code sent to ${email}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVerify = async (values: MfaEmailFormValues) => {
    try {
      const isValid = await mockAuth.verifyEmailCode(email, values.code);

      if (!isValid) {
        form.setError("code", {
          type: "manual",
          message: "The code you entered is incorrect or has expired.",
        });
        form.resetField("code");
        toast({
          title: "Incorrect Code",
          description: "The code you entered is incorrect or has expired.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Verified",
        description: "Email verification successful",
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

  const icon = (
    <div className="relative">
      <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-8 w-8 text-primary" />
      </div>
    </div>
  );

  return (
    <AuthCard
      title="Email Verification"
      description={`Enter the code sent to ${email}`}
      icon={icon}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-center block">Verification Code</Label>
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
            onClick={sendCode}
            disabled={countdown > 0 || form.formState.isSubmitting}
            className="w-full text-sm"
          >
            {countdown > 0
              ? `Resend code in ${countdown}s`
              : form.formState.isSubmitting
              ? "Sending..."
              : "Resend code"}
          </Button>

          {countdown > 0 && (
            <p className="text-center text-xs text-muted-foreground">
              Check your email for the verification code
            </p>
          )}
        </div>
      </div>
    </AuthCard>
  );
}
