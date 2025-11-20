"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GamePlaceholderProps {
  title: string;
  icon: LucideIcon;
  description: string;
  onBack: () => void;
}

export function GamePlaceholder({
  title,
  icon: Icon,
  description,
  onBack,
}: GamePlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-4 animate-in fade-in duration-500">
      <Card className="w-full max-w-md text-center border-2 border-dashed">
        <CardContent className="pt-12 pb-12 flex flex-col items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-2">
            <Icon className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground text-lg">{description}</p>
          </div>
          <div className="px-6 py-3 bg-secondary/50 rounded-full text-sm font-medium text-secondary-foreground">
            Coming Soon
          </div>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            We're working hard to bring you this new game mode. Stay tuned for
            updates!
          </p>
          <Button onClick={onBack} size="lg" className="mt-4">
            Back to Quordle
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
