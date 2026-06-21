import type { Article } from "@learning/shared";
import { ArrowRight, CalendarDays, ImageIcon } from "lucide-react";
import Link from "next/link";
import { API_ORIGIN } from "@/lib/api";
import { formatDate } from "@/lib/utils";

function resolveImage(url: string | null) {
  if (!url) return null;
  return url.startsWith("/uploads/") ? `${API_ORIGIN}${url}` : url;
}

export function ArticleCard({ article }: { article: Article }) {
  const cover = resolveImage(article.coverImage);
  return (
    <Link href={`/articles/${article.slug}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/30">
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-cyan-600">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full place-items-center"><ImageIcon size={42} className="text-white/50"/></div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-blue-700">{article.category?.name}</span>
      </div>
      <div className="p-5">
        <h3 className="line-clamp-1 text-lg font-bold text-slate-900 transition group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-300">{article.title}</h3>
        <p className="mt-2 line-clamp-2 min-h-11 text-sm leading-6 text-slate-500 dark:text-slate-400">{article.summary ?? "打开文章继续阅读。"}</p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          <span className="flex items-center gap-1"><CalendarDays size={13}/>{formatDate(article.createdAt)}</span>
          <span className="flex items-center gap-1 font-medium text-blue-600">阅读全文 <ArrowRight size={13}/></span>
        </div>
      </div>
    </Link>
  );
}
