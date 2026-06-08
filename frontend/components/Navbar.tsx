"use client"
import React, { useState, useEffect } from 'react';
import { FiGitBranch, FiHome, FiSettings, FiBell, FiHelpCircle, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import Link from 'next/link';
import toggleTheme from '@/hooks/toggleTheme';
import { usePathname } from 'next/navigation';

// Custom high-fidelity VectorShift logo SVG (white color inside the gradient squircle)
const VectorShiftLogo = ({ className = "w-[22px] h-[16px]" }) => (
    <svg
        viewBox="0 0 32 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="2" y="12" width="6" height="14" rx="3" transform="rotate(-45 5 19)" />
        <rect x="10" y="6" width="6" height="20" rx="3" transform="rotate(-45 13 16)" />
        <rect x="18" y="2" width="6" height="8" rx="3" transform="rotate(-45 21 6)" />
    </svg>
);

export const Navbar = () => {
    const pathname = usePathname();
    const [isDark, setIsDark] = useState(false);

    // Read the dark mode state from document element once component mounts (avoiding SSR hydration mismatch)
    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const handleToggleTheme = () => {
        toggleTheme();
        setIsDark(document.documentElement.classList.contains('dark'));
    };

    const navItems = [
        { id: 'flow', icon: FiGitBranch, label: 'Pipelines', href: '/workspaces' },
        { id: 'home', icon: FiHome, label: 'Home', href: '/home' },
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
                <Link href="/home" className="ios-logo-container relative group">
                    <VectorShiftLogo />
                    <span className="ios-tooltip">
                        VectorShift
                    </span>
                </Link>
            </div>

            {/* ===================== Navigation Items Top Section ================= */}
            <div className="flex-1 flex flex-col items-center gap-3 w-full px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/home' && pathname?.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
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
                            onClick={() => {}}
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
                    onClick={handleToggleTheme}
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

                {/* User Profile Avatar */}
                <Link
                    href="/profile"
                    className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[var(--navbar-avatar-bg)] text-[var(--navbar-avatar-text)] border border-[var(--navbar-avatar-border)] mt-2 hover:bg-[var(--navbar-avatar-hover-bg)] transition-all duration-200 shadow-sm active:scale-95 group"
                >
                    <FiUser size={16} />
                    <span className="ios-tooltip">
                        Profile
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;