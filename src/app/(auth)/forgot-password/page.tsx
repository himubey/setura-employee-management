import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardBody, CardHeader } from "@/components/base/card/card";

export const metadata: Metadata = { title: "Forgotten password" };

/**
 * Placeholder. Password reset needs transactional email, which is explicitly
 * out of scope for the initial setup (brief section 21). The route exists so
 * the link from the sign-in page is not broken.
 */
export default function ForgotPasswordPage() {
  return (
    <Card>
      <CardHeader
        title="Forgotten password"
        description="Self-service reset is not available yet."
      />
      <CardBody className="space-y-4 text-sm text-slate-600">
        <p>
          Email delivery has not been set up for Setura yet. Ask your HR
          administrator to reset your password for you.
        </p>
        <p>
          <Link
            href="/login"
            className="font-medium text-brand-600 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}
