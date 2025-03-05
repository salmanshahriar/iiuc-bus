
import { FC } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RefreshIndicatorProps {
  className?: string;
  isRefreshing: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "subtle" | "prominent";
  label?: string;
}

export const RefreshIndicator: FC<RefreshIndicatorProps> = ({
  className,
  isRefreshing,
  size = "md",
  variant = "subtle",
  label
}) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  if (!isRefreshing) {
    return null;
  }

  if (variant === "prominent") {
    return (
      <div className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground animate-fade-in", 
        className
      )}>
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        <span>{label || "Refreshing data..."}</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "absolute inset-x-0 top-0 animate-fade-in z-50",
      className
    )}>
      <div className="loading-bar"></div>
    </div>
  );
};
