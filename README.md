# Vaibhav Gurunathan - Personal Website

A modern, responsive personal portfolio website built with HTML, CSS, and JavaScript.

## Features

- **Tabbed Navigation**: Clean section-based navigation
- **Dynamic Typing Effect**: Animated welcome text
- **Dark Mode Toggle**: Theme switching with local storage
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Scroll-triggered animations and hover effects
- **Individual Project Pages**: Detailed project showcases
- **Contact Integration**: Direct links to email and LinkedIn

## Project Structure

```
/
├── index.html                 # Main portfolio page
├── assets/
│   ├── css/style.css         # Main stylesheet
│   └── js/script.js          # JavaScript functionality
├── projects/                  # Individual project pages
│   ├── ecommerce.html
│   ├── weather.html
│   ├── taskmanager.html
│   ├── mlclassifier.html
│   ├── portfolio.html
│   └── chat.html
├── blog/                      # Blog pages
│   └── welcome.html
├── images/                    # Project images
│   ├── ecommerce.jpg
│   ├── weather.jpg
│   ├── taskmanager.jpg
│   ├── mlclassifier.jpg
│   ├── portfolio.jpg
│   └── chat.jpg
└── README.md                  # This file
```

## Adding Images

### Project Card Images
Place your project images in the `images/` folder with these naming conventions:

- `ecommerce.jpg` - E-Commerce Platform
- `weather.jpg` - Weather Dashboard
- `taskmanager.jpg` - Task Management App
- `mlclassifier.jpg` - Machine Learning Image Classifier
- `portfolio.jpg` - Portfolio Website
- `chat.jpg` - Chat Application

**Image Specifications:**
- **Size**: 600x400px or larger (will be cropped to fit)
- **Format**: JPG, PNG, or WebP
- **Aspect Ratio**: 3:2 works best

If an image doesn't exist, it will be hidden gracefully without breaking the layout.

### Customizing Content

#### 1. Update Contact Information
Edit `index.html`:
```html
<a href="mailto:your-email@example.com" class="contact-link email-link">
<a href="https://www.linkedin.com/in/your-profile" target="_blank" class="contact-link linkedin-link">
```

#### 2. Modify Resume Section
Edit the resume content in `index.html` within the `#resume` tab:
```html
<h3>Education</h3>
<p>Your education details</p>

<h3>Experience</h3>
<p>Your work experience</p>

<h3>Skills</h3>
<ul>
    <li>Your skills</li>
</ul>
```

#### 3. Add Blog Posts
Create new blog files in the `blog/` folder following the pattern of `welcome.html`, then add links to `index.html`.

#### 4. Add Videos to Posts
You can embed videos in both blog posts and project pages:

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

**Example Files:**
- `blog/example-video-blog.html` - Blog post with video
- `projects/example-video-project.html` - Project page with video

#### 5. Customize Project Details
Edit individual project pages in the `projects/` folder to update:
- Project descriptions
- Technical details
- Links to live demos and source code

## Customization Options

### Colors
The design uses a clean color palette. To customize:
- Primary blue: `#667eea`
- Secondary blue: `#764ba2`
- Text colors: Various grays defined in CSS

### Fonts
Currently using Google Fonts "Poppins". Change in `assets/css/style.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Your-Font:wght@300;400;500;600;700&display=swap');
```

### Animations
- **Typing Speed**: Modify in `assets/js/script.js` (currently 20ms per character)
- **Hover Effects**: Adjust in `assets/css/style.css`
- **Scroll Animations**: Intersection Observer settings in JavaScript

## Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select main branch as source

The site is fully static and GitHub Pages compatible.

### Local Development
```bash
# Open index.html in your browser
open index.html
```

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers

## Contributing

This is a personal website, but feel free to fork and customize for your own use!

## License

Personal project - feel free to use as inspiration for your own portfolio.
