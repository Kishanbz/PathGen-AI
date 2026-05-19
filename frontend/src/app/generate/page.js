'use client';

import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, Sparkles, Clock, Timer, Zap } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import api from '@/lib/api';

function GenerateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const topic = searchParams.get('topic') || '';
  const [error, setError] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Zap, text: "Analyzing topic structure...", duration: 5 },
    { icon: Sparkles, text: "Searching best resources...", duration: 10 },
    { icon: Clock, text: "Structuring learning path...", duration: 15 },
    { icon: Timer, text: "Finalizing roadmap...", duration: 20 }
  ];

  useEffect(() => {
    async function startGeneration() {
      if (!isLoaded || !isSignedIn || !topic) return;

      try {
        const token = await getToken();
        const response = await api.post('/roadmaps/generate',
          { topic },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data?.id) {
          router.push(`/roadmap/${response.data.id}`);
        }
      } catch (err) {
        console.error('Generation failed:', err);
        setError(err.response?.data?.detail || 'Failed to generate roadmap. Please try again.');
      }
    }

    startGeneration();
  }, [topic, isLoaded, isSignedIn, getToken, router]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Step progress based on elapsed time
  useEffect(() => {
    const stepIndex = Math.min(Math.floor(elapsedTime / 8), steps.length - 1);
    setCurrentStep(stepIndex);
  }, [elapsedTime]);

  if (error) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl font-bold mb-4 text-red-400 font-serif"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          Oops! Something went wrong
        </motion.h1>
        <p className="text-slate-400 mb-8">{error}</p>
        <motion.button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Return Home
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <Loader2 size={64} className="animate-spin text-indigo-500 relative z-10 mb-8" />
      </motion.div>
      <motion.h1
        className="text-3xl md:text-5xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Generating roadmap for <motion.span
          className="text-indigo-400 inline-block"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >"{topic}"</motion.span>
      </motion.h1>
      <motion.p
        className="text-xl text-slate-400 flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <motion.span
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles size={20} className="text-indigo-400" />
        </motion.span>
        Our AI is analyzing the topic, searching for the best resources, and structuring your learning path...
      </motion.p>

      {/* Progress Steps */}
      <motion.div
        className="mt-8 flex flex-col gap-3 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index === currentStep;
          const isDone = index < currentStep;

          return (
            <motion.div
              key={index}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${isActive
                  ? 'bg-indigo-500/20 border border-indigo-500/30'
                  : isDone
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : 'bg-slate-800/30 border border-slate-700/30'
                }`}
              animate={isActive ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
            >
              <div className={`p-1.5 rounded-full ${isActive ? 'bg-indigo-500/30 text-indigo-400' :
                  isDone ? 'bg-emerald-500/30 text-emerald-400' :
                    'bg-slate-700/50 text-slate-500'
                }`}>
                <StepIcon size={14} />
              </div>
              <span className={`text-sm ${isActive ? 'text-indigo-300' :
                  isDone ? 'text-emerald-400 line-through' :
                    'text-slate-500'
                }`}>
                {step.text}
              </span>
              {isActive && (
                <motion.div
                  className="ml-auto w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              )}
              {isDone && (
                <span className="ml-auto text-emerald-400 text-xs">Done</span>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Fun Fact Tip */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="text-slate-500 text-sm italic">
          Did you know? Learning in small chunks improves retention by 40%!
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={
      <motion.div
        className="min-h-[70vh] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading...
      </motion.div>
    }>
      <GenerateContent />
    </Suspense>
  );
}
