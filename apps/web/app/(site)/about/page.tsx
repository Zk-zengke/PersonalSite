import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <section className="mx-auto min-h-[70vh] max-w-5xl px-5 py-20">
      <p className="text-sm text-cyan-300">ABOUT</p>
      <h1 className="mt-2 text-4xl font-bold">关于我</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Card className="p-7">
          <h2 className="text-xl font-semibold">个人介绍</h2>
          <p className="mt-4 leading-7 text-slate-400">这里填写你的个人介绍、学习经历和创建这个网站的原因。</p>
        </Card>
        <Card className="p-7">
          <h2 className="text-xl font-semibold">学习方向</h2>
          <p className="mt-4 leading-7 text-slate-400">全栈开发、Linux、数据库、英语与电子技术。</p>
        </Card>
        <Card className="p-7 md:col-span-2">
          <h2 className="text-xl font-semibold">联系方式</h2>
          <p className="mt-4 text-slate-400">Email: hello@example.com · GitHub: github.com/your-name</p>
        </Card>
      </div>
    </section>
  );
}
