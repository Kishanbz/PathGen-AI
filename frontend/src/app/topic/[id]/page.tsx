"use client";

import { motion } from "framer-motion";
import { ArrowLeft, PlayCircle, FileText, HelpCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function TopicPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Top Navbar */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="flex h-16 items-center px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <div className="ml-auto flex items-center gap-4">
                        <div className="h-2 w-32 rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-purple-500" style={{ width: "40%" }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-400">40% Complete</span>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 md:p-12 lg:flex lg:gap-10">
                {/* Main Content Area */}
                <main className="flex-1">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="mb-4 inline-flex items-center rounded-md bg-purple-500/20 px-2.5 py-1 text-xs font-semibold text-purple-400">
                            Module {resolvedParams.id}
                        </div>
                        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl text-white">
                            Advanced Vector Search with FAISS
                        </h1>
                        <p className="text-lg text-gray-400">
                            Learn how to implement highly efficient semantic search retrieval systems for large-scale LLM architectures.
                        </p>
                    </motion.div>

                    {/* Video Player Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-2xl"
                    >
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-black">
                            <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-110 active:scale-95">
                                <PlayCircle className="ml-1 h-8 w-8" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Tabs / Subcontent */}
                    <div className="mt-8">
                        <div className="mb-6 flex space-x-1 border-b border-white/10 pb-px">
                            <button className="border-b-2 border-purple-500 px-4 py-2 text-sm font-semibold text-white">Overview</button>
                            <button className="border-b-2 border-transparent px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white">Transcript</button>
                            <button className="border-b-2 border-transparent px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white">Resources</button>
                        </div>
                        <div className="prose prose-invert max-w-none text-gray-300">
                            <p>
                                In this video, we dive deep into <strong>Facebook AI Similarity Search (FAISS)</strong>. You&apos;ll learn the difference between exhaustive search (Flat L2) and IndexIVF for faster approximations.
                            </p>
                            <h3>Key Takeaways:</h3>
                            <ul>
                                <li>Vector embeddings and dimensionality</li>
                                <li>Choosing the right index for your dataset size</li>
                                <li>Integrating FAISS directly with LangChain RAG chains</li>
                            </ul>
                        </div>
                    </div>
                </main>

                {/* Sidebar / Curriculum */}
                <aside className="mt-12 w-full shrink-0 space-y-4 lg:mt-0 lg:w-80 lg:space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                        <h2 className="mb-4 text-lg font-bold text-white">Course Syllabus</h2>
                        <div className="space-y-3">
                            {[
                                { title: "Introduction to Embeddings", icon: FileText, done: true },
                                { title: "Understanding Vector Spaces", icon: PlayCircle, done: true },
                                { title: "Advanced Vector Search with FAISS", icon: PlayCircle, done: false, active: true },
                                { title: "Optimizing IVF Indices", icon: FileText, done: false },
                                { title: "Module Quiz", icon: HelpCircle, done: false },
                            ].map((item, idx) => (
                                <div key={idx} className={`flex items-start gap-3 rounded-xl p-3 ${item.active ? 'bg-white/10' : 'hover:bg-white/5'} transition-colors cursor-pointer`}>
                                    {item.done ? (
                                        <div className="mt-0.5"><CheckCircle className="h-5 w-5 text-emerald-400" /></div>
                                    ) : (
                                        <div className={`mt-0.5 rounded-full p-1 ${item.active ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-gray-500'}`}>
                                            <item.icon className="h-3.5 w-3.5" />
                                        </div>
                                    )}
                                    <div>
                                        <p className={`text-sm font-medium leading-tight text-left ${item.active ? 'text-white' : item.done ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {item.title}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {item.icon === PlayCircle ? '12 min video' : item.icon === FileText ? '5 min read' : 'Assessment'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
