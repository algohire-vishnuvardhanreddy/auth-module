import { createBrowserRouter } from "react-router";
import Home from "@/pages/home";
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/sign-up";
import MagicLinkSentPage from "@/pages/magic-link/magic-link-sent";
import SetPasswordPage from "@/pages/auth/set-password";
import SignInMagicLink from "@/pages/auth/sign-in-magic-link";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ForgotPasswordSuccessPage from "@/pages/auth/forgot-password/success";
import ForbiddenError from "@/pages/errors/forbidden";
import GeneralError from "@/pages/errors/general-error";
import NotFoundError from "@/pages/errors/not-found-error";
import UnauthorisedError from "@/pages/errors/unauthorized-error";
import MainLayout from "@/components/layouts/main-layout";
import ProtectedRoute from "@/providers/protected-routes";
import SetProfilePage from "@/pages/auth/set-profile";

const router = createBrowserRouter([
  {
    element: <MainLayout />, // layout wrapper
    children: [
      { path: "/", element: <Home /> },
      { path: "/sign-in", element: <LoginPage /> },
      { path: "/sign-up", element: <SignupPage /> },
      { path: "/sign-up/email-sent", element: <MagicLinkSentPage /> },
      { path: "/login/email-sent", element: <MagicLinkSentPage /> },
      { path: "/sign-up/set-password", element: <SetPasswordPage /> },
      {
        path: "/sign-up/set-profile",
        element: (
          <ProtectedRoute>
            <SetProfilePage />
          </ProtectedRoute>
        ),
      },
      { path: "/sign-in/magic-link", element: <SignInMagicLink /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      {
        path: "/forgot-password/success",
        element: <ForgotPasswordSuccessPage />,
      },
      { path: "/profile", element: <></> },
      { path: "/forbidden", element: <ForbiddenError /> },
      { path: "/error", element: <GeneralError /> },
      { path: "/unauthorized", element: <UnauthorisedError /> },
      { path: "*", element: <NotFoundError /> },
    ],
  },
]);

export default router;
