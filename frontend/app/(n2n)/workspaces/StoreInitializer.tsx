"use client";

import { useRef } from "react";
import { useWorkspace, WorkspaceType } from "../../../utils/store";

export function StoreInitializer({ workspaces }: { workspaces: WorkspaceType[] }) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useWorkspace.setState({ workspaces });
    initialized.current = true;
  }
  return null;
}
