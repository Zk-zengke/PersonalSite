"use client";

import type { Category } from "@learning/shared";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Code2,
  Cpu,
  Database,
  Languages,
  Network
} from "lucide-react";
import Link from "next/link";

const styles = [
  { icon: Code2, color: "text-violet-600", bg: "bg-violet-50", border: "hover:border-violet-200" },
  { icon: Network, color: "text-blue-600", bg: "bg-blue-50", border: "hover:border-blue-200" },
  { icon: Bot, color: "text-emerald-600", bg: "bg-emerald-50", border: "hover:border-emerald-200" },
  { icon: Cpu, color: "text-orange-600", bg: "bg-orange-50", border: "hover:border-orange-200" },
  { icon: Database, color: "text-rose-600", bg: "bg-rose-50", border: "hover:border-rose-200" },
  { icon: Languages, color: "text-cyan-600", bg: "bg-cyan-50", border: "hover:border-cyan-200" }
];

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (!categories.length) {
    return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">还没有学习模块，请到后台创建。</div>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {categories.map((category, index) => {
        const style = styles[index % styles.length];
        const Icon = style.icon;
        return (
          <motion.div key={category.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }}>
            <Link href={`/categories/${category.slug}`} className={`group block h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800 ${style.border}`}>
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${style.bg} ${style.color}`}><Icon size={25}/></span>
              <h3 className="mt-4 font-bold text-slate-900 dark:text-slate-100">{category.name}</h3>
              <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500 dark:text-slate-400">{category.description ?? "持续整理中的学习内容"}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className={style.color}>{category._count?.articles ?? 0} 篇文章</span>
                <ArrowRight size={14} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500"/>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
