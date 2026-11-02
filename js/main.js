(function () {
  const BRAND = { name: 'Podscoworkingspace', tag: '' };
  const CONTACT = { phone: '9845010100', email: 'vasants.vlf@gmail.com', address: '44/2A, Bellary Road, Hebbal, Bengaluru, Karnataka – 560092, India' };
  const NAV = [['index.html', 'Home'], ['about.html', 'About'], ['workspaces.html', 'Workspaces'], ['amenities.html', 'Amenities'], ['gallery.html', 'Gallery'], ['floor-plan.html', 'Floor Plan'], ['location.html', 'Location'], ['contact.html', 'Contact']];

  const P = {
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10.5 10.5 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
    broom: '<path d="m14 3 7 7M3 21l5-1 9-9-4-4-9 9z"/><path d="M6 15l3 3"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    coffee: '<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2M8 2v3M12 2v3"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a7 7 0 0 1 4 6"/>',
    server: '<rect x="3" y="3" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="18" height="7" rx="1.5"/><path d="M7 6.5h.01M7 17.5h.01M12 6.5h5M12 17.5h5"/>',
    board: '<rect x="2" y="3" width="20" height="13" rx="1.5"/><path d="M12 16v5M8 21h8M7 11l3-3 3 2 4-4"/>',
    sofa: '<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3M3 12a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3zM5 17v2M19 17v2"/>',
    car: '<path d="M5 16V11l2-5h10l2 5v5zM3 16h18v3H3zM7 13h.01M17 13h.01"/>',
    armchair: '<path d="M6 11V7a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4M4 12a2 2 0 0 1 4 0v3h8v-3a2 2 0 0 1 4 0v5H4zM6 17v3M18 17v3"/>',
    cup: '<path d="M6 3h12l-1 8a5 5 0 0 1-10 0zM12 16v5M8 21h8"/>',
    printer: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3"/><rect x="7" y="14" width="10" height="7"/>',
    snow: '<path d="M12 2v20M4 7l16 10M20 7 4 17M9 3l3 2 3-2M9 21l3-2 3 2"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
    cctv: '<path d="M3 8l13-4 2 6L5 14zM18 10l3 1M10 15l-2 6M5 21h6"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5"/>',
    volume: '<path d="M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
    flame: '<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-3 2-4 5-4 7-1-1-2-2-2-4-3 2-4 5-4 7a7 7 0 0 0 7 7z"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 15v2"/>',
    door: '<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M3 21h18M14 12h.01"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    up: '<path d="m6 14 6-6 6 6"/>',
    pin: '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    building: '<path d="M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M15 9h4a1 1 0 0 1 1 1v11M2 21h20M8 7h3M8 11h3M8 15h3"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    cube: '<path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10"/>',
    rocket: '<path d="M5 15c-1 1-2 4-2 6 2 0 5-1 6-2M14 4c4-2 7-1 7-1s1 3-1 7l-7 7-6-6zM15 9h.01"/>',
    trend: '<path d="m3 17 6-6 4 4 8-9M15 6h6v6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
    glass: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M12 3v18"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3"/>',
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    zoomin: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4M11 8v6M8 11h6"/>'
  };
  window.icon = n => '<svg viewBox="0 0 24 24" aria-hidden="true">' + (P[n] || P.check) + '</svg>';
  const paintIcons = root => (root || document).querySelectorAll('[data-icon]:not([data-done])').forEach(el => { el.innerHTML = icon(el.dataset.icon); el.dataset.done = 1; });
  window.paintIcons = paintIcons;

  const page = location.pathname.split('/').pop() || 'index.html';
  const hero = document.body.dataset.hero === 'img';

  const header = document.createElement('header');
  header.className = 'site-header' + (hero ? '' : ' always');
  header.innerHTML = `<div class="container nav">
    <a class="brand" href="index.html" aria-label="${BRAND.name} home">${BRAND.name}</span></a>
    <button class="burger" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
    <nav class="nav-links" aria-label="Main">${NAV.filter(n => n[0] !== 'contact.html').map(n => `<a href="${n[0]}" class="${n[0] === page ? 'active' : ''}">${n[1]}</a>`).join('')}
    <a href="contact.html" class="${page === 'contact.html' ? 'active' : ''}">Contact</a>
    <a href="contact.html#visit" class="btn gold sm">Book a Visit</a></nav></div>`;
  document.body.prepend(header);

  const burger = header.querySelector('.burger'), links = header.querySelector('.nav-links');
  const closeMenu = () => { links.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); };
  burger.addEventListener('click', () => { const o = links.classList.toggle('open'); burger.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); document.body.classList.toggle('menu-open', o); });
  links.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `<div class="container"><div class="f-grid">
    <div><a class="brand" href="index.html">${BRAND.name}<small>${BRAND.tag}</small></span></a>
    <p style="max-width:38ch">Managed office spaces, meeting rooms and workstations in Hebbal, Bengaluru. Your business needs space to grow.</p></div>
    <div><h4>Explore</h4><ul>${NAV.map(n => `<li><a href="${n[0]}">${n[1]}</a></li>`).join('')}</ul></div>
    <div><h4>Contact</h4><ul>
    <li><a href="tel:${CONTACT.phone}">${CONTACT.phone}</a></li>
    <li><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></li>
    <li style="color:#a9a396">${CONTACT.address}</li>
    <li><a href="contact.html#visit" style="color:var(--sand);font-weight:600">Book a visit →</a></li></ul></div></div>
    <div class="f-bottom"><span>© <span id="yr"></span> ${BRAND.name}. All rights reserved.</span><span>Images are design visuals of the workspace.</span></div></div>`;
  document.body.append(footer);
  footer.querySelector('#yr').textContent = new Date().getFullYear();

  const top = document.createElement('button');
  top.className = 'to-top'; top.setAttribute('aria-label', 'Back to top'); top.innerHTML = '<span data-icon="up"></span>';
  document.body.append(top);
  top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const onScroll = () => { const y = window.scrollY; header.classList.toggle('solid', y > 40); top.classList.toggle('on', y > 600); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); history.replaceState(null, '', a.getAttribute('href')); }
  }));

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 }) : null;
  document.querySelectorAll('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));

  const lb = document.createElement('div');
  lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-label', 'Image viewer');
  lb.innerHTML = '<button class="lb-btn lb-close" aria-label="Close">✕</button><button class="lb-btn lb-prev" aria-label="Previous">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-btn lb-next" aria-label="Next">›</button>';
  document.body.append(lb);
  const lbImg = lb.querySelector('img'), lbCap = lb.querySelector('figcaption');
  let set = [], idx = 0;
  const show = i => { idx = (i + set.length) % set.length; lbImg.style.opacity = 0; const it = set[idx]; setTimeout(() => { lbImg.src = it.src; lbImg.alt = it.title; lbCap.textContent = it.title; lbImg.style.opacity = 1; }, 150); lb.querySelectorAll('.lb-prev,.lb-next').forEach(b => b.style.display = set.length > 1 ? '' : 'none'); };
  const collect = () => [...document.querySelectorAll('[data-lightbox]')].filter(el => !el.classList.contains('hide')).map(el => ({ el, src: el.dataset.src || el.querySelector('img').src, title: el.dataset.title || '' }));
  const open = el => { set = collect(); const i = set.findIndex(s => s.el === el); lb.classList.add('open'); document.body.style.overflow = 'hidden'; show(i < 0 ? 0 : i); lb.querySelector('.lb-close').focus(); };
  const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
  document.addEventListener('click', e => { const t = e.target.closest('[data-lightbox]'); if (t) { e.preventDefault(); open(t); } });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('[data-lightbox]')) open(e.target); });
  lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lb-close')) close(); else if (e.target.closest('.lb-prev')) show(idx - 1); else if (e.target.closest('.lb-next')) show(idx + 1); });
  document.addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
  let sx = 0; lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1)); });

  paintIcons();
})();
