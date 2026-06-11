"use client"

import React, { useState } from 'react';
import { FiPlus, FiSearch, FiFolder, FiClock, FiX, FiCheck, FiTrash2, FiArrowRight, FiSliders, FiPlay, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWorkspace, useThemeStore } from '@/utils/store';
import { apiDelete, apiPost } from '@/utils/api';
import { useAuth } from '@clerk/nextjs';
import { WorkspaceType } from '@/utils/store';

const WorkspacePage = ({ 
  initialWorkspaces, 
  initialHasSeenWelcome 
}: { 
  initialWorkspaces: WorkspaceType[]; 
  initialHasSeenWelcome?: boolean; 
}) => {
  const { getToken } = useAuth();
  const router = useRouter();
  const { isDark } = useThemeStore();


  const isInitialized = React.useRef(false);
  if (!isInitialized.current) {
    useWorkspace.setState({ workspaces: initialWorkspaces });
    isInitialized.current = true;
  }

  const { workspaces, addWorkspace, deleteWorkspace } = useWorkspace();

  // Welcome modal state
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(initialHasSeenWelcome === false);

  const handleWelcomeDismiss = async (action: 'tutorial' | 'template' | 'skip') => {
    try {
      const token = await getToken();
      await apiPost('/auth/welcome-seen', {}, token);
    } catch (err) {
      console.error("Error marking welcome as seen:", err);
    }
    setIsWelcomeModalOpen(false);

    if (action === 'tutorial') {
      window.open('https://youtu.be/hTfnxPJTjyo', '_blank');
    } else if (action === 'template') {
      router.push('/templates');
    }
  };

  // Search filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Modal creation state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    description: '',
    color: 'blue',
  })

  const colorOptions = ['blue', 'green', 'purple', 'orange', 'red', 'pink', 'teal', 'indigo'];

  // Handle Workspace deletion
  const handleDelete = async(id: string, e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    const response: {success: boolean} = await apiDelete(`/workspaces/${id}`)

    if (response.success) {
      deleteWorkspace(id);
    }

  };

  // Handle Workspace creation
  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspace.name.trim()) return;

    const token = await getToken()
    const response: {workspace: WorkspaceType} = await apiPost('/workspaces', newWorkspace, token)
    addWorkspace(response.workspace)

    // Reset fields and close modal
    setNewWorkspace({
      name: '',
      description: '',
      color: 'blue',
    });
    setIsModalOpen(false);
  };

  // Filter workspaces based on search query
  const filteredWorkspaces = (workspaces || []).filter(workspace =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workspace.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex-1 w-screen h-screen overflow-y-auto bg-[var(--app-bg-color)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-16 flex flex-col gap-8">

        {/* iOS-Style Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--ios-text-primary)]">
              Workspaces
            </h1>
            <p className="text-sm text-[var(--ios-text-muted)] mt-1.5 font-medium">
              {workspaces?.length === 1 ? '1 Workspace available' : `${workspaces?.length || 0} Workspaces available`}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-[hsl(var(--ios-blue))] hover:bg-[hsl(var(--ios-blue))] hover:brightness-105 active:scale-[0.98] text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-[0_4px_16px_rgba(var(--ios-blue),0.25)] transition-all cursor-pointer"
          >
            <FiPlus className="stroke-[3]" size={16} />
            <span>New Workspace</span>
          </button>
        </div>

        {/* Search Bar Container */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--ios-text-muted)] pointer-events-none">
            <FiSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search workspaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--ios-input-bg)] text-[var(--ios-text-primary)] placeholder-[var(--ios-text-muted)] border border-[var(--ios-card-border)] rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ios-blue))] focus:bg-[var(--node-bg-color)] transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--ios-text-muted)] hover:text-[var(--ios-text-primary)] transition-colors"
            >
              <FiX size={18} />
            </button>
          )}
        </div>

        {/* Workspaces Grid */}
        {filteredWorkspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] px-6">
            <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--ios-text-muted)] mb-4">
              <FiFolder size={32} />
            </div>
            <h3 className="text-lg font-bold text-[var(--ios-text-primary)]">No Workspaces Found</h3>
            <p className="text-sm text-[var(--ios-text-muted)] mt-1.5 max-w-sm">
              We couldn't find any workspaces matching "{searchQuery}". Try editing your search query.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 text-sm font-semibold text-[hsl(var(--ios-blue))] hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkspaces.map((workspace) => {
              // Extract initials for the workspace icon
              const initials = workspace.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <Link
                  key={workspace.id}
                  href={`/workspaces/${workspace.id}`}
                  className="group relative flex flex-col justify-between p-6 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] transition-all duration-300 select-none overflow-hidden"
                >
                  <div>
                    {/* Top Section: Icon & Delete */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold tracking-wider"
                        style={{
                          backgroundColor: `hsla(var(--ios-${workspace.color}), 0.12)`,
                          color: `hsl(var(--ios-${workspace.color}))`,
                        }}
                      >
                        {initials || <FiFolder />}
                      </div>

                      <button
                        onClick={(e) => handleDelete(workspace.id, e)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--ios-text-muted)] hover:text-red-500 hover:bg-red-500/10 active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete Workspace"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>

                    {/* Middle Section: Title & Desc */}
                    <h2 className="text-lg font-bold text-[var(--ios-text-primary)] group-hover:text-[hsl(var(--ios-blue))] transition-colors duration-200 line-clamp-1">
                      {workspace.name}
                    </h2>
                    <p className="text-xs md:text-sm text-[var(--ios-text-muted)] mt-1.5 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                      {workspace.description}
                    </p>
                  </div>

                  {/* Bottom Section: Pipelines Count & Date */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--ios-card-border)]">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/5 text-[var(--ios-text-primary)]">
                      <FiSliders className="rotate-90" size={10} />
                      <span>{workspace.workflows?.length} {workspace.workflows?. length === 1 ? 'Pipeline' : 'Pipelines'}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] text-[var(--ios-text-muted)] font-medium">
                      <FiClock size={11} />
                      <span>{formatDate(workspace.createdAt)}</span>
                    </span>
                  </div>

                  {/* iOS Native Hover Indicator Arrow */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[hsl(var(--ios-blue))] text-white flex items-center justify-center opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 active:scale-95 transition-all duration-300 shadow-md">
                    <FiArrowRight size={14} className="stroke-[2.5]" />
                  </div>
                </Link>
              );
            })}

            {/* Quick Add Workspace Card */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[var(--ios-card-border)] rounded-3xl hover:border-[hsl(var(--ios-blue))] hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all duration-300 cursor-pointer min-h-[200px]"
            >
              <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--ios-text-muted)] group-hover:text-[hsl(var(--ios-blue))] mb-3">
                <FiPlus size={20} className="stroke-[2.5]" />
              </div>
              <span className="text-sm font-bold text-[var(--ios-text-primary)]">Add Workspace</span>
              <span className="text-xs text-[var(--ios-text-muted)] mt-1">Setup another project workspace</span>
            </button>
          </div>
        )}

        {/* Modal: Slide Up Action Sheet (Create Workspace) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
            {/* Backdrop Blur Overlay */}
            <div
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            />

            {/* Sheet/Modal Container */}
            <div className="relative w-full sm:max-w-md bg-[var(--node-bg-color)] border-t sm:border border-[var(--ios-card-border)] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] sm:max-h-none z-10 animate-slide-up select-none">

              {/* iOS Touch Bar Handle (Mobile) */}
              <div className="flex sm:hidden justify-center py-2.5">
                <div className="w-9 h-1 rounded-full bg-black/10 dark:bg-white/10" />
              </div>

              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-[var(--ios-card-border)]">
                <h2 className="text-lg font-bold text-[var(--ios-text-primary)]">New Workspace</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--ios-text-muted)] hover:text-[var(--ios-text-primary)] transition-colors active:scale-95"
                >
                  <FiX size={14} />
                </button>
              </div>

              {/* Form Input Body */}
              <form onSubmit={handleCreateWorkspace} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--ios-text-muted)]">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sales Pipeline"
                    value={newWorkspace.name}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                    className="w-full bg-[var(--ios-input-bg)] text-[var(--ios-text-primary)] placeholder-[var(--ios-text-muted)] border border-[var(--ios-card-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ios-blue))] focus:bg-[var(--node-bg-color)] transition-all"
                    maxLength={40}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--ios-text-muted)]">
                    Description
                  </label>
                  <textarea
                    placeholder="Tell us what this workspace is about..."
                    value={newWorkspace.description}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                    className="w-full min-h-[80px] bg-[var(--ios-input-bg)] text-[var(--ios-text-primary)] placeholder-[var(--ios-text-muted)] border border-[var(--ios-card-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ios-blue))] focus:bg-[var(--node-bg-color)] transition-all resize-none"
                    maxLength={140}
                  />
                </div>

                {/* Color Selector dots */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--ios-text-muted)]">
                    Branding Color Tag
                  </label>
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewWorkspace({ ...newWorkspace, color: color })}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95`}
                        style={{
                          backgroundColor: `hsl(var(--ios-${color}))`,
                          boxShadow: newWorkspace.color === color
                            ? `0 0 0 2px var(--node-bg-color), 0 0 0 4px hsl(var(--ios-${color}))`
                            : 'none'
                        }}
                      >
                        {newWorkspace.color === color && (
                          <FiCheck className="text-white stroke-[3.5]" size={11} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-6 border-t border-[var(--ios-card-border)] mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 justify-center items-center py-3 text-sm font-semibold rounded-xl border border-[var(--ios-card-border)] text-[var(--ios-text-primary)] hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newWorkspace.name.trim()}
                    className="flex-1 justify-center items-center py-3 text-sm font-semibold rounded-xl bg-[hsl(var(--ios-blue))] text-white hover:brightness-105 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] transition-all shadow-md cursor-pointer"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Welcome Onboarding Modal */}
      {isWelcomeModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop Blur Overlay */}
          <div 
            onClick={() => handleWelcomeDismiss('skip')}
            className={`absolute inset-0 backdrop-blur-[8px] transition-colors duration-300 ${isDark ? 'bg-black/40' : 'bg-black/15'}`} 
          />

          {/* Modal Container */}
          <div className={`relative w-full max-w-[380px] border rounded-[28px] flex flex-col z-10 animate-scale-up select-none p-6 backdrop-saturate-150 transition-all duration-300 ${
            isDark 
              ? 'bg-[#1c1c1e]/95 border-slate-800/60 shadow-[0_24px_50px_rgba(0,0,0,0.4)]' 
              : 'bg-[#f9f9f9]/95 border-slate-200/50 shadow-[0_24px_50px_rgba(0,0,0,0.12)]'
          }`}>
            
            {/* Header Content */}
            <div className="flex flex-col items-center text-center mb-6 mt-2">
              <img 
                src="/icon.jpg" 
                alt="N2N Ai Logo" 
                className={`w-12 h-12 rounded-[14px] shadow-sm mb-4 border ${isDark ? 'border-white/5' : 'border-black/5'}`} 
              />
              <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Welcome to N2N Ai
              </h1>
              <p className={`text-[13px] mt-1.5 px-4 leading-normal font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Choose how you would like to set up your workflow workspace.
              </p>
            </div>

            {/* iOS Style Action Group */}
            <div className={`flex flex-col border rounded-2xl overflow-hidden divide-y mb-6 shadow-sm transition-all duration-300 ${
              isDark 
                ? 'bg-[#2c2c2e] border-slate-800/40 divide-slate-800/50' 
                : 'bg-white border-slate-200/40 divide-slate-100'
            }`}>
              {/* Option 1: Watch Tutorial */}
              <button
                onClick={() => handleWelcomeDismiss('tutorial')}
                className={`flex items-center gap-3.5 p-3.5 text-left w-full transition-colors cursor-pointer active:opacity-70 ${
                  isDark ? 'hover:bg-[#3a3a3c]' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-9 h-9 rounded-[10px] bg-[#ff3b30] text-white flex items-center justify-center flex-shrink-0 animate-none">
                  <FiPlay size={16} className="fill-current stroke-[3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-[14px] font-semibold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Watch Tutorial
                  </h3>
                  <p className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    5-minute video guide
                  </p>
                </div>
                <FiChevronRight className={`flex-shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} size={16} />
              </button>

              {/* Option 2: Explore Templates */}
              <button
                onClick={() => handleWelcomeDismiss('template')}
                className={`flex items-center gap-3.5 p-3.5 text-left w-full transition-colors cursor-pointer active:opacity-70 ${
                  isDark ? 'hover:bg-[#3a3a3c]' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-9 h-9 rounded-[10px] bg-[#007aff] text-white flex items-center justify-center flex-shrink-0">
                  <FiSliders size={15} className="stroke-[3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-[14px] font-semibold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Use a Template
                  </h3>
                  <p className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Pre-built integration pipelines
                  </p>
                </div>
                <FiChevronRight className={`flex-shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} size={16} />
              </button>
            </div>

            {/* iOS Action Button Link */}
            <div className={`flex flex-col border-t pt-3 transition-colors duration-300 ${isDark ? 'border-slate-800/60' : 'border-slate-200/50'}`}>
              <button
                onClick={() => handleWelcomeDismiss('skip')}
                className="text-[14px] font-semibold text-[#007aff] hover:opacity-80 transition-opacity py-2 w-full text-center cursor-pointer active:scale-[0.98]"
              >
                Skip Onboarding
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspacePage;

