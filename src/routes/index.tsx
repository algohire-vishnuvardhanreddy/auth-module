// import EmailSentIndex from "@/pages/auth/email-sent";
// import LoginEmailSentIndex from "@/pages/auth/email-sent/index";
// import ForgotPassword from "@/pages/auth/forgot-password";
// import SignIn from "@/pages/auth/login";
// import MagicLinkForm from "@/pages/auth/login/components/magic-link/index";
// import SetPasswordIndex from "@/pages/auth/set-password";
// import SignUpForm from "@/pages/auth/sign-up";
// import ForbiddenError from "@/pages/errors/forbidden";
// import GeneralError from "@/pages/errors/general-error";
// import NotFoundError from "@/pages/errors/not-found-error";
// import UnauthorisedError from "@/pages/errors/unauthorized-error";
// import Home from "@/pages/home";
// import Index from "@/pages/onboarding/profile";
// import { createBrowserRouter } from "react-router";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />,
//   },
//   {
//     path: "/login",
//     element: <SignIn />,
//   },
//   {
//     path: "/sign-up",
//     element: <SignUpForm />,
//   },
//   {
//     path: "/sign-up/email-sent",
//     element: <EmailSentIndex />,
//   },
//   {
//     path: "/login/email-sent",
//     element: <LoginEmailSentIndex />,
//   },
//   {
//     path: "/login/magic-link",
//     element: <MagicLinkForm />,
//   },
//   {
//     path: "/forgot-password",
//     element: <ForgotPassword />,
//   },
//   {
//     path: "/set-password",
//     element: <SetPasswordIndex />,
//   },
//   {
//     path: "/profile",
//     element: <Index />,
//   },
//   {
//     path: "/forbidden",
//     element: <ForbiddenError />,
//   },
//   {
//     path: "/error",
//     element: <GeneralError />,
//   },
//   {
//     path: "/unauthorized",
//     element: <UnauthorisedError />,
//   },
//   {
//     path: "*",
//     element: <NotFoundError />,
//   },
// ]);

// export default router;

import { createBrowserRouter } from "react-router";
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
import LogoutPage from "@/pages/auth/logout";
import MagicLinkSentPage from "@/pages/auth/magic-link/sent";
import MfaEmailPage from "@/pages/auth/mfa/email";
import MfaSetupPage from "@/pages/auth/mfa/setup";
import MfaVerifyPage from "@/pages/auth/mfa/verify";
import ForgotPasswordSuccessPage from "@/pages/auth/forgot-password/success";
import OAuthCallbackPage from "@/pages/auth/callback/oauth";
import AuthLoadingPage from "@/pages/auth/auth-loading";
import InvalidPortalPage from "@/pages/auth/invalid-portal";
import DashboardPage from "@/pages/auth/dashboard";

// Placeholder components for routes not provided
const SessionExpiredPage = () => <div>Session Expired Page</div>;
const RecruiterPortalPage = () => <div>Recruiter Portal</div>;
const ClientPortalPage = () => <div>Client Portal</div>;

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
    path: "/forgot-password/success",
    element: <ForgotPasswordSuccessPage />,
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
    path: "/logout",
    element: <LogoutPage />,
  },
  {
    path: "/magic-link/sent",
    element: <MagicLinkSentPage />,
  },
  {
    path: "/mfa/email",
    element: <MfaEmailPage />,
  },
  {
    path: "/mfa/setup",
    element: <MfaSetupPage />,
  },
  {
    path: "/mfa/verify",
    element: <MfaVerifyPage />,
  },
  {
    path: "/callback/oauth",
    element: <OAuthCallbackPage />,
  },
  {
    path: "/auth-loading",
    element: <AuthLoadingPage />,
  },
  {
    path: "/invalid-portal",
    element: <InvalidPortalPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/session-expired",
    element: <SessionExpiredPage />,
  },
  {
    path: "/mock/recruiterportal",
    element: <RecruiterPortalPage />,
  },
  {
    path: "/mock/clientportal",
    element: <ClientPortalPage />,
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
