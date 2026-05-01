document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const resultsDiv = document.getElementById('search-results');
  let fuse;
  fetch('/index.json')
    .then(res => res.json())
    .then(data => {
      fuse = new Fuse(data, {
        keys: ['title', 'content', 'tags'],
        threshold: 0.3,
      });
    });
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (!fuse || !query) { resultsDiv.innerHTML = ''; return; }
    const result = fuse.search(query).slice(0, 5);
    resultsDiv.innerHTML = result.map(r => `
      <div class="card">
        <a href="${r.item.url}"><h3>${r.item.title}</h3></a>
        <p>${r.item.content.substring(0,150)}...</p>
        <div class="tags">${r.item.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
    `).join('');
  });
});