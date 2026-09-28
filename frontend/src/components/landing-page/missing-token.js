import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export function MissingToken() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Link expired</CardTitle>
          <CardDescription>
            This reset link is invalid or has expired. Please request a new one.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild className="w-full bg-green-800">
            <Link href="/forgot-password">Request a new link</Link>
          </Button>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:underline"
          >
            Back to homepage
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
