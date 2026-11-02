"""
This script fetches the latest 'pushed_at' date and release/tag versions from GitHub
for each project and updates the local 'last_updated.json' and 'project_versions.json' files.
"""

from datetime import datetime
import glob
import json
import os
import re
import requests

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECTS_DIR = os.path.join(BASE_DIR, 'projects')
OUTPUT_PATH = os.path.join(BASE_DIR, '_data', 'last_updated.json')
VERSIONS_OUTPUT_PATH = os.path.join(BASE_DIR, '_data', 'project_versions.json')
ACTIVITY_OUTPUT_PATH = os.path.join(BASE_DIR, '_data', 'github_activity.json')
PR_BODY_PATH = os.path.join(BASE_DIR, 'pr_body.txt')


def fetch_and_save_updates():
    """
    Reads projects markdown files, fetches the last updated date and version for each GitHub repo,
    and saves the results to last_updated.json and project_versions.json.
    """
    print("Starting project update process...")
    if not os.path.exists(PROJECTS_DIR):
        print(f"Error: The projects directory was not found at {PROJECTS_DIR}")
        return

    try:
        with open(OUTPUT_PATH, 'r', encoding='utf-8') as f:
            old_data = json.load(f)
    except FileNotFoundError:
        old_data = {}

    try:
        with open(VERSIONS_OUTPUT_PATH, 'r', encoding='utf-8') as f:
            old_versions = json.load(f)
    except FileNotFoundError:
        old_versions = {}

    updated_data = dict(old_data)
    updated_versions = dict(old_versions)
    changes = []
    # Standard headers for GitHub API
    headers = {'Accept': 'application/vnd.github.v3+json'}
    github_token = os.environ.get('GITHUB_TOKEN')
    if github_token:
        headers['Authorization'] = f'Bearer {github_token}'
        print("Fetching data from GitHub (authenticated)...")
    else:
        print("Fetching data from GitHub (unauthenticated)...")

    md_files = glob.glob(os.path.join(PROJECTS_DIR, '*.md'))
    for md_path in md_files:
        with open(md_path, 'r', encoding='utf-8') as f:
            content = f.read()

        m_github = re.search(r'^github:\s*["\']?([^"\'\r\n]+)["\']?', content, re.MULTILINE)
        if not m_github:
            continue
        repo_path = m_github.group(1).strip()
        if not repo_path:
            continue

        api_url = f"https://api.github.com/repos/{repo_path}"
        try:
            response = requests.get(api_url, headers=headers)
            response.raise_for_status()
            repo_data = response.json()

            # Update last_updated time
            new_pushed_at = repo_data.get('pushed_at')
            updated_data[repo_path] = new_pushed_at

            old_pushed_at = old_data.get(repo_path)
            if old_pushed_at != new_pushed_at:
                changes.append(f"- **{repo_path}**: Activity updated to `{new_pushed_at}`")

            # Fetch latest release or tag version
            new_version = None
            try:
                rel_url = f"https://api.github.com/repos/{repo_path}/releases/latest"
                rel_res = requests.get(rel_url, headers=headers)
                if rel_res.status_code == 200:
                    rel_data = rel_res.json()
                    new_version = rel_data.get('tag_name') or rel_data.get('name')
                elif rel_res.status_code == 404:
                    tags_url = f"https://api.github.com/repos/{repo_path}/tags?per_page=1"
                    tags_res = requests.get(tags_url, headers=headers)
                    if tags_res.status_code == 200:
                        tags_data = tags_res.json()
                        if isinstance(tags_data, list) and len(tags_data) > 0:
                            new_version = tags_data[0].get('name')
            except requests.exceptions.RequestException as e:
                print(f"   -> Warning: Could not fetch version for {repo_path}: {e}")

            if new_version:
                updated_versions[repo_path] = new_version
                old_version = old_versions.get(repo_path)
                if old_version != new_version:
                    changes.append(f"- **{repo_path}**: Version updated to `{new_version}`")
                    print(f"   -> Updated version: {new_version}")
            elif repo_path in old_versions:
                # Keep previously fetched version if not found due to transient issue
                updated_versions[repo_path] = old_versions[repo_path]

            print(f"Successfully fetched data for: {repo_path}")

        except requests.exceptions.HTTPError as e:
            print(f"HTTP Error for {repo_path}: {e}")
            if e.response.status_code == 403:
                print("   -> This may be a GitHub API rate limit error. Try again in an hour.")
        except requests.exceptions.RequestException as e:
            print(f"Failed to connect for {repo_path}: {e}")

    # Write the collected data to the output file (last_updated.json)
    try:
        with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
            json.dump(updated_data, f, indent=2)
        print(f"\nSuccessfully created the update file at: {OUTPUT_PATH}")
    except IOError as e:
        print(f"Error writing to output file: {e}")

    # Write the collected version data to the output file (project_versions.json)
    try:
        with open(VERSIONS_OUTPUT_PATH, 'w', encoding='utf-8') as f:
            json.dump(updated_versions, f, indent=2)
        print(f"Successfully created the version file at: {VERSIONS_OUTPUT_PATH}")
    except IOError as e:
        print(f"Error writing to version file: {e}")

    # Generate PR Body
    body_content = "This PR updates the project data via the automated schedule.\n\n### Changes:\n"
    if changes:
        body_content += "\n".join(changes)
    else:
        body_content += "No projects had new activity or version updates."

    try:
        with open(PR_BODY_PATH, 'w', encoding='utf-8') as f:
            f.write(body_content)
        print(f"Successfully created PR body at: {PR_BODY_PATH}")
    except IOError as e:
        print(f"Error writing PR body: {e}")


