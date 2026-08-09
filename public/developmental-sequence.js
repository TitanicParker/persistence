(() => {
  const body = document.body;
  if (!body?.dataset.developmentalAge) return;

  const previous = body.dataset.developmentalPrev || '';
  const next = body.dataset.developmentalNext || '';
  const rail = document.querySelector('.cg-age-rail');
  const current = rail?.querySelector('[aria-current="page"]');

  if (rail && current instanceof HTMLElement) {
    requestAnimationFrame(() => current.scrollIntoView({ block: 'nearest', inline: 'center' }));
  }

  const toast = document.createElement('div');
  toast.className = 'cg-swipe-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.append(toast);

  let toastTimer = 0;
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 900);
  };

  const go = (href, label) => {
    if (!href) {
      showToast(label);
      return;
    }
    window.location.assign(href);
  };

  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let tracking = false;

  const shouldIgnore = (target) => {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest('a,button,input,textarea,select,summary,[contenteditable="true"],.cg-age-rail,.cg-rights-gate'));
  };

  document.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1 || shouldIgnore(event.target)) {
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
    const horizontal = Math.abs(dx);
    const vertical = Math.abs(dy);

    if (elapsed > 1400 || horizontal < 64 || horizontal < vertical * 1.25) return;

    if (dx < 0) {
      go(next, 'You are already at the final edition.');
    } else {
      go(previous, 'This is the first edition in the sequence.');
    }
  }, { passive: true });

  document.addEventListener('keydown', (event) => {
    if (!event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(next, 'You are already at the final edition.');
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(previous, 'This is the first edition in the sequence.');
    }
  });
})();
