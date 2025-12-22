# Vaibhav Gurunathan - Personal Website

A modern, interactive personal portfolio website built with HTML, CSS, and JavaScript featuring GitHub integration, dynamic timelines, and comprehensive project showcases.

## 🚀 Features

### **Core Navigation & Design**
- **Tabbed Navigation**: Clean section-based navigation (Home, Experience, Projects, Blog)
- **Dynamic Typing Effect**: Animated welcome text with smooth character-by-character reveal
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Smooth Animations**: Scroll-triggered animations, hover effects, and transitions
- **Progress Bar**: Visual scroll progress indicator

### **GitHub Integration**
- **Repository Display**: Shows latest 6 repositories sorted by most recent commits
- **Language Badges**: Color-coded programming language indicators with authentic GitHub colors
- **Commit Activity Stats**: Real-time statistics for last 24h, 30 days, and 12 months
- **Relative Timestamps**: "Updated X days ago" formatting for repository activity
- **GitHub Pages Compatible**: Graceful fallbacks when API access is restricted

### **Interactive Experience Timeline**
- **Category Filtering**: Filter experiences by Work, Education, Research, or All
- **Expandable Markers**: Click timeline nodes to expand detailed information
- **Visual Timeline**: Gradient line with animated markers and hover effects
- **Smooth Filtering**: Animated transitions when switching between categories

### **Project Showcases**
- **Individual Project Pages**: Dedicated pages for detailed project descriptions
- **Technology Tags**: Language and framework badges for each project
- **Live Demos & Source Code**: Direct links to deployed applications and repositories

### **Blog System**
- **Rich Content**: Support for embedded videos, images, and formatted text
- **Organized Posts**: Chronological blog post listings with previews
- **Video Integration**: YouTube and custom video embedding support

## 📁 Project Structure

```
/
├── index.html                          # Main portfolio page
├── github-data.json                    # Static GitHub repository data (auto-generated)
├── update-github-data.py               # Script to fetch and update GitHub data
├── assets/
│   ├── css/style.css                  # Main stylesheet with animations
│   └── js/script.js                   # JavaScript functionality
├── projects/                           # Individual project pages
│   ├── studystream.html               # AI educational tool
│   ├── music-classifier.html          # ML music genre classifier
│   ├── eduardo.html                   # AR educational guide
│   ├── wordle-solver.html             # Wordle solver algorithm
│   ├── primegpt.html                  # Amazon product chatbot
│   ├── calculator-fpga.html           # FPGA calculator implementation
│   ├── euchre.html                    # C++ card game
│   ├── robot-maze.html                # Autonomous robot navigation
│   └── mlclassifier.html              # Machine learning classifier
├── blog/                              # Blog posts
│   ├── fall-2022.html                 # First semester at UMich
│   ├── winter-2023.html               # Second semester
│   ├── summer-2023.html               # Community college classes
│   ├── fall-2023.html                 # Sophomore year start
│   ├── winter-2024.html               # Progress updates
│   ├── summer-2024.html               # Summer activities
│   ├── fall-2024.html                 # Technical coursework
│   ├── winter-2025.html               # NLP and robotics
│   ├── amazon-internship.html         # Edge AI internship
│   ├── kudan-internship.html          # Robotics software internship
│   ├── fall-2025.html                 # Advanced coursework
│   ├── instructor-assistant.html      # Teaching assistant role
│   ├── stryker-autonomous-stretcher.html # Hospital robotics project
│   ├── underwater-slam-research.html  # Current research project
│   ├── instructor-assistant-winter-2026.html # Future teaching role
│   ├── winter-2026.html               # Upcoming semester
│   ├── expected-graduation.html       # Graduation timeline
│   └── example-video-blog.html        # Video blog example
├── images/
│   └── profile.jpg                    # Profile image
└── README.md                          # This documentation
```

## 🛠️ Customization Guide

### **GitHub Integration Setup**
Your website now uses **hardcoded GitHub data** with **zero API calls**! The data is embedded directly in your JavaScript file.

#### **How It Works:**
- **No API calls** - Data is hardcoded in `assets/js/script.js`
- **Instant loading** - Loads immediately with page
- **Perfect for GitHub Pages** - No CORS issues ever
- **Updates via script** - Run locally to update hardcoded values

#### **To Update Your GitHub Data:**

**Manual Update:**
```bash
# Fetch fresh data and update hardcoded values
python3 update-github-data.py

# This automatically:
# 1. Fetches latest GitHub data
# 2. Updates hardcoded values in assets/js/script.js
# 3. Commits and pushes changes
```

