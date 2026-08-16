// Lazy loader script - fetches pages on hover, loads on click
(function() {
    // Store fetched content
    const fetchedContent = new Map();
    
    // Function to fetch and cache content
    function fetchAndCacheContent(url) {
        if (fetchedContent.has(url)) {
            return Promise.resolve(fetchedContent.get(url));
        }
        
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                // Parse HTML to extract body content
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                
                // Get the body content (excluding the body tag itself)
                const bodyContent = tempDiv.querySelector('body') || tempDiv;
                
                // Remove the navbar from the loaded content
                const navToRemove = bodyContent.querySelector('nav');
                if (navToRemove) {
                    navToRemove.remove();
                }
                
                // Cache the content
                const content = bodyContent.innerHTML;
                fetchedContent.set(url, content);
                return content;
            })
            .catch(error => {
                console.error('Error fetching content:', error);
                return '<div class="error">Failed to load content</div>';
            });
    }

    // Function to load content into target
    function loadContent(url, targetElement) {
        // Show loading indicator
        targetElement.innerHTML = '<div class="loading">Loading...</div>';
        
        fetchAndCacheContent(url)
            .then(content => {
                targetElement.innerHTML = content;
                // Add CSS to ensure proper styling
                targetElement.style.cssText = 'margin-top: 80px; padding: 20px;';
            })
            .catch(error => {
                console.error('Error loading content:', error);
                targetElement.innerHTML = '<div class="error">Failed to load content</div>';
            });
    }

    // Function to set up lazy loading on navbar links
    function setupLazyLoading() {
        // Create a target element for lazy loaded content
        const contentTarget = document.createElement('div');
        contentTarget.id = 'lazy-content-target';
        contentTarget.style.cssText = 'margin-top: 80px; padding: 20px;';
        document.body.appendChild(contentTarget);
        
        // Find all navbar links that should lazy load
        const navbarLinks = document.querySelectorAll('.navbar-nav a.nav-link');
        
        navbarLinks.forEach(link => {
            const url = link.getAttribute('href');
            
            // Skip external links and the current page
            if (url && !url.startsWith('http') && !url.includes(window.location.pathname)) {
                // Fetch content on hover
                link.addEventListener('mouseenter', function(e) {
                    // Only fetch if not already cached
                    if (!fetchedContent.has(url)) {
                        fetchAndCacheContent(url);
                    }
                });
                
                // Load content on click
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    loadContent(url, contentTarget);
                    
                    // Update browser history (optional)
                    if (window.history && window.history.pushState) {
                        window.history.pushState({}, '', url);
                    }
                });
                
                // Add touch support for mobile
                link.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    loadContent(url, contentTarget);
                });
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupLazyLoading);
    } else {
        setupLazyLoading();
    }
})();