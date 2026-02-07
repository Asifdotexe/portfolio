"""
This script optimizes images by resizing them to a maximum width and converting them to WebP format.
"""

import os
import shutil
from PIL import Image

# Configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, 'assets')
IMAGE_DIRS = [
    os.path.join(ASSETS_DIR, 'images', 'projects'),
    os.path.join(ASSETS_DIR, 'images', 'events'),
    os.path.join(ASSETS_DIR, 'images', 'certificates'),
    os.path.join(ASSETS_DIR, 'images')  # For my-memoji.png
]
BACKUP_DIR = os.path.join(ASSETS_DIR, 'images_backup')
MAX_WIDTH = 800
QUALITY = 80


def optimize_images() -> None:
    """
    Optimizes images by resizing them to a maximum width and converting them to WebP format.
    """
    # Create backup directory if it doesn't exist
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        print(f"Created backup directory: {BACKUP_DIR}")

    for directory in IMAGE_DIRS:
        if not os.path.exists(directory):
            print(f"Directory not found: {directory}")
            continue

        print(f"Processing directory: {directory}")
        for filename in os.listdir(directory):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                filepath = os.path.join(directory, filename)

                # Skip if it's a directory
                if os.path.isdir(filepath):
                    continue

                # Backup original
                rel_path = os.path.relpath(filepath, os.path.join(ASSETS_DIR, 'images'))
                backup_path = os.path.join(BACKUP_DIR, rel_path)
                backup_dir = os.path.dirname(backup_path)

                if not os.path.exists(backup_dir):
                    os.makedirs(backup_dir)

                if not os.path.exists(backup_path):
                    shutil.copy2(filepath, backup_path)

                try:
                    with Image.open(filepath) as img:
                        # Resize if too large
                        if img.width > MAX_WIDTH:
                            ratio = MAX_WIDTH / img.width
                            new_height = int(img.height * ratio)
                            img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
                            print(f"Resized {filename} to {MAX_WIDTH}x{new_height}")

                        # Convert to WebP
                        webp_filename = os.path.splitext(filename)[0] + '.webp'
                        webp_path = os.path.join(directory, webp_filename)

                        img.save(webp_path, 'WEBP', quality=QUALITY)
                        print(f"Generated WebP: {webp_path}")

                except Exception as e:
                    print(f"Failed to process {filename}: {e}")


if __name__ == "__main__":
    optimize_images()
