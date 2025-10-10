import { Link } from "react-router";
import { Card } from "@/components/ui/card";
import AuthLayout from "@/components/auth/auth-layout";
import { UserAuthForm } from "./components/user-auth-form";

export default function SignIn() {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-start pt-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="mb-4 space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl animate-fade-in">
                Welcome Back 👋
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-300 sm:text-lg">
                New to our platform?{" "}
                <Link
                  to="/sign-up"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline underline-offset-4 transition-colors duration-200"
                >
                  Create an account
                </Link>
                .
              </p>
            </div>
          </div>
          <UserAuthForm />
          <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            By logging in, you agree to our{" "}
            <a
              target="_blank"
              href="https://algohire.ai/terms-and-conditions"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline underline-offset-4 transition-colors duration-200"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              target="_blank"
              href="https://algohire.ai/privacy-policy"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline underline-offset-4 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            .
          </p>
        </Card>
      </div>
    </AuthLayout>
  );
}
