import os
from openai import OpenAI
from api.schemas import GeneratedRoadmapData
from ai.firecrawl_client import search_latest_resources

def generate_roadmap_stream(topic: str):
    """
    Streams the LLM generation tokens for real-time visualization using NVIDIA API.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    model_name = os.getenv("AI_MODEL_NAME", "meta/llama-3.3-70b-instruct")
    
    client = OpenAI(
        base_url=base_url,
        api_key=api_key
    )
    
    prompt = f"""Generate a learning roadmap JSON for: "{topic}".
Output ONLY valid JSON:
{{"title":"...","nodes":[{{"id":"n1","label":"...","description":"...","type":"custom","subtopics":["...","...","..."],"position":{{"x":0,"y":200}},"data":{{"label":"...","description":"...","type":"theory","status":"pending","subtopics":["..."],"resources":{{"youtube":[{{"url":"https://youtube.com/...","title":"Video Title Here","channel":"Channel Name"}}],"articles":[{{"url":"https://...","title":"Article Title Here"}}]}}}}}}],"edges":[{{"id":"e1","source":"n1","target":"n2"}}]}}
Rules: 5-7 nodes, horizontal layout x spacing 450, y:200 for linear flow."""
    
    kwargs = {
        "model": model_name,
        "messages": [{"role": "user", "content": prompt}],
        "timeout": 180,
        "temperature": 0.7,
        "top_p": 0.95,
        "max_tokens": 3000,
        "stream": True
    }
    if any(r in model_name.lower() for r in ["deepseek", "kimi", "r1"]):
        kwargs["extra_body"] = {"chat_template_kwargs": {"thinking": True, "reasoning_effort": "low"}}
        
    completion = client.chat.completions.create(**kwargs)
    
    for chunk in completion:
        if not getattr(chunk, "choices", None):
            continue
        reasoning = getattr(chunk.choices[0].delta, "reasoning", None) or getattr(chunk.choices[0].delta, "reasoning_content", None)
        if reasoning:
            yield f"<reasoning>{reasoning}</reasoning>"
        if chunk.choices and chunk.choices[0].delta.content is not None:
            yield chunk.choices[0].delta.content

def generate_roadmap_with_ai(topic: str) -> dict:
    """
    Calls AI to generate a learning roadmap with latest resources from Firecrawl.
    """
    # Step 1: Fetch latest resources using Firecrawl (with timeout and fallback)
    print(f"[Firecrawl] Searching latest resources for: {topic}")
    # Skip Firecrawl for faster generation (comment out to enable)
    # latest_resources = search_latest_resources(topic, limit=2, timeout=5)
    latest_resources = {"timed_out": True}
    
    # Check if Firecrawl timed out or failed
    if latest_resources.get("timed_out") or latest_resources.get("error"):
        print(f"[Firecrawl] Search failed or timed out, using AI without external resources")
        resource_context = "\n(Note: Unable to fetch latest resources due to timeout. Generate roadmap with general best practices.)"
    else:
        # Build resource context for AI
        resource_context = ""
        if latest_resources.get("articles"):
            resource_context += "\n\nLatest Articles Found:\n"
            for article in latest_resources["articles"][:3]:
                resource_context += f"- {article['title']}: {article['url']}\n"
        
        if latest_resources.get("videos"):
            resource_context += "\nLatest Videos Found:\n"
            for video in latest_resources["videos"][:2]:
                resource_context += f"- {video['title']}: {video['url']}\n"
        
        if latest_resources.get("documentation"):
            resource_context += "\nOfficial Documentation Found:\n"
            for doc in latest_resources["documentation"][:2]:
                resource_context += f"- {doc['title']}: {doc['url']}\n"
    
    # Step 2: Generate roadmap with AI using latest resources
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    model_name = os.getenv("AI_MODEL_NAME", "meta/llama-3.3-70b-instruct")
    
    client = OpenAI(
        base_url=base_url,
        api_key=api_key
    )
    
    prompt = f"""Generate a comprehensive learning roadmap for: "{topic}".
 
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
Make it practical with REAL resource URLs from the search results provided.
 
Output ONLY valid JSON matching this schema:
{{"title":"...","nodes":[{{"id":"n1","label":"...","description":"...","type":"custom","subtopics":["...","...","..."],"position":{{"x":0,"y":200}},"data":{{"label":"...","description":"...","type":"theory","status":"pending","subtopics":["..."],"resources":{{"youtube":[{{"url":"https://youtube.com/...","title":"Video Title Here","channel":"Channel Name"}}],"articles":[{{"url":"https://...","title":"Article Title Here"}}]}}}}}}],"edges":[{{"id":"e1","source":"n1","target":"n2"}}]}}"""
    
    # Use streaming for faster feedback
    print(f"[AI] Generating roadmap with streaming...")
    
    kwargs = {
        "model": model_name,
        "messages": [{"role": "user", "content": prompt}],
        "timeout": 180,
        "temperature": 0.7,
        "top_p": 0.95,
        "max_tokens": 3000,
        "stream": True
    }
    if any(r in model_name.lower() for r in ["deepseek", "kimi", "r1"]):
        kwargs["extra_body"] = {"chat_template_kwargs": {"thinking": True, "reasoning_effort": "low"}}
        
    completion = client.chat.completions.create(**kwargs)
    
    # Collect streaming tokens to prevent HTTP read timeouts under heavy loads
    full_response = []
    for chunk in completion:
        if not getattr(chunk, "choices", None):
            continue
        content = chunk.choices[0].delta.content
        if content is not None:
            full_response.append(content)
            
    result = "".join(full_response)
    
    # Robust JSON extraction
    cleaned_result = result.strip()
    if cleaned_result.startswith("```"):
        lines = cleaned_result.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        cleaned_result = "\n".join(lines).strip()
        
    import json
    data = json.loads(cleaned_result)
    
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
