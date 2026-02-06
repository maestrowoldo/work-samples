import { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-emerald-500 text-zinc-950 hover:bg-emerald-400",
        secondary: "bg-zinc-900 text-zinc-100 border border-zinc-800 hover:border-emerald-500 hover:text-emerald-400",
        ghost: "text-zinc-300 hover:text-emerald-400",
        outline: "border border-zinc-800 text-zinc-100 hover:border-emerald-500",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props} />
  );
}
