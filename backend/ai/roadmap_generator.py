import os
import json
from urllib.parse import quote_plus
from openai import OpenAI


def _make_search_resources(topic: str, node_label: str) -> dict:
    """
    Build guaranteed-working search URLs for a node.
    Instead of AI hallucinating specific video/article URLs (which are often broken),
    we generate YouTube search and Google search links that ALWAYS work.
    """
    query = f"{topic} {node_label}"
    encoded = quote_plus(query)
    encoded_yt = quote_plus(f"{topic} {node_label} tutorial")

    return {
        "youtube": [
            {
                "url": f"https://www.youtube.com/results?search_query={encoded_yt}",
                "title": f"Search: {node_label} Tutorial on YouTube",
                "channel": "YouTube Search"
            }
        ],
        "articles": [
            {
                "url": f"https://www.google.com/search?q={encoded}+tutorial+guide",
                "title": f"Search: {node_label} Guides & Articles"
            },
            {
                "url": f"https://www.reddit.com/search/?q={encoded}",
                "title": f"Reddit: {node_label} Discussion & Tips"
            }
        ]
    }


def generate_roadmap_stream(topic: str):
    """
    Streams the LLM generation tokens for real-time visualization using NVIDIA API.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    model_name = os.getenv("AI_MODEL_NAME", "meta/llama-3.3-70b-instruct")

    client = OpenAI(base_url=base_url, api_key=api_key)

    prompt = f"""Generate a learning roadmap JSON for: "{topic}".
Output ONLY valid JSON with NO extra text:
{{"title":"...","nodes":[{{"id":"n1","label":"...","description":"...","type":"custom","subtopics":["...","...","..."],"position":{{"x":0,"y":200}},"data":{{"label":"...","description":"...","type":"theory","status":"pending","subtopics":["...","...","..."]}}}}],"edges":[{{"id":"e1","source":"n1","target":"n2"}}]}}
Rules: 5-7 nodes, horizontal layout x spacing 450, y:200 for all nodes. NO resources field needed."""

    kwargs = {
        "model": model_name,
        "messages": [{"role": "user", "content": prompt}],
        "timeout": 180,
        "temperature": 0.7,
        "top_p": 0.95,
        "max_tokens": 2000,
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
    Calls AI to generate roadmap structure only (labels, descriptions, subtopics).
    Resources (YouTube, articles) are injected as guaranteed-working search URLs —
    never hallucinated by the AI, so they always work.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    model_name = os.getenv("AI_MODEL_NAME", "meta/llama-3.3-70b-instruct")

    client = OpenAI(base_url=base_url, api_key=api_key)

    # AI only generates the structure — no resources needed (less tokens = faster + accurate)
    prompt = f"""Generate a comprehensive learning roadmap for: "{topic}".

Create 5-7 learning nodes in logical progression order.
Each node must cover a distinct stage of learning.

Output ONLY valid JSON, no markdown, no explanation:
{{"title":"Full Roadmap Title","nodes":[{{"id":"n1","label":"Node Title","description":"1-2 sentence description of what to learn in this stage.","type":"custom","subtopics":["subtopic 1","subtopic 2","subtopic 3"],"position":{{"x":0,"y":200}},"data":{{"label":"Node Title","description":"1-2 sentence description.","type":"theory","status":"pending","subtopics":["subtopic 1","subtopic 2","subtopic 3"]}}}}],"edges":[{{"id":"e1","source":"n1","target":"n2"}}]}}

Rules:
- 5-7 nodes total
- x positions: 0, 450, 900, 1350, 1800, 2250, 2700 (spacing of 450)
- y: 200 for all nodes
- edges connect nodes sequentially
- Do NOT include any resources field — it will be added automatically
- Output raw JSON only"""

    print(f"[AI] Generating roadmap structure for: {topic}")

    kwargs = {
        "model": model_name,
        "messages": [{"role": "user", "content": prompt}],
        "timeout": 180,
        "temperature": 0.7,
        "top_p": 0.95,
        "max_tokens": 2000,
        "stream": True
    }
    if any(r in model_name.lower() for r in ["deepseek", "kimi", "r1"]):
        kwargs["extra_body"] = {"chat_template_kwargs": {"thinking": True, "reasoning_effort": "low"}}

    completion = client.chat.completions.create(**kwargs)

    full_response = []
    for chunk in completion:
        if not getattr(chunk, "choices", None):
            continue
        content = chunk.choices[0].delta.content
        if content is not None:
            full_response.append(content)

    result = "".join(full_response)

    # Robust JSON extraction (strip markdown fences if present)
    cleaned_result = result.strip()
    if cleaned_result.startswith("```"):
        lines = cleaned_result.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        cleaned_result = "\n".join(lines).strip()

    data = json.loads(cleaned_result)

    nodes = data.get("nodes", [])
    edges = data.get("edges", [])

    # Inject guaranteed-working search resources into every node
    for node in nodes:
        node_label = node.get("label", node.get("data", {}).get("label", topic))
        search_resources = _make_search_resources(topic, node_label)

        # Inject into top-level node
        node["resources"] = search_resources

        # Inject into nested data object
        if "data" not in node:
            node["data"] = {}
        node["data"]["resources"] = search_resources

    # Auto-generate edges if missing
    if not edges and len(nodes) > 1:
        edges = []
        for i in range(len(nodes) - 1):
            edges.append({
                "id": f"e{i+1}",
                "source": nodes[i]["id"],
                "target": nodes[i + 1]["id"]
            })
        data["edges"] = edges

    print(f"[AI] Roadmap generated: {len(nodes)} nodes with search-based resources")
    return data
