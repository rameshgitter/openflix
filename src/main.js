import './style.css';
import { Sidebar, SearchBar, Grid, PlayerModal } from './ui.js';
import { fetchTrending, searchMulti, fetchDetails, fetchSeason } from './api.js';

const app = document.querySelector('#app');

// State
let state = {
    page: 'home',
    query: '',
    results: [],
    currentId: null,
    currentType: null,
    currentSeason: 1,
    currentEpisode: 1,
    numberOfSeasons: 1
};

// Render Logic
const render = async () => {
    app.innerHTML = `
        ${Sidebar()}
        <main class="main-content">
            ${SearchBar()}
            <div id="content-area">
                Loading...
            </div>
        </main>
        ${PlayerModal()}
    `;

    const contentArea = document.getElementById('content-area');
    const searchInput = document.getElementById('searchInput');
    const playerModal = document.getElementById('playerModal');
    const playerFrame = document.getElementById('playerFrame');
    const closeModal = document.getElementById('closeModal');
    const episodesContainer = document.getElementById('episodes-container');

    // Server Logic
    const getUrl = (server, id, type, s = 1, e = 1) => {
        if (server === 'embedsu') {
            return type === 'movie'
                ? `https://embed.su/embed/movie/${id}`
                : `https://embed.su/embed/tv/${id}/${s}/${e}`;
        } else if (server === 'vidsrcpro') {
            return type === 'movie'
                ? `https://vidsrc.pro/embed/movie/${id}`
                : `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`;
        } else if (server === 'vidsrc2') {
            return type === 'movie'
                ? `https://vidsrc.to/embed/movie/${id}`
                : `https://vidsrc.to/embed/tv/${id}/${s}/${e}`;
        } else if (server === '2embed') {
            return type === 'movie'
                ? `https://www.2embed.cc/embed/${id}`
                : `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`;
        } else if (server === 'smashy') {
            return type === 'movie'
                ? `https://player.smashy.stream/movie/${id}`
                : `https://player.smashy.stream/tv/${id}&s=${s}&e=${e}`;
        }
        return '';
    };

    // Episode & Season Logic
    const renderEpisodes = async (tvId, seasonNum) => {
        episodesContainer.innerHTML = '<div style="padding:1rem">Loading episodes...</div>';
        const seasonData = await fetchSeason(tvId, seasonNum);

        if (!seasonData) {
            episodesContainer.innerHTML = '<div style="padding:1rem">Failed to load episodes.</div>';
            return;
        }

        // Render Season Buttons (Horizontal)
        let seasonButtons = '<div class="season-selector">';
        for (let i = 1; i <= state.numberOfSeasons; i++) {
            seasonButtons += `<button class="season-btn ${i == seasonNum ? 'active' : ''}" data-season="${i}">Season ${i}</button>`;
        }
        seasonButtons += '</div>';

        // Render Episode Grid
        let episodeGrid = '<div class="episode-list">';
        seasonData.episodes.forEach(ep => {
            const isSelected = ep.episode_number == state.currentEpisode && seasonNum == state.currentSeason;
            episodeGrid += `
                <button 
                    class="episode-btn ${isSelected ? 'active' : ''}" 
                    data-season="${seasonNum}" 
                    data-episode="${ep.episode_number}"
                    title="${ep.name}"
                >
                    E${ep.episode_number}
                </button>
            `;
        });
        episodeGrid += '</div>';

        episodesContainer.innerHTML = seasonButtons + episodeGrid;

        // Add Listeners
        episodesContainer.querySelectorAll('.season-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const s = parseInt(e.target.dataset.season);
                state.currentSeason = s;
                // Reset to ep 1 when changing season
                state.currentEpisode = 1;
                renderEpisodes(tvId, s);
                updatePlayerUrl();
            });
        });

        episodesContainer.querySelectorAll('.episode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const s = parseInt(e.target.dataset.season);
                const ep = parseInt(e.target.dataset.episode);
                state.currentSeason = s;
                state.currentEpisode = ep;

                // Update active state visually immediately
                episodesContainer.querySelectorAll('.episode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                updatePlayerUrl();
            });
        });
    };

    const updatePlayerUrl = () => {
        const activeServer = document.querySelector('.server-btn.active').dataset.server;
        const url = getUrl(activeServer, state.currentId, state.currentType, state.currentSeason, state.currentEpisode);
        playerFrame.src = url;

        // Update URL State
        const params = new URLSearchParams(window.location.search);
        if (state.currentType === 'movie') {
            params.set('movie', state.currentId);
            params.delete('tv');
            params.delete('s');
            params.delete('e');
        } else {
            params.set('tv', state.currentId);
            params.set('s', state.currentSeason);
            params.set('e', state.currentEpisode);
            params.delete('movie');
        }
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    }

    // Player Utils
    const openPlayer = async (id, type, season = 1, episode = 1) => {
        state.currentId = id;
        state.currentType = type;
        state.currentSeason = parseInt(season);
        state.currentEpisode = parseInt(episode);

        // Reset active buttons and set Default to VidSrc Pro
        document.querySelectorAll('.server-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-server="vidsrcpro"]').classList.add('active');

        // Show/Hide Episodes Container
        if (type === 'tv') {
            episodesContainer.style.display = 'block';
            episodesContainer.innerHTML = '<div style="padding:1rem">Loading show info...</div>';

            // Fetch Details to get season count
            const details = await fetchDetails(id, 'tv');
            if (details) {
                state.numberOfSeasons = details.number_of_seasons;
                await renderEpisodes(id, state.currentSeason);
            }
        } else {
            episodesContainer.style.display = 'none';
        }

        updatePlayerUrl();

        playerFrame.allow = "autoplay *; encrypted-media *; fullscreen *; picture-in-picture *";
        playerFrame.referrerPolicy = "origin";
        playerModal.classList.add('open');
    };

    const closePlayer = () => {
        playerModal.classList.remove('open');
        playerFrame.src = '';
        state.currentId = null;
        state.currentType = null;
        // Clear URL params
        window.history.replaceState({}, '', window.location.pathname);
    };

    // Server Switching
    document.querySelectorAll('.server-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.server-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            if (state.currentId) updatePlayerUrl();
        });
    });

    closeModal.addEventListener('click', closePlayer);

    // Content Click Handling
    contentArea.addEventListener('click', (e) => {
        const card = e.target.closest('.media-card');
        if (card) {
            const id = card.dataset.id;
            const type = card.dataset.type;
            openPlayer(id, type);
        }
    });

    // Handle URL Params on Load
    const checkUrlParams = () => {
        const params = new URLSearchParams(window.location.search);
        const movieId = params.get('movie');
        const tvId = params.get('tv');

        if (movieId) {
            openPlayer(movieId, 'movie');
        } else if (tvId) {
            const s = params.get('s') || 1;
            const e = params.get('e') || 1;
            openPlayer(tvId, 'tv', s, e);
        }
    };

    // Event Listeners
    searchInput.addEventListener('input', debounce(async (e) => {
        const query = e.target.value;
        if (query.length > 2) {
            state.page = 'search';
            state.query = query;
            const results = await searchMulti(query);
            contentArea.innerHTML = Grid(results);
        } else if (query.length === 0) {
            loadHome();
        }
    }, 500));

    // Sidebar Navigation
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            e.target.closest('.nav-item').classList.add('active');

            const page = e.target.getAttribute('data-page');
            if (page === 'home') loadHome();
            else if (page === 'movies') loadByGenre('movie');
            else if (page === 'tv') loadByGenre('tv');
            else if (page === 'anime') loadAnime();
        });
    });

    if (state.page === 'home') {
        loadHome();
    }

    // Check params after initial render
    checkUrlParams();
};

const loadByGenre = async (type) => {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '<div class="loader">Loading Content...</div>';
    const trending = await fetchTrending(type);
    contentArea.innerHTML = `
        <h2>Popular ${type === 'movie' ? 'Movies' : 'TV Shows'}</h2>
        ${Grid(trending)}
    `;
    state.page = type;
}

const loadAnime = async () => {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '<div class="loader">Loading Anime...</div>';
    const results = await fetchTrending('tv');
    contentArea.innerHTML = `
        <h2>Popular Anime (Coming Soon)</h2>
        <p>Anime specific filter requires API update.</p>
        ${Grid(results)}
    `;
};

const loadHome = async () => {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '<div class="loader">Loading Trending...</div>';
    const trending = await fetchTrending();
    contentArea.innerHTML = `
        <h2>Trending Now</h2>
        ${Grid(trending)}
    `;
    state.page = 'home';
};

// Utils
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Initial Render
render();
