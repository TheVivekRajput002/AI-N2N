import React, { useState } from 'react';
import { 
  FiSearch, 
  FiChevronDown, 
  FiChevronUp, 
  FiZap, 
  FiPlayCircle, 
  FiSend, 
  FiList, 
  FiClock, 
  FiUserCheck, 
  FiRotateCw, 
  FiBox, 
  FiLayers, 
  FiGitBranch, 
  FiGitCommit, 
  FiAlertOctagon,
  FiHelpCircle
} from 'react-icons/fi';
import { RiInputCursorMove } from 'react-icons/ri';
import { MdOutput } from 'react-icons/md';
import { IoHardwareChipOutline } from 'react-icons/io5';
import { RxText } from 'react-icons/rx';

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

  // List of all node definitions
  const workflowNodes = [
    {
      type: 'trigger',
      label: 'Trigger',
      description: 'Initiate workflows',
      icon: <FiZap className="w-5 h-5 text-indigo-600" />
    },
    {
      type: 'action',
      label: 'Action',
      description: 'Perform tasks',
      icon: <FiPlayCircle className="w-5 h-5 text-indigo-600" />
    },
    {
      type: 'notification',
      label: 'Notification',
      description: 'Send alerts or notifications',
      icon: <FiSend className="w-5 h-5 text-indigo-600" />
    },
    {
      type: 'conditional',
      label: 'Conditional',
      description: 'Branch the workflow',
      icon: <FiList className="w-5 h-5 text-indigo-600" />
    },
    {
      type: 'delay',
      label: 'Delay',
      description: 'Pause the workflow',
      icon: <FiClock className="w-5 h-5 text-indigo-600" />
    },
    {
      type: 'userTask',
      label: 'User Task',
      description: 'Assign tasks to users',
      icon: <FiUserCheck className="w-5 h-5 text-indigo-600" />
    },
    {
      type: 'loop',
      label: 'Loop',
      description: 'Repeat a set of actions',
      icon: <FiRotateCw className="w-5 h-5 text-indigo-600" />
    },
    {
      type: 'subprocess',
      label: 'Sub-process',
      description: 'Embed another workflow within',
      icon: <FiBox className="w-5 h-5 text-indigo-600" />
    },
    {
      type: 'parallel',
      label: 'Parallel',
      description: 'Run simultaneous branches',
      icon: <FiLayers className="w-5 h-5 text-indigo-600" />
    },
    {
      type: 'decision',
      label: 'Decision',
      description: 'Route the workflow',
      icon: <FiGitBranch className="w-5 h-5 text-indigo-600" />
    },
    {
      type: 'merge',
      label: 'Merge',
      description: 'Combine multiple branches',
      icon: <FiGitCommit className="w-5 h-5 text-indigo-600" />
    },
    {
      type: 'exception',
      label: 'Exception',
      description: 'Handle errors or exceptions',
      icon: <FiAlertOctagon className="w-5 h-5 text-indigo-600" />
    }
  ];

  const coreNodes = [
    {
      type: 'customInput',
      label: 'Input',
      description: 'Define input fields',
      icon: <RiInputCursorMove className="w-5 h-5 text-indigo-600" />
    },
    {
      type: 'llm',
      label: 'LLM',
      description: 'Execute LLM prompt',
      icon: <IoHardwareChipOutline className="w-5 h-5 text-indigo-600" />
    },
    {
      type: 'customOutput',
      label: 'Output',
      description: 'Define output fields',
      icon: <MdOutput className="w-5 h-5 text-indigo-600" />
    },
    {
      type: 'text',
      label: 'Text',
      description: 'Pass simple static text',
      icon: <RxText className="w-5 h-5 text-indigo-600" />
    }
  ];

  // Drag and Drop handlers
  const onDragStart = (event: any, nodeType: string) => {
    const appData = { nodeType };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
    event.target.style.opacity = '0.5';
  };

  const onDragEnd = (event: any) => {
    event.target.style.opacity = '1';
  };

  // Filter lists based on search query
  const filteredWorkflow = workflowNodes.filter(
    node =>
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCore = coreNodes.filter(
    node =>
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasSearch = searchQuery.length > 0;

  // Floating trigger button when sidebar is collapsed
  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="absolute left-4 top-16 w-11 h-11 bg-white border border-slate-200 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 z-45 cursor-pointer"
        title="Open Nodes Library"
      >
        <SidebarToggleIcon />
      </button>
    );
  }

  return (
    <div className="absolute left-4 top-16 bottom-4 w-[290px] bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col overflow-hidden z-45 select-none transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
        <h2 className="text-[15.5px] font-bold text-slate-800 font-sans tracking-tight">
          Nodes Library
        </h2>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
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
          className="w-full h-9 bg-slate-50/60 border border-slate-200 rounded-lg px-3 pl-8 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-sans"
        />
        <FiSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
      </div>

      {/* Accordion Node Lists */}
      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-200">
        
        {/* Section 1: Workflow Nodes */}
        {(filteredWorkflow.length > 0 || !hasSearch) && (
          <div className="flex flex-col gap-1.5">
            <div
              onClick={() => !hasSearch && setWorkflowOpen(!workflowOpen)}
              className={`flex items-center justify-between text-[10px] font-semibold text-slate-400 tracking-wider uppercase select-none ${!hasSearch ? 'cursor-pointer hover:text-slate-600' : ''}`}
            >
              <span>Workflow Nodes</span>
              {!hasSearch && (
                workflowOpen ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />
              )}
            </div>
            
            {(workflowOpen || hasSearch) && (
              <div className="flex flex-col gap-2">
                {filteredWorkflow.map((node) => (
                  <div
                    key={node.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, node.type)}
                    onDragEnd={onDragEnd}
                    className="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-250 hover:shadow-sm active:bg-slate-50 transition-all duration-150 cursor-grab select-none group"
                  >
                    <div className="flex items-center justify-center w-9.5 h-9.5 bg-indigo-50/50 group-hover:bg-indigo-50 border border-indigo-100/30 rounded-lg transition-colors">
                      {node.icon}
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-[13px] font-semibold text-slate-700 font-sans">
                        {node.label}
                      </span>
                      <span className="text-[10.5px] text-slate-400 font-sans mt-0.5">
                        {node.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 2: Core Nodes */}
        {(filteredCore.length > 0 || !hasSearch) && (
          <div className="flex flex-col gap-1.5">
            <div
              onClick={() => !hasSearch && setCoreOpen(!coreOpen)}
              className={`flex items-center justify-between text-[10px] font-semibold text-slate-400 tracking-wider uppercase select-none ${!hasSearch ? 'cursor-pointer hover:text-slate-600' : ''}`}
            >
              <span>Core Nodes</span>
              {!hasSearch && (
                coreOpen ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />
              )}
            </div>
            
            {(coreOpen || hasSearch) && (
              <div className="flex flex-col gap-2">
                {filteredCore.map((node) => (
                  <div
                    key={node.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, node.type)}
                    onDragEnd={onDragEnd}
                    className="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-250 hover:shadow-sm active:bg-slate-50 transition-all duration-150 cursor-grab select-none group"
                  >
                    <div className="flex items-center justify-center w-9.5 h-9.5 bg-indigo-50/50 group-hover:bg-indigo-50 border border-indigo-100/30 rounded-lg transition-colors">
                      {node.icon}
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-[13px] font-semibold text-slate-700 font-sans">
                        {node.label}
                      </span>
                      <span className="text-[10.5px] text-slate-400 font-sans mt-0.5">
                        {node.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {filteredWorkflow.length === 0 && filteredCore.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 px-2 text-center">
            <FiSearch size={22} className="text-slate-300 mb-2" />
            <span className="text-xs font-semibold text-slate-500">No nodes found</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Try searching with a different term</span>
          </div>
        )}

      </div>

      {/* Footer Buttons */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-col gap-2">
        <button
          className="w-full py-1.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-800 rounded-lg text-xs font-bold transition-all duration-150 text-center shadow-sm cursor-pointer"
        >
          Templates
        </button>
        <button
          className="w-full py-1.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-800 rounded-lg text-xs font-bold transition-all duration-150 text-center shadow-sm flex items-center justify-center gap-1 cursor-pointer"
        >
          <FiHelpCircle className="w-3.5 h-3.5 text-slate-400" />
          Help & Support
        </button>
      </div>

    </div>
  );
};