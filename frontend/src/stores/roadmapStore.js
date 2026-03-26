import { create } from 'zustand';
import { MOCK_ROADMAP } from '@/lib/mock-roadmap';

export const useRoadmapStore = create((set, get) => ({
  roadmapData: null,
  progress: 0,
  
  // Initialize store with roadmap data
  initRoadmap: (data) => set({ roadmapData: { ...data }, progress: data.progress }),
  
  // Update a single node's status (pending, done, skip)
  updateNodeStatus: (nodeId, status) => set((state) => {
    if (!state.roadmapData) return state;
    
    // Create new array to trigger re-render
    const updatedNodes = state.roadmapData.nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: { ...node.data, status }
        };
      }
      return node;
    });

    // Calculate new overall progress
    const totalTopics = updatedNodes.length;
    const completedTopics = updatedNodes.filter(n => n.data.status === 'done' || n.data.status === 'skip').length;
    const newProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    
    return {
      roadmapData: { ...state.roadmapData, nodes: updatedNodes },
      progress: newProgress
    };
  }),

  // Reset roadmap
  clearRoadmap: () => set({ roadmapData: null, progress: 0 })
}));
