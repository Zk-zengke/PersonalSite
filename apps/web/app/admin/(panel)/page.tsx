import { DashboardContent } from "@/components/admin/dashboard-content";

export default function DashboardPage() {
  return (
    <>
      <p className="text-sm text-cyan-300">OVERVIEW</p>
      <h1 className="mt-2 text-3xl font-bold">Dashboard</h1>
      <p className="mb-8 mt-2 text-slate-400">今天也给知识花园浇点水。</p>
      <DashboardContent />
    </>
  );
}
