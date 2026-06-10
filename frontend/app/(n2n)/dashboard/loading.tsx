import React from 'react';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { FiRefreshCw } from 'react-icons/fi';

export default function Loading() {
  return (
    <div className="flex-1 w-screen h-screen overflow-y-auto bg-[var(--app-bg-color)] animate-pulse">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-16 flex flex-col gap-8">
        
        {/* Page Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-slate-300 dark:text-slate-700">
                <MdOutlineSpaceDashboard size={28} />
              </span>
              <div className="h-9 w-44 bg-black/10 dark:bg-white/10 rounded-xl" />
            </div>
            <div className="h-4 w-80 bg-black/5 dark:bg-white/5 rounded-lg mt-2.5" />
          </div>

          <div className="w-10 h-10 rounded-2xl bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] flex items-center justify-center text-[var(--ios-text-muted)] opacity-50">
            <FiRefreshCw size={16} />
          </div>
        </div>

        {/* 4 Metric Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] flex items-center justify-between">
              <div className="flex-1">
                <div className="h-3 w-16 bg-black/10 dark:bg-white/10 rounded-md" />
                <div className="h-8 w-24 bg-black/10 dark:bg-white/10 rounded-lg mt-2" />
                <div className="h-3.5 w-32 bg-black/5 dark:bg-white/5 rounded-md mt-2" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 shrink-0" />
            </div>
          ))}
        </div>

        {/* Middle Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Wrapper Skeleton (2 cols) */}
          <div className="lg:col-span-2 p-6 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-5 w-48 bg-black/10 dark:bg-white/10 rounded-lg" />
                <div className="h-3.5 w-64 bg-black/5 dark:bg-white/5 rounded-md mt-2" />
              </div>
              <div className="flex gap-3">
                <div className="h-4 w-12 bg-black/10 dark:bg-white/10 rounded-md" />
                <div className="h-4 w-12 bg-black/10 dark:bg-white/10 rounded-md" />
              </div>
            </div>
            
            {/* Chart Bars Skeleton */}
            <div className="h-[180px] w-full flex items-end justify-between px-4 pb-2 border-b border-[var(--ios-card-border)]">
              {[60, 40, 80, 50, 70, 30, 90].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-8">
                  <div className="w-full bg-black/5 dark:bg-white/5 rounded-t-lg transition-all" style={{ height: `${h}px` }} />
                  <div className="h-3 w-6 bg-black/10 dark:bg-white/10 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel Skeleton (1 col) */}
          <div className="p-6 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] flex flex-col justify-between">
            <div>
              <div className="h-5 w-32 bg-black/10 dark:bg-white/10 rounded-lg" />
              <div className="h-3.5 w-48 bg-black/5 dark:bg-white/5 rounded-md mt-2 mb-6" />
              
              <div className="flex flex-col gap-3">
                <div className="h-12 w-full bg-black/5 dark:bg-white/5 border border-[var(--ios-card-border)] rounded-2xl" />
                <div className="h-12 w-full bg-black/5 dark:bg-white/5 border border-[var(--ios-card-border)] rounded-2xl" />
              </div>
            </div>

            <div className="h-20 w-full bg-[hsla(var(--ios-blue),0.03)] border border-[var(--ios-card-border)] rounded-2xl mt-6" />
          </div>
        </div>

        {/* Recent Pipelines Grid Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-40 bg-black/10 dark:bg-white/10 rounded-lg" />
            <div className="h-4 w-28 bg-black/5 dark:bg-white/5 rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-5 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] flex flex-col justify-between h-52">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-5 w-24 bg-black/10 dark:bg-white/10 rounded-full" />
                    <div className="h-3.5 w-20 bg-black/5 dark:bg-white/5 rounded-md" />
                  </div>
                  <div className="h-5 w-3/4 bg-black/10 dark:bg-white/10 rounded-md" />
                  <div className="h-3.5 w-full bg-black/5 dark:bg-white/5 rounded-md mt-2" />
                  <div className="h-3.5 w-5/6 bg-black/5 dark:bg-white/5 rounded-md mt-1" />
                </div>
                <div className="flex justify-between items-center mt-5 pt-3 border-t border-[var(--ios-card-border)]">
                  <div className="h-4 w-16 bg-black/10 dark:bg-white/10 rounded-md" />
                  <div className="flex gap-2">
                    <div className="h-8 w-24 bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--ios-card-border)]" />
                    <div className="h-8 w-16 bg-black/10 dark:bg-white/10 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Executions History Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="h-6 w-44 bg-black/10 dark:bg-white/10 rounded-lg" />
          
          <div className="overflow-hidden bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)]">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--ios-card-border)]">
                    {[...Array(5)].map((_, i) => (
                      <th key={i} className="px-6 py-4">
                        <div className="h-3 w-16 bg-black/10 dark:bg-white/10 rounded-md" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(3)].map((_, rowIdx) => (
                    <tr key={rowIdx} className="border-b last:border-0 border-[var(--ios-card-border)]">
                      <td className="px-6 py-4"><div className="h-4 w-32 bg-black/10 dark:bg-white/10 rounded-md" /></td>
                      <td className="px-6 py-4"><div className="h-6 w-20 bg-black/10 dark:bg-white/10 rounded-full" /></td>
                      <td className="px-6 py-4"><div className="h-3.5 w-16 bg-black/5 dark:bg-white/5 rounded-md" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-12 bg-black/10 dark:bg-white/10 rounded-md" /></td>
                      <td className="px-6 py-4"><div className="h-3.5 w-24 bg-black/5 dark:bg-white/5 rounded-md" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
