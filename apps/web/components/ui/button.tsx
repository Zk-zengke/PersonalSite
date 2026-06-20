import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-white shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 hover:shadow-cyan-500/35",
        outline:
          "border border-white/15 bg-white/5 px-5 py-2.5 text-slate-100 hover:bg-white/10",
        ghost: "px-3 py-2 text-slate-300 hover:bg-white/10 hover:text-white",
        danger: "bg-rose-500/15 px-4 py-2 text-rose-300 hover:bg-rose-500/25"
      },
      size: {
        default: "h-11",
        sm: "h-9",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
