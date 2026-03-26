import { X, Youtube, FileText, Book, MessageSquare, ExternalLink, CheckCircle, CircleDashed } from 'lucide-react';
import { useState } from 'react';
import { useRoadmapStore } from '@/stores/roadmapStore';
import confetti from 'canvas-confetti';

export default function TopicDrawer({ node, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('resources');
  const { updateNodeStatus } = useRoadmapStore();

  if (!isOpen || !node) return null;

  const data = node.data;
  const resources = data.resources || {};

  const handleMarkAsDone = () => {
    updateNodeStatus(node.id, 'done');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981']
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-[#1a1a3e] border-l border-white/10 shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{data.label}</h2>
          <div className="flex gap-2">
            <span className={`text-xs px-2 py-1 rounded font-medium ${
              data.status === 'done' ? 'bg-green-500/20 text-green-400' :
              data.status === 'skip' ? 'bg-slate-500/20 text-slate-400' :
              'bg-yellow-500/20 text-yellow-500'
            }`}>
              {data.status.toUpperCase()}
            </span>
            <span className="text-xs px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 font-medium capitalize">
              {data.type}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-6 border-b border-white/10">
        <button 
          onClick={() => setActiveTab('resources')}
          className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'resources' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          Resources
        </button>
        <button 
          onClick={() => setActiveTab('about')}
          className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'about' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          About
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`py-4 px-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'ai' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-purple-400'}`}
        >
          <SparklesIcon size={16} /> AI Tutor
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
        
        {activeTab === 'about' && (
          <div className="prose prose-invert prose-slate">
            <p className="text-slate-300 leading-relaxed">{data.description || "No description provided."}</p>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            {/* YouTube */}
            {resources.youtube?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Youtube size={16} className="text-red-500" /> Watch
                </h3>
                <div className="space-y-3">
                  {resources.youtube.map((vid, idx) => (
                    <a key={idx} href={vid.url} target="_blank" rel="noreferrer" className="block p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 transition-all group">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-2">{vid.title}</span>
                        <ExternalLink size={14} className="text-slate-500 shrink-0 mt-1" />
                      </div>
                      <span className="text-xs text-slate-500 mt-2 block">{vid.channel}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Articles */}
            {resources.articles?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 mt-6">
                  <FileText size={16} className="text-blue-400" /> Read
                </h3>
                <div className="space-y-3">
                  {resources.articles.map((art, idx) => (
                    <a key={idx} href={art.url} target="_blank" rel="noreferrer" className="block p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all group">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-200 group-hover:text-blue-400 transition-colors truncate">{art.title}</span>
                        <ExternalLink size={14} className="text-slate-500 shrink-0" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {(!resources.youtube?.length && !resources.articles?.length) && (
              <div className="text-center py-12 text-slate-500 flex flex-col items-center">
                <Book size={32} className="mb-3 opacity-20" />
                <p>No external resources found for this topic.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col h-full justify-between pb-4">
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ask AI Tutor</h3>
              <p className="text-sm text-slate-400 px-4">Have specific questions about {data.label}? Our AI can help explain it to you.</p>
            </div>
            
            <div className="mt-8 space-y-3">
              <button className="w-full text-left p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-sm text-slate-300">Explain {data.label} like I'm 5</button>
              <button className="w-full text-left p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-sm text-slate-300">Test my knowledge</button>
              <div className="relative mt-4">
                <input type="text" placeholder="Type your question..." className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-white focus:outline-none focus:border-purple-500 text-sm" />
                <button className="absolute right-3 top-3 text-purple-400 hover:text-purple-300">
                  <ArrowUpIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-white/10 bg-[#151536] flex gap-3">
        {data.status === 'done' ? (
          <button 
            onClick={() => updateNodeStatus(node.id, 'pending')}
            className="flex-1 py-2.5 rounded-lg bg-emerald-900/30 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-900/50 font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} /> Mark as Pending
          </button>
        ) : (
          <button 
            onClick={handleMarkAsDone}
            className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} /> Mark as Done
          </button>
        )}

        {data.status === 'skip' ? (
          <button 
            onClick={() => updateNodeStatus(node.id, 'pending')}
            className="flex-1 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <CircleDashed size={16} /> Unskip
          </button>
        ) : (
          <button 
            onClick={() => updateNodeStatus(node.id, 'skip')}
            className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium text-sm transition-colors"
          >
            Skip Topic
          </button>
        )}
      </div>
    </div>
  );
}

function SparklesIcon({ size }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
}

function ArrowUpIcon({ size }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
}
