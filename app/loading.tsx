import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Spinner className="h-10 w-10 text-primary" />
    </div>
  );
}
