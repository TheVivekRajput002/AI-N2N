import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { apiGet } from '@/utils/api';
import ProfileClient from './ProfileClient';

const Page = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  let userData = null;
  let workspacesData = null;
  let error = null;

  try {
    // Attempt to fetch profile info and workspaces concurrently
    const [userRes, workspacesRes] = await Promise.all([
      apiGet<any>('/auth', token),
      apiGet<any>('/workspaces', token)
    ]);
    
    userData = userRes?.user || null;
    workspacesData = workspacesRes?.workspaces || null;
  } catch (err: any) {
    console.error("Error fetching user profile server-side:", err);
    error = err?.message || String(err);
  }

  return (
    <ProfileClient 
      initialUser={userData} 
      initialWorkspaces={workspacesData} 
      error={error} 
    />
  );
};

export default Page;