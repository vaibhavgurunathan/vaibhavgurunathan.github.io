#!/usr/bin/env python3
"""
Blog Post Converter Script

Converts plain text blog posts to HTML format with proper structure.
Usage: python blog_converter.py input.txt "Post Title" output.html
"""

import sys
import os
from datetime import datetime

def convert_text_to_html(text):
    """Convert plain text to HTML paragraphs"""
    # Split by double newlines for paragraphs
    paragraphs = text.strip().split('\n\n')

    html_parts = []
    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        # Check for headers (lines starting with #)
        if para.startswith('# '):
            html_parts.append(f'<h3>{para[2:].strip()}</h3>')
        elif para.startswith('## '):
            html_parts.append(f'<h4>{para[3:].strip()}</h4>')
        elif para.startswith('### '):
            html_parts.append(f'<h5>{para[4:].strip()}</h5>')
        else:
            # Regular paragraph
            html_parts.append(f'<p>{para.replace(chr(10), "<br>")}</p>')

    return '\n'.join(html_parts)

def generate_html_template(title, content_html):
    """Generate the complete HTML template"""
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

def main():
    if len(sys.argv) != 4:
        print("Usage: python blog_converter.py input.txt \"Post Title\" output.html")
        sys.exit(1)

    input_file = sys.argv[1]
    title = sys.argv[2]
    output_file = sys.argv[3]

    # Check if input file exists
    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' not found.")
        sys.exit(1)

    # Read the input text file
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            text_content = f.read()
    except Exception as e:
        print(f"Error reading input file: {e}")
        sys.exit(1)

    # Convert text to HTML
    content_html = convert_text_to_html(text_content)

    # Generate complete HTML
    html_output = generate_html_template(title, content_html)

    # Ensure blog directory exists
    blog_dir = 'blog'
    if not os.path.exists(blog_dir):
        os.makedirs(blog_dir)

    # Write to output file in blog directory
    output_path = os.path.join(blog_dir, output_file)
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_output)
        print(f"Successfully created blog post: {output_path}")
    except Exception as e:
        print(f"Error writing output file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
