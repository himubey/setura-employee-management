import type { Metadata, Viewport } from "next";

import { QueryProvider } from "@/lib/query/provider";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Setura",
    template: "%s · Setura",
  },
  description: "Employee management, attendance and leave for small teams.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * The QueryProvider sits at the root, not inside `(dashboard)`, because the
 * sign-in form is a mutation too — and one cache for the whole app means the
 * user fetched during login is already there when the dashboard renders.
 *
 * It renders no markup of its own, so this layout stays a Server Component
 * and pages below are free to be server-rendered.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
