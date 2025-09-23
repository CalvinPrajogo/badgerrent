import requests
from bs4 import BeautifulSoup
import json
import re

BASE_URL = "https://www.madisonproperty.com/Campus"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}

def clean_text(text):
    # Remove extra whitespace
    return " ".join(text.split())

def extract_rent(rent_text):
    # Get the dollar amount from rent string
    match = re.search(r'\$(\d+)', rent_text)
    return int(match.group(1)) if match else None

response = requests.get(BASE_URL, headers=HEADERS)
soup = BeautifulSoup(response.content, "html.parser")

# Get table that has listings
table = soup.find("table")

properties = []

if table:
    rows = table.find_all("tr")[1:] # Skip the header row
    
    for row in rows:
        cells = row.find_all(["td", "th"])
        if len(cells) >= 16: # Make sure we have all columns
            property_data = {
                "address": clean_text(cells[1].text),
                "location": clean_text(cells[4].text), 
                "city": clean_text(cells[5].text),
                "type": clean_text(cells[6].text),
                "bedrooms": clean_text(cells[7].text),
                "bathrooms": clean_text(cells[9].text),
                "sqft": clean_text(cells[10].text),
                "pets": clean_text(cells[11].text),
                "lease_type": clean_text(cells[12].text),
                "available": clean_text(cells[13].text),
                "rent": extract_rent(cells[14].text),
                "parking": clean_text(cells[15].text),
                "company": "Madison Property Management"
            }
            properties.append(property_data)

# Save to JSON file
with open("../data/raw/mpm_properties.json", "w") as f:
    json.dump(properties, f, indent=2)
    
print(f"Scraped {len(properties)} properties from MPM")
if properties:
    print("Sample property:", json.dumps(properties[0], indent=2))