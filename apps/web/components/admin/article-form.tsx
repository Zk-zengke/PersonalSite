"use client";

import type { Category } from "@learning/shared";
import { ImagePlus, Loader2, Send, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_ORIGIN, adminRequest, publicApi, uploadImage } from "@/lib/api";
import { getToken } from "@/lib/auth";

export function ArticleForm({ initialCategoryId = "" }: { initialCategoryId?: string }) {
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<"cover" | "content" | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void publicApi.categories().then((items) => {
      setCategories(items);
      if (!categoryId && items.length === 1) setCategoryId(items[0].id);
    }).catch(() => setMessage("无法加载学习模块"));
  }, [categoryId]);

  async function handleUpload(file: File, mode: "cover" | "content") {
    const token = getToken();
    if (!token) return router.replace("/admin/login");
    setUploading(mode);
    setMessage("");
    try {
      const image = await uploadImage(file, token);
      if (mode === "cover") {
        setCoverImage(image.path);
      } else {
        const textarea = contentRef.current;
        const start = textarea?.selectionStart ?? content.length;
        const end = textarea?.selectionEnd ?? start;
        const markdown = `\n\n![图片说明](${image.url})\n\n`;
        setContent(`${content.slice(0, start)}${markdown}${content.slice(end)}`);
        window.setTimeout(() => textarea?.focus(), 0);
      }
      setMessage(mode === "cover" ? "封面上传成功" : "图片已插入正文");
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "图片上传失败");
    } finally {
      setUploading(null);
    }
  }

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
          content,
          coverImage: coverImage || undefined,
          categoryId,
          tags: String(form.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
          published: form.get("published") === "on"
        })
      });
      router.push(`/admin/categories/${categoryId}`);
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "文章创建失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-5xl p-6 md:p-8">
      <form onSubmit={submit} className="grid gap-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">文章标题<Input name="title" required placeholder="输入清晰的文章标题" /></label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Slug<Input name="slug" required pattern="[a-z0-9-]+" placeholder="linux-file-permissions" /></label>
        </div>
        <label className="grid gap-2 text-sm font-medium text-slate-700">所属学习模块
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} required className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900">
            <option value="">请选择学习模块</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <span className="font-normal text-slate-400">文章创建后会固定归属这个模块，并在该模块页面展示。</span>
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">文章摘要<Textarea name="summary" className="min-h-20" placeholder="用一两句话说明这篇文章能解决什么问题" /></label>

        <div className="grid gap-3">
          <span className="text-sm font-medium text-slate-700">文章封面</span>
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            {coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImage.startsWith("http") ? coverImage : `${API_ORIGIN}${coverImage}`} alt="" className="h-24 w-40 rounded-lg object-cover" />
            ) : <div className="grid h-24 w-40 place-items-center rounded-lg bg-white text-slate-300"><ImagePlus size={32}/></div>}
            <label className="cursor-pointer">
              <span className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-blue-50"><UploadCloud size={17}/>{uploading === "cover" ? "上传中…" : "上传封面"}</span>
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" disabled={Boolean(uploading)} onChange={(event) => event.target.files?.[0] && void handleUpload(event.target.files[0], "cover")} />
            </label>
            <span className="text-xs text-slate-400">支持 JPG、PNG、WebP、GIF，最大 8MB</span>
          </div>
        </div>

        <label className="grid gap-2 text-sm font-medium text-slate-700">标签（英文逗号分隔）<Input name="tags" placeholder="Linux, 权限, 运维" /></label>
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><span className="text-sm font-medium text-slate-700">图文正文</span><p className="mt-1 text-xs text-slate-400">仍支持 Markdown，同时可以直接上传图片插入正文。</p></div>
            <label className="cursor-pointer">
              <span className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-50 px-4 text-sm font-semibold text-blue-700 hover:bg-blue-100">
                {uploading === "content" ? <Loader2 size={17} className="animate-spin"/> : <ImagePlus size={17}/>}
                插入图片
              </span>
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" disabled={Boolean(uploading)} onChange={(event) => event.target.files?.[0] && void handleUpload(event.target.files[0], "content")} />
            </label>
          </div>
          <Textarea ref={contentRef} value={content} onChange={(event) => setContent(event.target.value)} required className="min-h-[420px] font-mono leading-7" placeholder={"# 标题\n\n输入正文，或点击右上角“插入图片”…"} />
        </div>
        <label className="flex items-center gap-3 text-sm text-slate-700"><input type="checkbox" name="published" defaultChecked className="h-4 w-4 accent-blue-600" />创建后立即公开发布</label>
        {message && <p className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</p>}
        <Button type="submit" className="w-fit" disabled={loading || Boolean(uploading) || !categoryId}><Send size={17}/>{loading ? "保存中…" : "发布文章"}</Button>
      </form>
    </Card>
  );
}
