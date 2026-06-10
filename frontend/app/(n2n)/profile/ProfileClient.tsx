"use client"

import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiCopy, 
  FiCheck, 
  FiChevronRight, 
  FiShield, 
  FiLogOut, 
  FiFolder, 
  FiSliders, 
  FiActivity, 
  FiSun, 
  FiMoon, 
  FiAlertCircle 
} from 'react-icons/fi';
import { useUser, useClerk } from '@clerk/nextjs';

interface ProfileClientProps {
  initialUser: {
    id: string;
    clerkId: string;
    name: string;
    email: string;
    createdAt: string;
  } | null;
  initialWorkspaces: Array<{
    id: string;
    name: string;
    workflows?: any[];
  }> | null;
  error: string | null;
}

const ProfileClient = ({ initialUser, initialWorkspaces, error }: ProfileClientProps) => {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const clerk = useClerk();
  
  const [copiedId, setCopiedId] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Sync theme with localstorage / document element (same approach as Navbar)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setIsDark(savedTheme === 'dark');
      return;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    const themeName = nextDark ? 'dark' : 'light';
    document.documentElement.style.colorScheme = themeName;
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('theme', themeName);
  };

  const handleCopyId = (idString: string) => {
    navigator.clipboard.writeText(idString);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalWorkspaces = initialWorkspaces?.length ?? 0;
  const totalPipelines = initialWorkspaces?.reduce((acc, curr) => acc + (curr.workflows?.length ?? 0), 0) ?? 0;

  // Render loading state if Clerk or data isn't initialized
  const isLoading = !isClerkLoaded;

  return (
    <div className="flex-1 w-screen h-screen overflow-y-auto bg-[var(--app-bg-color)] transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16 flex flex-col gap-6 md:gap-8 select-none">
        
        {/* iOS Page Title */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--ios-text-primary)]">
              Profile
            </h1>
            <p className="text-xs md:text-sm text-[var(--ios-text-muted)] mt-1 font-medium">
              Manage your developer account credentials and preferences
            </p>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 bg-[hsla(var(--ios-red),0.1)] border border-[hsla(var(--ios-red),0.2)] text-[hsl(var(--ios-red))] rounded-2xl text-xs font-semibold flex items-center gap-2">
            <FiAlertCircle size={15} />
            <span>Database profile integration sync issue: Showing Clerk account details only.</span>
          </div>
        )}

        {/* ---------------- User Header Glass Card ---------------- */}
        <div className="p-6 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] flex flex-col md:flex-row items-center md:items-start gap-5 relative overflow-hidden transition-all duration-300">
          
          {/* Decorative subtle background blur sphere */}
          <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-[hsl(var(--ios-blue))]/10 blur-2xl pointer-events-none" />
          
          {/* User Avatar */}
          <div className="relative group">
            {isLoading ? (
              <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 animate-pulse border-2 border-[var(--ios-card-border)]" />
            ) : (
              <img
                src={user?.imageUrl || "/default-avatar.png"}
                alt={user?.fullName || "User Avatar"}
                className="w-20 h-20 rounded-full object-cover border-2 border-[var(--ios-card-border)] shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            )}
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-[var(--node-bg-color)] rounded-full shadow-sm" />
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left flex flex-col gap-2 z-10">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[var(--ios-text-primary)] tracking-tight">
                {isLoading ? (
                  <span className="inline-block w-40 h-6 bg-black/5 dark:bg-white/5 animate-pulse rounded" />
                ) : (
                  user?.fullName || initialUser?.name || 'Developer User'
                )}
              </h2>
              <p className="text-xs md:text-sm text-[var(--ios-text-muted)] font-medium mt-0.5">
                {isLoading ? (
                  <span className="inline-block w-48 h-4 bg-black/5 dark:bg-white/5 animate-pulse rounded" />
                ) : (
                  user?.primaryEmailAddress?.emailAddress || initialUser?.email || 'N/A'
                )}
              </p>
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[hsla(var(--ios-blue),0.12)] text-[hsl(var(--ios-blue))]">
                Developer Tier
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 text-[var(--ios-text-primary)]">
                Active Session
              </span>
            </div>
          </div>
        </div>

        {/* ---------------- Core Statistics Grid ---------------- */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 select-none">
          {/* Workspaces Card */}
          <div className="p-4 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-2xl text-center backdrop-blur-md shadow-[var(--ios-card-shadow)] hover:shadow-md transition-shadow">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[var(--ios-text-muted)] block">
              Workspaces
            </span>
            <span className="text-xl md:text-2xl font-extrabold text-[var(--ios-text-primary)] mt-1 block">
              {totalWorkspaces}
            </span>
            <div className="mt-2 flex justify-center text-[hsl(var(--ios-blue))] opacity-80">
              <FiFolder size={16} />
            </div>
          </div>

          {/* Pipelines Card */}
          <div className="p-4 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-2xl text-center backdrop-blur-md shadow-[var(--ios-card-shadow)] hover:shadow-md transition-shadow">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[var(--ios-text-muted)] block">
              Pipelines
            </span>
            <span className="text-xl md:text-2xl font-extrabold text-[var(--ios-text-primary)] mt-1 block">
              {totalPipelines}
            </span>
            <div className="mt-2 flex justify-center text-[hsl(var(--ios-purple))] opacity-80">
              <FiSliders size={16} />
            </div>
          </div>

          {/* Connection Card */}
          <div className="p-4 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-2xl text-center backdrop-blur-md shadow-[var(--ios-card-shadow)] hover:shadow-md transition-shadow">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[var(--ios-text-muted)] block">
              API Status
            </span>
            <span className="text-xl md:text-2xl font-extrabold text-green-500 mt-1 block">
              Active
            </span>
            <div className="mt-2 flex justify-center text-green-500 opacity-80">
              <FiActivity size={16} />
            </div>
          </div>
        </div>

        {/* ---------------- iOS Settings lists ---------------- */}
        <div className="flex flex-col gap-6">

          {/* Account Details Group */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--ios-text-muted)] px-4 mb-2">
              Account Metadata
            </h3>
            <div className="bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-2xl backdrop-blur-md shadow-[var(--ios-card-shadow)] overflow-hidden divide-y divide-[var(--ios-card-border)] text-sm">
              
              {/* Display Name */}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-semibold text-[var(--ios-text-primary)]">Display Name</span>
                <span className="text-[var(--ios-text-muted)]">
                  {isLoading ? '...' : (user?.fullName || initialUser?.name || 'N/A')}
                </span>
              </div>

              {/* Email Address */}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-semibold text-[var(--ios-text-primary)]">Primary Email</span>
                <span className="text-[var(--ios-text-muted)] font-medium">
                  {isLoading ? '...' : (user?.primaryEmailAddress?.emailAddress || initialUser?.email || 'N/A')}
                </span>
              </div>

              {/* Joined Date */}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-semibold text-[var(--ios-text-primary)]">Joined Date</span>
                <span className="text-[var(--ios-text-muted)]">
                  {isLoading ? '...' : formatDate(initialUser?.createdAt || user?.createdAt?.toISOString())}
                </span>
              </div>

              {/* Account Database ID */}
              {initialUser?.id && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-semibold text-[var(--ios-text-primary)]">Workspace User ID</span>
                  <button 
                    onClick={() => handleCopyId(initialUser.id)}
                    className="flex items-center gap-1.5 text-xs text-[hsl(var(--ios-blue))] bg-[hsl(var(--ios-blue))]/10 hover:bg-[hsl(var(--ios-blue))]/20 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer font-bold"
                  >
                    {copiedId ? (
                      <>
                        <FiCheck className="text-green-500" size={12} />
                        <span className="text-green-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <FiCopy size={12} />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Preferences Group */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--ios-text-muted)] px-4 mb-2">
              System Settings & Preferences
            </h3>
            <div className="bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-2xl backdrop-blur-md shadow-[var(--ios-card-shadow)] overflow-hidden divide-y divide-[var(--ios-card-border)] text-sm">
              
              {/* Appearance Mode */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--ios-text-primary)]">
                    {isDark ? <FiMoon size={16} /> : <FiSun size={16} />}
                  </span>
                  <span className="font-semibold text-[var(--ios-text-primary)]">Dark Mode</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isDark ? 'bg-[hsl(var(--ios-blue))]' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isDark ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Clerk Settings Redirection Row */}
              <div 
                onClick={() => clerk.openUserProfile()}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[hsl(var(--ios-blue))]">
                    <FiShield size={16} />
                  </span>
                  <span className="font-semibold text-[var(--ios-text-primary)]">Manage Credentials & Security</span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--ios-text-muted)] text-xs">
                  <span>Clerk Profile</span>
                  <FiChevronRight size={14} />
                </div>
              </div>

            </div>
          </div>

          {/* Danger zone / Logout Group */}
          <div>
            <div className="bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-2xl backdrop-blur-md shadow-[var(--ios-card-shadow)] overflow-hidden">
              <button
                onClick={() => clerk.signOut()}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 hover:bg-[hsla(var(--ios-red),0.05)] text-[hsl(var(--ios-red))] hover:text-[hsl(var(--ios-red))] font-bold text-sm cursor-pointer active:scale-[0.99] transition-all"
              >
                <FiLogOut size={16} />
                <span>Sign Out Account</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfileClient;
