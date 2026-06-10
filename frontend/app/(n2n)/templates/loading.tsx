import React from 'react';

export default function Loading() {
  return (
    <div className="ios-templates-page overflow-y-auto animate-pulse">
      <div className="max-w-5xl mx-auto px-6 py-10 md:py-14 flex flex-col gap-6">
        
        {/* Page Header Skeleton */}
        <div className="flex flex-col gap-2">
          <div className="h-9 w-36 bg-black/10 dark:bg-white/10 rounded-xl" />
          <div className="h-4 w-96 max-w-full bg-black/5 dark:bg-white/5 rounded-lg mt-1" />
          <div className="h-4 w-80 max-w-full bg-black/5 dark:bg-white/5 rounded-lg" />
        </div>

        {/* Filters and Search Bar Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
          {/* Category tabs skeleton */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl w-72 h-10 border border-[var(--ios-card-border)]" />

          {/* Search container skeleton */}
          <div className="relative h-10 bg-black/5 dark:bg-white/5 border border-[var(--ios-card-border)] rounded-xl sm:w-64" />
        </div>

        {/* Grid List Skeleton */}
        <div className="ios-templates-grid">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="ios-template-card border border-[var(--ios-card-border)] bg-[var(--ios-card-bg)] select-none">
              {/* Header Info */}
              <div className="p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-20 bg-black/10 dark:bg-white/10 rounded-md" />
                  <div className="flex gap-1">
                    <div className="h-4 w-12 bg-black/5 dark:bg-white/5 rounded-md" />
                    <div className="h-4 w-12 bg-black/5 dark:bg-white/5 rounded-md" />
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-1">
                  <div className="h-6 w-3/4 bg-black/10 dark:bg-white/10 rounded-md" />
                  <div className="h-4 w-full bg-black/5 dark:bg-white/5 rounded-md mt-1" />
                  <div className="h-4 w-5/6 bg-black/5 dark:bg-white/5 rounded-md" />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 bg-black/[0.01] dark:bg-white/[0.01] border-t border-[var(--ios-card-border)] flex items-center justify-between">
                <div className="h-4 w-16 bg-black/10 dark:bg-white/10 rounded-md" />
                <div className="h-8 w-28 bg-black/10 dark:bg-white/10 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
