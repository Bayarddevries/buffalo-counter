// ===================================
// Data
// ===================================

// Authoritative population data
const DATA_POINTS = [
    { year: 1800, pop: 30000000 },
    { year: 1850, pop: 20000000 },
    { year: 1865, pop: 13500000 },
    { year: 1870, pop: 5500000 },
    { year: 1880, pop: 395000 },
    { year: 1889, pop: 653 },
    { year: 1900, pop: 500 },
];

const EVENT_YEARS = [1800, 1825, 1850, 1865, 1870, 1880, 1889, 1900];

const STATUS = {
    green: 'Population stable',
    declining: 'Population declining',
    warning: 'At risk',
    critical: 'Near extinction',
    extinct: 'Functionally extinct',
};

// ===================================
// State
// ===================================
let currentYear = 1800;
let currentPop = 30000000;
let activeCardIndex = 0;
let ticking = false;

// ===================================
// DOM refs
// ===================================
const $year = document.getElementById('counterYear');
const $pop = document.getElementById('counterValue');
const $status = document.getElementById('counterStatus');
const $fill = document.getElementById('timelineFill');
const $dots = document.getElementById('timelineDots');
const $prompt = document.getElementById('scrollPrompt');
const $cards = document.querySelectorAll('.card[data-year]');
const $section = document.getElementById('cardsSection');

// ===================================
// Utility
// ===================================
function formatNumber(n) {
    try { return n.toLocaleString('en-US'); }
    catch { return String(n); }
}

function interpolatePop(year) {
    if (year <= DATA_POINTS[0].year) return DATA_POINTS[0].pop;
    if (year >= DATA_POINTS[DATA_POINTS.length - 1].year) return DATA_POINTS[DATA_POINTS.length - 1].pop;

    for (let i = 0; i < DATA_POINTS.length - 1; i++) {
        if (year >= DATA_POINTS[i].year && year <= DATA_POINTS[i + 1].year) {
            if (year === DATA_POINTS[i].year) return DATA_POINTS[i].pop;
            if (year === DATA_POINTS[i + 1].year) return DATA_POINTS[i + 1].pop;
            const t = (year - DATA_POINTS[i].year) / (DATA_POINTS[i + 1].year - DATA_POINTS[i].year);
            return Math.round(DATA_POINTS[i].pop + t * (DATA_POINTS[i + 1].pop - DATA_POINTS[i].pop));
        }
    }
    return 0;
}

function getStatus(pop) {
    if (pop < 1000) return 'extinct';
    if (pop < 100000) return 'critical';
    if (pop < 1000000) return 'warning';
    if (pop < 10000000) return 'declining';
    return 'green';
}

// ===================================
// Timeline dots
// ===================================
function createTimelineDots() {
    if (!$dots) return;
    $dots.innerHTML = '';
    EVENT_YEARS.forEach((year, i) => {
        const dot = document.createElement('div');
        dot.className = 'timeline-dot' + (i === 0 ? ' active' : '');
        dot.dataset.index = i;
        $dots.appendChild(dot);
    });
}

// ===================================
// Update display from year
// ===================================
function updateFromYear(year) {
    currentYear = Math.round(year);
    currentPop = interpolatePop(currentYear);

    if ($year) $year.textContent = currentYear;
    if ($pop) $pop.textContent = formatNumber(currentPop);

    const st = getStatus(currentPop);
    if ($pop) {
        $pop.className = 'counter-value';
        if (st === 'extinct' || st === 'critical') $pop.classList.add('critical');
        else if (st === 'warning') $pop.classList.add('declining');
        else if (st === 'declining') $pop.classList.add('warning');
    }

    if ($status) $status.textContent = STATUS[st];

    if ($fill) {
        const progress = (currentYear - 1800) / (1900 - 1800);
        $fill.style.width = Math.min(100, Math.max(0, progress * 100)) + '%';
    }

    if ($dots) {
        const dots = $dots.querySelectorAll('.timeline-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', currentYear >= EVENT_YEARS[i]);
        });
    }
}

