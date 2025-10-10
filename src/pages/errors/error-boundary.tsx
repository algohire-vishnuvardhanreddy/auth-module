import type React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, Home, RotateCcw, Bug } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const navigate = useNavigate();

  useEffect(() => {
    console.error("Uncaught error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <CardTitle className="text-xl font-bold text-red-500">
              Something went wrong
            </CardTitle>
          </div>
          <CardDescription>
            We've encountered an unexpected error. Our team has been notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-red-100 bg-red-50 p-4">
            <p className="break-words font-mono text-sm text-red-800">
              {error.message}
            </p>
            {error.stack && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-red-600">
                  View error details
                </summary>
                <pre className="mt-2 max-h-40 overflow-auto rounded bg-red-50 p-2 font-mono text-xs text-red-800">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Home
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => window.location.reload()}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reload Page
          </Button>
          <Button className="w-full sm:w-auto" onClick={resetErrorBoundary}>
            <Bug className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

export function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("Error caught by error boundary:", error);
        console.error("Component stack:", info.componentStack);
      }}
      onReset={() => {}}
    >
      {children}
    </ErrorBoundary>
  );
}
