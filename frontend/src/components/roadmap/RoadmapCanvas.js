'use client';

import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, Controls, Background, MiniMap, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import RoadmapNode from './RoadmapNode';
import TopicDrawer from './TopicDrawer';
import { useRoadmapStore } from '@/stores/roadmapStore';

const nodeTypes = {
  roadmapNode: RoadmapNode,
};

export default function RoadmapCanvas({ initialEdges }) {
  const { roadmapData } = useRoadmapStore();
  
  // Local state for React Flow graph position
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync React Flow nodes with Zustand store
  useEffect(() => {
    if (roadmapData?.nodes) {
      setNodes(roadmapData.nodes);
    }
    if (initialEdges && edges.length === 0) {
      setEdges(initialEdges);
    }
  }, [roadmapData?.nodes, initialEdges, setNodes, setEdges, edges.length]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedNodeId(null);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-[#0a0a23]"
        minZoom={0.2}
        maxZoom={1.5}
        defaultEdgeOptions={{ type: 'smoothstep' }}
      >
        <Background color="rgba(255,255,255,0.05)" gap={16} />
        <Controls 
          className="bg-slate-800 border-slate-700 fill-white" 
          showInteractive={false} 
        />
        <MiniMap 
          nodeColor={(n) => {
            if (n.data?.status === 'done') return '#22c55e';
            if (n.data?.status === 'skip') return '#64748b';
            return '#f5e6a3';
          }}
          maskColor="rgba(10, 10, 35, 0.7)"
          className="bg-[#1a1a3e] border border-white/10 rounded-lg shadow-xl hidden sm:block"
        />
      </ReactFlow>

      {/* Overlay Drawer */}
      <TopicDrawer 
        node={selectedNode} 
        isOpen={isDrawerOpen} 
        onClose={closeDrawer} 
      />

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs text-slate-300 shadow-xl hidden sm:block">
        <h4 className="font-semibold text-white mb-2 uppercase tracking-wide">Status</h4>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#fdf6e3]"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span>Done</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-500"></div>
          <span>Skipped</span>
        </div>
      </div>
    </div>
  );
}
