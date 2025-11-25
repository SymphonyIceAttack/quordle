"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref,
  ) => {
    const baseProps = {
      ref,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className,
      ),
      ...props,
    };

    if (decorative) {
      return <div {...baseProps} role="none" />;
    }

    return (
      <div {...baseProps} role="separator" aria-orientation={orientation} />
    );
  },
);
Separator.displayName = "Separator";

export { Separator };
