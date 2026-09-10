import { Card, CardBody, CardHeader } from "@/components/base/card/card";

/**
 * Rendered instead of the dashboard when required environment variables are
 * missing, so a fresh clone starts and explains itself rather than crashing.
 */
export function SetupRequired({ missing }: { missing: string[] }) {
  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader
          title="Setura needs configuring"
          description="The application started, but it has nothing to connect to yet."
        />
        <CardBody className="space-y-4 text-sm text-slate-600">
          <div>
            <p className="mb-2 font-medium text-slate-900">
              Missing environment variables
            </p>
            <ul className="space-y-1">
              {missing.map((name) => (
                <li
                  key={name}
                  className="rounded-sm bg-slate-50 px-2 py-1 font-mono text-xs text-slate-700"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <ol className="list-decimal space-y-1.5 pl-5">
            <li>
              Copy <code className="font-mono text-xs">.env.example</code> to{" "}
              <code className="font-mono text-xs">.env</code>.
            </li>
            <li>
              Paste your Neon pooled connection string into{" "}
              <code className="font-mono text-xs">DATABASE_URL</code>.
            </li>
            <li>
              Generate a secret:{" "}
              <code className="font-mono text-xs">openssl rand -base64 32</code>
            </li>
            <li>
              Create the tables:{" "}
              <code className="font-mono text-xs">npm run db:push</code>
            </li>
            <li>
              Optionally load sample data:{" "}
              <code className="font-mono text-xs">npm run db:seed</code>
            </li>
          </ol>
        </CardBody>
      </Card>
    </main>
  );
}