**Automated Updates:**
```bash
# Add to ~/.bashrc or ~/.zshrc for auto-updates:
if [ -f "update-github-data.py" ] && [ -f "index.html" ]; then
    echo "🔄 Updating GitHub data..."
    python3 update-github-data.py
fi
```

#### **Customization:**
To change the GitHub username:
- Edit `update-github-data.py`: Change `GITHUB_USERNAME = 'your-username'`
- Run the script to update with new username's data

**Features included:**
- ✅ **Zero API calls** - Hardcoded data only
- ✅ **Instant loading** - No network requests
- ✅ **GitHub Pages perfect** - No CORS restrictions
- ✅ Latest 6 repositories sorted by recent activity
- ✅ Language badges with authentic GitHub colors
- ✅ Commit activity statistics (24h, 30 days, 12 months)
- ✅ Relative timestamps ("Updated 2 days ago")
- ✅ Automatic git operations (add/commit/push)

### **Timeline Configuration**
The experience timeline supports categorization. To add new experiences:

1. **Add to HTML** in `index.html` within the timeline section:
```html
<div class="timeline-item" data-category="work">
    <div class="timeline-marker"></div>
    <div class="timeline-content">
        <h3><a href="blog/your-experience.html">Your Position</a></h3>
        <span class="timeline-year">Date Range</span>
        <p>Your description here</p>
    </div>
</div>
```

2. **Categories Available:**
   - `work` - Work/internship experiences
   - `education` - Academic experiences
   - `research` - Research projects

### **Contact Information**
Update your contact details in `index.html`:
```html
<p>Contact me at <a href="mailto:your-email@domain.com">your-email@domain.com</a> or connect with me on <a href="https://www.linkedin.com/in/your-profile" target="_blank">LinkedIn</a>.</p>
```

### **Project Images**
Place project images in the `images/` folder. Currently using:
- `profile.jpg` - Your profile photo

**Image Specifications:**
- **Format**: JPG, PNG, or WebP
- **Profile Photo**: Square aspect ratio recommended (300x300px+)

### **Blog Posts**
Add new blog posts by:
1. Creating HTML files in the `blog/` folder
2. Adding entries to the blog section in `index.html`
3. Following the existing post format with title, date, and description

### **Video Embedding**
Embed videos in blog posts and project pages:

**YouTube Videos:**
```html
<div class="video-container">
    <iframe width="560" height="315"
        src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
        title="Video Title"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
    </iframe>
</div>
```

## 🎨 Customization Options

### **Colors & Theme**
The design uses a professional color palette:
- **Primary Gradient**: `#667eea` to `#764ba2`
- **Text Colors**: Professional grays and blues
- **GitHub Colors**: Authentic language color codes

### **Typography**
Using Google Fonts "Poppins" for clean, modern typography.

### **Animation Settings**
- **Typing Speed**: 2ms per character (fast, professional pace)
- **Scroll Animations**: Intersection Observer triggered
- **Hover Effects**: Smooth 0.3s transitions

## 🚀 Deployment

### **GitHub Pages (Recommended)**
1. **Push to GitHub**: Upload all files to a GitHub repository
2. **Enable Pages**: Go to Settings → Pages
3. **Configure**: Select "Deploy from a branch" → Choose main/master branch
4. **Access**: Site available at `https://yourusername.github.io/repository-name`

**GitHub Pages Compatibility**: ✅ Fully compatible with API fallbacks

### **Local Development**
```bash
# Using Python (recommended)
python3 -m http.server 8000
# Visit http://localhost:8000

# Or simply open index.html in browser
open index.html
```

### **Other Hosting Options**
- **Netlify**: Drag & drop deployment
- **Vercel**: Git integration deployment
- **AWS S3**: Static website hosting
- **Traditional Web Hosting**: FTP upload

## 🌐 Browser Support

- **Chrome/Edge**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Mobile Browsers**: iOS Safari, Chrome Mobile

## 📝 Recent Updates

- ✅ **GitHub Integration**: Repository display with language badges and activity stats
- ✅ **Interactive Timeline**: Filterable experience timeline with expandable markers
- ✅ **Commit Statistics**: Activity tracking for 24h, 30 days, and 12 months
- ✅ **GitHub Pages Support**: Graceful API fallbacks for static hosting
- ✅ **Responsive Design**: Optimized for all device sizes

## 🤝 Contributing

This is a personal portfolio website, but feel free to:
- Fork and adapt for your own use
- Submit improvement suggestions
- Use as inspiration for similar projects

## 📄 License

Personal project - no specific license, but attribution appreciated if you use significant portions.
