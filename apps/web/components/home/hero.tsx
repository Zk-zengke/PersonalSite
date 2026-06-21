"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CircleCheck, Lightbulb, Rocket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto max-w-[1480px] px-5 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative min-h-[360px] overflow-hidden rounded-3xl bg-[#061b55] px-8 py-12 shadow-xl shadow-blue-950/15 md:px-16 md:py-16"
      >
        <Image
          src="/learning-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061b55] via-[#061b55]/90 to-[#061b55]/10" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-white/10 px-4 py-2 text-sm text-blue-100 backdrop-blur">
            <Lightbulb size={16} /> 建立属于自己的知识体系
          </span>
          <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-6xl">
            让学习更高效
            <span className="block text-blue-200">让知识真正沉淀</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-blue-100/80 md:text-lg">
            将编程、Linux、数据库与电子技术的学习过程，整理成结构清晰、随时可查的个人知识库。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link href="/categories">开始学习 <ArrowRight size={18} /></Link>
            </Button>
            <Button asChild size="lg" className="border border-white/20 bg-white/10 text-white hover:bg-white/20">
              <Link href="/about">了解本站</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-5 text-sm text-blue-100/75">
            <span className="flex items-center gap-2"><CircleCheck size={16}/>系统整理</span>
            <span className="flex items-center gap-2"><BookOpen size={16}/>图文文章</span>
            <span className="flex items-center gap-2"><Rocket size={16}/>持续更新</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
