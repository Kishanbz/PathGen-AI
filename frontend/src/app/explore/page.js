'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Route, BookOpen, Clock, Users } from 'lucide-react';

const ROADMAPS = [
  { id: 'frontend', title: 'Frontend Developer', type: 'role', topics: 45, duration: '6 months', users: '120k+' },
  { id: 'backend', title: 'Backend Developer', type: 'role', topics: 52, duration: '7 months', users: '95k+' },
  { id: 'devops', title: 'DevOps Engineer', type: 'role', topics: 48, duration: '6 months', users: '80k+' },
  { id: 'fullstack', title: 'Full Stack Developer', type: 'role', topics: 85, duration: '12 months', users: '150k+' },
  { id: 'react-js', title: 'React.js', type: 'skill', topics: 24, duration: '2 months', users: '200k+' },
  { id: 'node-js', title: 'Node.js', type: 'skill', topics: 28, duration: '2 months', users: '110k+' },
  { id: 'python', title: 'Python', type: 'skill', topics: 40, duration: '3 months', users: '300k+' },
  { id: 'docker', title: 'Docker', type: 'skill', topics: 18, duration: '3 weeks', users: '90k+' },
  { id: 'system-design', title: 'System Design', type: 'skill', topics: 35, duration: '4 months', users: '130k+' },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredRoadmaps = ROADMAPS.filter(rm => {
    const matchesSearch = rm.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || rm.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Explore <span className="text-indigo-400">Roadmaps</span></h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Browse comprehensive step-by-step learning paths curated by the community or generate your own custom path using AI.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search roadmaps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl border border-slate-700">
          {['all', 'role', 'skill'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeFilter === filter 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {filter}s
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredRoadmaps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoadmaps.map((rm) => (
            <Link href={`/roadmap/${rm.id}`} key={rm.id}>
              <div className="group bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/10">
                
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <Route size={24} />
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                      rm.type === 'role' 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {rm.type}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-indigo-300 transition-colors">
                    {rm.title}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-6 pt-4 border-t border-slate-700/50 text-sm font-medium text-slate-400">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-slate-500" />
                    <span>{rm.topics} Topics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-slate-500" />
                    <span>{rm.users}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Clock size={16} className="text-slate-500" />
                    <span>Est. {rm.duration} to complete</span>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center">
          <Search size={48} className="text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No roadmaps found</h3>
          <p className="text-slate-400">Try adjusting your search query or filters.</p>
        </div>
      )}
    </div>
  );
}
