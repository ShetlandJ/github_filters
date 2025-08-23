// Storage utilities
const storage = {
    getFilters: () => {
        const filters = localStorage.getItem('github-filters');
        return filters ? JSON.parse(filters) : [];
    },
    saveFilter: (filter) => {
        const filters = storage.getFilters();
        filters.push(filter);
        localStorage.setItem('github-filters', JSON.stringify(filters));
    },
    deleteFilter: (index) => {
        const filters = storage.getFilters();
        filters.splice(index, 1);
        localStorage.setItem('github-filters', JSON.stringify(filters));
    }
};

// Helper function to get current query from URL or input field
const getCurrentQuery = () => {
    // First try to get from URL
    const urlParams = new URLSearchParams(window.location.search);
    let currentQuery = urlParams.get('q') || '';
    
    // If no URL query or we want the most up-to-date value, check the input field
    const searchInput = document.querySelector('#js-issues-search');
    if (searchInput && searchInput.value.trim()) {
        currentQuery = searchInput.value.trim();
    }
    
    return decodeURIComponent(currentQuery);
};

const generateSaveButton = () => {
    const saveButton = document.createElement('a');
    saveButton.id = 'save-filters-button';
    saveButton.href = "#";
    saveButton.classList.add('js-selected-navigation-item', 'subnav-item');

    return saveButton;
}

const generateSvgIcon = () => {
    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgIcon.setAttribute("aria-hidden", "true");
    svgIcon.setAttribute("height", "13");
    svgIcon.setAttribute("width", "13");
    svgIcon.setAttribute("viewBox", "0 0 32 32");
    svgIcon.setAttribute("fill", "currentColor");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M19,10c0.552,0,1-0.447,1-1V5c0-0.553-0.448-1-1-1s-1,0.447-1,1v4C18,9.553,18.448,10,19,10z M30,28c0,1.104-0.896,2-2,2H4 c-1.104,0-2-0.896-2-2V5c0-1.104,0.896-2,2-2h2v10c0,1.104,0.896,2,2,2h16c1.104,0,2-0.896,2-2V3h2c1.104,0,2,0.896,2,2V28z M8,3 h16v9c0,0.553-0.448,1-1,1H9c-0.552,0-1-0.447-1-1V3z M28,1H4C1.791,1,0,2.791,0,5v24c0,2.209,1.791,4,4,4h24c2.209,0,4-1.791,4-4 V5C32,2.791,30.209,1,28,1z");
    svgIcon.appendChild(path);

    return svgIcon;
}

const addButtonToPage = (navElement, saveButton) => {
    const firstNavLink = navElement.querySelector('a');
    if (firstNavLink) {
        navElement.insertBefore(saveButton, firstNavLink);
    } else {
        navElement.appendChild(saveButton);
    }
}

