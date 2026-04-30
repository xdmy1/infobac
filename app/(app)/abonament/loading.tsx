import { Skeleton } from "@/components/ui/skeleton";

export default function AbonamentLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-64" />
      </div>

      <Skeleton className="h-28 w-full rounded-2xl" />

      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
