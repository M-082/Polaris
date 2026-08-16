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

    const STAGGER_SECONDS = 0.1;
    const ITEM_DURATION_SECONDS = 0.2;

    function getGallery(key) {
        return document.querySelector('.gallery-container[data-gallery="' + key + '"]');
    }

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

    function showGalleryStaggered(gallery) {
        gallery.hidden = false;
        gallery.classList.add('active');

        const items = gallery.querySelectorAll('.gallery-item');
        items.forEach(function (item) {
            item.classList.add('item-fall-enter');
        });

        void gallery.offsetWidth;

        revealStaggered(items);
    }

    const initialGallery = document.querySelector('.gallery-container.active');
    if (initialGallery) {
        const initialItems = initialGallery.querySelectorAll('.gallery-item.item-fall-enter');
        if (initialItems.length) {
            void initialGallery.offsetWidth;
            revealStaggered(initialItems);
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

            if (window.matchMedia('(max-width: 991.98px)').matches) {
                link.blur();
                requestAnimationFrame(function () {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }

            currentGallery.classList.add('gallery-fade-out');

            currentGallery.addEventListener('transitionend', function onFadeOut(evt) {
                if (evt.propertyName !== 'opacity') return;
                currentGallery.removeEventListener('transitionend', onFadeOut);

                currentGallery.classList.remove('active', 'gallery-fade-out');
                currentGallery.hidden = true;

                showGalleryStaggered(nextGallery);
            });
        });
    });
});