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
import { apiGet } from '@/utils/api';
import Link from 'next/link';

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

  const [workflowName, setWorkflowName] = useState<string>('Simple Workflow Template');
  const [workspaceName, setWorkspaceName] = useState<string>('Templates');

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

  const handleSave = async () => {
    try {
      await saveFlow(reactFlowInstance, workflowId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="ios-topbar w-[calc(100vw-88px)] mx-2 flex items-center justify-between px-4 py-2 h-12 select-none z-50">

      {/* ================= Left: Core Actions ================= */}
      <div className="flex items-center gap-3">

        {/* Core Editor Actions */}
        <div className="flex items-center gap-1">
          <button
            // onClick={}
            className="ios-topbar-btn"
            title="Back to workspace"
          >
            <IoPlayOutline size={19} />
          </button>

          <button
            onClick={handleSave}
            className="ios-topbar-btn"
            title="Save workflow"
          >
            <FiSave size={16} />
          </button>

          <button
            onClick={onUndo}
            className="ios-topbar-btn"
            title="Undo"
          >
            <FiRotateCcw size={16} />
          </button>

          <button
            onClick={onRedo}
            className="ios-topbar-btn"
            title="Redo"
          >
            <FiRotateCw size={16} />
          </button>
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
        {/* Share & Branch Pill Container */}
        <div className="ios-topbar-pill">
          {/* Share Button (Blue Circle) */}
          <button
            onClick={onShare}
            className="ios-topbar-share-btn"
            title="Share workflow"
          >
            <FiShare2 size={12.5} />
          </button>

          {/* Deploy / Branch Details Button */}
          <button
            onClick={onDeploy}
            className="w-6 h-6 flex items-center justify-center rounded-md text-[var(--ios-topbar-icon-color)] hover:text-[var(--ios-topbar-icon)] transition-colors active:scale-95"
            title="Workflow branches & deployments"
          >
            <FiGitBranch size={14.5} />
          </button>
        </div>

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