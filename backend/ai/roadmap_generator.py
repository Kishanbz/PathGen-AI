import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from api.schemas import GeneratedRoadmapData

def generate_roadmap_with_ai(topic: str) -> dict:
    """
    Calls OpenAI to generate a learning roadmap formatted for React Flow.
    """
    # Requires NVIDIA API credentials in .env
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    model_name = os.getenv("AI_MODEL_NAME", "moonshotai/kimi-k2-instruct-0905")
    
    if not api_key or api_key == "sk-placeholder":
        raise ValueError("Missing or invalid AI API Key")

    # Initialize the LLM (OpenAI-compatible)
    llm = ChatOpenAI(
        model=model_name,
        base_url=base_url,
        temperature=0.7, # Low temp for structured adherence
        api_key=api_key
    )

    # We use structured output to force the LLM to return exactly the `GeneratedRoadmapData` schema.
    structured_llm = llm.with_structured_output(GeneratedRoadmapData)

    prompt = PromptTemplate.from_template(
        """You are an expert technical educator and mentor. 
        A user wants to learn about: "{topic}".
        
        Generate a comprehensive, structured learning roadmap for this topic.
        The output must be a standard flowchart array of nodes and edges, compatible with React Flow.
        
        Guidelines:
        1. Break the topic down into 6-12 logical steps/milestones.
        2. Assign a unique ID to each node (e.g. 'n1', 'n2'). All node types must be 'custom'.
        3. Position the nodes logically. E.g., root node at x:250, y:0. Next node at x:250, y:150, etc. Branches can go left (x:100) or right (x:400).
        4. Provide a 2-3 sentence description for each node.
        5. For EACH node, provide at least 1 youtube link (with channel name) and 1 article link that are real, highly-rated educational resources.
        6. Connect the nodes logically using edges (source -> target).
        """
    )
    
    chain = prompt | structured_llm
    
    # Execute the chain
    result = chain.invoke({"topic": topic})
    
    # Return as dict for JSON response
    return result.model_dump()
