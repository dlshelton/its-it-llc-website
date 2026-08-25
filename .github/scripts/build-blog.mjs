import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const POSTS_DIR = 'blog/_posts';
const OUTPUT_DIR = 'blog';
const BLOG_INDEX = 'blog.html';

function nav(prefix) {
    const p = prefix;
    return `
    <div class="client-portal-overlay" id="clientPortalOverlay"></div>
    <aside class="client-portal-sidebar" id="clientPortalSidebar">
        <div class="client-portal-header">
            <img src="${p}assets/logos/ItsITLogo9_11_19.png" alt="IT's IT Solutions">
            <button class="client-portal-close" id="clientPortalClose" aria-label="Close client portal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <h3>CLIENT PORTAL</h3>
        <nav class="client-portal-nav">
            <a href="https://itsitllc.ITClientPortal.com/" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Client Account Access
            </a>
            <a href="https://helpit.screenconnect.com/" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                Remote Help
            </a>
            <a href="https://itsitllc.connectboosterportal.com/" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                Pay Invoice
            </a>
            <a href="https://store.itsitllc.com/" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Store
            </a>
            <a href="https://phones.itsitllc.com/login" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Phone Web Portal
            </a>
            <a href="https://app.inkyphishfence.com/user-settings/summary" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                Spam Filter
            </a>
            <a href="https://itsitllc.itglue.com/" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                IT Glue
            </a>
        </nav>
    </aside>

    <button class="client-portal-toggle" id="clientPortalToggle" aria-label="Open client portal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Client Portal</span>
    </button>

    <header id="header">
        <nav class="navbar">
            <div class="logo">
                <a href="${p}index.html">
                    <img src="${p}assets/logos/ItsITLogo9_11_19.png" alt="IT's IT Solutions">
                </a>
            </div>
            <ul class="nav-links" id="navLinks">
                <li>
                    <a href="${p}services.html">Services <span class="dropdown-icon">▼</span></a>
                    <div class="mega-menu">
                        <div class="mega-menu-grid">
                            <a href="${p}service-managed-it.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-shield"></use></svg></div><div class="content"><h4>Managed IT Services</h4><p>Complete IT management and monitoring 24/7/365</p></div></a>
                            <a href="${p}service-cybersecurity.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-lock"></use></svg></div><div class="content"><h4>Cybersecurity</h4><p>Protect your business from threats and breaches</p></div></a>
                            <a href="${p}service-network-engineering.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-network"></use></svg></div><div class="content"><h4>Network Engineering</h4><p>Design and maintain your business networks</p></div></a>
                            <a href="${p}service-help-desk.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-headset"></use></svg></div><div class="content"><h4>Help Desk &amp; Remote Support</h4><p>Fast, responsive IT troubleshooting</p></div></a>
                            <a href="${p}service-disaster-recovery.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-cloud-backup"></use></svg></div><div class="content"><h4>Disaster Recovery &amp; Backups</h4><p>Keep your data safe and recoverable</p></div></a>
                            <a href="${p}service-it-consulting.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-lightbulb"></use></svg></div><div class="content"><h4>IT Consulting</h4><p>Strategic technology guidance for growth</p></div></a>
                            <a href="${p}service-cio-cto.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-executive"></use></svg></div><div class="content"><h4>On-Demand CIO/CTO</h4><p>Executive-level IT leadership on demand</p></div></a>
                            <a href="${p}service-telecommunications.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-phone"></use></svg></div><div class="content"><h4>Telecommunications</h4><p>Phone systems and communication solutions</p></div></a>
                            <a href="${p}service-ai-consulting.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-ai-consulting"></use></svg></div><div class="content"><h4>AI Consulting &amp; Strategy</h4><p>AI readiness assessments and roadmaps</p></div></a>
                            <a href="${p}service-managed-ai.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-managed-ai"></use></svg></div><div class="content"><h4>Managed AI Services</h4><p>AI deployment, training, and optimization</p></div></a>
                        </div>
                    </div>
                </li>
                <li>
                    <a href="${p}industries.html">Industries <span class="dropdown-icon">▼</span></a>
                    <div class="mega-menu">
                        <div class="mega-menu-grid industries-grid">
                            <a href="${p}industry-healthcare.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-healthcare"></use></svg></div><div class="content"><h4>Healthcare &amp; Medical</h4></div></a>
                            <a href="${p}industry-legal.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-legal"></use></svg></div><div class="content"><h4>Legal &amp; Law Firms</h4></div></a>
                            <a href="${p}industry-financial.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-financial"></use></svg></div><div class="content"><h4>Financial Services</h4></div></a>
                            <a href="${p}industry-manufacturing.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-manufacturing"></use></svg></div><div class="content"><h4>Manufacturing</h4></div></a>
                            <a href="${p}industry-construction.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-construction"></use></svg></div><div class="content"><h4>Construction</h4></div></a>
                            <a href="${p}industry-nonprofit.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-nonprofit"></use></svg></div><div class="content"><h4>Non-Profit</h4></div></a>
                            <a href="${p}industry-retail.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-retail"></use></svg></div><div class="content"><h4>Retail &amp; Hospitality</h4></div></a>
                            <a href="${p}industry-realestate.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-realestate"></use></svg></div><div class="content"><h4>Real Estate</h4></div></a>
                            <a href="${p}industry-professional.html" class="mega-menu-item"><div class="mega-menu-icon"><svg><use href="${p}assets/icons/icons.svg#icon-professional"></use></svg></div><div class="content"><h4>Professional Services</h4></div></a>
                        </div>
                    </div>
                </li>
                <li>
                    <a href="${p}about.html">About <span class="dropdown-icon">▼</span></a>
                    <div class="dropdown-menu">
                        <a href="${p}about.html#our-story">Our Story</a>
                        <a href="${p}about.html#mission-vision">Mission &amp; Vision</a>
                        <a href="${p}about.html#team">Our Team</a>
                        <a href="${p}about.html#partners">Partners</a>
                        <a href="${p}terms.html">Terms of Service</a>
                    </div>
                </li>
                <li><a href="${p}blog.html">Blog</a></li>
                <li><a href="${p}contact.html">Contact</a></li>
            </ul>
            <div class="nav-cta">
                <a href="tel:239-935-9891" class="nav-phone">
                    <span class="nav-phone-icon"><svg><use href="${p}assets/icons/icons.svg#icon-phone"></use></svg></span>
                    <span>239-935-9891</span>
                </a>
                <a href="${p}contact.html" class="btn btn-primary">Get Started</a>
            </div>
            <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle menu">
                <span></span><span></span><span></span>
            </button>
        </nav>
    </header>`;
}

