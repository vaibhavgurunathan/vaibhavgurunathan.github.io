const LINKEDIN_URL = 'https://www.linkedin.com/in/vaibhavgurunathan/';

// Scroll Progress Bar functionality
function updateScrollProgress() {
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;

    scrollProgressBar.style.width = scrollPercent + '%';
}

function unwrapParagraph(text) {
    return text.replace(/\s*\n\s*/g, ' ').trim();
}

function parseAboutText(raw) {
    const parts = raw
        .trim()
        .split(/\n\s*\n/)
        .map(unwrapParagraph)
        .filter(Boolean);

    if (parts.length === 0) {
        return { paragraphs: [], contact: '' };
    }

    if (parts.length === 1) {
        return { paragraphs: parts, contact: '' };
    }

    return {
        paragraphs: parts.slice(0, -1),
        contact: parts[parts.length - 1]
    };
}

function renderMarkdownLinks(text) {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
        const isMailto = href.startsWith('mailto:');
        const attrs = isMailto
            ? `href="${href}"`
            : `href="${href}" target="_blank" rel="noopener noreferrer"`;
        return `<a ${attrs}>${label}</a>`;
    });
}

function formatContactHtml(contactText) {
    let html = renderMarkdownLinks(contactText);
    html = html.replace(
        /(?<!["'>])LinkedIn(?!<\/a>)/g,
        `<a href="${LINKEDIN_URL}" target="_blank" rel="noopener noreferrer" class="linkedin-link">LinkedIn</a>`
    );
    return html;
}

function typeText(element, text, delay) {
    return new Promise((resolve) => {
        element.textContent = '';
        element.classList.add('type-text');
        element.style.opacity = '0';

        setTimeout(() => {
            element.style.opacity = '1';
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 2);
                } else {
                    element.classList.remove('type-text');
                    resolve();
                }
            };
            typeWriter();
        }, delay);
    });
}

async function loadAboutAndAnimate() {
    const aboutBody = document.getElementById('about-body');
    const contactLine = document.querySelector('.contact-line');
    if (!aboutBody || !contactLine) return;

    let paragraphs = [];
    let contact = '';

    try {
        const response = await fetch('about.md');
        if (!response.ok) throw new Error('Failed to load about.md');
        ({ paragraphs, contact } = parseAboutText(await response.text()));
    } catch (err) {
        console.error(err);
        paragraphs = ['Unable to load about text.'];
    }

    const delay = parseInt(aboutBody.getAttribute('data-delay'), 10) || 500;
    aboutBody.innerHTML = '';

    for (let i = 0; i < paragraphs.length; i++) {
        const p = document.createElement('p');
        aboutBody.appendChild(p);
        await typeText(p, paragraphs[i], i === 0 ? delay : 200);
    }

    if (contact) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        contactLine.innerHTML = formatContactHtml(contact);
        contactLine.style.opacity = '1';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadAboutAndAnimate();
    updateScrollProgress();
});

window.addEventListener('scroll', updateScrollProgress);
