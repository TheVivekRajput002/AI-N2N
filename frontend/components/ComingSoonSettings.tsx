"use client";

import React, { useState, useEffect } from 'react';

export default function ComingSoonSettings() {
  const [notify, setNotify] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '.' : prev + '.'));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[var(--app-bg-color)] px-4 select-none transition-colors duration-300">
      <div className="flex flex-col items-center gap-6 max-w-sm w-full text-center">
        {/* Simple "coming soon" text */}
        <h1 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-[var(--ios-text-primary)] transition-all duration-300">
          coming soon
        </h1>
        
        <p className="text-sm text-[var(--ios-text-muted)] font-light max-w-xs leading-relaxed flex items-center justify-center">
          <span>we are building something new</span>
          <span className="inline-block w-8 text-left ml-0.5">{dots}</span>
        </p>

        {/* Interactive toggle */}
        {/* <div className="flex flex-col items-center gap-4 w-full mt-4">
          <div className="flex items-center gap-3 bg-[var(--ios-card-bg)] backdrop-blur-md border border-[var(--ios-card-border)] rounded-full px-4 py-2 shadow-sm transition-all duration-300">
            <span className="text-xs text-[var(--ios-text-primary)] font-light">
              notify me
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={notify}
              onClick={() => setNotify(!notify)}
              className={`w-10 h-5.5 rounded-full flex items-center p-0.5 transition-colors duration-300 outline-none cursor-pointer ${
                notify ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-800'
              }`}
            >
              <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${
                notify ? 'translate-x-4.5' : 'translate-x-0'
              }`} />
            </button>
          </div>

       
          <div className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${
            notify && !submitted ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0'
          }`}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes('@')) {
                  setSubmitted(true);
                }
              }}
              className="flex items-center bg-[var(--ios-card-bg)] backdrop-blur-md border border-[var(--ios-card-border)] rounded-xl p-1 shadow-sm w-full"
            >
              <input 
                type="email"
                required
                placeholder="developer@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-xs py-2 px-3 text-[var(--ios-text-primary)] placeholder-[var(--ios-text-muted)] outline-none border-none font-light"
              />
              <button 
                type="submit"
                className="bg-[var(--ios-text-primary)] text-[var(--app-bg-color)] rounded-lg px-4 py-2 text-xs font-medium hover:opacity-90 active:scale-95 transition-all duration-200"
              >
                submit
              </button>
            </form>
          </div>

         
          {notify && submitted && (
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-light mt-2 animate-fade-in">
              <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>we will email you</span>
            </div>
          )}
        </div> */}
        
      </div>
    </div>
  );
}
