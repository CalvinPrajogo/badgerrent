#!/usr/bin/env python3

# Quick test script to check if our scraper logic works
import sys
import os

try:
    import requests
    from bs4 import BeautifulSoup
    print("✓ Required modules available")
except ImportError as e:
    print(f"✗ Missing module: {e}")
    print("Please install requirements with: pip3 install -r ../requirements.txt")
    sys.exit(1)

# Test the basic functionality
BASE_URL = "https://tallardapartments.com"
PORTFOLIO_URL = "https://tallardapartments.com/property-portfolio/"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}

print("Testing connection to Tallard Apartments...")

try:
    response = requests.get(PORTFOLIO_URL, headers=HEADERS)
    print(f"✓ Successfully connected (Status: {response.status_code})")
    
    soup = BeautifulSoup(response.content, "html.parser")
    
    # Find property links
    property_links = soup.find_all('h3')
    property_count = 0
    
    for link_tag in property_links:
        a_tag = link_tag.find('a')
        if a_tag and a_tag.get('href'):
            property_name = a_tag.text.strip()
            # Skip if this doesn't look like a property
            if any(char.isdigit() for char in property_name):
                property_count += 1
                if property_count <= 3:  # Show first 3 as examples
                    print(f"  Found property: {property_name}")
    
    print(f"✓ Found {property_count} total properties")
    
    if property_count > 0:
        print("✓ Basic scraper logic working correctly!")
    else:
        print("✗ No properties found - may need to adjust scraping logic")
        
except Exception as e:
    print(f"✗ Error: {e}")