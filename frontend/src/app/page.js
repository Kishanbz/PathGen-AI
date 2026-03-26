'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, BookOpen, Route, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [topic, setTopic] = useState('');

  const handleGenerate = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      router.push(`/generate?topic=${encodeURIComponent(topic)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
        {/* Abstract background blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-8 border border-indigo-500/20">
            <Sparkles size={16} />
            <span>AI-Powered Learning Roadmaps</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Learn anything with a <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              structured path.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl">
            Stop wandering the internet. Enter any topic and our AI will generate a step-by-step roadmap with curated YouTube videos, articles, and documentation.
          </p>

          <form onSubmit={handleGenerate} className="w-full max-w-2xl relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search size={22} className="text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What do you want to learn? (e.g. Docker, Next.js, Math)"
              className="w-full pl-14 pr-36 py-5 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl text-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xl transition-all"
              required
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 rounded-xl transition-colors flex items-center gap-2"
            >
              Generate
              <Sparkles size={18} />
            </button>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-400">
            <span>Try:</span>
            <button onClick={() => setTopic('React.js')} className="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">React.js</button>
            <button onClick={() => setTopic('System Design')} className="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">System Design</button>
            <button onClick={() => setTopic('Machine Learning')} className="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">Machine Learning</button>
          </div>
        </div>
      </section>

      {/* Popular Roadmaps */}
      <section className="py-20 bg-slate-900 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-12 flex-col sm:flex-row gap-4">
            <h2 className="text-3xl font-bold">Featured Roadmaps</h2>
            <Link href="/explore" className="text-indigo-400 hover:text-indigo-300 font-medium">View all roadmaps &rarr;</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Frontend Developer", topics: 42, type: "Role" },
              { title: "Backend Developer", topics: 38, type: "Role" },
              { title: "DevOps Engineer", topics: 29, type: "Role" },
              { title: "React Ecosystem", topics: 24, type: "Skill" },
              { title: "System Design", topics: 18, type: "Skill" },
              { title: "Docker & Kubernetes", topics: 22, type: "Skill" },
            ].map((rm, i) => (
              <Link href={`/roadmap/${rm.title.toLowerCase().replace(/\s+/g, '-')}`} key={i}>
                <div className="group bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-indigo-500/50 rounded-2xl p-6 transition-all cursor-pointer h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Route size={24} />
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded bg-slate-700/50 text-slate-300">
                        {rm.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-white">{rm.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400 mt-6 pt-4 border-t border-slate-700/50">
                    <BookOpen size={16} />
                    <span>{rm.topics} Topics to master</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">How PathGen<span className="text-indigo-400">AI</span> works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 mb-6 shadow-lg">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Enter any topic</h3>
              <p className="text-slate-400">Type what you want to learn. It could be a programming language, a framework, or a general skill.</p>
            </div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 border border-indigo-500 flex items-center justify-center text-white mb-6 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                <Route size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">2. AI Builds Roadmap</h3>
              <p className="text-slate-400">Our AI engine structures the topic into a logical, step-by-step visual flowchart with curated resources.</p>
            </div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-green-400 mb-6 shadow-lg">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Learn & Track</h3>
              <p className="text-slate-400">Watch videos, read articles, mark topics as complete, and watch your progress bar fill up.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-auto py-8 border-t border-white/10 text-center text-slate-500 text-sm">
        <p>Built with Next.js, FastAPI, LangChain & Tailwind. Inspired by roadmap.sh.</p>
      </footer>
    </div>
  );
}
