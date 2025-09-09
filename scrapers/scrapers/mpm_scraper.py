import requests
from bs4 import BeautifulSoup
import json

BASE_URL = "https://www.madisonproperty.com/Campus"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}

response = requests.get(BASE_URL, headers=HEADERS)
print(f"Status code: {response.status_code}")

soup = BeautifulSoup(response.content, "html.parser")

# Get table that has listings
table = soup.find("table")
print(f"Found table: {table is not None}")

if table:
    rows = table.find_all("tr")
    print(f"Number of rows: {len(rows)}")
    
    for i, row in enumerate(rows[:3]):
        cells = row.find_all(["td", "th"])
        print(f"Row {i}: {[cell.text.strip() for cell in cells]}")