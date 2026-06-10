import React from 'react';
import heroData from '@/public/data/HeroSection.json';

export default function IntegrationsCard() {
  return (
    <div className="absolute bottom-20 hidden lg:block w-72 right-[2%]" data-purpose="integrations-widget">
      <div className="bg-[#F1F3F6] p-6 rounded-[2rem] soft-shadow border border-white">
        <h3 className="text-sm font-bold mb-6 text-slate-700">{heroData.integrations.title}</h3>
        <div className="flex items-center justify-center gap-3">
          {/* Gmail */}
          <div className="bg-white p-3 rounded-2xl soft-shadow border border-white w-16 h-16 flex items-center justify-center -rotate-6">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.39l-9 6.58-9-6.58V21H1.5C.65 21 0 20.35 0 19.5v-15c0-1.17 1.26-1.88 2.25-1.17L12 10.51l9.75-7.18c.99-.71 2.25 0 2.25 1.17z" fill="#EA4335"></path>
            </svg>
          </div>
          {/* Slack */}
          <div className="bg-white p-3 rounded-2xl soft-shadow border border-white w-16 h-16 flex items-center justify-center rotate-3">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52h6.313a2.528 2.528 0 0 1 0 5.045H8.834a2.528 2.528 0 0 1-2.521-2.525zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521v6.313a2.528 2.528 0 0 1-5.042 0V8.834a2.528 2.528 0 0 1 2.521-2.521zM18.958 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.52 2.52h-2.522v-2.52zM17.687 8.834a2.528 2.528 0 0 1-2.521 2.521H8.853a2.528 2.528 0 0 1 0-5.042h6.313a2.528 2.528 0 0 1 2.521 2.521zM15.165 18.958a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.165 24a2.528 2.528 0 0 1-2.522-2.52v-2.522h2.522zM15.165 17.687a2.528 2.528 0 0 1-2.522-2.521V8.853a2.528 2.528 0 0 1 5.045 0v6.313a2.528 2.528 0 0 1-2.523 2.521z" fill="#4A154B"></path>
            </svg>
          </div>
          {/* Google Calendar */}
          <div className="bg-white p-3 rounded-2xl soft-shadow border border-white w-16 h-16 flex items-center justify-center -rotate-3">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path d="M12.5 12.5h10V21c0 .828-.672 1.5-1.5 1.5H3c-.828 0-1.5-.672-1.5-1.5V5.5c0-.828.672-1.5 1.5-1.5h7.5v8.5z" fill="#4285F4"></path>
              <path d="M22.5 5.5V11h-10V1.5H21c.828 0 1.5.672 1.5 1.5z" fill="#34A853"></path>
              <path d="M12.5 1.5v11h-11v-7c0-.828.672-1.5 1.5-1.5h9.5z" fill="#FBBC05"></path>
              <path d="M1.5 12.5h11v10h-9.5c-.828 0-1.5-.672-1.5-1.5v-8.5z" fill="#EA4335"></path>
              <text fill="#FFFFFF" fontFamily="Arial" fontSize="7" fontWeight="bold" textAnchor="middle" x="12" y="18">31</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
