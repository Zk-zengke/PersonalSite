"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, FolderKanban, LayoutDashboard, LogOut, PlusCircle, School } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { clearToken, getToken } from "@/lib/auth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "数据概览", icon: LayoutDashboard },
  { href: "/admin/categories", label: "学习模块", icon: FolderKanban },
  { href: "/admin/categories/new", label: "新增模块", icon: PlusCircle },
  { href: "/admin/articles/new", label: "新增文章", icon: BookOpen }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    const timer = window.setTimeout(() => setReady(true), 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  if (!ready) return <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-400">正在验证登录状态…</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 md:grid md:grid-cols-[250px_1fr]">
      <aside className="border-b border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 md:min-h-screen md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3 font-semibold text-slate-900">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white"><School size={20}/></span>
          <span><strong className="block">知识站后台</strong><small className="font-normal text-slate-400">Content Console</small></span>
        </Link>
        <ThemeToggle />
        </div>
        <nav className="mt-8 grid gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 transition hover:bg-blue-50 hover:text-blue-700", pathname === href && "bg-blue-50 font-semibold text-blue-700")}>
              <Icon size={18} />{label}
            </Link>
          ))}
        </nav>
        <Button
          variant="ghost"
          className="mt-8 w-full justify-start gap-3 text-slate-500"
          onClick={() => {
            clearToken();
            router.replace("/admin/login");
          }}
        >
          <LogOut size={18} />退出登录
        </Button>
      </aside>
      <main className="min-w-0 p-5 md:p-10">{children}</main>
    </div>
  );
}
