import { CategoryGrid } from "@/components/home/category-grid";
import { publicApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await publicApi.categories().catch(() => []);
  return (
    <section className="mx-auto min-h-[70vh] max-w-[1480px] px-5 py-14">
      <div className="mb-10 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-10 text-white">
        <p className="text-sm text-blue-200">LEARNING MODULES</p>
        <h1 className="mt-2 text-4xl font-black">学习模块</h1>
        <p className="mt-3 max-w-2xl text-blue-100">每个模块对应一个明确学习方向，文章统一归属模块，形成结构化知识路径。</p>
      </div>
      <CategoryGrid categories={categories} />
    </section>
  );
}
