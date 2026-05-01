document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const resultsDiv = document.getElementById('search-results');
  let fuse;

  fetch('/index.json')
    .then(res => res.json())
    .then(data => {
      const options = {
        keys: [
          { name: 'title', weight: 0.5 },
          { name: 'tags', weight: 0.3 },
          { name: 'content', weight: 0.2 }
        ],
        threshold: 0.4,
        includeScore: true
      };
      fuse = new Fuse(data, options);
    })
    .catch(e => console.warn('搜索索引加载失败', e));

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (!fuse || query.length < 1) {
      resultsDiv.innerHTML = '';
      return;
    }
    const result = fuse.search(query).slice(0, 8);
    resultsDiv.innerHTML = result.map(r => `
      <div class="card" style="padding: 1rem;">
        <a href="${r.item.url}" style="font-weight:600;">${r.item.title}</a>
        <p style="color: var(--text-light); font-size: 0.85rem; margin: 0.3rem 0;">${r.item.content.substring(0, 120)}...</p>
        <div class="tags">${r.item.tags.map(t => `<span class="tag">${t}</span>`).join(' ')}</div>
      </div>
    `).join('');
  });
});