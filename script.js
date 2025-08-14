// Mobile menu toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const isClickInsideMenu = navMenu.contains(e.target);
    const isClickOnToggle = mobileMenu.contains(e.target);
    
    if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Modern navbar scroll effects
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Initialize all navigation functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor, index) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                // Close mobile menu first if open
                const mobileMenu = document.getElementById('mobile-menu');
                const navMenu = document.querySelector('.nav-menu');
                if (mobileMenu && navMenu && navMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    navMenu.classList.remove('active');
                    
                    // Small delay to allow menu close animation
                    setTimeout(() => {
                        scrollToTarget(target);
                    }, 150);
                } else {
                    scrollToTarget(target);
                }
            }
        }, { passive: false });
    });
    
    function scrollToTarget(target) {
        // Dynamic offset based on screen size
        const isMobile = window.innerWidth <= 768;
        const offset = isMobile ? 105 : 125; // Mobile: navbar(65) + ticker(40), Desktop: navbar(85) + ticker(40)
        const offsetTop = target.offsetTop - offset;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavigation() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 255)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Initial call
});

// Fallback scroll function for direct onclick handlers
function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        // Dynamic offset based on screen size
        const isMobile = window.innerWidth <= 768;
        const offset = isMobile ? 105 : 125; // Mobile: navbar(65) + ticker(40), Desktop: navbar(85) + ticker(40)
        const offsetTop = target.offsetTop - offset;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.querySelector('.nav-menu');
        if (mobileMenu && navMenu) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            .notification-close:hover {
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .feature-list li');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// Button click animations
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        // Add ripple animation if it doesn't exist
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                .btn {
                    position: relative;
                    overflow: hidden;
                }
            `;
            document.head.appendChild(style);
        }
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Close notifications
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }
});

// Performance optimization: Throttle scroll events
let ticking = false;

function updateScrollEffects() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = '#ffffff';
        navbar.style.backdropFilter = 'none';
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});

// Sports betting specific features
function updateLiveOdds() {
    // Simulate live odds updates
    const oddsElements = document.querySelectorAll('.odds');
    oddsElements.forEach(element => {
        const currentOdds = parseFloat(element.textContent.replace('@', ''));
        const variation = (Math.random() - 0.5) * 0.1; // Small random variation
        const newOdds = Math.max(1.1, currentOdds + variation).toFixed(2);
        element.textContent = `@${newOdds}`;
    });
}

// Update odds every 30 seconds to simulate live betting
setInterval(updateLiveOdds, 30000);

// Simulate ticker content duplication for infinite scroll if needed
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.ticker-track');
    if (track && track.children.length > 0) {
        track.innerHTML = track.innerHTML + track.innerHTML; // duplicate items
    }
});

// Chart interactions
document.addEventListener('DOMContentLoaded', () => {
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach(bar => {
        bar.addEventListener('click', () => {
            const month = bar.dataset.month;
            const value = bar.dataset.value;
            showNotification(`📊 ${month}: ${value} win rate - Click for detailed analysis`, 'info');
        });
    });
});

// Tip card interactions
document.addEventListener('DOMContentLoaded', () => {
    const tipCards = document.querySelectorAll('.tip-card');
    tipCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger on button clicks
            if (e.target.tagName === 'BUTTON') return;
            
            card.classList.toggle('expanded');
            const analysis = card.querySelector('.analysis');
            if (analysis) {
                analysis.style.maxHeight = card.classList.contains('expanded') ? 'none' : '3em';
            }
        });
    });
});

// Tips filtering and sorting
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('tipsGrid');
    if (!grid) return;

    const chips = document.querySelectorAll('.chip');
    const sortSelect = document.getElementById('tipsSort');

    function applyFilter() {
        const activeChip = document.querySelector('.chip.active');
        const filter = activeChip ? activeChip.getAttribute('data-filter') : 'all';
        const cards = Array.from(grid.querySelectorAll('.tip-card'));
        cards.forEach(card => {
            const status = card.getAttribute('data-status');
            const conf = parseInt(card.getAttribute('data-confidence') || '0', 10);
            const ev = parseInt(card.getAttribute('data-ev') || '0', 10);
            let show = true;
            if (filter === 'high') show = conf >= 80;
            else if (filter === 'value') show = ev >= 8;
            else if (filter === 'live') show = status === 'live';
            else if (filter === 'upcoming') show = status === 'upcoming';
            card.style.display = show ? '' : 'none';
        });
    }

    function applySort() {
        const value = sortSelect ? sortSelect.value : 'confidence';
        const cards = Array.from(grid.querySelectorAll('.tip-card'));
        const visibleCards = cards.filter(c => c.style.display !== 'none');
        visibleCards.sort((a, b) => {
            if (value === 'confidence') {
                return (parseInt(b.dataset.confidence||'0',10) - parseInt(a.dataset.confidence||'0',10));
            } else if (value === 'odds') {
                return (parseFloat(b.dataset.odds||'0') - parseFloat(a.dataset.odds||'0'));
            } else if (value === 'time') {
                return (a.dataset.time||'').localeCompare(b.dataset.time||'');
            }
            return 0;
        });
        visibleCards.forEach(card => grid.appendChild(card));
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            applyFilter();
            applySort();
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            applyFilter();
            applySort();
        });
    }

    // Initialize
    applyFilter();
    applySort();
});

// Copy betslip mock
document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.textContent.includes('Copy') || btn.getAttribute('data-translate') === 'ctaCopyBetslip') {
        try {
            navigator.clipboard.writeText('Over 2.5 Goals @1.92 - Manchester United vs Liverpool');
            showNotification('notifWelcome', 'success');
        } catch (err) {
            showNotification('notifFillAllFields', 'error');
        }
    }
});

// Responsible gambling reminders
function showResponsibleGamblingReminder() {
    const lastReminder = localStorage.getItem('lastGamblingReminder');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (!lastReminder || (now - parseInt(lastReminder)) > oneDay) {
        setTimeout(() => {
            showNotification('⚠️ Remember: Only bet what you can afford to lose. Gambling should be fun, not stressful.', 'info');
            localStorage.setItem('lastGamblingReminder', now.toString());
        }, 10000); // Show after 10 seconds
    }
}

// Call responsible gambling reminder
showResponsibleGamblingReminder();

// VIP and Telegram button handlers
document.addEventListener('DOMContentLoaded', () => {
    // VIP Access button
    const vipButtons = Array.from(document.querySelectorAll('button')).filter(btn => btn.textContent.includes('VIP'));
    vipButtons.forEach(button => {
        button.addEventListener('click', () => {
            showNotification('notifVIPComingSoon', 'info');
        });
    });

    // Telegram button
    const telegramButtons = Array.from(document.querySelectorAll('button')).filter(btn => btn.textContent.includes('Telegram'));
    telegramButtons.forEach(button => {
        button.addEventListener('click', () => {
            showNotification('notifTelegramComingSoon', 'info');
        });
    });

    // Hero action buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (button.textContent.includes('Today\'s Tips')) {
                document.getElementById('tips').scrollIntoView({ behavior: 'smooth' });
            } else if (button.textContent.includes('Track Record')) {
                document.getElementById('stats').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Helper function to find buttons by text content
function addButtonListeners() {
    // VIP Access buttons
    document.querySelectorAll('button').forEach(button => {
        if (button.textContent.includes('VIP Access')) {
            button.addEventListener('click', () => {
                showNotification('🏆 VIP membership includes exclusive tips, detailed analysis, and priority support. Coming soon!', 'info');
            });
        }
        
        if (button.textContent.includes('Telegram')) {
            button.addEventListener('click', () => {
                showNotification('💬 Our Telegram channel will provide instant notifications for live tips and breaking news. Subscribe to our email for launch updates!', 'info');
            });
        }
    });
}

// Call button listeners setup
document.addEventListener('DOMContentLoaded', addButtonListeners);

// Live status updates
function updateTipStatuses() {
    const statusElements = document.querySelectorAll('.status');
    statusElements.forEach(status => {
        if (status.textContent.includes('LIVE')) {
            // Simulate live game updates
            const outcomes = ['🟢 WINNING', '🟡 LIVE', '🔴 LOSING'];
            const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
            status.textContent = randomOutcome;
            
            // Update styling based on status
            status.className = 'status';
            if (randomOutcome.includes('WINNING')) {
                status.classList.add('winning');
            } else if (randomOutcome.includes('LOSING')) {
                status.classList.add('losing');
            } else {
                status.classList.add('pending');
            }
        }
    });
}

// Update statuses every 2 minutes
setInterval(updateTipStatuses, 120000);

// Language switcher functionality
document.addEventListener('DOMContentLoaded', () => {
    // Ensure translations are initialized even if script load order changes
    if (typeof initializeLanguage === 'function') {
        initializeLanguage();
    } else {
        // Fallback: default to English and try again shortly
        document.documentElement.lang = 'en';
        setTimeout(() => { if (typeof initializeLanguage === 'function') initializeLanguage(); }, 0);
    }
    
    // Language switcher
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        if (typeof getCurrentLanguage === 'function') {
            languageSelect.value = getCurrentLanguage();
        }
        languageSelect.addEventListener('change', (e) => {
            if (typeof setLanguage === 'function') setLanguage(e.target.value);
        });
    }
});

// Cookie consent banner
document.addEventListener('DOMContentLoaded', () => {
    const cookieBanner = document.querySelector('.cookie-banner');
    const acceptButton = document.querySelector('.cookie-accept');
    if (cookieBanner) {
        const consent = localStorage.getItem('cookie-consent');
        if (consent !== 'accepted') {
            setTimeout(() => cookieBanner.classList.add('show'), 600);
        }
        if (acceptButton) {
            acceptButton.addEventListener('click', () => {
                localStorage.setItem('cookie-consent', 'accepted');
                cookieBanner.classList.remove('show');
                showNotification('notifWelcome', 'success');
            });
        }
    }
});

// League cards hover animation
document.addEventListener('DOMContentLoaded', () => {
    const leagueCards = document.querySelectorAll('.league-card');
    leagueCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Update notification messages to use translations
function showNotification(messageKey, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Get translated message
    const message = (typeof getTranslation === 'function') ? (getTranslation(messageKey) || messageKey) : messageKey;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Update form handlers to use translations
const subscriptionFormUpdated = document.getElementById('subscriptionForm');
if (subscriptionFormUpdated) {
    subscriptionFormUpdated.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        
        if (!isValidEmail(email)) {
            showNotification('notifValidEmail', 'error');
            return;
        }
        
        showNotification('notifWelcome', 'success');
        this.reset();
    });
}

// Console welcome message
console.log(`
⚽ Welcome to SportsTips Pro! (Bun venit la SportsTips Pro!)
🏆 Your trusted source for football betting tips and analysis.
📊 Features: Live matches, expert predictions, multilingual support.
📱 Fully responsive and optimized for all devices.
🌐 Ready for Netlify deployment!

🎯 Bet responsibly and good luck with your predictions!
`);
