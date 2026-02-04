import { TextareaHTMLAttributes } from "react";
import clsx from "clsx";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-xs font-medium text-zinc-300" htmlFor={props.id}>
          {label}
        </label>
      )}
      <textarea
        className={clsx(
          "w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-50",
          "outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 resize-none",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
