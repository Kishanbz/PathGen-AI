'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import api from '@/lib/api';

function GenerateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const topic = searchParams.get('topic') || '';
  const [error, setError] = useState(null);

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-3xl font-bold mb-4 text-red-400 font-serif">Oops! Something went wrong</h1>
        <p className="text-slate-400 mb-8">{error}</p>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
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
