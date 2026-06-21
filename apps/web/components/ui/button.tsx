import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 px-5 py-2.5 text-white shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 hover:bg-blue-700",
        outline:
          "border border-slate-200 bg-white px-5 py-2.5 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
        ghost: "px-3 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-700",
        danger: "bg-rose-50 px-4 py-2 text-rose-600 hover:bg-rose-100"
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
