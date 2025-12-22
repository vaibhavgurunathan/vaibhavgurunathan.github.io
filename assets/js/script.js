// Scroll Progress Bar functionality
function updateScrollProgress() {
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;

    scrollProgressBar.style.width = scrollPercent + '%';
}

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.project, .blog-post').forEach(el => {
        observer.observe(el);
    });

    // Add typing effect to home page text elements in sequence
    const typeTextElements = document.querySelectorAll('.type-text');
    const contactLine = document.querySelector('.contact-line');

    let currentIndex = 0;

    const typeNextElement = () => {
        if (currentIndex < typeTextElements.length) {
            const element = typeTextElements[currentIndex];
            const text = element.textContent;
            const delay = parseInt(element.getAttribute('data-delay')) || 500;

            element.textContent = '';
            element.style.opacity = '0';

            setTimeout(() => {
                element.style.opacity = '1';
                let i = 0;
                const typeWriter = () => {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                        setTimeout(typeWriter, 2); // 5x faster typing speed (~300 WPM)
                    } else {
                        currentIndex++;
                        // Start typing the contact line after the main text is done
                        if (currentIndex === typeTextElements.length && contactLine) {
                            setTimeout(() => {
                                typeContactLine();
                            }, 500); // Small delay before starting contact line
                        }
                    }
                };
                typeWriter();
            }, delay);
        }
    };

    const typeContactLine = () => {
        // Set the contact line HTML content with proper links
        contactLine.innerHTML = 'Contact me at gvaibhav@umich.edu or connect with me on <a href="https://www.linkedin.com/in/vaibhavgurunathan/" target="_blank" class="linkedin-link">LinkedIn</a>.';
        contactLine.style.opacity = '1';

        // Show profile image after contact line appears
        const profileImage = document.querySelector('.profile-image');
        if (profileImage) {
            setTimeout(() => {
                profileImage.style.display = 'block';
                profileImage.style.opacity = '0';
                profileImage.style.animation = 'fadeIn 1s ease-in-out forwards';
            }, 500);
        }
    };

    // Start the typing sequence
    typeNextElement();

    // Initialize scroll progress bar
    updateScrollProgress();
});

// Add scroll event listener for progress bar
window.addEventListener('scroll', updateScrollProgress);

// Function to switch to home tab
function switchToHome() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Remove active class from all buttons and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to home button and content
    const homeButton = document.querySelector('[data-tab="home"]');
    if (homeButton) {
        homeButton.classList.add('active');
    }
    const homeContent = document.getElementById('home');
    if (homeContent) {
        homeContent.classList.add('active');
    }
}

// Function to switch to a specific tab
function switchToTab(tabId) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Remove active class from all buttons and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to specified button and content
    const targetButton = document.querySelector(`[data-tab="${tabId}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// Function to scroll to a specific blog post
function scrollToPost(postHref) {
    setTimeout(() => {
        const postLink = document.querySelector(`a[href="${postHref}"]`);
        if (postLink) {
            const postElement = postLink.closest('.blog-post');
            if (postElement) {
                postElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                // Add highlight effect
                postElement.style.transition = 'all 0.3s ease';
                postElement.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.5)';
                setTimeout(() => {
                    postElement.style.boxShadow = '';
                }, 2000);
            }
        }
    }, 100); // Small delay to ensure DOM is updated
}

// GitHub Integration
async function fetchGitHubData() {
    const username = 'vaibhavgurunathan'; // Replace with your GitHub username
    const reposContainer = document.getElementById('github-repos');
    const contributionGraph = document.getElementById('contribution-graph');

    // Set a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
        // Fetch user repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        clearTimeout(timeoutId);

        if (!reposResponse.ok) {
            throw new Error(`GitHub API error: ${reposResponse.status}`);
        }

        const repos = await reposResponse.json();

        // Display repositories
        reposContainer.innerHTML = repos.map(repo => `
            <div class="github-repo-card">
                <div class="github-repo-title">
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </div>
                <div class="github-repo-description">
                    ${repo.description || 'No description available'}
                </div>
                <div class="github-repo-stats">
                    <div class="github-repo-stat">
                        <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                        </svg>
                        ${repo.stargazers_count}
                    </div>
                    <div class="github-repo-stat">
                        <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0 2.25 2.25 0 001.5 0z"/>
                            <path fill-rule="evenodd" d="M6.75 0A.75.75 0 016 0a6 6 0 00-6 6c0 1.993.759 3.841 2.009 5.233a.75.75 0 001.14-.746A4.5 4.5 0 011.5 6c0-2.49 2.01-4.5 4.5-4.5A4.5 4.5 0 0110.5 6c0 .886-.257 1.73-.693 2.474a.75.75 0 001.073.918A6.001 6.001 0 0012 6a6 6 0 00-6-6z"/>
                        </svg>
                        ${repo.forks_count}
                    </div>
                    <div class="github-repo-stat">
                        ${repo.language || 'N/A'}
                    </div>
                </div>
            </div>
        `).join('');

        // Load contribution graph
        contributionGraph.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p>View my full contribution graph on <a href="https://github.com/${username}" target="_blank">GitHub</a></p>
                <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=transparent&hide_border=true" alt="GitHub stats" style="max-width: 100%; border-radius: 8px;" loading="lazy">
            </div>
        `;

    } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error fetching GitHub data:', error);

        // Show fallback content for GitHub Pages
        reposContainer.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #7f8c8d;">
                <p>🔗 <a href="https://github.com/${username}?tab=repositories" target="_blank" style="color: #667eea; text-decoration: none; font-weight: 500;">View my repositories on GitHub</a></p>
                <p style="font-size: 0.9em; margin-top: 10px;">API access limited on static hosting</p>
            </div>
        `;

        contributionGraph.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p>📊 <a href="https://github.com/${username}" target="_blank" style="color: #667eea; text-decoration: none; font-weight: 500;">View my GitHub profile</a></p>
                <p style="font-size: 0.9em; color: #7f8c8d; margin-top: 10px;">For contribution graphs and stats</p>
            </div>
        `;
    }
}

// Timeline Filtering and Expansion
function initializeTimelineFeatures() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineMarkers = document.querySelectorAll('.timeline-marker');

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter timeline items
            timelineItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.classList.remove('filtered-out');
                } else {
                    item.classList.add('filtered-out');
                }
            });
        });
    });

    // Timeline marker expansion
    timelineMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const timelineItem = marker.closest('.timeline-item');
            const isExpanded = timelineItem.classList.contains('expanded');

            // Close all expanded items
            document.querySelectorAll('.timeline-item.expanded').forEach(item => {
                item.classList.remove('expanded');
                item.querySelector('.timeline-marker').classList.remove('expanded');
            });

            // Toggle current item
            if (!isExpanded) {
                timelineItem.classList.add('expanded');
                marker.classList.add('expanded');
            }
        });
    });
}

// Initialize features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...

    // Initialize GitHub data loading
    if (document.getElementById('github-repos')) {
        fetchGitHubData();
    }

    // Initialize timeline features
    if (document.querySelector('.timeline-filters')) {
        initializeTimelineFeatures();
    }
});
