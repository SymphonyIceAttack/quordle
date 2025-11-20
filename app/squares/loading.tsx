import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function SquaresLoading() {
  return (
    <main className="flex h-screen flex-col items-center bg-background text-foreground font-sans overflow-hidden">
      {/* Header Skeleton */}
      <header className="flex w-full items-center justify-between border-b border-border px-4 py-2 sm:px-6 bg-background shadow-sm sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </header>

      {/* Game Area Skeleton */}
      <div className="flex flex-1 flex-col items-center w-full overflow-y-auto p-4">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 items-start justify-center mt-4">
          {/* Left Column: Board */}
          <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto lg:mx-0">
            {/* Progress Bar Skeleton */}
            <div className="w-full flex items-center justify-between px-1">
              <Skeleton className="h-8 w-12 rounded-full" />
              <Skeleton className="h-4 flex-1 mx-4 rounded-full" />
              <Skeleton className="h-6 w-10 rounded-full" />
            </div>

            {/* Word Display Skeleton */}
            <Skeleton className="h-12 w-32 rounded-lg" />

            {/* Grid Skeleton */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/20 rounded-xl border border-border/50 shadow-sm w-full aspect-square max-w-[400px]">
              {Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-full rounded-lg" />
              ))}
            </div>

            {/* Controls Skeleton */}
            <div className="flex items-center gap-3 mt-2">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>

          {/* Right Column: Word List Skeleton */}
          <div className="w-full max-w-md lg:w-80 flex flex-col gap-4 mx-auto lg:mx-0">
            <div className="flex items-center justify-end gap-2 mb-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            <Skeleton className="h-[500px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
