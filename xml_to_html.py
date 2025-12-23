#!/usr/bin/env python3
"""
WordPress XML to HTML Converter

Converts WordPress posts from XML export to HTML files for blog and projects.
"""

import xml.etree.ElementTree as ET
import os
import re

def clean_wordpress_content(content):
    """Convert WordPress Gutenberg blocks to plain HTML"""
    if not content:
        return ""

    # Remove Gutenberg block comments
    content = re.sub(r'<!-- wp:[^>]* -->', '', content)
    content = re.sub(r'<!-- /wp:[^>]* -->', '', content)

    # Clean up extra whitespace
    content = re.sub(r'\n\s*\n', '\n\n', content)

    # Convert WordPress shortcodes or embeds if any
    # For now, keep them as is or remove

    return content.strip()

def generate_blog_html(title, content_html):
    """Generate HTML for blog posts"""
    template = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Vaibhav Gurunathan</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <header>
        <h1 onclick="window.location.href='../index.html'" style="cursor: pointer; transition: opacity 0.3s;">Vaibhav Gurunathan</h1>
        <nav>
            <a href="javascript:history.back()" class="back-link">← Back</a>
        </nav>
    </header>

    <main>
        <article class="blog-detail">
            <h2>{title}</h2>

            <div class="blog-content">
{content_html}
            </div>
        </article>
    </main>
</body>
</html>'''
    return template

def generate_project_html(title, content_html):
    """Generate HTML for project posts"""
    # For projects, we'll use a similar structure but with project-detail class
    template = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Vaibhav Gurunathan</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <header>
        <h1 onclick="window.location.href='../index.html'" style="cursor: pointer; transition: opacity 0.3s;">Vaibhav Gurunathan</h1>
        <nav>
            <a href="javascript:history.back()" class="back-link">← Back</a>
        </nav>
    </header>

    <main>
        <article class="project-detail">
            <h2>{title}</h2>

            <div class="project-content">
{content_html}
            </div>
        </article>
    </main>
</body>
</html>'''
    return template

def main():
    # Parse XML
    tree = ET.parse('vaibhav039swebsite.WordPress.2025-12-23.xml')
    root = tree.getroot()

    # Namespace
    ns = {'wp': 'http://wordpress.org/export/1.2/',
          'content': 'http://purl.org/rss/1.0/modules/content/'}

    # Find all items
    for item in root.findall('.//item'):
        post_type = item.find('wp:post_type', ns)
        if post_type is None or post_type.text != 'post':
            continue

        status = item.find('wp:status', ns)
        if status is None or status.text != 'publish':
            continue

        # Get categories
        categories = []
        for category in item.findall('category'):
            if category.get('domain') == 'category':
                categories.append(category.get('nicename'))

        # Check if blog-posts, projects, or experience
        if 'blog-posts' in categories:
            folder = 'blog'
            generator = generate_blog_html
        elif 'projects' in categories:
            folder = 'projects'
            generator = generate_project_html
        elif 'experience' in categories:
            folder = 'experience'
            generator = generate_blog_html  # Use blog style for experience
        else:
            continue

        # Get title, post_name, content
        title_elem = item.find('title')
        title = title_elem.text if title_elem is not None else ""

        post_name_elem = item.find('wp:post_name', ns)
        post_name = post_name_elem.text if post_name_elem is not None else ""

        content_elem = item.find('content:encoded', ns)
        content = content_elem.text if content_elem is not None else ""

        # Clean content
        content_html = clean_wordpress_content(content)

        # Generate HTML
        html = generator(title, content_html)

        # Ensure folder exists
        os.makedirs(folder, exist_ok=True)

        # Write file
        filename = f"{post_name}.html"
        filepath = os.path.join(folder, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)

        print(f"Created {filepath}")

if __name__ == "__main__":
    main()
