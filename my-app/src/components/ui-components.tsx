import * as React from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "../api/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_4px_14px_rgba(79,70,229,0.3)]",
      secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200",
      outline: "bg-transparent border border-slate-200 text-slate-700 hover:bg-slate-50",
      ghost: "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50",
      danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:text-red-700",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as any)}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm", className)}>
    {children}
  </div>
);

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/50 transition-all shadow-sm font-sans",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Button, Card, Input };
