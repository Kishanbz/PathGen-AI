import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

def ask_ai_tutor(topic: str, question: str, history=None) -> str:
    """
    Calls the LLM to provide architectural or conceptual help on a specific topic.
    Supports chat history for context-aware conversations.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    model_name = os.getenv("AI_MODEL_NAME", "moonshotai/kimi-k2-instruct-0905")
    
    if not api_key:
        return "AI Tutor is currently unavailable (Missing API Key)."

    llm = ChatOpenAI(
        model=model_name,
        base_url=base_url,
        temperature=0.7,
        api_key=api_key,
        timeout=None,
        max_retries=3,
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", f"You are an expert technical tutor. You are helping a student learn about: '{{topic}}'. Keep your answers concise, practical, and encouraging. Use markdown formatting for code or lists."),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{question}")
    ])

    # Format history for LangChain
    formatted_history = []
    if history:
        for msg in history:
            if msg["role"] == "user":
                formatted_history.append(HumanMessage(content=msg["content"]))
            else:
                formatted_history.append(AIMessage(content=msg["content"]))

    chain = prompt | llm
    
    try:
        response = chain.invoke({
            "topic": topic,
            "question": question,
            "chat_history": formatted_history
        })
        return response.content
    except Exception as e:
        print(f"Tutor Error: {e}")
        return "Sorry, I'm having trouble processing your request right now. Please try again later."
