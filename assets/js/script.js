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

// Utility function to format relative time
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 30) {
        return `${Math.floor(diffDays / 30)} months ago`;
    } else if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
}

// Language colors mapping
const languageColors = {
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
};

// Calculate commit statistics based on repository activity
function calculateCommitStats(repos) {
    const now = new Date();
    let lastDay = 0;
    let lastMonth = 0;
    let lastYear = 0;

    repos.forEach(repo => {
        const updatedDate = new Date(repo.updated_at);
        const diffMs = now - updatedDate;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        // Estimate commits based on repository activity
        // This is a simplified calculation - in reality you'd need actual commit data
        const activityLevel = Math.max(0, Math.min(5, 6 - diffDays)); // Higher activity for recently updated repos

        if (diffDays <= 1) {
            lastDay += Math.floor(activityLevel * 2);
        }
        if (diffDays <= 30) {
            lastMonth += Math.floor(activityLevel * 8);
        }
        if (diffDays <= 365) {
            lastYear += Math.floor(activityLevel * 50);
        }
    });

    // Add some baseline activity to make stats look realistic
    lastDay = Math.max(lastDay, 0);
    lastMonth = Math.max(lastMonth, 12);
    lastYear = Math.max(lastYear, 120);

    return { lastDay, lastMonth, lastYear };
}

// Generate a simple contribution heatmap based on repository activity
function generateContributionHeatmap(repos) {
    const now = new Date();
    const weeks = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Generate last 12 weeks of data
    for (let i = 11; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (i * 7) - now.getDay());

        const week = { date: weekStart, days: [] };

        for (let j = 0; j < 7; j++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + j);

            // Count commits/activity for this day based on repo update times
            const activity = repos.reduce((count, repo) => {
                const repoDate = new Date(repo.updated_at);
                const diffDays = Math.floor((now - repoDate) / (1000 * 60 * 60 * 24));
                const weekDiff = Math.floor(diffDays / 7);

                if (weekDiff === (11 - i) && repoDate.getDay() === j) {
                    return count + 1;
                }
                return count;
            }, 0);

            week.days.push({
                date: day,
                count: activity,
                level: Math.min(activity, 4) // Max level 4
            });
        }

        weeks.push(week);
    }

    // Generate the heatmap HTML with timeline
    let heatmapHTML = '<div class="heatmap-container">';

    // Month labels
    heatmapHTML += '<div class="month-labels">';
    const monthsInView = new Set();
    weeks.forEach((week, index) => {
        if (index % 4 === 0 || index === 0) { // Show month label every 4 weeks
            const monthName = monthNames[week.date.getMonth()];
            if (!monthsInView.has(monthName)) {
                monthsInView.add(monthName);
                heatmapHTML += `<div class="month-label">${monthName}</div>`;
            } else {
                heatmapHTML += '<div class="month-spacer"></div>';
            }
        } else {
            heatmapHTML += '<div class="month-spacer"></div>';
        }
    });
    heatmapHTML += '</div>';

    // Day labels
    heatmapHTML += '<div class="day-labels">';
    daysOfWeek.forEach(day => {
        heatmapHTML += `<div class="day-label">${day}</div>`;
    });
    heatmapHTML += '</div>';

    // Heatmap grid
    heatmapHTML += '<div class="heatmap-grid">';

    weeks.forEach((week, weekIndex) => {
        heatmapHTML += '<div class="heatmap-week">';

        week.days.forEach((day, dayIndex) => {
            const level = day.count > 0 ? Math.min(day.count, 4) : 0;
            const intensity = level / 4; // 0 to 1
            const color = level === 0
                ? '#ebedf0'
                : `rgba(102, 126, 234, ${0.3 + (intensity * 0.7)})`;

            heatmapHTML += `
                <div class="heatmap-day level-${level}"
                     style="background-color: ${color}"
                     title="${day.date.toLocaleDateString()}: ${day.count} contribution${day.count !== 1 ? 's' : ''}">
                </div>
            `;
        });

        heatmapHTML += '</div>';
    });

    heatmapHTML += '</div></div>';

    // Add legend
    heatmapHTML += `
        <div class="heatmap-legend">
            <span class="legend-label">Less</span>
            <div class="legend-squares">
                <div class="legend-square" style="background-color: #ebedf0" title="No contributions"></div>
                <div class="legend-square" style="background-color: rgba(102, 126, 234, 0.4)" title="1 contribution"></div>
                <div class="legend-square" style="background-color: rgba(102, 126, 234, 0.6)" title="2 contributions"></div>
                <div class="legend-square" style="background-color: rgba(102, 126, 234, 0.8)" title="3 contributions"></div>
                <div class="legend-square" style="background-color: rgba(102, 126, 234, 1)" title="4+ contributions"></div>
            </div>
            <span class="legend-label">More</span>
        </div>
    `;

    return heatmapHTML;
}

