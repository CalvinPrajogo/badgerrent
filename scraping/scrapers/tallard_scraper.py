import requests
from bs4 import BeautifulSoup
import json
import re
import time
from urllib.parse import urljoin

BASE_URL = "https://tallardapartments.com"
PORTFOLIO_URL = "https://tallardapartments.com/property-portfolio/"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}

def clean_text(text):
    """Remove extra whitespace and clean text"""
    return " ".join(text.split())

def extract_price(price_text):
    """Extract price from text like '$1,555.00' or 'RENTED'"""
    if not price_text or price_text.strip() in ['RENTED', 'TBD', '8/15/26']:
        return None
    
    match = re.search(r'\$([0-9,]+(?:\.\d{2})?)', price_text)
    if match:
        return float(match.group(1).replace(',', ''))
    return None

def parse_iframe_data(details):
    """Parse and extract structured data from iframe content"""
    parsed_data = {}
    
    # Extract rent from iframe
    if 'iframe_rent' in details:
        parsed_data['rent_from_iframe'] = extract_price(details['iframe_rent'])
    
    if 'iframe_prices_found' in details and details['iframe_prices_found']:
        # Take the first price found, usually the rent
        try:
            parsed_data['rent_from_iframe'] = float(details['iframe_prices_found'][0].replace(',', ''))
        except (ValueError, IndexError):
            pass
    
    # Extract bedroom/bathroom info
    if 'iframe_bed_bath' in details:
        bed_bath_text = details['iframe_bed_bath'].lower()
        
        # Look for bedroom count
        bed_match = re.search(r'(\d+)\s*bed', bed_bath_text)
        if bed_match:
            parsed_data['bedrooms_from_iframe'] = int(bed_match.group(1))
        
        # Look for bathroom count
        bath_match = re.search(r'(\d+(?:\.\d+)?)\s*bath', bed_bath_text)
        if bath_match:
            parsed_data['bathrooms_from_iframe'] = float(bath_match.group(1))
    
    # Extract square footage
    if 'iframe_sqft' in details:
        sqft_match = re.search(r'(\d+(?:,\d+)?)\s*(?:sq\.?\s*ft|sqft)', details['iframe_sqft'], re.IGNORECASE)
        if sqft_match:
            parsed_data['square_feet_from_iframe'] = int(sqft_match.group(1).replace(',', ''))
    
    # Check for availability status from iframe content
    if 'iframe_content' in details:
        iframe_text = details['iframe_content'].lower()
        if 'rented' in iframe_text or 'unavailable' in iframe_text:
            parsed_data['availability_status'] = 'rented'
        elif 'available' in iframe_text or 'apply now' in iframe_text:
            parsed_data['availability_status'] = 'available'
        elif 'coming soon' in iframe_text:
            parsed_data['availability_status'] = 'coming_soon'
    
    return parsed_data

def extract_bedroom_count(property_name):
    """Extract bedroom count from property name like '(5 BR+)' or '(Studio)'"""
    if 'Studio' in property_name:
        return 0
    
    match = re.search(r'\((\d+)\s*BR', property_name, re.IGNORECASE)
    if match:
        return int(match.group(1))
    
    # Handle cases like '(14 BR+)'
    match = re.search(r'\((\d+)\s*BR', property_name, re.IGNORECASE)
    if match:
        return int(match.group(1))
    
    return None

