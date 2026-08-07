import { Spinner } from "@/components/ui/spinner.js";
export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="size-40 text-green-300 animate-spin" />
    </div>
  );
}
