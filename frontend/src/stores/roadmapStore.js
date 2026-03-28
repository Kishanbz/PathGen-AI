import { create } from 'zustand';
import { MOCK_ROADMAP } from '@/lib/mock-roadmap';

export const useRoadmapStore = create((set, get) => ({
  roadmapData: null,
  progress: 0,
  
  // Initialize store with roadmap data
  initRoadmap: (data) => {
    const totalNodes = data.nodes?.length || 0;
    const completedNodes = data.nodes?.filter(n => n.data.status === 'done' || n.data.status === 'skip').length || 0;
    const initialProgress = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;
    
    set({ 
      roadmapData: { ...data }, 
      progress: data.progress !== undefined ? data.progress : initialProgress 
    });
  },
  
  // Update a single node's status (pending, done, skip)
  updateNodeStatus: async (nodeId, status, getToken = null) => {
    const state = get();
    if (!state.roadmapData) return;

    // 1. Optimistically update local state
    const updatedNodes = state.roadmapData.nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: { ...node.data, status }
        };
      }
      return node;
    });

    const totalTopics = updatedNodes.length;
    const completedTopics = updatedNodes.filter(n => n.data.status === 'done' || n.data.status === 'skip').length;
    const newProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    
    set({
      roadmapData: { ...state.roadmapData, nodes: updatedNodes },
      progress: newProgress
    });

    // 2. Persist to backend if authenticated
    if (getToken) {
      try {
        const token = await getToken();
        if (token) {
          await import('@/lib/api').then(m => m.default.post('/progress/update', {
            roadmap_id: state.roadmapData.id,
            node_id: nodeId,
            status: status
          }, {
            headers: { Authorization: `Bearer ${token}` }
          }));
        }
      } catch (error) {
        console.error('Failed to persist progress:', error);
      }
    }
  },

  // Reset roadmap
  clearRoadmap: () => set({ roadmapData: null, progress: 0 })
}));
