import EmailSentIndex from "@/pages/auth/email-sent";
import LoginEmailSentIndex from "@/pages/auth/email-sent/index";
import ForgotPassword from "@/pages/auth/forgot-password";
import SignIn from "@/pages/auth/login";
import MagicLinkForm from "@/pages/auth/login/components/magic-link/index";
import SetPasswordIndex from "@/pages/auth/set-password";
import SignUpForm from "@/pages/auth/sign-up";
import ForbiddenError from "@/pages/errors/forbidden";
import GeneralError from "@/pages/errors/general-error";
import NotFoundError from "@/pages/errors/not-found-error";
import UnauthorisedError from "@/pages/errors/unauthorized-error";
import Home from "@/pages/home";
import Index from "@/pages/onboarding/profile";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUpForm />,
  },
  {
    path: "/sign-up/email-sent",
    element: <EmailSentIndex />,
  },
  {
    path: "/login/email-sent",
    element: <LoginEmailSentIndex />,
  },
  {
    path: "/login/magic-link",
    element: <MagicLinkForm />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/set-password",
    element: <SetPasswordIndex />,
  },
  {
    path: "/profile",
    element: <Index />,
  },
  {
    path: "/forbidden",
    element: <ForbiddenError />,
  },
  {
    path: "/error",
    element: <GeneralError />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorisedError />,
  },
  {
    path: "*",
    element: <NotFoundError />,
  },
]);

export default router;
