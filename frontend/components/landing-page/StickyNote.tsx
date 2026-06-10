import React from 'react';
import heroData from '@/public/data/HeroSection.json';

export default function StickyNote() {
  return (
    <div className="absolute top-20 left-[5%] hidden xl:block w-56 -rotate-3 hover:rotate-0 transition-transform duration-500" data-purpose="sticky-note-widget">
      <div className="bg-[#FFF8BC] p-6 rounded-sm soft-shadow relative aspect-square">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-inner border-2 border-red-700"></div>
        <p className="text-slate-800 text-sm font-medium leading-relaxed mt-2">
          {heroData.stickyNote.text}
        </p>
      </div>
      <div className="absolute -bottom-10 -right-6 bg-white p-4 rounded-2xl soft-shadow border border-slate-100 rotate-6">
        <div className="bg-blue-600 w-8 h-8 rounded-md flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
