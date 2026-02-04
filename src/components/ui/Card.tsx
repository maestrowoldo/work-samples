import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  border?: boolean;
  hover?: boolean;
}

export function Card({ children, className, border = true, hover = false }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-zinc-900/40 p-6",
        border && "border border-zinc-800",
        hover && "transition duration-300 hover:-translate-y-1 hover:border-emerald-500/60",
        className
      )}
    >
      {children}
    </div>
  );
}
