/**
 * The Buffalo Counter - Main Application
 * A visualization of the Great Buffalo Collapse, 1800-1900
 * Mobile-first responsive redesign
 */

// ===================================
// Constants
// ===================================

const CONFIG = {
    START_YEAR: 1800,
    END_YEAR: 1900,
    PLAY_SPEED: {
        slow: 3000,    // 3 seconds per year
        normal: 2000,  // 2 seconds per year
        fast: 500,     // 0.5 seconds per year
    },
    DEFAULT_SPEED: 'normal',
    CRITICAL_POPULATION: 1000000,
    WARNING_POPULATION: 10000000,
};

// Buffalo population data (approximate historical estimates)
const BUFFALO_DATA = [
    { year: 1800, population: 60000000, source: "Seton, 1909" },
    { year: 1820, population: 55000000, source: "Roe, 1951" },
    { year: 1830, population: 45000000, source: "Roe, 1951" },
    { year: 1840, population: 38000000, source: "Isenberg, 2000" },
    { year: 1850, population: 30000000, source: "Flores, 2016" },
    { year: 1856, population: 25000000, source: "Roe, 1951" },
    { year: 1860, population: 15000000, source: "Isenberg, 2000" },
    { year: 1865, population: 10000000, source: "Isenberg, 2000" },
    { year: 1870, population: 5000000, source: "Hornaday, 1889" },
    { year: 1875, population: 1000000, source: "Hornaday, 1889" },
    { year: 1880, population: 200000, source: "Hornaday, 1889" },
    { year: 1889, population: 1000, source: "Hornaday, 1889" },
    { year: 1900, population: 500, source: "Conservation records, ~1900" },
];

// Status messages for screen readers
const STATUS_MESSAGES = {
    stable: 'Population stable',
    declining: 'Population declining',
    critical: 'Population critical - near extinction',
    extinct: 'Functionally extinct',
};

// Historical events data
const EVENTS_DATA = [
    {
        year: 1830,
        title: 'The Hide Trade Begins',
        description: 'Commercial hunting for buffalo robes expands. For every robe that reached market, several more buffalo were killed and left to rot - the trade fully obscured the true death toll. The robe trade peaked at 250,000 per year by the 1870s.',
        source: 'Isenberg, 2000',
    },
    {
        year: 1860,
        title: 'Railroads Reach the Plains',
        description: 'Railroads enable mass slaughter. Hunters shoot from train windows, leaving carcasses to rot. The AT&SF depot at Dodge City shipped 200,000 hides/year.',
        source: 'Brown, 1970',
    },
    {
        year: 1870,
        title: 'The Great Collapse',
        description: 'Population crashes from millions to hundreds of thousands. Métis communities face starvation as the buffalo economy vanishes.',
        source: 'Flores, 2016; Peterson, 1985',
    },
    {
        year: 1874,
        title: 'US Army Campaigns',
        description: 'Military strategy: destroy buffalo to force Indigenous peoples onto reservations. Gen. Philip Sheridan championed this policy before Congress.',
        source: 'Congressional Globe, 1874',
    },
    {
        year: 1883,
        title: 'The Last of the Herds',
        description: 'Fewer than 1,000 buffalo remain in the wild. The species is functionally extinct. Hornaday\'s 1889 Smithsonian report documented the final toll.',
        source: 'Hornaday, 1889',
    },
];

// ===================================
// State Management
// ===================================

const state = {
    currentYear: CONFIG.START_YEAR,
    isPlaying: false,
    animationId: null,
    lastTimestamp: null,
    isDragging: false,
    speed: CONFIG.DEFAULT_SPEED,
    justDragged: false,
};

// ===================================
// DOM Elements (Cached)
// ===================================

let elements = {};

function cacheElements() {
    elements = {
        counterValue: document.getElementById('counterValue'),
        counter: document.getElementById('counter'),
        yearValue: document.getElementById('yearValue'),
        yearDisplay: document.getElementById('yearDisplay'),
        timeline: document.getElementById('timeline'),
        timelineFill: document.getElementById('timelineFill'),
        timelineHandle: document.getElementById('timelineHandle'),
        timelineEvents: document.getElementById('timelineEvents'),
        timelineTooltip: document.getElementById('timelineTooltip'),
        playBtn: document.getElementById('playBtn'),
        resetBtn: document.getElementById('resetBtn'),
        statusDot: document.querySelector('.status-dot'),
        statusText: document.querySelector('.status-text'),
        eventsList: document.getElementById('eventsList'),
    };
}

