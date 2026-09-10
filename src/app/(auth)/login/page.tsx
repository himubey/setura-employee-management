import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardBody, CardHeader } from "@/components/base/card/card";

import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Card>
      <CardHeader
        title="Sign in"
        description="Use the work email your administrator set up."
      />
      <CardBody className="space-y-4">
        <LoginForm />
        <p className="text-center text-xs text-slate-500">
          <Link
            href="/forgot-password"
            className="font-medium text-brand-600 hover:underline"
          >
            Forgotten your password?
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}
