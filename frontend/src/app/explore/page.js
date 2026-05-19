'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Route, BookOpen, Users, Sparkles } from 'lucide-react';
import api from '@/lib/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

// Skeleton card for instant perceived loading
function CardSkeleton() {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-slate-700/50 rounded-xl" />
        <div className="h-5 w-16 bg-slate-700/50 rounded-md" />
      </div>
      <div className="h-5 w-3/4 bg-slate-700/50 rounded mb-3" />
      <div className="h-4 w-1/2 bg-slate-700/50 rounded" />
      <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-700/50">
        <div className="h-4 w-20 bg-slate-700/50 rounded" />
        <div className="h-4 w-16 bg-slate-700/50 rounded" />
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const searchTimerRef = useRef(null);

  // Initial load - fetch immediately with no delay
  useEffect(() => {
    async function loadInitial() {
      try {
        const response = await api.get('/roadmaps');
        const mapped = (response.data.roadmaps || []).map(rm => ({
          id: rm.id,
          title: rm.topic,
          type: 'community',
          users: (rm.visits || 0) + ' views'
        }));
        setRoadmaps(mapped);
      } catch (err) {
        console.error('Initial load failed:', err);
        setRoadmaps([]);
      } finally {
        setLoading(false);
        setInitialLoaded(true);
      }
    }
    loadInitial();
  }, []);

  // Debounced search - only after initial load and when user types
  useEffect(() => {
    if (!initialLoaded) return;
    if (!searchQuery.trim()) {
      // If search is cleared, reload all roadmaps
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const response = await api.get('/roadmaps');
          setRoadmaps((response.data.roadmaps || []).map(rm => ({
            id: rm.id,
            title: rm.topic,
            type: 'community',
            users: (rm.visits || 0) + ' views'
          })));
        } catch (err) {
          console.error('Reload failed:', err);
        } finally {
          setLoading(false);
        }
      }, 100);
      return;
    }

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get(`/roadmaps/search?q=${encodeURIComponent(searchQuery)}`);
        setRoadmaps((response.data.roadmaps || []).map(rm => ({
          id: rm.id,
          title: rm.topic,
          type: 'community',
          users: (rm.visits || 0) + ' views'
        })));
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery, initialLoaded]);

  return (
    <motion.div 
      className="container mx-auto px-4 py-12 max-w-6xl min-h-[calc(100vh-64px)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Explore <span className="text-indigo-400">Roadmaps</span></h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Search the library or generate a new path instantly using AI.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div 
        className="flex flex-col md:flex-row gap-4 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-500" />
          </div>
          <motion.input
            type="text"
            placeholder="Search any topic (e.g. Quantum Computing, React, Cooking...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-lg shadow-inner"
            whileFocus={{ scale: 1.01 }}
          />
        </div>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </motion.div>
      ) : roadmaps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((rm) => (
            <Link key={rm.id} href={`/roadmap/${rm.id}`}>
              <div className="group bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-2 hover:scale-[1.02]">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <Route size={24} />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-indigo-500/20 text-indigo-400">
                      AI Verified
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-indigo-300 transition-colors">
                    {rm.title}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-6 pt-4 border-t border-slate-700/50 text-sm font-medium text-slate-400">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-slate-500" />
                    <span>View Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-slate-500" />
                    <span>{rm.users}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <motion.div 
          className="py-20 text-center flex flex-col items-center bg-slate-800/20 rounded-3xl border border-dashed border-slate-700"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 bg-slate-800 rounded-full mb-6">
             <Search size={48} className="text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Topic not in library yet?</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">We couldn't find a roadmap for "{searchQuery}". But our AI can generate a custom learning path from the internet in seconds!</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href={`/generate?topic=${encodeURIComponent(searchQuery)}`}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-indigo-500/20 transition-all flex items-center gap-3 inline-flex"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={20} className="text-indigo-200" />
              </motion.span>
              Generate "{searchQuery}" with AI
            </Link>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
