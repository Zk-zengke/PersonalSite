import { CategoryManager } from "@/components/admin/category-manager";

export default function AdminCategoriesPage() {
  return (
    <>
      <div className="mb-8"><p className="text-sm font-semibold text-blue-600">内容结构</p><h1 className="mt-2 text-3xl font-bold text-slate-900">学习模块管理</h1><p className="mt-2 text-slate-500">先创建学习模块，再进入模块添加和查看所属文章。</p></div>
      <CategoryManager />
    </>
  );
}
