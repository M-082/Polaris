document.addEventListener('DOMContentLoaded', function () {
    const navbarContainer = document.getElementById('navbar');
    if (!navbarContainer) return;

    // Build the popup once, up front, and keep it hidden until it's needed.
    const overlay = document.createElement('div');
    overlay.className = 'already-here-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
        '<div class="already-here-pause"><span class="already-here-icon-nudge">&#9208;</span> PAUSE</div>' +
        '<div class="already-here-vignette"></div>' +
        '<canvas class="already-here-snow" width="160" height="120"></canvas>' +
        '<div class="already-here-scanlines"></div>' +
        '<div class="already-here-text-section">' +
            '<p class="already-here-text">YOU ARE ALREADY HERE</p>' +
        '</div>';
    document.body.appendChild(overlay);

    const snowCanvas = overlay.querySelector('.already-here-snow');
    const snowCtx = snowCanvas.getContext('2d');
    let snowFrameId = null;

    function renderSnowFrame() {
        const w = snowCanvas.width;
        const h = snowCanvas.height;
        const imageData = snowCtx.createImageData(w, h);
        const buffer = new Uint32Array(imageData.data.buffer);

        for (let i = 0; i < buffer.length; i++) {
            const shade = (255 * Math.random()) | 0;
            // Full alpha, equal R/G/B for grayscale static
            buffer[i] = (255 << 24) | (shade << 16) | (shade << 8) | shade;
        }

        snowCtx.putImageData(imageData, 0, 0);
        snowFrameId = requestAnimationFrame(renderSnowFrame);
    }

    function startSnow() {
        if (snowFrameId === null) {
            renderSnowFrame();
        }
    }

    function stopSnow() {
        if (snowFrameId !== null) {
            cancelAnimationFrame(snowFrameId);
            snowFrameId = null;
        }
    }

    let hideTimeout = null;

    function onDissolveOutEnd(e) {
        if (e.propertyName !== 'opacity') return;
        overlay.removeEventListener('transitionend', onDissolveOutEnd);
        stopSnow();
    }

    function showAlreadyHerePopup() {
        // If someone spam-clicks the link mid-dissolve, cancel whatever
        // hide was in flight and start clean instead of racing it.
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
        overlay.removeEventListener('transitionend', onDissolveOutEnd);

        overlay.classList.add('show');
        startSnow();

        hideTimeout = setTimeout(function () {
            overlay.classList.remove('show');
            overlay.addEventListener('transitionend', onDissolveOutEnd);
            hideTimeout = null;
        }, 1500);
    }

    // Strip a trailing slash so "/cv" and "/cv/" are treated as the same page.
    // GitHub Pages serves folder URLs with a trailing slash (cv/index.html -> /cv/),
    // but our nav links are written without one.
    function normalizePath(path) {
        return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
    }

    function attachNavListeners() {
        const currentPage = normalizePath(window.location.pathname);
        navbarContainer.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function (e) {
                const href = link.getAttribute('href');
                if (href && normalizePath(href) === currentPage) {
                    e.preventDefault();
                    showAlreadyHerePopup();
                }
            });
        });
    }

    // With the navbar now compiled directly into the page at build time
    // (rather than fetched via AJAX), the nav links already exist by the
    // time DOMContentLoaded fires — no need to wait for them to arrive.
    attachNavListeners();
});