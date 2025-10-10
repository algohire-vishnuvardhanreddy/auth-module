import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppErrorBoundary } from "@/pages/errors/error-boundary";
// Mock PostHog provider
// const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
//   // Simulate PostHog initialization
//   console.log("PostHog initialized (mocked)");
//   return <>{children}</>;
// };

// Mock error handler
const handleServerError = (error: Error) => {
  toast.error(error.message || "An error occurred");
};

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        handleServerError(error);
      },
    },
  },
  queryCache: new QueryCache(),
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <AppErrorBoundary>
              <Toaster richColors />
              {/* <RouterProvider router={router} /> */}
              {children}
            </AppErrorBoundary>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
