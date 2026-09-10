/**
 * The Setura mark. Its own module because both the (server) sidebar and the
 * (client) mobile drawer render it — importing it from sidebar.tsx would drag
 * the whole sidebar into the client bundle.
 */
export function Wordmark() {
  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="grid size-7 place-items-center rounded-md bg-brand-600 text-xs font-bold text-white"
      >
        S
      </span>
      <span className="text-sm font-semibold tracking-tight text-slate-900">
        Setura
      </span>
    </span>
  );
}
