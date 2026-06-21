import { CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { publicApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await publicApi.article(slug).catch(() => null);
  if (!article) notFound();
  return (
    <article className="mx-auto max-w-5xl px-5 py-14">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
      <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">{article.category?.name}</div>
      <h1 className="mt-5 text-balance text-4xl font-black leading-tight text-slate-900 md:text-5xl">{article.title}</h1>
      <p className="mt-5 text-lg leading-8 text-slate-500">{article.summary}</p>
      <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-slate-100 pb-8 text-sm text-slate-400">
        <span className="flex items-center gap-2"><CalendarDays size={15} />{formatDate(article.createdAt)}</span>
        {article.tags.map((tag) => <span key={tag}>#{tag}</span>)}
      </div>
      <div className="mt-3 p-1 md:p-5">
        <div className="prose-learning">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
        </div>
      </div>
      </div>
    </article>
  );
}
