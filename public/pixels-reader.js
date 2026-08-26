(() => {
  const chapter = document.body.dataset.pixelsChapter;
  const title = document.body.dataset.pixelsTitle;
  const currentPath = window.location.pathname;
  const storageKey = 'pixels-of-clarity:last-read';

  if (chapter && title) {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ chapter: Number(chapter), title, path: currentPath }));
    } catch {}
  }

  const continueLinks = document.querySelectorAll('[data-pixels-continue]');
  if (!continueLinks.length) return;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (!saved?.path || !saved?.chapter || !saved?.title) return;
    continueLinks.forEach((link) => {
      link.href = saved.path;
      link.textContent = `Continue · Chapter ${saved.chapter}`;
      link.removeAttribute('hidden');
    });
  } catch {}
})();
