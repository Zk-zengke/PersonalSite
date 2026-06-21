import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { publicApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CategoryArticlesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await publicApi.category(slug).catch(() => null);
  if (!category) notFound();
  // Use the immutable UUID for article filtering. This avoids double-encoding
  // edge cases when a category uses a Chinese slug in a dynamic route.
  const articles = await publicApi.articles(category.id).catch(() => []);
  return (
    <section className="mx-auto min-h-[70vh] max-w-[1480px] px-5 py-14">
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8 dark:border-blue-900/50 dark:from-blue-950/40 dark:to-slate-900">
        <p className="text-sm font-semibold text-blue-600">学习模块</p>
        <h1 className="mt-2 text-4xl font-black text-slate-900">{category.name}</h1>
        <p className="mt-3 max-w-2xl text-slate-500">{category.description}</p>
        <p className="mt-5 text-sm font-medium text-blue-600">共 {articles.length} 篇公开文章</p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
      </div>
      {!articles.length && <p className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900">这个模块还没有已发布文章。</p>}
    </section>
  );
}
