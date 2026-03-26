'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';

function GenerateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topic = searchParams.get('topic') || '';

  // Simulation: Wait 3 seconds then redirect to mock roadmap
  if (typeof window !== 'undefined' && topic) {
    setTimeout(() => {
      router.push(`/roadmap/${topic.toLowerCase().replace(/\s+/g, '-')}`);
    }, 3000);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
        <Loader2 size={64} className="animate-spin text-indigo-500 relative z-10 mb-8" />
      </div>
      <h1 className="text-3xl md:text-5xl font-bold mb-6">
        Generating roadmap for <span className="text-indigo-400">"{topic}"</span>
      </h1>
      <p className="text-xl text-slate-400 flex items-center gap-2">
        <Sparkles size={20} className="text-indigo-400" />
        Our AI is analyzing the topic, searching for the best resources, and structuring your learning path...
      </p>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
      <GenerateContent />
    </Suspense>
  );
}