// ===================================
// Utility Functions
// ===================================

function formatNumber(num) {
    try {
        return num.toLocaleString('en-US');
    } catch {
        return num.toString();
    }
}

function getPopulationForYear(year) {
    try {
        if (year < CONFIG.START_YEAR) year = CONFIG.START_YEAR;
        if (year > CONFIG.END_YEAR) year = CONFIG.END_YEAR;

        let lower = BUFFALO_DATA[0];
        let upper = BUFFALO_DATA[BUFFALO_DATA.length - 1];

        for (let i = 0; i < BUFFALO_DATA.length - 1; i++) {
            if (year >= BUFFALO_DATA[i].year && year <= BUFFALO_DATA[i + 1].year) {
                lower = BUFFALO_DATA[i];
                upper = BUFFALO_DATA[i + 1];

                // Exact match shortcut - skip interpolation for known data points
                if (year === lower.year) return lower.population;
                if (year === upper.year) return upper.population;

                break;
            }
        }

        // Linear interpolation
        const yearSpan = upper.year - lower.year;
        const popSpan = upper.population - lower.population;
        const progress = yearSpan === 0 ? 0 : (year - lower.year) / yearSpan;
        const population = lower.population + popSpan * progress;

        return Math.max(0, Math.round(population));
    } catch {
        return 0;
    }
}

function getStatusMessage(population) {
    if (population < 1000) return STATUS_MESSAGES.extinct;
    if (population < CONFIG.CRITICAL_POPULATION) return STATUS_MESSAGES.critical;
    if (population < CONFIG.WARNING_POPULATION) return STATUS_MESSAGES.declining;
    return STATUS_MESSAGES.stable;
}

function getStatusClass(population) {
    if (population < CONFIG.CRITICAL_POPULATION) return 'critical';
    if (population < CONFIG.WARNING_POPULATION) return 'warning';
    return '';
}

// ===================================
// Timeline Event Markers
// ===================================

function createTimelineEventMarkers() {
    elements.timelineEvents.innerHTML = '';

    EVENTS_DATA.forEach((event, index) => {
        const marker = document.createElement('button');
        marker.className = 'timeline-event-marker';
        marker.dataset.year = event.year;
        marker.dataset.index = index;
        marker.setAttribute('aria-label', `${event.year}: ${event.title}`);
        marker.setAttribute('id', `event-desc-${index}`);

        // Visible dot inside the touch target
        const dot = document.createElement('span');
        dot.className = 'timeline-event-dot';
        marker.appendChild(dot);

        const progress = (event.year - CONFIG.START_YEAR) / (CONFIG.END_YEAR - CONFIG.START_YEAR);
        marker.style.left = `${progress * 100}%`;

        marker.addEventListener('mouseenter', () => showTooltip(event, marker));
        marker.addEventListener('mouseleave', hideTooltip);
        marker.addEventListener('focus', () => showTooltip(event, marker));
        marker.addEventListener('blur', hideTooltip);
        marker.addEventListener('click', (e) => {
            e.stopPropagation();
            jumpToYear(event.year);
        });
        marker.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                jumpToYear(event.year);
            }
        });

        elements.timelineEvents.appendChild(marker);
    });
}

function updateTimelineEventMarkers(year) {
    const markers = elements.timelineEvents.querySelectorAll('.timeline-event-marker');
    markers.forEach((marker) => {
        const eventYear = parseInt(marker.dataset.year, 10);
        marker.classList.toggle('active', year >= eventYear);
    });
}

// ===================================
// Tooltip
// ===================================

function showTooltip(event, marker) {
    const tooltip = elements.timelineTooltip;

    tooltip.innerHTML = `
        <div class="timeline-tooltip-year">${event.year}</div>
        <div class="timeline-tooltip-title">${event.title}</div>
        <div class="timeline-tooltip-desc">${event.description}</div>
        <div class="timeline-tooltip-source">Source: ${event.source || 'Historical record'}</div>
    `;

    const markerRect = marker.getBoundingClientRect();
    const timelineRect = elements.timeline.getBoundingClientRect();
    const relativeLeft = markerRect.left - timelineRect.left + (markerRect.width / 2);

    // Constrain tooltip to stay within the timeline bounds
    const tooltipWidth = tooltip.offsetWidth || 200;
    const constrainedLeft = Math.max(tooltipWidth / 2, Math.min(timelineRect.width - tooltipWidth / 2, relativeLeft));

    tooltip.style.left = `${constrainedLeft}px`;
    tooltip.classList.add('visible');
    tooltip.setAttribute('aria-hidden', 'false');
}

