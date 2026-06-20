import { ArticleForm } from "@/components/admin/article-form";

export default function NewArticlePage() {
  return (
    <>
      <p className="text-sm text-violet-300">ARTICLE</p>
      <h1 className="mt-2 text-3xl font-bold">新增学习文章</h1>
      <p className="mb-8 mt-2 text-slate-400">使用 Markdown 写下一次完整的思考。</p>
      <ArticleForm />
    </>
  );
}
