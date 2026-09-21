import type * as React from "react";
import { cn } from "../utils";

export default function Card({ children, className = "", hover = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode; hover?: boolean }) {
  return (
    <div {...props} className={cn("bg-white rounded-xl border border-gray-200 shadow-sm", hover && "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200", className)}>
      {children}
    </div>
  );
}
