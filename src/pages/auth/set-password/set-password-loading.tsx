import { SplitLayout } from "@/components/auth/split-layout";
import { Skeleton } from "@/components/ui/skeleton";

export function SetPasswordSkeletonPage() {
  return (
    <SplitLayout>
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-2 text-center">
          <Skeleton className="h-9 w-48 mx-auto" />
          <Skeleton className="h-5 w-80 mx-auto" />
        </div>

        {/* Form Skeleton */}
        <div className="space-y-5">
          {/* Password Field Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <div className="relative">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Confirm Password Field Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <div className="relative">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Submit Button Skeleton */}
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Divider Skeleton */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Skeleton className="h-px w-full" />
          </div>
          <div className="relative flex justify-center">
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        {/* OAuth Button Skeleton */}
        <Skeleton className="h-12 w-full" />

        {/* Sign In Link Skeleton */}
        <div className="text-center">
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>
      </div>
    </SplitLayout>
  );
}
