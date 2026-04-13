import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from api.schemas import GeneratedRoadmapData
from ai.firecrawl_client import search_latest_resources

def generate_roadmap_stream(topic: str):
    """
    Streams the LLM generation tokens for real-time visualization.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    model_name = os.getenv("AI_MODEL_NAME", "nvidia/nemotron-3-super-120b-a12b")
    
    llm = ChatOpenAI(
        model=model_name,
        base_url=base_url,
        temperature=0.7,
        api_key=api_key,
        streaming=True,
        timeout=None,
        max_retries=3,
    )

    prompt = PromptTemplate.from_template(
        """Generate a learning roadmap JSON for: "{topic}".
Output ONLY valid JSON:
{{"title":"...","nodes":[{{"id":"n1","label":"...","description":"...","type":"custom","subtopics":["...","...","..."],"position":{{"x":0,"y":200}},"data":{{"label":"...","description":"...","type":"theory","status":"pending","subtopics":["..."],"resources":{{"youtube":[],"articles":[]}}}}}}],"edges":[{{"id":"e1","source":"n1","target":"n2"}}]}}
Rules: 5-7 nodes, horizontal layout x spacing 450, y:200 for linear flow."""
    )
    
    chain = prompt | llm
    
    for chunk in chain.stream({"topic": topic}):
        if chunk.content:
            yield chunk.content

def generate_roadmap_with_ai(topic: str) -> dict:
    """
    Calls AI to generate a learning roadmap with latest resources from Firecrawl.
    """
    # Step 1: Fetch latest resources using Firecrawl
    print(f"[Firecrawl] Searching latest resources for: {topic}")
    latest_resources = search_latest_resources(topic, limit=15)
    
    # Build resource context for AI
    resource_context = ""
    if latest_resources.get("articles"):
        resource_context += "\n\nLatest Articles Found:\n"
        for article in latest_resources["articles"][:5]:
            resource_context += f"- {article['title']}: {article['url']}\n"
    
    if latest_resources.get("videos"):
        resource_context += "\nLatest Videos Found:\n"
        for video in latest_resources["videos"][:3]:
            resource_context += f"- {video['title']}: {video['url']}\n"
    
    if latest_resources.get("documentation"):
        resource_context += "\nOfficial Documentation Found:\n"
        for doc in latest_resources["documentation"][:3]:
            resource_context += f"- {doc['title']}: {doc['url']}\n"
    
    # Step 2: Generate roadmap with AI using latest resources
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    model_name = os.getenv("AI_MODEL_NAME", "nvidia/nemotron-3-super-120b-a12b")
    
    llm = ChatOpenAI(
        model=model_name,
        base_url=base_url,
        temperature=0.6,
        api_key=api_key,
        timeout=None,
        max_retries=3,
    )

    structured_llm = llm.with_structured_output(GeneratedRoadmapData)

    prompt = PromptTemplate.from_template(
        """Generate a comprehensive learning roadmap for: "{topic}".

Use the following LATEST resources found from web search to make the roadmap current and practical:
{resource_context}

Create 5-7 nodes. Each node needs:
- id: unique identifier
- label: clear title
- description: 1-2 sentences explaining what to learn
- type: "custom"
- 3 subtopics as array
- position: horizontal layout (x+450, y:200)
- data with resources: include relevant URLs from the search results above

Also create edges connecting nodes sequentially (n1->n2, n2->n3, etc.).
Make it practical with REAL resource URLs from the search results provided."""
    )
    
    chain = prompt | structured_llm
    result = chain.invoke({"topic": topic, "resource_context": resource_context})
    data = result.model_dump()
    
    # Auto-generate edges if missing
    nodes = data.get("nodes", [])
    edges = data.get("edges", [])
    
    if not edges and len(nodes) > 1:
        edges = []
        for i in range(len(nodes) - 1):
            edges.append({
                "id": f"e{i+1}",
                "source": nodes[i]["id"],
                "target": nodes[i + 1]["id"]
            })
        data["edges"] = edges
    
    print(f"[Firecrawl] Roadmap generated with {len(nodes)} nodes using latest resources")
    return data