function footer(prefix) {
    const p = prefix;
    return `
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-column footer-brand">
                    <img src="${p}assets/logos/ItsITLogo9_11_19.png" alt="IT's IT Solutions" class="footer-logo">
                    <p>Your Dedicated IT Department. Proactive. Predictable. Built for Growth.</p>
                    <div class="social-links">
                        <a href="https://www.facebook.com/ItsITLLC" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="social-icon"><svg><use href="${p}assets/icons/icons.svg#icon-facebook"></use></svg></a>
                        <a href="https://www.linkedin.com/company/it's-it-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="social-icon"><svg><use href="${p}assets/icons/icons.svg#icon-linkedin"></use></svg></a>
                    </div>
                </div>
                <div class="footer-column">
                    <h4>Services</h4>
                    <ul class="footer-links">
                        <li><a href="${p}service-managed-it.html">Managed IT</a></li>
                        <li><a href="${p}service-cybersecurity.html">Cybersecurity</a></li>
                        <li><a href="${p}service-network-engineering.html">Network Engineering</a></li>
                        <li><a href="${p}service-ai-consulting.html">AI Consulting</a></li>
                        <li><a href="${p}service-managed-ai.html">Managed AI</a></li>
                        <li><a href="${p}services.html">All Services</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Industries</h4>
                    <ul class="footer-links">
                        <li><a href="${p}industry-healthcare.html">Healthcare</a></li>
                        <li><a href="${p}industry-legal.html">Legal</a></li>
                        <li><a href="${p}industry-financial.html">Financial Services</a></li>
                        <li><a href="${p}industry-manufacturing.html">Manufacturing</a></li>
                        <li><a href="${p}industries.html">All Industries</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Contact</h4>
                    <ul class="footer-links">
                        <li><a href="tel:239-935-9891">239-935-9891</a></li>
                        <li><a href="mailto:GetStarted@ItsITLLC.com">GetStarted@ItsITLLC.com</a></li>
                        <li>2503 Del Prado Blvd S<br>Suite 405<br>Cape Coral, FL 33904</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} IT's IT LLC. All rights reserved.</p>
                <div class="footer-bottom-links">
                    <a href="${p}privacy.html">Privacy Policy</a>
                    <a href="${p}terms.html">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>`;
}

