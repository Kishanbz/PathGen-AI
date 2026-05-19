import os
from firecrawl import FirecrawlApp

def get_firecrawl_app():
    """Get Firecrawl app instance with API key."""
    api_key = os.getenv("FIRECRAWL_API_KEY")
    if not api_key:
        raise ValueError("FIRECRAWL_API_KEY environment variable not set")
    return FirecrawlApp(api_key=api_key)

def search_latest_resources(topic: str, limit: int = 4, timeout: int = 15) -> dict:
    """
    Search for latest resources on a topic using Firecrawl.
    Returns articles, videos, and documentation URLs.
    
    Args:
        topic: The topic to search for
        limit: Maximum number of results to fetch (reduced for speed)
        timeout: Timeout in seconds for the search
    """
    try:
        app = get_firecrawl_app()
        
        # Search query for the topic
        search_query = f"{topic} tutorial guide documentation best practices 2024 2025"
        
        # Use Firecrawl to search only, skip heavy scraping with timeout
        result = app.search(search_query, limit=limit, timeout=timeout)
        
        resources = {
            "articles": [],
            "videos": [],
            "documentation": [],
            "summary": ""
        }
        
        items = []
        if hasattr(result, "web") and result.web:
            items = [{"url": getattr(i, "url", ""), "title": getattr(i, "title", ""), "description": getattr(i, "description", "")} for i in result.web]
        elif isinstance(result, dict) and "data" in result:
            items = result["data"]
            
        for item in items:
            url = item.get("url", "")
            title = item.get("title", "")
            description = item.get("description", "")
            
            # Categorize by URL pattern
            if "youtube.com" in url or "youtu.be" in url:
                resources["videos"].append({
                    "title": title,
                    "url": url,
                    "description": description
                })
            elif "docs." in url or "documentation" in url.lower():
                resources["documentation"].append({
                    "title": title,
                    "url": url,
                    "description": description
                })
            else:
                resources["articles"].append({
                    "title": title,
                    "url": url,
                    "description": description
                })
        
        return resources
        
    except Exception as e:
        print(f"Firecrawl search error: {e}")
        return {"articles": [], "videos": [], "documentation": [], "summary": "", "error": str(e), "timed_out": True}

def enrich_roadmap_with_resources(roadmap_data: dict, topic: str) -> dict:
    """
    Enrich roadmap nodes with latest resources from Firecrawl.
    """
    resources = search_latest_resources(topic)
    
    nodes = roadmap_data.get("nodes", [])
    
    # Distribute resources across nodes
    all_resources = (
        resources.get("articles", []) + 
        resources.get("videos", []) + 
        resources.get("documentation", [])
    )
    
    if all_resources and nodes:
        # Simple distribution: assign resources round-robin to nodes
        for i, node in enumerate(nodes):
            if "data" not in node:
                node["data"] = {}
            
            # Get resources for this node (distribute evenly)
            node_resources = []
            for j in range(i, len(all_resources), len(nodes)):
                res = all_resources[j]
                node_resources.append({
                    "title": res["title"],
                    "url": res["url"],
                    "type": "article"
                })
            
            # Update resources in node data
            node["data"]["resources"] = {
                "youtube": [r for r in node_resources if "youtube" in r.get("url", "")],
                "articles": [r for r in node_resources if "youtube" not in r.get("url", "")]
            }
    
    roadmap_data["nodes"] = nodes
    return roadmap_data
