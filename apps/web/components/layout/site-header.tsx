"use client";

import Link from "next/link";
import { BookOpenCheck, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const links = [
  ["首页", "/"],
  ["学习模块", "/categories"],
  ["知识文章", "/categories"],
  ["生活照片", "/photos"],
  ["随笔记录", "/moments"],
  ["关于我", "/about"]
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-18 max-w-[1480px] items-center justify-between gap-6 px-5">
        <Link href="/" className="flex shrink-0 items-center gap-3 font-semibold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-lg shadow-blue-500/20">
            <BookOpenCheck size={21} />
          </span>
          <span className="leading-tight">
            <strong className="block text-base text-slate-900 dark:text-white">个人学习知识站</strong>
            <small className="font-normal text-slate-400 dark:text-slate-500">记录 · 整理 · 持续成长</small>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map(([label, href]) => (
            <Button key={href} asChild variant="ghost" size="sm">
              <Link href={href}>{label}</Link>
            </Button>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex h-10 w-56 items-center gap-2 rounded-xl bg-slate-100 px-3 text-sm text-slate-400 dark:bg-slate-800 dark:text-slate-500"><Search size={16}/>搜索文章、模块…</div>
          <ThemeToggle />
          <Button asChild size="sm"><Link href="/admin/login">管理后台</Link></Button>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button className="text-slate-700 dark:text-slate-200" onClick={() => setOpen(!open)} aria-label="菜单">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && (
        <nav className="grid gap-2 border-t border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-slate-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-800">
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
