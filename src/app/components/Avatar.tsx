import { cn } from "../utils";

export default function Avatar({ src, name, size = "md" }: { src?: string; name: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base", xl: "w-20 h-20 text-xl" };
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return src ? (
    <img src={src} alt={name} className={cn("rounded-full object-cover bg-blue-100 flex-shrink-0", sizes[size])} />
  ) : (
    <div className={cn("rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0", sizes[size])}>
      {initials}
    </div>
  );
}
