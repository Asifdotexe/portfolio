
import os
import re
import requests
from bs4 import BeautifulSoup


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

    # Extract badge IDs using regex
    # Looking for: data-share-badge-id="UUID"
    badge_ids = re.findall(r'data-share-badge-id="([^"]+)"', content)
    unique_ids = list(set(badge_ids))

    print(f"Found {len(unique_ids)} unique badges in index.html.")

    # Headers to mimic a browser request
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    for badge_id in unique_ids:
        # Check if image already exists to avoid re-downloading
        # We don't know the extension yet, so we'll check common ones or just overwrite
        # Ideally, we check if ANY file with that name exists, but let's just fetch for now to be safe on updates
        
        badge_url = f"https://www.credly.com/badges/{badge_id}"
        print(f"Fetching metadata for badge ID: {badge_id}")
        
        try:
            response = requests.get(badge_url, headers=headers)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Helper function to try finding the image
            image_url = None
            
            # Strategy 1: Open Graph image (usually high quality)
            og_image = soup.find('meta', property='og:image')
            if og_image and og_image.get('content'):
                image_url = og_image['content']
            
            # Strategy 2: Look for the badge image tag if OG fails
            if not image_url:
                # credly structure varies, but often has an image with alt text containing "badge"
                # or inside a specific container. Let's rely on OG first as it's standard.
                pass

            if image_url:
                print(f"  Found image URL: {image_url}")
                
                # Download the image
                img_response = requests.get(image_url, stream=True)
                img_response.raise_for_status()
                
                # Determine extension from content-type or url
                content_type = img_response.headers.get('Content-Type', '')
                ext = 'png'
                if 'image/jpeg' in content_type:
                    ext = 'jpg'
                elif 'image/webp' in content_type:
                    ext = 'webp'
                
                filename = f"{badge_id}.{ext}"
                filepath = os.path.join(badges_dir, filename)
                
                with open(filepath, 'wb') as f:
                    for chunk in img_response.iter_content(chunk_size=8192):
                        f.write(chunk)
                
                print(f"  Saved to: {filepath}")
            else:
                print(f"  Could not find image URL for badge {badge_id}")

        except requests.exceptions.RequestException as e:
            print(f"  Network error fetching {badge_id}: {e}")
        except Exception as e:
            print(f"  Error processing {badge_id}: {e}")

if __name__ == "__main__":
    fetch_credly_badges()
