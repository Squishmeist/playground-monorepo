import type { SkeletonProps } from "../atom";
import { Skeleton } from "../atom";
import { cn } from "../util";

export interface SkeletonsProps extends SkeletonProps {
  num?: number;
}

export function Skeletons({ className, num = 1, ...props }: SkeletonsProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: num }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-16 w-full bg-secondary", className)}
          {...props}
        />
      ))}
    </div>
  );
}
