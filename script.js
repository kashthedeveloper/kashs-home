document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       VALIDA URL
    ===================================================== */

    const searchForm = document.querySelector('.search-box form');
    const searchInput = document.querySelector('.input-box');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userInput = searchInput.value.trim();

        if (isValidUrl(userInput)) {
            window.location.href = formatUrl(userInput);
        } else {
            searchForm.submit();
        }
    });

    function isValidUrl(input) {
        try {
            new URL(input);
            return true;
        } catch {
            const urlPattern = /^([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i;
            return urlPattern.test(input);
        }
    }

    function formatUrl(input) {
        if (!input.startsWith('http://') && !input.startsWith('https://')) {
            return 'https://' + input;
        }
        return input;
    }

    /* =====================================================
       WALLPAPER
    ===================================================== */

    const changeWallpaperBtn = document.getElementById('change-wallpaper');
    const wallpaperInput = document.getElementById('wallpaper-input');

    if (changeWallpaperBtn && wallpaperInput) {
        changeWallpaperBtn.addEventListener('click', () => {
            wallpaperInput.click();
        });

        wallpaperInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.body.style.backgroundImage = `url('${event.target.result}')`;
                    localStorage.setItem('wallpaper', event.target.result);
                };
                reader.readAsDataURL(file);
            }
        });

        const savedWallpaper = localStorage.getItem('wallpaper');
        if (savedWallpaper) {
            document.body.style.backgroundImage = `url('${savedWallpaper}')`;
        }
    }

    /* =====================================================
       MENU BURGER + FAVORITES SWITCH
    ===================================================== */

    const configureBtn = document.getElementById('configure');
    const configMenu = document.getElementById('config-menu');
    const favoriteSwitch = document.getElementById('favorite-switch');
    const favoritesContainer = document.getElementById('favorites-container');

    if (configureBtn && configMenu) {
        configureBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            configMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            configMenu.classList.add('hidden');
        });
    }

    if (favoriteSwitch && favoritesContainer) {
        const isHidden = localStorage.getItem('favoritesHidden') === 'true';

        favoritesContainer.classList.toggle('hidden', isHidden);
        favoriteSwitch.checked = !isHidden;

        favoriteSwitch.addEventListener('change', () => {
            const isChecked = favoriteSwitch.checked;
            favoritesContainer.classList.toggle('hidden', !isChecked);
            localStorage.setItem('favoritesHidden', !isChecked);
        });
    }

    /* =====================================================
       SEARCH ENGINE DROPDOWN
    ===================================================== */

    const engineButton = document.getElementById('engine-button');
    const engineDropdown = document.getElementById('engine-dropdown');
    const engineIcon = document.getElementById('engine-icon');
    const engineOptions = document.querySelectorAll('.engine-option');

    const engines = {
        duckduckgo: {
            action: 'https://duckduckgo.com/',
            queryParam: 'q',
            icon: 'imgs/duckduckgo.svg'
        },
        google: {
            action: 'https://www.google.com/search',
            queryParam: 'q',
            icon: 'imgs/google.svg'
        },
        bing: {
            action: 'https://www.bing.com/search',
            queryParam: 'q',
            icon: 'imgs/bing.svg'
        },
        startpage: {
            action: 'https://www.startpage.com/search',
            queryParam: 'query',
            icon: 'imgs/startpage.svg'
        }
    };

    function applyEngine(engineKey) {
        const engine = engines[engineKey];
        searchForm.action = engine.action;
        searchForm.querySelector('input').name = engine.queryParam;
        if (engineIcon) engineIcon.src = engine.icon;
        localStorage.setItem('searchEngine', engineKey);
    }

    const savedEngine = localStorage.getItem('searchEngine') || 'duckduckgo';
    applyEngine(savedEngine);

    if (engineButton && engineDropdown) {
        engineButton.addEventListener('click', (e) => {
            e.stopPropagation();
            engineDropdown.classList.toggle('hidden');
        });

        engineOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedEngine = option.dataset.engine;
                applyEngine(selectedEngine);
                engineDropdown.classList.add('hidden');
            });
        });

        document.addEventListener('click', () => {
            engineDropdown.classList.add('hidden');
        });
    }

    /* =====================================================
       FAVORITOS
    ===================================================== */

    const favoritesGrid = document.getElementById('favorites-grid');
    const favoriteModal = document.getElementById('favorite-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const saveFavoriteBtn = document.getElementById('save-favorite');
    const deleteFavoriteBtn = document.getElementById('delete-favorite');
    const favoriteNameInput = document.getElementById('favorite-name');
    const favoriteUrlInput = document.getElementById('favorite-url');

    if (!favoritesGrid) return;

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let currentEditIndex = null;

    loadFavorites();

    function loadFavorites() {
        favoritesGrid.innerHTML = '';

        favorites.forEach((favorite, index) => {
            const item = document.createElement('div');
            item.className = 'favorite-item glass';
            item.innerHTML = `
                <img src="${favorite.icon}" class="favorite-icon">
                <span class="favorite-name">${favorite.name}</span>
            `;

            item.addEventListener('click', () => {
                window.location.href = favorite.url;
            });

            favoritesGrid.appendChild(item);
        });

        const addButton = document.createElement('div');
        addButton.className = 'add-favorite-item glass';
        addButton.innerHTML = `
            <div class="add-favorite-icon">
                <img src="imgs/add.svg" class="favorite-add-icon">
            </div>
            <div class="add-favorite-text">Adicionar</div>
        `;

        addButton.addEventListener('click', () => {
            openModal();
        });

        favoritesGrid.appendChild(addButton);
    }

    function saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    function openModal(index = null) {
        favoriteModal.style.display = 'flex';
        currentEditIndex = index;

        if (index !== null) {
            favoriteNameInput.value = favorites[index].name;
            favoriteUrlInput.value = favorites[index].url;
            deleteFavoriteBtn.classList.remove('hidden');
        } else {
            favoriteNameInput.value = '';
            favoriteUrlInput.value = '';
            deleteFavoriteBtn.classList.add('hidden');
        }
    }

    function closeModal() {
        favoriteModal.style.display = 'none';
        currentEditIndex = null;
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (saveFavoriteBtn) {
        saveFavoriteBtn.addEventListener('click', () => {
            const name = favoriteNameInput.value.trim();
            const url = favoriteUrlInput.value.trim();

            if (!name || !url) return;

            const icon = `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`;

            if (currentEditIndex !== null) {
                favorites[currentEditIndex] = { name, url, icon };
            } else {
                favorites.push({ name, url, icon });
            }

            saveFavorites();
            loadFavorites();
            closeModal();
        });
    }

    if (deleteFavoriteBtn) {
        deleteFavoriteBtn.addEventListener('click', () => {
            if (currentEditIndex !== null) {
                favorites.splice(currentEditIndex, 1);
                saveFavorites();
                loadFavorites();
                closeModal();
            }
        });
    }

});
