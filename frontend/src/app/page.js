'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, BookOpen, Route, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
  }
};

const iconFloat = {
  y: [0, -8, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
};

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
    <motion.div 
      className="flex flex-col min-h-screen"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
        {/* Abstract background blobs */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-8 border border-indigo-500/20"
            variants={fadeInUp}
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles size={16} />
            </motion.span>
            <span>AI-Powered Learning Roadmaps</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
            variants={fadeInUp}
          >
            Learn anything with a <br className="hidden md:block"/>
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 inline-block"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              structured path.
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl"
            variants={fadeInUp}
          >
            Stop wandering the internet. Enter any topic and our AI will generate a step-by-step roadmap with curated YouTube videos, articles, and documentation.
          </motion.p>

          <motion.form 
            onSubmit={handleGenerate} 
            className="w-full max-w-2xl relative group"
            variants={fadeInUp}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
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
            <motion.button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 rounded-xl transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              Generate
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Sparkles size={18} />
              </motion.span>
            </motion.button>
          </motion.form>

          <motion.div 
            className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-400"
            variants={fadeInUp}
          >
            <span>Try:</span>
            {['React.js', 'System Design', 'Machine Learning'].map((t, i) => (
              <motion.button 
                key={t}
                onClick={() => setTopic(t)} 
                className="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                {t}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Roadmaps */}
      <section className="py-20 bg-slate-900 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div 
            className="flex items-center justify-between mb-12 flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold">Featured Roadmaps</h2>
            <Link href="/explore" className="text-indigo-400 hover:text-indigo-300 font-medium">View all roadmaps &rarr;</Link>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { title: "Frontend Developer", topics: 42, type: "Role" },
              { title: "Backend Developer", topics: 38, type: "Role" },
              { title: "DevOps Engineer", topics: 29, type: "Role" },
              { title: "React Ecosystem", topics: 24, type: "Skill" },
              { title: "System Design", topics: 18, type: "Skill" },
              { title: "Docker & Kubernetes", topics: 22, type: "Skill" },
            ].map((rm, i) => (
              <motion.div key={i} variants={cardVariants}>
                <Link href={`/roadmap/${rm.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <motion.div 
                    className="group bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-indigo-500/50 rounded-2xl p-6 transition-all cursor-pointer h-full flex flex-col justify-between"
                    whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 40px rgba(99,102,241,0.15)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <motion.div 
                          className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400"
                          whileHover={{ rotate: 5, scale: 1.1 }}
                        >
                          <Route size={24} />
                        </motion.div>
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
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How PathGen<span className="text-indigo-400">AI</span> works
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Connecting line for desktop */}
            <motion.div 
              className="hidden md:block absolute top-[30px] left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-indigo-500/50 via-indigo-400 to-indigo-500/50"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            
            {[
              { icon: Search, title: "1. Enter any topic", desc: "Type what you want to learn. It could be a programming language, a framework, or a general skill.", color: "text-indigo-400", bg: "bg-slate-800" },
              { icon: Route, title: "2. AI Builds Roadmap", desc: "Our AI engine structures the topic into a logical, step-by-step visual flowchart with curated resources.", color: "text-white", bg: "bg-indigo-600", shadow: "shadow-[0_0_20px_rgba(99,102,241,0.4)]" },
              { icon: CheckCircle, title: "3. Learn & Track", desc: "Watch videos, read articles, mark topics as complete, and watch your progress bar fill up.", color: "text-green-400", bg: "bg-slate-800" },
            ].map((step, i) => (
              <motion.div 
                key={i}
                className="flex flex-col items-center relative z-10"
                variants={fadeInUp}
              >
                <motion.div 
                  className={`w-16 h-16 rounded-2xl border border-slate-700 flex items-center justify-center ${step.color} mb-6 shadow-lg ${step.bg} ${step.shadow || ''}`}
                  animate={iconFloat}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <step.icon size={32} />
                </motion.div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <motion.footer 
        className="mt-auto py-8 border-t border-white/10 text-center text-slate-500 text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p>Built with Next.js, FastAPI, LangChain & Tailwind. Inspired by roadmap.sh.</p>
      </motion.footer>
    </motion.div>
  );
}
