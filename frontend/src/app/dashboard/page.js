'use client';

import Link from 'next/link';
import { Route, Clock, MoreVertical, Plus, Trophy, Target, BookOpen } from 'lucide-react';

const SAVED_ROADMAPS = [
  { id: 'react-js', title: 'React.js Developer', progress: 45, lastActive: '2 hours ago', totalNodes: 24, completedNodes: 11 },
  { id: 'system-design', title: 'System Design', progress: 12, lastActive: '3 days ago', totalNodes: 35, completedNodes: 4 },
  { id: 'docker', title: 'Docker Basics', progress: 100, lastActive: '1 week ago', totalNodes: 18, completedNodes: 18 },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-3xl font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            A
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Alex Developer</h1>
            <p className="text-slate-400">alex@example.com • Joined March 2026</p>
          </div>
        </div>
        <Link 
          href="/generate"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> New Roadmap
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Trophy size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Roadmaps Completed</p>
            <p className="text-3xl font-bold text-white">1</p>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 text-purple-400 rounded-xl">
            <Target size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Topics Mastered</p>
            <p className="text-3xl font-bold text-white">33</p>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl">
            <BookOpen size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Active Roadmaps</p>
            <p className="text-3xl font-bold text-white">2</p>
          </div>
        </div>
      </div>

      {/* User's Roadmaps */}
      <h2 className="text-2xl font-bold text-white mb-6">Your Learning Paths</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {SAVED_ROADMAPS.map(rm => (
          <Link href={`/roadmap/${rm.id}`} key={rm.id}>
            <div className="bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/50 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer h-full shadow-lg group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl flex items-center justify-center ${
                    rm.progress === 100 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'
                  }`}>
                    {rm.progress === 100 ? <Trophy size={24} /> : <Route size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{rm.title}</h3>
                    <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                      <Clock size={14} /> Last active {rm.lastActive}
                    </p>
                  </div>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors p-1" onClick={e => e.preventDefault()}>
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-300">{rm.progress}% Completed</span>
                  <span className="text-slate-500">{rm.completedNodes} / {rm.totalNodes} topics</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 shadow-inner ${
                      rm.progress === 100 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gradient-to-r from-indigo-500 to-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                    }`}
                    style={{ width: `${rm.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
