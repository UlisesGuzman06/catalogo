import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "success" | "error" | "default";
  className?: string;
}

export function Badge({ label, variant = "default", className }: BadgeProps) {
  const variantStyles = {
    success: "bg-[var(--color-success-bg)] text-[var(--color-success-text)]",
    error: "bg-[var(--color-error-bg)] text-[var(--color-error-text)]",
    default: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}