def get_property_list():
    """Get list of all properties from the portfolio page"""
    print("Fetching property list...")
    
    try:
        response = requests.get(PORTFOLIO_URL, headers=HEADERS)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
        
        properties = []
        
        # Find all property links - they have h3 tags with links to property pages
        property_links = soup.find_all('h3')
        
        for link_tag in property_links:
            a_tag = link_tag.find('a')
            if a_tag and a_tag.get('href'):
                property_url = urljoin(BASE_URL, a_tag.get('href'))
                property_name = clean_text(a_tag.text)
                
                # Skip if this doesn't look like a property (e.g., navigation links)
                if not any(char.isdigit() for char in property_name):
                    continue
                
                # Find the price and status info (usually right after the h3)
                price_element = link_tag.find_next_sibling()
                price_text = ""
                status = "unknown"
                
                if price_element:
                    price_text = clean_text(price_element.text)
                    if "RENTED" in price_text:
                        status = "rented"
                    elif "$" in price_text:
                        if "8/15/26" in price_text:
                            status = "available_8_15_26"
                        else:
                            status = "available"
                    elif "TBD" in price_text:
                        status = "tbd"
                    elif "8/15/26" in price_text:
                        status = "available_8_15_26"
                
                property_data = {
                    "name": property_name,
                    "url": property_url,
                    "price_raw": price_text,
                    "price": extract_price(price_text),
                    "bedrooms": extract_bedroom_count(property_name),
                    "status": status
                }
                
                properties.append(property_data)
                
        print(f"Found {len(properties)} properties")
        return properties
        
    except Exception as e:
        print(f"Error fetching property list: {e}")
        return []

