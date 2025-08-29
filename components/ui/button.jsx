import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Button = forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary-600 text-white hover:bg-primary-700",
    secondary: "bg-secondary-100 text-secondary-900 hover:bg-secondary-200",
    outline: "border border-primary-300 text-primary-700 hover:bg-primary-50",
    ghost: "hover:bg-primary-50 text-primary-700",
    destructive: "bg-red-600 text-white hover:bg-red-700"
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };