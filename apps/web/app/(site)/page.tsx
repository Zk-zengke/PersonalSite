import { ArrowRight, CalendarCheck2, Flame, GraduationCap, Layers3 } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { CategoryGrid } from "@/components/home/category-grid";
import { Hero } from "@/components/home/hero";
import { Card } from "@/components/ui/card";
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
      <main className="mx-auto max-w-[1480px] px-5">
        <section className="py-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">学习导航</p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">探索学习模块</h2>
            </div>
            <Link href="/categories" className="flex items-center gap-1 text-sm font-medium text-blue-600">查看全部 <ArrowRight size={15}/></Link>
          </div>
          <CategoryGrid categories={categories.slice(0, 6)} />
        </section>

        <div className="grid gap-7 lg:grid-cols-[1fr_300px]">
          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600">精选内容</p>
                <h2 className="mt-1 text-2xl font-black text-slate-900">最新学习文章</h2>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {articles.slice(0, 6).map((article) => <ArticleCard key={article.id} article={article} />)}
            </div>
          </section>

          <aside className="space-y-5">
            <Card className="p-6">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-500"><Flame/></span><div><h3 className="font-bold">学习数据</h3><p className="text-xs text-slate-400">知识库持续成长中</p></div></div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-blue-50 p-4"><strong className="block text-2xl text-blue-700">{categories.length}</strong><span className="text-xs text-slate-500">学习模块</span></div>
                <div className="rounded-xl bg-emerald-50 p-4"><strong className="block text-2xl text-emerald-700">{articles.length}</strong><span className="text-xs text-slate-500">公开文章</span></div>
              </div>
            </Card>
            <Card className="overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
              <CalendarCheck2 size={32} className="text-blue-200"/>
              <h3 className="mt-4 text-xl font-bold">保持每天进步</h3>
              <p className="mt-2 text-sm leading-6 text-blue-100">把学到的内容写下来，知识才会真正成为自己的东西。</p>
              <Link href="/categories" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700">制定学习路线 <ArrowRight size={15}/></Link>
            </Card>
          </aside>
        </div>

        <section className="mt-12 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-3">
          <div className="flex items-center gap-4"><GraduationCap className="text-blue-600"/><div><strong>系统学习</strong><p className="text-xs text-slate-400">模块化整理知识路径</p></div></div>
          <div className="flex items-center gap-4"><Layers3 className="text-emerald-600"/><div><strong>图文并茂</strong><p className="text-xs text-slate-400">文章支持多图内容</p></div></div>
          <div className="flex items-center gap-4"><CalendarCheck2 className="text-orange-500"/><div><strong>持续复盘</strong><p className="text-xs text-slate-400">记录真实学习过程</p></div></div>
        </section>
      </main>
    </>
  );
}
