import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { PageLoader } from "@/components/ui/page-loader";
import { Card } from "@/components/ui/card";
import AuthLayout from "@/components/auth/auth-layout";
import { SetPasswordForm } from "./set-password";
import { toast } from "sonner";

// Mock API call to validate token
const mockValidateToken = async (token: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === "mock-token") {
        resolve({ success: true });
      } else {
        reject(new Error("Invalid or expired token"));
      }
    }, 1000);
  });
};

export default function SetPasswordIndex() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token") || "";

  useEffect(() => {
    if (!token) {
      toast.error("No token provided");
      navigate("/login");
      return;
    }

    mockValidateToken(token)
      .then(() => setIsLoading(false))
      .catch(() => {
        setIsError(true);
        toast.error("Invalid or expired token");
        navigate("/login");
      });
  }, [token, navigate]);

  if (isLoading) {
    return <PageLoader fullScreen />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-start pt-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Error
            </h1>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
              Invalid or expired token. Please try again or request a new link.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-start pt-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-xl">
          <SetPasswordForm token={token} />
        </Card>
      </div>
    </AuthLayout>
  );
}
