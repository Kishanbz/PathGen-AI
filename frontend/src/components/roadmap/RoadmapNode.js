import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, CircleDashed, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RoadmapNode({ data, selected }) {
  // roadmap.sh style colors
  const bgColor = data.status === 'done' 
    ? 'bg-emerald-900/40 border-emerald-500/50' 
    : data.status === 'skip'
    ? 'bg-slate-800/60 border-slate-600/50 text-slate-400'
    : 'bg-[#fdf6e3] text-slate-900 border-[#fdf6e3]/80'; // Default pending (yellowish)

  const isMilestone = data.type === 'milestone';
  const widthClass = isMilestone ? 'w-48' : 'w-40';

  return (
    <div 
      className={cn(
        "relative rounded-lg px-4 py-3 shadow-md border-2 transition-all cursor-pointer",
        bgColor,
        widthClass,
        selected ? 'ring-2 ring-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-105' : 'hover:scale-105'
      )}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-sm truncate">{data.label}</span>
        
        {data.status === 'done' && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
        {data.status === 'skip' && <XCircle size={16} className="text-slate-500 shrink-0" />}
        {data.status === 'pending' && <CircleDashed size={16} className="text-slate-400/50 shrink-0" />}
      </div>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      {/* Handles for side branches */}
      <Handle type="source" position={Position.Right} id="right" className="opacity-0" />
      <Handle type="target" position={Position.Left} id="left" className="opacity-0" />
    </div>
  );
}
