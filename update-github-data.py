#!/usr/bin/env python3
"""
GitHub Data Fetcher for Personal Website

This script fetches GitHub repository data and saves it as static JSON
for use in the personal website, avoiding CORS issues on GitHub Pages.

Run this script daily to keep the data fresh:
python3 update-github-data.py

Or set up a cron job:
0 2 * * * cd /path/to/website && python3 update-github-data.py
"""

import json
import os
import sys
import subprocess
from datetime import datetime, timedelta
import requests
from typing import Dict, List, Any

# Configuration
GITHUB_USERNAME = 'vaibhavgurunathan'
JS_FILE = os.path.abspath('assets/js/script.js')
START_MARKER = '// GitHub Data - Updated by update-github-data.py script'
END_MARKER = '// END AUTO-GENERATED SECTION'
OUTPUT_FILE = os.path.abspath('github-data.json')  # Keep for backward compatibility

# Language color mapping (subset of popular languages)
LANGUAGE_COLORS = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'C#': '#239120',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'Dart': '#00B4AB',
    'HTML': '#e34c26',
    'CSS': '#1572B6',
    'SCSS': '#c6538c',
    'Shell': '#89e051',
    'PowerShell': '#012456',
    'R': '#198CE7',
    'MATLAB': '#e16737',
    'Verilog': '#b2b7f8',
    'VHDL': '#adb2cb',
    'Assembly': '#6E4C13',
    'Makefile': '#427819',
    'Dockerfile': '#384d54',
    'YAML': '#cb171e',
    'JSON': '#292929',
    'Markdown': '#083fa1',
    'TeX': '#3D6117',
    'Jupyter Notebook': '#DA5B0B'
}

def format_relative_time(date_string: str) -> str:
    """Format a date string as relative time (e.g., '2 days ago')"""
    try:
        date = datetime.fromisoformat(date_string.replace('Z', '+00:00'))
        now = datetime.now(date.tzinfo)
        diff = now - date

        if diff.days > 30:
            months = diff.days // 30
            return f"{months} month{'s' if months != 1 else ''} ago"
        elif diff.days > 0:
            return f"{diff.days} day{'s' if diff.days != 1 else ''} ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        else:
            return "Just now"
    except:
        return "Recently"

def fetch_github_repos(username: str) -> List[Dict[str, Any]]:
    """Fetch repositories from GitHub API"""
    url = f"https://api.github.com/users/{username}/repos"
    params = {
        'sort': 'updated',
        'direction': 'desc',
        'per_page': 10  # Get more repos for better data
    }

    headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Data-Fetcher/1.0'
    }

    try:
        response = requests.get(url, params=params, headers=headers, timeout=30)
        response.raise_for_status()
        repos = response.json()

        # Sort by updated date (most recent first)
        repos.sort(key=lambda x: x.get('updated_at', ''), reverse=True)

        return repos[:6]  # Return top 6 most recently updated
    except requests.RequestException as e:
        print(f"Error fetching repositories: {e}")
        return []

def fetch_languages_for_repo(username: str, repo_name: str) -> Dict[str, int]:
    """Fetch language data for a specific repository"""
    url = f"https://api.github.com/repos/{username}/{repo_name}/languages"

    headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Data-Fetcher/1.0'
    }

    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching languages for {repo_name}: {e}")
        return {}

def fetch_commit_stats(username: str, repo_name: str) -> Dict[str, int]:
    """Fetch actual commit statistics for a repository"""
    base_url = f"https://api.github.com/repos/{username}/{repo_name}/commits"
    headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Data-Fetcher/1.0'
    }

    now = datetime.now()
    last_day = 0
    last_month = 0
    last_year = 0

    try:
        # Get commits from the last year (GitHub API limits to 100 per page)
        since_date = (now - timedelta(days=365)).isoformat()
        params = {
            'since': since_date,
            'per_page': 100  # Max per page
        }

        response = requests.get(base_url, params=params, headers=headers, timeout=30)
        response.raise_for_status()
        commits = response.json()

        if not isinstance(commits, list):
            commits = []

        # Count commits in different time periods
        for commit in commits:
            try:
                commit_date = datetime.fromisoformat(commit['commit']['committer']['date'].replace('Z', '+00:00'))
                diff_days = (now - commit_date.replace(tzinfo=None)).days

                if diff_days <= 1:
                    last_day += 1
                if diff_days <= 30:
                    last_month += 1
                if diff_days <= 365:
                    last_year += 1
            except:
                continue

    except requests.RequestException as e:
        print(f"Error fetching commits for {repo_name}: {e}")
        # Fallback to estimation if API fails
        return None

    return {
        'lastDay': last_day,
        'lastMonth': last_month,
        'lastYear': last_year
    }

