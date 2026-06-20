import type { Article } from "@learning/shared";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <Card className="group h-full p-6 transition hover:-translate-y-1 hover:border-violet-400/30">
        <div className="mb-4 flex items-center justify-between text-xs">
          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-violet-300">{article.category?.name}</span>
          <span className="flex items-center gap-1 text-slate-500"><CalendarDays size={13} />{formatDate(article.createdAt)}</span>
        </div>
        <h3 className="text-xl font-semibold transition group-hover:text-cyan-300">{article.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">{article.summary ?? "打开文章继续阅读。"}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {article.tags.map((tag) => <span key={tag} className="text-xs text-slate-500">#{tag}</span>)}
        </div>
      </Card>
    </Link>
  );
}
