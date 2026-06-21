import { ArticleForm } from "@/components/admin/article-form";

export default async function NewArticlePage({ searchParams }: { searchParams: Promise<{ categoryId?: string }> }) {
  const { categoryId = "" } = await searchParams;
  return (
    <>
      <p className="text-sm font-semibold text-blue-600">文章管理</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">新增学习文章</h1>
      <p className="mb-8 mt-2 text-slate-500">选择所属模块，使用文字与图片共同整理知识。</p>
      <ArticleForm initialCategoryId={categoryId} />
    </>
  );
}
