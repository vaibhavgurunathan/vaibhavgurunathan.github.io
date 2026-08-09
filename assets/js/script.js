// Scroll Progress Bar functionality
function updateScrollProgress() {
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;

    scrollProgressBar.style.width = scrollPercent + '%';
}

document.addEventListener('DOMContentLoaded', function() {
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
    };

    // Start the typing sequence
    typeNextElement();

    // Initialize scroll progress bar
    updateScrollProgress();
});

// Add scroll event listener for progress bar
window.addEventListener('scroll', updateScrollProgress);
