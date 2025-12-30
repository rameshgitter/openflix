(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))u(c);new MutationObserver(c=>{for(const o of c)if(o.type==="childList")for(const v of o.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&u(v)}).observe(document,{childList:!0,subtree:!0});function i(c){const o={};return c.integrity&&(o.integrity=c.integrity),c.referrerPolicy&&(o.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?o.credentials="include":c.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function u(c){if(c.ep)return;c.ep=!0;const o=i(c);fetch(c.href,o)}})();const P="/OpenFlix/assets/logo-bz4HuAEb.png",_=()=>`
  <aside class="sidebar">
    <div class="logo-container">
        <img src="${P}" alt="OpenFlix" class="logo-img">
    </div>
    <ul class="nav-links">
      <li><a href="#" class="nav-item active" data-page="home">Home</a></li>
      <li><a href="#" class="nav-item" data-page="search">Search</a></li>
      <li><a href="#" class="nav-item" data-page="movies">Movies</a></li>
      <li><a href="#" class="nav-item" data-page="tv">TV Shows</a></li>
      <li><a href="#" class="nav-item" data-page="anime">Anime</a></li>
    </ul>
  </aside>
`,q=()=>`
  <div class="search-bar-container">
    <input type="text" class="search-input" placeholder="Search for movies, TV shows..." id="searchInput">
  </div>
`,H=t=>{const n=t.title||t.name,u=(t.release_date||t.first_air_date||"N/A").split("-")[0],c=t.poster_path?`https://image.tmdb.org/t/p/w500${t.poster_path}`:"https://via.placeholder.com/300x450?text=No+Poster";return`
    <div class="media-card" data-id="${t.id}" data-type="${t.media_type||"movie"}">
        <img src="${c}" alt="${n}" class="media-poster" loading="lazy">
        <div class="media-info">
            <h3 class="media-title">${n}</h3>
            <span class="media-year">${u}</span>
        </div>
    </div>
    `},f=t=>`
    <div class="media-grid">
        ${t.map(H).join("")}
    </div>
`,B=()=>`
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
`,g="b6b677eb7d4ec17f700e3d4dfc31d005",b="https://api.themoviedb.org/3",E=async(t="all",n="day")=>{try{return(await(await fetch(`${b}/trending/${t}/${n}?api_key=${g}`)).json()).results}catch(i){return console.error("Error fetching trending:",i),[]}},O=async t=>{if(!t)return[];try{return(await(await fetch(`${b}/search/multi?api_key=${g}&query=${encodeURIComponent(t)}`)).json()).results}catch(n){return console.error("Error searching:",n),[]}},k=async(t,n)=>{try{return await(await fetch(`${b}/${n}/${t}?api_key=${g}&append_to_response=credits,similar`)).json()}catch(i){return console.error("Error fetching details:",i),null}},x=async(t,n)=>{try{return await(await fetch(`${b}/tv/${t}/season/${n}?api_key=${g}`)).json()}catch(i){return console.error("Error fetching season:",i),null}},F=document.querySelector("#app");let r={page:"home",query:"",currentId:null,currentType:null,currentSeason:1,currentEpisode:1,numberOfSeasons:1};const U=async()=>{F.innerHTML=`
        ${_()}
        <main class="main-content">
            ${q()}
            <div id="content-area">
                Loading...
            </div>
        </main>
        ${B()}
    `;const t=document.getElementById("content-area"),n=document.getElementById("searchInput"),i=document.getElementById("playerModal"),u=document.getElementById("playerFrame"),c=document.getElementById("closeModal"),o=document.getElementById("episodes-container"),v=(a,e,s,d=1,l=1)=>a==="embedsu"?s==="movie"?`https://embed.su/embed/movie/${e}`:`https://embed.su/embed/tv/${e}/${d}/${l}`:a==="vidsrcpro"?s==="movie"?`https://vidsrc.pro/embed/movie/${e}`:`https://vidsrc.pro/embed/tv/${e}/${d}/${l}`:a==="vidsrc2"?s==="movie"?`https://vidsrc.to/embed/movie/${e}`:`https://vidsrc.to/embed/tv/${e}/${d}/${l}`:a==="2embed"?s==="movie"?`https://www.2embed.cc/embed/${e}`:`https://www.2embed.cc/embedtv/${e}&s=${d}&e=${l}`:a==="smashy"?s==="movie"?`https://player.smashy.stream/movie/${e}`:`https://player.smashy.stream/tv/${e}&s=${d}&e=${l}`:"",S=async(a,e)=>{o.innerHTML='<div style="padding:1rem">Loading episodes...</div>';const s=await x(a,e);if(!s){o.innerHTML='<div style="padding:1rem">Failed to load episodes.</div>';return}let d='<div class="season-selector">';for(let p=1;p<=r.numberOfSeasons;p++)d+=`<button class="season-btn ${p==e?"active":""}" data-season="${p}">Season ${p}</button>`;d+="</div>";let l='<div class="episode-list">';s.episodes.forEach(p=>{const m=p.episode_number==r.currentEpisode&&e==r.currentSeason;l+=`
                <button 
                    class="episode-btn ${m?"active":""}" 
                    data-season="${e}" 
                    data-episode="${p.episode_number}"
                    title="${p.name}"
                >
                    E${p.episode_number}
                </button>
            `}),l+="</div>",o.innerHTML=d+l,o.querySelectorAll(".season-btn").forEach(p=>{p.addEventListener("click",m=>{const y=parseInt(m.target.dataset.season);r.currentSeason=y,r.currentEpisode=1,S(a,y),h()})}),o.querySelectorAll(".episode-btn").forEach(p=>{p.addEventListener("click",m=>{const y=parseInt(m.target.dataset.season),T=parseInt(m.target.dataset.episode);r.currentSeason=y,r.currentEpisode=T,o.querySelectorAll(".episode-btn").forEach(A=>A.classList.remove("active")),m.target.classList.add("active"),h()})})},h=()=>{const a=document.querySelector(".server-btn.active").dataset.server,e=v(a,r.currentId,r.currentType,r.currentSeason,r.currentEpisode);u.src=e;const s=new URLSearchParams(window.location.search);r.currentType==="movie"?(s.set("movie",r.currentId),s.delete("tv"),s.delete("s"),s.delete("e")):(s.set("tv",r.currentId),s.set("s",r.currentSeason),s.set("e",r.currentEpisode),s.delete("movie")),window.history.replaceState({},"",`${window.location.pathname}?${s.toString()}`)},$=async(a,e,s=1,d=1)=>{if(r.currentId=a,r.currentType=e,r.currentSeason=parseInt(s),r.currentEpisode=parseInt(d),document.querySelectorAll(".server-btn").forEach(l=>l.classList.remove("active")),document.querySelector('[data-server="vidsrcpro"]').classList.add("active"),e==="tv"){o.style.display="block",o.innerHTML='<div style="padding:1rem">Loading show info...</div>';const l=await k(a,"tv");l&&(r.numberOfSeasons=l.number_of_seasons,await S(a,r.currentSeason))}else o.style.display="none";h(),u.allow="autoplay *; encrypted-media *; fullscreen *; picture-in-picture *",u.referrerPolicy="origin",i.classList.add("open")},I=()=>{i.classList.remove("open"),u.src="",r.currentId=null,r.currentType=null,window.history.replaceState({},"",window.location.pathname)};document.querySelectorAll(".server-btn").forEach(a=>{a.addEventListener("click",e=>{document.querySelectorAll(".server-btn").forEach(s=>s.classList.remove("active")),e.target.classList.add("active"),r.currentId&&h()})}),c.addEventListener("click",I),t.addEventListener("click",a=>{const e=a.target.closest(".media-card");if(e){const s=e.dataset.id,d=e.dataset.type;$(s,d)}});const M=()=>{const a=new URLSearchParams(window.location.search),e=a.get("movie"),s=a.get("tv");if(e)$(e,"movie");else if(s){const d=a.get("s")||1,l=a.get("e")||1;$(s,"tv",d,l)}};n.addEventListener("input",C(async a=>{const e=a.target.value;if(e.length>2){r.page="search",r.query=e;const s=await O(e);t.innerHTML=f(s)}else e.length===0&&w()},500)),document.querySelectorAll(".nav-item").forEach(a=>{a.addEventListener("click",e=>{e.preventDefault(),document.querySelectorAll(".nav-item").forEach(d=>d.classList.remove("active")),e.target.closest(".nav-item").classList.add("active");const s=e.target.getAttribute("data-page");s==="home"?w():s==="movies"?L("movie"):s==="tv"?L("tv"):s==="anime"&&j()})}),r.page==="home"&&w(),M()},L=async t=>{const n=document.getElementById("content-area");n.innerHTML='<div class="loader">Loading Content...</div>';const i=await E(t);n.innerHTML=`
        <h2>Popular ${t==="movie"?"Movies":"TV Shows"}</h2>
        ${f(i)}
    `,r.page=t},j=async()=>{const t=document.getElementById("content-area");t.innerHTML='<div class="loader">Loading Anime...</div>';const n=await E("tv");t.innerHTML=`
        <h2>Popular Anime (Coming Soon)</h2>
        <p>Anime specific filter requires API update.</p>
        ${f(n)}
    `},w=async()=>{const t=document.getElementById("content-area");t.innerHTML='<div class="loader">Loading Trending...</div>';const n=await E();t.innerHTML=`
        <h2>Trending Now</h2>
        ${f(n)}
    `,r.page="home"};function C(t,n){let i;return function(...u){clearTimeout(i),i=setTimeout(()=>t.apply(this,u),n)}}U();
