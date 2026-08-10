#!/usr/bin/env python3
"""
Blog tooling

  python3 blog.py new "My Post Title"   Create a new markdown draft
  python3 blog.py build                 Build posts into HTML + update Blog tab
  python3 blog.py                       (same as build)

Write posts in blog/posts/*.md. Put media in images/blog/.
The Blog tab appears on the homepage only when at least one post exists.

Requires: pip install markdown
"""

from __future__ import annotations

import json
import re
import sys
from datetime import date, datetime
from html import escape
from pathlib import Path

try:
    import markdown as md
except ImportError:
    print("Missing dependency. Run: pip install markdown")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent
POSTS_DIR = ROOT / "blog" / "posts"
BLOG_OUT_DIR = ROOT / "blog"
INDEX_PATH = ROOT / "index.html"
MEDIA_DIR = ROOT / "images" / "blog"

NAV_START = "<!-- BLOG_NAV_START -->"
NAV_END = "<!-- BLOG_NAV_END -->"
SECTION_START = "<!-- BLOG_SECTION_START -->"
SECTION_END = "<!-- BLOG_SECTION_END -->"

MD_EXTENSIONS = ["fenced_code", "tables", "sane_lists", "smarty"]


def ensure_dirs() -> None:
    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)


def slugify(title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return (slug[:80] if slug else "post")


def parse_frontmatter(raw: str) -> tuple[dict[str, str], str]:
    match = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n(.*)$", raw, re.DOTALL)
    if not match:
        return {}, raw.strip()

    meta: dict[str, str] = {}
    for line in match.group(1).splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        value = value.strip()
        if (value.startswith('"') and value.endswith('"')) or (
            value.startswith("'") and value.endswith("'")
        ):
            value = value[1:-1]
        meta[key.strip()] = value
    return meta, match.group(2).strip()


def expand_shortcodes(text: str) -> str:
    def youtube_repl(match: re.Match[str]) -> str:
        raw_id = match.group(1).strip()
        video_id = re.sub(
            r"^https?://(www\.)?(youtube\.com/watch\?v=|youtu\.be/)",
            "",
            raw_id,
        )
        return (
            '<div class="video-container">'
            f'<iframe src="https://www.youtube.com/embed/{escape(video_id)}" '
            'title="YouTube video" '
            'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" '
            "allowfullscreen></iframe></div>"
        )

    def video_repl(match: re.Match[str]) -> str:
        src = match.group(1).strip().lstrip("/")
        return (
            f'<video class="blog-video" controls playsinline src="../{escape(src)}"></video>'
        )

    text = re.sub(r"\{\{youtube:([^}]+)\}\}", youtube_repl, text, flags=re.I)
    text = re.sub(r"\{\{video:([^}]+)\}\}", video_repl, text, flags=re.I)
    return text


def rewrite_media_paths(html: str) -> str:
    html = re.sub(r'(src|href)="/(images/[^"]+)"', r'\1="../\2"', html)
    html = re.sub(r'(src|href)="(images/[^"]+)"', r'\1="../\2"', html)
    return html


def load_posts() -> list[dict]:
    ensure_dirs()
    posts: list[dict] = []
    for path in sorted(POSTS_DIR.glob("*.md")):
        if path.name.startswith("_"):
            continue
        raw = path.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(raw)
        if str(meta.get("draft", "")).lower() == "true":
            continue
        posts.append(
            {
                "slug": path.stem,
                "title": meta.get("title") or path.stem,
                "date": meta.get("date") or date.today().isoformat(),
                "summary": meta.get("summary", ""),
                "body": body,
            }
        )
    posts.sort(key=lambda p: p["date"], reverse=True)
    return posts


def format_date(iso: str) -> str:
    try:
        return datetime.strptime(iso, "%Y-%m-%d").strftime("%B %d, %Y")
    except ValueError:
        return iso


def post_page_html(post: dict, body_html: str) -> str:
    date_label = format_date(post["date"]) if post["date"] else ""
    date_block = f'            <p class="post-date">{escape(date_label)}</p>\n' if date_label else ""
    indented = "\n".join(
        f"                {line}" if line else "" for line in body_html.splitlines()
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{escape(post["title"])} - Vaibhav Gurunathan</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,500;6..72,600;6..72,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <div class="atmosphere" aria-hidden="true"></div>
    <header class="site-header">
        <a class="brand-mark" href="../index.html">VG</a>
        <nav>
            <a href="../index.html#blog" class="back-link">← Back to Blog</a>
        </nav>
    </header>

    <main>
        <article class="blog-detail">
            <h2>{escape(post["title"])}</h2>
{date_block}            <div class="blog-content">
{indented}
            </div>
        </article>
    </main>
    <script src="../assets/js/site-config.js"></script>
    <script src="../assets/js/analytics.js"></script>
</body>
</html>
"""


def listing_html(posts: list[dict]) -> str:
    if not posts:
        return ""

    items = []
    for post in posts:
        date_line = (
            f'\n                    <p class="post-date">{escape(post["date"])}</p>'
            if post["date"]
            else ""
        )
        summary_line = (
            f"\n                    <p>{escape(post['summary'])}</p>" if post["summary"] else ""
        )
        items.append(
            f"""                <article class="blog-post">
                    <h3><a href="blog/{escape(post["slug"])}.html">{escape(post["title"])}</a></h3>{date_line}{summary_line}
                </article>"""
        )

    joined = "\n\n".join(items)
    return f"""        <div id="blog" class="tab-content">
            <h2>Blog Posts</h2>
            <div class="blog-posts">
{joined}
            </div>
        </div>
"""


def replace_between(source: str, start: str, end: str, replacement: str) -> str:
    start_idx = source.find(start)
    end_idx = source.find(end)
    if start_idx == -1 or end_idx == -1 or end_idx < start_idx:
        raise SystemExit(f"Missing markers {start} / {end} in index.html")
    insert = replacement
    if insert and not insert.endswith("\n"):
        insert += "\n"
    return source[: start_idx + len(start)] + "\n" + insert + source[end_idx:]


def clean_generated_html() -> None:
    if not BLOG_OUT_DIR.exists():
        return
    for path in BLOG_OUT_DIR.glob("*.html"):
        path.unlink()


def build() -> None:
    ensure_dirs()
    posts = load_posts()
    clean_generated_html()

    for post in posts:
        body = expand_shortcodes(post["body"])
        html = md.markdown(body, extensions=MD_EXTENSIONS)
        html = rewrite_media_paths(html)
        (BLOG_OUT_DIR / f"{post['slug']}.html").write_text(
            post_page_html(post, html), encoding="utf-8"
        )

    index = INDEX_PATH.read_text(encoding="utf-8")
    nav = (
        '            <button class="tab-button" data-tab="blog">Blog Posts</button>\n'
        if posts
        else ""
    )
    index = replace_between(index, NAV_START, NAV_END, nav)
    index = replace_between(index, SECTION_START, SECTION_END, listing_html(posts))
    INDEX_PATH.write_text(index, encoding="utf-8")

    manifest = [
        {"slug": p["slug"], "title": p["title"], "date": p["date"], "summary": p["summary"]}
        for p in posts
    ]
    (BLOG_OUT_DIR / "posts.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )

    if not posts:
        print("Blog build complete: 0 posts (Blog tab hidden).")
    else:
        print(f"Blog build complete: {len(posts)} post(s). Blog tab enabled.")
        for post in posts:
            print(f"  - {post['date']}  {post['slug']}.html")


def create_new(title_parts: list[str]) -> None:
    ensure_dirs()
    title = " ".join(title_parts).strip() or "Untitled Post"
    slug = slugify(title)
    out = POSTS_DIR / f"{slug}.md"
    n = 2
    while out.exists():
        out = POSTS_DIR / f"{slug}-{n}.md"
        n += 1

    template = f"""---
title: {title}
date: {date.today().isoformat()}
summary: One-line teaser shown on the Blog tab.
---

Write your post in Markdown.

## Images

Put files in `images/blog/`, then:

![Alt text](/images/blog/your-image.jpg)

## Local video

{{{{video:images/blog/your-clip.mp4}}}}

## YouTube

{{{{youtube:dQw4w9WgXcQ}}}}

Or paste a full URL:

{{{{youtube:https://www.youtube.com/watch?v=dQw4w9WgXcQ}}}}
"""
    out.write_text(template, encoding="utf-8")
    print(f"Created {out.relative_to(ROOT)}")
    print("Edit the file, then run: python3 blog.py build")


def main() -> None:
    args = sys.argv[1:]
    command = args[0] if args else "build"
    rest = args[1:]

    if command in ("build",):
        build()
    elif command == "new":
        create_new(rest)
    else:
        print('Usage: python3 blog.py [build|new "Title"]')
        sys.exit(1)


if __name__ == "__main__":
    main()
