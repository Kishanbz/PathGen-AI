import os
import sys
from dotenv import load_dotenv

# Add the backend directory to sys.path to import our modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from ai.roadmap_generator import generate_roadmap_with_ai

def test_generation():
    # Load environment variables from the backend/.env file
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env'))
    load_dotenv(env_path)
    
    print(f"Using Model: {os.getenv('AI_MODEL_NAME')}")
    print(f"Using Base URL: {os.getenv('NVIDIA_BASE_URL')}")
    
    topic = "React Hooks"
    print(f"\nGenerating roadmap for: {topic}...")
    
    try:
        result = generate_roadmap_with_ai(topic)
        print("\nSuccess! Generated Data Structure:")
        print(f"Nodes count: {len(result.get('nodes', []))}")
        print(f"Edges count: {len(result.get('edges', []))}")
        
        if result.get('nodes'):
            print("\nFirst Node Preview:")
            print(result['nodes'][0])
            
    except Exception as e:
        print(f"\nError during generation: {e}")

if __name__ == "__main__":
    test_generation()
