"use client"

import { useState } from 'react';
import {
  FiSearch,
  FiChevronDown
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
  
  // Collapsible category states
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Input': true,
    'Logic': true,
    'AI / Prompt': true,
    'Transform': true,
    'Output': true,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Drag and Drop handlers
  const onDragStart = (event: any, nodeType: string, label: string, description?: string, nodeData?: Record<string, any>) => {
    const appData = { nodeType, label, description, nodeData };
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

  // Categories list
  const categories: ('Input' | 'Logic' | 'AI / Prompt' | 'Transform' | 'Output')[] = [
    'Input',
    'Logic',
    'AI / Prompt',
    'Transform',
    'Output'
  ];

  // Helper to map category to icon bg classes
  const getCategoryClass = (category: string) => {
    switch(category) {
      case 'Input': 
        return 'bg-[hsla(var(--ios-green),0.12)] dark:bg-[hsla(var(--ios-green),0.2)] text-[hsl(var(--ios-green))]';
      case 'Logic': 
        return 'bg-[hsla(var(--ios-blue),0.12)] dark:bg-[hsla(var(--ios-blue),0.2)] text-[hsl(var(--ios-blue))]';
      case 'AI / Prompt': 
        return 'bg-[hsla(var(--ios-purple),0.12)] dark:bg-[hsla(var(--ios-purple),0.2)] text-[hsl(var(--ios-purple))]';
      case 'Transform': 
        return 'bg-[hsla(var(--ios-orange),0.12)] dark:bg-[hsla(var(--ios-orange),0.2)] text-[hsl(var(--ios-orange))]';
      case 'Output': 
        return 'bg-[hsla(var(--ios-red),0.12)] dark:bg-[hsla(var(--ios-red),0.2)] text-[hsl(var(--ios-red))]';
      default: 
        return '';
    }
  };

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
    <div className="absolute left-4 top-16 bottom-4 w-[310px] bg-[var(--nodes-bg)] border border-[var(--nodes-border)] rounded-2xl shadow-xl flex flex-col overflow-hidden z-45 select-none transition-all duration-300">

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
      <div className="px-4 pt-3.5 pb-2 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search nodes..."
          className="w-full h-9 bg-[var(--nodes-search-bg)] border border-[var(--nodes-search-border)] rounded-xl px-3 pl-8 text-xs text-[var(--nodes-search-text)] placeholder-[var(--nodes-search-placeholder)] focus:outline-none focus:border-[var(--nodes-search-focus-border)] focus:bg-[var(--nodes-search-focus-bg)] transition-all font-sans"
        />
        <FiSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-[var(--nodes-search-icon)] w-4 h-4" />
      </div>

      {/* Categories Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-2 flex flex-col gap-1">
        
        {categories.map((category) => {
          const categoryNodes = filteredNodes.filter(node => node.category === category);
          
          if (categoryNodes.length === 0) return null;
          
          const isExpanded = expandedCategories[category] || hasSearch;
          
          return (
            <div key={category} className="flex flex-col gap-2 mb-4">
              {/* Category Header */}
              <div 
                onClick={() => !hasSearch && toggleCategory(category)}
                className="flex items-center justify-between py-1 text-[13px] font-semibold text-[var(--ios-text-primary)] tracking-tight cursor-pointer select-none hover:opacity-80 transition-opacity"
              >
                <span>{category}</span>
                {!hasSearch && (
                  <FiChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 text-[var(--ios-text-muted)] ${!isExpanded ? '-rotate-90' : ''}`} 
                  />
                )}
              </div>
              
              {/* Nodes Grid */}
              {isExpanded && (
                <div className="grid grid-cols-2 gap-2 transition-all duration-300">
                  {categoryNodes.map((node) => (
                    <div
                      key={node.data.label}
                      draggable
                      onDragStart={(e) => onDragStart(e, node.type, node.data.label, node.data.description, node.data.nodeData)}
                      onDragEnd={onDragEnd}
                      className="flex items-center gap-2 p-2 bg-[var(--nodes-item-bg)] border border-[var(--nodes-item-border)] rounded-xl cursor-grab select-none hover:-translate-y-0.5 hover:border-[var(--nodes-item-hover-border)] hover:bg-[var(--nodes-bg-hover)] active:scale-97 active:bg-[var(--nodes-item-active-bg)] transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] group"
                      title={node.data.description}
                    >
                      <div className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-transform duration-200 group-hover:scale-105 ${getCategoryClass(category)}`}>
                        {node.icon}
                      </div>
                      <span className="text-[12px] font-medium text-[var(--ios-text-primary)] leading-snug truncate">
                        {node.data.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {filteredNodes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-2 text-center">
            <FiSearch size={24} className="text-[var(--nodes-empty-icon)] mb-3" />
            <span className="text-xs font-semibold text-[var(--nodes-empty-title)]">No nodes found</span>
            <span className="text-[10.5px] text-[var(--nodes-empty-desc)] mt-1">Try searching with a different term</span>
          </div>
        )}

      </div>

      {/* Footer Buttons */}
      <div className="p-4 border-t border-[var(--nodes-footer-border)] bg-[var(--nodes-footer-bg)]">
        <button
          className="w-full py-1.5 bg-[var(--nodes-footer-btn-bg)] hover:bg-[var(--nodes-footer-btn-bg-hover)] border border-[var(--nodes-footer-btn-border)] hover:border-[var(--nodes-footer-btn-border-hover)] text-[var(--nodes-footer-btn-text)] hover:text-[var(--nodes-footer-btn-text-hover)] rounded-lg text-xs font-bold transition-all duration-150 text-center shadow-sm cursor-pointer"
        >
          Templates
        </button>
      </div>

    </div>
  );
};