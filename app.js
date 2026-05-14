     1|// ===================================
     2|// Data
     3|// ===================================
     4|
     5|// Authoritative population data
     6|const DATA_POINTS = [
     7|    { year: 1800, pop: 30000000 },
     8|    { year: 1850, pop: 20000000 },
     9|    { year: 1865, pop: 13500000 },
    10|    { year: 1870, pop: 5500000 },
    11|    { year: 1880, pop: 395000 },
    12|    { year: 1889, pop: 653 },
    13|    { year: 1900, pop: 500 },
    14|];
    15|
    16|const EVENT_YEARS = [1800, 1825, 1850, 1865, 1870, 1880, 1889, 1900];
    17|
    18|const STATUS = {
    19|    green: 'Population stable',
    20|    declining: 'Population declining',
    21|    warning: 'At risk',
    22|    critical: 'Near extinction',
    23|    extinct: 'Functionally extinct',
    24|};
    25|
    26|// ===================================
    27|// State
    28|// ===================================
    29|let currentYear = 1800;
    30|let currentPop = 30000000;
    31|let activeCardIndex = 0;
    32|let ticking = false;
    33|
    34|// ===================================
    35|// DOM refs
    36|// ===================================
    37|const $year = document.getElementById('counterYear');
    38|const $pop = document.getElementById('counterValue');
    39|const $status = document.getElementById('counterStatus');
    40|const $fill = document.getElementById('timelineFill');
    41|const $dots = document.getElementById('timelineDots');
    42|const $prompt = document.getElementById('scrollPrompt');
    43|const $cards = document.querySelectorAll('.card[data-year]');
    44|const $section = document.getElementById('cardsSection');
    45|
    46|// ===================================
    47|// Utility
    48|// ===================================
    49|function formatNumber(n) {
    50|    try { return n.toLocaleString('en-US'); }
    51|    catch { return String(n); }
    52|}
    53|
    54|function interpolatePop(year) {
    55|    if (year <= DATA_POINTS[0].year) return DATA_POINTS[0].pop;
    56|    if (year >= DATA_POINTS[DATA_POINTS.length - 1].year) return DATA_POINTS[DATA_POINTS.length - 1].pop;
    57|
    58|    for (let i = 0; i < DATA_POINTS.length - 1; i++) {
    59|        if (year >= DATA_POINTS[i].year && year <= DATA_POINTS[i + 1].year) {
    60|            if (year === DATA_POINTS[i].year) return DATA_POINTS[i].pop;
    61|            if (year === DATA_POINTS[i + 1].year) return DATA_POINTS[i + 1].pop;
    62|            const t = (year - DATA_POINTS[i].year) / (DATA_POINTS[i + 1].year - DATA_POINTS[i].year);
    63|            return Math.round(DATA_POINTS[i].pop + t * (DATA_POINTS[i + 1].pop - DATA_POINTS[i].pop));
    64|        }
    65|    }
    66|    return 0;
    67|}
    68|
    69|function getStatus(pop) {
    70|    if (pop < 1000) return 'extinct';
    71|    if (pop < 100000) return 'critical';
    72|    if (pop < 1000000) return 'warning';
    73|    if (pop < 10000000) return 'declining';
    74|    return 'green';
    75|}
    76|
    77|// ===================================
    78|// Timeline dots
    79|// ===================================
    80|function createTimelineDots() {
    81|    $dots.innerHTML = '';
    82|    EVENT_YEARS.forEach((year, i) => {
    83|        const dot = document.createElement('div');
    84|        dot.className = 'timeline-dot' + (i === 0 ? ' active' : '');
    85|        dot.dataset.index = i;
    86|        $dots.appendChild(dot);
    87|    });
    88|}
    89|
    90|// ===================================
    91|// Update display from year
    92|// ===================================
    93|function updateFromYear(year) {
    94|    currentYear = Math.round(year);
    95|    currentPop = interpolatePop(currentYear);
    96|
    97|    // Counter
    98|    $year.textContent = currentYear;
    99|    $pop.textContent = formatNumber(currentPop);
   100|
   101|    // Counter color: green -> yellow -> red -> dark red
   102|    const st = getStatus(currentPop);
   103|    $pop.className = 'counter-value';
   104|    if (st === 'extinct' || st === 'critical') $pop.classList.add('critical');
   105|    else if (st === 'warning') $pop.classList.add('declining');
   106|    else if (st === 'declining') $pop.classList.add('warning');
   107|
   108|    // Status text
   109|    $status.textContent = STATUS[st];
   110|
   111|    // Timeline fill
   112|    const progress = (currentYear - 1800) / (1900 - 1800);
   113|    $fill.style.width = Math.min(100, Math.max(0, progress * 100)) + '%';
   114|
   115|    // Timeline dots
   116|    const dots = $dots.querySelectorAll('.timeline-dot');
   117|    dots.forEach((dot, i) => {
   118|        dot.classList.toggle('active', currentYear >= EVENT_YEARS[i]);
   119|    });
   120|}
   121|
   122|// ===================================
   123|// Card activation via IntersectionObserver
   124|// ===================================
   125|function setupCardObserver() {
   126|    const observer = new IntersectionObserver((entries) => {
   127|        entries.forEach(entry => {
   128|            const card = entry.target;
   129|            const year = parseInt(card.dataset.year, 10);
   130|
   131|            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
   132|                card.classList.add('active');
   133|                updateFromYear(year);
   134|
   135|                // Hide scroll prompt after first scroll
   136|                if ($prompt) $prompt.style.display = 'none';
   137|            } else {
   138|                card.classList.remove('active');
   139|            }
   140|        });
   141|    }, {
   142|        root: $section,
   143|        threshold: 0.5,
   144|    });
   145|
   146|    $cards.forEach(card => observer.observe(card));
   147|}
   148|
   149|// ===================================
   150|// Smooth counter interpolation during scroll
   151|// Between cards the counter interpolates smoothly
   152|// ===================================
   153|function setupScrollInterpolation() {
   154|    $section.addEventListener('scroll', () => {
   155|        if (!ticking) {
   156|            requestAnimationFrame(() => {
   157|                updateFromScroll();
   158|                ticking = false;
   159|            });
   160|            ticking = true;
   161|        }
   162|    }, { passive: true });
   163|}
   164|
   165|function updateFromScroll() {
   166|    const sectionRect = $section.getBoundingClientRect();
   167|    const sectionTop = sectionRect.top;
   168|    const sectionHeight = sectionRect.height;
   169|    const viewportCenter = sectionTop + sectionHeight / 2;
   170|
   171|    // Find which two cards the viewport center is between
   172|    let topCard = null;
   173|    let bottomCard = null;
   174|
   175|    $cards.forEach(card => {
   176|        const rect = card.getBoundingClientRect();
   177|        const cardCenter = rect.top + rect.height / 2;
   178|        if (cardCenter <= viewportCenter) {
   179|            if (!topCard || rect.top > topCard.getBoundingClientRect().top) {
   180|                topCard = card;
   181|            }
   182|        }
   183|        if (cardCenter > viewportCenter) {
   184|            if (!bottomCard || rect.top < bottomCard.getBoundingClientRect().top) {
   185|                bottomCard = card;
   186|            }
   187|        }
   188|    });
   189|
   190|    if (topCard && bottomCard) {
   191|        const topYear = parseInt(topCard.dataset.year, 10);
   192|        const bottomYear = parseInt(bottomCard.dataset.year, 10);
   193|        const topRect = topCard.getBoundingClientRect();
   194|        const botRect = bottomCard.getBoundingClientRect();
   195|
   196|        const topCenter = topRect.top + topRect.height / 2;
   197|        const botCenter = botRect.top + botRect.height / 2;
   198|        const range = botCenter - topCenter;
   199|        const progress = range > 0 ? (viewportCenter - topCenter) / range : 0;
   200|        const clampedProgress = Math.max(0, Math.min(1, progress));
   201|
   202|        const interpolatedYear = topYear + clampedProgress * (bottomYear - topYear);
   203|        updateFromYear(interpolatedYear);
   204|    } else if (topCard) {
   205|        updateFromYear(parseInt(topCard.dataset.year, 10));
   206|    } else if (bottomCard) {
   207|        updateFromYear(parseInt(bottomCard.dataset.year, 10));
   208|    }
   209|}
   210|
   211|// ===================================
   212|// Splash
   213|// ===================================
   214|function setupSplash() {
   215|    const splash = document.getElementById('splash');
   216|    const btn = document.getElementById('splashEnter');
   217|    if (!splash || !btn) return;
   218|
   219|    btn.addEventListener('click', () => {
   220|        splash.classList.add('hidden');
   221|        splash.addEventListener('transitionend', () => splash.remove(), { once: true });
   222|        setTimeout(() => { if (splash.parentNode) splash.remove(); }, 600);
   223|    });
   224|}
   225|
   226|// ===================================
   227|// Sources toggle
   228|// ===================================
   229|function setupSources() {
   230|    const toggle = document.getElementById('sourcesToggle');
   231|    const panel = document.getElementById('sourcesPanel');
   232|    if (!toggle || !panel) return;
   233|
   234|    toggle.addEventListener('click', () => {
   235|        const expanded = toggle.getAttribute('aria-expanded') === 'true';
   236|        toggle.setAttribute('aria-expanded', String(!expanded));
   237|        if (expanded) panel.setAttribute('hidden', '');
   238|        else panel.removeAttribute('hidden');
   239|    });
   240|
   241|    panel.addEventListener('keydown', (e) => {
   242|        if (e.key === 'Escape') {
   243|            toggle.setAttribute('aria-expanded', 'false');
   244|            panel.setAttribute('hidden', '');
   245|            toggle.focus();
   246|        }
   247|    });
   248|}
   249|
   250|// ===================================
   251|// Init
   252|// ===================================
   253|function init() {
   254|    createTimelineDots();
   255|    updateFromYear(1800);
   256|    setupCardObserver();
   257|    setupScrollInterpolation();
   258|    setupSplash();
   259|    setupSources();
   260|}
   261|
   262|if (document.readyState === 'loading') {
   263|    document.addEventListener('DOMContentLoaded', init);
   264|} else {
   265|    init();
   266|}
   267|

/* ===================================
   Citation Toast Logic
   =================================== */
function setupCitationToast() {
    // Create toast element
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

// Initialize on load
document.addEventListener('DOMContentLoaded', setupCitationToast);
