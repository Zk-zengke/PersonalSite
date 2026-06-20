import { CategoryGrid } from "@/components/home/category-grid";
import { publicApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await publicApi.categories().catch(() => []);
  return (
    <section className="mx-auto min-h-[70vh] max-w-7xl px-5 py-20">
      <p className="text-sm text-cyan-300">EXPLORE</p>
      <h1 className="mt-2 text-4xl font-bold">学习板块</h1>
      <p className="mb-10 mt-3 max-w-2xl text-slate-400">从语言、工具到工程实践，把知识整理成可反复访问的路径。</p>
      <CategoryGrid categories={categories} />
    </section>
  );
}
