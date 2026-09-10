"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/base/button/button";
import { Input } from "@/components/base/input/input";
import { useLogin } from "@/hooks/auth/use-login";
import { loginSchema } from "@/lib/validations/auth";

/**
 * Sign-in form.
 *
 * The frontend's whole role in authentication: collect two fields, hand them
 * to the API client, react to the answer. No token is generated, stored or
 * inspected here — the backend owns the session entirely.
 *
 * Client-side Zod validation is a convenience that saves a round trip on an
 * obviously malformed address; the backend validates independently.
 */
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const login = useLogin();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
    login.mutate(parsed.data);
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

      {login.isError && (
        <p role="alert" className="text-sm text-red-600">
          {/* Deliberately generic: never reveal whether the address exists. */}
          That email and password combination is not recognised.
        </p>
      )}

      <Button type="submit" loading={login.isPending} fullWidth>
        {login.isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
