import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <>
      <p className="text-sm font-semibold text-blue-600">学习模块</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">新增学习模块</h1>
      <p className="mb-8 mt-2 text-slate-500">模块是文章的上层目录，创建后可以直接进入模块添加文章。</p>
      <CategoryForm />
    </>
  );
}
