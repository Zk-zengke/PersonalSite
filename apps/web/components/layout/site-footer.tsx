export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <p>优质内容 · 系统学习 · 持续成长</p>
      <p className="mt-2">© {new Date().getFullYear()} 个人学习知识站</p>
    </footer>
  );
}
