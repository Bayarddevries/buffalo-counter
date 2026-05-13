/**
 * The Buffalo Counter - Main Application
 * A visualization of the Great Buffalo Collapse, 1800-1900
 */

// ===================================
// Constants
// ===================================

const CONFIG = {
    START_YEAR: 1800,
    END_YEAR: 1900,
    PLAY_SPEED: 2000, // milliseconds per year
    CRITICAL_POPULATION: 1000000,
    WARNING_POPULATION: 10000000,
    ANIMATION_FRAME_RATE: 60,
};

// Buffalo population data (approximate historical estimates)
const BUFFALO_DATA = [
    { year: 1800, population: 60000000 },
    { year: 1810, population: 58000000 },
    { year: 1820, population: 55000000 },
    { year: 1830, population: 50000000 },
    { year: 1840, population: 40000000 },
    { year: 1850, population: 30000000 },
    { year: 1860, population: 20000000 },
    { year: 1870, population: 5000000 },
    { year: 1875, population: 1000000 },
    { year: 1880, population: 200000 },
    { year: 1885, population: 50000 },
    { year: 1890, population: 1000 },
    { year: 1900, population: 500 },
];

// Status messages for screen readers
const STATUS_MESSAGES = {
    stable: 'Population stable',
    declining: 'Population declining',
    critical: 'Population critical - near extinction',
    extinct: 'Functionally extinct',
};

// ===================================
// State Management
// ===================================

const state = {
    currentYear: CONFIG.START_YEAR,
    isPlaying: false,
    animationId: null,
    lastTimestamp: null,
    isDragging: false,
};

// ===================================
// DOM Elements (Cached)
// ===================================

const elements = {
    counterValue: document.getElementById('counterValue'),
    counter: document.getElementById('counter'),
    yearValue: document.getElementById('yearValue'),
    yearDisplay: document.getElementById('yearDisplay'),
    timeline: document.getElementById('timeline'),
    timelineFill: document.getElementById('timelineFill'),
    timelineHandle: document.getElementById('timelineHandle'),
    playBtn: document.getElementById('playBtn'),
    resetBtn: document.getElementById('resetBtn'),
    statusIndicator: document.getElementById('statusIndicator'),
    statusDot: document.querySelector('.status-dot'),
    statusText: document.querySelector('.status-text'),
    eventsList: document.getElementById('eventsList'),
    events: document.querySelectorAll('.event'),
};

// ===================================
// Utility Functions
// ===================================

/**
 * Format a number with thousands separators
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
    try {
        return num.toLocaleString('en-US');
    } catch (error) {
        console.error('Error formatting number:', error);
        return num.toString();
    }
}

/**
 * Get population for a specific year using linear interpolation
 * @param {number} year - The year to get population for
 * @returns {number} Estimated population
 */
function getPopulationForYear(year) {
    try {
        // Validate year is within bounds
        if (year < CONFIG.START_YEAR) year = CONFIG.START_YEAR;
        if (year > CONFIG.END_YEAR) year = CONFIG.END_YEAR;

        // Find the two data points surrounding the year
        let lower = BUFFALO_DATA[0];
        let upper = BUFFALO_DATA[BUFFALO_DATA.length - 1];

        for (let i = 0; i < BUFFALO_DATA.length - 1; i++) {
            if (year >= BUFFALO_DATA[i].year && year <= BUFFALO_DATA[i + 1].year) {
                lower = BUFFALO_DATA[i];
                upper = BUFFALO_DATA[i + 1];
                break;
            }
        }

        // Linear interpolation
        const progress = (year - lower.year) / (upper.year - lower.year);
        const population = lower.population + (upper.population - lower.population) * progress;

        return Math.max(0, Math.round(population));
    } catch (error) {
        console.error('Error calculating population:', error);
        return 0;
    }
}

/**
 * Get status message based on population
 * @param {number} population - Current population
 * @returns {string} Status message
 */
function getStatusMessage(population) {
    if (population < 1000) return STATUS_MESSAGES.extinct;
    if (population < CONFIG.CRITICAL_POPULATION) return STATUS_MESSAGES.critical;
    if (population < CONFIG.WARNING_POPULATION) return STATUS_MESSAGES.declining;
    return STATUS_MESSAGES.stable;
}

/**
 * Get status class based on population
 * @param {number} population - Current population
 * @returns {string} CSS class name
 */
function getStatusClass(population) {
    if (population < 1000) return 'critical';
    if (population < CONFIG.CRITICAL_POPULATION) return 'critical';
    if (population < CONFIG.WARNING_POPULATION) return 'warning';
    return '';
}

// ===================================
// Update Functions
// ===================================

