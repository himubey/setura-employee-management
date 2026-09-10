import { Spinner } from "@/components/base/spinner/spinner";

export default function DashboardLoading() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-slate-400">
      <Spinner size="lg" label="Loading" />
    </div>
  );
}
