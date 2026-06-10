import React from 'react';
import heroData from '@/public/data/HeroSection.json';

export default function RemindersCard() {
  return (
    <div className="absolute top-20 right-[5%] hidden lg:block w-64" data-purpose="reminders-widget">
      <div className="bg-white p-5 rounded-[2rem] soft-shadow border border-slate-50 rotate-2">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {heroData.reminders.title}
          </span>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">
              {heroData.reminders.subtitle}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            {heroData.reminders.meetingTitle}
          </h4>
          <p className="text-[10px] text-slate-400 mb-3">
            {heroData.reminders.meetingDesc}
          </p>
          <div className="flex items-center text-blue-500 text-[10px] font-bold">
            <span className="bg-blue-50 px-2 py-1 rounded-md flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              {heroData.reminders.meetingTime}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute -top-6 -left-8 bg-white p-3 rounded-2xl soft-shadow border border-slate-100 -rotate-12">
        <div className="w-10 h-10 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
            <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}