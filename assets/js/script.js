const LINKEDIN_URL = 'https://www.linkedin.com/in/vaibhavgurunathan/';

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

function typeGreeting(element, text) {
    return new Promise((resolve) => {
        element.textContent = '';
        element.classList.add('is-greeting', 'type-text');
        let i = 0;
        const tick = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i += 1;
                setTimeout(tick, 18);
            } else {
                element.classList.remove('type-text');
                resolve();
            }
        };
        setTimeout(tick, 280);
    });
}

function fadeInParagraph(element, text, delay) {
    return new Promise((resolve) => {
        element.textContent = text;
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        element.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            setTimeout(resolve, 450);
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

    aboutBody.innerHTML = '';

    for (let i = 0; i < paragraphs.length; i++) {
        const p = document.createElement('p');
        aboutBody.appendChild(p);
        if (i === 0) {
            await typeGreeting(p, paragraphs[i]);
        } else {
            await fadeInParagraph(p, paragraphs[i], 120);
        }
    }

    if (contact) {
        contactLine.innerHTML = formatContactHtml(contact);
        requestAnimationFrame(() => contactLine.classList.add('is-visible'));
    }
}

function switchToTab(tabId) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach((btn) => btn.classList.remove('active'));
    tabContents.forEach((content) => content.classList.remove('active'));

    const targetButton = document.querySelector(`[data-tab="${tabId}"]`);
    const targetContent = document.getElementById(tabId);
    if (targetButton) targetButton.classList.add('active');
    if (targetContent) targetContent.classList.add('active');
}

function switchToHome() {
    switchToTab('home');
    history.replaceState(null, '', '#home');
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.tab-button').forEach((button) => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchToTab(tabId);
            history.replaceState(null, '', `#${tabId}`);
        });
    });

    if (window.location.hash === '#blog' && document.getElementById('blog')) {
        switchToTab('blog');
    }

    loadAboutAndAnimate();
});
