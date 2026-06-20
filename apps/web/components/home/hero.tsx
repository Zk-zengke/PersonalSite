"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Orbit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 py-24 md:py-36">
      <div className="absolute left-1/2 top-10 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/25 blur-3xl" />
      <div className="absolute right-0 top-1/3 -z-10 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-5xl text-center"
      >
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-200">
          <Orbit size={16} /> 我的数字学习宇宙
        </div>
        <h1 className="text-balance text-5xl font-black tracking-tight md:text-7xl">
          把零散知识，构建成
          <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
            可持续生长的系统
          </span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400">
          记录编程、Linux、前后端、数据库与电子技术的探索过程，也收藏生活里值得记住的微小瞬间。
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/categories">开始探索 <ArrowRight size={18} /></Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about"><Code2 size={18} /> 关于本站</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
