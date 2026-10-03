#!/usr/bin/env python3
"""Page catalog and listings.

  python3 pages.py          Apply pages.yml (listings, visibility, order)
  python3 pages.py new      Create a new blog or project page
  python3 new_page.py       Same as pages.py new

Dates in pages.yml are for ordering only and are never shown on the site.
./update-github-data.sh runs `python3 pages.py` automatically.
"""

from __future__ import annotations

import json
import re
import sys
from datetime import date, datetime
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent
YAML_PATH = ROOT / "pages.yml"
INDEX_PATH = ROOT / "index.html"
JS_PATH = ROOT / "assets" / "js" / "pages-config.js"
SECTIONS = ("blog", "projects")

MARKERS = {
    "blog": ("<!-- PAGE_LIST_BLOG_START -->", "<!-- PAGE_LIST_BLOG_END -->"),
    "projects": ("<!-- PAGE_LIST_PROJECTS_START -->", "<!-- PAGE_LIST_PROJECTS_END -->"),
}

BOOL_TRUE = {"true", "yes", "on", "1"}


def parse_scalar(raw: str):
    value = raw.strip()
    if not value:
        return ""
    if value.lower() in BOOL_TRUE:
        return True
    if value.lower() in {"false", "no", "off", "0"}:
        return False
    if (value.startswith('"') and value.endswith('"')) or (
        value.startswith("'") and value.endswith("'")
    ):
        try:
            return json.loads(value if value.startswith('"') else json.dumps(value[1:-1]))
        except json.JSONDecodeError:
            return value[1:-1]
    return value


def yaml_dump_scalar(value) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    text = "" if value is None else str(value)
    if (
        not text
        or text.lower() in BOOL_TRUE
        or text.lower() in {"false", "no", "off"}
        or any(ch in text for ch in ":#{}[]&*!|>'\"%@`")
        or text.strip() != text
        or "\n" in text
    ):
        return json.dumps(text)
    return text


def parse_yml(text: str) -> dict[str, dict[str, dict]]:
    sections: dict[str, dict[str, dict]] = {name: {} for name in SECTIONS}
    current_section: str | None = None
    current_slug: str | None = None
    for line in text.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        section_match = re.match(r"^([A-Za-z0-9_-]+):\s*$", line)
        if section_match and not line.startswith(" "):
            current_section = section_match.group(1)
            sections.setdefault(current_section, {})
            current_slug = None
            continue
        slug_match = re.match(r"^  ([A-Za-z0-9_-]+):\s*$", line)
        if slug_match and current_section:
            current_slug = slug_match.group(1)
            sections[current_section][current_slug] = {}
            continue
        field_match = re.match(r"^    ([A-Za-z0-9_]+):\s*(.*)$", line)
        if field_match and current_section and current_slug:
            key, raw = field_match.group(1), field_match.group(2)
            sections[current_section][current_slug][key] = parse_scalar(raw)
    return sections


def dump_yml(sections: dict[str, dict[str, dict]]) -> str:
    lines = [
        "# Page catalog. `on` shows a page on listings. `date` is sort-only (never shown).",
        "# Add a page with: python3 new_page.py",
        "# Apply changes with: python3 pages.py  (also runs from ./update-github-data.sh)",
        "",
    ]
    field_order = [
        "on",
        "date",
        "title",
        "summary",
        "show_in_blog",
        "show_in_projects",
        "show_in_timeline",
        "category",
        "year",
        "timeline_title",
        "timeline_summary",
    ]
    for name in SECTIONS:
        lines.append(f"{name}:")
        items = sorted(
            sections.get(name, {}).items(),
            key=lambda item: item[1].get("date") or "",
            reverse=True,
        )
        for slug, meta in items:
            lines.append(f"  {slug}:")
            seen = set()
            for key in field_order:
                if key in meta:
                    lines.append(f"    {key}: {yaml_dump_scalar(meta[key])}")
                    seen.add(key)
            for key, value in meta.items():
                if key not in seen:
                    lines.append(f"    {key}: {yaml_dump_scalar(value)}")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def title_from_slug(slug: str) -> str:
    return slug.replace("-", " ").title()


def is_on(meta: dict) -> bool:
    return bool(meta.get("on", False))


def href_for(section: str, slug: str) -> str:
    return f"{section}/{slug}.html"


def flatten(sections: dict[str, dict[str, dict]]) -> list[dict]:
    pages = []
    for section, items in sections.items():
        for slug, meta in items.items():
            page = dict(meta)
            page["section"] = section
            page["slug"] = slug
            page["href"] = href_for(section, slug)
            pages.append(page)
    return pages


def sort_pages(pages: list[dict]) -> list[dict]:
    return sorted(pages, key=lambda p: p.get("date") or "", reverse=True)


