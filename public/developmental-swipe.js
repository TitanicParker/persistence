(() => {
  const root = document.querySelector('[data-developmental-reader]');
  if (!root) return;

  const previous = root.getAttribute('data-previous');
  const next = root.getAttribute('data-next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const blockedTarget = (target) => target instanceof Element && Boolean(target.closest('a,button,input,textarea,select,summary,[contenteditable="true"],.cg-rights-gate'));

  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let tracking = false;

  function go(url, direction) {
    if (!url) return;
    root.classList.add(direction === 'next' ? 'is-leaving-next' : 'is-leaving-previous');
    const navigate = () => window.location.assign(url);
    if (reducedMotion) navigate();
    else window.setTimeout(navigate, 115);
  }

  document.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1 || blockedTarget(event.target)) {
      tracking = false;
      return;
    }
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startTime = performance.now();
    tracking = true;
  }, { passive: true });

  document.addEventListener('touchend', (event) => {
    if (!tracking || event.changedTouches.length !== 1) return;
    tracking = false;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    const elapsed = performance.now() - startTime;
    const horizontal = Math.abs(dx) >= 64 && Math.abs(dx) > Math.abs(dy) * 1.35;

    if (!horizontal || elapsed > 1100) return;
    if (dx < 0 && next) go(next, 'next');
    if (dx > 0 && previous) go(previous, 'previous');
  }, { passive: true });

  document.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || blockedTarget(event.target)) return;
    if (event.key === 'ArrowRight' && next) go(next, 'next');
    if (event.key === 'ArrowLeft' && previous) go(previous, 'previous');
  });

  const current = root.querySelector('[data-current-age]');
  if (current instanceof HTMLElement) {
    requestAnimationFrame(() => current.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' }));
  }
})();
