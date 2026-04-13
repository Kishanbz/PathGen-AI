import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, Star, Layers, ScrollText, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RoadmapNode({ data, selected }) {
  // Use data properties or fallback to sensible defaults
  const isDone = data.status === 'done';
  const isSkipped = data.status === 'skip';
  const label = data.label || "Untitled Topic";
  const desc = data.description || "Detailed analysis and practical implementation of core concepts.";
  const type = data.type || "TOPIC";
  const subtopics = data.subtopics || ["Core Principles", "Implementation", "Best Practices"];
  const resourceCount = (data.resources?.youtube?.length || 0) + (data.resources?.articles?.length || 0) || 2;

  const isMilestone = type.toLowerCase() === 'milestone' || type.toLowerCase() === 'theory' || label.toLowerCase().includes('foundation');

  // Hardcoded premium styles with explicit width/height
  const nodeBaseStyles = "relative rounded-2xl px-6 py-6 border transition-all duration-500 cursor-pointer group flex flex-col gap-4 w-80 min-h-[220px]";
  
  const getContainerStyles = () => {
    if (isDone) return 'bg-emerald-900 border-emerald-500 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.3)]';
    if (isSkipped) return 'bg-slate-900/90 border-slate-800 text-slate-500 opacity-60';
    return 'bg-[#0f172a] border-white/20 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-indigo-500/80';
  };

  return (
    <div 
      className={cn(
        nodeBaseStyles,
        getContainerStyles(),
        selected ? 'ring-2 ring-indigo-500 ring-offset-8 ring-offset-slate-950 scale-[1.05] z-30' : 'hover:scale-[1.02]'
      )}
    >
      {/* Absolute Handles with explicit IDs */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="target" 
        className="!bg-indigo-500 !w-4 !h-4 !border-2 !border-white !z-50" 
      />
      
      {/* Top Header Section */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                isDone ? "bg-emerald-400" : isSkipped ? "bg-slate-600" : "bg-indigo-500"
            )} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                {type}
            </span>
          </div>
          <div className="flex items-center gap-2">
             {isDone && <CheckCircle2 size={16} className="text-emerald-400" />}
             <span className="text-[10px] font-mono text-slate-500">Node</span>
          </div>
      </div>

      {/* Title & Core Description */}
      <div className="space-y-2">
        <h3 className={cn(
            "font-black text-xl tracking-tight leading-none transition-all",
            isDone ? "text-emerald-200" : "text-white"
        )}>
            {label}
        </h3>
        <p className="text-[12px] leading-relaxed text-slate-400 line-clamp-2">
            {desc}
        </p>
      </div>

      {/* THE "DETALING" SECTION (Sub-topics) */}
      <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest">
            <ScrollText size={12} />
            Focus Areas
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {subtopics.slice(0, 3).map((sub, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
              <div className="w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
              <span className="truncate">{sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Stats */}
      <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                <Layers size={14} className="text-indigo-400/60" />
                <span>{resourceCount} RESOURCES</span>
            </div>
          </div>

          {isMilestone && (
              <div className="bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[9px] font-black text-amber-500 uppercase tracking-tighter">
                Key Step
              </div>
          )}
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        id="source" 
        className="!bg-indigo-500 !w-4 !h-4 !border-2 !border-white !z-50" 
      />
    </div>
  );
}
