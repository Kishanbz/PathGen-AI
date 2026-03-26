export const MOCK_ROADMAP = {
  id: "react-js",
  title: "React.js Developer",
  topic: "React.js",
  progress: 15, // percentage
  nodes: [
    {
      id: "node_1",
      type: "roadmapNode",
      position: { x: 300, y: 50 },
      data: {
        label: "Internet",
        status: "done",
        type: "milestone", // milestone | topic
        description: "The Internet is a global network of computers connected to each other which communicate through a standardized set of protocols.",
        resources: {
          youtube: [
            { title: "How does the Internet Work?", url: "https://youtube.com/watch?v=1", channel: "Code.org" },
            { title: "What is the Internet?", url: "https://youtube.com/watch?v=2", channel: "CrashCourse" }
          ],
          articles: [
            { title: "How the Web Works", url: "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work" }
          ]
        }
      }
    },
    {
      id: "node_2",
      type: "roadmapNode",
      position: { x: 300, y: 150 },
      data: {
        label: "HTML",
        status: "pending",
        type: "milestone",
        description: "HTML stands for HyperText Markup Language. It is used on the frontend and gives the structure to the webpage which you can style using CSS.",
        resources: {
          youtube: [
            { title: "HTML Crash Course", url: "https://youtube.com/watch", channel: "Traversy Media" }
          ],
          articles: []
        }
      }
    },
    {
      id: "node_3",
      type: "roadmapNode",
      position: { x: 600, y: 150 },
      data: {
        label: "Domain Name",
        status: "skip",
        type: "topic",
        description: "A domain name is a human-readable address for a website, like 'google.com', which translates to an IP address.",
        resources: {}
      }
    },
    {
      id: "node_4",
      type: "roadmapNode",
      position: { x: 300, y: 250 },
      data: {
        label: "CSS",
        status: "pending",
        type: "milestone",
        description: "CSS is the language we use to style an HTML document.",
        resources: {}
      }
    },
    {
      id: "node_5",
      type: "roadmapNode",
      position: { x: 300, y: 350 },
      data: {
        label: "JavaScript",
        status: "pending",
        type: "milestone",
        description: "JavaScript is the programming language of the Web.",
        resources: {}
      }
    }
  ],
  edges: [
    { id: "e1-2", source: "node_1", target: "node_2", type: "smoothstep", animated: false, style: { stroke: "#3b82f6", strokeWidth: 3 } },
    { id: "e2-4", source: "node_2", target: "node_4", type: "smoothstep", animated: false, style: { stroke: "#3b82f6", strokeWidth: 3 } },
    { id: "e4-5", source: "node_4", target: "node_5", type: "smoothstep", animated: false, style: { stroke: "#3b82f6", strokeWidth: 3 } },
    // Dotted branch
    { id: "e2-3", source: "node_1", target: "node_3", type: "smoothstep", animated: true, style: { stroke: "rgba(59, 130, 246, 0.5)", strokeWidth: 2, strokeDasharray: "5,5" } }
  ]
};
