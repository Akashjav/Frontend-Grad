import type * as React from "react";
import { cn } from "../utils";

export default function Btn({
  children, variant = "primary", size = "md", onClick, className = "", icon, fullWidth, disabled,
}: {
  children: React.ReactNode; variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg"; onClick?: () => void; className?: string;
  icon?: React.ReactNode; fullWidth?: boolean; disabled?: boolean;
}) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none";
  const sizes = { sm: "px-3.5 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md active:scale-[0.98]",
    secondary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md active:scale-[0.98]",
    outline: "border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]",
    ghost: "text-gray-600 hover:text-blue-600 hover:bg-blue-50 active:scale-[0.98]",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm active:scale-[0.98]",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={cn(base, sizes[size], variants[variant], fullWidth && "w-full", className)}>
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
