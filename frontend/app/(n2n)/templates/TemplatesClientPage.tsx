"use client"

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { 
  FiPlus, 
  FiSearch, 
  FiClock, 
  FiGlobe, 
  FiMail, 
  FiList, 
  FiCheck, 
  FiX, 
  FiArrowRight, 
  FiCpu,
  FiZap,
  FiActivity
} from 'react-icons/fi';
import { RiInputCursorMove } from 'react-icons/ri';
import { MdOutput } from 'react-icons/md';
import { useWorkspace, WorkspaceType } from '@/utils/store';
import { apiPost, apiGet } from '@/utils/api';
import { useToast } from '@/hooks/useToast';

interface NodeVisual {
  label: string;
  type: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'AI Agent' | 'Integrations' | 'Logic & Utility';
  color: string;
  tags: string[];
  nodes: NodeVisual[];
  graph: {
    nodes: any[];
    edges: any[];
  };
}

const TemplatesSkeleton = () => {
  return (
    <div className="ios-templates-grid animate-pulse">
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
  );
};

const TemplatesClientPage = ({ initialWorkspaces }: { initialWorkspaces: WorkspaceType[] }) => {
  const router = useRouter();
  const { getToken } = useAuth();
  const { showToast } = useToast();

  const isInitialized = React.useRef(false);
  if (!isInitialized.current) {
    useWorkspace.setState({ workspaces: initialWorkspaces });
    isInitialized.current = true;
  }

  const { workspaces, addWorkspace } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Dynamic templates state
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  React.useEffect(() => {
    let isMounted = true;
    const loadTemplates = async () => {
      try {
        const token = await getToken();
        const res = await apiGet<{ success: boolean; templates: Template[] }>('/templates', token);
        if (isMounted && res.success && Array.isArray(res.templates)) {
          setTemplates(res.templates);
        }
      } catch (err) {
        console.error("Failed to load templates from database:", err);
      } finally {
        if (isMounted) {
          setIsLoadingTemplates(false);
        }
      }
    };
    loadTemplates();
    return () => {
      isMounted = false;
    };
  }, [getToken]);
  
  // Modal states
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [targetWorkspaceId, setTargetWorkspaceId] = useState<string>('');
  const [isDuplicating, setIsDuplicating] = useState(false);
  
  // New workspace form states
  const [showNewWorkspaceForm, setShowNewWorkspaceForm] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    description: '',
    color: 'blue'
  });

  const colorOptions = ['blue', 'green', 'purple', 'orange', 'red', 'pink', 'teal', 'indigo'];

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(tpl => {
      const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || tpl.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, activeCategory]);

  const handleUseTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    if (workspaces.length > 0) {
      setTargetWorkspaceId(workspaces[0].id);
      setShowNewWorkspaceForm(false);
    } else {
      setShowNewWorkspaceForm(true);
    }
  };

  const handleDuplicate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedTemplate) return;

    setIsDuplicating(true);
    let finalWorkspaceId = targetWorkspaceId;

    try {
      const token = await getToken();

      // Step 1: Create workspace if form is filled or no workspace exists
      if (showNewWorkspaceForm || workspaces.length === 0) {
        if (!newWorkspace.name.trim()) {
          showToast('Please enter a workspace name', 'error');
          setIsDuplicating(false);
          return;
        }

        const createWSResponse = await apiPost<{ workspace: WorkspaceType }>('/workspaces', {
          name: newWorkspace.name,
          description: newWorkspace.description,
          color: newWorkspace.color
        }, token);

        addWorkspace(createWSResponse.workspace);
        finalWorkspaceId = createWSResponse.workspace.id;
        
        // Reset form
        setNewWorkspace({ name: '', description: '', color: 'blue' });
      }

      if (!finalWorkspaceId) {
        throw new Error("No target workspace selected");
      }

      // Step 2: Create workflow inside the workspace
      const createWFResponse = await apiPost<{ success: boolean; workflow: any }>(
        `/workflows/${finalWorkspaceId}`,
        {
          name: selectedTemplate.name,
          description: selectedTemplate.description
        },
        token
      );

      if (!createWFResponse.success || !createWFResponse.workflow?.id) {
        throw new Error("Failed to create workflow structure");
      }

      const createdWorkflow = createWFResponse.workflow;

      // Step 3: Populate/Update the graph version with template nodes and edges
      await apiPost<any>(
        `/workflow-version`,
        {
          graph: selectedTemplate.graph,
          workflowId: createdWorkflow.id
        },
        token
      );

      showToast(`Successfully duplicated "${selectedTemplate.name}"!`, 'success');
      setSelectedTemplate(null);
      
      // Redirect to the newly created pipeline canvas
      router.push(`/workspaces/${finalWorkspaceId}/${createdWorkflow.id}`);
    } catch (err) {
      console.error("Duplicate template error:", err);
      showToast(err instanceof Error ? err.message : 'Failed to duplicate workflow template.', 'error');
    } finally {
      setIsDuplicating(false);
    }
  };



  return (
    <div className="ios-templates-page overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-10 md:py-14 flex flex-col gap-6">
        
        {/* Page Header */}
        <div className="flex flex-col gap-1.5">
          <h1 className="ios-templates-header-title">
            Templates
          </h1>
          <p className="ios-templates-header-subtitle max-w-xl">
            Choose a pre-built workflow configuration to clone into your workspace, customize nodes, and execute instantly.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
          {/* Category tabs */}
          <div className="ios-templates-tabs">
            {['All', 'AI Agent', 'Integrations', 'Logic & Utility'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`ios-templates-tab ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search container */}
          <div className="ios-templates-search-container sm:w-64">
            <span className="ios-templates-search-icon">
              <FiSearch size={14} />
            </span>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ios-templates-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--ios-text-muted)] hover:text-[var(--ios-text-primary)]"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Grid List */}
        {isLoadingTemplates ? (
          <TemplatesSkeleton />
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-2xl shadow-[var(--ios-card-shadow)] px-6">
            <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--ios-text-muted)] mb-3">
              <FiZap size={24} />
            </div>
            <h3 className="text-sm font-bold text-[var(--ios-text-primary)]">No templates match search</h3>
          </div>
        ) : (
          <div className="ios-templates-grid">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="ios-template-card"
              >
                {/* Header Information */}
                <div className="p-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="ios-template-category-tag">
                      {template.category}
                    </span>
                    <div className="flex gap-1">
                      {template.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[var(--ios-text-muted)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[var(--ios-text-primary)]">
                      {template.name}
                    </h3>
                    <p className="text-xs text-[var(--ios-text-muted)] mt-1 leading-relaxed line-clamp-3">
                      {template.description}
                    </p>
                  </div>

                </div>

                {/* Footer Controls */}
                <div className="px-6 py-3.5 bg-black/[0.01] dark:bg-white/[0.01] border-t border-[var(--ios-card-border)] flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--ios-text-muted)] uppercase tracking-wider">
                    {template.graph.nodes.length} Blocks
                  </span>
                  <button
                    onClick={() => handleUseTemplateClick(template)}
                    className="ios-btn ios-btn-primary py-2 px-3 rounded-lg text-xs"
                  >
                    <span>Use Template</span>
                    <FiArrowRight size={12} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal dialog selection */}
        {selectedTemplate && (
          <div className="ios-modal-sheet-overlay flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
            {/* Click backdrop to close */}
            <div
              onClick={() => {
                if (!isDuplicating) setSelectedTemplate(null);
              }}
              className="absolute inset-0"
            />

            {/* Sheet Box */}
            <div className="ios-modal-sheet relative w-full sm:max-w-sm flex flex-col max-h-[90vh] sm:max-h-none z-10 select-none">
              
              {/* Touch Handle indicator (Mobile view) */}
              <div className="flex sm:hidden justify-center py-2">
                <div className="w-8 h-1 rounded-full bg-black/10 dark:bg-white/10" />
              </div>

              {/* Sheet Header */}
              <div className="flex items-center justify-between px-5 pt-3.5 pb-2.5 border-b border-[var(--ios-card-border)]">
                <div className="flex flex-col">
                  <h2 className="text-sm font-extrabold text-[var(--ios-text-primary)]">Copy Template</h2>
                  <span className="text-[10px] text-[var(--ios-text-muted)] truncate max-w-[200px]">{selectedTemplate.name}</span>
                </div>
                <button
                  disabled={isDuplicating}
                  onClick={() => setSelectedTemplate(null)}
                  className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--ios-text-muted)] hover:text-[var(--ios-text-primary)] active:scale-95 disabled:opacity-50"
                >
                  <FiX size={12} />
                </button>
              </div>

              {/* Sheet Body */}
              <div className="px-5 py-4">
                {isDuplicating ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-9 h-9 rounded-full border-3 border-[hsl(var(--ios-blue))]/20 border-t-[hsl(var(--ios-blue))] animate-spin mb-3" />
                    <h4 className="text-xs font-bold text-[var(--ios-text-primary)]">Duplicating pipeline...</h4>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Destination Workspace list selector */}
                    {workspaces.length > 0 && !showNewWorkspaceForm && (
                      <div className="flex flex-col gap-2.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--ios-text-muted)]">
                            Workspace Destination
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowNewWorkspaceForm(true)}
                            className="text-[10px] font-bold text-[hsl(var(--ios-blue))] hover:underline cursor-pointer flex items-center gap-0.5"
                          >
                            <FiPlus size={9} />
                            <span>New Workspace</span>
                          </button>
                        </div>

                        <div className="ios-list-container">
                          {workspaces.map((ws) => (
                            <button
                              key={ws.id}
                              type="button"
                              onClick={() => setTargetWorkspaceId(ws.id)}
                              className={`ios-list-item ${targetWorkspaceId === ws.id ? 'selected' : ''}`}
                            >
                              <div
                                className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0"
                                style={{
                                  backgroundColor: targetWorkspaceId === ws.id ? 'rgba(255,255,255,0.2)' : `hsla(var(--ios-${ws.color}), 0.12)`,
                                  color: targetWorkspaceId === ws.id ? '#ffffff' : `hsl(var(--ios-${ws.color}))`,
                                }}
                              >
                                {ws.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">{ws.name}</p>
                                <p className={`text-[9px] truncate ${targetWorkspaceId === ws.id ? 'text-white/70' : 'text-[var(--ios-text-muted)]'}`}>
                                  {ws.workflows?.length || 0} {ws.workflows?.length === 1 ? 'Pipeline' : 'Pipelines'}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Form to create workspace on-the-fly */}
                    {(workspaces.length === 0 || showNewWorkspaceForm) && (
                      <div className="flex flex-col gap-3.5 animate-fade-in">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--ios-text-muted)]">
                            Create New Workspace
                          </label>
                          {workspaces.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setShowNewWorkspaceForm(false)}
                              className="text-[10px] font-bold text-[var(--ios-text-muted)] hover:text-[var(--ios-text-primary)] cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>

                        <div className="flex flex-col gap-1">
                          <input
                            type="text"
                            placeholder="Workspace name (e.g. Outreach Campaigns)"
                            value={newWorkspace.name}
                            onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                            className="w-full bg-[var(--ios-input-bg)] text-[var(--ios-text-primary)] placeholder-[var(--ios-text-muted)] border border-[var(--ios-card-border)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ios-blue))] transition-all"
                            maxLength={40}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <textarea
                            placeholder="Description (optional)..."
                            value={newWorkspace.description}
                            onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                            className="w-full min-h-[50px] bg-[var(--ios-input-bg)] text-[var(--ios-text-primary)] placeholder-[var(--ios-text-muted)] border border-[var(--ios-card-border)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ios-blue))] transition-all resize-none"
                            maxLength={140}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-[var(--ios-text-muted)] uppercase tracking-wider">Workspace Color Theme</span>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {colorOptions.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setNewWorkspace({ ...newWorkspace, color: color })}
                                className="w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110"
                                style={{
                                  backgroundColor: `hsl(var(--ios-${color}))`,
                                  boxShadow: newWorkspace.color === color
                                    ? `0 0 0 2px var(--node-bg-color), 0 0 0 3px hsl(var(--ios-${color}))`
                                    : 'none'
                                }}
                              >
                                {newWorkspace.color === color && (
                                  <FiCheck className="text-white" size={9} />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Control Buttons */}
                    <div className="flex gap-2.5 pt-4 border-t border-[var(--ios-card-border)]">
                      <button
                        type="button"
                        onClick={() => setSelectedTemplate(null)}
                        className="ios-btn ios-btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicate()}
                        className="ios-btn ios-btn-primary flex-1"
                      >
                        {showNewWorkspaceForm || workspaces.length === 0 ? 'Create & Clone' : 'Clone Template'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesClientPage;
