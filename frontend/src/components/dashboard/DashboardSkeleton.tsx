// ==========================================
// Reusable Skeleton Loaders for Dashboard Pages
// ==========================================
import { Skeleton } from "@/components/ui/skeleton";

/** 4 stat cards skeleton */
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="w-14 h-6 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

/** Chart area skeleton */
export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="w-full rounded-xl" style={{ height }} />
    </div>
  );
}

/** Single card skeleton */
export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

/** Activity list skeleton */
export function ActivitySkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <Skeleton className="h-5 w-28 mb-2" />
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 items-start">
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Review card skeleton */
export function ReviewCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-full ml-[52px]" />
      <Skeleton className="h-4 w-3/4 ml-[52px]" />
      <div className="ml-[52px] rounded-xl border border-border/20 p-4 space-y-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

/** Integration card skeleton */
export function IntegrationCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <Skeleton className="w-14 h-14 rounded-xl" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-8 w-full rounded-lg" />
    </div>
  );
}

/** Full-page loading state */
export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <StatsSkeleton />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <ActivitySkeleton />
      </div>
    </div>
  );
}
