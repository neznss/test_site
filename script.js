const form      = document.getElementById('searchForm');
const images    = document.getElementById('images');
const videos    = document.getElementById('videos');
const favItems  = document.getElementById('fav-items');
const tabs      = document.querySelectorAll('.tab');
const contents  = document.querySelectorAll('.tab-content');
const LS_KEY    = 'tg-favs';

let favs = JSON.parse(localStorage.getItem(LS_KEY)) || [];

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t=>t.classList.remove('active'));
    contents.forEach(c=>c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-'+tab.dataset.tab).classList.add('active');
    if (tab.dataset.tab === 'favorites') renderFavorites();
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const q = document.getElementById('query').value.trim();
  if (!q) return;
  images.innerHTML = videos.innerHTML = '';
  fetchImages(q);
  fetchVideos(q);
});

// вспомог: отрисовать карточку
function createCard(item, type) {
  const div = document.createElement('div');
  div.className = 'card';
  div.dataset.id = item.id;
  div.dataset.type = type;
  const btn = document.createElement('span');
  btn.className = 'fav-btn' + (isFav(item.id) ? ' active' : '');
  btn.textContent = '★';
  btn.onclick = () => toggleFav(item, type, btn);
  div.appendChild(btn);
  if (type === 'img') {
    const img = document.createElement('img');
    img.src = item.src;
    div.appendChild(img);
  } else {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${item.id}`;
    iframe.frameBorder = 0;
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    div.appendChild(iframe);
  }
  return div;
}

function isFav(id) {
  return favs.some(f=>f.id === id);
}

function toggleFav(item, type, btn) {
  if (isFav(item.id)) {
    favs = favs.filter(f=>f.id!==item.id);
    btn.classList.remove('active');
  } else {
    favs.push({id: item.id, type, src: item.src});
    btn.classList.add('active');
  }
  localStorage.setItem(LS_KEY, JSON.stringify(favs));
}

function renderFavorites() {
  favItems.innerHTML = '';
  if (!favs.length) {
    favItems.innerHTML = '<p style="color:#888">Нет избранного</p>';
    return;
  }
  favs.forEach(f => {
    const card = createCard({id:f.id, src:f.src}, f.type);
    favItems.appendChild(card);
  });
}

// API-функции
async function fetchImages(q) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=12`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } });
  const { results } = await res.json();
  results.forEach(pic => {
    const item = { id: pic.id, src: pic.urls.small };
    images.appendChild(createCard(item, 'img'));
  });
}

async function fetchVideos(q) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${encodeURIComponent(q)}&key=${YOUTUBE_API_KEY}`;
  const res = await fetch(url);
  const { items } = await res.json();
  items.forEach(it => {
    const item = { id: it.id.videoId, src: '' };
    videos.appendChild(createCard(item, 'video'));
  });
}
