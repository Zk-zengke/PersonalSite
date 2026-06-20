import { CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/card";
import { publicApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await publicApi.article(slug).catch(() => null);
  if (!article) notFound();
  return (
    <article className="mx-auto max-w-4xl px-5 py-20">
      <div className="text-sm text-cyan-300">{article.category?.name}</div>
      <h1 className="mt-4 text-balance text-4xl font-black leading-tight md:text-6xl">{article.title}</h1>
      <p className="mt-5 text-lg leading-8 text-slate-400">{article.summary}</p>
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
        <span className="flex items-center gap-2"><CalendarDays size={15} />{formatDate(article.createdAt)}</span>
        {article.tags.map((tag) => <span key={tag}>#{tag}</span>)}
      </div>
      <Card className="mt-10 p-6 md:p-10">
        <div className="prose-learning">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
        </div>
      </Card>
    </article>
  );
}
