import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <>
      <p className="text-sm text-cyan-300">CATEGORY</p>
      <h1 className="mt-2 text-3xl font-bold">新增学习板块</h1>
      <p className="mb-8 mt-2 text-slate-400">为一组相关知识创建清晰入口。</p>
      <CategoryForm />
    </>
  );
}
