"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";

import { useCurrentUser } from "@/hooks/auth/use-current-user";

/**
 * "Good day, Meera" and today's date.
 *
 * The date is rendered in an effect rather than during the first paint on
 * purpose: the server and the browser can sit in different timezones, and
 * formatting `new Date()` in both would produce a hydration mismatch. An
 * empty first frame for one tick is cheaper than a React error.
 */
export function DashboardGreeting() {
  const { data: user } = useCurrentUser();
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    setToday(format(new Date(), "EEEE, d MMMM yyyy"));
  }, []);

  const firstName = user ? (user.name.split(" ")[0] ?? user.name) : null;

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">
        {firstName ? `Good day, ${firstName}` : "Dashboard"}
      </h1>
      {/* Reserves the line's height so the card grid below does not jump. */}
      <p className="mt-0.5 min-h-5 text-sm text-slate-500">{today ?? ""}</p>
    </div>
  );
}
