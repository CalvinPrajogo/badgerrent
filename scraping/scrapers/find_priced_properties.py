#!/usr/bin/env python3

# Script to find properties with actual pricing
import sys
import os
import re
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://tallardapartments.com"
PORTFOLIO_URL = "https://tallardapartments.com/property-portfolio/"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}

def clean_text(text):
    return " ".join(text.split())

print("Looking for properties with pricing...")

try:
    response = requests.get(PORTFOLIO_URL, headers=HEADERS)
    soup = BeautifulSoup(response.content, "html.parser")
    
    property_links = soup.find_all('h3')
    properties_with_prices = []
    
    for link_tag in property_links:
        a_tag = link_tag.find('a')
        if a_tag and a_tag.get('href'):
            property_name = clean_text(a_tag.text)
            if not any(char.isdigit() for char in property_name):
                continue
            
            property_url = BASE_URL + a_tag.get('href')
            
            # Find the price and status info
            price_element = link_tag.find_next_sibling()
            if price_element:
                price_text = clean_text(price_element.text)
                if "$" in price_text:
                    properties_with_prices.append({
                        'name': property_name,
                        'url': property_url,
                        'price_text': price_text
                    })
    
    print(f"Found {len(properties_with_prices)} properties with pricing:")
    for i, prop in enumerate(properties_with_prices[:10]):  # Show first 10
        print(f"{i+1}. {prop['name']} - {prop['price_text']}")
    
    if properties_with_prices:
        print(f"\nFirst property with pricing: {properties_with_prices[0]['url']}")
        
except Exception as e:
    print(f"Error: {e}")