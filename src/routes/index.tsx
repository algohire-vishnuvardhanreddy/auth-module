import { createBrowserRouter } from "react-router";
import Home from "@/pages/home";
import SignIn from "@/pages/auth/login";
import SignUpForm from "@/pages/auth/sign-up";
import ForgotPassword from "@/pages/auth/forgot-password";
import SetPasswordIndex from "@/pages/auth/set-password";
import EmailSentIndex from "@/pages/auth/email-sent";
import LoginEmailSentIndex from "@/pages/auth/email-sent/index";
import MagicLinkForm from "@/pages/auth/login/components/magic-link/index";
import Index from "@/pages/onboarding/profile";
import { AppErrorBoundary } from "@/pages/errors/error-boundary";
import ForbiddenError from "@/pages/errors/forbidden";
import GeneralError from "@/pages/errors/general-error";
import NotFoundError from "@/pages/errors/not-found-error";
import UnauthorisedError from "@/pages/errors/unauthorized-error";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppErrorBoundary>
        <Home />
      </AppErrorBoundary>
    ),
  },
  {
    path: "/login",
    element: (
      <AppErrorBoundary>
        <SignIn />
      </AppErrorBoundary>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <AppErrorBoundary>
        <SignUpForm />
      </AppErrorBoundary>
    ),
  },
  {
    path: "/sign-up/email-sent",
    element: (
      <AppErrorBoundary>
        <EmailSentIndex />
      </AppErrorBoundary>
    ),
  },
  {
    path: "/login/email-sent",
    element: (
      <AppErrorBoundary>
        <LoginEmailSentIndex />
      </AppErrorBoundary>
    ),
  },
  {
    path: "/login/magic-link",
    element: (
      <AppErrorBoundary>
        <MagicLinkForm />
      </AppErrorBoundary>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <AppErrorBoundary>
        <ForgotPassword />
      </AppErrorBoundary>
    ),
  },
  {
    path: "/set-password",
    element: (
      <AppErrorBoundary>
        <SetPasswordIndex />
      </AppErrorBoundary>
    ),
  },
  {
    path: "/onboarding/profile",
    element: (
      <AppErrorBoundary>
        <Index />
      </AppErrorBoundary>
    ),
  },
  {
    path: "/forbidden",
    element: (
      <AppErrorBoundary>
        <ForbiddenError />
      </AppErrorBoundary>
    ),
  },
  {
    path: "/error",
    element: (
      <AppErrorBoundary>
        <GeneralError />
      </AppErrorBoundary>
    ),
  },
  {
    path: "/unauthorized",
    element: (
      <AppErrorBoundary>
        <UnauthorisedError />
      </AppErrorBoundary>
    ),
  },
  {
    path: "*",
    element: (
      <AppErrorBoundary>
        <NotFoundError />
      </AppErrorBoundary>
    ),
  },
]);

export default router;
