"use client";

import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  ["学习板块", "/categories"],
  ["生活照片", "/photos"],
  ["随笔", "/moments"],
  ["关于我", "/about"]
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-slate-950">
            <Sparkles size={18} />
          </span>
          <span>Learning<span className="text-cyan-300">.Space</span></span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(([label, href]) => (
            <Button key={href} asChild variant="ghost" size="sm">
              <Link href={href}>{label}</Link>
            </Button>
          ))}
          <Button asChild size="sm" className="ml-2">
            <Link href="/admin/login">管理后台</Link>
          </Button>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="菜单">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="grid gap-2 border-t border-white/5 p-4 md:hidden">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-slate-300 hover:bg-white/5">
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
