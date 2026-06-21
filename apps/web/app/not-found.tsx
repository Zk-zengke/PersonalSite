import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5 text-center">
      <div><p className="text-7xl font-black text-blue-600">404</p><h1 className="mt-4 text-2xl font-bold text-slate-900">这个页面还没有内容</h1><Button asChild className="mt-7"><Link href="/">返回首页</Link></Button></div>
    </main>
  );
}
