"use client";

import { motion } from "framer-motion";
import { BookOpen, Target, Clock, TrendingUp, Sparkles, LogOut, BrainCircuit, Settings } from "lucide-react";
import Link from "next/link";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
    const { user } = useUser();
    const { signOut } = useClerk();

    const handleLogout = () => {
        signOut({ redirectUrl: "/" });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <motion.aside
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full md:w-64 border-r border-white/5 bg-black/20 backdrop-blur-md p-6 flex flex-col"
            >
                <div className="flex items-center gap-2 mb-12">
                    <BrainCircuit className="h-8 w-8 text-purple-500" />
                    <span className="text-xl font-bold">PathGen-AI</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <div className="bg-white/10 rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-medium text-white shadow-sm ring-1 ring-white/10">
                        <BookOpen className="h-5 w-5 text-purple-400" /> Dashboard
                    </div>
                    <Link href="/assessment" className="hover:bg-white/5 rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-medium text-gray-400 transition-colors">
                        <Target className="h-5 w-5" /> Path & Modules
                    </Link>
                    <div className="hover:bg-white/5 rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-medium text-gray-400 transition-colors cursor-not-allowed">
                        <TrendingUp className="h-5 w-5" /> Analytics
                    </div>
                    <Link href="/profile" className="hover:bg-white/5 rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-medium text-gray-400 transition-colors">
                        <Settings className="h-5 w-5" /> Settings
                    </Link>
                </nav>

                <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <UserButton afterSignOutUrl="/" />
                        <span className="text-sm text-gray-300 truncate">{user?.fullName || user?.primaryEmailAddress?.emailAddress || "Student"}</span>
                    </div>
                    <button onClick={handleLogout} className="hover:bg-white/5 text-gray-400 hover:text-white transition-colors rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-medium w-full">
                        <LogOut className="h-5 w-5" /> Logout
                    </button>
                </div>
            </motion.aside>

            {/* Main Dashboard Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Welcome back, {user?.firstName || user?.primaryEmailAddress?.emailAddress || "Student"} 👋</h1>
                        <p className="text-gray-400">Here&apos;s your personalized learning overview.</p>
                    </div>
                    <Link href="/assessment">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-2.5 font-medium flex items-center gap-2 shadow-lg shadow-purple-500/20"
                        >
                            <Sparkles className="h-4 w-4" /> Start Next Module
                        </motion.button>
                    </Link>
                </header>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10"
                >
                    {/* Stats Cards */}
                    <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                                <Target className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-400">Current Path Progress</p>
                                <div className="flex items-end gap-2 text-2xl font-bold text-white">42%</div>
                            </div>
                        </div>
                        <div className="mt-4 w-full bg-white/10 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "42%" }} />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                                <Clock className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-400">Time Spent Learning</p>
                                <div className="flex items-end gap-2 text-2xl font-bold text-white">12.5 <span className="text-sm text-gray-500">hours</span></div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-purple-400 font-medium">↑ 2.5 hrs this week</p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-400">AI Performance Prediction</p>
                                <div className="flex items-end gap-2 text-2xl font-bold text-white">85<span className="text-sm text-gray-500">/100</span></div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-emerald-400 font-medium">Excellent trajectory</p>
                    </motion.div>
                </motion.div>

                <h2 className="text-xl font-bold text-white mb-6">AI Recommended Next Modules</h2>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-2"
                >
                    {/* Module Cards */}
                    <motion.div variants={itemVariants} className="group relative bg-[#12121a] border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-colors overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-white/10 text-xs font-semibold px-2.5 py-1 rounded-md text-gray-300">Data Science</div>
                                <span className="text-xs text-purple-400 font-medium flex items-center gap-1"><Sparkles className="h-3 w-3" /> 92% Match</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Advanced Vector Search with FAISS</h3>
                            <p className="text-sm text-gray-400 flex-1 mb-6">Master similarity search techniques critical for building responsive RAG models.</p>
                            <button className="text-sm font-semibold text-white flex items-center gap-2 mt-auto w-fit bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">
                                Begin Module
                            </button>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="group relative bg-[#12121a] border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-colors overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-white/10 text-xs font-semibold px-2.5 py-1 rounded-md text-gray-300">Machine Learning</div>
                                <span className="text-xs text-blue-400 font-medium flex items-center gap-1"><Sparkles className="h-3 w-3" /> 88% Match</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Intro to XGBoost Regressors</h3>
                            <p className="text-sm text-gray-400 flex-1 mb-6">Build predictive performance models using gradient boosting trees.</p>
                            <button className="text-sm font-semibold text-white flex items-center gap-2 mt-auto w-fit bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">
                                Begin Module
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}
