import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { apiGet } from '@/utils/api';
import { WorkspacesResponse } from '@/utils/store';
import TemplatesClientPage from './TemplatesClientPage';

const Page = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  let workspaces: any[] = [];
  
  try {
    const response = await apiGet<WorkspacesResponse>('/workspaces', token);
    workspaces = response.workspaces || [];
  } catch (err) {
    console.error("Failed to load workspaces for templates page:", err);
  }

  return (
    <TemplatesClientPage initialWorkspaces={workspaces} />
  );
};

export default Page;