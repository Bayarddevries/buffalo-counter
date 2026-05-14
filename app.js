/**
 * The Buffalo Counter - Main Application
 * Option D layout with scroll-snap event cards
 * Schedule-driven animation, log-linear population model
 */

// ===================================
// Constants
// ===================================

const CONFIG = {
    START_YEAR: 1800,
    END_YEAR: 1900,
    SPEED_MS: { slow: 3000, normal: 2000, fast: 500 },
    DEFAULT_SPEED: 'normal',
    CARD_INTERVAL: 8000, // ms between event card activations
};

const POP_POINTS = [
    { y: 1800, p: 30000000 },
    { y: 1850, p: 20000000 },
    { y: 1865, p: 13500000 },
    { y: 1870, p: 5500000 },
    { y: 1880, p: 395000 },
    { y: 1889, p: 653 },
    { y: 1900, p: 500 },
];

const EVENTS = [
    { year: 1830, title: 'The Hide Trade Begins',   source: 'Isenberg, 2000', index: 0 },
    { year: 1860, title: 'Railroads Reach the Plains', source: 'Brown, 1970', index: 1 },
    { year: 1870, title: 'The Great Collapse',       source: 'Flores, 2016; Peterson, 1985', index: 2 },
    { year: 1874, title: 'US Army Campaigns',        source: 'Congressional Globe, 1874', index: 3 },
    { year: 1883, title: 'The Last of the Herds',    source: 'Hornaday, 1889', index: 4 },
];

// Schedule: animation time (ms) -> year
const SCHEDULE = [{ time: 0, year: CONFIG.START_YEAR }];
EVENTS.forEach((evt) => {
    SCHEDULE.push({ time: (evt.index + 1) * CONFIG.CARD_INTERVAL, year: evt.year });
});
SCHEDULE.push({ time: EVENTS.length * CONFIG.CARD_INTERVAL, year: CONFIG.END_YEAR });
const TOTAL_DURATION = SCHEDULE[SCHEDULE.length - 1].time;

// ===================================
// State
// ===================================

let isPlaying = false;
let animStart = 0;
let pausedMs = 0;
let rafId = null;
let speed = CONFIG.DEFAULT_SPEED;
let activeSet = new Set();
let lastScrollIdx = -1;

// DOM cache
const E = {};

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function cache() {
    E.counterNum   = $('.counter-num');
    E.yearValue    = $('#yearValue');
    E.tlFill       = $('#tlFill');
    E.tlDots       = $('#tlDots');
    E.tlBar        = $('#timeline');
    E.playBtn      = $('#playBtn');
    E.resetBtn     = $('#resetBtn');
    E.statusDot    = $('#statusDot');
    E.statusText   = $('#statusText');
    E.snap         = $('#eventsSnap');
    E.counterFixed = $('#counterFixed');
}

// ===================================
// Math helpers
// ===================================

function getPop(year) {
    year = Math.max(CONFIG.START_YEAR, Math.min(CONFIG.END_YEAR, year));
    for (let i = 0; i < POP_POINTS.length - 1; i++) {
        if (year >= POP_POINTS[i].y && year <= POP_POINTS[i+1].y) {
            const t = (year - POP_POINTS[i].y) / (POP_POINTS[i+1].y - POP_POINTS[i].y);
            const lp = Math.log(POP_POINTS[i].p) + t * (Math.log(POP_POINTS[i+1].p) - Math.log(POP_POINTS[i].p));
            return Math.max(500, Math.round(Math.exp(lp)));
        }
    }
    return year <= POP_POINTS[0].y ? POP_POINTS[0].p : POP_POINTS[POP_POINTS.length-1].p;
}

function yearAtTime(ms) {
    for (let i = 0; i < SCHEDULE.length - 1; i++) {
        if (ms >= SCHEDULE[i].time && ms <= SCHEDULE[i+1].time) {
            const t = (ms - SCHEDULE[i].time) / (SCHEDULE[i+1].time - SCHEDULE[i].time);
            return SCHEDULE[i].year + (SCHEDULE[i+1].year - SCHEDULE[i].year) * t;
        }
    }
    return CONFIG.END_YEAR;
}

function progress(year) {
    return (year - CONFIG.START_YEAR) / (CONFIG.END_YEAR - CONFIG.START_YEAR);
}

// ===================================
// Render
// ===================================

