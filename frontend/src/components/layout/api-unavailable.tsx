import { Card, CardBody, CardHeader } from "@/components/base/card/card";
import { API_BASE_URL } from "@/lib/api/client";

/**
 * Shown when the frontend is running but the FastAPI backend cannot be
 * reached, so a fresh clone explains itself instead of rendering an empty
 * shell or a stack trace.
 */
export function ApiUnavailable() {
  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader
          title="Cannot reach the API"
          description="The interface loaded, but the backend did not answer."
        />
        <CardBody className="space-y-4 text-sm text-slate-600">
          <p>
            Setura expects the FastAPI service at{" "}
            <code className="rounded-sm bg-slate-50 px-1.5 py-0.5 font-mono text-xs text-slate-700">
              {API_BASE_URL}
            </code>
            .
          </p>

          <ol className="list-decimal space-y-1.5 pl-5">
            <li>
              Start it:{" "}
              <code className="font-mono text-xs">
                cd backend &amp;&amp; uvicorn app.main:app --reload
              </code>
            </li>
            <li>
              Confirm it is healthy:{" "}
              <code className="font-mono text-xs">curl {API_BASE_URL}/health</code>
            </li>
            <li>
              Check{" "}
              <code className="font-mono text-xs">NEXT_PUBLIC_API_URL</code> in{" "}
              <code className="font-mono text-xs">frontend/.env.local</code>.
            </li>
            <li>
              Confirm this origin is listed in the backend&rsquo;s{" "}
              <code className="font-mono text-xs">CORS_ORIGINS</code>.
            </li>
          </ol>

          <p className="text-xs text-slate-500">
            To work on the interface without a backend, set{" "}
            <code className="font-mono">NEXT_PUBLIC_USE_MOCK_API=true</code>.
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
