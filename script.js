document.addEventListener('DOMContentLoaded', function() {
    // Load portfolio items and filters
    loadPortfolioItems();

    // Setup event listeners
    setupDropdownListeners();
    setupFilterCheckboxes();
    setupSearchInput();
    setupOutsideClicks();
    setupPortfolioClicks();
    setupOverlayCloses();
});

function loadPortfolioItems() {
    fetch('portfolio_data.json')
        .then(response => response.json())
        .then(data => {
            const portfolioContainer = document.getElementById('portfolio-container');
            portfolioContainer.innerHTML = '';
            data.portfolioItems.forEach(item => {
                portfolioContainer.appendChild(createPortfolioItem(item));
            });
            applyFilters(); // Reapply filters to dynamically loaded content
        });
}

function setupDropdownListeners() {
    document.querySelectorAll('.dropbtn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            let currentDropdown = this.nextElementSibling;
            if (currentDropdown.style.display === 'block') {
                currentDropdown.style.display = 'none';
                this.classList.remove('open');
            } else {
                closeAllDropdownsExcept(currentDropdown);
                currentDropdown.style.display = 'block';
                this.classList.add('open');
            }
        });
    });
}

function setupFilterCheckboxes() {
    document.querySelectorAll('.dropdown-content input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            applyFilters();
            updateFilterDisplay();
        });
    });
}

function setupSearchInput() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        applyFilters(); // Apply filters including search text filtering
    });
}

function setupOutsideClicks() {
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });
}

function setupPortfolioClicks() {
    document.querySelectorAll('.portfolio-enlarge').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            showOverlay(this);
            scrollToVisible(this);
        });
    });
}

function setupOverlayCloses() {
    document.querySelectorAll('.overlay').forEach(overlay => {
        overlay.addEventListener('click', function(event) {
            if (event.target === overlay || event.target.classList.contains('close-overlay') || event.target.closest('.close-overlay')) {
                hideOverlay(this);
            }
        });
    });
}

function createPortfolioItem(item) {
    const element = document.createElement('div');
    element.className = 'portfolio-item';
    element.dataset.medium = item.medium;
    element.dataset.creator = item.creator;
    element.dataset.client = item.client;
    element.innerHTML = generatePortfolioItemHTML(item);
    return element;
}

function generatePortfolioItemHTML(item) {
    const mediaContent = item.type === 'image' ? `<img src="${item.thumbnail}" alt="${item.title}"><svg class="icon-fullscreen" viewBox="0 0 24 24"><path d="M6,16H2v6h6v-4H6V16z M2,8h4V4h4V0H2V8z M18,0v4h4v4h4V0H18z M22,20h-4v4h-4v4h6V20H22z"/></svg>` :
        `<img src="${item.thumbnail}" alt="${item.title}"><svg class="playbutton" width="21" height="27" viewBox="0 0 21 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 13.2484L2.20815 2.13464C2.11899 2.07563 2 2.13956 2 2.24648L2 13.2484L2 24.5L19 13.2484Z" fill="white"/></svg>${item.content}`;

    return `<div class="portfolio-enlarge">${mediaContent}<p>${item.title}</p><p>${item.description}</p><div class="overlay" style="display:none;">${item.type === 'video' ? item.content : `<img src="${item.thumbnail}" alt="${item.title}">`}<button class="close-overlay"><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M2.20312 2.19833L13.0031 13.0054M23.8031 23.8125L13.0031 13.0054M13.0031 13.0054L2.20312 23.8125M13.0031 13.0054L23.8031 2.19833" stroke="white" stroke-width="3.21893" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>`;
}

function showOverlay(link) {
    const overlay = link.querySelector('.overlay');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function scrollToVisible(element) {
    const rect = element.getBoundingClientRect();
    if (rect.top < 400) {
        window.scrollTo({ top: window.scrollY + rect.top - 400, behavior: 'smooth' });
    }
}

function hideOverlay(overlay) {
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closeAllDropdownsExcept(currentDropdown) {
    document.querySelectorAll('.dropdown-content').forEach(dropdown => {
        if (dropdown !== currentDropdown) {
            dropdown.style.display = 'none';
            dropdown.previousElementSibling.classList.remove('open');
        }
    });
}

function applyFilters() {
    const filters = {};
    document.querySelectorAll('.dropdown-content input[type="checkbox"]:checked').forEach(checkbox => {
        const type = checkbox.closest('.dropdown').querySelector('.dropbtn').textContent.trim().toLowerCase();
        filters[type] = filters[type] || [];
        filters[type].push(checkbox.value);
    });

    const searchText = document.getElementById('search-input').value.toLowerCase();
    document.querySelectorAll('.portfolio-item').forEach(item => {
        const titleText = item.querySelector('p').textContent.toLowerCase();
        const matchesFilters = Object.keys(filters).length === 0 || Object.keys(filters).every(type => filters[type].includes(item.dataset[type]));
        const matchesSearch = !searchText || titleText.includes(searchText);

        item.closest('.portfolio-enlarge').style.display = (matchesFilters && matchesSearch) ? 'block' : 'none';
    });

    updateFilterDisplay();
}

function updateFilterDisplay() {
    const filters = document.querySelectorAll('.dropdown-content input[type="checkbox"]:checked');
    document.querySelectorAll('.filter-name').forEach(filter => {
        filter.style.display = 'none';
    });
    if (filters.length > 0) {
        filters.forEach(filter => {
            const className = filter.value.toLowerCase().replace(/\s+/g, '-') + '-filter';
            document.querySelector('.' + className).style.display = 'block';
        });
    } else {
        document.querySelector('.showall-filter').style.display = 'block';
    }
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-content').forEach(dropdown => {
        dropdown.style.display = 'none';
        dropdown.previousElementSibling.classList.remove('open');
    });
}
