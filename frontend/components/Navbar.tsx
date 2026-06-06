"use client"
import React, { useState } from 'react';
import { FiGitBranch, FiHome, FiSettings, FiBell, FiHelpCircle, FiUser } from 'react-icons/fi';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import Link from 'next/link'
import toggleTheme from '@/hooks/toggleTheme';
import { usePathname } from 'next/navigation'

export const Navbar = () => {
    const pathname = usePathname()

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
        <div className="flex flex-col justify-between py-2 z-50 items-center bg-[var(--navbar-bg-color)] h-[100vh] border-r border-[var(--navbar-border-color)] shadow-sm select-none w-16 " >

            {/* ================= Logo Section =========================*/}

            <div className=" flex items-center justify-center mb-6 relative group" >
                VS
                < span className="absolute left-[80px] bg-[var(--navbar-tooltip-bg)] text-[var(--navbar-tooltip-text)] text-xs px-2.5 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50" >
                    VectorShift
                </span>
            </div>

            {/* ===================== Navigation Items Top Section ================= */}

            < div className=" flex-1 flex flex-col items-center gap-2 w-full px-2" >
                {
                    navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                href={item.href}
                                key={item.id}

                                className={`vs-nav-item relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'active bg-[var(--navbar-item-active-bg)] text-[var(--navbar-item-active-text)] font-semibold'
                                    : 'text-[var(--navbar-item-text)] hover:bg-[var(--navbar-item-hover-bg)] hover:text-[var(--navbar-item-hover-text)]'
                                    }`}
                            >
                                <Icon size={19} />
                                
                                < span className=" absolute left-[60px] bg-[var(--navbar-tooltip-bg)] text-[var(--navbar-tooltip-text)] text-xs px-2.5 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50" >
                                    {item.label}
                                </span>

                                {
                                    isActive && (
                                        <div className="vs-active-indicator absolute left-[-8px] top-1/4 bottom-1/4 w-[3px] bg-[var(--navbar-item-active-text)] rounded-r" />
                                    )
                                }
                            </Link>
                        );
                    })}
            </div>

            {/* ============================ Navigation Items Bottom Section ===================== */}

            < div className=" flex flex-col items-center gap-2 w-full px-2 mt-auto" >
                {
                    bottomItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                onClick={item.id == 'help' ? () => { toggleTheme() } : () => { }}
                                key={item.id}
                                className="vs-nav-item relative flex items-center justify-center w-11 h-11 rounded-xl text-[var(--navbar-item-text)] hover:bg-[var(--navbar-item-hover-bg)] hover:text-[var(--navbar-item-hover-text)] transition-all duration-200 group"
                            >
                                {
                                    <Icon size={19} />
                                }


                                < span className="absolute left-[60px] bg-[var(--navbar-tooltip-bg)] text-[var(--navbar-tooltip-text)] text-xs px-2.5 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50" >
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}

                {/* User Profile Avatar */}
                <button className=" relative flex items-center justify-center w-9 h-9 rounded-full bg-[var(--navbar-avatar-bg)] text-[var(--navbar-avatar-text)] border border-[var(--navbar-avatar-border)] mt-2 mb-2 hover:bg-[var(--navbar-avatar-hover-bg)] transition-colors duration-200 group" >
                    <FiUser size={16} />
                    {/* Tooltip */}
                    < span className=" absolute left-[60px] bg-[var(--navbar-tooltip-bg)] text-[var(--navbar-tooltip-text)] text-xs px-2.5 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50" >
                        Profile
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Navbar