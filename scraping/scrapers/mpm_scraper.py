import requests
from bs4 import BeautifulSoup
import json
import re
import time

BASE_URL = "https://www.madisonproperty.com/Campus"
DETAIL_BASE_URL = "https://www.madisonproperty.com"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}

def clean_text(text):
    # Remove extra whitespace
    return " ".join(text.split())

def extract_rent(rent_text):
    # Get the dollar amount from rent string
    match = re.search(r'\$(\d+)', rent_text)
    return int(match.group(1)) if match else None

def get_property_image(detail_url):
    """
    Fetch the property detail page and extract the first image URL
    """
    try:
        # Be polite - add a small delay between requests
        time.sleep(0.5)
        
        response = requests.get(detail_url, headers=HEADERS)
        if response.status_code != 200:
            print(f"Failed to fetch {detail_url}")
            return None
            
        soup = BeautifulSoup(response.content, "html.parser")
        
        # Look for property images - common patterns:
        # 1. Look for img tags in a gallery/carousel
        # 2. Look for images with specific classes
        # 3. Try to find the main property image
        
        # Try finding images in common containers
        image = soup.find("img", class_=re.compile(r"property|gallery|main|photo", re.I))
        if image and image.get("src"):
            img_url = image["src"]
            # Make sure it's a full URL
            if img_url.startswith("http"):
                return img_url
            else:
                return DETAIL_BASE_URL + img_url
        
        # Fallback: look for any img in property-related divs
        property_div = soup.find("div", class_=re.compile(r"property|detail|photo", re.I))
        if property_div:
            image = property_div.find("img")
            if image and image.get("src"):
                img_url = image["src"]
                if img_url.startswith("http"):
                    return img_url
                else:
                    return DETAIL_BASE_URL + img_url
        
        return None
    except Exception as e:
        print(f"Error fetching image from {detail_url}: {e}")
        return None

response = requests.get(BASE_URL, headers=HEADERS)
soup = BeautifulSoup(response.content, "html.parser")

# Get table that has listings
table = soup.find("table")

properties = []

if table:
    rows = table.find_all("tr")[1:] # Skip the header row
    
    # TESTING: Limit to first 5 properties to test image scraping
    # Remove this limit once we confirm it works
    max_properties = 5
    count = 0
    
    for row in rows:
        if count >= max_properties:
            break
            
        cells = row.find_all(["td", "th"])
        if len(cells) >= 16: # Make sure we have all columns
            # Try to find the detail page link (usually in the address cell)
            detail_link = None
            address_cell = cells[1]
            link = address_cell.find("a")
            if link and link.get("href"):
                detail_link = DETAIL_BASE_URL + link["href"] if not link["href"].startswith("http") else link["href"]
            
            # Get image URL from detail page if available
            image_url = None
            if detail_link:
                print(f"Fetching image for: {clean_text(cells[1].text)}")
                image_url = get_property_image(detail_link)
            
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
                "company": "Madison Property Management",
                "image_url": image_url
            }
            properties.append(property_data)
            count += 1

# Save to JSON file
with open("../data/raw/mpm_properties.json", "w") as f:
    json.dump(properties, f, indent=2)
    
print(f"Scraped {len(properties)} properties from MPM")
if properties:
    print("Sample property:", json.dumps(properties[0], indent=2))