def calculate_commit_stats(repos: List[Dict[str, Any]]) -> Dict[str, int]:
    """Calculate commit statistics based on actual GitHub data"""
    total_last_day = 0
    total_last_month = 0
    total_last_year = 0

    print("📊 Fetching real commit statistics...")

    for repo in repos:
        try:
            commit_stats = fetch_commit_stats(GITHUB_USERNAME, repo['name'])
            if commit_stats:
                total_last_day += commit_stats['lastDay']
                total_last_month += commit_stats['lastMonth']
                total_last_year += commit_stats['lastYear']
                print(f"  📈 {repo['name']}: {commit_stats['lastDay']} (24h), {commit_stats['lastMonth']} (30d), {commit_stats['lastYear']} (12m)")
            else:
                # Fallback to estimation if API fails for this repo
                print(f"  ⚠️  Using estimation for {repo['name']}")
                updated_date = datetime.fromisoformat(repo['updated_at'].replace('Z', '+00:00'))
                diff_days = (datetime.now() - updated_date.replace(tzinfo=None)).days
                activity_level = max(0, min(5, 6 - diff_days))

                if diff_days <= 1:
                    total_last_day += int(activity_level * 2)
                if diff_days <= 30:
                    total_last_month += int(activity_level * 8)
                if diff_days <= 365:
                    total_last_year += int(activity_level * 50)
        except Exception as e:
            print(f"Error processing commit stats for {repo.get('name', 'unknown')}: {e}")
            continue

    return {
        'lastDay': max(total_last_day, 0),
        'lastMonth': max(total_last_month, 0),
        'lastYear': max(total_last_year, 0)
    }

