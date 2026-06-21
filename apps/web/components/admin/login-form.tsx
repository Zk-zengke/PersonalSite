"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/lib/api";
import { setToken } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password")
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? "登录失败");
      setToken(payload.data.accessToken);
      router.replace("/admin");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "登录失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md p-7 md:p-9">
      <p className="text-sm font-semibold text-blue-600">ADMIN CONSOLE</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">欢迎回来</h1>
      <p className="mt-2 text-sm text-slate-500">登录后管理学习模块、文章和图片。</p>
      <form onSubmit={submit} className="mt-8 grid gap-5">
        <label className="grid gap-2 text-sm text-slate-700">账号<Input name="username" required autoComplete="username" placeholder="admin" /></label>
        <label className="grid gap-2 text-sm text-slate-700">密码<Input name="password" type="password" required autoComplete="current-password" /></label>
        {error && <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
        <Button type="submit" disabled={loading}>{loading ? "登录中…" : "登录"}</Button>
      </form>
    </Card>
  );
}