// ===================================
// Card activation via IntersectionObserver
// ===================================
function setupCardObserver() {
    if (!$section || $cards.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const card = entry.target;
            const year = parseInt(card.dataset.year, 10);

            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                card.classList.add('active');
                updateFromYear(year);
                if ($prompt) $prompt.style.display = 'none';
            } else {
                card.classList.remove('active');
            }
        });
    }, {
        root: $section,
        threshold: 0.5,
    });

    $cards.forEach(card => observer.observe(card));
}

// ===================================
// Smooth counter interpolation during scroll
// ===================================
function setupScrollInterpolation() {
    if (!$section) return;
    $section.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateFromScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function updateFromScroll() {
    const sectionRect = $section.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const sectionHeight = sectionRect.height;
    const viewportCenter = sectionTop + sectionHeight / 2;

    let topCard = null;
    let bottomCard = null;

    $cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        if (cardCenter <= viewportCenter) {
            if (!topCard || rect.top > topCard.getBoundingClientRect().top) {
                topCard = card;
            }
        }
        if (cardCenter > viewportCenter) {
            if (!bottomCard || rect.top < bottomCard.getBoundingClientRect().top) {
                bottomCard = card;
            }
        }
    });

    if (topCard && bottomCard) {
        const topYear = parseInt(topCard.dataset.year, 10);
        const bottomYear = parseInt(bottomCard.dataset.year, 10);
        const topRect = topCard.getBoundingClientRect();
        const botRect = bottomCard.getBoundingClientRect();

        const topCenter = topRect.top + topRect.height / 2;
        const botCenter = botRect.top + botRect.height / 2;
        const range = botCenter - topCenter;
        const progress = range > 0 ? (viewportCenter - topCenter) / range : 0;
        const clampedProgress = Math.max(0, Math.min(1, progress));

        const interpolatedYear = topYear + clampedProgress * (bottomYear - topYear);
        updateFromYear(interpolatedYear);
    } else if (topCard) {
        updateFromYear(parseInt(topCard.dataset.year, 10));
    } else if (bottomCard) {
        updateFromYear(parseInt(bottomCard.dataset.year, 10));
    }
}

// ===================================
// Splash
// ===================================
function setupSplash() {
    const splash = document.getElementById('splash');
    const btn = document.getElementById('splashEnter');
    if (!splash || !btn) return;

    btn.addEventListener('click', () => {
        splash.classList.add('hidden');
        splash.addEventListener('transitionend', () => {
            if (splash.parentNode) splash.remove();
        }, { once: true });
        setTimeout(() => { if (splash.parentNode) splash.remove(); }, 600);
    });
}

// ===================================
// Sources toggle
// ===================================
function setupSources() {
    const toggle = document.getElementById('sourcesToggle');
    const panel = document.getElementById('sourcesPanel');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        if (expanded) panel.setAttribute('hidden', '');
        else panel.removeAttribute('hidden');
    });

    panel.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggle.setAttribute('aria-expanded', 'false');
            panel.setAttribute('hidden', '');
            toggle.focus();
        }
    });
}

// ===================================
// Citation Toast Logic
// ===================================
function setupCitationToast() {
    const toast = document.createElement('div');
    toast.className = 'citation-toast';
    document.body.appendChild(toast);

    let toastTimeout;

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('cite')) {
            e.preventDefault();
            const source = e.target.getAttribute('data-source');
            
            toast.textContent = source;
            toast.classList.add('visible');

            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.remove('visible');
            }, 4000);
        }
    });
}

// ===================================
// Init
// ===================================
function init() {
    createTimelineDots();
    updateFromYear(1800);
    setupCardObserver();
    setupScrollInterpolation();
    setupSplash();
    setupSources();
    setupCitationToast();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
