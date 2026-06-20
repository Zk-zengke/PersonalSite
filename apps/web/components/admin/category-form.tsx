"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminRequest } from "@/lib/api";
import { getToken } from "@/lib/auth";

export function CategoryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getToken();
    if (!token) return router.replace("/admin/login");
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      await adminRequest("/categories", token, {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          slug: form.get("slug"),
          description: form.get("description") || undefined,
          coverImage: form.get("coverImage") || undefined,
          sortOrder: Number(form.get("sortOrder") || 0)
        })
      });
      setMessage("学习板块创建成功");
      event.currentTarget.reset();
      router.refresh();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "创建失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-3xl p-6 md:p-8">
      <form onSubmit={submit} className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm">板块名称<Input name="name" required placeholder="Linux 学习" /></label>
          <label className="grid gap-2 text-sm">Slug<Input name="slug" required pattern="[a-z0-9-]+" placeholder="linux-learning" /></label>
        </div>
        <label className="grid gap-2 text-sm">板块简介<Textarea name="description" placeholder="这个板块主要记录…" /></label>
        <label className="grid gap-2 text-sm">封面图片 URL（可选）<Input name="coverImage" type="url" /></label>
        <label className="grid max-w-40 gap-2 text-sm">排序<Input name="sortOrder" type="number" min="0" defaultValue="0" /></label>
        {message && <p className="text-sm text-cyan-300">{message}</p>}
        <Button type="submit" className="w-fit" disabled={loading}>{loading ? "保存中…" : "创建板块"}</Button>
      </form>
    </Card>
  );
}
