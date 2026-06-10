'use client';

import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="relative z-50 px-6 py-4 md:px-12 lg:px-20" data-purpose="main-header">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2" data-purpose="brand-logo">
          <img src="/icon.jpg" alt="N2N Ai Logo" className="logo-img" style={{ width: '2.15rem', height: '2.15rem', borderRadius: '0.375rem' }} />
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-600">N2N Ai</span>
        </Link>

        {/* Nav Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          <a className="hover:text-blue-600 transition-colors" href="#">Home</a>
          <a className="hover:text-blue-600 transition-colors" href="#problems">Problems</a>
          <a className="hover:text-blue-600 transition-colors" href="#features">Features</a>
        </div>


        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Show when="signed-out">
            <SignInButton forceRedirectUrl="/workspaces">
              <button className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">Sign in</button>
            </SignInButton>
            <SignUpButton forceRedirectUrl="/workspaces">
              <button className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all soft-shadow cursor-pointer">Get demo</button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link href="/workspaces" prefetch={true} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all soft-shadow" style={{ marginRight: '0.5rem' }}>
              Go to Dashboard
            </Link>
            <UserButton />
          </Show>
        </div>
      </nav>
    </header>
  );
}
