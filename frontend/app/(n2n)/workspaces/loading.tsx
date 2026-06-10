import React from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';

export default function Loading() {
  return (
    <div className="flex-1 w-screen h-screen overflow-y-auto bg-[var(--app-bg-color)] animate-pulse">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-16 flex flex-col gap-8">
        
        {/* iOS-Style Page Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-9 w-48 bg-black/10 dark:bg-white/10 rounded-xl" />
            <div className="h-4 w-36 bg-black/5 dark:bg-white/5 rounded-lg mt-2" />
          </div>

          <div className="inline-flex items-center justify-center gap-2 bg-black/5 dark:bg-white/5 border border-[var(--ios-card-border)] text-[var(--ios-text-muted)] opacity-50 px-5 py-3 rounded-2xl text-sm font-semibold shrink-0">
            <FiPlus className="stroke-[3]" size={16} />
            <div className="h-4 w-28 bg-black/10 dark:bg-white/10 rounded-md" />
          </div>
        </div>

        {/* Search Bar Container Skeleton */}
        <div className="relative w-full h-12 bg-black/5 dark:bg-white/5 border border-[var(--ios-card-border)] rounded-2xl flex items-center pl-4 shadow-sm">
          <FiSearch size={18} className="text-[var(--ios-text-muted)] opacity-50" />
          <div className="h-4 w-40 bg-black/10 dark:bg-white/10 rounded-md ml-3" />
        </div>

        {/* Workspaces Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-6 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] flex flex-col justify-between h-56 select-none overflow-hidden"
            >
              <div>
                {/* Top Section Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-black/10 dark:bg-white/10" />
                </div>

                {/* Title & Description */}
                <div className="h-5 w-3/4 bg-black/10 dark:bg-white/10 rounded-md" />
                <div className="h-4 w-full bg-black/5 dark:bg-white/5 rounded-md mt-2.5" />
                <div className="h-4 w-5/6 bg-black/5 dark:bg-white/5 rounded-md mt-1.5" />
              </div>

              {/* Bottom Section */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--ios-card-border)]">
                <div className="h-6 w-20 bg-black/10 dark:bg-white/10 rounded-full" />
                <div className="h-4 w-20 bg-black/5 dark:bg-white/5 rounded-md" />
              </div>
            </div>
          ))}

          {/* Quick Add Workspace Card Skeleton */}
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[var(--ios-card-border)] rounded-3xl opacity-50 min-h-[200px]">
            <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--ios-text-muted)] mb-3">
              <FiPlus size={20} className="stroke-[2.5]" />
            </div>
            <div className="h-4 w-24 bg-black/10 dark:bg-white/10 rounded-md" />
            <div className="h-3 w-36 bg-black/5 dark:bg-white/5 rounded-md mt-2" />
          </div>
        </div>

      </div>
    </div>
  );
}
