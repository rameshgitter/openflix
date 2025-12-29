
import logo from './assets/logo.png';

export const Sidebar = () => `
  <aside class="sidebar">
    <div class="logo-container">
        <img src="${logo}" alt="OpenFlix" class="logo-img">
    </div>
    <ul class="nav-links">
      <li><a href="#" class="nav-item active" data-page="home">Home</a></li>
      <li><a href="#" class="nav-item" data-page="search">Search</a></li>
      <li><a href="#" class="nav-item" data-page="movies">Movies</a></li>
      <li><a href="#" class="nav-item" data-page="tv">TV Shows</a></li>
      <li><a href="#" class="nav-item" data-page="anime">Anime</a></li>
    </ul>
  </aside>
`;

export const SearchBar = () => `
  <div class="search-bar-container">
    <input type="text" class="search-input" placeholder="Search for movies, TV shows..." id="searchInput">
  </div>
`;

export const MediaCard = (media) => {
  const title = media.title || media.name;
  const date = media.release_date || media.first_air_date || 'N/A';
  const year = date.split('-')[0];
  const poster = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Poster'; // Placeholder

  return `
    <div class="media-card" data-id="${media.id}" data-type="${media.media_type || 'movie'}">
        <img src="${poster}" alt="${title}" class="media-poster" loading="lazy">
        <div class="media-info">
            <h3 class="media-title">${title}</h3>
            <span class="media-year">${year}</span>
        </div>
    </div>
    `;
};

export const Grid = (items) => `
    <div class="media-grid">
        ${items.map(MediaCard).join('')}
    </div>
`;

export const PlayerModal = () => `
<div class="modal-overlay" id="playerModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Now Playing</h3>
            <button class="close-modal" id="closeModal">&times;</button>
        </div>
        <div class="video-container">
            <iframe 
                id="playerFrame" 
                src="" 
                allowfullscreen 
                referrerpolicy="origin"
                allow="autoplay *; encrypted-media *; fullscreen *; picture-in-picture *"
                sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-presentation"
            ></iframe>
        </div>
        <div class="player-controls">
            <div id="episodes-container" class="episodes-container"></div>
        </div>
        <div class="player-footer" style="padding: 1rem; color: #a3a3a3; font-size: 0.9rem; text-align: center;">
            <p><strong>Security Mode:</strong> Sandbox Enabled.</p>
            <p style="font-size: 0.8rem; margin-top: 5px;">We have enabled strict security. If a server doesn't play, please try another one (e.g. <b>Embed.su</b> or <b>2Embed</b>).</p>
        </div>
        <div class="server-controls">
            <span>Server:</span>
            <button class="server-btn active" data-server="vidsrcpro">VidSrc Pro</button>
            <button class="server-btn" data-server="embedsu">Embed.su</button>
            <button class="server-btn" data-server="vidsrc2">VidSrc 2</button>
            <button class="server-btn" data-server="2embed">2Embed</button>
            <button class="server-btn" data-server="smashy">Smashy</button>
        </div>
    </div>
</div>
`;