def get_property_details(property_url, property_name):
    """Get detailed information for a specific property"""
    try:
        print(f"Fetching details for: {property_name}")
        response = requests.get(property_url, headers=HEADERS)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
        
        details = {}
        
        # Extract address from the property name (usually the first part)
        address_match = re.match(r'^([^(]+)', property_name)
        details['address'] = clean_text(address_match.group(1)) if address_match else property_name
        
        # Look for iframe with AppFolio listing data
        print(f"  Looking for iframes on page...")
        all_iframes = soup.find_all('iframe')
        print(f"  Found {len(all_iframes)} iframe(s)")
        for i, frame in enumerate(all_iframes):
            print(f"  Iframe {i+1}: title='{frame.get('title', 'No title')}', src='{frame.get('src', 'No src')[:100]}...'")
        
        # Also look for AppFolio scripts that might create iframes
        appfolio_scripts = soup.find_all('script', string=re.compile('appfolio', re.IGNORECASE))
        print(f"  Found {len(appfolio_scripts)} AppFolio script(s)")
        
        # Extract information from AppFolio scripts
        for i, script in enumerate(appfolio_scripts):
            script_text = script.string or script.get_text()
            print(f"  AppFolio script {i+1}: {script_text[:200]}...")
            
            # Look for property group or hostUrl in the script
            if 'propertyGroup' in script_text:
                property_group_match = re.search(r"propertyGroup:\s*['\"]([^'\"]+)['\"]", script_text)
                if property_group_match:
                    property_group = property_group_match.group(1)
                    print(f"  Found propertyGroup: {property_group}")
                    
                    # Construct the iframe URL based on the pattern we saw
                    iframe_url = f"https://tallardapartments.appfolio.com/listings?filters%5Bproperty_list%5D={property_group}&theme_color=%23283a54&filters%5Border_by%5D=date_posted"
                    print(f"  Constructed iframe URL: {iframe_url}")
                    details['constructed_iframe_url'] = iframe_url
        
        # Look for any elements containing appfolio URLs
        appfolio_links = soup.find_all(src=re.compile('appfolio', re.IGNORECASE))
        print(f"  Found {len(appfolio_links)} elements with AppFolio URLs")
        for link in appfolio_links:
            print(f"  AppFolio element: {link.name}, src='{link.get('src', '')[:100]}...'")
        
        # Try multiple ways to find the iframe
        iframe = (soup.find('iframe', title=re.compile('Available Properties', re.IGNORECASE)) or
                 soup.find('iframe', src=re.compile('appfolio', re.IGNORECASE)) or
                 soup.find('iframe'))
        
        # Try to get iframe URL either from found iframe or constructed URL
        iframe_src = None
        if iframe:
            iframe_src = iframe.get('src')
        elif 'constructed_iframe_url' in details:
            iframe_src = details['constructed_iframe_url']
            print(f"  Using constructed iframe URL")
            
        if iframe_src:
                print(f"  Found AppFolio iframe: {iframe_src}")
                # Check if this is an AppFolio iframe
                if 'appfolio.com' in iframe_src:
                    try:
                        # Fetch iframe content with a longer timeout for AppFolio
                        iframe_response = requests.get(iframe_src, headers=HEADERS, timeout=10)
                        iframe_response.raise_for_status()
                        iframe_soup = BeautifulSoup(iframe_response.content, "html.parser")
                        
                        # Store the full iframe content for analysis
                        details['iframe_content'] = iframe_soup.get_text()
                        
                        # Look for listing details in the iframe - try multiple selectors
                        pricing_selectors = [
                            'div.js-listing-quick-facts',
                            '.js-listing-quick-facts', 
                            '.listing-unit-price',
                            '.unit-price',
                            '.price',
                            '.rent-price', 
                            '.listing-price',
                            '[class*="price"]',
                            '[data-price]'
                        ]
                        
                        price_found = False
                        for selector in pricing_selectors:
                            elements = iframe_soup.select(selector)
                            if elements:
                                print(f"  Found elements with selector: {selector}")
                                for element in elements:
                                    element_text = clean_text(element.get_text())
                                    print(f"  Element text: {element_text[:100]}...")
                                    
                                    # Look for price patterns
                                    price_match = re.search(r'\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', element_text)
                                    if price_match:
                                        details['iframe_rent'] = f"${price_match.group(1)}"
                                        price_found = True
                                        print(f"  Found price: {details['iframe_rent']}")
                                        break
                            if price_found:
                                break
                        
                        # Look for bedroom/bathroom info in multiple places
                        bed_bath_selectors = [
                            '.js-listing-quick-facts',
                            '.unit-details',
                            '.bed-bath',
                            '.beds-baths', 
                            '.bedroom-bathroom',
                            '.listing-details'
                        ]
                        
                        for selector in bed_bath_selectors:
                            elements = iframe_soup.select(selector)
                            for element in elements:
                                element_text = clean_text(element.get_text())
                                if re.search(r'\d+\s*(bed|bath|br|ba)', element_text, re.IGNORECASE):
                                    details['iframe_bed_bath'] = element_text
                                    print(f"  Found bed/bath info: {element_text[:50]}...")
                                    break
                        
                        # Look for square footage
                        sqft_text = iframe_soup.find(string=re.compile(r'\d+\s*(sq\.?\s*ft|sqft)', re.IGNORECASE))
                        if sqft_text:
                            details['iframe_sqft'] = clean_text(sqft_text)
                        
                        # Alternative: scan all text for pricing patterns
                        all_text = iframe_soup.get_text()
                        price_matches = re.findall(r'\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', all_text)
                        if price_matches and not price_found:
                            details['iframe_prices_found'] = [f"${price}" for price in price_matches]
                            print(f"  Found {len(price_matches)} price patterns in iframe text")
                        
                        # Check for "RENTED" or availability status
                        if 'rented' in all_text.lower():
                            details['iframe_status'] = 'rented'
                        elif any(word in all_text.lower() for word in ['available', 'apply now', 'lease']):
                            details['iframe_status'] = 'available'
                            
                    except Exception as iframe_error:
                        print(f"  Error fetching iframe content: {iframe_error}")
                        details['iframe_error'] = str(iframe_error)
                else:
                    print("  Iframe is not from AppFolio, skipping")
        
        # Extract features section from main page
        features = []
        features_section = soup.find('h2', string=re.compile('FEATURES', re.IGNORECASE))
        if features_section:
            # Look for bullet points or list items after the features header
            next_element = features_section.find_next_sibling()
            while next_element and next_element.name != 'h2':
                if next_element.name == 'p' or next_element.name == 'div':
                    text = clean_text(next_element.text)
                    if text and '•' in text:
                        # Split by bullet points and clean
                        feature_items = [f.strip() for f in text.split('•') if f.strip()]
                        features.extend(feature_items)
                    elif text and not text.lower().startswith('description'):
                        features.append(text)
                next_element = next_element.find_next_sibling()
        
        # Extract description - try multiple strategies
        description = ""
        description_parts = []
        
        # Strategy 1: Look for explicit DESCRIPTION header
        desc_section = soup.find('h2', string=re.compile('DESCRIPTION', re.IGNORECASE))
        if desc_section:
            next_element = desc_section.find_next_sibling()
            while next_element and next_element.name != 'h2':
                if next_element.name == 'p':
                    text = clean_text(next_element.text)
                    if text and not text.startswith('Click'):  # Skip navigation text
                        description_parts.append(text)
                next_element = next_element.find_next_sibling()
        
        # Strategy 2: If no explicit description found, look for content that looks like description
        if not description_parts:
            # Look for content that starts with "Description" or is a long paragraph
            content_area = soup.find('div', class_='entry-content') or soup.find('div', class_='content') or soup.find('main')
            if content_area:
                paragraphs = content_area.find_all('p')
                collecting_description = False
                
                for p in paragraphs:
                    text = clean_text(p.text)
                    if not text:
                        continue
                    
                    # Start collecting if we find "Description" or a long paragraph that looks descriptive
                    if (text.lower().startswith('description') or 
                        (len(text) > 100 and any(word in text.lower() for word in ['bedroom', 'house', 'apartment', 'located', 'features include']))):
                        collecting_description = True
                        if text.lower().startswith('description'):
                            # Skip the "Description" header itself
                            continue
                        description_parts.append(text)
                    elif collecting_description and len(text) > 50:
                        # Continue collecting substantial paragraphs
                        description_parts.append(text)
                    elif collecting_description and len(text) < 50:
                        # Stop if we hit a short paragraph (likely end of description)
                        break
        
        description = " ".join(description_parts)
        
        # Clean up features - remove description content if it ended up there
        cleaned_features = []
        for feature in features:
            # Skip items that look like description content
            if (feature.lower().startswith('description') or 
                len(feature) > 200 or
                any(phrase in feature.lower() for phrase in ['this awesome', 'bedroom house is located', 'features include'])):
                continue
            cleaned_features.append(feature)
        
        details['features'] = cleaned_features
        details['description'] = description
        
        # Extract images
        images = []
        img_tags = soup.find_all('img')
        for img in img_tags:
            src = img.get('src', '')
            alt = img.get('alt', '')
            # Filter out logos and navigation images
            if src and 'wp-content/uploads' in src and not any(skip in src.lower() for skip in ['logo', 'line', 'divider']):
                if src.startswith('/'):
                    src = urljoin(BASE_URL, src)
                images.append({
                    'url': src,
                    'alt': alt
                })
        
        details['images'] = images
        
        # Extract any additional info from the page title or meta
        page_title = soup.find('title')
        if page_title:
            details['page_title'] = clean_text(page_title.text)
        
        return details
        
    except Exception as e:
        print(f"Error fetching details for {property_name}: {e}")
        return {}

