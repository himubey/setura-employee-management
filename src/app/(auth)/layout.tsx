import { Wordmark } from "@/components/layout/wordmark";

/** Centred, chrome-free shell for sign-in and password recovery. */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Wordmark />
        </div>
        {children}
      </div>
    </div>
  );
}