def show_in_blog(page: dict) -> bool:
    if page["section"] == "blog":
        return page.get("show_in_blog", True)
    return bool(page.get("show_in_blog", False))


def show_in_projects(page: dict) -> bool:
    if page["section"] == "projects":
        return page.get("show_in_projects", True)
    return bool(page.get("show_in_projects", False))


def show_in_timeline(page: dict) -> bool:
    if page["section"] == "experience":
        return page.get("show_in_timeline", True)
    return bool(page.get("show_in_timeline", False))


def discover_html() -> dict[str, list[str]]:
    found: dict[str, list[str]] = {}
    for name in SECTIONS:
        folder = ROOT / name
        found[name] = sorted(p.stem for p in folder.glob("*.html")) if folder.exists() else []
    return found


def merge_missing(sections: dict[str, dict[str, dict]], discovered: dict[str, list[str]]) -> list[str]:
    added = []
    today = date.today().isoformat()
    for name in SECTIONS:
        section = sections.setdefault(name, {})
        for slug in discovered.get(name, []):
            if slug in section:
                continue
            section[slug] = {
                "on": False,
                "date": today,
                "title": title_from_slug(slug),
                "summary": "",
            }
            added.append(href_for(name, slug))
    return added


def hidden_hrefs(sections: dict[str, dict[str, dict]]) -> list[str]:
    return [href_for(section, slug) for section, items in sections.items() for slug, meta in items.items() if not is_on(meta)]


def write_js(hrefs: list[str]) -> None:
    JS_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = ", ".join(f'"{h}"' for h in hrefs)
    JS_PATH.write_text(
        "// Generated by pages.py — do not edit by hand.\n"
        "// Edit pages.yml, then run: python3 pages.py\n"
        f"window.HIDDEN_PAGE_HREFS = [{payload}];\n",
        encoding="utf-8",
    )


def replace_between(source: str, start: str, end: str, replacement: str) -> str:
    start_idx = source.find(start)
    end_idx = source.find(end)
    if start_idx == -1 or end_idx == -1 or end_idx < start_idx:
        raise SystemExit(f"Missing markers {start} / {end} in index.html")
    insert = replacement
    if insert and not insert.endswith("\n"):
        insert += "\n"
    return source[: start_idx + len(start)] + "\n" + insert + source[end_idx:]


def blog_cards(pages: list[dict]) -> str:
    items = [p for p in sort_pages(pages) if is_on(p) and show_in_blog(p)]
    if not items:
        return ""
    cards = []
    for page in items:
        cards.append(
            f"""                <article class="blog-post">
                    <h3><a href="{escape(page["href"])}">{escape(page.get("title") or title_from_slug(page["slug"]))}</a></h3>
                    <p>{escape(page.get("summary") or "")}</p>
                </article>"""
        )
    return "\n\n".join(cards) + "\n"


def project_cards(pages: list[dict]) -> str:
    items = [p for p in sort_pages(pages) if is_on(p) and show_in_projects(p)]
    if not items:
        return ""
    cards = []
    for page in items:
        cards.append(
            f"""                <div class="project">
                    <h3><a href="{escape(page["href"])}">{escape(page.get("title") or title_from_slug(page["slug"]))}</a></h3>
                    <p>{escape(page.get("summary") or "")}</p>
                </div>"""
        )
    return "\n".join(cards) + "\n"


def timeline_items(pages: list[dict]) -> str:
    items = [p for p in sort_pages(pages) if is_on(p) and show_in_timeline(p)]
    if not items:
        return ""
    cards = []
    for page in items:
        category = escape(page.get("category") or "work")
        title = escape(page.get("timeline_title") or page.get("title") or title_from_slug(page["slug"]))
        summary = escape(page.get("timeline_summary") or page.get("summary") or "")
        year = page.get("year") or ""
        year_html = f'\n                        <span class="timeline-year">{escape(str(year))}</span>' if year else ""
        cards.append(
            f"""                <div class="timeline-item" data-category="{category}">
                    <div class="timeline-marker">
                    </div>
                    <div class="timeline-content">
                        <h3><a href="{escape(page["href"])}" class="timeline-link">{title}</a></h3>{year_html}
                        <p>{summary}</p>
                    </div>
                </div>"""
        )
    return "\n".join(cards) + "\n"


def rewrite_index(sections: dict[str, dict[str, dict]]) -> None:
    pages = flatten(sections)
    html = INDEX_PATH.read_text(encoding="utf-8")
    html = replace_between(html, *MARKERS["blog"], blog_cards(pages))
    html = replace_between(html, *MARKERS["projects"], project_cards(pages))
    INDEX_PATH.write_text(html, encoding="utf-8")


