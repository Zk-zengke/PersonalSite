import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5 text-center">
      <div><p className="text-7xl font-black text-cyan-300">404</p><h1 className="mt-4 text-2xl font-bold">这片知识星域还没有内容</h1><Button asChild className="mt-7"><Link href="/">返回首页</Link></Button></div>
    </main>
  );
}
