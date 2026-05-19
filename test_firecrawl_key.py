from firecrawl import FirecrawlApp

api_key = "fc-082565e258084ebc85bfcce4f0c38225"

try:
    app = FirecrawlApp(api_key=api_key)
    # Test with a simple search
    result = app.search("python tutorial", limit=1, timeout=10)
    print("✓ API key is valid!")
    print(f"Search result: {result}")
except Exception as e:
    print(f"✗ API key is invalid or error occurred: {e}")
