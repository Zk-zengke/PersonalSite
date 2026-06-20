"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, LayoutDashboard, LogOut, PlusCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { clearToken, getToken } from "@/lib/auth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "数据概览", icon: LayoutDashboard },
  { href: "/admin/categories/new", label: "新增板块", icon: PlusCircle },
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

  if (!ready) return <div className="grid min-h-screen place-items-center text-slate-400">正在验证登录状态…</div>;

  return (
    <div className="min-h-screen bg-slate-950 md:grid md:grid-cols-[250px_1fr]">
      <aside className="border-b border-white/10 bg-slate-950/80 p-5 md:min-h-screen md:border-b-0 md:border-r">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Sparkles className="text-cyan-300" /> Learning Admin
        </Link>
        <nav className="mt-8 grid gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white", pathname === href && "bg-gradient-to-r from-violet-500/20 to-cyan-500/10 text-cyan-200")}>
              <Icon size={18} />{label}
            </Link>
          ))}
        </nav>
        <Button
          variant="ghost"
          className="mt-8 w-full justify-start gap-3 text-slate-400"
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