function formatDate(dateInput) {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function isoDate(dateInput) {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return d.toISOString().split('T')[0];
}

function downloadCard(post) {
    if (!post.download_file) return '';
    const title = post.download_title || 'Download Free Guide';
    const desc = post.download_description || '';
    return `
                <div class="blog-download-section" id="downloadSection">
                    <div class="blog-download-card">
                        <div class="blog-download-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="12" y1="18" x2="12" y2="12"></line>
                                <polyline points="9 15 12 18 15 15"></polyline>
                            </svg>
                        </div>
                        <h3>${title}</h3>
                        <p>${desc}</p>
                        <button class="btn btn-primary blog-download-btn" id="downloadBtn" type="button">
                            Download Free Guide <span class="arrow">&rarr;</span>
                        </button>
                    </div>
                </div>`;
}

function downloadModal(post) {
    if (!post.download_file) return '';
    const fileName = path.basename(post.download_file);
    const downloadName = 'ItsIT-' + fileName;
    const filePath = post.download_file.startsWith('/') ? post.download_file.substring(1) : post.download_file;
    const relativePath = filePath.startsWith('blog/') ? filePath.replace('blog/', '') : filePath;
    const title = post.download_title || 'Download Free Guide';
    return `
    <div class="blog-download-modal-overlay" id="downloadModal">
        <div class="blog-download-modal">
            <button class="blog-download-modal-close" id="downloadModalClose" type="button" aria-label="Close">&times;</button>
            <h3>Get Your Free Guide</h3>
            <p>Fill out the form below and your download will begin immediately.</p>
            <form id="downloadForm" action="https://formspree.io/f/mvznbpwl" method="POST" data-download-file="${relativePath}" data-download-name="${downloadName}">
                <input type="hidden" name="_subject" value="Blog Download: ${title}">
                <input type="hidden" name="_source" value="blog-${post.slug}-download">
                <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">
                <div class="blog-form-group">
                    <label for="dl-name">Full Name <span class="required">*</span></label>
                    <input type="text" id="dl-name" name="name" required placeholder="John Smith">
                </div>
                <div class="blog-form-group">
                    <label for="dl-email">Business Email <span class="required">*</span></label>
                    <input type="email" id="dl-email" name="email" required placeholder="john@company.com">
                </div>
                <div class="blog-form-group">
                    <label for="dl-company">Company Name</label>
                    <input type="text" id="dl-company" name="company" placeholder="Company Name">
                </div>
                <div class="blog-form-group">
                    <label for="dl-phone">Phone Number</label>
                    <input type="tel" id="dl-phone" name="phone" placeholder="(239) 555-1234">
                </div>
                <button type="submit" class="btn btn-primary blog-download-submit">
                    <span class="btn-text">Download Guide</span>
                    <span class="btn-loading" style="display:none;">Sending...</span>
                </button>
            </form>
        </div>
    </div>`;
}


function generatePostHtml(post) {
    const p = '../';
    const cats = (Array.isArray(post.categories) ? post.categories : [post.categories || 'Technology'])
        .map(c => `<span class="blog-category-tag">${c}</span>`).join('\n                ');

    const heroHtml = post.featured_image
        ? `\n                <div class="blog-hero-image">\n                    <img src="${post.featured_image.startsWith('/') ? '..' + post.featured_image : post.featured_image}" alt="${post.image_alt || ''}" fetchpriority="high" decoding="async">\n                </div>\n`
        : '';

    const ogImage = post.featured_image
        ? `https://www.itsitllc.com${post.featured_image.startsWith('/') ? post.featured_image : '/' + post.featured_image}`
        : 'https://www.itsitllc.com/assets/logos/ItsITLogo9_11_19.png';

    const shortDesc = (post.description || '').substring(0, 160);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://*.searchatlas.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.searchatlas.com https://formspree.io; font-src 'self'; frame-ancestors 'none';">
    <meta name="description" content="${shortDesc}">
    <meta name="author" content="${post.author || 'Dennis Shelton'}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${shortDesc}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:url" content="https://www.itsitllc.com/blog/${post.slug}.html">
    <meta property="og:site_name" content="IT's IT Solutions">
    <meta property="article:published_time" content="${isoDate(post.date)}">
    <meta property="article:author" content="${post.author || 'Dennis Shelton'}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${post.title}">
    <meta name="twitter:description" content="${shortDesc}">
    <meta name="twitter:image" content="${ogImage}">
    <title>${post.title} | IT's IT Solutions</title>
    <link rel="canonical" href="https://www.itsitllc.com/blog/${post.slug}.html">
    <link rel="stylesheet" href="${p}css/styles.css?v=38">
    <link rel="stylesheet" href="${p}css/icons.css?v=6">
    <link rel="icon" type="image/png" href="${p}assets/logos/ItsITLogo9_11_19.png">
    <script nowprocket nitro-exclude type="text/javascript" id="sa-dynamic-optimization" data-uuid="f29bf1a5-4de2-4f9e-bfb5-71be68c7e5cd" src="https://dashboard.searchatlas.com/scripts/dynamic_optimization.js"></script>
</head>
<body>
${nav(p)}

    <main>
    <section class="page-header">
        <div class="container">
            <nav class="breadcrumb" aria-label="Breadcrumb">
                <a href="${p}index.html">Home</a>
                <span class="breadcrumb-separator">/</span>
                <a href="${p}blog.html">Blog</a>
                <span class="breadcrumb-separator">/</span>
                <span>${post.title.length > 40 ? post.title.substring(0, 40) + '...' : post.title}</span>
            </nav>
            <h1>${post.title}</h1>
            <div class="blog-meta">
                <span class="blog-meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"></circle><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path></svg>
                    ${post.author || 'Dennis Shelton'}
                </span>
                <span class="blog-meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    ${formatDate(post.date)}
                </span>
                <span class="blog-meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    ${post.read_time || '5 min read'}
                </span>
                ${cats}
            </div>
        </div>
    </section>

    <article class="blog-article">
        <div class="container">
            <div class="blog-content">
${heroHtml}
                ${post.bodyHtml}

${downloadCard(post)}

                <div class="blog-cta-section">
                    <h2>Ready to Get Started?</h2>
                    <p>Contact IT's IT today to schedule a complimentary technology review for your business.</p>
                    <a href="https://outlook.office.com/book/DennisLSheltonJRITsITLLC@itsitllc.onmicrosoft.com/s/lXet7rXd30CNtkkvJQq7xQ2?ismsaljsauthenabled" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                        Schedule Your Free Assessment <span class="arrow">&rarr;</span>
                    </a>
                </div>

            </div>
        </div>
    </article>
    </main>

${downloadModal(post)}

${footer(p)}

    <script src="${p}js/main.js"></script>
</body>
</html>`;
}

function generateIndexHtml(posts) {
    const p = '';
    const cards = posts.map(post => {
        const cats = (Array.isArray(post.categories) ? post.categories : [post.categories || 'Technology'])
            .map(c => `<span class="blog-card-tag">${c}</span>`).join('');
        const imgSrc = post.featured_image
            ? (post.featured_image.startsWith('/') ? post.featured_image.substring(1) : post.featured_image)
            : 'assets/Photos/networking/wallmountsmb.jpeg';
        const badge = post.download_file ? '<span class="blog-card-badge">Free Download</span>' : '';
        return `
                <a href="blog/${post.slug}.html" class="blog-card">
                    <div class="blog-card-image">
                        <img src="${imgSrc}" alt="${post.image_alt || post.title}" loading="lazy" decoding="async">
                        ${badge}
                    </div>
                    <div class="blog-card-content">
                        <div class="blog-card-tags">${cats}</div>
                        <h2>${post.title}</h2>
                        <p>${post.description || ''}</p>
                        <div class="blog-card-meta">
                            <span>${post.author || 'Dennis Shelton'}</span>
                            <span>${formatDate(post.date)}</span>
                            <span>${post.read_time || '5 min read'}</span>
                        </div>
                    </div>
                </a>`;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://*.searchatlas.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.searchatlas.com https://formspree.io; font-src 'self'; frame-ancestors 'none';">
    <meta name="description" content="IT's IT LLC Blog - Technology insights, cybersecurity tips, business continuity strategies, and IT best practices for Southwest Florida businesses.">
    <meta property="og:type" content="website">
    <meta property="og:title" content="IT's IT Blog - Technology Insights for Southwest Florida Businesses">
    <meta property="og:description" content="Technology insights, cybersecurity tips, business continuity strategies, and IT best practices for Southwest Florida businesses.">
    <meta property="og:image" content="https://www.itsitllc.com/assets/logos/ItsITLogo9_11_19.png">
    <meta property="og:url" content="https://www.itsitllc.com/blog.html">
    <meta property="og:site_name" content="IT's IT Solutions">
    <title>Blog | IT's IT Solutions</title>
    <link rel="canonical" href="https://www.itsitllc.com/blog.html">
    <link rel="stylesheet" href="css/styles.css?v=38">
    <link rel="stylesheet" href="css/icons.css?v=6">
    <link rel="icon" type="image/png" href="assets/logos/ItsITLogo9_11_19.png">
    <script nowprocket nitro-exclude type="text/javascript" id="sa-dynamic-optimization" data-uuid="f29bf1a5-4de2-4f9e-bfb5-71be68c7e5cd" src="https://dashboard.searchatlas.com/scripts/dynamic_optimization.js"></script>
</head>
<body>
${nav(p)}

    <main>
    <section class="page-header">
        <div class="container">
            <h1>IT's IT Blog</h1>
            <p>Technology insights, cybersecurity tips, and business continuity strategies for Southwest Florida businesses.</p>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="blog-grid">
${cards}
            </div>
        </div>
    </section>
    </main>

${footer(p)}

    <script src="js/main.js"></script>
</body>
</html>`;
}

// --- Main ---

if (!fs.existsSync(POSTS_DIR)) {
    console.log('No _posts directory found. Nothing to build.');
    process.exit(0);
}

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
if (files.length === 0) {
    console.log('No markdown posts found.');
    process.exit(0);
}

const posts = files.map(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const slug = file.replace('.md', '');
    const bodyHtml = marked(content);
    return { ...data, slug, bodyHtml };
}).sort((a, b) => new Date(b.date) - new Date(a.date));

console.log(`Building ${posts.length} blog post(s)...`);

posts.forEach(post => {
    const outPath = path.join(OUTPUT_DIR, `${post.slug}.html`);
    fs.writeFileSync(outPath, generatePostHtml(post));
    console.log(`  -> ${outPath}`);
});

fs.writeFileSync(BLOG_INDEX, generateIndexHtml(posts));
console.log(`  -> ${BLOG_INDEX}`);

console.log('Blog build complete.');
