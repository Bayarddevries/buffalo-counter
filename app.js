// ===================================
// Data
// ===================================

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
let ticking = false;
let promptHidden = false;

// ===================================
// DOM refs
// ===================================
const $year = document.getElementById('counterYear');
const $pop = document.getElementById('counterValue');
const $status = document.getElementById('counterStatus');
const $fill = document.getElementById('timelineFill');
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
        $fill.style.width = Math.min(100, Math.max(0, (1 - progress) * 100)) + '%';
    }
}

// ===================================
// Scroll interpolation & active card
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

    let activeCard = null;
    let interpolatedYear = currentYear;

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

        interpolatedYear = topYear + clampedProgress * (bottomYear - topYear);
        activeCard = clampedProgress < 0.5 ? topCard : bottomCard;
    } else if (topCard) {
        interpolatedYear = parseInt(topCard.dataset.year, 10);
        activeCard = topCard;
    } else if (bottomCard) {
        interpolatedYear = parseInt(bottomCard.dataset.year, 10);
        activeCard = bottomCard;
    }

    // Update counter display
    updateFromYear(interpolatedYear);

    // Update active card visual state
    $cards.forEach(c => c.classList.remove('active'));
    if (activeCard) activeCard.classList.add('active');

    // Hide scroll prompt on first interaction
    if (!promptHidden && $prompt) {
        $prompt.style.display = 'none';
        promptHidden = true;
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
    updateFromYear(1800);
    // Set initial active card
    if ($cards.length > 0) $cards[0].classList.add('active');
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
