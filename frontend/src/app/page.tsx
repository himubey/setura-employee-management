import { redirect } from "next/navigation";

/** The application has no marketing page — go straight to the dashboard. */
export default function HomePage() {
  redirect("/dashboard");
}
