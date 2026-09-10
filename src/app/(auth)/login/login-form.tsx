"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/base/button/button";
import { Input } from "@/components/base/input/input";
import { signIn } from "@/lib/auth/auth-client";
import { loginSchema } from "@/lib/validations/auth";

/**
 * Minimal sign-in form — enough to verify the Better Auth setup end to end,
 * and no more (brief section 12).
 *
 * Validation runs through the same Zod schema the server uses, so the rules
 * are defined once.
 */
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    const { error } = await signIn.email({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    setSubmitting(false);

    if (error) {
      // Deliberately generic: do not reveal whether the address exists.
      setFormError("That email and password combination is not recognised.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        label="Work email"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={fieldErrors.email}
      />

      <Input
        label="Password"
        type="password"
        name="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={fieldErrors.password}
      />

      {formError && (
        <p role="alert" className="text-sm text-red-600">
          {formError}
        </p>
      )}

      <Button type="submit" loading={submitting} fullWidth>
        {submitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
