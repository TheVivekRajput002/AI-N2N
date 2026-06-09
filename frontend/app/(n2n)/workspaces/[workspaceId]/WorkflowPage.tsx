"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiPlus,
  FiSearch,
  FiSliders,
  FiClock,
  FiX,
  FiCheck,
  FiTrash2,
  FiArrowRight,
  FiChevronLeft,
  FiActivity
} from 'react-icons/fi';
import { useWorkspace, useWorkflow, WorkflowType } from '@/utils/store';
import { apiPost } from '@/utils/api';
import { useFlowState } from '@/hooks/useFlowState';


const WorkflowPage = ({ initialWorkflows }: { initialWorkflows: WorkflowType[] }) => {


  const isInitialized = React.useRef(false);
  if (!isInitialized.current) {
    useWorkflow.setState({ workflows: initialWorkflows });
    isInitialized.current = true;
  }

  const { workspaceId } = useParams() as { workspaceId: string };

  // Fetch workspaces & workflows state
  const { workspaces } = useWorkspace();
  const { workflows, addWorkflow, removeWorkflow } = useWorkflow();

  // Find the current workspace to display branding
  const currentWorkspace = useMemo(() => {
    return workspaces.find(w => w.id === workspaceId);
  }, [workspaces, workspaceId]);

  // Filter workflows for this workspace
  const workspaceWorkflows = useMemo(() => {
    return workflows.filter(w => w.workspaceId === workspaceId);
  }, [workflows, workspaceId]);

  // Search filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Modal creation state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
  });

  // Filter workflows based on search query
  const filteredWorkflows = useMemo(() => {
    return workspaceWorkflows.filter(wf =>
      wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [workspaceWorkflows, searchQuery]);

  // Create workflow handler
  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkflow.name.trim()) return;

    // const createdWorkflow: WorkflowType = {
    //   id: `wf-${Math.random().toString(36).substr(2, 9)}`,
    //   name: newWorkflow.name,
    //   description: newWorkflow.description,
    //   isEnabled: newWorkflow.isEnabled,
    //   workspaceId: workspaceId,
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString()
    // };

    const response: { workflow: WorkflowType } = await apiPost(`/workflows/${workspaceId}`, newWorkflow)

    addWorkflow(response.workflow);

    // Reset input fields & close modal
    setNewWorkflow({
      name: '',
      description: '',
    });
    setIsModalOpen(false);
    // router.refresh();
  };

  // Delete workflow handler
  const handleDeleteWorkflow = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeWorkflow(id);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleWorkflowClick = (workflowId: string) => {
    const workflow = workflows.find((w) => w.id === workflowId);
    if (workflow?.currentVersion) {
      console.log(workflow.currentVersion.graph);
    }
  };

  const workspaceName = currentWorkspace?.name || "Workspace";
  const workspaceColor = currentWorkspace?.color || "blue";

  return (
    <div className="flex-1 w-screen h-screen overflow-y-auto bg-[var(--app-bg-color)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-16 flex flex-col gap-8">

        {/* Back Link Breadcrumb */}
        <div className="flex items-center">
          <Link
            href="/workspaces"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[hsl(var(--ios-blue))] hover:underline cursor-pointer group"
          >
            <FiChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            <span>Workspaces</span>
          </Link>
        </div>

        {/* iOS-Style Workspace Info & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Branding Color Circle Indicator */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0 mt-1 select-none"
              style={{
                backgroundColor: `hsla(var(--ios-${workspaceColor}), 0.12)`,
                color: `hsl(var(--ios-${workspaceColor}))`,
              }}
            >
              {workspaceName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--ios-text-primary)]">
                {workspaceName}
              </h1>
              <p className="text-sm text-[var(--ios-text-muted)] mt-1 font-medium max-w-xl">
                {currentWorkspace?.description || "Configure pipelines and build automations for this project workspace."}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-[hsl(var(--ios-blue))] hover:bg-[hsl(var(--ios-blue))] hover:brightness-105 active:scale-[0.98] text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-[0_4px_16px_rgba(var(--ios-blue),0.25)] transition-all cursor-pointer self-start sm:self-center shrink-0"
          >
            <FiPlus className="stroke-[3]" size={16} />
            <span>New Pipeline</span>
          </button>
        </div>

        {/* Search Bar Container */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--ios-text-muted)] pointer-events-none">
            <FiSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search pipelines..."
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

        {/* Workflows Grid */}
        {filteredWorkflows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] px-6">
            <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--ios-text-muted)] mb-4">
              <FiActivity size={32} />
            </div>
            <h3 className="text-lg font-bold text-[var(--ios-text-primary)]">No Pipelines Found</h3>
            <p className="text-sm text-[var(--ios-text-muted)] mt-1.5 max-w-sm">
              {searchQuery
                ? `We couldn't find any pipelines matching "${searchQuery}". Try editing your query.`
                : "Create a new pipeline to design flows, manage automated tasks, or integrate APIs."}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 text-sm font-semibold text-[hsl(var(--ios-blue))] hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 text-sm font-semibold text-[hsl(var(--ios-blue))] hover:underline cursor-pointer"
              >
                Create pipeline
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.map((workflow) => (
              <Link
                key={workflow.id}
                prefetch={true}
                href={`/workspaces/${workspaceId}/${workflow.id}`}
                className="group relative flex flex-col justify-between p-6 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] transition-all duration-300 select-none overflow-hidden"
              >
                <div onClick={() => handleWorkflowClick(workflow.id)} >
                  {/* Top Section: Status indicator & Delete */}
                  <div className="flex items-center justify-between mb-5">
                    {/* iOS Status Pill */}
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold select-none transition-colors"
                      style={{
                        backgroundColor: workflow.isEnabled
                          ? 'hsla(var(--ios-green), 0.12)'
                          : 'rgba(0,0,0,0.05)',
                        color: workflow.isEnabled
                          ? 'hsl(var(--ios-green))'
                          : 'var(--ios-text-muted)'
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: workflow.isEnabled
                            ? 'hsl(var(--ios-green))'
                            : 'var(--ios-text-muted)'
                        }}
                      />
                      <span>{workflow.isEnabled ? 'Active' : 'Paused'}</span>
                    </span>

                    <button
                      onClick={(e) => handleDeleteWorkflow(workflow.id, e)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--ios-text-muted)] hover:text-red-500 hover:bg-red-500/10 active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Remove Pipeline"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>

                  {/* Middle Section: Title & Desc */}
                  <h2 className="text-lg font-bold text-[var(--ios-text-primary)] group-hover:text-[hsl(var(--ios-blue))] transition-colors duration-200 line-clamp-1">
                    {workflow.name}
                  </h2>
                  <p className="text-xs md:text-sm text-[var(--ios-text-muted)] mt-1.5 leading-relaxed line-clamp-3 min-h-[3.25rem]">
                    {workflow.description}
                  </p>
                </div>

                {/* Bottom Section: Icon Indicator & Date */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--ios-card-border)]">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/5 text-[var(--ios-text-primary)]">
                    <FiSliders className="rotate-90" size={10} />
                    <span>Visual Builder</span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] text-[var(--ios-text-muted)] font-medium">
                    <FiClock size={11} />
                    <span>{formatDate(workflow.updatedAt)}</span>
                  </span>
                </div>

                {/* iOS Hover Indicator Arrow */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[hsl(var(--ios-blue))] text-white flex items-center justify-center opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 active:scale-95 transition-all duration-300 shadow-md">
                  <FiArrowRight size={14} className="stroke-[2.5]" />
                </div>
              </Link>
            ))}

            {/* Quick Add Pipeline Card */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[var(--ios-card-border)] rounded-3xl hover:border-[hsl(var(--ios-blue))] hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all duration-300 cursor-pointer min-h-[200px]"
            >
              <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--ios-text-muted)] mb-3">
                <FiPlus size={20} className="stroke-[2.5]" />
              </div>
              <span className="text-sm font-bold text-[var(--ios-text-primary)]">Add Pipeline</span>
              <span className="text-xs text-[var(--ios-text-muted)] mt-1">Design an integration pipeline</span>
            </button>
          </div>
        )}

        {/* Modal: Slide Up Action Sheet (Create Workflow) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
            {/* Backdrop Blur Overlay */}
            <div
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            />

            {/* Sheet/Modal Container */}
            <div className="relative w-full sm:max-w-md bg-[var(--node-bg-color)] border-t sm:border border-[var(--ios-card-border)] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] sm:max-h-none z-10 animate-slide-up select-none">

              {/* iOS Touch Bar Handle (Mobile View) */}
              <div className="flex sm:hidden justify-center py-2.5">
                <div className="w-9 h-1 rounded-full bg-black/10 dark:bg-white/10" />
              </div>

              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-[var(--ios-card-border)]">
                <h2 className="text-lg font-bold text-[var(--ios-text-primary)]">New Pipeline</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--ios-text-muted)] hover:text-[var(--ios-text-primary)] transition-colors active:scale-95"
                >
                  <FiX size={14} />
                </button>
              </div>

              {/* Form Input Body */}
              <form onSubmit={handleCreateWorkflow} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--ios-text-muted)]">
                    Pipeline Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sync Contacts to CRM"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                    className="w-full bg-[var(--ios-input-bg)] text-[var(--ios-text-primary)] placeholder-[var(--ios-text-muted)] border border-[var(--ios-card-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ios-blue))] focus:bg-[var(--node-bg-color)] transition-all"
                    maxLength={50}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--ios-text-muted)]">
                    Description
                  </label>
                  <textarea
                    placeholder="Write a brief overview of this workflow's functions..."
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                    className="w-full min-h-[80px] bg-[var(--ios-input-bg)] text-[var(--ios-text-primary)] placeholder-[var(--ios-text-muted)] border border-[var(--ios-card-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ios-blue))] focus:bg-[var(--node-bg-color)] transition-all resize-none"
                    maxLength={200}
                  />
                </div>

                {/* Status Toggle Switch */}
                {/* <div className="flex items-center justify-between py-2 border-t border-b border-[var(--ios-card-border)]">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[var(--ios-text-primary)]">Enabled</span>
                    <span className="text-xs text-[var(--ios-text-muted)]">Run this pipeline immediately upon creation</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewWorkflow({ ...newWorkflow, isEnabled: !newWorkflow.isEnabled })}
                    className="relative w-12 h-7 rounded-full transition-colors duration-250 cursor-pointer outline-none focus:ring-2 focus:ring-[hsl(var(--ios-blue))] focus:ring-offset-2"
                    style={{
                      backgroundColor: newWorkflow.isEnabled ? 'hsl(var(--ios-green))' : 'rgba(120, 120, 128, 0.3)'
                    }}
                  >
                    <span
                      className="absolute top-[2px] left-[2px] w-6 h-6 rounded-full bg-white transition-transform duration-250 shadow-md"
                      style={{
                        transform: newWorkflow.isEnabled ? 'translateX(20px)' : 'translateX(0)'
                      }}
                    />
                  </button>
                </div> */}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 justify-center items-center py-3 text-sm font-semibold rounded-xl border border-[var(--ios-card-border)] text-[var(--ios-text-primary)] hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newWorkflow.name.trim()}
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
    </div>
  );
};

export default WorkflowPage;