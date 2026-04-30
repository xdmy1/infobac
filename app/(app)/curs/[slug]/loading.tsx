import { Skeleton } from "@/components/ui/skeleton";

export default function CourseLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <Skeleton className="h-3 w-20" />

      <header className="mt-6 space-y-3">
        <Skeleton className="size-12 rounded-xl" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </header>

      <Skeleton className="mt-8 h-20 w-full rounded-2xl" />

      <div className="mt-10 space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="overflow-hidden rounded-2xl border border-border">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="h-16 w-full rounded-none border-b border-border last:border-b-0"
            />
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