/**
 * Update all display elements for a given year
 * @param {number} year - The year to display
 */
function updateDisplay(year) {
    try {
        const population = getPopulationForYear(year);

        // Update counter
        elements.counterValue.textContent = formatNumber(population);
        elements.yearValue.textContent = year;

        // Update timeline
        const progress = (year - CONFIG.START_YEAR) / (CONFIG.END_YEAR - CONFIG.START_YEAR);
        const progressPercent = Math.min(100, Math.max(0, progress * 100));
        elements.timelineFill.style.width = `${progressPercent}%`;
        elements.timelineHandle.style.left = `${progressPercent}%`;

        // Update ARIA attributes
        elements.timeline.setAttribute('aria-valuenow', year);

        // Update counter color based on population
        const statusClass = getStatusClass(population);
        elements.counter.className = 'counter';
        if (statusClass === 'critical') {
            elements.counter.classList.add('critical');
        }

        // Update status indicator
        const statusMessage = getStatusMessage(population);
        elements.statusText.textContent = statusMessage;
        elements.statusDot.className = 'status-dot';
        if (statusClass) {
            elements.statusDot.classList.add(statusClass);
        }

        // Update events
        updateEvents(year);
    } catch (error) {
        console.error('Error updating display:', error);
    }
}

/**
 * Update event visibility based on current year
 * @param {number} year - Current year
 */
function updateEvents(year) {
    try {
        elements.events.forEach((event) => {
            const eventYear = parseInt(event.dataset.year, 10);
            const isActive = year >= eventYear;

            event.classList.toggle('active', isActive);
            event.setAttribute('aria-hidden', !isActive);
        });
    } catch (error) {
        console.error('Error updating events:', error);
    }
}

// ===================================
// Animation Functions
// ===================================

/**
 * Animation loop for play functionality
 * @param {number} timestamp - Current timestamp from requestAnimationFrame
 */
