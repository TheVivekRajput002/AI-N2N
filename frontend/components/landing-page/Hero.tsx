'use client';

import React from 'react';
import Link from 'next/link';
import StickyNote from './StickyNote';
import RemindersCard from './RemindersCard';
import TasksCard from './TasksCard';
import IntegrationsCard from './IntegrationsCard';
import heroData from '@/public/data/HeroSection.json';

export default function Hero() {
  return (
    <main className="relative z-10 pt-20 pb-32 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        {/* Central Icon Widget */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-4 rounded-2xl soft-shadow border border-slate-100 flex items-center justify-center w-20 h-20" data-purpose="central-icon">
            <img src="/icon.jpg" alt="N2N Ai Logo" className="logo-img" style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem' }} />
          </div>
        </div>

        {/* Main Copy */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6" style={{ lineHeight: 1.1 }}>
          {heroData.title} <br />
          <span className="text-slate-400 font-medium">{heroData.titleMuted}</span>
        </h1>
        
        <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto">
          {heroData.subtitle}
        </p>

        {/* CTA Button */}
        <div className="mb-20">
          <Link href="/workspaces">
            <button className="bg-[#1E75FF] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-600 transition-all soft-shadow cursor-pointer">
              {heroData.ctaText}
            </button>
          </Link>
        </div>
      </div>

      {/* Floating Widgets */}
      <StickyNote />
      <RemindersCard />
      <TasksCard />
      <IntegrationsCard />
    </main>
  );
}
