"""
This script fetches the latest 'pushed_at' date from GitHub for each project
and updates the local 'last_updated.json' file.
"""

import json
import os
import requests

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECTS_SOURCE_PATH = os.path.join(BASE_DIR, 'assets', 'data', 'projects.json')
OUTPUT_PATH = os.path.join(BASE_DIR, 'assets', 'data', 'last_updated.json')


def fetch_and_save_updates():
    """
    Reads projects.json, fetches the last updated date for each GitHub repo,
    and saves the results to last_updated.json.
    """
    print("Starting project update process...")
    try:
        with open(PROJECTS_SOURCE_PATH, 'r', encoding='utf-8') as f:
            projects = json.load(f)
    except FileNotFoundError:
        print(f"Error: The source file was not found at {PROJECTS_SOURCE_PATH}")
        return

    updated_data = {}
    # Standard headers for GitHub API - no authentication
    headers = {'Accept': 'application/vnd.github.v3+json'}

    print("Fetching data from GitHub (unauthenticated)...")
    for project in projects:
        repo_path = project.get("github")
        if not repo_path:
            print(f"Skipping '{project.get('title')}' as it has no 'github' key.")
            continue

        api_url = f"https://api.github.com/repos/{repo_path}"
        try:
            response = requests.get(api_url, headers=headers)
            # Raises an exception for bad status codes (4xx or 5xx)
            response.raise_for_status()
            repo_data = response.json()
            updated_data[repo_path] = repo_data.get('pushed_at')
            print(f"Successfully fetched data for: {repo_path}")

        except requests.exceptions.HTTPError as e:
            # This will catch rate-limiting errors (status 403)
            print(f"HTTP Error for {repo_path}: {e}")
            if e.response.status_code == 403:
                print("   -> This may be a GitHub API rate limit error. Try again in an hour.")
        except requests.exceptions.RequestException as e:
            print(f"Failed to connect for {repo_path}: {e}")

    # Write the collected data to the output file
    try:
        with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
            json.dump(updated_data, f, indent=2)
        print(f"\nSuccessfully created the update file at: {OUTPUT_PATH}")
    except IOError as e:
        print(f"Error writing to output file: {e}")


if __name__ == "__main__":
    fetch_and_save_updates()
