import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from api.schemas import GeneratedRoadmapData

def generate_roadmap_with_ai(topic: str) -> dict:
    """
    Calls OpenAI to generate a learning roadmap formatted for React Flow.
    """
    # Requires OPENAI_API_KEY in .env
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key == "sk-placeholder":
        raise ValueError("Missing or invalid OPENAI_API_KEY")

    # Initialize the LLM
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.2, # Low temp for structured adherence
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
