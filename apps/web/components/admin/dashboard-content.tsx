"use client";

import type { DashboardStats } from "@learning/shared";
import { BookOpen, Camera, FolderOpen, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { adminRequest } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

const cards = [
  ["学习模块", "categories", FolderOpen, "from-blue-600 to-blue-400"],
  ["学习文章", "articles", BookOpen, "from-emerald-500 to-teal-400"],
  ["生活照片", "photos", Camera, "from-fuchsia-500 to-pink-400"],
  ["随笔吐槽", "moments", MessageCircle, "from-amber-400 to-orange-400"]
] as const;

export function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (token) void adminRequest<DashboardStats>("/dashboard/stats", token).then(setStats).catch((cause) => setError(cause.message));
  }, []);

  if (error) return <p className="text-rose-300">{error}</p>;
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, key, Icon, gradient]) => (
          <Card key={key} className="p-6">
            <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-slate-950`}><Icon size={20} /></div>
            <p className="mt-5 text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{stats?.[key] ?? "—"}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-7 overflow-hidden">
        <div className="border-b border-slate-100 p-6"><h2 className="text-lg font-semibold text-slate-900">最近发布</h2></div>
        <div className="divide-y divide-slate-100">
          {stats?.recentArticles.map((article) => (
            <div key={article.id} className="flex items-center justify-between gap-4 p-5">
              <div><p className="font-medium text-slate-800">{article.title}</p><p className="mt-1 text-xs text-slate-500">{article.category?.name}</p></div>
              <time className="text-xs text-slate-500">{formatDate(article.createdAt)}</time>
            </div>
          ))}
          {stats && !stats.recentArticles.length && <p className="p-6 text-sm text-slate-500">还没有文章。</p>}
        </div>
      </Card>
    </>
  );
}
