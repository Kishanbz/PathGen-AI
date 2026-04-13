'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Route, Clock, MoreVertical, Plus, Trophy, Target, BookOpen, Trash2, ExternalLink, Globe, EyeOff } from 'lucide-react';
import { useAuth, useUser } from '@clerk/nextjs';
import api from '@/lib/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } }
};

const statCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

// Skeleton components for instant perceived loading
function StatSkeleton() {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 flex items-center gap-4 animate-pulse">
      <div className="w-14 h-14 bg-slate-700/50 rounded-xl" />
      <div className="space-y-2 flex-1">
        <div className="h-3 w-24 bg-slate-700/50 rounded" />
        <div className="h-7 w-12 bg-slate-700/50 rounded" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-slate-700/50 rounded-xl" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-3/4 bg-slate-700/50 rounded" />
          <div className="h-3 w-1/2 bg-slate-700/50 rounded" />
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-3 w-full bg-slate-700/50 rounded" />
        <div className="h-2.5 w-full bg-slate-900 rounded-full" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [roadmaps, setRoadmaps] = useState([]);
  const [stats, setStats] = useState({ roadmaps_completed: 0, topics_mastered: 0, active_roadmaps: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null); // 'completed', 'mastered', 'active'
  const menuRef = useRef(null);

  // Filter roadmaps based on active filter
  const filteredRoadmaps = roadmaps.filter(rm => {
    if (!activeFilter) return true;
    if (activeFilter === 'completed') return rm.progress === 100;
    if (activeFilter === 'active') return rm.progress < 100;
    if (activeFilter === 'mastered') return rm.progress === 100; // Same as completed for now
    return true;
  });

  useEffect(() => {
    async function fetchData() {
      if (!isLoaded || !isSignedIn) {
        if (isLoaded && !isSignedIn) setLoading(false);
        return;
      }

      try {
        const token = await getToken();
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch roadmaps only - we'll calculate stats from the data
        const rmResponse = await api.get('/user/roadmaps', { headers, timeout: 30000 });

        // Remove duplicates - keep only the most recent roadmap for each topic
        const allRoadmaps = rmResponse.data.roadmaps || [];
        const uniqueRoadmaps = [];
        const seenTopics = new Set();

        // Sort by created_at descending (most recent first)
        const sortedRoadmaps = allRoadmaps.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        for (const rm of sortedRoadmaps) {
          if (!seenTopics.has(rm.topic)) {
            seenTopics.add(rm.topic);
            uniqueRoadmaps.push(rm);
          }
        }

        setRoadmaps(uniqueRoadmaps);
        
        // Calculate real stats from the actual roadmaps data
        const completedRoadmaps = uniqueRoadmaps.filter(rm => rm.progress === 100).length;
        const activeRoadmaps = uniqueRoadmaps.filter(rm => rm.progress < 100).length;
        // Topics mastered = sum of completed nodes across all roadmaps
        const topicsMastered = uniqueRoadmaps.reduce((sum, rm) => sum + (rm.completedNodes || 0), 0);
        
        setStats({
          roadmaps_completed: completedRoadmaps,
          topics_mastered: topicsMastered,
          active_roadmaps: activeRoadmaps
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
          setError('Request timed out. The server is taking too long to respond. Please try again.');
        } else {
          setError('Could not load dashboard data. Please refresh.');
        }
        // Still show the page with empty data
        setRoadmaps([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isLoaded, isSignedIn, getToken]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async (roadmapId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this roadmap?')) return;

    try {
      const token = await getToken();
      await api.delete(`/roadmaps/${roadmapId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove from local state
      setRoadmaps(prev => prev.filter(rm => rm.id !== roadmapId));
      setOpenMenuId(null);
    } catch (err) {
      console.error('Failed to delete roadmap:', err);
      alert('Failed to delete roadmap. Please try again.');
    }
  };

  const handlePublishToggle = async (roadmapId, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = await getToken();
      const response = await api.post(`/roadmaps/${roadmapId}/publish`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setRoadmaps(prev => prev.map(rm =>
        rm.id === roadmapId
          ? { ...rm, is_published: response.data.is_published }
          : rm
      ));
      setOpenMenuId(null);
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
      alert('Failed to update publish status. Please try again.');
    }
  };

  // Show skeleton immediately while Clerk is loading
  if (!isLoaded) {
    return (
      <motion.div
        className="container mx-auto px-4 py-12 max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl animate-pulse">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-slate-700/50" />
            <div className="space-y-3">
              <div className="h-7 w-48 bg-slate-700/50 rounded" />
              <div className="h-4 w-64 bg-slate-700/50 rounded" />
            </div>
          </div>
          <div className="h-10 w-32 bg-slate-700/50 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatSkeleton /><StatSkeleton /><StatSkeleton />
        </div>

        <div className="h-8 w-48 bg-slate-700/50 rounded mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      </motion.div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <div className="p-8 bg-slate-800/40 border border-slate-700/50 rounded-3xl">
          <BookOpen size={48} className="text-indigo-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-3">Sign in to view your Dashboard</h2>
          <p className="text-slate-400 mb-6">Track your learning progress, manage roadmaps, and unlock personalized features.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-12 max-w-6xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Profile Section */}
      <motion.div
        className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl"
        variants={cardVariants}
      >
        <div className="flex items-center gap-6">
          <motion.div
            className="w-20 h-20 rounded-full bg-indigo-500 overflow-hidden flex items-center justify-center text-3xl font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.firstName?.charAt(0) || 'A'
            )}
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{user?.fullName || 'Developer'}</h1>
            <p className="text-slate-400">{user?.primaryEmailAddress?.emailAddress} • Joined {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <motion.div>
          <Link
            href="/explore"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2"
          >
            New Roadmap
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {loading ? (
          <><StatSkeleton /><StatSkeleton /><StatSkeleton /></>
        ) : (
          <>
            <motion.div
              className={`bg-slate-800/50 border rounded-2xl p-6 flex items-center gap-4 cursor-pointer transition-all ${
                activeFilter === 'completed'
                  ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                  : 'border-slate-700 hover:border-emerald-500/50'
              }`}
              variants={statCardVariants}
              custom={0}
              whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(16,185,129,0.2)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFilter(activeFilter === 'completed' ? null : 'completed')}
            >
              <motion.div
                className={`p-4 rounded-xl ${activeFilter === 'completed' ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-400'}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Trophy size={28} />
              </motion.div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Roadmaps Completed</p>
                <motion.p
                  className="text-3xl font-bold text-white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {stats.roadmaps_completed}
                </motion.p>
              </div>
            </motion.div>
            <motion.div
              className={`bg-slate-800/50 border rounded-2xl p-6 flex items-center gap-4 cursor-pointer transition-all ${
                activeFilter === 'mastered'
                  ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30'
                  : 'border-slate-700 hover:border-purple-500/50'
              }`}
              variants={statCardVariants}
              custom={1}
              whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(168,85,247,0.2)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFilter(activeFilter === 'mastered' ? null : 'mastered')}
            >
              <motion.div
                className={`p-4 rounded-xl ${activeFilter === 'mastered' ? 'bg-purple-500 text-white' : 'bg-purple-500/10 text-purple-400'}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Target size={28} />
              </motion.div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Topics Mastered</p>
                <motion.p
                  className="text-3xl font-bold text-white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {stats.topics_mastered}
                </motion.p>
              </div>
            </motion.div>
            <motion.div
              className={`bg-slate-800/50 border rounded-2xl p-6 flex items-center gap-4 cursor-pointer transition-all ${
                activeFilter === 'active'
                  ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30'
                  : 'border-slate-700 hover:border-blue-500/50'
              }`}
              variants={statCardVariants}
              custom={2}
              whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(59,130,246,0.2)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFilter(activeFilter === 'active' ? null : 'active')}
            >
              <motion.div
                className={`p-4 rounded-xl ${activeFilter === 'active' ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-400'}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <BookOpen size={28} />
              </motion.div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Active Roadmaps</p>
                <motion.p
                  className="text-3xl font-bold text-white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {stats.active_roadmaps}
                </motion.p>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* User's Roadmaps */}
      <motion.div className="flex items-center justify-between mb-6" variants={fadeInUp}>
        <h2 className="text-2xl font-bold text-white">
          {activeFilter === 'completed' && 'Completed Roadmaps'}
          {activeFilter === 'mastered' && 'Mastered Topics'}
          {activeFilter === 'active' && 'Active Roadmaps'}
          {!activeFilter && 'Your Learning Paths'}
        </h2>
        {activeFilter && (
          <motion.button
            onClick={() => setActiveFilter(null)}
            className="text-sm text-slate-400 hover:text-white flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Clear Filter</span>
            <span className="text-xs">✕</span>
          </motion.button>
        )}
      </motion.div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          <CardSkeleton /><CardSkeleton />
        </motion.div>
      ) : filteredRoadmaps.length === 0 ? (
        <div className="bg-slate-800/20 border border-dashed border-slate-700 rounded-2xl p-12 text-center">
          <p className="text-slate-400 mb-6">
            {activeFilter === 'completed' && 'No completed roadmaps yet. Keep learning!'}
            {activeFilter === 'mastered' && 'No mastered topics yet. Keep going!'}
            {activeFilter === 'active' && 'No active roadmaps. Start learning something new!'}
            {!activeFilter && "You haven't generated any roadmaps yet."}
          </p>
          {!activeFilter && <Link href="/generate" className="text-indigo-400 hover:text-indigo-300 font-medium">Create your first roadmap &rarr;</Link>}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          <AnimatePresence mode="popLayout">
            {filteredRoadmaps.map(rm => (
              <motion.div
                key={rm.id}
                className="relative"
                variants={cardVariants}
                layout
                exit="exit"
              >
                <Link href={`/roadmap/${rm.id}`}>
                  <motion.div
                    className="bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/50 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer h-full shadow-lg group"
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className={`p-3 rounded-xl flex items-center justify-center ${rm.progress === 100 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {rm.progress === 100 ? <Trophy size={24} /> : <Route size={24} />}
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{rm.title}</h3>
                          <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                            <Clock size={14} /> Generated {new Date(rm.created_at).toLocaleDateString()}
                            {rm.is_published ? (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                <Globe size={10} /> Public
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-600/30 text-slate-400 border border-slate-600/50 flex items-center gap-1">
                                <EyeOff size={10} /> Private
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        className="text-slate-500 hover:text-white transition-colors p-1"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === rm.id ? null : rm.id);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MoreVertical size={20} />
                      </motion.button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-slate-300">{rm.progress}% Completed</span>
                        <span className="text-slate-500">{rm.completedNodes} / {rm.totalNodes} topics</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className={`h-full rounded-full transition-all duration-500 shadow-inner ${rm.progress === 100 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gradient-to-r from-indigo-500 to-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                            }`}
                          style={{ width: `${rm.progress}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {openMenuId === rm.id && (
                    <motion.div
                      ref={menuRef}
                      className="absolute right-4 top-14 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 py-1 w-44"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Link
                        href={`/roadmap/${rm.id}`}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors block"
                        onClick={() => setOpenMenuId(null)}
                      >
                        <ExternalLink size={16} /> Open
                      </Link>
                      <motion.button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                        onClick={(e) => handlePublishToggle(rm.id, e)}
                        whileHover={{ x: 4 }}
                      >
                        {rm.is_published ? (
                          <><EyeOff size={16} /> Make Private</>
                        ) : (
                          <><Globe size={16} /> Publish</>
                        )}
                      </motion.button>
                      <motion.button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
                        onClick={(e) => handleDelete(rm.id, e)}
                        whileHover={{ x: 4 }}
                      >
                        <Trash2 size={16} /> Delete
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}