"use client"
import React, { useState, useEffect } from 'react';
import { FiGitBranch, FiHome, FiSettings, FiBell, FiHelpCircle, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import Link from 'next/link';
import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { TbGridScan } from "react-icons/tb";

// Custom high-fidelity AI N2N brand logo SVG
const N2NLogo = ({ className = "w-[24px] h-[24px]" }) => (
    <svg
        viewBox="0 0 100 100"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <g stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round">
            {/* Top Chevron */}
            <path d="M 28 18 L 50 40 L 72 18" />
            {/* Right Chevron */}
            <path d="M 82 28 L 60 50 L 82 72" />
            {/* Bottom Chevron */}
            <path d="M 72 82 L 50 60 L 28 82" />
            {/* Left Chevron */}
            <path d="M 18 72 L 40 50 L 18 28" />
        </g>
    </svg>
);


export const Navbar = () => {
    const pathname = usePathname();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'dark' || savedTheme === 'light') {
            setIsDark(savedTheme === 'dark')
            return
        }

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setIsDark(prefersDark)
    }, [])

    useEffect(() => {
        const themeName = isDark ? 'dark' : 'light'
        document.documentElement.style.colorScheme = themeName
        document.documentElement.classList.toggle('dark', isDark)
        localStorage.setItem('theme', themeName)
    }, [isDark])

    const toggleTheme = useCallback(() => {
        setIsDark((prev) => !prev)
    }, [])

    const navItems = [
        { id: 'flow', icon: FiGitBranch, label: 'Pipelines', href: '/workspaces' },
        { id: 'template', icon: TbGridScan, label: 'Templates', href: '/templates' },
        { id: 'settings', icon: FiSettings, label: 'Settings', href: '/settings' },
        { id: 'dashboard', icon: MdOutlineSpaceDashboard, label: 'Dashboard', href: '/dashboard' },
        { id: 'profile', icon: CiUser, label: 'Profile', href: '/profile' },
    ];

    const bottomItems = [
        { id: 'notifications', icon: FiBell, label: 'Notifications', badge: 2 },
        { id: 'help', icon: FiHelpCircle, label: 'Help & Docs' },
    ];

    return (
        <div className="ios-navbar flex flex-col justify-between py-4 items-center h-screen select-none w-16 z-50">

            {/* ================= Logo Section =========================*/}
            <div className="flex items-center justify-center mb-6">
                <Link href="/dashboard" className="ios-logo-container overflow-hidden relative group">
                    <img 
                        src="/icon.jpg" 
                        alt="AI N2N Logo" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="ios-tooltip">
                        AI N2N
                    </span>
                </Link>
            </div>

            {/* ===================== Navigation Items Top Section ================= */}
            <div className="flex-1 flex flex-col items-center gap-3 w-full px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/templates' && pathname?.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            prefetch={item.id === 'flow'}
                            href={item.href}
                            key={item.id}
                            className={`ios-nav-item group ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={19} className="transition-transform duration-200 group-hover:scale-105" />
                            <span className="ios-tooltip">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* ============================ Navigation Items Bottom Section ===================== */}
            <div className="flex flex-col items-center gap-3 w-full px-2 mt-auto">
                {bottomItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            className="ios-nav-item group relative"
                            onClick={() => { }}
                        >
                            <Icon size={19} className="transition-transform duration-200 group-hover:scale-105" />

                            {item.badge && (
                                <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-[var(--navbar-bg-color)] transition-colors duration-300" />
                            )}

                            <span className="ios-tooltip">
                                {item.label}
                            </span>
                        </button>
                    );
                })}

                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="ios-nav-item ios-theme-toggle group animate-fade-in"
                    title="Toggle appearance"
                >
                    {isDark ? (
                        <FiSun size={19} className="text-amber-400" />
                    ) : (
                        <FiMoon size={19} className="text-slate-700" />
                    )}
                    <span className="ios-tooltip">
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Navbar;