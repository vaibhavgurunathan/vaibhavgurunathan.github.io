# Blog

Write posts as Markdown in `posts/`. Build with:

```bash
pip install -r requirements.txt          # once
python3 blog.py new "My Post Title"      # scaffold a draft
# edit blog/posts/<slug>.md
python3 blog.py build                    # generate HTML + Blog tab
```

## Front matter

```md
---
title: My Post Title
date: 2026-08-09
summary: Short blurb for the listing page.
draft: true          # optional — omit from the site while drafting
---
```

## Media

1. Drop files in `images/blog/`
2. Reference them from the post:

```md
![Caption](/images/blog/photo.jpg)

{{video:images/blog/clip.mp4}}

{{youtube:VIDEO_ID_OR_URL}}
```

The Blog tab on the homepage appears automatically once the first non-draft post is built.
