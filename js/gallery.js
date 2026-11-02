(function () {
  const bar = document.getElementById('filters');
  const items = [...document.querySelectorAll('.g-item')];
  if (!bar) return;
  bar.addEventListener('click', e => {
    const b = e.target.closest('.chip');
    if (!b) return;
    bar.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
    const f = b.dataset.f || 'all';
    items.forEach(it => it.classList.toggle('hide', f !== 'all' && (it.dataset.cat || '') !== f));
  });
})();
