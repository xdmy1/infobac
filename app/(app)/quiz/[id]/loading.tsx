import { Skeleton } from "@/components/ui/skeleton";

export default function QuizLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <Skeleton className="h-20 w-full rounded-2xl" />

      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="space-y-4 rounded-2xl border border-border bg-card p-5 md:p-6"
        >
          <Skeleton className="h-5 w-3/4" />
          {[0, 1, 2, 3].map((j) => (
            <Skeleton key={j} className="h-11 w-full rounded-lg" />
          ))}
        </div>
      ))}

      <div className="flex justify-between">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-11 w-44" />
      </div>
    </div>
  );
}
