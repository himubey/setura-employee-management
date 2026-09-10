import { Card, CardBody, CardHeader } from "@/components/base/card/card";

/**
 * Placeholder for a navigated-to section that has no screen yet.
 *
 * These routes exist because the sidebar links to them: with Next.js typed
 * routes a link to a non-existent route is a build error, and a 404 behind a
 * nav item is a worse experience than an honest "not built yet".
 */
export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">
        {title}
      </h1>
      <Card className="max-w-lg">
        <CardHeader title="Not built yet" />
        <CardBody>
          <p className="text-sm text-slate-600">{description}</p>
        </CardBody>
      </Card>
    </div>
  );
}
