"use client"
import React, { useState, useEffect, FormEvent } from "react";

// Types for todo item and assigned tasks
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface AssignedTask {
  id: string;
  categoryId: string;
  categoryColor: string;
  title: string;
  progress: number;
  comments: number;
  attachments: number;
  assignees: string[];
}

export default function App() {
  // To Do List State
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: "1",
      text: "Finish the sales presentation 🔥 for the client meeting at 2:00 PM",
      completed: false,
    },
    {
      id: "2",
      text: "Send follow-up emails to potential leads",
      completed: true,
    },
    {
      id: "3",
      text: "Review and approve the marketing budget 📅",
      completed: false,
    },
  ]);

  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = (e: FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newTodo.trim(), completed: false },
    ]);
    setNewTodo("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // Time Tracker State
  // Initialized to 04:21:58 = 15718 seconds
  const [timeSeconds, setTimeSeconds] = useState(15718);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Tasks I've assigned tab filtering
  const [activeTab, setActiveTab] = useState<"upcoming" | "overdue" | "completed">("upcoming");

  // Sample static profiles used in layout
  const profileAmandavUrl = "https://lh3.googleusercontent.com/aida/AP1WRLuZ5aIMyffohgil0pXEHpVr40IKFRNAZnqIpf-YVHsqMwHDyRw4Wb3bCYnUsR-J1T36VHPRBJ4y_rPiP2kpsZSmA8KGAmxJm2Aun3ePdfCrhUsNngtxtcbZe1EBnaWOGTIB0ivq1EaUOQvzLGK0cONzyGZMVcu7467yCpWt3Th2x7oJYWKBDN78ADijk7nTE8S23QhEnaEoyOsAXg-WC69U4Ye82AUH7TMDl75z0xkBz9dqJvjoJ_Qfdz8";
  const profileCreative1Url = "https://lh3.googleusercontent.com/aida/AP1WRLv8ZXsrh-9eUuyfxqzt9ugkdRo8xIoY1CORaow3R3aLTCLb1gX6_y9ePAPFNoDBOUeaJD4c69wqtqjB7ixD-OwFNmUAK2BFcdAVrkSn94iKEUP7Hy6l0x0IusMnLEIkM7DblEKXvImRiKWFI-Izl5sbJ4aZNv0tdDCPPtjtlg3YEm-aNbLeGzTY0buXt-VfvXVxvBAl7TrFX--tM7aGf_6CxKg6cvjMjMPDKaQGEpYDO7YXhMbTVMTUtPE";
  const profileCreative2Url = "https://lh3.googleusercontent.com/aida/AP1WRLu7SLVb7_fLFPTWquAYkK2zhCWeqCZFe_cDQmQEgyb1YvFk_cWdkIJD1VN8Oq8Y6owZkdGtkqJNKGPB_cOyBurSgeIuFYlCyQdmxBb4Z0uXaKVjsDoSkUvjlaQ6mi12ICI0y5FvHSI7naHgCSH0SC9wFqPw308hadaKe1sVWk_pv8LZpFFssKTm5SsRXHfN9qUdgD6VMyY0FzRhPSfpOZs1qKTdp96ic6PSHHAv2v8TnKajLrWj8pC-HZA";
  const profileCorporateUrl = "https://lh3.googleusercontent.com/aida/AP1WRLtpoOiUe76zIsu-klgKk8k3PS1djFgLR8hZqkdHWtKLcqf3sNdE6orrD2ZZj7w18JEVioMaiA-QNKOkZJe1ypdcQUh7I3a26vr5AIJAqQhCsJlKFtV8wLBy6sbAo972YdaljiUmlrD7ZOFXs_dUhCEE8GHGGJV4wZFT4bs_LMtBi0mHpirAe4wL5k846GVVAAU-03KiKMcTmjPE4f2Aw9JgtRy7z6Ai8ugA6ldD_Z9dqi25LHP9gqXNahs";
  const profileCollab1Url = "https://lh3.googleusercontent.com/aida/AP1WRLuvnkPx8EypuN6UM3rg28GXe7wYKLJjLK1m0Omz0q7_AAFwQQ9OGL-VsgU9ShbLvvCSHLOnlIVDeD0FY36tI3KfAfEta8nSokGRd68UVfwqYXPDOFnPfmbpuu4ZNlmbHl4k6QR_z1GI1mxAcr3sL3D2OIoUPXknVgYENXJ3KMsOqF3jqM_sxIMYtkvyXEN0b0SUvo5BurL1F0OxlM1Bq1tG71PIvG6VB_yOUR-65D7YdFzBkxw5L1ktAA";
  const profileCollab2Url = "https://lh3.googleusercontent.com/aida/AP1WRLu5ID_hhyF6i_xaAT4etwW1as-N2SDhCY79PlSR4pWRI2ckdsPtRvJHVi8RXkb6Wg3J6DFXjTzUaAu0s_pDrkIROgkjp7uNg0Zd0DfxS0WtsqMwb4l_PcuXjzWHwtKJ-d6pXyMIH1DQk6wXYVKm7V6JvehUlukLxhDKHhlBlqhRAuinnjTemqm0SLzgI9eas8b02LJEpn1wVirk59TvCF7tcmrsauQIeZTFgH8vmnBQF4DwJgCcOPRgjBY";

  // Filtered assigned tasks list representation
  const assignedTasks = {
    upcoming: [
      {
        id: "task-1",
        number: 8,
        numberBg: "bg-orange-100 text-orange-600",
        title: "New ideas for campaign",
        progress: 60,
        assignees: [profileCreative1Url, profileCreative2Url],
      },
      {
        id: "task-2",
        number: 7,
        numberBg: "bg-blue-100 text-blue-600",
        title: "Change button",
        progress: 27,
        assignees: [profileCorporateUrl],
      },
    ],
    overdue: [
      {
        id: "task-3",
        number: 12,
        numberBg: "bg-red-100 text-red-600",
        title: "Quarterly budget adjustment",
        progress: 85,
        assignees: [profileCreative2Url],
      },
      {
        id: "task-4",
        number: 9,
        numberBg: "bg-red-100 text-red-600",
        title: "Review analytics insights dashboard",
        progress: 40,
        assignees: [profileCorporateUrl, profileCreative1Url],
      },
    ],
    completed: [
      {
        id: "task-5",
        number: 10,
        numberBg: "bg-green-100 text-green-600",
        title: "Deploy landing page structure",
        progress: 100,
        assignees: [profileCreative1Url, profileCorporateUrl],
      },
      {
        id: "task-6",
        number: 15,
        numberBg: "bg-green-100 text-green-600",
        title: "Sync client requirements doc",
        progress: 100,
        assignees: [profileCreative2Url],
      },
    ],
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop py-4 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex items-center gap-8">
          <span className="font-headline-md text-headline-md font-bold text-on-surface cursor-pointer">
            ChronoTask
          </span>
          <div className="hidden md:flex items-center gap-6">
            <a
              className="font-label-md text-label-md text-primary font-semibold border-b-2 border-primary"
              href="#"
            >
              Features
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Solutions
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Resources
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Pricing
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
            Sign in
          </button>
          <button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-label-md text-label-md hover:brightness-110 transition-all shadow-md">
            Get demo
          </button>
        </div>
      </nav>

      {/* Main Content Areas */}
      <main className="dot-grid pt-32 pb-32">
        {/* Section 1: Challenges */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-stack-lg">
          <div className="text-center mb-16">
            <span className="bg-surface-container-high text-primary font-label-md text-label-md px-4 py-1 rounded-full mb-4 inline-block">
              Solutions
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-12">
              Solve your team's biggest challenges
            </h1>

            {/* Challenge items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left max-w-4xl mx-auto">
              <div className="space-y-3">
                <div className="text-tertiary">
                  <span className="material-symbols-outlined text-3xl">
                    diversity_3
                  </span>
                </div>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  Ensure your team is always on the same page with task-sharing
                  and transparent updates.
                </p>
              </div>

              <div className="space-y-3 border-l-0 md:border-l border-outline-variant md:pl-8">
                <div className="text-primary">
                  <span className="material-symbols-outlined text-3xl">
                    list_alt
                  </span>
                </div>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  Prioritize and manage tasks effectively so your team can focus
                  on what matters most.
                </p>
              </div>

              <div className="space-y-3 border-l-0 md:border-l border-outline-variant md:pl-8">
                <div className="text-secondary">
                  <span className="material-symbols-outlined text-3xl">
                    person_check
                  </span>
                </div>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  Hold everyone accountable without the need for constant
                  check-ins.
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Hero Card mock-up */}
          <div className="relative max-w-5xl mx-auto mt-16">
            {/* Floating Elements */}
            <div
              className="absolute -left-8 top-1/4 z-20 bg-white rounded-2xl p-4 floating-shadow hidden md:block animate-bounce"
              style={{ animationDuration: "4s" }}
            >
              <span className="text-4xl font-bold text-on-surface">20</span>
              <p className="text-[10px] text-on-surface-variant font-medium mt-1">Active tasks</p>
            </div>

            <div className="absolute -right-6 top-12 z-20 bg-white rounded-2xl p-4 floating-shadow hidden md:block transition-all hover:scale-105">
              <div className="w-10 h-10 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined font-bold">check</span>
              </div>
            </div>

            {/* Main Interactive UI Container Mock */}
            <div className="bg-primary/5 rounded-[48px] p-4 md:p-8 ambient-shadow border border-white/50 backdrop-blur-sm overflow-hidden">
              <div className="bg-white rounded-3xl overflow-hidden border border-outline-variant flex flex-col md:flex-row h-[720px] shadow-2xl">
                
                {/* UI Sidebar Component */}
                <div className="w-64 border-r border-outline-variant bg-surface p-6 flex-shrink-0 hidden md:block">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">C</div>
                    <span className="font-bold">ChronoTask</span>
                  </div>

                  <div className="space-y-6">
                    <button
                      onClick={() => {
                        const taskText = prompt("Enter a quick todo for your dashboard list:");
                        if (taskText?.trim()) {
                          setTodos((prev) => [
                            ...prev,
                            { id: Date.now().toString(), text: taskText.trim(), completed: false },
                          ]);
                        }
                      }}
                      className="w-full bg-white hover:bg-surface-container active:scale-95 transition-all border border-outline-variant rounded-lg py-2 flex items-center justify-center gap-2 font-label-md shadow-sm"
                    >
                      <span className="material-symbols-outlined text-sm">add</span> Create
                    </button>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-primary bg-primary/10 p-2 rounded-lg font-semibold cursor-pointer">
                        <span className="material-symbols-outlined">home</span> Home
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant p-2 rounded-lg cursor-pointer hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined">check_circle</span> My Tasks
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant p-2 rounded-lg cursor-pointer hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined">inbox</span> Inbox
                      </div>
                    </div>
                  </div>
                </div>

                {/* UI Main Content Area */}
                <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-[#FAFBFF]">
                  <header className="h-16 border-b border-outline-variant flex items-center justify-between px-8 bg-white/50 sticky top-0 backdrop-blur-sm z-10">
                    <div className="font-label-md text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined">calendar_today</span> Monday, September 30
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
                        search
                      </span>
                      <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
                        notifications
                      </span>
                      <div className="w-8 h-8 rounded-full bg-surface-dim overflow-hidden border border-outline-variant">
                        <img
                          alt="Profile Portrait"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          src={profileAmandavUrl}
                        />
                      </div>
                    </div>
                  </header>

                  <div className="p-8">
                    <div className="flex justify-between items-end mb-8">
                      <h2 className="font-headline-md text-headline-md">
                        Good morning, <span className="text-primary font-bold">Amanda</span>
                      </h2>
                      <button
                        onClick={() => alert("Customize Dashboard widget panel layout layout coming soon!")}
                        className="bg-surface-container-high hover:bg-surface-container-highest transition-colors px-4 py-1.5 rounded-full text-label-sm font-label-sm flex items-center gap-2 active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm">auto_fix</span> Customize
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      
                      {/* Dynamic To Do List */}
                      <div className="col-span-1 bg-white rounded-2xl p-6 ambient-shadow border border-outline-variant/30">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-label-md font-bold flex items-center gap-2">
                            <span className="text-xl">✏️</span> To do list
                          </h3>
                        </div>

                        {/* Quick Task Adding Input */}
                        <form onSubmit={handleAddTodo} className="mb-4 flex gap-2">
                          <input
                            type="text"
                            placeholder="Add instant task..."
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            className="flex-1 text-xs border border-outline-variant rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-surface"
                          />
                          <button
                            type="submit"
                            className="bg-primary text-white h-7 w-7 rounded-lg flex items-center justify-center hover:bg-primary-container active:scale-95 transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </form>

                        <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
                          {todos.map((todo) => (
                            <div
                              key={todo.id}
                              className={`flex items-start justify-between gap-2 p-3 rounded-xl transition-all border ${
                                todo.completed
                                  ? "border-outline-variant bg-surface/50 opacity-60"
                                  : "bg-surface border-transparent hover:border-outline-variant/45"
                              }`}
                            >
                              <div className="flex items-start gap-2.5 flex-1">
                                <input
                                  type="checkbox"
                                  checked={todo.completed}
                                  onChange={() => toggleTodo(todo.id)}
                                  className="rounded text-primary focus:ring-primary h-4 w-4 mt-0.5 cursor-pointer accent-primary"
                                />
                                <span
                                  className={`text-xs text-on-surface-variant leading-relaxed select-none ${
                                    todo.completed ? "line-through" : ""
                                  }`}
                                >
                                  {todo.text}
                                </span>
                              </div>
                              <button
                                onClick={() => deleteTodo(todo.id)}
                                className="text-on-surface-variant opacity-0 hover:opacity-100 focus:opacity-100 hover:text-error transition-all"
                                title="Delete task"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                            </div>
                          ))}

                          {todos.length === 0 && (
                            <div className="text-center py-6 text-on-surface-variant text-xs italic">
                              No tasks in your checklist!
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Fully Interactive Time Tracker */}
                      <div className="col-span-1 bg-white rounded-2xl p-6 ambient-shadow border border-outline-variant/30 flex flex-col items-center justify-center text-center">
                        <h3 className="font-label-md text-on-surface-variant font-semibold mb-6">
                          Time tracker
                        </h3>
                        <div className="text-5xl font-mono font-bold text-on-surface tracking-tighter mb-8 tabular-nums">
                          {formatTime(timeSeconds)}
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => setIsTimerRunning(!isTimerRunning)}
                            className={`w-12 h-12 flex items-center justify-center rounded-full transition-all active:scale-90 shadow ${
                              isTimerRunning
                                ? "bg-primary text-white hover:brightness-110"
                                : "bg-surface text-on-surface-variant hover:bg-surface-container-high"
                            }`}
                            title={isTimerRunning ? "Pause Timer" : "Start Timer"}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              {isTimerRunning ? "pause" : "play_arrow"}
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setIsTimerRunning(false);
                              setTimeSeconds(15718); // Reset to standard starting value
                            }}
                            className="w-12 h-12 bg-error-container text-error flex items-center justify-center rounded-full hover:brightness-95 transition-all active:scale-90 shadow"
                            title="Reset Tracker to Default"
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              stop
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Live Calculated Activity Ring SVG */}
                      <div className="col-span-1 bg-white rounded-2xl p-6 ambient-shadow border border-outline-variant/30 relative overflow-hidden flex flex-col justify-between">
                        <h3 className="font-label-md text-on-surface-variant font-semibold mb-2">
                          Activity
                        </h3>
                        <div className="flex justify-center py-4 relative">
                          <div className="relative w-32 h-32">
                            <svg className="w-full h-full transform -rotate-90">
                              {/* Outer ring path */}
                              <circle
                                className="text-surface-container-highest"
                                cx="64"
                                cy="64"
                                fill="transparent"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                              ></circle>
                              <circle
                                className="text-primary-container"
                                cx="64"
                                cy="64"
                                fill="transparent"
                                r="56"
                                stroke="currentColor"
                                strokeDasharray="351.8"
                                strokeDashoffset="80"
                                strokeWidth="8"
                                strokeLinecap="round"
                              ></circle>
                              {/* Inner ring path */}
                              <circle
                                className="text-surface-container-highest"
                                cx="64"
                                cy="64"
                                fill="transparent"
                                r="44"
                                stroke="currentColor"
                                strokeWidth="8"
                              ></circle>
                              <circle
                                className="text-secondary-container"
                                cx="64"
                                cy="64"
                                fill="transparent"
                                r="44"
                                stroke="currentColor"
                                strokeDasharray="276.4"
                                strokeDashoffset="100"
                                strokeWidth="8"
                                strokeLinecap="round"
                              ></circle>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-on-surface">
                              82%
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-on-surface-variant">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary-container"></div>{" "}
                            Working hrs
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-secondary-container"></div>{" "}
                            Tasks done
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Interactive "Tasks I've assigned" list with filter toggles */}
                    <div className="bg-white rounded-2xl p-6 ambient-shadow border border-outline-variant/30">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h3 className="font-label-md font-bold text-base text-on-surface">
                          Tasks I've assigned
                        </h3>
                        <div className="flex gap-4 text-xs font-semibold">
                          <button
                            onClick={() => setActiveTab("upcoming")}
                            className={`pb-1 transition-all border-b-2 ${
                              activeTab === "upcoming"
                                ? "text-primary border-primary font-bold"
                                : "text-on-surface-variant border-transparent hover:text-primary"
                            }`}
                          >
                            Upcoming
                          </button>
                          <button
                            onClick={() => setActiveTab("overdue")}
                            className={`pb-1 transition-all border-b-2 ${
                              activeTab === "overdue"
                                ? "text-primary border-primary font-bold"
                                : "text-on-surface-variant border-transparent hover:text-primary"
                            }`}
                          >
                            Overdue
                          </button>
                          <button
                            onClick={() => setActiveTab("completed")}
                            className={`pb-1 transition-all border-b-2 ${
                              activeTab === "completed"
                                ? "text-primary border-primary font-bold"
                                : "text-on-surface-variant border-transparent hover:text-primary"
                            }`}
                          >
                            Completed
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {assignedTasks[activeTab].map((task) => (
                          <div
                            key={task.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant/30 gap-4 transition-all hover:bg-surface-container-high/40"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${task.numberBg}`}
                              >
                                {task.number}
                              </div>
                              <span className="font-label-md text-sm font-semibold text-on-surface">
                                {task.title}
                              </span>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8">
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-on-surface-variant font-mono whitespace-nowrap min-w-[32px] text-right">
                                  {task.progress}%
                                </span>
                                <div className="w-40 h-2 bg-surface-container rounded-full overflow-hidden">
                                  <div
                                    className="bg-primary h-full transition-all duration-500"
                                    style={{ width: `${task.progress}%` }}
                                  ></div>
                                </div>
                              </div>

                              <div className="flex -space-x-2">
                                {task.assignees.map((assigneeUrl, idx) => (
                                  <div
                                    key={idx}
                                    className="w-7 h-7 rounded-full border-2 border-white bg-surface-dim overflow-hidden shadow-sm"
                                  >
                                    <img
                                      alt="User Assignee"
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover"
                                      src={assigneeUrl}
                                    />
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
        <section className="bg-surface-container-low/50 py-24 mt-32 relative overflow-hidden border-y border-outline-variant/20">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            
            <div className="text-center mb-16">
              <span className="bg-surface-container-high text-primary font-label-md text-label-md px-4 py-1 rounded-full mb-4 inline-block">
                Features
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
                Keep everything in one place
              </h2>
              <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
                Forget complex project management tools.
              </p>
            </div>

            {/* Features layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-gutter">
              
              {/* Feature 1: Seamless Collaboration */}
              <div className="bg-white p-8 rounded-3xl ambient-shadow flex flex-col h-full border border-outline-variant/30">
                <div className="bg-surface-container-high rounded-2xl p-6 mb-8 relative flex-1 overflow-hidden min-h-[220px]">
                  <div className="bg-white rounded-xl shadow-lg p-4 w-5/6 mx-auto mt-4 transform hover:-translate-y-1 transition-transform">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 font-bold text-xs text-on-surface">
                        <span className="material-symbols-outlined text-primary text-lg">
                          group
                        </span>{" "}
                        Marketing Team
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant text-lg cursor-pointer">
                        search
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-dim overflow-hidden border">
                          <img
                            alt="Amanda Profile"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            src={profileCollab1Url}
                          />
                        </div>
                        <div className="text-xs font-semibold">Amanda Peterson</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-dim overflow-hidden border">
                          <img
                            alt="Jane Profile"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            src={profileCollab2Url}
                          />
                        </div>
                        <div className="text-xs font-semibold text-on-surface-variant">Jane Fox</div>
                      </div>

                      <div className="flex items-center gap-3 border-t border-outline-variant pt-2">
                        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center cursor-pointer hover:bg-primary-container hover:text-on-primary-container transition-colors">
                          <span className="material-symbols-outlined text-sm font-bold">add</span>
                        </div>
                        <div className="text-xs text-primary font-bold cursor-pointer hover:underline">
                          Invite members
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="font-headline-md text-headline-md mb-2">
                  Seamless Collaboration
                </h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed text-sm">
                  Work together with your team effortlessly, share tasks, and
                  update progress in real-time.
                </p>
              </div>

              {/* Feature 2: Time Management Tools */}
              <div className="bg-white p-8 rounded-3xl ambient-shadow flex flex-col h-full border border-outline-variant/30">
                <div className="bg-surface-container-high rounded-2xl p-6 mb-8 relative flex-1 overflow-hidden min-h-[220px]">
                  <div className="flex gap-4 h-full">
                    <div className="flex-1 bg-white rounded-xl shadow-sm p-3">
                      <div className="text-[10px] font-bold mb-2 text-on-surface">
                        Weekly Schedule
                      </div>
                      <div className="space-y-2">
                        <div className="p-2 bg-primary/5 rounded border-l-2 border-primary text-[8px] text-on-surface-variant leading-tight">
                          Meeting with marketing team <br />{" "}
                          <span className="font-semibold text-primary">13:00 - 13:45</span>
                        </div>
                        <div className="p-2 bg-secondary/5 rounded border-l-2 border-secondary text-[8px] text-on-surface-variant leading-tight">
                          Meeting with new client <br />{" "}
                          <span className="font-semibold text-secondary">15:00 - 15:45</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-20 bg-white rounded-xl shadow-sm p-3 flex flex-col justify-end gap-1">
                      <div className="w-full bg-primary/20 h-1/2 rounded-t hover:bg-primary/30 transition-colors"></div>
                      <div className="w-full bg-primary/40 h-3/4 rounded-t hover:bg-primary/50 transition-colors"></div>
                      <div className="w-full bg-primary h-full rounded-t hover:brightness-110 transition-all"></div>
                    </div>
                  </div>
                </div>

                <h3 className="font-headline-md text-headline-md mb-2">
                  Time Management Tools
                </h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed text-sm">
                  Optimize your time with integrated tools like timers,
                  reminders, and schedules.
                </p>
              </div>

              {/* Feature 3: Team Workload */}
              <div className="bg-white p-8 rounded-3xl ambient-shadow flex flex-col h-full border border-outline-variant/30">
                <div className="bg-surface-container-high rounded-2xl p-6 mb-8 relative flex-1 flex flex-col items-center justify-center overflow-hidden min-h-[220px]">
                  <div className="bg-white rounded-full w-32 h-32 shadow-xl flex flex-col items-center justify-center relative transform hover:rotate-12 transition-transform duration-500">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        fill="transparent"
                        r="50"
                        stroke="#E5EEFF"
                        strokeWidth="12"
                      ></circle>
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
                    <span className="text-2xl font-bold text-on-surface">75%</span>
                    <span className="text-[10px] text-on-surface-variant font-medium">
                      Team workload
                    </span>
                  </div>
                </div>

                <h3 className="font-headline-md text-headline-md mb-2">
                  Team Workload
                </h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed text-sm">
                  Visualize team capacity and redistribute tasks to prevent
                  burnout and ensure efficiency.
                </p>
              </div>

            </div>

            {/* Advanced features row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              
              {/* Advanced task tracking */}
              <div className="bg-white rounded-3xl ambient-shadow border border-outline-variant/30 overflow-hidden flex flex-col md:flex-row">
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-tertiary-fixed rounded-2xl flex items-center justify-center text-tertiary mb-6">
                      <span className="material-symbols-outlined text-2xl font-bold">
                        double_arrow
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md mb-4">
                      Advanced task tracking
                    </h3>
                    <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
                      A bird's eye view of your entire behaviour and
                      productivity.
                    </p>
                  </div>
                </div>

                <div className="flex-1 bg-surface-container-low p-6 overflow-hidden flex flex-col justify-center min-h-[200px]">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-primary">
                          Marketing team
                        </span>
                        <span className="material-symbols-outlined text-xs cursor-pointer text-on-surface-variant">
                          more_horiz
                        </span>
                      </div>
                      <div className="font-semibold text-xs mb-3 text-on-surface">
                        New Ideas for the campaign
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-1">
                          <div className="w-5 h-5 rounded-full bg-surface-dim border border-white"></div>
                          <div className="w-5 h-5 rounded-full bg-surface-dim border border-white"></div>
                        </div>
                        <div className="text-[10px] text-on-surface-variant flex items-center gap-1.5 font-medium">
                          <span className="material-symbols-outlined text-xs">
                            chat_bubble
                          </span>{" "}
                          5
                          <span className="material-symbols-outlined text-xs">
                            attach_file
                          </span>{" "}
                          2
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/20 opacity-60">
                      <div className="font-semibold text-xs text-on-surface">
                        Review budget 2024
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customizable Workspaces */}
              <div className="bg-white rounded-3xl ambient-shadow border border-outline-variant/30 overflow-hidden flex flex-col md:flex-row">
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-headline-md mb-4">
                      Customizable Workspaces
                    </h3>
                    <p className="font-body-md text-on-surface-variant text-sm leading-relaxed mb-6">
                      Format your task boards, metrics, widgets, and themes to align perfectly with your team's unique rhythm.
                    </p>
                    <div className="space-y-3">
                      <div className="h-2 bg-surface-container rounded-full w-full"></div>
                      <div className="h-2 bg-surface-container rounded-full w-5/6"></div>
                      <div className="h-2 bg-surface-container rounded-full w-4/6"></div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-surface-container-high p-8 flex items-center justify-center relative min-h-[220px]">
                  <div className="bg-white p-4 rounded-2xl shadow-xl w-48 text-center transition-all hover:scale-105">
                    <div className="flex justify-between items-center mb-4 text-[10px] font-bold border-b pb-2 text-on-surface-variant">
                      <span className="cursor-pointer hover:text-primary transition-colors">Themes</span>
                      <span className="text-primary cursor-pointer">Widgets</span>
                      <span className="cursor-pointer hover:text-primary transition-colors">Tasks</span>
                    </div>
                    <div className="text-2xl font-bold mb-4 font-mono">04:21</div>
                    <div className="flex justify-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-error-container text-error rounded-full flex items-center justify-center cursor-pointer">
                        <span
                          className="material-symbols-outlined text-xs"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          pause
                        </span>
                      </div>
                      <div className="w-6 h-6 bg-surface-container rounded-full flex items-center justify-center cursor-pointer">
                        <span
                          className="material-symbols-outlined text-xs"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          stop
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-8 bg-surface border border-outline-variant rounded flex items-center justify-center cursor-pointer hover:bg-surface-container">
                        <span className="material-symbols-outlined text-xs">
                          grid_view
                        </span>
                      </div>
                      <div className="h-8 bg-surface border border-outline-variant rounded flex items-center justify-center cursor-pointer hover:bg-surface-container">
                        <span className="material-symbols-outlined text-xs">
                          list
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <p className="text-center mt-16 font-label-md text-on-surface-variant italic text-sm">
              and a lot more features...
            </p>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <footer className="w-full py-stack-lg px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-stack-md bg-surface-container-low border-t border-outline-variant">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="font-headline-md text-headline-md font-bold text-on-surface cursor-pointer">
            ChronoTask
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant text-sm">
            © 2024 ChronoTask Inc. All rights reserved.
          </p>
        </div>
        <div className="flex gap-8 flex-wrap justify-center">
          <a
            className="font-label-sm text-label-sm text-on-surface-variant hover:underline text-primary transition-colors text-xs"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="font-label-sm text-label-sm text-on-surface-variant hover:underline text-primary transition-colors text-xs"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="font-label-sm text-label-sm text-on-surface-variant hover:underline text-primary transition-colors text-xs"
            href="#"
          >
            Security
          </a>
          <a
            className="font-label-sm text-label-sm text-on-surface-variant hover:underline text-primary transition-colors text-xs"
            href="#"
          >
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
