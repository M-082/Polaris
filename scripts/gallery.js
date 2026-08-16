document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
document.addEventListener('dragstart', function (e) {
    e.preventDefault();
});
document.addEventListener('selectstart', function (e) {
    e.preventDefault();
});

document.addEventListener('DOMContentLoaded', function () {
    const submenuLinks = document.querySelectorAll('.gallery-submenu-link');
    if (!submenuLinks.length) return;

    const STAGGER_SECONDS = 0.1; // delay between each item falling in
    const ITEM_DURATION_SECONDS = 0.2; // must match the transition duration in gallery.css

    function getGallery(key) {
        return document.querySelector('.gallery-container[data-gallery="' + key + '"]');
    }

    // Animates items that are already marked with "item-fall-enter" into place,
    // staggered by index, then cleans up the animation classes once done.
    function revealStaggered(items) {
        items.forEach(function (item, i) {
            item.style.transitionDelay = (i * STAGGER_SECONDS) + 's';
            item.classList.add('item-fall-enter-active');
        });

        const totalMs = ((items.length - 1) * STAGGER_SECONDS + ITEM_DURATION_SECONDS) * 1000 + 50;
        setTimeout(function () {
            items.forEach(function (item) {
                item.classList.remove('item-fall-enter', 'item-fall-enter-active');
                item.style.transitionDelay = '';
            });
        }, totalMs);
    }

    // Waits two animation frames before running the callback. The first frame
    // lets the browser paint the current (pre-animation) state; the second
    // frame is when we actually flip the classes. This replaces the old
    // "void element.offsetWidth" forced-reflow trick, which blocked the main
    // thread synchronously and could bunch up with other work happening at
    // load (like the navbar's async injection), causing a visible flicker.
    function nextPaint(callback) {
        requestAnimationFrame(function () {
            requestAnimationFrame(callback);
        });
    }

    function showGalleryStaggered(gallery) {
        gallery.hidden = false;
        gallery.classList.add('active');

        const items = gallery.querySelectorAll('.gallery-item');
        items.forEach(function (item) {
            item.classList.add('item-fall-enter');
        });

        nextPaint(function () {
            revealStaggered(items);
        });
    }

    // On page load, stagger in whichever gallery is already visible.
    // Its items carry "item-fall-enter" directly in the HTML, so they're
    // hidden from the very first paint - no flash of the full grid before
    // this kicks in.
    const initialGallery = document.querySelector('.gallery-container.active');
    if (initialGallery) {
        const initialItems = initialGallery.querySelectorAll('.gallery-item.item-fall-enter');
        if (initialItems.length) {
            nextPaint(function () {
                revealStaggered(initialItems);
            });
        }
    }

    submenuLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetKey = link.dataset.galleryTarget;
            const currentGallery = document.querySelector('.gallery-container.active');
            const nextGallery = getGallery(targetKey);

            if (!nextGallery || nextGallery === currentGallery) return;

            submenuLinks.forEach(function (l) { l.classList.remove('active'); });
            link.classList.add('active');

            // Step 1: dissolve the current gallery
            currentGallery.classList.add('gallery-fade-out');

            currentGallery.addEventListener('transitionend', function onFadeOut(evt) {
                if (evt.propertyName !== 'opacity') return;
                currentGallery.removeEventListener('transitionend', onFadeOut);

                currentGallery.classList.remove('active', 'gallery-fade-out');
                currentGallery.hidden = true;

                // Step 2: next gallery's items fall in one at a time
                showGalleryStaggered(nextGallery);
            });
        });
    });
});