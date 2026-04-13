'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Map, LogIn } from 'lucide-react';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

const navVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const linkHover = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

export default function Navbar() {
  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a23]/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-16 items-center flex-row justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="bg-indigo-600 rounded p-1.5 text-white group-hover:bg-indigo-500 transition-colors"
            >
              <Map size={20} className="stroke-[2.5]" />
            </motion.div>
            <motion.span 
              className="text-xl font-bold tracking-tight text-white"
              whileHover={linkHover}
            >
              PathGen<span className="text-indigo-400">AI</span>
            </motion.span>
          </Link>

          <div className="hidden md:flex items-center gap-6 ml-4">
            <motion.div whileHover={linkHover}>
              <Link
                href="/explore"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Explore
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <p
              href="/generate"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-indigo-400"
            >
              <span>
                <Sparkles size={16} />
              </span>
              Powered by AI
            </p>
          </motion.div>

          <div className="h-5 w-px bg-white/10 hidden sm:block mx-1" />

          <Show when="signed-out">
            <SignInButton mode="modal">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2 px-3 py-2"
              >
                <span className="hidden sm:inline">Log in</span>
                <LogIn size={18} />
              </motion.button>
            </SignInButton>
            <SignUpButton mode="modal">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(99,102,241,0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] ml-2"
              >
                Sign Up
              </motion.button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <motion.div whileHover={linkHover}>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 border-2 border-indigo-500/50"
                  }
                }}
                afterSignOutUrl="/"
              />
            </motion.div>
          </Show>
        </div>
      </div>
    </motion.nav>
  );
}
