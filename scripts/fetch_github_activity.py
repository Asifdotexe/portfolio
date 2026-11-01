"""
This script fetches the latest 'pushed_at' date from GitHub for each project
and updates the local 'last_updated.json' file.
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
ACTIVITY_OUTPUT_PATH = os.path.join(BASE_DIR, '_data', 'github_activity.json')
PR_BODY_PATH = os.path.join(BASE_DIR, 'pr_body.txt')


def fetch_and_save_updates():
    """
    Reads projects markdown files, fetches the last updated date for each GitHub repo,
    and saves the results to last_updated.json.
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

    updated_data = {}
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

            # Update tags from topics in markdown frontmatter
            topics = repo_data.get('topics', [])
            if topics:
                m_tags = re.search(r'^tags:\s*\n((?:\s*-\s*[^\r\n]+\r?\n?)+)', content, re.MULTILINE)
                old_tags = []
                if m_tags:
                    old_tags = [t.strip().lstrip('- ').strip('\"\'') for t in m_tags.group(1).strip().splitlines() if t.strip()]

                if set(topics) != set(old_tags):
                    new_tags_yaml = "tags:\n" + "\n".join(f"  - {t}" for t in topics) + "\n"
                    if m_tags:
                        new_content = re.sub(r'^tags:\s*\n(?:\s*-\s*[^\r\n]+\r?\n?)+', new_tags_yaml, content, flags=re.MULTILINE)
                    else:
                        parts = content.split('---', 2)
                        if len(parts) >= 3:
                            new_content = f"---{parts[1].rstrip()}\n{new_tags_yaml}---{parts[2]}"
                        else:
                            new_content = content
                    with open(md_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    changes.append(f"- **{repo_path}**: Tags updated to `{', '.join(topics)}`")
                    print(f"   -> Updated tags: {topics}")

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

    # Generate PR Body
    body_content = "This PR updates the project data via the automated schedule.\n\n### Changes:\n"
    if changes:
        body_content += "\n".join(changes)
    else:
        body_content += "No projects had new activity or tag updates."

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
