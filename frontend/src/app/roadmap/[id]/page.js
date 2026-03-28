'use client';

import { useEffect, useState } from 'react';
import RoadmapCanvas from '@/components/roadmap/RoadmapCanvas';
import { Share2, BookmarkPlus, Map } from 'lucide-react';
import { useRoadmapStore } from '@/stores/roadmapStore';
import { useAuth } from '@clerk/nextjs';
import api from '@/lib/api';

export default function RoadmapPage({ params }) {
  const { roadmapData, progress, initRoadmap, clearRoadmap } = useRoadmapStore();
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    async function fetchRoadmap() {
      setLoading(true);
      try {
        const token = await getToken();
        const response = await api.get(`/roadmaps/${params.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        initRoadmap(response.data);
      } catch (err) {
        console.error('Failed to fetch roadmap:', err);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchRoadmap();
    }

    return () => {
      clearRoadmap();
    };
  }, [params.id, initRoadmap, clearRoadmap]);

  if (loading || !roadmapData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
        <Map size={48} className="text-indigo-500/50 mb-4 animate-pulse" />
        <div className="animate-pulse text-indigo-400 font-medium">Loading roadmap...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-[#0A0A23]">
      
      {/* Top Header Bar */}
      <div className="h-16 border-b border-white/10 bg-[#1a1a3e]/80 backdrop-blur-md shrink-0 flex items-center justify-between px-6 z-10 w-full shadow-lg">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">{roadmapData.title}</h1>
          <p className="text-xs text-slate-400 capitalize">AI Generated Roadmap</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-sm font-medium text-slate-300">{progress}% Done</span>
            <div className="w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="h-6 w-px bg-white/10 hidden sm:block" />
          
          <button className="text-slate-400 hover:text-white transition-colors" title="Save to profile">
            <BookmarkPlus size={20} />
          </button>
          <button className="text-slate-400 hover:text-white hidden sm:block transition-colors" title="Share roadmap">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Main Flowchart Area */}
      <div className="flex-1 w-full relative">
        <RoadmapCanvas initialEdges={roadmapData.edges} />
      </div>

    </div>
  );
}
