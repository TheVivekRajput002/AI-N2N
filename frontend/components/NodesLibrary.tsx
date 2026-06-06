"use client"

import { useState } from 'react';
import {
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiHelpCircle
} from 'react-icons/fi';
import { AllNodes } from './nodes/nodeConfig';


// Custom sidebar toggle icon that matches the design (split panel icon)
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

export const NodesLibrary = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [workflowOpen, setWorkflowOpen] = useState(true);
  const [coreOpen, setCoreOpen] = useState(true);


  // Drag and Drop handlers
  const onDragStart = (event: any, nodeType: string, label: string, description?: string) => {
    const appData = { nodeType, label, description };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
    event.target.style.opacity = '0.5';
  };

  const onDragEnd = (event: any) => {
    event.target.style.opacity = '1';
  };

  // Filter lists based on search query
  const filteredNodes = AllNodes.filter(
    node =>
      node.data.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.data.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasSearch = searchQuery.length > 0;

  // Floating trigger button when sidebar is collapsed
  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="absolute left-4 top-16 w-11 h-11 bg-[var(--nodes-bg)] border border-[var(--nodes-border)] rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center text-[var(--nodes-text)] hover:text-[var(--nodes-text-hover)] hover:bg-[var(--nodes-bg-hover)] transition-all duration-200 z-45 cursor-pointer"
        title="Open Nodes Library"
      >
        <SidebarToggleIcon />
      </button>
    );
  }

  return (
    <div className="absolute left-4 top-16 bottom-4 w-[290px] bg-[var(--nodes-bg)] border border-[var(--nodes-border)] rounded-2xl shadow-xl flex flex-col overflow-hidden z-45 select-none transition-all duration-300">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--nodes-header-border)]">
        <h2 className="text-[15.5px] font-bold text-[var(--nodes-header-text)] font-sans tracking-tight">
          Nodes Library
        </h2>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1.5 rounded-lg text-[var(--nodes-btn-text)] hover:text-[var(--nodes-btn-text-hover)] hover:bg-[var(--nodes-btn-bg-hover)] active:bg-[var(--nodes-btn-bg-active)] transition-colors cursor-pointer"
          title="Collapse sidebar"
        >
          <SidebarToggleIcon />
        </button>
      </div>

      {/* Search Input */}
      <div className="px-4 pt-3.5 pb-1.5 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search nodes..."
          className="w-full h-9 bg-[var(--nodes-search-bg)] border border-[var(--nodes-search-border)] rounded-lg px-3 pl-8 text-xs text-[var(--nodes-search-text)] placeholder-[var(--nodes-search-placeholder)] focus:outline-none focus:border-[var(--nodes-search-focus-border)] focus:bg-[var(--nodes-search-focus-bg)] transition-all font-sans"
        />
        <FiSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-[var(--nodes-search-icon)] w-4 h-4" />
      </div>

      {/* Accordion Node Lists */}
      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-200">

        {/* Section 1: Workflow Nodes */}
        {(filteredNodes.length > 0 || !hasSearch) && (
          <div className="flex flex-col gap-1.5">
            <div
              onClick={() => !hasSearch && setWorkflowOpen(!workflowOpen)}
              className={`flex items-center justify-between text-[10px] font-semibold text-[var(--nodes-section-header-text)] tracking-wider uppercase select-none ${!hasSearch ? 'cursor-pointer hover:text-[var(--nodes-section-header-text-hover)]' : ''}`}
            >
              <span>Workflow Nodes</span>
              {!hasSearch && (
                workflowOpen ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />
              )}
            </div>

            {(workflowOpen || hasSearch) && (
              <div className="flex flex-col gap-2">
                {filteredNodes.map((node) => (
                  <div
                    key={node.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, node.type, node.data.label, node.data.description)}
                    onDragEnd={onDragEnd}
                    className="flex items-center gap-3 p-2.5 bg-[var(--nodes-item-bg)] border border-[var(--nodes-item-border)] rounded-xl hover:border-[var(--nodes-item-hover-border)] hover:shadow-sm active:bg-[var(--nodes-item-active-bg)] transition-all duration-150 cursor-grab select-none group"
                  >
                    <div className="flex items-center justify-center w-9.5 h-9.5 bg-[var(--nodes-item-icon-bg)] group-hover:bg-[var(--nodes-item-icon-bg-hover)] border border-[var(--nodes-item-icon-border)] rounded-lg transition-colors">
                      {node.icon}
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-[13px] font-semibold text-[var(--nodes-item-label)] font-sans">
                        {node.data.label}
                      </span>
                      <span className="text-[10.5px] text-[var(--nodes-item-desc)] font-sans mt-0.5">
                        {node.data.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {filteredNodes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 px-2 text-center">
            <FiSearch size={22} className="text-[var(--nodes-empty-icon)] mb-2" />
            <span className="text-xs font-semibold text-[var(--nodes-empty-title)]">No nodes found</span>
            <span className="text-[10px] text-[var(--nodes-empty-desc)] mt-0.5">Try searching with a different term</span>
          </div>
        )}

      </div>

      {/* Footer Buttons */}
      <div className="p-4 border-t border-[var(--nodes-footer-border)] bg-[var(--nodes-footer-bg)] flex flex-col gap-2">
        <button
          className="w-full py-1.5 bg-[var(--nodes-footer-btn-bg)] hover:bg-[var(--nodes-footer-btn-bg-hover)] border border-[var(--nodes-footer-btn-border)] hover:border-[var(--nodes-footer-btn-border-hover)] text-[var(--nodes-footer-btn-text)] hover:text-[var(--nodes-footer-btn-text-hover)] rounded-lg text-xs font-bold transition-all duration-150 text-center shadow-sm cursor-pointer"
        >
          Templates
        </button>
        <button
          className="w-full py-1.5 bg-[var(--nodes-footer-btn-bg)] hover:bg-[var(--nodes-footer-btn-bg-hover)] border border-[var(--nodes-footer-btn-border)] hover:border-[var(--nodes-footer-btn-border-hover)] text-[var(--nodes-footer-btn-text)] hover:text-[var(--nodes-footer-btn-text-hover)] rounded-lg text-xs font-bold transition-all duration-150 text-center shadow-sm flex items-center justify-center gap-1 cursor-pointer"
        >
          <FiHelpCircle className="w-3.5 h-3.5 text-[var(--nodes-btn-text)]" />
          Help & Support
        </button>
      </div>

    </div>
  );
};