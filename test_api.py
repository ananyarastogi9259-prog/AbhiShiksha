import urllib.request
import json

try:
    with urllib.request.urlopen("http://127.0.0.1:8000/api/curriculum/class/1") as response:
        data = json.loads(response.read().decode())
        print(f"Status: {response.status}")
        print(f"Length: {len(data)}")
        if len(data) > 0:
            print(f"First item: {data[0]}")
except Exception as e:
    print(f"Error: {e}")
