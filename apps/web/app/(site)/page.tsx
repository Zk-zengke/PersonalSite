import { ArticleCard } from "@/components/article-card";
import { CategoryGrid } from "@/components/home/category-grid";
import { Hero } from "@/components/home/hero";
import { publicApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, articles] = await Promise.all([
    publicApi.categories().catch(() => []),
    publicApi.articles().catch(() => [])
  ]);
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-5 py-16">
        <p className="text-sm font-medium text-cyan-300">KNOWLEDGE MAP</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">学习板块</h2>
        <p className="mb-8 mt-3 text-slate-400">让每一次学习，都落在清晰的坐标上。</p>
        <CategoryGrid categories={categories.slice(0, 6)} />
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16">
        <p className="text-sm font-medium text-violet-300">LATEST NOTES</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">最新文章</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 6).map((article) => <ArticleCard key={article.id} article={article} />)}
        </div>
      </section>
    </>
  );
}
