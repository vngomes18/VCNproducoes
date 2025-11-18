// Smooth scroll for internal links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
});

// Lazy load media (images/videos with data-src)
(() => {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const src = el.getAttribute('data-src');
        if (src) { el.setAttribute(el.tagName === 'VIDEO' ? 'src' : 'src', src); }
        if (el.tagName === 'VIDEO') { el.load(); }
        io.unobserve(el);
      }
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('img[data-src], video[data-src]').forEach(el => io.observe(el));
})();