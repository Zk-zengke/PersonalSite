"use client";

import type { Category } from "@learning/shared";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (!categories.length) {
    return <Card className="p-8 text-center text-slate-400">还没有学习板块，登录后台创建第一个吧。</Card>;
  }
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => (
        <motion.div key={category.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
          <Link href={`/categories/${category.slug}`}>
            <Card className="group h-full p-6 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-cyan-500/10">
              <div className="mb-5 flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/25 to-cyan-400/20 text-cyan-300">
                  <BookOpen />
                </span>
                <ArrowUpRight className="text-slate-600 transition group-hover:text-cyan-300" />
              </div>
              <h3 className="text-xl font-semibold">{category.name}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{category.description ?? "一块正在生长的知识领地。"}</p>
              <p className="mt-5 text-xs text-slate-500">{category._count?.articles ?? 0} 篇文章</p>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
