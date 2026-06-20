import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { publicApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CategoryArticlesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, articles] = await Promise.all([
    publicApi.category(slug).catch(() => null),
    publicApi.articles(slug).catch(() => [])
  ]);
  if (!category) notFound();
  return (
    <section className="mx-auto min-h-[70vh] max-w-7xl px-5 py-20">
      <p className="text-sm text-violet-300">CATEGORY</p>
      <h1 className="mt-2 text-4xl font-bold">{category.name}</h1>
      <p className="mt-3 max-w-2xl text-slate-400">{category.description}</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
      </div>
      {!articles.length && <p className="mt-12 text-slate-500">这个板块还没有已发布文章。</p>}
    </section>
  );
}
