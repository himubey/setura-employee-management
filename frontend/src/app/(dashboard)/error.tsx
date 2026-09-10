"use client";

import { useEffect } from "react";

import { Button } from "@/components/base/button/button";
import { Card, CardBody, CardHeader } from "@/components/base/card/card";

/**
 * Error boundary for the authenticated area.
 *
 * Next.js strips the real message in production, which is what we want — an
 * unexpected API failure must never surface an internal path or a backend
 * stack trace to the browser.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Card className="w-full max-w-md">
        <CardHeader
          title="Something went wrong"
          description="This screen could not be loaded."
        />
        <CardBody className="space-y-4">
          <p className="text-sm text-slate-600">
            Try again. If it keeps happening, pass this reference to whoever
            maintains Setura.
          </p>
          {error.digest && (
            <p className="rounded-sm bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600">
              {error.digest}
            </p>
          )}
          <Button onClick={reset}>Try again</Button>
        </CardBody>
      </Card>
    </div>
  );
}
