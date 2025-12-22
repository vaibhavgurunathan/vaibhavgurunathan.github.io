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
        contactLine.innerHTML = 'Contact me at gvaibhav@umich.edu or connect with me on <a href="https://www.linkedin.com/in/vaibhavgurunathan/" target="_blank" class="linkedin-link">LinkedIn</a>. See more about my work here: <a href="https://github.com/vaibhavgurunathan" target="_blank" class="github-link">GitHub</a>.';
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
