"use client";

import type { Category } from "@learning/shared";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminRequest, publicApi } from "@/lib/api";
import { getToken } from "@/lib/auth";

export function ArticleForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void publicApi.categories().then(setCategories).catch(() => setMessage("无法加载学习板块"));
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getToken();
    if (!token) return router.replace("/admin/login");
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      await adminRequest("/articles", token, {
        method: "POST",
        body: JSON.stringify({
          title: form.get("title"),
          slug: form.get("slug"),
          summary: form.get("summary") || undefined,
          content: form.get("content"),
          categoryId: form.get("categoryId"),
          tags: String(form.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
          published: form.get("published") === "on"
        })
      });
      setMessage("文章创建成功");
      event.currentTarget.reset();
      router.refresh();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "创建失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-4xl p-6 md:p-8">
      <form onSubmit={submit} className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm">文章标题<Input name="title" required /></label>
          <label className="grid gap-2 text-sm">Slug<Input name="slug" required pattern="[a-z0-9-]+" /></label>
        </div>
        <label className="grid gap-2 text-sm">文章摘要<Textarea name="summary" className="min-h-20" /></label>
        <label className="grid gap-2 text-sm">所属板块
          <select name="categoryId" required className="h-11 rounded-xl border border-white/10 bg-slate-900 px-3 text-sm outline-none focus:border-cyan-400">
            <option value="">请选择</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm">标签（英文逗号分隔）<Input name="tags" placeholder="NestJS, TypeScript, API" /></label>
        <label className="grid gap-2 text-sm">Markdown 正文<Textarea name="content" required className="min-h-80 font-mono leading-6" placeholder="# 标题&#10;&#10;开始写作…" /></label>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="published" className="h-4 w-4 accent-cyan-400" />立即发布</label>
        {message && <p className="text-sm text-cyan-300">{message}</p>}
        <Button type="submit" className="w-fit" disabled={loading}>{loading ? "保存中…" : "创建文章"}</Button>
      </form>
    </Card>
  );
}