function render(year) {
    const pop = getPop(year);
    const yr  = Math.round(year);
    const p   = progress(year);

    if (E.yearValue)  E.yearValue.textContent = yr;
    if (E.counterNum) E.counterNum.textContent = pop.toLocaleString('en-US');
    if (E.tlFill)     E.tlFill.style.width = (p * 100) + '%';

    // status colours
    E.statusDot.classList.remove('warning','critical');
    E.counterNum?.parentElement?.classList?.remove('warning','critical');
    if (p > 0.6) {
        E.statusDot.classList.add('critical');
        E.counterNum?.parentElement?.classList?.add('critical');
        E.statusText.textContent = 'Critical decline';
    } else if (p > 0.35) {
        E.statusDot.classList.add('warning');
        E.counterNum?.parentElement?.classList?.add('warning');
        E.statusText.textContent = 'Population declining';
    } else {
        E.statusText.textContent = 'Population stable';
    }

    // timeline dots
    $$(' .tl-dot').forEach(d => {
        const dy = +d.dataset.year;
        d.classList.remove('passed','active');
        if (dy < yr) d.classList.add('passed');
        else if (dy === yr) d.classList.add('active');
    });

    // card activation (one-way: once active stays active)
    $$('.event-card').forEach(c => {
        const idx = +c.dataset.index;
        if (yr >= EVENTS[idx]?.year && !activeSet.has(idx)) {
            activeSet.add(idx);
            c.classList.add('active');
        }
    });

    // auto-scroll to latest active card during playback
    let latest = -1;
    activeSet.forEach(i => { if (i > latest) latest = i; });
    if (latest >= 0 && latest !== lastScrollIdx && E.snap) {
        lastScrollIdx = latest;
        const card = $$(`.event-card[data-index="${latest}"]`)[0];
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===================================
// Timeline dots
// ===================================

function buildDots() {
    if (!E.tlDots) return;
    E.tlDots.innerHTML = '';
    EVENTS.forEach(evt => {
        const pct = ((evt.year - CONFIG.START_YEAR) / (CONFIG.END_YEAR - CONFIG.START_YEAR)) * 100;
        const dot = document.createElement('button');
        dot.className = 'tl-dot';
        dot.style.left = pct + '%';
        dot.dataset.year = evt.year;
        dot.setAttribute('aria-label', evt.year + ': ' + evt.title);
        dot.addEventListener('click', (e) => { e.stopPropagation(); jump(evt.year); });
        E.tlDots.appendChild(dot);
    });
}

// ===================================
// Playback
// ===================================

function tick(ts) {
    if (!animStart) animStart = ts;
    const elapsed = ts - animStart + pausedMs;

    if (elapsed >= TOTAL_DURATION) {
        render(CONFIG.END_YEAR);
        EVENTS.forEach(e => {
            if (!activeSet.has(e.index)) {
                activeSet.add(e.index);
                const c = $(`.event-card[data-index="${e.index}"]`);
                if (c) c.classList.add('active');
            }
        });
        stop();
        return;
    }

    render(yearAtTime(elapsed));
    rafId = requestAnimationFrame(tick);
}

function play() {
    if (isPlaying) return;
    isPlaying = true;
    animStart = 0;
    pausedMs = 0;
    rafId = null;
    lastScrollIdx = -1;
    E.playBtn.classList.add('playing');
    E.playBtn.querySelector('.btn-icon').textContent = '❚❚';
    E.playBtn.querySelector('.btn-text').textContent = 'Pause';
    rafId = requestAnimationFrame(tick);
}

function stop() {
    isPlaying = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    pausedMs += (animStart ? performance.now() - animStart : 0);
    animStart = 0;
    E.playBtn.classList.remove('playing');
    E.playBtn.querySelector('.btn-icon').textContent = '▶';
    E.playBtn.querySelector('.btn-text').textContent = 'Play';
}

function toggle() {
    if (pausedMs >= TOTAL_DURATION) { reset(); return play(); }
    if (isPlaying) stop(); else play();
}

function reset() {
    stop();
    pausedMs = 0;
    animStart = 0;
    activeSet.clear();
    lastScrollIdx = -1;
    $$('.event-card').forEach(c => c.classList.remove('active'));
    render(CONFIG.START_YEAR);
    if (E.snap) E.snap.scrollTo({ top: 0, behavior: 'instant' });
}

function jump(year) {
    stop();
    const frac = (year - CONFIG.START_YEAR) / (CONFIG.END_YEAR - CONFIG.START_YEAR);
    pausedMs = frac * TOTAL_DURATION;
    EVENTS.forEach(e => { if (year >= e.year) activeSet.add(e.index); });
    lastScrollIdx = -5; // force re-scroll on next play
    render(year);
}

// ===================================
// Timeline drag
// ===================================

function yearFromX(cx) {
    const r = E.tlBar.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (cx - r.left) / r.width));
    return Math.round(CONFIG.START_YEAR + p * (CONFIG.END_YEAR - CONFIG.START_YEAR));
}

