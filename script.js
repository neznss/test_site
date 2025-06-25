const form   = document.getElementById('searchForm');
const images = document.getElementById('images');
const videos = document.getElementById('videos');

form.addEventListener('submit', e => {
  e.preventDefault();
  const q = document.getElementById('query').value.trim();
  if (!q) return;
  images.innerHTML = videos.innerHTML = '';
  fetchImages(q);
  fetchVideos(q);
});

async function fetchImages(q) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=12`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
  });
  const data = await res.json();
  data.results.forEach(pic => {
    const img = document.createElement('img');
    img.src = pic.urls.small;
    images.appendChild(img);
  });
}

async function fetchVideos(q) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${encodeURIComponent(q)}&key=${YOUTUBE_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  data.items.forEach(item => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${item.id.videoId}`;
    iframe.frameBorder = 0;
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    videos.appendChild(iframe);
  });
}
