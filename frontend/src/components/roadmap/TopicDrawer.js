import { X, Play, FileText, Book, MessageSquare, ExternalLink, CheckCircle, CircleDashed, Sparkles, Send, Loader2, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRoadmapStore } from '@/stores/roadmapStore';
import { useAuth } from '@clerk/nextjs';
import api from '@/lib/api';
import confetti from 'canvas-confetti';

export default function TopicDrawer({ node, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('resources');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  
  const { updateNodeStatus } = useRoadmapStore();
  const { getToken } = useAuth();

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Clear messages when switching nodes
  useEffect(() => {
    if (node?.id) {
        setMessages([]);
        setInputMessage('');
        setIsTyping(false);
    }
  }, [node?.id]);

  if (!isOpen || !node) return null;

  const data = node.data;
  const resources = data.resources || {};

  const handleMarkAsDone = () => {
    updateNodeStatus(node.id, 'done', getToken);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981']
    });
  };

  const handleSendMessage = async (text = null) => {
    const messageText = text || inputMessage;
    if (!messageText.trim() || isTyping) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
        const response = await api.post('/tutor/ask', {
            topic: data.label,
            question: messageText,
            history: messages.slice(-6) // Send last 3 pairs for context
        }, {
            timeout: 120000 // 2 minutes timeout specifically for this AI tutor query
        });

        const aiMessage = { role: 'assistant', content: response.data.answer };
        setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
        console.error('Tutor Error:', error);
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "I'm sorry, I'm having trouble connecting to my brain right now. Please check your internet or try again later." 
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-[#0d0d26] border-l border-white/10 shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-start bg-[#1a1a3e]/50 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{data.label}</h2>
          <div className="flex gap-2">
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wider ${
              data.status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              data.status === 'skip' ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20' :
              'bg-amber-500/10 text-amber-500 border border-amber-500/20'
            }`}>
              {data.status.toUpperCase()}
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold tracking-wider capitalize">
              {data.type}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-6 border-b border-white/10 bg-[#0d0d26]">
        {[
            { id: 'about', label: 'Overview', icon: Book },
            { id: 'resources', label: 'Resources', icon: Play },
            { id: 'ai', label: 'AI Tutor', icon: Sparkles, color: 'text-purple-400' }
        ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === tab.id 
                ? tab.id === 'ai' ? 'border-purple-500 text-purple-400' : 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 bg-gradient-to-b from-[#0d0d26] to-[#0a0a23]">
        
        {activeTab === 'about' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="prose prose-invert prose-slate">
              <h3 className="text-lg font-bold text-white mb-3">What you'll learn</h3>
              <p className="text-slate-300 leading-relaxed text-sm bg-white/5 p-4 rounded-2xl border border-white/5">{data.description || "In this section, you will dive into the core principles of this topic and understand how it connects to the broader ecosystem of this roadmap."}</p>
            </div>

            {/* Sub-topics Checklist */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <CheckCircle size={16} className="text-indigo-400" /> Key Objectives
              </h3>
              <div className="space-y-3">
                {(data.subtopics || ['Understand core concepts', 'Explore practical examples', 'Review best practices']).map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group cursor-default shadow-sm">
                    <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-slate-600 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 scale-0 group-hover:scale-100 transition-transform" />
                    </div>
                    <span className="text-sm text-slate-200 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 leading-relaxed shadow-inner">
              <strong className="block mb-1 text-sm font-bold text-indigo-200">Study Tip</strong> 
              {data.label} is a core foundation. Take your time to practice the examples shared in the resources section for better retention.
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-slate-100">
            {/* YouTube */}
            {resources.youtube?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Play size={16} className="text-red-500" /> Video Tutorials
                </h3>
                <div className="space-y-4">
                  {resources.youtube.map((vid, idx) => {
                    const normalizedVid = typeof vid === 'string' ? { url: vid, title: 'Video Tutorial', channel: 'YouTube' } : {
                      url: vid?.url || '#',
                      title: vid?.title || 'Video Tutorial',
                      channel: vid?.channel || 'YouTube'
                    };
                    return (
                      <a key={idx} href={normalizedVid.url} target="_blank" rel="noreferrer" className="block p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-red-500/50 transition-all group shadow-lg">
                        <div className="flex justify-between items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                            <Play size={20} className="text-red-500" />
                          </div>
                          <div className="flex-1">
                            <span className="font-bold text-slate-100 group-hover:text-red-400 transition-colors text-sm block mb-1">{normalizedVid.title}</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              {normalizedVid.channel} • Video Resource
                            </span>
                          </div>
                          <ExternalLink size={16} className="text-slate-600 group-hover:text-white transition-colors shrink-0" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Articles */}
            {resources.articles?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-blue-400" /> Deep Dives
                </h3>
                <div className="space-y-4">
                  {resources.articles.map((art, idx) => {
                    const normalizedArt = typeof art === 'string' ? { url: art, title: 'Article Deep Dive' } : {
                      url: art?.url || '#',
                      title: art?.title || 'Article Deep Dive'
                    };
                    return (
                      <a key={idx} href={normalizedArt.url} target="_blank" rel="noreferrer" className="block p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-blue-500/50 transition-all group shadow-lg">
                        <div className="flex justify-between items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                            <Book size={20} className="text-blue-400" />
                          </div>
                          <span className="flex-1 font-bold text-slate-100 group-hover:text-blue-400 transition-colors text-sm">{normalizedArt.title}</span>
                          <ExternalLink size={16} className="text-slate-600 group-hover:text-white transition-colors shrink-0" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
            
            {(!resources.youtube?.length && !resources.articles?.length) && (
              <div className="text-center py-20 text-slate-500 flex flex-col items-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Book size={32} className="opacity-20" />
                </div>
                <p className="font-medium">No external resources found for this specific topic.</p>
                <p className="text-sm mt-1">Try asking the AI Tutor instead!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
            {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-10">
                    <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.2)] animate-pulse">
                        <Sparkles size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Personal AI Tutor</h3>
                        <p className="text-sm text-slate-400 px-6 max-w-xs mx-auto leading-relaxed">
                            Have questions about <span className="text-purple-400 font-semibold">{data.label}</span>? 
                            I'm here to help you understand complex concepts.
                        </p>
                    </div>

                    <div className="w-full space-y-3 px-4">
                        {[
                            `Explain ${data.label} in simple terms`,
                            `Give me a real-world example of ${data.label}`,
                            `What are the best practices for using ${data.label}?`
                        ].map((prompt, i) => (
                            <button 
                                key={i}
                                onClick={() => handleSendMessage(prompt)}
                                className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 text-sm text-slate-300 transition-all flex items-center justify-between group shadow-sm"
                            >
                                <span>{prompt}</span>
                                <Send size={14} className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 space-y-6 pb-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in zoom-in-95 duration-200`}>
                            <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-md flex gap-3 ${
                                msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                            }`}>
                                {msg.role === 'assistant' && <div className="p-1.5 h-7 w-7 bg-purple-500/20 rounded flex items-center justify-center shrink-0">
                                    <Sparkles size={14} className="text-purple-400" />
                                </div>}
                                <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                                {msg.role === 'user' && <div className="p-1.5 h-7 w-7 bg-white/10 rounded flex items-center justify-center shrink-0">
                                    <User size={14} className="text-white" />
                                </div>}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start animate-pulse">
                            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin text-purple-400" />
                                <span className="text-xs text-slate-400 font-medium">Tutor is thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            )}
          </div>
        )}

      </div>

      {/* Chat Input or Footer Actions */}
      <div className="p-6 border-t border-white/10 bg-[#151536]">
        {activeTab === 'ai' ? (
            <div className="relative group">
                <input 
                    type="text" 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask anything..." 
                    className="w-full bg-[#0d0d26] border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all text-sm shadow-inner" 
                />
                <button 
                    onClick={() => handleSendMessage()}
                    disabled={isTyping || !inputMessage.trim()}
                    className="absolute right-3 top-2.5 p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 transition-all text-white shadow-lg shadow-purple-900/20"
                >
                    {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
            </div>
        ) : (
            <div className="flex gap-4">
                {data.status === 'done' ? (
                <button 
                    onClick={() => updateNodeStatus(node.id, 'pending', getToken)}
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-900/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/40 font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                    <CheckCircle size={18} /> Mark as Pending
                </button>
                ) : (
                <button 
                    onClick={handleMarkAsDone}
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                >
                    <CheckCircle size={18} /> Mark as Done
                </button>
                )}

                {data.status === 'skip' ? (
                <button 
                    onClick={() => updateNodeStatus(node.id, 'pending', getToken)}
                    className="flex-1 py-3.5 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                    <CircleDashed size={18} /> Unskip
                </button>
                ) : (
                <button 
                    onClick={() => updateNodeStatus(node.id, 'skip', getToken)}
                    className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 font-bold text-sm transition-all"
                >
                    Skip
                </button>
                )}
            </div>
        )}
      </div>
    </div>
  );
}