def body_to_html(text: str) -> str:
    chunks = [chunk.strip() for chunk in re.split(r"\n\s*\n", text.strip()) if chunk.strip()]
    if not chunks:
        chunks = [""]
    parts = []
    for chunk in chunks:
        html = escape(chunk).replace("\n", "<br>\n")
        parts.append(f"<p>{html}</p>")
    return "\n\n".join(parts)


def page_template(section: str, title: str, body_html: str) -> str:
    kind = "project-detail" if section == "projects" else "blog-detail"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{escape(title)} - Vaibhav Gurunathan</title>
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
        <article class="{kind}">
            <h2>{escape(title)}</h2>

            <div class="{"project-content" if section == "projects" else "blog-content"}">
{body_html}
            </div>
        </article>
    </main>
    <script src="../assets/js/site-config.js"></script>
    <script src="../assets/js/analytics.js"></script>
</body>
</html>
"""


def slugify(title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return slug[:80] or "post"


def ask(prompt: str, default: str | None = None) -> str:
    suffix = f" [{default}]" if default else ""
    value = input(f"{prompt}{suffix}: ").strip()
    return value or (default or "")


def ask_yes(prompt: str, default: bool = False) -> bool:
    hint = "Y/n" if default else "y/N"
    value = input(f"{prompt} [{hint}]: ").strip().lower()
    if not value:
        return default
    return value in BOOL_TRUE or value in {"y"}


def ask_multiline(prompt: str) -> str:
    print(prompt)
    print("Finish with a line that is only END")
    lines = []
    while True:
        line = input()
        if line.strip() == "END":
            break
        lines.append(line)
    return "\n".join(lines).strip()


def cmd_build() -> None:
    sections = parse_yml(YAML_PATH.read_text(encoding="utf-8")) if YAML_PATH.exists() else {name: {} for name in SECTIONS}
    added = merge_missing(sections, discover_html())
    YAML_PATH.write_text(dump_yml(sections), encoding="utf-8")
    hrefs = hidden_hrefs(sections)
    write_js(hrefs)
    rewrite_index(sections)

    missing = [
        href_for(section, slug)
        for section, items in sections.items()
        for slug in items
        if not (ROOT / section / f"{slug}.html").exists()
    ]
    print(f"Updated {YAML_PATH.relative_to(ROOT)}")
    print(f"Rewrote listings in {INDEX_PATH.name} (sorted by hidden date)")
    print(f"Wrote {JS_PATH.relative_to(ROOT)} ({len(hrefs)} hidden page(s))")
    if added:
        print("Added as off (turn on in pages.yml):")
        for item in added:
            print(f"  - {item}")
    if missing:
        print("YAML entries with no HTML file:")
        for item in missing:
            print(f"  - {item}")


def cmd_new() -> None:
    print("Create a new page")
    section = ask("Section (blog / projects)", "blog").lower()
    if section not in SECTIONS:
        raise SystemExit("Section must be blog or projects")

    title = ask("Title")
    if not title:
        raise SystemExit("Title is required")

    default_slug = slugify(title)
    slug = ask("Filename slug", default_slug) or default_slug
    out = ROOT / section / f"{slug}.html"
    if out.exists():
        raise SystemExit(f"Already exists: {out.relative_to(ROOT)}")

    page_date = ask("Date YYYY-MM-DD (order only, not shown)", date.today().isoformat())
    try:
        datetime.strptime(page_date, "%Y-%m-%d")
    except ValueError:
        raise SystemExit("Date must be YYYY-MM-DD")

    summary = ask("One-line summary for the listing")
    visible = ask_yes("Show on the site now?", False)
    body = ask_multiline("Page text")

    meta = {
        "on": visible,
        "date": page_date,
        "title": title,
        "summary": summary,
    }

    (ROOT / section).mkdir(parents=True, exist_ok=True)
    indented_body = "\n".join(f"                {line}" if line else "" for line in body_to_html(body).splitlines())
    out.write_text(page_template(section, title, indented_body), encoding="utf-8")

    sections = parse_yml(YAML_PATH.read_text(encoding="utf-8")) if YAML_PATH.exists() else {name: {} for name in SECTIONS}
    sections.setdefault(section, {})[slug] = meta
    YAML_PATH.write_text(dump_yml(sections), encoding="utf-8")
    cmd_build()
    print(f"Created {out.relative_to(ROOT)}")
    if not visible:
        print("It is off in pages.yml. Set on: true when you want it listed.")


def main() -> None:
    command = sys.argv[1] if len(sys.argv) > 1 else "build"
    if command in {"build", "apply"}:
        cmd_build()
    elif command == "new":
        cmd_new()
    else:
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
