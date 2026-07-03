import type * as React from "react";
import { cn } from "../utils";

export default function Badge({ children, color = "blue" }: { children: React.ReactNode; color?: "blue" | "teal" | "indigo" | "green" | "amber" | "red" | "gray" }) {
  const map: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border border-blue-100",
    teal: "bg-teal-50 text-teal-700 border border-teal-100",
    indigo: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border border-amber-100",
    red: "bg-red-50 text-red-700 border border-red-100",
    gray: "bg-gray-50 text-gray-600 border border-gray-200",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", map[color])}>
      {children}
    </span>
  );
}
