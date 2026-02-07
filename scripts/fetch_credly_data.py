
import os
import re
import requests
from bs4 import BeautifulSoup
from io import BytesIO

# Try to import PIL for image conversion
try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
    print("Warning: PIL (Pillow) not found. Images will be renamed to .webp but not converted.")

def fetch_credly_badges() -> None:
    """
    Fetches Credly badges from index.html and downloads them to assets/images/badges directory.
    """
    # Define paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    index_path = os.path.join(base_dir, 'index.html')
    badges_dir = os.path.join(base_dir, 'assets', 'images', 'badges')

    # Create destination directory
    if not os.path.exists(badges_dir):
        os.makedirs(badges_dir)
        print(f"Created directory: {badges_dir}")

    # Read index.html to find badge IDs
    try:
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: Could not find index.html at {index_path}")
        return

    # Extract badge IDs using regex from hrefs
    # Looking for: href="https://www.credly.com/badges/UUID"
    badge_ids = re.findall(r'href="https?://(?:www\.)?credly\.com/badges/([^"]+)"', content)
    unique_ids = list(set(badge_ids))

    print(f"Found {len(unique_ids)} unique badges in index.html.")

    # Headers to mimic a browser request
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    timeout = 10 # seconds

    for badge_id in unique_ids:
        badge_url = f"https://www.credly.com/badges/{badge_id}"
        print(f"Fetching metadata for badge ID: {badge_id}")
        
        try:
            response = requests.get(badge_url, headers=headers, timeout=timeout)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Get badge title for alt text reference
            og_title = soup.find('meta', property='og:title')
            title = og_title['content'] if og_title else "Unknown Badge"
            print(f"  Title: {title}")
            
            # Helper function to try finding the image
            image_url = None
            
            # Strategy 1: Open Graph image (usually high quality)
            og_image = soup.find('meta', property='og:image')
            if og_image and og_image.get('content'):
                image_url = og_image['content']
            
            if image_url:
                print(f"  Found image URL: {image_url}")
                
                # Download the image
                img_response = requests.get(image_url, headers=headers, stream=True, timeout=timeout)
                img_response.raise_for_status()
                
                filename = f"{badge_id}.webp"
                filepath = os.path.join(badges_dir, filename)
                
                # Save as WebP
                if HAS_PIL:
                    try:
                        image = Image.open(BytesIO(img_response.content))
                        image.save(filepath, 'WEBP')
                        print(f"  Converted and saved to: {filepath}")
                    except Exception as e:
                        print(f"  Error converting image: {e}. Saving raw content.")
                        with open(filepath, 'wb') as f:
                            f.write(img_response.content)
                else:
                    with open(filepath, 'wb') as f:
                        for chunk in img_response.iter_content(chunk_size=8192):
                            f.write(chunk)
                    print(f"  Saved to: {filepath} (Note: Extension is .webp but content might be png/jpg)")
            else:
                print(f"  Could not find image URL for badge {badge_id}")

        except requests.exceptions.RequestException as e:
            print(f"  Network error fetching {badge_id}: {e}")
        except Exception as e:
            print(f"  Error processing {badge_id}: {e}")

if __name__ == "__main__":
    fetch_credly_badges()
