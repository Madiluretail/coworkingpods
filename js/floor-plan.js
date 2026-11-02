(function () {
  const $ = id => document.getElementById(id);

  /* ---------- 2D viewer ---------- */
  const pbox = $('plan2d'), img = $('plan-img');
  let sc = 1, tx = 0, ty = 0, minSc = .2;
  const apply = () => { img.style.transform = `translate(${tx}px,${ty}px) scale(${sc})`; };
  const fit = () => {
    const bw = pbox.clientWidth, bh = pbox.clientHeight, iw = img.naturalWidth || 1564, ih = img.naturalHeight || 944;
    sc = minSc = Math.min(bw / iw, bh / ih); tx = (bw - iw * sc) / 2; ty = (bh - ih * sc) / 2; apply();
  };
  const zoomAt = (f, cx, cy) => {
    const n = Math.min(Math.max(sc * f, minSc), 4);
    tx = cx - (cx - tx) * (n / sc); ty = cy - (cy - ty) * (n / sc); sc = n; apply();
  };
  img.addEventListener('load', fit); if (img.complete) fit();
  window.addEventListener('resize', fit);
  pbox.addEventListener('wheel', e => { e.preventDefault(); const r = pbox.getBoundingClientRect(); zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
  const pts = new Map(); let pd = 0;
  pbox.addEventListener('pointerdown', e => { pbox.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); pbox.style.cursor = 'grabbing'; pd = 0; });
  pbox.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return;
    const prev = pts.get(e.pointerId);
    if (pts.size === 2) {
      const o = [...pts.entries()].find(p => p[0] !== e.pointerId)[1];
      const d0 = Math.hypot(prev[0] - o[0], prev[1] - o[1]), d1 = Math.hypot(e.clientX - o[0], e.clientY - o[1]);
      const r = pbox.getBoundingClientRect(); if (d0) zoomAt(d1 / d0, (e.clientX + o[0]) / 2 - r.left, (e.clientY + o[1]) / 2 - r.top);
    } else { tx += e.clientX - prev[0]; ty += e.clientY - prev[1]; apply(); }
    pts.set(e.pointerId, [e.clientX, e.clientY]);
  });
  const up = e => { pts.delete(e.pointerId); if (!pts.size) pbox.style.cursor = 'grab'; };
  pbox.addEventListener('pointerup', up); pbox.addEventListener('pointercancel', up);
  const mid = f => zoomAt(f, pbox.clientWidth / 2, pbox.clientHeight / 2);
  $('z-in').onclick = () => mid(1.3); $('z-out').onclick = () => mid(1 / 1.3); $('z-fit').onclick = fit;
  $('z-open').onclick = () => window.open(img.src, '_blank');
  $('plan-tabs').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $('plan-tabs').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    img.src = b.dataset.src;
  });

  /* ---------- 3D model ---------- */
  const stage = $('stage'), loading = $('loading'), info = $('info');
  if (!window.THREE || !THREE.OrbitControls) { loading.textContent = 'The 3D library could not be loaded. Make sure the assets/models/lib folder is present.'; return; }
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
  catch (e) { loading.textContent = 'Your browser could not start WebGL, so the 3D model cannot be shown. The 2D plan is still available.'; return; }

  const TYPES = {
    office: { c: 0xe2d2b4, n: 'Workstation rooms (WS)' }, meeting: { c: 0xb9cfca, n: 'Meeting room' },
    common: { c: 0xf0eadf, n: 'Reception, waiting lobby & lobby' }, service: { c: 0xc9c3b6, n: 'Comms, UPS, battery & dishwashing' },
    wash: { c: 0xc7d7e2, n: 'Washrooms' }, core: { c: 0x9aa0a6, n: 'Lift & stair cores' }, store: { c: 0xcdbb9d, n: 'Store room' }, corr: { c: 0xf4efe5, n: 'Corridors / circulation' }
  };
  const legend = $('legend');
  legend.innerHTML = Object.entries(TYPES).map(([k, t]) => `<button data-t="${k}"><span class="sw" style="background:#${t.c.toString(16).padStart(6, '0')}"></span>${t.n}</button>`).join('');

  const R = [];
  const rm = (name, area, ws, t, r, door, wall, id) => R.push({ name, area, ws, t, r, door, wall: wall || 'glass', id });
  rm('9WS', '27.665', 9, 'office', [183, 12, 458, 152], ['b', .92]);
  rm('4WS', '10.055', 4, 'office', [464, 12, 568, 158], ['b', .3]);
  rm('Comms', '12.495', 0, 'service', [574, 12, 688, 158], ['b', .94], 'solid', 'comms');
  rm('4WS', '10.455', 4, 'office', [694, 12, 795, 158], ['b', .1]);
  rm('4WS', '10.435', 4, 'office', [801, 12, 901, 158], ['b', .82]);
  rm('4WS', '10.055', 4, 'office', [907, 12, 1001, 158], ['b', .2]);
  rm('Dishwashing', '6.230', 0, 'service', [1006, 12, 1078, 158], ['b', .8], 'solid');
  rm('UPS / Elec', '5.635', 0, 'service', [1084, 12, 1162, 95], null, 'solid');
  rm('Battery room', '2.825', 0, 'service', [1072, 98, 1168, 158], ['r', .25], 'solid');
  rm('Ladies washroom', '', 0, 'wash', [1216, 12, 1395, 98], ['l', .3], 'solid', 'wc');
  rm('Gents washroom', '', 0, 'wash', [1216, 104, 1395, 244], ['l', .1], 'solid', 'wc');
  rm('4WS', '12.145', 4, 'office', [180, 165, 262, 335], ['t', .88]);
  rm('4WS', '10.305', 4, 'office', [264, 205, 372, 335], ['t', .2]);
  rm('4WS', '14.125', 4, 'office', [376, 205, 500, 335], ['t', .25]);
  rm('5WS', '14.305', 5, 'office', [504, 205, 612, 335], ['t', .8]);
  rm('5WS', '9.005', 5, 'office', [616, 205, 698, 335], ['t', .75]);
  rm('4WS', '14.015', 4, 'office', [746, 205, 852, 385], ['b', .1]);
  rm('4WS', '13.675', 4, 'office', [856, 205, 960, 385], ['b', .9]);
  rm('Dedicated desks', '26.005', 8, 'office', [746, 392, 960, 572], ['l', .9], 'glass', 'ded');
  rm('2WS', '7.225', 2, 'office', [1008, 205, 1115, 310], ['l', .85]);
  rm('4WS', '7.235', 4, 'office', [1118, 205, 1213, 310], ['t', .15]);
  rm('5WS', '14.715', 5, 'office', [1010, 316, 1213, 512], ['l', .88], 'glass', 'bench');
  rm('5WS', '14.715', 5, 'office', [1010, 520, 1213, 612], ['l', .2], 'glass', 'row');
  rm('Meeting room', '18.505', 0, 'meeting', [428, 372, 555, 568], ['b', .85], 'glass', 'meet');
  rm('7WS', '18.805', 7, 'office', [558, 372, 698, 568], ['r', .15], 'glass', 'w7');
  rm('Refresh point', '', 0, 'common', [255, 342, 340, 372], null, 'none', 'refresh');
  rm('Existing services area', '3.225', 0, 'service', [345, 342, 420, 395], null, 'solid');
  rm('Reception', '', 0, 'common', [222, 380, 426, 610], null, 'none', 'reception');
  rm('Store room', '3500 × 1960', 0, 'store', [20, 480, 155, 612], null, 'none');
  rm('4WS', '10.625', 4, 'office', [415, 612, 500, 782], ['t', .9]);
  rm('4WS', '10.625', 4, 'office', [503, 612, 588, 782], ['t', .15]);
  rm('4WS', '11.045', 4, 'office', [592, 612, 680, 782], ['t', .65]);
  rm('4WS', '10.625', 4, 'office', [683, 612, 768, 782], ['t', .8]);
  rm('4WS', '10.625', 4, 'office', [772, 612, 860, 782], ['t', .25]);
  rm('Lobby', '5858 × 4345', 0, 'common', [882, 618, 1213, 790], null, 'none', 'lobby');
  rm('Waiting lobby', '', 0, 'common', [160, 612, 412, 782], null, 'none', 'waiting');
  const CORE = [{ name: 'Lift shaft', r: [80, 440, 150, 500] }, { name: 'Lift shaft', r: [220, 385, 252, 420] }, { name: 'Lift / stair core', r: [1078, 668, 1168, 740] }];

  const OUT = [[178, 10], [1395, 10], [1395, 245], [1222, 245], [1222, 792], [150, 792], [150, 632], [105, 633], [45, 618], [8, 575], [5, 525], [30, 478], [72, 440], [72, 432], [215, 432], [215, 340], [178, 340]];
  const H = { cut: { outer: 30, solid: 24, glass: 18, col: 30 }, full: { outer: 104, solid: 104, glass: 96, col: 104 } };

  const scene = new THREE.Scene();
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding; 
  stage.insertBefore(renderer.domElement, stage.firstChild);
  const camera = new THREE.PerspectiveCamera(28, 1, 10, 8000);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = .08; controls.maxPolarAngle = Math.PI / 2.05; controls.minDistance = 200; controls.maxDistance = 4800;
  controls.target.set(0, 0, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8f846f, .42));
  const sun = new THREE.DirectionalLight(0xfff1dc, .8);
  sun.position.set(-700, 1100, 600); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -950, right: 950, top: 700, bottom: -700, near: 100, far: 3000 }); sun.shadow.bias = -.0004;
  scene.add(sun);

  const root = new THREE.Group(); root.position.set(-700, 0, -420); scene.add(root);
  const M = c => new THREE.MeshStandardMaterial({ color: c, roughness: .7, metalness: .02 });
  const mats = { wood: M(0xd9a35b), white: M(0xf4f1ea), black: M(0x25272b), dark: M(0x3b3f45), green: M(0x4e8a4a), pot: M(0xefeee8), steel: new THREE.MeshStandardMaterial({ color: 0xaab0b6, roughness: .35, metalness: .6 }), orange: M(0xe39a2d), blue: M(0x2f5fa8), sofa: M(0x7f8f8a), marble: M(0xfafaf7), frame: M(0x2f4a43) };
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x9bd1c8, transparent: true, opacity: .26, roughness: .1, depthWrite: false });

  const walls = [], furn = new THREE.Group(), labels = new THREE.Group(), floors = [], doorsG = new THREE.Group();
  root.add(furn, labels, doorsG);
  const unit = new THREE.BoxGeometry(1, 1, 1).translate(0, .5, 0);

  const wall = (x1, z1, x2, z2, kind, thick, mat) => {
    const len = Math.hypot(x2 - x1, z2 - z1); if (len < 1) return;
    const m = new THREE.Mesh(unit, mat); m.scale.set(len, 1, thick);
    m.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2); m.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
    m.castShadow = kind !== 'glass'; m.receiveShadow = true; m.userData.k = kind; root.add(m); walls.push(m); return m;
  };
  const box = (w, h, d, x, y, z, mat, parent, shadow) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y + h / 2, z);
    m.castShadow = shadow !== false; m.receiveShadow = true; (parent || furn).add(m); return m;
  };

  /* ground + slab */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.MeshStandardMaterial({ color: 0xcbbfa6, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -6; ground.receiveShadow = true; root.add(ground);
  const shape = new THREE.Shape(OUT.map(p => new THREE.Vector2(p[0], p[1])));
  const slab = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 6, bevelEnabled: false }), M(0xe9e2d3));
  slab.rotation.x = Math.PI / 2; slab.position.y = 0; slab.receiveShadow = true; root.add(slab);
  slab.userData.t = 'corr'; floors.push(slab);

  /* outer walls with entrance openings */
  const gaps = [[235, 312], [880, 957]];
  for (let i = 0; i < OUT.length; i++) {
    const a = OUT[i], b = OUT[(i + 1) % OUT.length];
    if (a[1] === 792 && b[1] === 792) {
      const xs = [b[0], ...gaps.flat(), a[0]].sort((p, q) => p - q);
      for (let k = 0; k < xs.length; k += 2) wall(xs[k], 792, xs[k + 1], 792, 'outer', 7, mats.dark);
    } else wall(a[0], a[1], b[0], b[1], 'outer', 7, mats.dark);
  }
  gaps.forEach(g => { const w = (g[1] - g[0]) / 2; [0, 1].forEach(i => { const l = new THREE.Mesh(unit, mats.orange); l.scale.set(w - 3, 1, 2); l.position.set(g[0] + w * i + w / 2, 0, 792); l.userData.k = 'door'; l.castShadow = true; root.add(l); walls.push(l); }); });
  [140, 225, 316, 407, 520, 665, 868, 968, 1215].forEach(x => { const c = new THREE.Mesh(unit, mats.dark); c.scale.set(20, 1, 26); c.position.set(x, 0, 795); c.castShadow = true; c.userData.k = 'col'; root.add(c); walls.push(c); });

  /* room floors, walls, doors */
  const drawn = [];
  const dupe = (o, c, a, b) => drawn.some(s => s.o === o && Math.abs(s.c - c) < 7 && Math.min(b, s.b) - Math.max(a, s.a) > .6 * (b - a));
  const outerEdge = (o, c, a, b) => (o === 'h' && (c <= 15 || c >= 788)) || (o === 'v' && ((c <= 183 && a < 340) || c >= 1392 || (c >= 1208 && c <= 1224 && a > 245)));
  const edge = (r, o, c, a, b, room, side) => {
    if (room.wall === 'none' || outerEdge(o, c, a, b) || dupe(o, c, a, b)) return;
    drawn.push({ o, c, a, b });
    const isSolid = room.wall === 'solid', kind = isSolid ? 'solid' : 'glass', th = isSolid ? 4 : 2.5, mt = isSolid ? M(0xdcd6cb) : glassMat;
    let segs = [[a, b]];
    if (room.door && room.door[0] === side) {
      const dw = 30, mid = a + (b - a) * room.door[1], d0 = Math.max(a, mid - dw / 2), d1 = Math.min(b, d0 + dw);
      segs = [[a, d0], [d1, b]];
      const leaf = new THREE.Mesh(unit, mats.orange); leaf.userData.k = 'door'; leaf.scale.set(dw - 2, 1, 1.6); leaf.castShadow = true;
      if (o === 'h') leaf.position.set((d0 + d1) / 2, 0, c); else { leaf.rotation.y = Math.PI / 2; leaf.position.set(c, 0, (d0 + d1) / 2); }
      root.add(leaf); walls.push(leaf);
      const arc = new THREE.Mesh(new THREE.CircleGeometry(dw - 2, 20, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xe39a2d, transparent: true, opacity: .55, side: THREE.DoubleSide }));
      arc.rotation.x = -Math.PI / 2;
      if (o === 'h') { arc.position.set(d0, 7.4, c); arc.scale.set(1, side === 't' ? -1 : 1, 1); }
      else { arc.position.set(c, 7.4, d0); arc.scale.set(side === 'l' ? 1 : -1, -1, 1); }
      doorsG.add(arc);
    }
    segs.forEach(s => {
      const m = o === 'h' ? wall(s[0], c, s[1], c, kind, th, mt) : wall(c, s[0], c, s[1], kind, th, mt);
      if (m && !isSolid) { ['rail', 'toprail'].forEach(k => { const f = o === 'h' ? wall(s[0], c, s[1], c, k, 3.4, mats.frame) : wall(c, s[0], c, s[1], k, 3.4, mats.frame); if (f) f.castShadow = false; }); }
    });
  };
  R.forEach(room => {
    const [x1, y1, x2, y2] = room.r;
    const fl = new THREE.Mesh(new THREE.BoxGeometry(x2 - x1, 1.2, y2 - y1), M(TYPES[room.t].c));
    fl.position.set((x1 + x2) / 2, 6.6, (y1 + y2) / 2); fl.receiveShadow = true; fl.userData.room = room; fl.userData.t = room.t; root.add(fl); floors.push(fl); room.floor = fl;
    edge(room.r, 'h', y1, x1, x2, room, 't'); edge(room.r, 'h', y2, x1, x2, room, 'b');
    edge(room.r, 'v', x1, y1, y2, room, 'l'); edge(room.r, 'v', x2, y1, y2, room, 'r');
  });
  CORE.forEach(c => {
    const [x1, y1, x2, y2] = c.r, cx = (x1 + x2) / 2, cz = (y1 + y2) / 2;
    const room = { name: c.name, area: '', ws: 0, t: 'core', r: c.r };
    const b = new THREE.Mesh(unit, mats.steel); b.scale.set(x2 - x1, 1, y2 - y1); b.position.set(cx, 6, cz); b.castShadow = true; b.receiveShadow = true; b.userData = { k: 'solid', room, t: 'core' }; root.add(b); walls.push(b); floors.push(b); room.floor = b;
  });

  /* furniture */
  const chair = (x, z, fx, fz) => {
    const g = new THREE.Group(); g.position.set(x, 7, z); g.rotation.y = Math.atan2(fx, fz);
    box(2, 9, 2, 0, 0, 0, mats.black, g, false); box(13, 3, 13, 0, 9, 0, mats.black, g, false);
    box(13, 14, 2.5, 0, 12, -6, mats.black, g); furn.add(g);
  };
  const desk = (x, z, w, d, divider) => {
    box(w, 2.6, d, x, 7 + 26, z, mats.wood); box(1.6, 26, d - 2, x - w / 2 + 1, 7, z, mats.white, furn, false); box(1.6, 26, d - 2, x + w / 2 - 1, 7, z, mats.white, furn, false);
    box(Math.min(w, d) * .55, 9, 1.4, x, 7 + 28.6, z - (d > w ? 0 : 0), mats.black, furn, false);
  };
  const plant = (x, z, s) => { s = s || 1; box(7 * s, 8 * s, 7 * s, x, 7, z, mats.pot, furn, false); const f = new THREE.Mesh(new THREE.SphereGeometry(9 * s, 10, 8), mats.green); f.position.set(x, 7 + 15 * s, z); f.castShadow = true; furn.add(f); };
  const cluster = (room) => {
    const [x1, y1, x2, y2] = room.r, w = x2 - x1, h = y2 - y1, n = room.ws, a = Math.ceil(n / 2), b = n - a;
    if (h >= w) {
      [[a, x1 + 26, 1], [b, x2 - 26, -1]].forEach(([cnt, x, dir]) => { const L = Math.min(54, (h - 24) / Math.max(cnt, 1) - 4); for (let k = 0; k < cnt; k++) { const z = y1 + 14 + (k + .5) * ((h - 28) / cnt); desk(x, z, 22, L); chair(x + dir * 21, z, -dir, 0); } });
    } else {
      [[a, y1 + 26, 1], [b, y2 - 26, -1]].forEach(([cnt, z, dir]) => { const L = Math.min(54, (w - 24) / Math.max(cnt, 1) - 4); for (let k = 0; k < cnt; k++) { const x = x1 + 14 + (k + .5) * ((w - 28) / cnt); desk(x, z, L, 22); chair(x, z + dir * 21, 0, -dir); } });
    }
  };
  const bench = (x1, y1, x2, y2, rows) => {
    const w = x2 - x1, cx = (x1 + x2) / 2, cy = (y1 + y2) / 2, L = (w - 30) / 5 - 3;
    rows.forEach(dir => { for (let k = 0; k < 5; k++) { const x = x1 + 15 + (k + .5) * ((w - 30) / 5); desk(x, cy + dir * 15, L, 22); chair(x, cy + dir * 38, 0, -dir); } });
    for (let k = 0; k < 5; k++) plant(x1 + 15 + (k + .5) * ((w - 30) / 5), cy, .55);
  };
  R.forEach(room => {
    const [x1, y1, x2, y2] = room.r, cx = (x1 + x2) / 2, cz = (y1 + y2) / 2;
    if (room.id === 'bench') return bench(x1, y1, x2, y2, [-1, 1]);
    if (room.id === 'row') { const L = (x2 - x1 - 30) / 5 - 3; for (let k = 0; k < 5; k++) { const x = x1 + 15 + (k + .5) * ((x2 - x1 - 30) / 5); desk(x, y2 - 18, L, 22); chair(x, y2 - 41, 0, 1); } return; }
    if (room.id === 'ded') { const L = (x2 - x1 - 70) / 4 - 3; [-1, 1].forEach(dir => { for (let k = 0; k < 4; k++) { const x = x1 + 12 + (k + .5) * ((x2 - x1 - 70) / 4); desk(x, cz + dir * 15, L, 22); chair(x, cz + dir * 38, 0, -dir); } }); for (let k = 0; k < 4; k++) plant(x1 + 12 + (k + .5) * ((x2 - x1 - 70) / 4), cz, .5); box(46, 30, 14, x2 - 32, 7, y2 - 14, mats.steel); return; }
    if (room.id === 'meet') { box(40, 3, 150, cx, 7 + 26, cz, mats.white); box(34, 26, 140, cx, 7, cz, mats.white, furn, false); for (let k = 0; k < 6; k++) { const z = cz - 62 + k * 25; chair(cx - 32, z, 1, 0); chair(cx + 32, z, -1, 0); } box(36, 12, 3, cx, 7, y1 + 8, mats.black); return; }
    if (room.id === 'comms') { box(48, 44, 48, cx, 7, cz, mats.steel); return; }
    if (room.id === 'w7') { const rows = [[y1 + 24, 1, 4], [y2 - 24, -1, 3]]; rows.forEach(([z, dir, cnt]) => { const L = (x2 - x1 - 24) / cnt - 4; for (let k = 0; k < cnt; k++) { const x = x1 + 12 + (k + .5) * ((x2 - x1 - 24) / cnt); desk(x, z, L, 22); chair(x, z + dir * 21, 0, -dir); } }); return; }
    if (room.name === '9WS') {
      for (let k = 0; k < 4; k++) { const x = 215 + k * 58; desk(x, 130, 46, 20); chair(x, 112, 0, 1); }
      [[262, 3], [352, 2]].forEach(([x, c]) => { for (let k = 0; k < c; k++) { const xx = x - (c - 1) * 22 + k * 44; desk(xx, 45, 40, 20); chair(xx, 66, 0, -1); } });
      box(18, 20, 18, 205, 7, 45, mats.black); plant(193, 24, 1); return;
    }
    if (room.ws) cluster(room);
    if (room.id === 'wc') {
      const left = room.name.startsWith('Ladies');
      for (let k = 0; k < 3; k++) { const x = x1 + 70 + k * 48; box(16, 14, 22, x, 7, y1 + 14, mats.white); }
      if (!left) for (let k = 0; k < 2; k++) box(18, 14, 24, x1 + 66 + k * 44, 7, y2 - 22, mats.white);
      return;
    }
    if (room.id === 'refresh') { box(28, 26, 18, 272, 7, 357, mats.blue); box(22, 22, 14, 308, 7, 357, mats.steel); return; }
    if (room.id === 'reception') {
      box(24, 30, 150, 346, 7, 495, mats.marble); box(10, 60, 165, 408, 7, 478, mats.wood);
      box(30, 26, 62, 268, 7, 478, mats.marble); box(30, 26, 40, 268, 7, 552, mats.marble);
      [[-28, 0], [28, 0]].forEach(([dx]) => { chair(268 + dx * .9, 470, dx > 0 ? -1 : 1, 0); chair(268 + dx * .9, 490, dx > 0 ? -1 : 1, 0); });
      chair(250, 552, 1, 0); chair(286, 552, -1, 0); plant(405, 372, .9); plant(224, 405, .7); return;
    }
    if (room.id === 'waiting') {
      box(56, 12, 26, 205, 7, 706, mats.sofa); box(56, 12, 7, 205, 19, 696, mats.sofa); box(20, 12, 20, 182, 7, 650, mats.sofa); box(20, 12, 20, 222, 7, 650, mats.sofa); box(14, 12, 14, 266, 7, 705, mats.sofa);
      box(13, 6, 13, 200, 7, 666, mats.white); plant(175, 726, 1); plant(268, 690, .8);
      box(14, 26, 14, 394, 7, 648, mats.blue); box(14, 26, 14, 394, 7, 672, mats.blue); box(34, 12, 12, 355, 7, 756, mats.dark); return;
    }
    if (room.id === 'lobby') { plant(900, 640, .8); }
    if (room.ws && room.name === '4WS') plant(cx, y2 - 9, .6);
  });

  /* labels */
  const mkLabel = (t1, t2, wd) => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 160; const g = c.getContext('2d');
    g.fillStyle = 'rgba(255,255,255,.9)'; const rr = (x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
    rr(6, 6, 500, t2 ? 148 : 100, 22); g.fill(); g.strokeStyle = '#b08d4f'; g.lineWidth = 4; g.stroke();
    g.fillStyle = '#2a2927'; g.textAlign = 'center'; g.font = '600 52px Georgia,serif'; g.fillText(t1, 256, 70);
    if (t2) { g.font = '500 38px Arial,sans-serif'; g.fillStyle = '#6f6a62'; g.fillText(t2, 256, 126); }
    const tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true, toneMapped: false }));
    s.scale.set(wd, wd * (t2 ? .31 : .2), 1); s.renderOrder = 10; return s;
  };
  R.concat(CORE.map(c => ({ name: c.name, area: '', r: c.r, ws: 0 }))).forEach(room => {
    const [x1, y1, x2, y2] = room.r, wd = Math.min(Math.max((x2 - x1) * .62, 62), 100);
    const isWS = /WS$/.test(room.name) && room.name !== 'Existing services area';
    const t1 = isWS ? room.name : room.name, t2 = room.area ? (/×/.test(room.area) ? room.area : room.area + ' sqm') : '';
    const s = mkLabel(t1, t2, wd); s.position.set((x1 + x2) / 2, 62, (y1 + y2) / 2); labels.add(s);
  });

  /* state + controls */
  let mode = 'cut', hl = null;
  const setWalls = () => walls.forEach(m => { const k0 = m.userData.k; if (k0 === 'rail') { m.scale.y = 3; return; } if (k0 === 'toprail') { m.position.y = H[mode].glass - 2.5; m.scale.y = 2.5; return; } const k = k0; const hh = (H[mode][k] || H[mode].solid); m.scale.y = m.userData.k === 'door' ? hh * (mode === 'cut' ? .9 : .82) : hh; });
  setWalls();
  const dist = () => camera.position.distanceTo(controls.target);
  const setView = (az, pol, d) => { const x = d * Math.sin(pol) * Math.sin(az), y = d * Math.cos(pol), z = d * Math.sin(pol) * Math.cos(az); camera.position.set(controls.target.x + x, controls.target.y + y, controls.target.z + z); controls.update(); };
  const fitD = k => Math.max(1250 * k / (.5 * camera.aspect), 1350 * k);
  const views = { iso: () => setView(-Math.PI / 4, 0.95, fitD(1.05)), top: () => setView(0, .001, fitD(.95)), front: () => setView(0, 1.3, fitD(.95)) };
  let first = true;
  const resize = () => { const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); if (first) { first = false; views.iso(); } };
  new ResizeObserver(resize).observe(stage); resize();

  const act = {
    zoomin: () => { const d = dist() * .8; camera.position.lerp(controls.target, .2); controls.update(); },
    zoomout: () => { const v = camera.position.clone().sub(controls.target).multiplyScalar(1.25); camera.position.copy(controls.target).add(v); controls.update(); },
    cut: b => { mode = mode === 'cut' ? 'full' : 'cut'; setWalls(); b.classList.toggle('on', mode === 'cut'); b.textContent = mode === 'cut' ? 'Cutaway walls' : 'Full-height walls'; },
    furn: b => { furn.visible = !furn.visible; b.classList.toggle('on', furn.visible); },
    labels: b => { labels.visible = !labels.visible; b.classList.toggle('on', labels.visible); },
    rotate: b => { controls.autoRotate = !controls.autoRotate; controls.autoRotateSpeed = .8; b.classList.toggle('on', controls.autoRotate); },
    full: () => { if (document.fullscreenElement) document.exitFullscreen(); else if (stage.requestFullscreen) stage.requestFullscreen(); }
  };
  $('tools3d').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.view) { views[b.dataset.view](); $('tools3d').querySelectorAll('[data-view]').forEach(x => x.classList.toggle('on', x === b)); }
    else if (act[b.dataset.act]) act[b.dataset.act](b);
  });
  document.addEventListener('fullscreenchange', () => setTimeout(resize, 60));

  const highlight = pred => {
    floors.forEach(f => { const m = f.material; if (!m.emissive) return; const on = pred && pred(f); m.emissive.setHex(on ? 0xb08d4f : 0); m.emissiveIntensity = on ? .55 : 0; });
  };
  legend.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const on = !b.classList.contains('on'); legend.querySelectorAll('button').forEach(x => x.classList.remove('on'));
    if (on) { b.classList.add('on'); highlight(f => f.userData.t === b.dataset.t); } else highlight(null);
    info.classList.remove('on');
    stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2(); let down = null;
  renderer.domElement.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener('pointerup', e => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
    const r = renderer.domElement.getBoundingClientRect(); mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mouse, camera);
    const hit = ray.intersectObjects(floors.filter(f => f.userData.room), false)[0];
    legend.querySelectorAll('button').forEach(x => x.classList.remove('on'));
    if (!hit) { highlight(null); info.classList.remove('on'); return; }
    const rm0 = hit.object.userData.room; highlight(f => f === hit.object);
    const area = rm0.area ? (/×/.test(rm0.area) ? `Size on plan: ${rm0.area}` : `Area on plan: ${rm0.area} sqm`) : '';
    info.innerHTML = `<b>${rm0.name}</b>${TYPES[rm0.t].n}${area ? '<br>' + area : ''}${rm0.ws ? `<br>Workstations: ${rm0.ws}` : ''}`;
    info.classList.add('on');
  });

  loading.remove();
  (function loop() { requestAnimationFrame(loop); controls.update(); renderer.render(scene, camera); })();
})();