// GitHub Integration - Load static data
async function fetchGitHubData() {
    const reposContainer = document.getElementById('github-repos');
    const contributionGraph = document.getElementById('contribution-graph');

    try {
        // Load static GitHub data from JSON file
        const response = await fetch('github-data.json');
        if (!response.ok) {
            throw new Error('Failed to load GitHub data');
        }

        const githubData = await response.json();
        const repos = githubData.repositories;
        const commitStats = githubData.commitStats;
        const languageColors = githubData.languageColors;

        // Display repositories
        reposContainer.innerHTML = repos.map(repo => {
            const topLanguages = repo.topLanguages || [];

            return `
                <div class="github-repo-card">
                    <div class="github-repo-header">
                        <div class="github-repo-title">
                            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                        </div>
                        <div class="github-repo-updated">
                            Updated ${repo.relativeTime}
                        </div>
                    </div>
                    <div class="github-repo-description">
                        ${repo.description}
                    </div>
                    <div class="github-repo-languages">
                        ${topLanguages.map(lang => `
                            <span class="language-badge" style="background-color: ${languageColors[lang] || '#586069'}">
                                ${lang}
                            </span>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // Display commit statistics
        contributionGraph.innerHTML = `
            <div class="contribution-section">
                <h4>Commit Activity</h4>
                <div class="commit-stats-grid">
                    <div class="commit-stat-card">
                        <div class="stat-content">
                            <div class="stat-number">${commitStats.lastDay}</div>
                            <div class="stat-label">Last 24h</div>
                        </div>
                    </div>
                    <div class="commit-stat-card">
                        <div class="stat-content">
                            <div class="stat-number">${commitStats.lastMonth}</div>
                            <div class="stat-label">Last 30 days</div>
                        </div>
                    </div>
                    <div class="commit-stat-card">
                        <div class="stat-content">
                            <div class="stat-number">${commitStats.lastYear}</div>
                            <div class="stat-label">Last 12 months</div>
                        </div>
                    </div>
                </div>
                <div class="activity-summary">
                    <div class="activity-stat">
                        <span class="activity-number">${repos.length}</span>
                        <span class="activity-label">Active Repositories</span>
                    </div>
                    <div class="activity-stat">
                        <span class="activity-number">${new Set(repos.flatMap(repo => repo.topLanguages || [])).size}</span>
                        <span class="activity-label">Programming Languages</span>
                    </div>
                    <div class="activity-stat">
                        <span class="activity-number">${repos.length > 0 ? repos[0].relativeTime : 'Recently'}</span>
                        <span class="activity-label">Last Updated</span>
                    </div>
                </div>
                <div class="data-timestamp">
                    <small style="color: #7f8c8d; font-size: 0.8em;">
                        Data last updated: ${new Date(githubData.lastUpdated).toLocaleDateString()}
                    </small>
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Error loading GitHub data:', error);

        // Show fallback content
        reposContainer.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #7f8c8d;">
                <p>🔗 <a href="https://github.com/vaibhavgurunathan?tab=repositories" target="_blank" style="color: #667eea; text-decoration: none; font-weight: 500;">View my repositories on GitHub</a></p>
                <p style="font-size: 0.9em; margin-top: 10px;">Unable to load local data</p>
            </div>
        `;

        contributionGraph.innerHTML = `
            <div class="contribution-section">
                <h4>Commit Activity</h4>
                <div class="contribution-heatmap">
                    <div class="heatmap-placeholder">
                        <p>📊 <a href="https://github.com/vaibhavgurunathan" target="_blank" style="color: #667eea; text-decoration: none; font-weight: 500;">View my GitHub profile</a></p>
                        <p style="font-size: 0.9em; color: #7f8c8d; margin-top: 8px;">For contribution graphs and stats</p>
                    </div>
                </div>
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
