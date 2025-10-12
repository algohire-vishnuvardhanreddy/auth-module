import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ForgotPasswordSuccessPage from "@/pages/auth/forgot-password/success";
import LoginPage from "@/pages/auth/login";
import SetPasswordPage from "@/pages/auth/set-password";
import SignInMagicLink from "@/pages/auth/sign-in-magic-link";

import SignupPage from "@/pages/auth/sign-up";
import ForbiddenError from "@/pages/errors/forbidden";
import GeneralError from "@/pages/errors/general-error";
import NotFoundError from "@/pages/errors/not-found-error";
import UnauthorisedError from "@/pages/errors/unauthorized-error";
import Home from "@/pages/home";
import MagicLinkSentPage from "@/pages/magic-link/magic-link-sent";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/sign-in",
    element: <LoginPage />,
  },
  {
    path: "/sign-up",
    element: <SignupPage />,
  },
  {
    path: "/sign-up/email-sent",
    element: <MagicLinkSentPage />,
  },
  {
    path: "/sign-up/email-sent",
    element: <MagicLinkSentPage />,
  },
  {
    path: "/login/email-sent",
    element: <MagicLinkSentPage />,
  },
  {
    path: "/sign-up/set-password",
    element: <SetPasswordPage />,
  },
  {
    path: "/sign-up/set-profile",
    element: <> set your profile here</>,
  },
  {
    path: "/sign-in/magic-link",
    element: <SignInMagicLink />,
  },
  // {
  //   path: "/login/magic-link",
  //   element: <MagicLinkForm />,
  // },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/forgot-password/success",
    element: <ForgotPasswordSuccessPage />,
  },
  // {
  //   path: "/set-password",
  //   element: <SetPasswordIndex />,
  // },
  {
    path: "/profile",
    element: <></>,
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
