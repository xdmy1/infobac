import { Skeleton } from "@/components/ui/skeleton";

export default function LessonLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <Skeleton className="h-3 w-32" />

      <header className="mt-6 space-y-3">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-4 w-44" />
      </header>

      <div className="mt-8 space-y-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        <Skeleton className="mt-6 h-32 w-full rounded-xl" />

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="mt-10 flex justify-between gap-3">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