def process_repositories(repos: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Process repositories to add language data and format for website"""
    processed_repos = []

    for repo in repos:
        try:
            # Fetch language data
            languages = fetch_languages_for_repo(GITHUB_USERNAME, repo['name'])

            # Get top 3 languages by bytes
            if languages:
                sorted_languages = sorted(languages.items(), key=lambda x: x[1], reverse=True)
                top_languages = [lang for lang, _ in sorted_languages[:3]]
            else:
                top_languages = []

            # Format repository data for website
            processed_repo = {
                'name': repo['name'],
                'full_name': repo['full_name'],
                'html_url': repo['html_url'],
                'description': repo.get('description') or 'No description available',
                'updated_at': repo['updated_at'],
                'language': repo.get('language'),
                'languages': languages,
                'topLanguages': top_languages,
                'relativeTime': format_relative_time(repo['updated_at'])
            }

            processed_repos.append(processed_repo)

        except Exception as e:
            print(f"Error processing repo {repo.get('name', 'unknown')}: {e}")
            continue

    return processed_repos

def run_git_command(command: List[str]) -> bool:
    """Run a git command and return success status"""
    try:
        result = subprocess.run(['git'] + command, capture_output=True, text=True, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Git command failed: {' '.join(command)}")
        print(f"Error: {e.stderr}")
        return False
    except FileNotFoundError:
        print("Git command not found. Make sure git is installed.")
        return False

def update_javascript_file(github_data: Dict[str, Any]) -> bool:
    """Update the JavaScript file with new GitHub data"""
    try:
        # Read the current JavaScript file
        with open(JS_FILE, 'r', encoding='utf-8') as f:
            js_content = f.read()

        # Find the markers
        start_idx = js_content.find(START_MARKER)
        end_idx = js_content.find(END_MARKER)

        if start_idx == -1 or end_idx == -1:
            print(f"❌ Could not find markers in {JS_FILE}")
            return False

        # Format the data as JavaScript object
        js_data = json.dumps(github_data, indent=2, ensure_ascii=False)

        # Create the replacement content
        replacement = f'{START_MARKER}\n// DO NOT EDIT MANUALLY - This section is auto-generated\nconst githubData = {js_data};\n// {END_MARKER}'

        # Replace the section
        before_marker = js_content[:start_idx]
        after_marker = js_content[end_idx + len(END_MARKER):]
        new_content = before_marker + replacement + after_marker

        # Write back to file
        with open(JS_FILE, 'w', encoding='utf-8') as f:
            f.write(new_content)

        print(f"✅ Successfully updated {JS_FILE}")
        return True

    except Exception as e:
        print(f"❌ Error updating JavaScript file: {e}")
        return False

def git_add_commit_push() -> bool:
    """Add, commit, and push the updated JavaScript file"""
    print("📝 Updating git repository...")

    # Check if there are changes to commit
    try:
        result = subprocess.run(['git', 'status', '--porcelain', JS_FILE],
                              capture_output=True, text=True)
        if not result.stdout.strip():
            print("ℹ️  No changes to commit")
            return True
    except:
        pass

    # Add the file
    if not run_git_command(['add', JS_FILE]):
        return False

    # Create commit message with timestamp
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    commit_message = f"Update GitHub data - {timestamp}"

    # Commit
    if not run_git_command(['commit', '-m', commit_message]):
        return False

    # Push
    if not run_git_command(['push']):
        return False

    print("✅ Successfully committed and pushed GitHub data updates")
    return True

def check_last_update() -> bool:
    """Check if the script has already run today. Return True if should skip update."""
    today = datetime.now().strftime('%Y-%m-%d')
    last_update_file = os.path.abspath('.last_github_update')

    try:
        with open(last_update_file, 'r') as f:
            last_update = f.read().strip()

        if last_update == today:
            print(f"ℹ️  GitHub data was already updated today ({today}). Skipping update.")
            return True  # Skip update

    except FileNotFoundError:
        # File doesn't exist, this is the first run
        pass

    # Update or create the last update file
    try:
        with open(last_update_file, 'w') as f:
            f.write(today)
        print(f"📅 Recorded update for {today}")
    except Exception as e:
        print(f"⚠️  Could not write last update file: {e}")

    return False  # Proceed with update

def main():
    """Main function to fetch and save GitHub data"""
    print(f"🚀 Starting GitHub data update for {GITHUB_USERNAME}")

    # Check if we should skip the update (already ran today)
    if check_last_update():
        return True

    # Fetch repositories
    repos = fetch_github_repos(GITHUB_USERNAME)

    if not repos:
        print("❌ No repositories found or error fetching data")
        return False

    print(f"📁 Found {len(repos)} repositories")

    # Process repositories with language data
    processed_repos = process_repositories(repos)

    # Calculate commit statistics
    commit_stats = calculate_commit_stats(processed_repos)

    # Prepare data for website
    github_data = {
        'username': GITHUB_USERNAME,
        'lastUpdated': datetime.now().isoformat(),
        'repositories': processed_repos,
        'commitStats': commit_stats,
        'languageColors': LANGUAGE_COLORS
    }

    # Update JavaScript file with hardcoded data
    print("📝 Updating JavaScript file with hardcoded data...")
    if not update_javascript_file(github_data):
        print("❌ Failed to update JavaScript file")
        return False

    print(f"✅ Successfully updated {JS_FILE}")
    print(f"📊 Stats: {commit_stats['lastDay']} commits (24h), {commit_stats['lastMonth']} commits (30d), {commit_stats['lastYear']} commits (12m)")
    print(f"📁 Processed {len(processed_repos)} repositories")

    # Also save to JSON for backup/debugging
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(github_data, f, indent=2, ensure_ascii=False)
        print(f"💾 Backup saved to {OUTPUT_FILE}")
    except Exception as e:
        print(f"⚠️  Could not save backup JSON: {e}")

    # Git operations
    print("\n" + "="*50)
    if git_add_commit_push():
        print("🎉 GitHub data update complete and deployed!")
        return True
    else:
        print("⚠️  Data updated but git operations failed")
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
