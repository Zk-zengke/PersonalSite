"use client";

import type { Article, Category } from "@learning/shared";
import { BookOpen, ChevronRight, FolderPlus, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { adminRequest, publicApi } from "@/lib/api";
import { getToken } from "@/lib/auth";

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => { void publicApi.categories().then(setCategories); }, []);
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <Link key={category.id} href={`/admin/categories/${category.id}`}>
          <Card className="group h-full p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
            <div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600"><BookOpen/></span><ChevronRight className="text-slate-300 group-hover:text-blue-600"/></div>
            <h2 className="mt-5 text-lg font-bold text-slate-900">{category.name}</h2>
            <p className="mt-2 line-clamp-2 min-h-10 text-sm text-slate-500">{category.description || "暂无简介"}</p>
            <p className="mt-5 text-sm font-medium text-blue-600">{category._count?.articles ?? 0} 篇文章</p>
          </Card>
        </Link>
      ))}
      <Link href="/admin/categories/new">
        <div className="grid min-h-56 place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center transition hover:border-blue-300 hover:bg-blue-50">
          <div><FolderPlus className="mx-auto text-blue-500"/><p className="mt-3 font-semibold text-slate-700">新建学习模块</p><p className="mt-1 text-xs text-slate-400">然后在模块中添加文章</p></div>
        </div>
      </Link>
    </div>
  );
}

export function CategoryArticleManager({ categoryId }: { categoryId: string }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = getToken();
    void publicApi.category(categoryId).then(setCategory);
    if (token) void adminRequest<Article[]>(`/articles/admin/all?category=${categoryId}`, token).then(setArticles).catch((error) => setMessage(error.message));
  }, [categoryId]);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-semibold text-blue-600">学习模块</p><h1 className="mt-2 text-3xl font-bold text-slate-900">{category?.name ?? "加载中…"}</h1><p className="mt-2 text-slate-500">{category?.description}</p></div>
        <Link href={`/admin/articles/new?categoryId=${categoryId}`} className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"><Plus size={17}/>在此模块添加文章</Link>
      </div>
      {message && <p className="mt-6 text-rose-600">{message}</p>}
      <Card className="mt-8 overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4 font-semibold text-slate-900">模块文章</div>
        <div className="divide-y divide-slate-100">
          {articles.map((article) => (
            <div key={article.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
              <div><h3 className="font-semibold text-slate-800">{article.title}</h3><p className="mt-1 text-xs text-slate-400">{article.published ? "已发布" : "草稿"} · /{article.slug}</p></div>
              <Link href={`/articles/${article.slug}`} className="text-sm font-medium text-blue-600">查看文章</Link>
            </div>
          ))}
          {!articles.length && <div className="p-10 text-center text-sm text-slate-400">这个模块还没有文章，点击右上角开始添加。</div>}
        </div>
      </Card>
    </>
  );
}
