import React from 'react';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { IoPlayOutline } from 'react-icons/io5';
import { FiSave, FiRotateCcw, FiMoreVertical, FiSearch, FiChevronDown } from 'react-icons/fi';

const SidebarToggleIcon = ({ className = "w-[18px] h-[18px]" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M15 3v18" />
  </svg>
);

export default function Loading() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[var(--app-bg-color)] select-none animate-pulse">
      
      {/* Dotted canvas background representation */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(var(--flow-grid-color, #abacb0) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* ================= Topbar Skeleton ================= */}
      <div className="absolute top-1 right-0 z-50">
        <header className="ios-topbar w-[calc(100vw-88px)] mx-2 flex items-center justify-between px-4 py-2 h-12 border border-[var(--ios-topbar-border)] bg-[var(--ios-topbar-bg)] rounded-2xl backdrop-blur-md">
          {/* Left tools skeleton */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 opacity-50">
              <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--ios-topbar-text-muted)]"><IoPlayOutline size={19} /></div>
              <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--ios-topbar-text-muted)]"><FiSave size={16} /></div>
              <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--ios-topbar-text-muted)]"><FiRotateCcw size={16} /></div>
            </div>
          </div>

          {/* Center breadcrumbs skeleton */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-black/5 dark:bg-white/5 border border-[var(--ios-card-border)] rounded-xl h-8">
            <div className="h-3 w-16 bg-black/10 dark:bg-white/10 rounded-md" />
            <span className="text-[12px] text-[var(--ios-topbar-border)] font-light">/</span>
            <div className="h-3.5 w-24 bg-black/10 dark:bg-white/10 rounded-md" />
            <FiChevronDown size={13} className="text-[var(--ios-topbar-text-muted)]" />
          </div>

          {/* Right actions skeleton */}
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--ios-topbar-text-muted)]"><FiMoreVertical size={16.5} /></div>
          </div>
        </header>
      </div>

      {/* ================= Left: Nodes Library Sidebar Skeleton ================= */}
      <div className="absolute left-4 top-16 bottom-4 w-[260px] bg-[var(--nodes-bg)] border border-[var(--nodes-border)] rounded-2xl shadow-xl flex flex-col overflow-hidden z-45">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-[var(--nodes-header-border)]">
          <div className="h-4.5 w-28 bg-black/10 dark:bg-white/10 rounded-md" />
          <div className="p-1.5 text-[var(--nodes-btn-text)] opacity-50">
            <SidebarToggleIcon />
          </div>
        </div>

        {/* Search Input */}
        <div className="px-3 pt-3 pb-2 relative flex items-center">
          <div className="w-full h-8.5 bg-[var(--nodes-search-bg)] border border-[var(--nodes-search-border)] rounded-xl pl-7.5 flex items-center">
            <div className="h-3.5 w-20 bg-black/10 dark:bg-white/10 rounded-md" />
          </div>
          <FiSearch className="absolute left-6 text-[var(--nodes-search-icon)] w-3.5 h-3.5 opacity-50" />
        </div>

        {/* Categories Content */}
        <div className="flex-1 overflow-y-auto px-3 py-1.5 flex flex-col gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center justify-between py-0.5">
                <div className="h-4 w-24 bg-black/10 dark:bg-white/10 rounded-md" />
                <FiChevronDown size={14} className="text-[var(--ios-text-muted)] opacity-50" />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center gap-1.5 p-1.5 bg-[var(--nodes-item-bg)] border border-[var(--nodes-item-border)] rounded-xl h-10">
                    <div className="w-6.5 h-6.5 rounded-lg bg-black/10 dark:bg-white/10 shrink-0" />
                    <div className="h-3 w-14 bg-black/5 dark:bg-white/5 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--nodes-footer-border)] bg-[var(--nodes-footer-bg)]">
          <div className="w-full h-8 bg-[var(--nodes-footer-btn-bg)] border border-[var(--nodes-footer-btn-border)] rounded-lg" />
        </div>
      </div>

      {/* ================= Right: FlowBar Sidebar Skeleton ================= */}
      <div className="absolute right-4 top-16 bottom-4 w-[260px] bg-[var(--flowbar-bg)] border border-[var(--flowbar-border)] rounded-2xl shadow-xl backdrop-blur-md flex flex-col overflow-hidden z-45">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-[var(--flowbar-border)]">
          <div className="h-4.5 w-24 bg-black/10 dark:bg-white/10 rounded-md" />
          <div className="p-1.5 text-[var(--flowbar-text-secondary)] opacity-50">
            <SidebarToggleIcon />
          </div>
        </div>

        {/* Content sections skeleton */}
        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-6">
          {/* Section 1: Info */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-12 bg-black/10 dark:bg-white/10 rounded-md" />
            <div className="h-8 w-full bg-black/5 dark:bg-white/5 rounded-lg" />
            <div className="h-12 w-full bg-black/5 dark:bg-white/5 rounded-lg mt-1" />
          </div>

          {/* Section 2: Runtime settings */}
          <div className="flex flex-col gap-3">
            <div className="h-4 w-24 bg-black/10 dark:bg-white/10 rounded-md" />
            <div className="flex flex-col gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center h-8 bg-black/5 dark:bg-white/5 rounded-lg px-2">
                  <div className="h-3 w-16 bg-black/10 dark:bg-white/10 rounded-md" />
                  <div className="h-4 w-8 bg-black/10 dark:bg-white/10 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
