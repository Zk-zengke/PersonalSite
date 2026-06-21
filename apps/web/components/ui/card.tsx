import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20",
        className
      )}
      {...props}
    />
  );
}