function hideTooltip() {
    const tooltip = elements.timelineTooltip;
    tooltip.classList.remove('visible');
    tooltip.setAttribute('aria-hidden', 'true');
}

// ===================================
// Display Update
// ===================================

function jumpToYear(year) {
    state.currentYear = year;
    updateDisplay(year);
    hideTooltip();
}

function updateDisplay(year) {
    const population = getPopulationForYear(year);

    elements.counterValue.textContent = formatNumber(population);
    elements.yearValue.textContent = year;

    const progress = (year - CONFIG.START_YEAR) / (CONFIG.END_YEAR - CONFIG.START_YEAR);
    const progressPercent = Math.min(100, Math.max(0, progress * 100));
    elements.timelineFill.style.width = `${progressPercent}%`;
    elements.timelineHandle.style.left = `${progressPercent}%`;

    elements.timeline.setAttribute('aria-valuenow', year);

    // Counter color state
    const statusClass = getStatusClass(population);
    elements.counter.className = 'counter';
    if (statusClass) {
        elements.counter.classList.add(statusClass);
    }

    // Status indicator
    const statusMessage = getStatusMessage(population);
    elements.statusText.textContent = statusMessage;
    elements.statusDot.className = 'status-dot';
    if (statusClass) {
        elements.statusDot.classList.add(statusClass);
    }

    updateEvents(year);
    updateTimelineEventMarkers(year);
}

function updateEvents(year) {
    const events = document.querySelectorAll('.event');
    events.forEach((event) => {
        const eventYear = parseInt(event.dataset.year, 10);
        const isActive = year >= eventYear;
        event.classList.toggle('active', isActive);
        event.setAttribute('aria-hidden', !isActive);
    });
}

// ===================================
// Animation
// ===================================

function animate(timestamp) {
    if (!state.lastTimestamp) state.lastTimestamp = timestamp;
    const elapsed = timestamp - state.lastTimestamp;
    const speed = CONFIG.PLAY_SPEED[state.speed];

    if (elapsed >= speed) {
        state.currentYear++;
        state.lastTimestamp = timestamp;

        if (state.currentYear > CONFIG.END_YEAR) {
            stopAnimation();
            state.currentYear = CONFIG.END_YEAR;
        }

        updateDisplay(state.currentYear);
    }

    if (state.isPlaying) {
        state.animationId = requestAnimationFrame(animate);
    }
}

function startAnimation() {
    if (state.currentYear >= CONFIG.END_YEAR) {
        state.currentYear = CONFIG.START_YEAR;
    }

    state.isPlaying = true;
    state.lastTimestamp = null;

    elements.playBtn.setAttribute('aria-pressed', 'true');
    elements.playBtn.setAttribute('aria-label', 'Pause animation');
    elements.playBtn.querySelector('.btn-icon').textContent = '⏸';
    elements.playBtn.querySelector('.btn-text').textContent = 'Pause';
    elements.playBtn.classList.add('playing');

    state.animationId = requestAnimationFrame(animate);
}

function stopAnimation() {
    state.isPlaying = false;

    elements.playBtn.setAttribute('aria-pressed', 'false');
    elements.playBtn.setAttribute('aria-label', 'Play animation');
    elements.playBtn.querySelector('.btn-icon').textContent = '▶';
    elements.playBtn.querySelector('.btn-text').textContent = 'Play';
    elements.playBtn.classList.remove('playing');

    if (state.animationId) {
        cancelAnimationFrame(state.animationId);
        state.animationId = null;
    }
}

function reset() {
    stopAnimation();
    state.currentYear = CONFIG.START_YEAR;
    updateDisplay(state.currentYear);
}

// ===================================
// Timeline Interaction
// ===================================

function getYearFromPosition(clientX) {
    const rect = elements.timeline.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(CONFIG.START_YEAR + progress * (CONFIG.END_YEAR - CONFIG.START_YEAR));
}

function handleTimelineClick(e) {
    if (state.justDragged) {
        state.justDragged = false;
        return;
    }
    jumpToYear(getYearFromPosition(e.clientX));
}

