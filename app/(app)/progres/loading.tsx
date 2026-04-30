import { Skeleton } from "@/components/ui/skeleton";

export default function ProgresLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-72" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>

      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