const createFilterModal = () => {
    const modal = document.createElement('div');
    modal.id = 'github-filter-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        min-width: 400px;
        max-width: 500px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    const title = document.createElement('h3');
    title.textContent = 'Save GitHub Filter';
    title.style.marginTop = '0';

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Filter Name:';
    nameLabel.style.display = 'block';
    nameLabel.style.marginBottom = '5px';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'e.g., "Open PRs not by me"';
    nameInput.style.cssText = `
        width: 100%;
        padding: 8px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    `;

    const queryLabel = document.createElement('label');
    queryLabel.textContent = 'Filter Query:';
    queryLabel.style.display = 'block';
    queryLabel.style.marginBottom = '5px';

    const queryInput = document.createElement('input');
    queryInput.type = 'text';
    queryInput.style.cssText = `
        width: 100%;
        padding: 8px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    `;

    // Extract current query from URL or input field
    const currentQuery = getCurrentQuery();
    queryInput.value = currentQuery;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    `;

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.style.cssText = `
        background: #0366d6;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
        background: #f6f8fa;
        color: #586069;
        border: 1px solid #d1d5da;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
    `;

    saveBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const query = queryInput.value.trim();
        
        if (name && query) {
            const filter = {
                name: name,
                query: query,
                url: window.location.href,
                created: new Date().toISOString()
            };
            
            storage.saveFilter(filter);
            document.body.removeChild(modal);
            showFiltersPanel();
        } else {
            alert('Please enter both a name and query for the filter.');
        }
    });

    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(saveBtn);

    modalContent.appendChild(title);
    modalContent.appendChild(nameLabel);
    modalContent.appendChild(nameInput);
    modalContent.appendChild(queryLabel);
    modalContent.appendChild(queryInput);
    modalContent.appendChild(buttonContainer);

    modal.appendChild(modalContent);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    return modal;
};

const showFiltersPanel = () => {
    // Remove existing panel if it exists
    const existingPanel = document.querySelector('#github-filters-panel');
    if (existingPanel) {
        existingPanel.remove();
    }

    // Look for the search section container
    const targetElement = document.querySelector('.d-flex.flex-justify-between.mb-md-3.flex-column-reverse.flex-md-row.flex-items-end');
    if (!targetElement) {
        console.log('Target element for inserting filters panel not found.');
        return;
    }

    const filtersPanel = document.createElement('div');
    filtersPanel.id = 'github-filters-panel';
    filtersPanel.style.cssText = `
        background: #f6f8fa;
        border: 1px solid #d1d5da;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 16px;
        margin-top: 16px;
    `;

    const filters = storage.getFilters();
    
    if (filters.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No saved filters yet. Save your current filter to get started!';
        emptyMessage.style.cssText = `
            color: #586069;
            margin: 0;
            font-style: italic;
            font-size: 14px;
        `;
        filtersPanel.appendChild(emptyMessage);
    } else {
        const filtersList = document.createElement('div');
        filtersList.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        `;

        // Get current query to check for active state
        const currentQuery = getCurrentQuery();
        
        filters.forEach((filter, index) => {
            const filterItem = document.createElement('div');
            filterItem.style.cssText = `
                display: flex;
                align-items: center;
                gap: 6px;
            `;

            const isActive = currentQuery === filter.query;
            
            const applyBtn = document.createElement('button');
            applyBtn.textContent = filter.name;
            applyBtn.style.cssText = `
                background: ${isActive ? '#0366d6' : '#f6f8fa'};
                color: ${isActive ? 'white' : '#24292e'};
                border: 1px solid ${isActive ? '#0366d6' : '#d1d5da'};
                padding: 6px 12px;
                border-radius: 16px;
                cursor: pointer;
                font-size: 12px;
                font-weight: ${isActive ? '600' : '500'};
                transition: all 0.2s ease;
            `;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '×';
            deleteBtn.style.cssText = `
                background: none;
                color: #586069;
                border: none;
                padding: 2px 6px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                line-height: 1;
                transition: color 0.2s ease;
            `;

            // Hover effects
            applyBtn.addEventListener('mouseenter', () => {
                if (!isActive) {
                    applyBtn.style.backgroundColor = '#e1e4e8';
                }
            });

            applyBtn.addEventListener('mouseleave', () => {
                if (!isActive) {
                    applyBtn.style.backgroundColor = '#f6f8fa';
                }
            });

            deleteBtn.addEventListener('mouseenter', () => {
                deleteBtn.style.color = '#d73a49';
            });

            deleteBtn.addEventListener('mouseleave', () => {
                deleteBtn.style.color = '#586069';
            });

            applyBtn.addEventListener('click', () => {
                if (!isActive) {
                    // Navigate to the filter URL
                    const baseUrl = window.location.origin + window.location.pathname;
                    const newUrl = `${baseUrl}?q=${encodeURIComponent(filter.query)}`;
                    window.location.href = newUrl;
                }
            });

            deleteBtn.addEventListener('click', () => {
                if (confirm(`Delete filter "${filter.name}"?`)) {
                    storage.deleteFilter(index);
                    showFiltersPanel(); // Refresh the panel
                }
            });

            filterItem.appendChild(applyBtn);
            filterItem.appendChild(deleteBtn);
            filtersList.appendChild(filterItem);
        });

        filtersPanel.appendChild(filtersList);
    }

    // Insert after the search section
    targetElement.parentNode.insertBefore(filtersPanel, targetElement.nextSibling);
};

const addClickHandler = (saveButton) => {
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        
        // Check if we're on a page that supports filters (issues or pull requests)
        const path = window.location.pathname;
        if (!path.includes('/issues') && !path.includes('/pulls')) {
            alert('Filters can only be saved on Issues or Pull Requests pages.');
            return;
        }

        const modal = createFilterModal();
        document.body.appendChild(modal);
    });
}

function addSaveFiltersButton() {
    if (window.location.hostname !== 'github.com') {
        return;
    }

    const navElement = document.querySelector('nav.subnav-links');

    if (navElement) {
        if (document.querySelector('#save-filters-button')) {
            return;
        }

        const saveButton = generateSaveButton();
        const svgIcon = generateSvgIcon();

        saveButton.appendChild(svgIcon);

        const buttonText = document.createTextNode(' Save');
        saveButton.appendChild(buttonText);

        addClickHandler(saveButton);
        addButtonToPage(navElement, saveButton);
    }

    // Always show the filters panel
    showFiltersPanel();
}

const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === 'childList') {
            addSaveFiltersButton();
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

// Initialize buttons on page load
document.addEventListener('DOMContentLoaded', () => {
    addSaveFiltersButton();
});

// Also try to add buttons immediately in case DOM is already loaded
addSaveFiltersButton();
