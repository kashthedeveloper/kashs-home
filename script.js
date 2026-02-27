document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
     * MENU BURGER
     * ===================================================== */

    const configureBtn = document.getElementById('configure');
    const configMenu = document.getElementById('config-menu');

    if (configureBtn && configMenu) {
        configureBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            configMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            configMenu.classList.add('hidden');
        });

        configMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    /* =====================================================
     * TOGGLE FAVORITOS
     * ===================================================== */

    const favoriteSwitch = document.getElementById('favorite-switch');
    const favoritesContainer = document.getElementById('favorites-container');

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
     * SEARCH ENGINE DROPDOWN
     * ===================================================== */

    const searchForm = document.querySelector('.search-box form');
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
        engineIcon.src = engine.icon;
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
                applyEngine(option.dataset.engine);
                engineDropdown.classList.add('hidden');
            });
        });

        document.addEventListener('click', () => {
            engineDropdown.classList.add('hidden');
        });

        engineDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    /* =====================================================
     * WALLPAPER
     * ===================================================== */

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
     * FAVORITOS
     * ===================================================== */

    const favoritesGrid = document.getElementById('favorites-grid');
    const addModal = document.getElementById('favorite-modal');
    const editModal = document.getElementById('edit-favorite-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    const saveFavoriteBtn = document.getElementById('save-favorite');
    const saveEditBtn = document.getElementById('save-edit-favorite');
    const deleteFavoriteBtn = document.getElementById('delete-favorite');

    const favoriteNameInput = document.getElementById('favorite-name');
    const favoriteUrlInput = document.getElementById('favorite-url');

    const editNameInput = document.getElementById('edit-favorite-name');
    const editUrlInput = document.getElementById('edit-favorite-url');
    const editIconFileInput = document.getElementById('edit-favorite-icon-file');
    const editIconPreview = document.getElementById('edit-icon-preview');

    if (!favoritesGrid) return;

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let currentEditIndex = null;
    let uploadedIconBase64 = null;

    loadFavorites();

    function loadFavorites() {

        favoritesGrid.innerHTML = '';

        favorites.forEach((favorite, index) => {

            const item = document.createElement('div');
            item.className = 'favorite-item glass';

            item.innerHTML = `
            <button class="favorite-config">
            <img src="imgs/menu-dots-vertical.svg" class="favorite-config-icon">
            </button>
            <img src="${favorite.icon}" class="favorite-icon">
            <span class="favorite-name">${favorite.name}</span>
            `;

            item.addEventListener('click', (e) => {
                if (!e.target.closest('.favorite-config')) {
                    window.location.href = favorite.url;
                }
            });

            item.querySelector('.favorite-config')
            .addEventListener('click', (e) => {
                e.stopPropagation();
                openEditModal(index);
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
            favoriteNameInput.value = '';
            favoriteUrlInput.value = '';
            addModal.style.display = 'flex';
        });

        favoritesGrid.appendChild(addButton);
    }

    function saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    saveFavoriteBtn?.addEventListener('click', () => {

        const name = favoriteNameInput.value.trim();
        const url = favoriteUrlInput.value.trim();

        if (!name || !url) return;

        const icon = `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`;

        favorites.push({ name, url, icon });

        saveFavorites();
        loadFavorites();
        addModal.style.display = 'none';
    });

    function openEditModal(index) {

        currentEditIndex = index;
        uploadedIconBase64 = null;

        const favorite = favorites[index];

        editNameInput.value = favorite.name;
        editUrlInput.value = favorite.url;

        editIconPreview.src = favorite.icon;
        editIconPreview.style.display = 'block';

        editModal.style.display = 'flex';
    }

    editIconFileInput?.addEventListener('change', (e) => {

        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            uploadedIconBase64 = event.target.result;
            editIconPreview.src = uploadedIconBase64;
            editIconPreview.style.display = 'block';
        };

        reader.readAsDataURL(file);
    });

    saveEditBtn?.addEventListener('click', () => {

        if (currentEditIndex === null) return;

        const name = editNameInput.value.trim();
        const url = editUrlInput.value.trim();
        if (!name || !url) return;

        const icon = uploadedIconBase64 ||
        favorites[currentEditIndex].icon ||
        `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`;

        favorites[currentEditIndex] = { name, url, icon };

        saveFavorites();
        loadFavorites();

        editModal.style.display = 'none';
        currentEditIndex = null;
    });

    deleteFavoriteBtn?.addEventListener('click', () => {

        if (currentEditIndex === null) return;

        favorites.splice(currentEditIndex, 1);

        saveFavorites();
        loadFavorites();

        editModal.style.display = 'none';
        currentEditIndex = null;
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            addModal.style.display = 'none';
            editModal.style.display = 'none';
            currentEditIndex = null;
        });
    });

});
