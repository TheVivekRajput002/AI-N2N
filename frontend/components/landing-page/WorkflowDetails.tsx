'use client';

import React, { useState } from 'react';
import workflowData from '@/public/data/WorkflowDetails.json';

export default function WorkflowDetails() {
  // Simple state for checkboxes to match original micro-interactions
  const [task1Checked, setTask1Checked] = useState(workflowData.dashboard.todoTasks[0].checked);
  const [task2Checked, setTask2Checked] = useState(workflowData.dashboard.todoTasks[1].checked);
  const [task3Checked, setTask3Checked] = useState(workflowData.dashboard.todoTasks[2].checked);

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased">
      <main className="dot-grid pt-32 pb-32">
        {/* Section 1: Challenges */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-stack-lg">
          <div className="text-center mb-16">
            <span className="bg-surface-container-high text-primary font-label-md text-label-md px-4 py-1 rounded-full mb-4 inline-block">
              {workflowData.solutions.badge}
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-12">
              {workflowData.solutions.title}
            </h1>
            {/* Challenge Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left max-w-4xl mx-auto">
              {workflowData.solutions.challenges.map((challenge, i) => (
                <div 
                  key={i} 
                  className={`space-y-3 ${i > 0 ? 'border-l-0 md:border-l border-outline-variant md:pl-8' : ''}`}
                >
                  <div className={challenge.colorClass}>
                    <span className="material-symbols-outlined text-3xl">{challenge.icon}</span>
                  </div>
                  <p className="font-body-md text-on-surface-variant leading-relaxed">
                    {challenge.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Hero Card */}
          <div className="relative max-w-5xl mx-auto">
            {/* Floating Elements */}
            <div 
              className="absolute -left-8 top-1/4 z-20 bg-white rounded-2xl p-4 floating-shadow hidden md:block animate-bounce border border-slate-100" 
              style={{ animationDuration: '4s' }}
            >
              <span className="text-4xl font-bold text-on-surface">20</span>
            </div>
            <div className="absolute -right-6 top-12 z-20 bg-white rounded-2xl p-4 floating-shadow hidden md:block border border-slate-100">
              <div className="w-10 h-10 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined">check</span>
              </div>
            </div>

            {/* Main UI Container */}
            <div className="bg-primary/5 rounded-[48px] p-4 md:p-8 ambient-shadow border border-white/50 backdrop-blur-sm overflow-hidden">
              <div className="bg-white rounded-3xl overflow-hidden border border-outline-variant flex flex-col md:flex-row h-[700px] shadow-2xl">
                
                {/* UI Sidebar (Simplified) */}
                <div className="w-64 border-r border-outline-variant bg-surface p-6 flex-shrink-0 hidden md:block">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-primary rounded-lg"></div>
                    <span className="font-bold">{workflowData.dashboard.sidebar.brand}</span>
                  </div>
                  <div className="space-y-6">
                    <button className="w-full bg-white border border-outline-variant rounded-lg py-2 flex items-center justify-center gap-2 font-label-md cursor-pointer hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined text-sm">add</span> {workflowData.dashboard.sidebar.createBtn}
                    </button>
                    <div className="space-y-2">
                      {workflowData.dashboard.sidebar.menu.map((item, i) => (
                        <div 
                          key={i} 
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                            item.active 
                              ? 'text-primary bg-primary/10 font-semibold' 
                              : 'text-on-surface-variant hover:bg-slate-50 transition-colors'
                          }`}
                        >
                          <span className="material-symbols-outlined">{item.icon}</span> {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* UI Main Content Area */}
                <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-[#FAFBFF]">
                  <header className="h-16 border-b border-outline-variant flex items-center justify-between px-8 bg-white/50 sticky top-0 backdrop-blur-sm z-10">
                    <div className="font-label-md text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined">calendar_today</span> {workflowData.dashboard.header.calendar}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">search</span>
                      <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">notifications</span>
                      <div className="w-8 h-8 rounded-full bg-surface-dim overflow-hidden border border-slate-200">
                        <img 
                          alt="Profile" 
                          src={workflowData.dashboard.header.profileImg} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </header>

                  <div className="p-8">
                    <div className="flex justify-between items-end mb-8">
                      <h2 className="font-headline-md text-headline-md">
                        {workflowData.dashboard.greeting} <span className="text-on-surface">{workflowData.dashboard.username}</span>
                      </h2>
                      <button className="bg-surface-container-high px-4 py-1.5 rounded-full text-label-sm font-label-sm flex items-center gap-2 cursor-pointer hover:brightness-95 transition-all">
                        <span className="material-symbols-outlined text-sm">auto_fix</span> Customize
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* To Do List */}
                      <div className="col-span-1 bg-white rounded-2xl p-6 ambient-shadow border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="font-label-md font-bold flex items-center gap-2">
                            <span className="text-xl">✏️</span> {workflowData.dashboard.todoTitle}
                          </h3>
                        </div>
                        <div className="space-y-4">
                          <div className={`flex items-start gap-3 p-3 rounded-xl transition-all ${task1Checked ? 'border border-slate-100 opacity-60' : 'bg-surface'}`}>
                            <input 
                              type="checkbox" 
                              checked={task1Checked} 
                              onChange={() => setTask1Checked(!task1Checked)}
                              className="rounded text-primary focus:ring-primary mt-1 cursor-pointer w-4 h-4 border-slate-300"
                            />
                            <div className={`text-label-md text-on-surface-variant ${task1Checked ? 'line-through opacity-50' : ''}`}>
                              {workflowData.dashboard.todoTasks[0].text}
                            </div>
                          </div>
                          <div className={`flex items-start gap-3 p-3 rounded-xl transition-all ${task2Checked ? 'border border-slate-100 opacity-60' : 'bg-surface'}`}>
                            <input 
                              type="checkbox" 
                              checked={task2Checked} 
                              onChange={() => setTask2Checked(!task2Checked)}
                              className="rounded text-primary focus:ring-primary mt-1 cursor-pointer w-4 h-4 border-slate-300"
                            />
                            <div className={`text-label-md text-on-surface-variant ${task2Checked ? 'line-through opacity-50' : ''}`}>
                              {workflowData.dashboard.todoTasks[1].text}
                            </div>
                          </div>
                          <div className={`flex items-start gap-3 p-3 rounded-xl transition-all ${task3Checked ? 'border border-slate-100 opacity-60' : 'bg-surface'}`}>
                            <input 
                              type="checkbox" 
                              checked={task3Checked} 
                              onChange={() => setTask3Checked(!task3Checked)}
                              className="rounded text-primary focus:ring-primary mt-1 cursor-pointer w-4 h-4 border-slate-300"
                            />
                            <div className={`text-label-md text-on-surface-variant ${task3Checked ? 'line-through opacity-50' : ''}`}>
                              {workflowData.dashboard.todoTasks[2].text}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Time Tracker */}
                      <div className="col-span-1 bg-white rounded-2xl p-6 ambient-shadow flex flex-col items-center justify-center text-center border border-slate-100">
                        <h3 className="font-label-md text-on-surface-variant mb-6">{workflowData.dashboard.timerTitle}</h3>
                        <div className="text-5xl font-bold text-on-surface tracking-tighter mb-8 font-mono">
                          {workflowData.dashboard.timerValue}
                        </div>
                        <div className="flex gap-4">
                          <button className="w-12 h-12 bg-surface flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
                          </button>
                          <button className="w-12 h-12 bg-error-container text-error flex items-center justify-center rounded-full hover:brightness-95 transition-all cursor-pointer">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stop</span>
                          </button>
                        </div>
                      </div>

                      {/* Activity Ring */}
                      <div className="col-span-1 bg-white rounded-2xl p-6 ambient-shadow relative overflow-hidden border border-slate-100">
                        <h3 className="font-label-md text-on-surface-variant mb-4">{workflowData.dashboard.activityTitle}</h3>
                        <div className="flex justify-center py-4">
                          <div className="relative w-32 h-32">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="8"></circle>
                              <circle className="text-primary-container" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeDasharray="351.8" strokeDashoffset="80" strokeWidth="8"></circle>
                              <circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="44" stroke="currentColor" strokeWidth="8"></circle>
                              <circle className="text-secondary-container" cx="64" cy="64" fill="transparent" r="44" stroke="currentColor" stroke-dasharray="276.4" stroke-dashoffset="100" stroke-width="8"></circle>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">{workflowData.dashboard.activityValue}</div>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                          {workflowData.dashboard.activityLegend.map((legend, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${legend.colorClass}`}></div> {legend.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Tasks I've assigned */}
                    <div className="bg-white rounded-2xl p-6 ambient-shadow border border-slate-100">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-label-md font-bold">{workflowData.dashboard.assignedTitle}</h3>
                        <div className="flex gap-4 text-label-sm text-on-surface-variant">
                          <span className="text-primary font-bold cursor-pointer">{workflowData.dashboard.assignedTabs[0]}</span>
                          <span className="cursor-pointer hover:text-slate-650">{workflowData.dashboard.assignedTabs[1]}</span>
                          <span className="cursor-pointer hover:text-slate-650">{workflowData.dashboard.assignedTabs[2]}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {workflowData.dashboard.assignedTasks.map((task, i) => (
                          <div 
                            key={task.id} 
                            className={`flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 ${
                              i === 0 ? 'bg-surface' : 'bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${task.badgeBg} ${task.badgeText}`}>
                                {task.badge}
                              </div>
                              <span className="font-label-md">{task.text}</span>
                            </div>
                            <div className="flex items-center gap-8">
                              <div className="w-48 h-2 bg-surface-container rounded-full overflow-hidden">
                                <div className="bg-primary h-full" style={{ width: task.progress }}></div>
                              </div>
                              <div className="flex -space-x-2">
                                {task.avatars.map((avatar, idx) => (
                                  <div key={idx} className="w-7 h-7 rounded-full border-2 border-white bg-surface-dim overflow-hidden">
                                    <img alt="User" className="w-full h-full object-cover" src={avatar} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Features Grid */}
        <section className="bg-surface-container-low/50 py-32 mt-32 relative overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16">
              <span className="bg-surface-container-high text-primary font-label-md text-label-md px-4 py-1 rounded-full mb-4 inline-block">
                {workflowData.featuresSection.badge}
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
                {workflowData.featuresSection.title}
              </h2>
              <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
                {workflowData.featuresSection.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-gutter">
              {/* Seamless Collaboration */}
              <div className="bg-white p-8 rounded-3xl ambient-shadow flex flex-col h-full border border-outline-variant/30">
                <div className="bg-surface-container-high rounded-2xl p-6 mb-8 relative flex-1 overflow-hidden min-h-[220px]">
                  <div className="bg-white rounded-xl shadow-lg p-4 w-5/6 mx-auto mt-4 border border-slate-105">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <span className="material-symbols-outlined text-primary text-lg">group</span> {workflowData.featuresSection.collaborationCard.teamName}
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
                    </div>
                    <div className="space-y-3">
                      {workflowData.featuresSection.collaborationCard.members.map((member, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-dim overflow-hidden">
                            <img alt="User" className="w-full h-full object-cover" src={member.img} />
                          </div>
                          <div className="text-xs font-semibold">{member.name}</div>
                        </div>
                      ))}
                      <div className="flex items-center gap-3 border-t border-outline-variant pt-2">
                        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center cursor-pointer">
                          <span className="material-symbols-outlined text-sm">add</span>
                        </div>
                        <div className="text-xs text-primary font-bold">{workflowData.featuresSection.collaborationCard.inviteText}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="font-headline-md text-headline-md mb-2">{workflowData.featuresSection.collaborationCard.title}</h3>
                <p className="font-body-md text-on-surface-variant">
                  {workflowData.featuresSection.collaborationCard.text}
                </p>
              </div>

              {/* Time Management Tools */}
              <div className="bg-white p-8 rounded-3xl ambient-shadow flex flex-col h-full border border-outline-variant/30">
                <div className="bg-surface-container-high rounded-2xl p-6 mb-8 relative flex-1 overflow-hidden min-h-[220px]">
                  <div className="flex gap-4 h-full">
                    <div className="flex-1 bg-white rounded-xl shadow-sm p-3 border border-slate-105">
                      <div className="text-[10px] font-bold mb-2">{workflowData.featuresSection.timeManagementCard.scheduleTitle}</div>
                      <div className="space-y-2">
                        {workflowData.featuresSection.timeManagementCard.items.map((item, i) => (
                          <div key={i} className={`p-2 rounded border-l-2 text-[8px] text-slate-800 ${item.colorClass}`}>
                            {item.text} <br /> {item.time}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-20 bg-white rounded-xl shadow-sm p-3 flex flex-col justify-end gap-1 border border-slate-105">
                      <div className="w-full bg-primary/20 h-1/2 rounded-t"></div>
                      <div className="w-full bg-primary/40 h-3/4 rounded-t"></div>
                      <div className="w-full bg-primary h-full rounded-t"></div>
                    </div>
                  </div>
                </div>
                <h3 className="font-headline-md text-headline-md mb-2">{workflowData.featuresSection.timeManagementCard.title}</h3>
                <p className="font-body-md text-on-surface-variant">
                  {workflowData.featuresSection.timeManagementCard.text}
                </p>
              </div>

              {/* Team Workload */}
              <div className="bg-white p-8 rounded-3xl ambient-shadow flex flex-col h-full border border-outline-variant/30">
                <div className="bg-surface-container-high rounded-2xl p-6 mb-8 relative flex-1 flex flex-col items-center justify-center overflow-hidden min-h-[220px]">
                  <div className="bg-white rounded-full w-32 h-32 shadow-xl flex flex-col items-center justify-center relative border border-slate-105">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" fill="transparent" r="50" stroke="#E5EEFF" strokeWidth="12"></circle>
                      <circle 
                        cx="64" 
                        cy="64" 
                        fill="transparent" 
                        r="50" 
                        stroke="#FF9D00" 
                        strokeDasharray="314.15" 
                        strokeDashoffset="78.5" 
                        strokeLinecap="round" 
                        strokeWidth="12"
                      ></circle>
                    </svg>
                    <span className="text-2xl font-bold">{workflowData.featuresSection.workloadCard.percentage}</span>
                    <span className="text-[10px] text-on-surface-variant">{workflowData.featuresSection.workloadCard.label}</span>
                  </div>
                </div>
                <h3 className="font-headline-md text-headline-md mb-2">{workflowData.featuresSection.workloadCard.title}</h3>
                <p className="font-body-md text-on-surface-variant">
                  {workflowData.featuresSection.workloadCard.text}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {/* Advanced task tracking */}
              <div className="bg-white rounded-3xl ambient-shadow border border-outline-variant/30 overflow-hidden flex flex-col md:flex-row">
                <div className="p-8 flex-1">
                  <div className="w-12 h-12 bg-tertiary-fixed rounded-2xl flex items-center justify-center text-tertiary mb-6">
                    <span className="material-symbols-outlined text-2xl">double_arrow</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-4">{workflowData.featuresSection.trackingCard.title}</h3>
                  <p className="font-body-md text-on-surface-variant mb-6">
                    {workflowData.featuresSection.trackingCard.text}
                  </p>
                </div>
                <div className="flex-1 bg-surface-container-low p-6 overflow-hidden">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-primary">{workflowData.featuresSection.trackingCard.activeCard.team}</span>
                        <span className="material-symbols-outlined text-xs">more_horiz</span>
                      </div>
                      <div className="font-semibold text-xs mb-3">{workflowData.featuresSection.trackingCard.activeCard.title}</div>
                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-1">
                          <div className="w-5 h-5 rounded-full bg-surface-dim"></div>
                          <div className="w-5 h-5 rounded-full bg-surface-dim"></div>
                        </div>
                        <div className="text-[10px] text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">chat_bubble</span> {workflowData.featuresSection.trackingCard.activeCard.comments}
                          <span className="material-symbols-outlined text-xs">attach_file</span> {workflowData.featuresSection.trackingCard.activeCard.attachments}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/20 opacity-60">
                      <div className="font-semibold text-xs">{workflowData.featuresSection.trackingCard.secondaryCard.title}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customizable Workspaces */}
              <div className="bg-white rounded-3xl ambient-shadow border border-outline-variant/30 overflow-hidden flex flex-col md:flex-row">
                <div className="p-8 flex-1">
                  <h3 className="font-headline-md text-headline-md mb-4">{workflowData.featuresSection.workspaceCard.title}</h3>
                  <div className="space-y-3">
                    <div className="h-2 bg-surface-container rounded-full w-full"></div>
                    <div className="h-2 bg-surface-container rounded-full w-5/6"></div>
                    <div className="h-2 bg-surface-container rounded-full w-4/6"></div>
                  </div>
                </div>
                <div className="flex-1 bg-surface-container-high p-8 flex items-center justify-center relative min-h-[220px]">
                  <div className="bg-white p-4 rounded-2xl shadow-xl w-48 text-center border border-slate-105">
                    <div className="flex justify-between items-center mb-4 text-[10px] font-bold border-b pb-2">
                      {workflowData.featuresSection.workspaceCard.tabs.map((tab, idx) => (
                        <span key={idx} className={idx === 1 ? 'text-primary' : ''}>{tab}</span>
                      ))}
                    </div>
                    <div className="text-2xl font-bold mb-4 font-mono">{workflowData.featuresSection.workspaceCard.timer}</div>
                    <div className="flex justify-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-error-container text-error rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
                      </div>
                      <div className="w-6 h-6 bg-surface-container rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>stop</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-8 bg-surface border border-outline-variant rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs">grid_view</span>
                      </div>
                      <div className="h-8 bg-surface border border-outline-variant rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs">list</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center mt-16 font-label-md text-on-surface-variant italic">
              {workflowData.featuresSection.footerNotice}
            </p>
          </div>
        </section>
      </main>

      {/* Footer (Shared Component) */}
      <footer className="w-full py-stack-lg px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-stack-md bg-surface-container-low border-t border-outline-variant">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="font-headline-md text-headline-md font-bold text-on-surface">{workflowData.footer.brand}</span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {workflowData.footer.copyright}
          </p>
        </div>
        <div className="flex gap-8">
          {workflowData.footer.links.map((link, idx) => (
            <a key={idx} className="font-label-sm text-label-sm text-on-surface-variant hover:underline text-primary transition-colors" href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
