(() => {
  const VERSION = '2026-08-09-v1';
  const KEY = 'constraint-grammar-rights-acknowledged';
  const path = window.location.pathname;
  const base = '/persistence/';
  const rightsPath = `${base}rights/`;
  const isRightsPage = path === rightsPath || path === `${rightsPath}index.html`;
  if (isRightsPage) return;

  const gate = document.getElementById('cg-rights-gate');
  if (!gate) return;

  const acknowledged = window.localStorage.getItem(KEY) === VERSION;
  if (acknowledged) {
    gate.hidden = true;
    document.documentElement.classList.remove('cg-rights-locked');
    return;
  }

  gate.hidden = false;
  document.documentElement.classList.add('cg-rights-locked');

  const button = gate.querySelector('[data-cg-rights-acknowledge]');
  button?.addEventListener('click', () => {
    window.localStorage.setItem(KEY, VERSION);
    gate.hidden = true;
    document.documentElement.classList.remove('cg-rights-locked');
    const target = document.getElementById('main-content') || document.body;
    if (target instanceof HTMLElement) target.focus?.();
  });
})();
