import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Learning.Space | 个人学习网站",
    template: "%s | Learning.Space"
  },
  description: "记录技术学习、项目实践与生活片段的个人知识空间。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
