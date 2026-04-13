'use client';

import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, Controls, Background, MiniMap, useNodesState, useEdgesState, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import RoadmapNode from './RoadmapNode';
import TopicDrawer from './TopicDrawer';
import { useRoadmapStore } from '@/stores/roadmapStore';

// Map EVERYTHING to our RoadmapNode to ensure no blank boxes
const nodeTypes = {
  custom: RoadmapNode,
  roadmapNode: RoadmapNode,
  milestone: RoadmapNode,
  step: RoadmapNode,
  theory: RoadmapNode,
  practice: RoadmapNode,
  tool: RoadmapNode,
  default: RoadmapNode, // Override default
  input: RoadmapNode,   // Override input
  output: RoadmapNode,  // Override output
};

function FlowInner({ initialEdges }) {
  const { roadmapData } = useRoadmapStore();
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync and Layout logic
  useEffect(() => {
    if (roadmapData?.nodes) {
      console.log("DEBUG: Rendering Nodes", roadmapData.nodes.length);
      const edgesList = initialEdges || roadmapData.edges || [];
      const nodesFromStore = roadmapData.nodes;

      const sortedNodes = [...nodesFromStore].sort((a, b) => a.position.x - b.position.x);
      const adjustedPositions = {};

      const correctedNodes = sortedNodes.map(node => {
        // Ensure every node is treated as 'custom' or our type
        const clonedNode = {
          ...node,
          type: 'custom',
          data: {
            ...node.data,
            id: node.id,
            label: node.data?.label || node.label,
            description: node.data?.description || node.description,
            subtopics: node.data?.subtopics || node.subtopics || []
          },
          position: { ...node.position },
          width: 320,
          height: 220,
          style: { width: 320, height: 220 }
        };

        // Horizontal Layout enforcement
        const incomingEdges = edgesList.filter(e => e.target === node.id);
        if (incomingEdges.length > 0) {
          const primarySourceId = incomingEdges[0].source;
          const sourcePos = adjustedPositions[primarySourceId] || nodesFromStore.find(n => n.id === primarySourceId)?.position;

          if (sourcePos) {
            const siblingEdges = edgesList.filter(e => e.source === primarySourceId);
            const siblingIndex = siblingEdges.findIndex(e => e.target === node.id);

            if (siblingEdges.length > 1) {
              clonedNode.position.y = sourcePos.y + (siblingIndex - (siblingEdges.length - 1) / 2) * 300;
            } else {
              clonedNode.position.y = sourcePos.y;
            }

            if (clonedNode.position.x < sourcePos.x + 450) {
              clonedNode.position.x = sourcePos.x + 450;
            }
          }
        }

        adjustedPositions[node.id] = clonedNode.position;
        return clonedNode;
      });

      setNodes(correctedNodes);
      setEdges(edgesList);

      // Auto fit view
      setTimeout(() => fitView({ padding: 0.3 }), 200);
    }
  }, [roadmapData, initialEdges, setNodes, setEdges, fitView]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    setIsDrawerOpen(true);
  }, []);

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
        minZoom={0.1}
        maxZoom={1.5}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 3, opacity: 0.8 }
        }}
      >
        <Background color="rgba(99, 102, 241, 0.1)" gap={20} size={1} />
        <Controls className="bg-slate-800 border-slate-700 fill-white" showInteractive={false} />
        <MiniMap
          nodeColor={(n) => {
            if (n.data?.status === 'done') return '#10b981'; // Emerald
            if (n.data?.status === 'skip') return '#334155'; // Slate
            return '#6366f1'; // Indigo
          }}
          nodeStrokeWidth={3}
          nodeClassName="!rounded-md"
          maskColor="rgba(10, 10, 35, 0.85)"
          className="!bg-slate-900/90 !border !border-white/10 !rounded-2xl !shadow-2xl !backdrop-blur-xl"
        />
      </ReactFlow>

      <TopicDrawer node={selectedNode} isOpen={isDrawerOpen} onClose={() => { setIsDrawerOpen(false); setSelectedNodeId(null); }} />

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-[10px] text-slate-300 shadow-xl hidden sm:block">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="font-bold uppercase tracking-widest">In Progress</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="font-bold uppercase tracking-widest text-emerald-400">Completed</span>
        </div>
      </div>
    </div>
  );
}

export default function RoadmapCanvas(props) {
  return (
    <ReactFlowProvider>
      <FlowInner {...props} />
    </ReactFlowProvider>
  );
}
