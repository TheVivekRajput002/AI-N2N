"use client"

import React, { useState, useEffect } from 'react';
import {
  FiSave,
  FiFolder,
  FiRotateCcw,
  FiRotateCw,
  FiChevronDown,
  FiShare2,
  FiGitBranch,
  FiMoreVertical,
  FiChevronLeft
} from 'react-icons/fi';
import { IoPlayOutline } from "react-icons/io5";
import { useFlowState } from '@/hooks/useFlowState';
import { useReactFlow } from '@xyflow/react';
import { useRouter, useParams } from 'next/navigation';
import { apiGet, apiPost } from '@/utils/api';
import Link from 'next/link';
import { useToast } from '@/hooks/useToast';
import { useExecutionStore } from '@/utils/store';

const Topbar = ({
  onOpenFolder = () => {},
  onUndo = () => {},
  onRedo = () => {},
  onShare = () => {},
  onDeploy = () => {},
  onMoreActions = () => {}
}: {
  onOpenFolder?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onShare?: () => void;
  onDeploy?: () => void;
  onMoreActions?: () => void;
} = {}) => {

  const router = useRouter();
  const { workspaceId, workflowId } = useParams() as { workspaceId: string; workflowId: string };

  const { saveFlow } = useFlowState();
  const reactFlowInstance = useReactFlow();
  const { showToast } = useToast();

  const [workflowName, setWorkflowName] = useState<string>('Simple Workflow Template');
  const [workspaceName, setWorkspaceName] = useState<string>('Templates');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!workflowId) return;

    let isMounted = true;
    const fetchNames = async () => {
      try {
        const response = await apiGet<{
          success: boolean;
          workflowName?: string;
          workspaceName?: string;
        }>(`/workflow-version?workflowId=${workflowId}`);

        if (response.success && isMounted) {
          if (response.workflowName) setWorkflowName(response.workflowName);
          if (response.workspaceName) setWorkspaceName(response.workspaceName);
        }
      } catch (err) {
        console.error("Failed to fetch workflow / workspace names:", err);
      }
    };

    fetchNames();
    return () => {
      isMounted = false;
    };
  }, [workflowId]);

  const handleSave = async (options?: { silent?: boolean }) => {
    try {
      await saveFlow(reactFlowInstance, workflowId, options);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlay = async () => {
    if (isRunning) return;
    setIsRunning(true);
    try {
      // 1. Save flow first silently
      await handleSave({ silent: true });

      // 2. Call the execution endpoint
      const response = await apiPost<{
        success: boolean;
        execution?: {
          status: string;
          error?: string | null;
          versionId: string;
          totalDuration?: number;
          nodeExecutions: Array<{
            nodeId: string;
            status: string;
            output: any;
            error: string | null;
          }>;
        };
        error?: string;
      }>(`/executions/workflow/${workflowId}`, {});

      if (response.execution) {
        // Update execution store with execution details
        useExecutionStore.getState().setExecutionDetails(
          response.execution.totalDuration ?? null,
          response.execution.status ?? null
        );

        const nodeExecutions = response.execution.nodeExecutions;
        const currentFlow = reactFlowInstance.toObject();

        // 3. Update the nodes on canvas with outputs
        const updatedNodes = currentFlow.nodes.map((node) => {
          const exec = nodeExecutions.find((ne) => ne.nodeId === node.id);
          if (exec) {
            return {
              ...node,
              data: {
                ...node.data,
                nodeData: {
                  ...(node.data.nodeData || {}),
                  output: exec.status === "SUCCESS" ? exec.output : `Error: ${exec.error || "Failed"}`
                }
              }
            };
          }
          return node;
        });

        reactFlowInstance.setNodes(updatedNodes);

        await apiPost(`/workflow-version/update`, {
          graph: {
            ...currentFlow,
            nodes: updatedNodes
          },
          versionId: response.execution.versionId
        });
      }

      if (response.success) {
        showToast("Workflow executed successfully!", "success");
      } else {
        showToast(`Workflow execution failed: ${response.error || "Unknown error"}`, "error");
      }
    } catch (err: any) {
      console.error("Workflow execution failed:", err);
      showToast(`Workflow execution failed: ${err.message || String(err)}`, "error");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <header className="ios-topbar w-[calc(100vw-88px)] mx-2 flex items-center justify-between px-4 py-2 h-12 select-none z-50">

      {/* ================= Left: Core Actions ================= */}
      <div className="flex items-center gap-3">

        {/* Core Editor Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePlay}
            disabled={isRunning}
            className="ios-topbar-btn"
            title={isRunning ? "Running..." : "Run workflow"}
          >
            <IoPlayOutline size={19} className={isRunning ? "animate-spin text-emerald-500" : ""} />
          </button>

          <button
            onClick={() => handleSave()}
            disabled={isRunning}
            className="ios-topbar-btn"
            title="Save workflow"
          >
            <FiSave size={16} />
          </button>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('flow-restore'));
              onUndo();
            }}
            className="ios-topbar-btn"
            title="Undo"
          >
            <FiRotateCcw size={16} />
          </button>

          {/* <button
            onClick={onRedo}
            className="ios-topbar-btn"
            title="Redo"
          >
            <FiRotateCw size={16} />
          </button> */}
          
        </div>

      </div>

      {/* ================= Center: Breadcrumbs & Title ================= */}
      <Link
        className="ios-topbar-center-container"
        title="Workflow details"
        href={`/workspaces/${workspaceId}`}
      >
        <span className="text-[12px] font-normal text-[var(--ios-topbar-text-muted)] tracking-tight">
          {workspaceName}
        </span>
        <span className="text-[12px] text-[var(--ios-topbar-border)] font-light">/</span>
        <span className="text-[13px] font-semibold text-[var(--ios-topbar-text)] tracking-tight">
          {workflowName}
        </span>
        <FiChevronDown
          size={13}
          className="text-[var(--ios-topbar-text-muted)] transition-colors ml-0.5"
        />
      </Link>

      {/* ================= Right: Core Canvas / Share / Deploy Actions ================= */}
      <div className="flex items-center gap-2">
      
        {/* More Actions Menu */}
        <button
          onClick={onMoreActions}
          className="ios-topbar-btn"
          title="More actions"
        >
          <FiMoreVertical size={16.5} />
        </button>
      </div>

    </header>
  );
};

export default Topbar;