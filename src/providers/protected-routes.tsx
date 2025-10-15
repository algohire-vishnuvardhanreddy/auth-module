// components/ProtectedRoute.tsx
import { PageLoader } from "@/components/ui/page-loader";
import { useAuth } from "@/context/auth-context";
import type { JSX } from "react";
import { Navigate } from "react-router";
interface ProtectedRouteProps {
  children: JSX.Element;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/sign-in",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div>
        <PageLoader />
      </div>
    ); // show loader while checking auth

  return user ? children : <Navigate to={redirectTo} replace />;
}
