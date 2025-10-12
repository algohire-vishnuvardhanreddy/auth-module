import { useNavigate, useSearchParams } from "react-router";
import { SetPasswordForm } from "./set-password";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apis";
import { SetPasswordSkeletonPage } from "./set-password-loading";

export default function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const portal = searchParams.get("portal");

  const navigate = useNavigate();
  if (!token) {
    navigate("/");
  }

  const { isLoading, isError } = useQuery({
    queryKey: [token, "set-password-token"],
    queryFn: async () =>
      await apiClient.post(`/auth/sign-up/validate`, {
        token,
      }),
    enabled: !!token,
  });

  if (isLoading) {
    return <SetPasswordSkeletonPage />;
  }

  if (isError) {
    navigate("/");
    return <div>Error...</div>;
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Invalid or missing password reset token. Please request a new
              password reset link.
            </AlertDescription>
          </Alert>

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 h-11 px-8 py-2"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <SetPasswordForm token={token} portal={portal} />;
}
