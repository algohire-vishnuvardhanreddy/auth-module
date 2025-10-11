import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  steps?: Array<{ label: string; status: "complete" | "active" | "pending" }>;
}

export function LoadingState({ message, steps }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
      </div>

      {message && (
        <p className="text-center text-muted-foreground">{message}</p>
      )}

      {steps && steps.length > 0 && (
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  step.status === "complete"
                    ? "bg-primary text-primary-foreground"
                    : step.status === "active"
                    ? "bg-primary/20 text-primary animate-pulse"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.status === "complete" ? "✓" : index + 1}
              </div>
              <span
                className={`text-sm ${
                  step.status === "pending"
                    ? "text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
