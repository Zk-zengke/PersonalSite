import { DashboardContent } from "@/components/admin/dashboard-content";

export default function DashboardPage() {
  return (
    <>
      <p className="text-sm font-semibold text-blue-600">数据概览</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">管理控制台</h1>
      <p className="mb-8 mt-2 text-slate-500">从模块开始组织内容，让每篇文章都有清晰归属。</p>
      <DashboardContent />
    </>
  );
}
