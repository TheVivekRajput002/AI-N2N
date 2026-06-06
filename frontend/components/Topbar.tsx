
"use client"

import {
  FiSave,
  FiFolder,
  FiRotateCcw,
  FiRotateCw,
  FiChevronDown,
  FiShare2,
  FiGitBranch,
  FiMoreVertical
} from 'react-icons/fi';

// Custom high-fidelity VectorShift logo SVG
const VectorShiftLogo = ({ className = "w-7 h-5" }) => (
  <svg
    viewBox="0 0 32 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Capsule 1: Left */}
    <rect x="2" y="12" width="6" height="14" rx="3" transform="rotate(-45 5 19)" />
    {/* Capsule 2: Middle */}
    <rect x="10" y="6" width="6" height="20" rx="3" transform="rotate(-45 13 16)" />
    {/* Capsule 3: Right (Small) */}
    <rect x="18" y="2" width="6" height="8" rx="3" transform="rotate(-45 21 6)" />
  </svg>
);

// Custom Magic Wand / Sparkle clean icon
const MagicWandIcon = ({ size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 4 20 9" />
    <path d="M3 21l12-12" />
    <path d="M20.5 2c-.3 0-.6.1-.8.4l-2.4 2.4 3 3 2.4-2.4c.4-.4.4-1 0-1.4l-1.4-1.4c-.2-.2-.5-.2-.8-.2Z" />
    <path d="M18.5 6.5l-3-3" />
    <path d="m2 2 1.5 1.5M2 22l1.5-1.5M22 2l-1.5 1.5" />
  </svg>
);

const Topbar = ({
  onSave = () => {},
  onOpenFolder = () => {},
  onUndo = () => {},
  onRedo = () => {},
  onShare = () => {},
  onDeploy = () => {},
  onCleanCanvas = () => {},
  onMoreActions = () => {}
}: {
  onSave?: () => void;
  onOpenFolder?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onShare?: () => void;
  onDeploy?: () => void;
  onCleanCanvas?: () => void;
  onMoreActions?: () => void;
} = {}) => {
  return (
    <header className="w-[calc(100vw-88px)] mx-2 flex items-center justify-between px-6 py-2 h-12 bg-[var(--topbar-bg)] border border-[var(--topbar-border)] rounded-xl shadow-sm select-none z-50">

      {/* ================= Left: Logo & Core Actions ================= */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer text-slate-900 hover:text-black transition-colors"
          title="VectorShift"
        >
          <VectorShiftLogo className="w-8 h-6" />
        </div>

        {/* Divider */}
        <div className="w-[1.5px] h-6 bg-[var(--topbar-border)] mx-1" />

        {/* Core Editor Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onSave}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--topbar-icon-color)] hover:text-[var(--topbar-icon-hover-color)] hover:bg-[var(--topbar-icon-hover-bg)] transition-all duration-200"
            title="Save workflow"
          >
            <FiSave size={18} />
          </button>

          <button
            onClick={onOpenFolder}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--topbar-icon-color)] hover:text-[var(--topbar-icon-hover-color)] hover:bg-[var(--topbar-icon-hover-bg)] transition-all duration-200"
            title="Open project folder"
          >
            <FiFolder size={18} />
          </button>

          <button
            onClick={onUndo}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--topbar-icon-color)] hover:text-[var(--topbar-icon-hover-color)] hover:bg-[var(--topbar-icon-hover-bg)] transition-all duration-200"
            title="Undo"
          >
            <FiRotateCcw size={18} />
          </button>

          <button
            onClick={onRedo}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--topbar-icon-color)] hover:text-[var(--topbar-icon-hover-color)] hover:bg-[var(--topbar-icon-hover-bg)] transition-all duration-200"
            title="Redo"
          >
            <FiRotateCw size={18} />
          </button>
        </div>
      </div>

      {/* ================= Center: Breadcrumbs & Title ================= */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors duration-200 group"
        title="Template settings"
      >
        <span className="text-[13px] font-normal text-[var(--topbar-text-muted)]">
          Templates
        </span>
        <span className="text-[13px] text-slate-300">/</span>
        <span className="text-[13.5px] font-semibold text-[var(--topbar-text)]">
          Simple Workflow Template
        </span>
        <FiChevronDown
          size={14}
          className="text-[var(--topbar-icon-color)] group-hover:text-[var(--topbar-icon-hover-color)] transition-colors ml-0.5"
        />
      </div>

      {/* ================= Right: Core Canvas / Share / Deploy Actions ================= */}
      <div className="flex items-center gap-2">
        {/* Share & Branch Pill Container */}
        <div className="flex items-center p-0.5 pr-2.5 gap-2 bg-[var(--topbar-pill-bg)] border border-[var(--topbar-pill-border)] rounded-full">
          {/* Share Button (Blue Circle) */}
          <button
            onClick={onShare}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--topbar-share-btn-bg)] hover:bg-[var(--topbar-share-btn-hover)] text-white shadow-sm transition-all duration-200"
            title="Share workflow"
          >
            <FiShare2 size={13.5} />
          </button>

          {/* Deploy / Branch Details Button */}
          <button
            onClick={onDeploy}
            className="w-6 h-6 flex items-center justify-center rounded-md text-[var(--topbar-icon-color)] hover:text-[var(--topbar-icon-hover-color)] transition-colors"
            title="Workflow branches & deployments"
          >
            <FiGitBranch size={15} />
          </button>
        </div>

        {/* Clean Canvas / Auto layout Button */}
        <button
          onClick={onCleanCanvas}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--topbar-icon-color)] hover:text-[var(--topbar-icon-hover-color)] hover:bg-[var(--topbar-icon-hover-bg)] transition-all duration-200"
          title="Auto-align canvas nodes"
        >
          <MagicWandIcon size={17} />
        </button>

        {/* More Actions Menu */}
        <button
          onClick={onMoreActions}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--topbar-icon-color)] hover:text-[var(--topbar-icon-hover-color)] hover:bg-[var(--topbar-icon-hover-bg)] transition-all duration-200"
          title="More actions"
        >
          <FiMoreVertical size={18} />
        </button>
      </div>

    </header>
  );
};

export default Topbar