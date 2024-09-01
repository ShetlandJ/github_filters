const generateSaveButton = () => {
    const saveButton = document.createElement('a');
    saveButton.id = 'save-filters-button';
    saveButton.href = "#"; // Use '#' or another appropriate link
    saveButton.classList.add('js-selected-navigation-item', 'subnav-item'); // Match styling with other subnav items

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

const addClickHandler = (saveButton) => {
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();

        const targetElement = document.querySelector('#js-issues-toolbar');

        if (targetElement) {
            const helloDiv = document.createElement('div');
            helloDiv.textContent = 'hello';

            targetElement.parentNode.insertBefore(helloDiv, targetElement);
        } else {
            console.log('Target element for inserting "hello" not found.');
        }
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

        const buttonText = document.createTextNode(' Save Filter');
        saveButton.appendChild(buttonText);

        addClickHandler(saveButton);
        addButtonToPage(navElement, saveButton);
    }
}

const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === 'childList') {
            addSaveFiltersButton();
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
