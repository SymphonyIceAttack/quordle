"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const progressValue = value || 0;

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-gradient-to-r from-primary via-primary to-primary h-full w-full flex-1 transition-all duration-700 ease-out relative overflow-hidden"
        style={{ transform: `translateX(-${100 - progressValue}%)` }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  );
}

export { Progress };
