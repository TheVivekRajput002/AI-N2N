import React from 'react';
import heroData from '@/public/data/HeroSection.json';

export default function TasksCard() {
  return (
    <div className="absolute bottom-20 hidden lg:block w-72 left-[2%]" data-purpose="tasks-widget">
      <div className="bg-[#F1F3F6] p-6 rounded-[2rem] soft-shadow border border-white">
        <h3 className="text-sm font-bold mb-4 text-slate-700">{heroData.tasksCard.title}</h3>
        <div className="space-y-4">
          {heroData.tasksCard.tasks.map((task, index) => {
            const badgeBgColor = task.badgeClass === 'badge-red' ? 'bg-red-500' : 'bg-green-500';
            const progressBgColor = task.badgeClass === 'badge-red' ? 'bg-blue-400' : 'bg-sky-400';
            
            return (
              <div key={index} className="bg-white p-3 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`${badgeBgColor} text-white text-[10px] w-4 h-4 flex items-center justify-center rounded`}>
                      {task.badge}
                    </span>
                    <span className="text-[11px] font-bold text-slate-800">{task.text}</span>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-5 h-5 rounded-full bg-slate-200 border border-white"></div>
                    <div className="w-5 h-5 rounded-full bg-slate-300 border border-white"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-slate-400 whitespace-nowrap">{task.date}</span>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`${progressBgColor} h-full`} style={{ width: `${task.progress}%` }}></div>
                  </div>
                  <span className="text-[9px] text-slate-400">{task.progressText || `${task.progress}%`}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
