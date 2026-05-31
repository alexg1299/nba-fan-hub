"use client";

import clsx from "clsx";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rect" | "circle";
}

export function Skeleton({ className, variant = "rect" }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse",
        variant === "circle" && "rounded-full",
        variant === "text" && "rounded",
        variant === "rect" && "rounded-lg",
        className
      )}
      style={{ background: "var(--color-border)" }}
    />
  );
}

export function GameCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
    >
      <div className="flex justify-between mb-4">
        <Skeleton className="w-20 h-4" variant="text" />
        <Skeleton className="w-12 h-4" variant="text" />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-2 flex-1">
          <Skeleton className="w-12 h-12" variant="circle" />
          <Skeleton className="w-16 h-3" variant="text" />
          <Skeleton className="w-10 h-8" variant="text" />
        </div>
        <Skeleton className="w-6 h-6" variant="circle" />
        <div className="flex flex-col items-center gap-2 flex-1">
          <Skeleton className="w-12 h-12" variant="circle" />
          <Skeleton className="w-16 h-3" variant="text" />
          <Skeleton className="w-10 h-8" variant="text" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
        <Skeleton className="w-full h-3" variant="text" />
      </div>
    </div>
  );
}
