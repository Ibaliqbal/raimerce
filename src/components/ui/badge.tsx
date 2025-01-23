import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-gray-200  font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:border-gray-800 dark:focus:ring-gray-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-900 text-gray-50 shadow hover:bg-gray-900/80 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/80",
        secondary:
          "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
        canceled:
          "border-transparent bg-red-600 text-gray-50 shadow hover:bg-red-500/80 dark:bg-red-600 dark:text-gray-50 dark:hover:bg-red-600/80",
        outline: "text-gray-950 dark:text-gray-50",
        success:
          "text-gray-50 shadow border-transparent bg-green-500 hover:bg-green-500/80 dark:text-gray-50 dark:bg-green-700 dark:hover:bg-green-700/80",
        pending:
          "text-gray-50 shadow border-transparent bg-blue-500 hover:bg-blue-500/80 dark:text-gray-50 dark:bg-blue-700 dark:hover:bg-blue-700/80",
      },
      size: {
        sm: "px-2.5 py-0.5 text-xs",
        md: "px-3 py-0.5 text-sm",
        lg: "px-4 py-0.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