def fetch_latest_activity(headers):
    """
    Fetches the most recently pushed repo and its latest non-merge commit.
    Saves the data to _data/github_activity.json for Eleventy build-time rendering.
    """
    print("Fetching latest overall GitHub activity...")
    try:
        r = requests.get('https://api.github.com/users/Asifdotexe/repos?sort=pushed&per_page=1', headers=headers)
        if not r.ok:
            print(f"Failed to fetch user repos: {r.status_code}")
            return
        repos = r.json()
        if not repos:
            return
        repo = repos[0]
        repo_name = repo.get('name', 'portfolio')
        repo_url = repo.get('html_url', f'https://github.com/Asifdotexe/{repo_name}')
        branch = repo.get('default_branch', 'main')

        commits_url = f'https://api.github.com/repos/Asifdotexe/{repo_name}/commits'
        c = requests.get(f'{commits_url}/{branch}', headers=headers)
        if not c.ok:
            print(f"Failed to fetch branch commit: {c.status_code}")
            return
        commit = c.json()

        # If merge commit, look for first non-merge commit
        msg = commit.get('commit', {}).get('message', '')
        if msg.startswith('Merge '):
            cl = requests.get(f'{commits_url}?sha={branch}&per_page=5', headers=headers)
            if cl.ok:
                for item in cl.json():
                    commit_msg = item.get('commit', {}).get('message', '')
                    if not commit_msg.startswith('Merge '):
                        commit = item
                        break

        clean_msg = commit.get('commit', {}).get('message', 'Latest update').split('\n')[0]
        raw_date = commit.get('commit', {}).get('author', {}).get('date', '')
        commit_url = commit.get('html_url', repo_url)

        formatted_date = ""
        if raw_date:
            try:
                dt = datetime.fromisoformat(raw_date.replace('Z', '+00:00'))
                formatted_date = dt.strftime('%b %d, %Y')
            except Exception:
                formatted_date = raw_date

        activity_data = {
            "repo_name": repo_name,
            "repo_url": repo_url,
            "commit_message": clean_msg,
            "commit_url": commit_url,
            "commit_date": formatted_date
        }

        with open(ACTIVITY_OUTPUT_PATH, 'w', encoding='utf-8') as f:
            json.dump(activity_data, f, indent=2)
        print(f"Successfully saved latest activity to: {ACTIVITY_OUTPUT_PATH}")

    except Exception as e:
        print(f"Error fetching latest GitHub activity: {e}")


if __name__ == "__main__":
    headers = {'Accept': 'application/vnd.github.v3+json'}
    token = os.environ.get('GITHUB_TOKEN')
    if token:
        headers['Authorization'] = f'Bearer {token}'
    fetch_and_save_updates()
    fetch_latest_activity(headers)
