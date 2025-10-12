import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function AuthCard({
  title,
  description,
  children,
  icon,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          {icon && <div className="flex justify-center">{icon}</div>}
          <CardTitle className="text-center text-2xl font-semibold">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-center">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">{children}</CardContent>
      </Card>
    </div>
  );
}