function animate(timestamp) {
    try {
        if (!state.lastTimestamp) state.lastTimestamp = timestamp;
        const elapsed = timestamp - state.lastTimestamp;

        if (elapsed >= CONFIG.PLAY_SPEED) {
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
    } catch (error) {
        console.error('Animation error:', error);
        stopAnimation();
    }
}

/**
 * Start the animation
 */
function startAnimation() {
    try {
        if (state.currentYear >= CONFIG.END_YEAR) {
            state.currentYear = CONFIG.START_YEAR;
        }

        state.isPlaying = true;
        state.lastTimestamp = null;

        // Update play button
        elements.playBtn.setAttribute('aria-pressed', 'true');
        elements.playBtn.setAttribute('aria-label', 'Pause animation');
        elements.playBtn.querySelector('.btn-icon').textContent = '⏸';
        elements.playBtn.querySelector('.btn-text').textContent = 'Pause';
        elements.playBtn.classList.add('playing');

        state.animationId = requestAnimationFrame(animate);
    } catch (error) {
        console.error('Error starting animation:', error);
    }
}

/**
 * Stop the animation
 */
function stopAnimation() {
    try {
        state.isPlaying = false;

        // Update play button
        elements.playBtn.setAttribute('aria-pressed', 'false');
        elements.playBtn.setAttribute('aria-label', 'Play animation');
        elements.playBtn.querySelector('.btn-icon').textContent = '▶';
        elements.playBtn.querySelector('.btn-text').textContent = 'Play';
        elements.playBtn.classList.remove('playing');

        if (state.animationId) {
            cancelAnimationFrame(state.animationId);
            state.animationId = null;
        }
    } catch (error) {
        console.error('Error stopping animation:', error);
    }
}

/**
 * Reset to initial state
 */
function reset() {
    try {
        stopAnimation();
        state.currentYear = CONFIG.START_YEAR;
        updateDisplay(state.currentYear);
    } catch (error) {
        console.error('Error resetting:', error);
    }
}

// ===================================
// Timeline Interaction Functions
// ===================================

/**
 * Handle timeline click
 * @param {MouseEvent} e - Click event
 */
function handleTimelineClick(e) {
    try {
        if (state.isDragging) return; // Don't process click if we're dragging

        const rect = elements.timeline.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const progress = Math.max(0, Math.min(1, clickX / rect.width));
        state.currentYear = Math.round(
            CONFIG.START_YEAR + progress * (CONFIG.END_YEAR - CONFIG.START_YEAR)
        );
        updateDisplay(state.currentYear);
    } catch (error) {
        console.error('Error handling timeline click:', error);
    }
}

/**
 * Handle timeline drag start
 * @param {MouseEvent} e - Mouse down event
 */
function handleTimelineDragStart(e) {
    try {
        state.isDragging = true;
        elements.timelineHandle.style.cursor = 'grabbing';
        document.addEventListener('mousemove', handleTimelineDrag);
        document.addEventListener('mouseup', handleTimelineDragEnd);
        e.preventDefault();
    } catch (error) {
        console.error('Error starting timeline drag:', error);
    }
}

/**
 * Handle timeline drag
 * @param {MouseEvent} e - Mouse move event
 */
function handleTimelineDrag(e) {
    try {
        if (!state.isDragging) return;

        const rect = elements.timeline.getBoundingClientRect();
        const dragX = e.clientX - rect.left;
        const progress = Math.max(0, Math.min(1, dragX / rect.width));
        state.currentYear = Math.round(
            CONFIG.START_YEAR + progress * (CONFIG.END_YEAR - CONFIG.START_YEAR)
        );
        updateDisplay(state.currentYear);
    } catch (error) {
        console.error('Error handling timeline drag:', error);
    }
}

/**
 * Handle timeline drag end
 */
function handleTimelineDragEnd() {
    try {
        state.isDragging = false;
        elements.timelineHandle.style.cursor = 'grab';
        document.removeEventListener('mousemove', handleTimelineDrag);
        document.removeEventListener('mouseup', handleTimelineDragEnd);
    } catch (error) {
        console.error('Error ending timeline drag:', error);
    }
}

/**
 * Handle keyboard navigation on timeline
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleTimelineKeydown(e) {
    try {
        const step = e.shiftKey ? 10 : 1; // Shift for larger jumps

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
    } catch (error) {
        console.error('Error handling keyboard navigation:', error);
    }
}

// ===================================
// Touch Support for Mobile
// ===================================

/**
 * Handle touch start on timeline
 * @param {TouchEvent} e - Touch event
 */
function handleTimelineTouchStart(e) {
    try {
        state.isDragging = true;
        elements.timelineHandle.style.cursor = 'grabbing';
        document.addEventListener('touchmove', handleTimelineTouchMove, { passive: false });
        document.addEventListener('touchend', handleTimelineTouchEnd);
    } catch (error) {
        console.error('Error handling touch start:', error);
    }
}

/**
 * Handle touch move on timeline
 * @param {TouchEvent} e - Touch event
 */
function handleTimelineTouchMove(e) {
    try {
        if (!state.isDragging) return;
        e.preventDefault(); // Prevent scrolling while dragging

        const touch = e.touches[0];
        const rect = elements.timeline.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const progress = Math.max(0, Math.min(1, touchX / rect.width));
        state.currentYear = Math.round(
            CONFIG.START_YEAR + progress * (CONFIG.END_YEAR - CONFIG.START_YEAR)
        );
        updateDisplay(state.currentYear);
    } catch (error) {
        console.error('Error handling touch move:', error);
    }
}

/**
 * Handle touch end on timeline
 */
function handleTimelineTouchEnd() {
    try {
        state.isDragging = false;
        elements.timelineHandle.style.cursor = 'grab';
        document.removeEventListener('touchmove', handleTimelineTouchMove);
        document.removeEventListener('touchend', handleTimelineTouchEnd);
    } catch (error) {
        console.error('Error handling touch end:', error);
    }
}

// ===================================
// Page Visibility API
// ===================================

/**
 * Handle page visibility change
 * Pause animation when tab is not visible
 */
function handleVisibilityChange() {
    if (document.hidden && state.isPlaying) {
        stopAnimation();
    }
}

// ===================================
// Event Listeners
// ===================================

function setupEventListeners() {
    try {
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

        // Timeline drag (mouse)
        elements.timelineHandle.addEventListener('mousedown', handleTimelineDragStart);

        // Timeline keyboard navigation
        elements.timeline.addEventListener('keydown', handleTimelineKeydown);

        // Timeline touch support
        elements.timeline.addEventListener('touchstart', handleTimelineTouchStart, { passive: true });

        // Page visibility
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Space to play/pause (when not focused on interactive elements)
            if (e.key === ' ' && document.activeElement.tagName !== 'BUTTON' && document.activeElement !== elements.timeline) {
                e.preventDefault();
                if (state.isPlaying) {
                    stopAnimation();
                } else {
                    startAnimation();
                }
            }
        });
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// ===================================
// Initialization
// ===================================

/**
 * Initialize the application
 */
function init() {
    try {
        // Set initial state
        state.currentYear = CONFIG.START_YEAR;

        // Update display
        updateDisplay(state.currentYear);

        // Setup event listeners
        setupEventListeners();

        console.log('The Buffalo Counter initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