// Mouse drag on handle
function handleDragStart(e) {
    state.isDragging = true;
    state.justDragged = false;
    elements.timelineHandle.style.cursor = 'grabbing';
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    e.preventDefault();
}

function handleDragMove(e) {
    if (!state.isDragging) return;
    state.justDragged = true;
    const year = getYearFromPosition(e.clientX);
    if (year !== state.currentYear) {
        state.currentYear = year;
        updateDisplay(year);
    }
}

function handleDragEnd() {
    state.isDragging = false;
    elements.timelineHandle.style.cursor = 'grab';
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
}

// Touch drag on timeline - does NOT prevent scroll
function handleTouchStart(e) {
    state.isDragging = true;
    state.justDragged = false;
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
}

function handleTouchMove(e) {
    if (!state.isDragging) return;
    const touch = e.touches[0];
    // Only update year if touch is near the timeline (don't block page scrolling)
    const timelineRect = elements.timeline.getBoundingClientRect();
    const touchY = touch.clientY;
    const isNearTimeline = touchY >= timelineRect.top - 40 && touchY <= timelineRect.bottom + 100;
    
    if (isNearTimeline) {
        state.justDragged = true;
        const year = getYearFromPosition(touch.clientX);
        if (year !== state.currentYear) {
            state.currentYear = year;
            updateDisplay(year);
        }
    }
}

function handleTouchEnd() {
    state.isDragging = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
}

// Keyboard navigation
function handleTimelineKeydown(e) {
    const step = e.shiftKey ? 10 : 1;

    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            state.currentYear = Math.max(CONFIG.START_YEAR, state.currentYear - step);
            updateDisplay(state.currentYear);
            break;
        case 'ArrowRight':
            e.preventDefault();
            state.currentYear = Math.min(CONFIG.END_YEAR, state.currentYear + step);
            updateDisplay(state.currentYear);
            break;
        case 'Home':
            e.preventDefault();
            state.currentYear = CONFIG.START_YEAR;
            updateDisplay(state.currentYear);
            break;
        case 'End':
            e.preventDefault();
            state.currentYear = CONFIG.END_YEAR;
            updateDisplay(state.currentYear);
            break;
        case 'Escape':
            e.preventDefault();
            stopAnimation();
            break;
        case ' ':
        case 'Enter':
            e.preventDefault();
            if (state.isPlaying) {
                stopAnimation();
            } else {
                startAnimation();
            }
            break;
    }
}

// ===================================
// Speed Control
// ===================================

function handleSpeedChange(e) {
    const btn = e.target.closest('.speed-btn');
    if (!btn) return;

    const newSpeed = btn.dataset.speed;
    if (newSpeed === state.speed) return;

    state.speed = newSpeed;

    // Update active state
    document.querySelectorAll('.speed-btn').forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-checked', 'true');
}

// ===================================
// Page Visibility
// ===================================

function handleVisibilityChange() {
    if (document.hidden && state.isPlaying) {
        stopAnimation();
    }
}

// ===================================
// Event Listeners
// ===================================

function setupEventListeners() {
    // Play/Pause button
    elements.playBtn.addEventListener('click', () => {
        if (state.isPlaying) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    // Reset button
    elements.resetBtn.addEventListener('click', reset);

    // Timeline click
    elements.timeline.addEventListener('click', handleTimelineClick);

    // Timeline drag (mouse) on handle
    elements.timelineHandle.addEventListener('mousedown', handleDragStart);

    // Touch support on entire timeline - passive, doesn't block scroll
    elements.timeline.addEventListener('touchstart', handleTouchStart, { passive: true });

    // Keyboard navigation
    elements.timeline.addEventListener('keydown', handleTimelineKeydown);

    // Speed control
    document.querySelector('.speed-selector').addEventListener('click', handleSpeedChange);

    // Page visibility
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' && document.activeElement.tagName !== 'BUTTON' && document.activeElement !== elements.timeline) {
            e.preventDefault();
            if (state.isPlaying) {
                stopAnimation();
            } else {
                startAnimation();
            }
        }
    });
}

// ===================================
// Initialization
// ===================================

function init() {
    cacheElements();
    state.currentYear = CONFIG.START_YEAR;
    state.speed = CONFIG.DEFAULT_SPEED;

    createTimelineEventMarkers();
    updateDisplay(state.currentYear);
    setupEventListeners();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
