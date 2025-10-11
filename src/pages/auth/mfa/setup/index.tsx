"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle2 } from "lucide-react";
import { mockAuth } from "@/lib/mock-auth";
import { useToast } from "@/hooks/use-toast";
import { OtpInput } from "@/components/auth/otp-input";

// Zod schema for form validation
const mfaSetupSchema = z.object({
  code: z.string().length(6, "Please enter a 6-digit code"),
});

type MfaSetupFormValues = z.infer<typeof mfaSetupSchema>;

export default function MfaSetupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [secret, setSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize React Hook Form with Zod validation
  const form = useForm<MfaSetupFormValues>({
    resolver: zodResolver(mfaSetupSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    const generateSecret = async () => {
      const { secret: newSecret, qrCode: newQrCode } =
        await mockAuth.generateMfaSecret();
      setSecret(newSecret);
      setQrCode(newQrCode);
      setIsLoading(false);
    };

    generateSecret();
  }, []);

  const handleEnableMfa = async (values: MfaSetupFormValues) => {
    try {
      const isValid = await mockAuth.verifyMfaCode(values.code, secret);

      if (!isValid) {
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

      await mockAuth.enableMfa("authenticator", secret);
      setIsSuccess(true);

      toast({
        title: "MFA Enabled",
        description: "Two-factor authentication has been enabled successfully",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable MFA. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isSuccess) {
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
        title="MFA Enabled!"
        description="Your account is now protected with two-factor authentication"
        icon={icon}
      >
        <p className="text-center text-sm text-muted-foreground">
          Redirecting to dashboard...
        </p>
      </AuthCard>
    );
  }

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
      title="Setup Authenticator"
      description="Scan the QR code with your authenticator app"
      icon={icon}
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-lg bg-primary/20 blur-xl" />
              <div className="relative rounded-lg border-2 border-border p-4 bg-white">
                <img
                  src={qrCode || "/placeholder.svg"}
                  alt="QR Code"
                  width={200}
                  height={200}
                  className="h-48 w-48"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-center text-sm text-muted-foreground">
              Or enter this code manually:
            </p>
            <div className="rounded-md bg-muted p-3 text-center font-mono text-sm">
              {secret}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-center block">Enter 6-digit code</Label>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEnableMfa)}>
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
                          onComplete={() =>
                            form.handleSubmit(handleEnableMfa)()
                          }
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
            onClick={form.handleSubmit(handleEnableMfa)}
            disabled={
              form.formState.isSubmitting || form.watch("code").length !== 6
            }
            className="w-full"
          >
            {form.formState.isSubmitting ? "Verifying..." : "Enable MFA"}
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      )}
    </AuthCard>
  );
}
