'use client';

import React, { useState } from 'react';
import workflowData from '@/public/data/WorkflowDetails.json';
import { TbAutomaticGearbox } from "react-icons/tb";
import { FiCheckCircle } from "react-icons/fi";
import { GoWorkflow } from "react-icons/go";
import { FaListCheck } from "react-icons/fa6";

export default function WorkflowDetails() {
  // Simple state for checkboxes to match original micro-interactions
  const [task1Checked, setTask1Checked] = useState(workflowData.dashboard.todoTasks[0].checked);
  const [task2Checked, setTask2Checked] = useState(workflowData.dashboard.todoTasks[1].checked);
  const [task3Checked, setTask3Checked] = useState(workflowData.dashboard.todoTasks[2].checked);

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased">
      <main className="dot-grid  pt-4">
        {/* Section 1: Challenges */}
        <section id="problems" className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-stack-lg">
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
                    {challenge.icon === 'GoWorkflow' && <GoWorkflow size={32} />}
                    {challenge.icon === 'TbAutomaticGearbox' && <TbAutomaticGearbox size={32} />}
                    {challenge.icon === 'FiCheckCircle' && <FiCheckCircle size={32} />}
                  </div>
                  <p className="font-body-md text-on-surface-variant leading-relaxed">
                    {challenge.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Hero Card */}
        <img src="/AIN2NSS.png" alt="Workflow Details" className='w-[70vw] -pt-3 rounded-3xl mx-auto object-cover max-md:w-[90vw]' />
        </section>

        {/* Section 2: Features Grid */}
        <section id="features" className="bg-surface-container-low/50 py-16 mt-12 relative overflow-hidden">
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
                  
                  {/* <div className="bg-white rounded-xl shadow-lg p-4 w-5/6 mx-auto mt-4 border border-slate-105">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <span className="material-symbols-outlined text-primary text-lg">group</span> {workflowData.featuresSection.collaborationCard.teamName}
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
                    </div>
                    <div className="space-y-3">
                      {workflowData.featuresSection.collaborationCard.members.map((member, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-surface-dim overflow-hidden">
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
                  </div> */}
                </div>
                <h3 className="font-headline-md text-headline-md mb-2">{workflowData.featuresSection.collaborationCard.title}</h3>
                <p className="font-body-md text-on-surface-variant">
                  {workflowData.featuresSection.collaborationCard.text}
                </p>
              </div>

              {/* Time Management Tools */}
              <div className="bg-white p-8 rounded-3xl ambient-shadow flex flex-col h-full border border-outline-variant/30">
                <div className="bg-surface-container-high rounded-2xl p-6 mb-8 relative flex-1 overflow-hidden min-h-[220px]">
                  {/* <div className="flex gap-4 h-full">
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
                  </div> */}
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
                    <span className="material-symbols-outlined text-2xl"><FaListCheck size={20} /></span>
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
                        {/* <span className="material-symbols-outlined text-xs">more_horiz</span> */}
                      </div>
                      <div className="font-semibold text-xs mb-3">{workflowData.featuresSection.trackingCard.activeCard.title}</div>
                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-1">
                          <div className="w-5 h-5 rounded-full bg-surface-dim"></div>
                          <div className="w-5 h-5 rounded-full bg-surface-dim"></div>
                        </div>
                        <div className="text-[10px] text-on-surface-variant flex items-center gap-1">
                          {/* <span className="material-symbols-outlined text-xs">chat_bubble</span> {workflowData.featuresSection.trackingCard.activeCard.comments} */}
                          {/* <span className="material-symbols-outlined text-xs">attach_file</span> {workflowData.featuresSection.trackingCard.activeCard.attachments} */}
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
                        <span className="material-symbols-outlined text-xs">view</span>
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
    </div>
  );
}