def extract_additional_info(features):
    """Extract structured information from features list"""
    info = {
        'utilities_included': [],
        'appliances': [],
        'parking_available': False,
        'laundry_available': False,
        'pets_allowed': False
    }
    
    for feature in features:
        feature_lower = feature.lower()
        
        # Check for utilities
        if 'heat' in feature_lower and ('free' in feature_lower or 'included' in feature_lower):
            info['utilities_included'].append('heat')
        if 'utilities' in feature_lower and ('free' in feature_lower or 'included' in feature_lower):
            info['utilities_included'].append('all_utilities')
            
        # Check for appliances
        if 'dishwasher' in feature_lower:
            info['appliances'].append('dishwasher')
        if 'microwave' in feature_lower:
            info['appliances'].append('microwave')
        if 'washer' in feature_lower or 'dryer' in feature_lower:
            info['appliances'].extend(['washer', 'dryer'])
            
        # Check for amenities
        if 'parking' in feature_lower:
            info['parking_available'] = True
        if 'laundry' in feature_lower:
            info['laundry_available'] = True
        if 'pet' in feature_lower:
            info['pets_allowed'] = True
    
    return info

def main(limit=None):
    """Main function to scrape all Tallard properties"""
    print("Starting Tallard Apartments scraper...")
    
    # Get list of all properties
    properties = get_property_list()
    
    if not properties:
        print("No properties found. Exiting...")
        return
    
    # Limit properties for testing if specified
    if limit:
        properties = properties[:limit]
        print(f"Limited to first {limit} properties for testing")
    
    print(f"Processing {len(properties)} properties...")
    
    all_properties = []
    
    for i, prop in enumerate(properties, 1):
        print(f"Processing {i}/{len(properties)}: {prop['name']}")
        
        # Get detailed information
        details = get_property_details(prop['url'], prop['name'])
        
        # Parse iframe data for structured information
        iframe_data = parse_iframe_data(details)
        
        # Combine basic info with details
        complete_property = {
            "name": prop['name'],
            "address": details.get('address', prop['name']),
            "url": prop['url'],
            "price": prop['price'],
            "price_raw": prop.get('price_raw', ''),  # Use the price_raw from portfolio extraction
            "bedrooms": prop['bedrooms'],
            "status": prop['status'],
            "features": details.get('features', []),
            "description": details.get('description', ''),
            "images": details.get('images', []),
            "page_title": details.get('page_title', ''),
            "company": "Tallard Apartments",
            "location": "Madison, WI",
            "scraped_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # Add iframe data if available
        if iframe_data:
            complete_property['iframe_data'] = iframe_data
            # Use iframe data as primary source for rent if available
            if 'rent_from_iframe' in iframe_data and not complete_property['price']:
                complete_property['price'] = iframe_data['rent_from_iframe']
            # Use iframe bedroom data if main extraction didn't work
            if 'bedrooms_from_iframe' in iframe_data and not complete_property['bedrooms']:
                complete_property['bedrooms'] = iframe_data['bedrooms_from_iframe']
        
        # Extract additional structured information
        if complete_property['features']:
            additional_info = extract_additional_info(complete_property['features'])
            complete_property.update(additional_info)
        
        all_properties.append(complete_property)
        
        # Be respectful - add small delay between requests
        time.sleep(1)
    
    # Save to JSON file
    output_file = "../data/raw/tallard_properties.json"
    try:
        with open(output_file, "w") as f:
            json.dump(all_properties, f, indent=2)
        print(f"\nSuccessfully scraped {len(all_properties)} properties to {output_file}")
    except Exception as e:
        print(f"Error saving to file: {e}")
        return
    
    # Print summary statistics
    print("\n=== SCRAPING SUMMARY ===")
    print(f"Total properties: {len(all_properties)}")
    
    status_counts = {}
    for prop in all_properties:
        status = prop['status']
        status_counts[status] = status_counts.get(status, 0) + 1
    
    print("Status breakdown:")
    for status, count in status_counts.items():
        print(f"  {status}: {count}")
    
    bedroom_counts = {}
    for prop in all_properties:
        bedrooms = prop['bedrooms']
        if bedrooms is not None:
            bedroom_counts[bedrooms] = bedroom_counts.get(bedrooms, 0) + 1
    
    print("\nBedroom breakdown:")
    for bedrooms, count in sorted(bedroom_counts.items()):
        bedroom_label = "Studio" if bedrooms == 0 else f"{bedrooms} BR"
        print(f"  {bedroom_label}: {count}")
    
    # Show a sample property
    if all_properties:
        print("\n=== SAMPLE PROPERTY ===")
        sample = all_properties[0]
        print(json.dumps({k: v for k, v in sample.items() if k not in ['images', 'features']}, indent=2))

if __name__ == "__main__":
    # Run all properties (296 total) - add limit=3 for testing
    main(limit=3)