let dragging = false;

function dragStart(e) {
    dragging = true;
    if (isPlaying) stop();
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    e.preventDefault();
}
function dragMove(e) { if (dragging) jump(yearFromX(e.clientX)); }
function dragEnd()  { dragging = false; document.removeEventListener('mousemove', dragMove); document.removeEventListener('mouseup', dragEnd); }

function touchStart() {
    dragging = true;
    if (isPlaying) stop();
    document.addEventListener('touchmove', touchMove, { passive: true });
    document.addEventListener('touchend', touchEnd);
}
function touchMove(e) {
    if (!dragging) return;
    const t = e.touches[0];
    const r = E.tlBar.getBoundingClientRect();
    if (t.clientY >= r.top - 50 && t.clientY <= r.bottom + 100) jump(yearFromX(t.clientX));
}
function touchEnd() { dragging = false; document.removeEventListener('touchmove', touchMove); document.removeEventListener('touchend', touchEnd); }

// ===================================
// Header height -> set CSS var for card offset
// ===================================

function updateHeaderOffset() {
    if (E.counterFixed && E.snap) {
        E.snap.style.setProperty('--header-height', E.counterFixed.offsetHeight + 'px');
    }
}

// ===================================
// Speed buttons
// ===================================

function setupSpeed() {
    $$('.speed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.speed-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-checked','false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-checked','true');
            speed = btn.dataset.speed;
        });
    });
}

// ===================================
// Sources toggle
// ===================================

function setupSources() {
    const toggle = $('#sourcesToggle');
    const panel  = $('#sourcesPanel');
    if (!toggle || !panel) return;
    toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        open ? panel.setAttribute('hidden','') : panel.removeAttribute('hidden');
    });
}

// ===================================
// Splash
// ===================================

function setupSplash() {
    const splash = $('#splash');
    const enter  = $('#splashEnter');
    if (!splash || !enter) return;
    enter.addEventListener('click', () => {
        // Track removal so transitionend and rAF fallback can't both fire
        let removed = false;
        function removeSplash() {
            if (removed) return;
            removed = true;
            splash.remove();
        }
        // Primary: transitionend when CSS transition finishes
        splash.addEventListener('transitionend', removeSplash, { once: true });
        // Fallback: rAF + delay for browsers that don't fire transitionend
        requestAnimationFrame(() => {
            setTimeout(removeSplash, 650);
        });
        splash.classList.add('hidden');
    });
}

// ===================================
// Keyboard
// ===================================

function setupKeys() {
    document.addEventListener('keydown', (e) => {
        if (document.activeElement.tagName === 'BUTTON' || document.activeElement.tagName === 'INPUT') return;
        const step = e.shiftKey ? 10 : 1;
        switch (e.key) {
            case ' ': e.preventDefault(); toggle(); break;
            case 'r': case 'R': reset(); break;
        }
    });

    // Timeline keyboard
    if (E.tlBar) {
        E.tlBar.addEventListener('keydown', (e) => {
            const step = e.shiftKey ? 10 : 1;
            switch (e.key) {
                case 'ArrowLeft':  e.preventDefault(); jump(Math.max(CONFIG.START_YEAR, getCurYear() - step)); break;
                case 'ArrowRight': e.preventDefault(); jump(Math.min(CONFIG.END_YEAR, getCurYear() + step)); break;
                case 'Home': e.preventDefault(); jump(CONFIG.START_YEAR); break;
                case 'End':  e.preventDefault(); jump(CONFIG.END_YEAR); break;
                case ' ': e.preventDefault(); toggle(); break;
            }
        });
    }
}

function getCurYear() {
    if (isPlaying) return Math.round(yearAtTime(performance.now() - animStart + pausedMs));
    return Math.round(yearAtTime(pausedMs));
}

// ===================================
// Init
// ===================================

function init() {
    cache();
    buildDots();
    render(CONFIG.START_YEAR);
    setupSpeed();
    setupSources();
    setupSplash();
    setupKeys();
    updateHeaderOffset();
    window.addEventListener('resize', updateHeaderOffset);

    if (E.playBtn) E.playBtn.addEventListener('click', toggle);
    if (E.resetBtn) E.resetBtn.addEventListener('click', reset);
    if (E.tlBar) {
        E.tlBar.addEventListener('mousedown', dragStart);
        E.tlBar.addEventListener('touchstart', touchStart, { passive: true });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
