'use client';

import { useEffect, useState, use } from 'react';
import RoadmapCanvas from '@/components/roadmap/RoadmapCanvas';
import { Share2, BookmarkPlus, Map, Globe, EyeOff, Lock } from 'lucide-react';
import { useRoadmapStore } from '@/stores/roadmapStore';
import { useAuth } from '@clerk/nextjs';
import api from '@/lib/api';
import confetti from 'canvas-confetti';

export default function RoadmapPage({ params }) {
  const { id } = use(params);
  const { roadmapData, progress, initRoadmap, clearRoadmap } = useRoadmapStore();
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const [isSaved, setIsSaved] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRoadmap() {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const response = await api.get(`/roadmaps/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        initRoadmap(response.data);
      } catch (err) {
        console.error('Failed to fetch roadmap:', err);
        if (err.response?.status === 403) {
          setError('This roadmap is private. Only the owner can access it.');
        } else if (err.response?.status === 404) {
          setError('Roadmap not found.');
        } else {
          setError('Failed to load roadmap. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchRoadmap();
    }

    return () => {
      clearRoadmap();
    };
  }, [id, initRoadmap, clearRoadmap]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleSave = () => {
    // For now, toggle a local state. In a real app, this would hit a DB endpoint.
    setIsSaved(!isSaved);
    // Visual feedback
    if (!isSaved) {
        confetti({
            particleCount: 50,
            spread: 40,
            origin: { y: 0.1, x: 0.8 },
            colors: ['#6366f1', '#f59e0b']
        });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
        <Map size={48} className="text-indigo-500/50 mb-4 animate-pulse" />
        <div className="animate-pulse text-indigo-400 font-medium">Loading roadmap...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4">
        <Lock size={48} className="text-slate-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-slate-400 text-center max-w-md">{error}</p>
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
        <Map size={48} className="text-indigo-500/50 mb-4" />
        <div className="text-slate-400 font-medium">Roadmap not available</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-[#0A0A23]">
      
      {/* Top Header Bar */}
      <div className="h-16 border-b border-white/10 bg-[#1a1a3e]/80 backdrop-blur-md shrink-0 flex items-center justify-between px-6 z-10 w-full shadow-lg">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{roadmapData.title}</h1>
            <p className="text-xs text-slate-400 capitalize">AI Generated Roadmap</p>
          </div>
          {roadmapData?.is_published !== undefined && (
            <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${
              roadmapData.is_published 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-slate-600/30 text-slate-400 border-slate-600/50'
            }`}>
              {roadmapData.is_published ? <><Globe size={12} /> Public</> : <><EyeOff size={12} /> Private</>}
            </span>
          )}
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
          
          <button 
            onClick={handleSave}
            className={`transition-all duration-300 ${isSaved ? 'text-amber-500' : 'text-slate-400 hover:text-white'}`} 
            title={isSaved ? "Saved to profile" : "Save to profile"}
          >
            <BookmarkPlus size={20} fill={isSaved ? "currentColor" : "none"} />
          </button>
          
          <button 
            onClick={handleShare}
            className={`transition-all duration-300 flex items-center gap-2 ${isShared ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`} 
            title="Share roadmap"
          >
            {isShared ? <span className="text-[10px] font-bold uppercase tracking-wider">Link Copied!</span> : null}
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
