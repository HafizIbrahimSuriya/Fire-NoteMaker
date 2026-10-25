const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const DEL = [['Cancel', null], ['Delete', true, 'danger']];
function ask(title, msg, btns = [['OK', true, 'primary']]) {
  return new Promise((res) => {
    const d = $('#ask'); $('#askT').textContent = title; $('#askM').textContent = msg;
    $('#askB').innerHTML = btns.map((b, i) => `<button class="btn ${b[2] || ''}" data-i="${i}">${esc(b[0])}</button>`).join('');
    const done = (v) => { d.close(); res(v); };
    d.onclick = (e) => { const b = e.target.closest('[data-i]'); if (b) done(btns[+b.dataset.i][1]); else if (e.target === d) done(null); };
    d.oncancel = (e) => { e.preventDefault(); done(null); };
    d.showModal(); $('#askB .btn:last-child').focus();
  });
}
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const P = {
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>',
  bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10"/>',
  sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  music: '<path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>',
  coffee: '<path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4zM6 1v3M10 1v3M14 1v3"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  gift: '<path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  target: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-1.21 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98 1.21 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z"/>',
  check: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>',
  work: '<path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  pencil: '<path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  archive: '<path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  left: '<path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>',
  down: '<path d="M6 9l6 6 6-6"/>', right: '<path d="M9 18l6-6-6-6"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  tick: '<path d="M20 6L9 17l-5-5"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 20h20"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  bike: '<circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6h2M12 17.5V14l-3-3 4-3 2 3h2"/>',
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  bus: '<rect x="4" y="3" width="16" height="15" rx="2"/><path d="M4 11h16M8 21v-3M16 21v-3M8 15h.01M16 15h.01"/>',
  train: '<rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16M12 3v8M8 19l-2 3M18 22l-2-3M8 15h.01M16 15h.01"/>',
  truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  plane: '<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  bag: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>',
  dollar: '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  card: '<rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>',
  calc: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
  chart: '<path d="M18 20V10M12 20V4M6 20v-6"/>',
  dumbbell: '<path d="M6 7v10M18 7v10M3 9v6M21 9v6M6 12h12"/>',
  pulse: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  pill: '<path d="M10.5 20.5L3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7zM8.5 8.5l7 7"/>',
  food: '<path d="M3 2v7a3 3 0 0 0 3 3v10M9 2v7a3 3 0 0 1-3 3M6 2v7M17 22V2c-2.5 1.5-4 4-4 7s1.5 4 4 4"/>',
  school: '<path d="M22 10L12 5 2 10l10 5zM6 12v5c3 2 9 2 12 0v-5M22 10v6"/>',
  code: '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>',
  game: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M6 12h4M8 10v4M15 12h.01M18 13h.01"/>',
  headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/>',
  film: '<rect x="2" y="2" width="20" height="20" rx="2.2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/>',
  tv: '<rect x="2" y="7" width="20" height="15" rx="2"/><path d="M17 2l-5 5-5-5"/>',
  palette: '<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.4-.15-.77-.4-1.04-.23-.27-.37-.63-.37-1.01 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.97-4.5-9-10-9z"/>',
  printer: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  list: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 12h6M9 16h6"/>',
  tree: '<path d="M12 22v-5M12 2l6 8h-3l5 7H4l5-7H6z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zM2 21c0-3 1.85-5.36 5.08-6"/>',
  paw: '<circle cx="6" cy="10" r="2"/><circle cx="10" cy="5.5" r="2"/><circle cx="14" cy="5.5" r="2"/><circle cx="18" cy="10" r="2"/><path d="M12 11c-3 0-5.5 3-5.5 5.5 0 2 1.5 3 3 3 1 0 1.5-.5 2.5-.5s1.5.5 2.5.5c1.5 0 3-1 3-3C17.5 14 15 11 12 11z"/>',
  mountain: '<path d="M8 3l4 8 5-5 5 15H2z"/>',
  cloud: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
  umbrella: '<path d="M23 12a11.05 11.05 0 0 0-22 0zM12 12v8a2 2 0 0 0 4 0"/>',
  drop: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
  pushpin: '<path d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z"/>',
  whatsapp: '<path d="M3 21l1.65-3.9A9 9 0 1 1 8 20.4z"/><path transform="translate(6.9 6.9) scale(.42)" stroke-width=\"4\" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  masjid: '<path d="M2 21h20M7 21v-5a5 5 0 0 1 10 0v5M12 11V9.5M3 21V11l1.5-2.5L6 11v10M18 21V11l1.5-2.5L21 11v10M10.5 21v-2.5a1.5 1.5 0 0 1 3 0V21"/><path d="M13.6 2.8a2.6 2.6 0 1 0 0 4.6 2.2 2.2 0 0 1 0-4.6z"/>',
  telegram: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
  youtube: '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.75 11.75 9.75 8.48 9.75 15.02"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  b_github: '<path fill="currentColor" stroke="none" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
  b_instagram: '<path fill="currentColor" stroke="none" d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>',
  b_youtube: '<path fill="currentColor" stroke="none" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>',
  b_discord: '<path fill="currentColor" stroke="none" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  ext: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V18h6v-1.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>',
  bed: '<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>',
  shirt: '<path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
  diamond: '<path d="M6 3h12l4 6-10 13L2 9z"/>',
  alignl: '<path d="M3 6h18M3 12h10M3 18h14"/>',
  alignc: '<path d="M3 6h18M7 12h10M5 18h14"/>',
  alignr: '<path d="M3 6h18M11 12h10M7 18h14"/>',
  wrapl: '<rect x="3" y="4" width="8" height="8" rx="1.5"/><path d="M14 5h7M14 9h7M3 16h18M3 20h18"/>',
  wrapr: '<rect x="13" y="4" width="8" height="8" rx="1.5"/><path d="M3 5h7M3 9h7M3 16h18M3 20h18"/>',
  panel: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>',
  panelopen: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M14 9l3 3-3 3"/>',
  grip: '<circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>'
};
const ic = (n, color = 'currentColor', fill = false) => `<svg viewBox="0 0 24 24" fill="${fill ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${color !== 'currentColor' ? ` style="color:${color}"` : ''}>${P[n] || P.star}</svg>`;
const ICON_META = {
  star: 'favorite important',
  heart: 'love like health',
  bell: 'alarm reminder notification',
  bookmark: 'save mark',
  flag: 'mark milestone',
  home: 'house',
  sun: 'day weather',
  moon: 'night sleep',
  music: 'song audio',
  coffee: 'cafe drink tea',
  book: 'read study',
  gift: 'present birthday',
  zap: 'bolt energy fast',
  target: 'goal trophy win award',
  camera: 'photo picture',
  work: 'briefcase job office',
  smile: 'happy face',
  pencil: 'write edit pen',
  clock: 'time',
  check: 'done task',
  file: 'note document paper',
  laptop: 'computer pc notebook work',
  monitor: 'computer desktop pc screen',
  phone: 'mobile smartphone call',
  bike: 'bicycle cycle cycling ride',
  car: 'vehicle drive auto',
  bus: 'transport public',
  train: 'transport metro rail',
  truck: 'delivery transport van',
  plane: 'flight travel trip airplane',
  mail: 'email message letter',
  calendar: 'date schedule event',
  cart: 'shopping groceries buy',
  bag: 'shopping store',
  dollar: 'money cash price finance',
  card: 'credit payment bank',
  calc: 'calculator math budget',
  chart: 'stats report analytics graph',
  dumbbell: 'gym fitness workout exercise',
  pulse: 'health heart rate fitness',
  pill: 'medicine health doctor',
  food: 'eat restaurant dinner lunch meal',
  school: 'education study graduation learn',
  code: 'programming developer dev',
  game: 'gaming play controller',
  headphones: 'music listen audio',
  mic: 'microphone podcast record',
  film: 'movie cinema video',
  tv: 'television show watch',
  palette: 'art paint design color',
  printer: 'print office',
  users: 'team people friends family',
  list: 'clipboard checklist todo',
  tree: 'nature plant forest',
  leaf: 'nature plant eco',
  paw: 'pet dog cat animal',
  mountain: 'hike outdoor adventure',
  cloud: 'weather sky',
  umbrella: 'rain weather',
  drop: 'water rain',
  flame: 'fire hot',
  wrench: 'tools fix repair settings',
  key: 'password access',
  lock: 'security private',
  shield: 'security safe protect',
  pin: 'location map place',
  globe: 'world internet web travel',
  bulb: 'idea light',
  rocket: 'launch startup space',
  bed: 'sleep rest hotel',
  shirt: 'clothes fashion laundry',
  diamond: 'gem jewel premium',
  whatsapp: 'chat message messenger call social',
  github: 'git code repo developer social octocat',
  masjid: 'mosque islam muslim prayer namaz dua religion',
  telegram: 'chat message send social',
  instagram: 'insta photo social',
  youtube: 'video play social channel',
  facebook: 'fb social',
  linkedin: 'job career social',
};
const NOTE_ICONS = Object.keys(ICON_META);
const FIXED = ['#e53935', '#fb8c00', '#f9a825', '#43a047', '#00897b', '#1e88e5', '#3949ab', '#8e24aa', '#d81b60', '#212121', '#ffffff'];
const FIXED_NOTE = ['#ffe9a8', '#ffd0c2', '#c9ecd0', '#c7e6fb', '#fbd0e1', '#e3d0f3', '#ffe0b2', '#e5e7ee', '#ffffff', '#2b2f3a'];
const ACCENTS = ['#ff6a1a', '#2f6fed', '#7c4dff', '#1faa6b', '#e8457c', '#0fa3b1', '#f5b700'];
const SLOT_IDS = ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'];
const NOTE_MIX = { t0: 16, t1: 28, t2: 40, t3: 8, t4: 52, t5: 66, t6: 3, t7: 80 };
const NOTE_ORDER = ['t6', 't3', 't0', 't1', 't2', 't4', 't5', 't7'];
const ICON_MIX = { t0: ['#000', 0], t1: ['#000', 22], t2: ['#000', 45], t3: ['#fff', 25], t4: ['#fff', 45], t5: ['#000', 68], t6: ['#fff', 65], t7: ['var(--text)', 60] };
const ICON_ORDER = ['t0', 't1', 't2', 't5', 't3', 't4', 't6', 't7'];

/* ---------- state ---------- */
const KEY = 'fire.v1';
const DEFAULT_NB = 'General';
let S = {};
try { S = JSON.parse((window.fire ? window.fire.load() : '') || localStorage.getItem(KEY)) || {}; } catch {}
S = Object.assign({ items: null, notebooks: [DEFAULT_NB], labels: [], theme: { accent: '#ff6a1a', mode: 'system' }, view: 'all', tab: 'all', sort: 'new', sel: null }, S);
S.settings = Object.assign({ name: '', dp: '', notifications: true }, S.settings);
const isSlot = (v) => /^t\d$/.test(v || '');
if ((S.v || 0) < 6) { // v6: orange default, labels / notes / icons follow the exact theme color
  S.theme.accent = '#ff6a1a';
  (S.labels || []).forEach((l) => { if (isSlot(l.color)) l.color = 't0'; });
  (S.items || []).forEach((i) => { if (isSlot(i.color)) i.color = 't0'; if (isSlot(i.iconColor)) i.iconColor = 't0'; });
  S.v = 6;
}
const migrated = (S.v || 0) < 7;
if ((S.v || 0) < 7) { // v7: default notebook is "General", labels always follow the theme color
  const OLD = 'NoteBook-01';
  if (S.notebooks.includes(OLD)) {
    S.notebooks = S.notebooks.includes(DEFAULT_NB) ? S.notebooks.filter((n) => n !== OLD) : S.notebooks.map((n) => n === OLD ? DEFAULT_NB : n);
    (S.items || []).forEach((i) => { if (i.notebook === OLD) i.notebook = DEFAULT_NB; });
    if (S.view === 'nb:' + OLD) S.view = 'nb:' + DEFAULT_NB;
  }
  (S.labels || []).forEach((l) => { l.color = 't0'; });
  S.v = 7;
}
let st;
const flush = () => { const j = JSON.stringify(S); if (window.fire) window.fire.save(j); else localStorage.setItem(KEY, j); };
const save = () => { clearTimeout(st); st = setTimeout(flush, 300); };
document.addEventListener('visibilitychange', flush);
if (migrated) save();
addEventListener('beforeunload', flush);

/* ---------- colors that follow the theme color ---------- */
function col(v, kind = 'icon') {
  if (kind === 'label') return 'var(--accent)';
  if (!isSlot(v)) return v || '#888888';
  if (kind === 'note') return `color-mix(in srgb, var(--accent) ${NOTE_MIX[v]}%, var(--panel))`;
  const [m, p] = ICON_MIX[v];
  return p ? `color-mix(in srgb, var(--accent) ${100 - p}%, ${m})` : 'var(--accent)';
}

const newItem = (o = {}) => ({ id: uid(), title: '', html: '', notebook: S.notebooks[0], labels: [], tasks: [], starred: false, pinned: false, archived: false, due: '', notified: false, icon: 'star', iconColor: 't0', color: 't0', goal: null, created: Date.now(), updated: Date.now(), ...o });
const lay = (it) => { const L = it.layout = Object.assign({ order: ['body', 'goal', 'tasks'], goalW: 0, tasksW: 0, barH: 8 }, it.layout); L.order = [...L.order.filter((k) => ['body', 'goal', 'tasks'].includes(k)), ...['body', 'goal', 'tasks'].filter((k) => !L.order.includes(k))]; return L; };
const newTask = (text = '') => ({ id: uid(), text, done: false, due: '', notified: false });
const WELCOME_OLD = '<h2>Your notes, tasks and goals in one place</h2>Write anything here. Add pictures with the image button in the toolbar, add tasks with deadlines below, and set a reminder at the bottom to get a desktop notification. Click the colored icon next to the title to restyle it. Open Settings from the top right corner to change your name, picture and theme.';
const WELCOME_HTML = '<h2>Your notes, tasks and goals in one place</h2>Write anything here. Everything is saved on this PC only, no account needed.<br><br><h2>Quick tips</h2><ul><li>Press <b>Edit</b> to change a note, then <b>Save</b>. Notes open read-only so you can not break them by accident.</li><li>Add pictures with the image button in the toolbar. Click a picture to resize, move it or wrap text around it.</li><li>Add tasks with deadlines below, or set a reminder at the bottom to get a desktop notification.</li><li>Turn a note into a <b>Goal</b> and track progress with the slider.</li><li>Click the colored icon next to the title to change its icon and color.</li><li>Pin, star or archive a note with the buttons at the top of the editor.</li><li>Open <b>Settings</b> (top right) to change your name, picture and theme color.</li><li>Closing the window keeps Fire running in the tray. Right-click the tray icon to quit.</li></ul><h2>Who made Fire?</h2>Fire was made by <b>HafizIbrahim</b>. If you find a bug, please tell him!<br><br>GitHub: HafizIbrahimSuriya<br>Instagram: HafizIbrahimSuriya<br>Discord: HafizIbrahimSuriya<br>YouTube: HafizIbrahimSuriya<br><br>Fire is open source. Find the code in Settings &gt; About, or Settings &gt; Social to follow him.';
if (!S.items) {
  S.labels = [{ name: 'Personal', color: 't0' }, { name: 'Project', color: 't0' }];
  S.items = [
    newItem({ title: 'Welcome to Fire', icon: 'flame', iconColor: 't0', color: 't0', pinned: true, starred: true, labels: ['Personal'],
      html: WELCOME_HTML,
      tasks: [newTask('Try adding a task'), Object.assign(newTask('Pick a theme color in Settings'), { done: true }), newTask('Set a reminder on this note')] }),
    newItem({ title: 'Read 12 books this year', icon: 'book', iconColor: 't0', color: 't0', goal: 25, labels: ['Project'], html: 'Track progress with the slider below.', created: Date.now() - 864e5, updated: Date.now() - 864e5 })
  ];
  S.sel = S.items[0].id; save();
}

{ let ch = false;
  for (const it of S.items) if (it.title === 'Welcome to Fire') {
    if (it.html === WELCOME_OLD) { it.html = WELCOME_HTML; ch = true; }
    if (it.icon === 'zap') { it.icon = 'flame'; ch = true; }
  }
  if (ch) save(); }

/* ---------- theme ---------- */
const lum = (h) => { const n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
const mq = matchMedia('(prefers-color-scheme: dark)');
function applyTheme() {
  const m = S.theme.mode, dark = m === 'dark' || (m === 'system' && mq.matches), r = document.documentElement;
  r.dataset.theme = dark ? 'dark' : 'light';
  r.style.setProperty('--accent', S.theme.accent);
  r.style.setProperty('--on', lum(S.theme.accent) > 0.72 ? '#1f2433' : '#ffffff');
}
mq.addEventListener('change', () => { applyTheme(); renderAll(); });

/* ---------- helpers ---------- */
const text = (h) => { const d = document.createElement('div'); d.innerHTML = String(h).replace(/<\/(h\d|p|div|li|blockquote)>|<br\s*\/?>/gi, '$& '); return d.innerText || d.textContent || ''; };
const lab = (n) => S.labels.find((l) => l.name === n) || { name: n, color: 't0' };
const cur = () => S.items.find((i) => i.id === S.sel);
const when = (t) => { const d = new Date(t), n = new Date(); return d.toDateString() === n.toDateString() ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString([], { month: 'short', day: 'numeric' }); };
const hasRem = (i) => i.due || i.tasks.some((t) => t.due && !t.done);
function clean(h) {
  const d = new DOMParser().parseFromString(String(h || ''), 'text/html');
  d.querySelectorAll('script,iframe,object,embed,style,link').forEach((n) => n.remove());
  d.querySelectorAll('*').forEach((n) => [...n.attributes].forEach((a) => { if (/^on/i.test(a.name) || /javascript:/i.test(a.value)) n.removeAttribute(a.name); }));
  return d.body.innerHTML;
}
const VIEWS = { all: ['All Notes', 'file'], pinned: ['Pinned', 'bookmark'], tasks: ['Tasks', 'check'], starred: ['Starred', 'star'], reminders: ['Reminders', 'bell'], goals: ['Goals', 'target'], archive: ['Archive', 'archive'] };
const inView = (i) => {
  const v = S.view;
  if (v === 'archive') return i.archived;
  if (i.archived) return false;
  if (v === 'pinned') return i.pinned;
  if (v === 'tasks') return i.tasks.length > 0;
  if (v === 'starred') return i.starred;
  if (v === 'reminders') return hasRem(i);
  if (v === 'goals') return i.goal !== null;
  if (v.startsWith('nb:')) return i.notebook === v.slice(3);
  if (v.startsWith('lb:')) return i.labels.includes(v.slice(3));
  return true;
};
function visible() {
  const q = $('#q').value.toLowerCase();
  const l = S.items.filter(inView).filter((i) => S.tab === 'all' || i.due).filter((i) => !q || (i.title + ' ' + text(i.html)).toLowerCase().includes(q));
  l.sort((a, b) => (b.pinned - a.pinned) || (S.sort === 'old' ? a.created - b.created : S.sort === 'az' ? a.title.localeCompare(b.title) : b.created - a.created));
  return l;
}
const viewName = () => VIEWS[S.view]?.[0] || S.view.slice(3);

/* ---------- files ---------- */
async function saveFile(name, data, ext) {
  name = name.replace(/[\\/:*?"<>|]/g, '_');
  if (window.fire) return window.fire.saveFile(name + '.' + ext, data, ext);
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data])); a.download = name + '.' + ext; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
const readFile = (f, mode = 'text') => new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); mode === 'url' ? r.readAsDataURL(f) : r.readAsText(f); });
async function pic(file, max, square) {
  const url = await readFile(file, 'url');
  return new Promise((res) => {
    const im = new Image();
    im.onload = () => {
      const c = document.createElement('canvas'), x = c.getContext('2d');
      if (square) { c.width = c.height = max; const m = Math.min(im.width, im.height); x.drawImage(im, (im.width - m) / 2, (im.height - m) / 2, m, m, 0, 0, max, max); }
      else { const k = Math.min(1, max / Math.max(im.width, im.height)); c.width = im.width * k; c.height = im.height * k; x.drawImage(im, 0, 0, c.width, c.height); }
      res(c.toDataURL('image/webp', 0.85));
    };
    im.src = url;
  });
}

/* ---------- rail + sidebar ---------- */
function renderRail() {
  const b = (v, n, t) => `<button class="${S.view === v ? 'on' : ''}" data-view="${v}" title="${t}">${ic(n)}</button>`;
  $('#rail').innerHTML = `<img src="../assets/logo.png" alt="Fire"><button data-act="collapse" title="${sideHidden ? 'Show' : 'Hide'} notes panel">${ic(sideHidden ? 'panelopen' : 'panel')}</button>${b('all', 'file', 'Notes')}${b('tasks', 'check', 'Tasks')}${b('reminders', 'bell', 'Reminders')}${b('goals', 'target', 'Goals')}<span class="sp"></span><button data-act="settings" title="Settings">${ic('sliders')}</button>`;
}
let open = { nb: true, lb: true }, adding = null, renaming = null;
function renderSide() {
  const cnt = (v) => { const o = S.view; S.view = v; const n = S.items.filter(inView).length; S.view = o; return n; };
  const nav = (v, t, n) => `<button class="nav ${S.view === v ? 'on' : ''}" data-view="${v}">${ic(n)}<span class="nm">${t}</span><small>${cnt(v)}</small></button>`;
  const ex = (k, t) => `<button class="nav" data-open="${k}">${ic(open[k] ? 'down' : 'right')}${t}</button>`;
  const addBox = (k, ph) => adding === k ? `<input class="addin" id="addin" placeholder="${ph}">` : `<button class="nav add" data-add="${k}">${ic('plus')}${ph}</button>`;
  const del = (k, n) => `<button class="nx r" data-ren${k}="${esc(n)}" title="Rename">${ic('pencil')}</button><button class="nx" data-del${k}="${esc(n)}" title="Delete">${ic('x')}</button>`;
  const rn = (k, n) => renaming && renaming.k === k && renaming.name === n ? `<input class="addin" id="renin" value="${esc(n)}" maxlength="40">` : '';
  $('#side').innerHTML = `<h2>${ic('file')}Notes<button class="ib" data-act="collapse" title="Hide sidebar" style="margin-left:auto">${ic('left')}</button></h2>
  <button class="btn primary" data-act="import">${ic('upload')} Import</button>
  <div class="grp">QUICK LINKS</div>${nav('all', 'All Notes', 'file')}${nav('pinned', 'Pinned', 'bookmark')}${nav('tasks', 'Tasks', 'check')}
  <div class="grp">NOTES</div>${nav('starred', 'Starred', 'star')}${nav('reminders', 'Reminders', 'bell')}${nav('goals', 'Goals', 'target')}${nav('archive', 'Archive', 'archive')}
  ${ex('nb', 'Notebooks')}${open.nb ? `<div class="sub">${S.notebooks.map((n) => rn('nb', n) || `<div class="navrow" data-nbdrop="${esc(n)}"><button class="nav ${S.view === 'nb:' + n ? 'on' : ''}" data-view="nb:${esc(n)}">${ic('folder')}<span class="nm">${esc(n)}</span><small>${S.items.filter((i) => !i.archived && i.notebook === n).length}</small></button>${del('nb', n)}</div>`).join('')}${addBox('nb', 'Add notebook')}</div>` : ''}
  ${ex('lb', 'Labels')}${open.lb ? `<div class="sub">${S.labels.map((l) => rn('lb', l.name) || `<div class="navrow"><button class="nav ${S.view === 'lb:' + l.name ? 'on' : ''}" data-view="lb:${esc(l.name)}"><span class="dot" style="background:${col(l.color, 'label')}"></span><span class="nm">${esc(l.name)}</span><small>${S.items.filter((i) => !i.archived && i.labels.includes(l.name)).length}</small></button>${del('lb', l.name)}</div>`).join('')}${addBox('lb', 'Add label')}</div>` : ''}`;
  $('#addin')?.focus(); const r = $('#renin'); if (r) { r.focus(); r.select(); }
}
function renameItem(k, from, to) {
  to = to.trim(); if (!to || to === from) return;
  if (k === 'nb') { if (S.notebooks.includes(to)) return; S.notebooks = S.notebooks.map((n) => n === from ? to : n); S.items.forEach((i) => { if (i.notebook === from) i.notebook = to; }); if (S.view === 'nb:' + from) S.view = 'nb:' + to; }
  else { if (S.labels.find((l) => l.name === to)) return; S.labels.forEach((l) => { if (l.name === from) l.name = to; }); S.items.forEach((i) => { i.labels = i.labels.map((x) => x === from ? to : x); }); if (S.view === 'lb:' + from) S.view = 'lb:' + to; }
  save(); renderAll();
}
function newLabel(n) { if (!S.labels.find((l) => l.name === n)) S.labels.push({ name: n, color: 't0' }); }
document.addEventListener('keydown', (e) => {
  if (e.target.id === 'renin') {
    if (e.key === 'Enter') { const r = renaming; renaming = null; renameItem(r.k, r.name, e.target.value); renderSide(); }
    if (e.key === 'Escape') { renaming = null; renderSide(); }
    return;
  }
  if (e.target.id !== 'addin') return;
  if (e.key === 'Enter' && e.target.value.trim()) { const v = e.target.value.trim(); if (adding === 'nb' && !S.notebooks.includes(v)) S.notebooks.push(v); if (adding === 'lb') newLabel(v); adding = null; save(); renderSide(); }
  if (e.key === 'Escape') { adding = null; renderSide(); }
});
document.addEventListener('focusout', (e) => { if (e.target.id === 'renin' && renaming) { renaming = null; setTimeout(renderSide, 0); } });
function go(v) { S.view = v; const l = visible(); if (!l.find((i) => i.id === S.sel)) S.sel = l[0]?.id || null; save(); renderAll(); }
let sideHidden = false;
const toggleSide = () => { sideHidden = !sideHidden; $('#side').classList.toggle('hide', sideHidden); renderRail(); };

/* ---------- list ---------- */
function renderList() {
  const l = visible(), total = S.items.filter(inView).length, due = S.items.filter((i) => !i.archived && i.due && !i.notified).length;
  $('#list').innerHTML = `<div class="lh"><h3>${esc(viewName())}</h3><small>${total} ${total === 1 ? 'Note' : 'Notes'}</small><span class="sp"></span><button class="btn" data-act="new">${ic('plus')} Create New</button></div>
  <div class="sortrow">Date created <select id="sort"><option value="new">Newest first</option><option value="old">Oldest first</option><option value="az">Title A-Z</option></select></div>
  <div class="tabs"><button data-tab="all" class="${S.tab === 'all' ? 'on' : ''}">All</button><button data-tab="reminder" class="${S.tab === 'reminder' ? 'on' : ''}">Reminder</button></div>
  <div class="rows">${l.length ? l.map(row).join('') : `<div class="none">Nothing here yet.<br>Create a note to get started.</div>`}</div>`;
  $('#sort').value = S.sort;
  $('#bellBtn').innerHTML = ic('bell') + (due ? `<span class="badge-n">${due}</span>` : '');
}
function row(i) {
  const done = i.tasks.filter((t) => t.done).length, shown = i.labels.slice(0, 1).map((n) => `<span class="lab" style="--c:${col(lab(n).color, 'label')}">${esc(n)}</span>`).join('');
  return `<div class="row ${i.id === S.sel ? 'on' : ''} ${i.pinned ? 'pin' : ''}" data-id="${i.id}" draggable="true">
    <div class="t"><h4><span class="tt">${esc(i.title) || 'Untitled note'}</span></h4><p>${esc(text(i.html).slice(0, 110)) || (i.html.includes('<img') ? 'Picture' : 'No content yet')}</p>
    <div class="meta">${i.tasks.length ? `<span>${ic('check')}${done}/${i.tasks.length}</span>` : ''}${i.html.includes('<img') ? `<span>${ic('image')}</span>` : ''}${shown}${i.labels.length > 1 ? `<span>+${i.labels.length - 1}</span>` : ''}</div>
    <div class="meta" style="margin-top:5px"><span>${when(i.updated)}</span><span>${ic('file')}${esc(i.notebook)}</span>${i.due ? `<span class="al">${ic('bell')}</span>` : ''}</div></div>
    <div class="thumb">${ic(i.icon)}${i.pinned ? `<span class="pinbadge" title="Pinned"></span>` : ''}</div></div>`;
}

/* ---------- editor ---------- */
const FMT = [['undo', 'Undo', '↶'], ['redo', 'Redo', '↷'], '|', ['bold', 'Bold', 'B'], ['italic', 'Italic', '<i>I</i>'], ['underline', 'Underline', '<u>U</u>'], ['strikeThrough', 'Strikethrough', '<s>S</s>'], '|',
  ['h2', 'Heading', 'H'], ['quote', 'Quote', '❝'], ['insertUnorderedList', 'Bullets', '• ≡'], ['insertOrderedList', 'Numbers', '1.'], '|', ['justifyLeft', 'Align left', '⇤'], ['justifyCenter', 'Center', '↔'], ['justifyRight', 'Align right', '⇥'], '|', ['@image', 'Insert image', ic('image')], ['removeFormat', 'Clear formatting', 'Tx']];
const EDATE = (t) => new Date(t).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
let editing = null, snap = null, freshId = null;
function renderEditor() {
  hideImgUI(); closePop();
  if (editing && editing !== S.sel) { editing = null; snap = null; freshId = null; }
  const it = cur(), ed = $('#editor');
  if (!it) { ed.classList.remove('ro'); ed.innerHTML = `<div class="emptyed"><img src="../assets/logo.png" alt=""><h3>Nothing selected</h3>Pick a note or create a new one.<br><br><button class="btn primary" data-act="new">${ic('plus')} Create New</button></div>`; return; }
  const ro = editing !== it.id, dis = ro ? 'disabled' : '', rdo = ro ? 'readonly' : '';
  ed.classList.toggle('ro', ro);
  const ab = (a, n, t, on) => `<button class="ib ${on ? 'on' : ''}" data-act="${a}" title="${t}">${ic(n)}</button>`;
  const L = lay(it), wd = (k) => L[k + 'W'] ? `style="width:${L[k + 'W']}px"` : '', dc = (k) => L[k + 'W'] ? '' : 'dflt', hnd = `<span class="grip" title="Drag to move">${ic('grip')}</span><span class="rz" title="Drag to resize (double-click to reset)"></span>`;
  const parts = {
    body: `<div class="body" id="body" data-blk="body" contenteditable="${ro ? 'false' : 'true'}" data-ph="Start writing..."></div>`,
    goal: it.goal === null ? '' : `<div class="blk goal ${dc('goal')}" data-blk="goal" ${wd('goal')}>${hnd}<b><span>${ic('target')} Goal progress</span><span id="gp">${it.goal}%</span></b><div class="bar" style="height:${L.barH}px"><i id="gbar" style="width:${it.goal}%"></i><span class="bz" title="Drag to change thickness"></span></div><input type="range" min="0" max="100" value="${it.goal}" data-f="goal"></div>`,
    tasks: `<div class="blk tasks ${dc('tasks')}" data-blk="tasks" ${wd('tasks')}>${hnd}${it.tasks.map((t) => `<div class="task ${t.done ? 'done' : ''}" data-tid="${t.id}" style="--c:${col('t0')}"><button class="cb" data-act="tick">${t.done ? ic('tick') : ''}</button><input class="tx" data-tf="text" value="${esc(t.text)}" placeholder="Task" ${rdo}><span title="Deadline">${ic('clock')}</span><input class="tdue" type="datetime-local" data-tf="due" value="${t.due}"><button class="x" data-act="deltask">${ic('x')}</button></div>`).join('')}<button class="addt" data-act="addtask">+ Add task</button></div>`
  };
  const blocks = L.order.map((k) => parts[k]).join('');
  const acts = ro
    ? `<button class="btn" data-act="edit" style="margin-left:8px" title="Edit this note">${ic('pencil')} Edit</button><button class="btn primary" data-act="export" style="margin-left:8px" title="Save this note as a .fire file">${ic('download')} Export</button>`
    : `<button class="btn" data-act="cancel" style="margin-left:8px" title="Discard changes">Cancel</button><button class="btn primary" data-act="save" style="margin-left:8px" title="Save changes">${ic('tick')} Save</button>`;
  ed.innerHTML = `<div class="ebar">${ab('star', 'star', 'Star', it.starred)}${ab('pin', 'bookmark', it.pinned ? 'Unpin' : 'Pin', it.pinned)}${ab('dup', 'copy', 'Duplicate')}${ab('archive', 'archive', it.archived ? 'Restore' : 'Archive', it.archived)}<span class="sp"></span>${ab('del', 'trash', 'Delete')}${acts}</div>
  ${ro ? '' : `<div class="fmt">${FMT.map((f) => f === '|' ? '<span class="vs"></span>' : f[0][0] === '@' ? `<button data-act="image" title="${f[1]}">${f[2]}</button>` : `<button data-cmd="${f[0]}" title="${f[1]}">${f[2]}</button>`).join('')}</div>`}
  <div class="escroll"><div class="crumb"><span><button class="nbbtn" data-act="nbmenu" title="Change notebook">${ic('folder')}<span>${esc(it.notebook)}</span>${ic('down').replace('<svg', '<svg class="dn"')}</button></span><span id="edited">Last edited on ${EDATE(it.updated)}</span></div>
  <div class="titlerow"><button class="thumb" data-act="style" title="Change icon">${ic(it.icon)}</button><input class="title" data-f="title" placeholder="Untitled note" value="${esc(it.title)}" ${rdo}></div>
  ${blocks}</div>
  <div class="ebottom"><label class="chip ${it.due ? 'on' : ''}">${ic('bell')}<input type="datetime-local" data-f="due" value="${it.due}">${it.due ? `<button data-act="cleardue" title="Clear reminder">${ic('x')}</button>` : ''}</label>
  <button class="chip ${it.goal !== null ? 'on' : ''}" data-act="goal" ${dis}>${ic('target')} Goal</button>${ic('tag', 'var(--muted)')}
  ${it.labels.map((n) => `<span class="chip lb" style="--c:${col(lab(n).color, 'label')}">${esc(n)}<button data-lab="${esc(n)}">${ic('x')}</button></span>`).join('')}
  <input class="chip" id="labIn" list="labList" placeholder="+ Add label" style="width:120px"><datalist id="labList">${S.labels.map((l) => `<option value="${esc(l.name)}">`).join('')}</datalist></div>`;
  $('#body').innerHTML = it.html;
}
function touch(it) { it.updated = Date.now(); save(); renderList(); const e = $('#edited'); if (e) e.textContent = 'Last edited on ' + EDATE(it.updated); }
const syncBody = () => { const it = cur(); if (it) { it.html = $('#body').innerHTML; touch(it); } };

$('#editor').addEventListener('mousedown', (e) => { if (e.target.closest('[data-cmd],[data-act=image]')) e.preventDefault(); });
$('#editor').addEventListener('input', (e) => {
  const it = cur(), t = e.target; if (!it) return;
  if (t.id === 'body') { it.html = t.innerHTML; placeImgUI(); return touch(it); }
  if (t.dataset.f === 'title') { it.title = t.value; return touch(it); }
  if (t.dataset.f === 'goal') { it.goal = +t.value; $('#gp').textContent = it.goal + '%'; $('#gbar').style.width = it.goal + '%'; return touch(it); }
  if (t.dataset.tf) { const k = it.tasks.find((x) => x.id === t.closest('.task').dataset.tid); k[t.dataset.tf] = t.value; if (t.dataset.tf === 'due') k.notified = false; return touch(it); }
});
$('#editor').addEventListener('change', (e) => {
  const it = cur(), f = e.target.dataset.f; if (!it) return;
  if (f === 'notebook') { it.notebook = e.target.value; touch(it); renderSide(); }
  if (f === 'due') { it.due = e.target.value; it.notified = false; touch(it); renderEditor(); }
  if (e.target.id === 'labIn') addLabel(e.target.value);
});
$('#editor').addEventListener('keydown', (e) => { if (e.target.id === 'labIn' && e.key === 'Enter') addLabel(e.target.value); });
$('#editor').addEventListener('paste', async (e) => {
  if (e.target.id !== 'body') return; e.preventDefault();
  const f = [...e.clipboardData.files].find((x) => x.type.startsWith('image/'));
  if (f) return insertImage(f);
  document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
});
$('#editor').addEventListener('dragover', (e) => e.preventDefault());
$('#editor').addEventListener('drop', (e) => { const f = [...(e.dataTransfer?.files || [])].find((x) => x.type.startsWith('image/')); if (f && editing === S.sel && e.target.closest('#body')) { e.preventDefault(); const r = document.caretRangeFromPoint(e.clientX, e.clientY); if (r) range = r; insertImage(f); } });
let range = null;
async function insertImage(f) {
  const url = await pic(f, 1400, false), b = $('#body'); if (!b) return;
  const im = new Image(); im.src = url; try { await im.decode(); } catch {}
  const w = Math.max(80, Math.min(480, im.naturalWidth || 480));
  b.focus(); const s = getSelection();
  if (range && b.contains(range.startContainer)) { s.removeAllRanges(); s.addRange(range); } else { const r = document.createRange(); r.selectNodeContents(b); r.collapse(false); s.removeAllRanges(); s.addRange(r); }
  document.execCommand('insertHTML', false, `<img src="${url}" alt="" style="width:${w}px" data-new="1"><br>`);
  const n = $('img[data-new]', b); if (n) n.removeAttribute('data-new');
  if (s.rangeCount) range = s.getRangeAt(0).cloneRange();
  syncBody(); if (n) selectImg(n);
}

/* ---------- pictures: select, resize, move, align ---------- */
let selImg = null, imgUI = null, dropLine = null;
function hideImgUI() { selImg = null; imgUI?.remove(); imgUI = null; dropLine?.remove(); dropLine = null; }
function placeImgUI() {
  const es = $('.escroll'); if (!selImg || !imgUI || !es || !selImg.isConnected) return hideImgUI();
  const r = selImg.getBoundingClientRect(), e = es.getBoundingClientRect(), al = selImg.dataset.al || 'left';
  Object.assign(imgUI.style, { left: r.left - e.left + es.scrollLeft + 'px', top: r.top - e.top + es.scrollTop + 'px', width: r.width + 'px', height: r.height + 'px' });
  imgUI.classList.toggle('below', r.top - e.top < 58);
  $('.imgw', imgUI).textContent = Math.round(r.width) + ' px';
  const bar = $('.imgbar', imgUI), bw = bar.offsetWidth, x = r.left - e.left;
  bar.style.left = Math.max(8 - x, Math.min(0, e.width - 14 - x - bw)) - 2 + 'px';
  $$('[data-al]', imgUI).forEach((b) => b.classList.toggle('on', b.dataset.al === al));
}
function selectImg(img) {
  const es = $('.escroll'); if (!es) return; selImg = img;
  if (!imgUI) {
    imgUI = document.createElement('div'); imgUI.className = 'imgui';
    const ab = (a, n, t) => `<button data-al="${a}" title="${t}">${ic(n)}</button>`;
    imgUI.innerHTML = `<div class="imgbar">${ab('wl', 'wrapl', 'Picture on the left, text wraps around')}${ab('left', 'alignl', 'Align left')}${ab('center', 'alignc', 'Center')}${ab('right', 'alignr', 'Align right')}${ab('wr', 'wrapr', 'Picture on the right, text wraps around')}<i></i>${[25, 50, 75, 100].map((n) => `<button class="tx" data-sz="${n}" title="${n}% of the page width">${n}%</button>`).join('')}<i></i><button class="tx" data-ia="orig" title="Original size">1:1</button><button data-ia="del" title="Remove picture">${ic('trash')}</button><span class="imgw"></span></div>${['nw', 'ne', 'sw', 'se', 'w', 'e'].map((d) => `<span class="ih" data-d="${d}"></span>`).join('')}`;
  }
  if (imgUI.parentNode !== es) es.appendChild(imgUI);
  placeImgUI();
}
function focusImg(img) {
  const b = $('#body'); b.focus({ preventScroll: true });
  const r = document.createRange(); r.selectNode(img); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
}
function dropSpot(r, y) {
  const body = $('#body'); let n = r.startContainer.nodeType === 3 ? r.startContainer.parentNode : r.startContainer;
  const blk = n !== body && n.closest ? n.closest('h1,h2,h3,h4,blockquote,ul,ol,p,div') : null;
  if (blk && blk !== body && body.contains(blk)) { const rc = blk.getBoundingClientRect(); return { blk, before: y < rc.top + rc.height / 2 }; }
  return { r };
}
function showDrop(d) {
  const es = $('.escroll'); if (!d || !es) { dropLine?.remove(); dropLine = null; return; }
  const e = es.getBoundingClientRect(); let box;
  if (d.blk) { const rc = d.blk.getBoundingClientRect(); box = { l: rc.left, t: (d.before ? rc.top : rc.bottom) - 2, w: rc.width, h: 3 }; }
  else { const rc = d.r.getClientRects()[0]; if (!rc) { dropLine?.remove(); dropLine = null; return; } box = { l: rc.left - 1, t: rc.top, w: 3, h: rc.height || 22 }; }
  if (!dropLine) { dropLine = document.createElement('div'); dropLine.className = 'dropline'; es.appendChild(dropLine); }
  Object.assign(dropLine.style, { left: box.l - e.left + es.scrollLeft + 'px', top: box.t - e.top + es.scrollTop + 'px', width: box.w + 'px', height: box.h + 'px' });
}
function startMove(e, img) {
  const x0 = e.clientX, y0 = e.clientY; let moving = false, target = null;
  const mm = (ev) => {
    if (!moving && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 5) return;
    if (!moving) { moving = true; img.classList.add('dragging'); document.body.style.cursor = 'grabbing'; if (imgUI) imgUI.style.visibility = 'hidden'; }
    const r = document.caretRangeFromPoint(ev.clientX, ev.clientY);
    target = r && $('#body').contains(r.startContainer) && !img.contains(r.startContainer) ? dropSpot(r, ev.clientY) : null;
    showDrop(target);
  };
  const mu = () => {
    document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu);
    document.body.style.cursor = ''; img.classList.remove('dragging'); if (!img.getAttribute('class')) img.removeAttribute('class');
    dropLine?.remove(); dropLine = null;
    if (!moving) return;
    if (target?.blk) target.before ? target.blk.before(img) : target.blk.after(img); else if (target) target.r.insertNode(img);
    if (imgUI) imgUI.style.visibility = '';
    focusImg(img); syncBody(); placeImgUI();
  };
  document.addEventListener('mousemove', mm); document.addEventListener('mouseup', mu);
}
function startResize(e, d) {
  const img = selImg, x0 = e.clientX, w0 = img.getBoundingClientRect().width, max = Math.max(120, $('#body').clientWidth);
  const k = (d.includes('w') ? -1 : 1) * (img.dataset.al === 'center' ? 2 : 1);
  document.body.style.cursor = getComputedStyle(e.target).cursor;
  const mm = (ev) => { img.style.width = Math.round(Math.max(40, Math.min(max, w0 + k * (ev.clientX - x0)))) + 'px'; placeImgUI(); };
  const mu = () => { document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); document.body.style.cursor = ''; syncBody(); placeImgUI(); };
  document.addEventListener('mousemove', mm); document.addEventListener('mouseup', mu);
}
document.addEventListener('mousedown', (e) => {
  const t = e.target;
  if (t.closest('.imgbar')) return e.preventDefault();
  const h = t.closest('.ih'); if (h && selImg) { e.preventDefault(); return startResize(e, h.dataset.d); }
  if (t.tagName === 'IMG' && t.closest('#body') && e.button === 0 && editing === S.sel) { e.preventDefault(); focusImg(t); selectImg(t); return startMove(e, t); }
  if (imgUI) hideImgUI();
});
document.addEventListener('click', (e) => {
  const b = e.target.closest('.imgbar button'); if (!b || !selImg) return; const im = selImg;
  if (b.dataset.al) { if (b.dataset.al === 'left') delete im.dataset.al; else im.dataset.al = b.dataset.al; }
  else if (b.dataset.sz) im.style.width = Math.round($('#body').clientWidth * b.dataset.sz / 100) + 'px';
  else if (b.dataset.ia === 'orig') im.style.width = Math.min(im.naturalWidth, $('#body').clientWidth) + 'px';
  else if (b.dataset.ia === 'del') { im.remove(); hideImgUI(); return syncBody(); }
  syncBody(); placeImgUI();
});
/* ---------- goal + task blocks: move, resize ---------- */
function startBlockMove(e, blk) {
  e.preventDefault(); const it = cur(), es = $('.escroll'), key = blk.dataset.blk; let idx = 0, line = null;
  const others = () => $$('[data-blk]', es).filter((x) => x !== blk);
  blk.classList.add('lifting'); document.body.style.cursor = 'grabbing';
  const mm = (ev) => {
    const o = others(); idx = o.filter((x) => { const r = x.getBoundingClientRect(); return ev.clientY > r.top + r.height / 2; }).length;
    const ref = o[idx], rr = (ref || o[o.length - 1]).getBoundingClientRect(), er = es.getBoundingClientRect();
    if (!line) { line = document.createElement('div'); line.className = 'dropline h'; es.appendChild(line); }
    Object.assign(line.style, { left: rr.left - er.left + es.scrollLeft + 'px', width: rr.width + 'px', top: (ref ? rr.top - 5 : rr.bottom + 3) - er.top + es.scrollTop + 'px' });
  };
  const mu = () => {
    document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); document.body.style.cursor = ''; line?.remove();
    const o = others().map((x) => x.dataset.blk); o.splice(idx, 0, key);
    if (o.join() !== lay(it).order.join()) { lay(it).order = o; touch(it); renderEditor(); } else blk.classList.remove('lifting');
  };
  document.addEventListener('mousemove', mm); document.addEventListener('mouseup', mu);
}
function startDrag(e, onMove, cursor) {
  e.preventDefault(); const it = cur(); document.body.style.cursor = cursor;
  const mm = (ev) => onMove(ev), mu = () => { document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); document.body.style.cursor = ''; touch(it); };
  document.addEventListener('mousemove', mm); document.addEventListener('mouseup', mu);
}
document.addEventListener('mousedown', (e) => {
  const t = e.target, it = cur(); if (!it || e.button !== 0 || editing !== it.id) return;
  const blk = t.closest('[data-blk]'); if (!blk) return;
  if (t.closest('.grip')) return startBlockMove(e, blk);
  if (t.closest('.rz')) {
    const k = blk.dataset.blk + 'W', w0 = blk.getBoundingClientRect().width, x0 = e.clientX, max = $('.escroll').clientWidth - 70;
    return startDrag(e, (ev) => { const w = Math.round(Math.max(260, Math.min(max, w0 + ev.clientX - x0))); blk.style.width = w + 'px'; blk.classList.remove('dflt'); lay(it)[k] = w; }, 'ew-resize');
  }
  if (t.closest('.bz')) {
    const bar = $('.bar', blk), y0 = e.clientY, h0 = bar.getBoundingClientRect().height;
    return startDrag(e, (ev) => { const h = Math.round(Math.max(4, Math.min(44, h0 + ev.clientY - y0))); bar.style.height = h + 'px'; lay(it).barH = h; }, 'ns-resize');
  }
});
document.addEventListener('dblclick', (e) => { const r = e.target.closest('.rz'), it = cur(); if (r && it && editing === it.id) { lay(it)[r.closest('[data-blk]').dataset.blk + 'W'] = 0; touch(it); renderEditor(); } });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { hideImgUI(); closePop(); } });
addEventListener('resize', () => { placeImgUI(); closePop(); });
$('#editor').addEventListener('dragstart', (e) => { if (e.target.tagName === 'IMG') e.preventDefault(); });
$('#editor').addEventListener('scroll', () => closePop(), true);
function addLabel(v) {
  const it = cur(), n = v.trim(); if (!it || !n) return;
  newLabel(n); if (!it.labels.includes(n)) it.labels.push(n);
  touch(it); renderEditor(); renderSide(); $('#labIn')?.focus();
}
const noteFile = (it) => { const n = JSON.parse(JSON.stringify(it)); delete n.notebook; delete n.id; return { format: 'fire-note', version: 2, exported: Date.now(), note: n, labels: S.labels.filter((l) => it.labels.includes(l.name)).map((l) => ({ name: l.name })) }; };

/* ---------- style popover ---------- */
let iconQuery = '';
function iconGrid() {
  const q = iconQuery.toLowerCase().trim(), it = cur(), l = NOTE_ICONS.filter((n) => !q || (n + ' ' + ICON_META[n]).includes(q));
  return l.length ? l.map((n) => `<button data-set="icon:${n}" class="${it.icon === n ? 'on' : ''}" title="${n}">${ic(n)}</button>`).join('') : '<p class="noic">No icons match.</p>';
}
function stylePop() {
  closePop(); const it = cur(), btn = $('.titlerow .thumb'); if (!it || !btn) return;
  const el = document.createElement('div'); el.className = 'pop'; el.id = 'stylePop';
  el.innerHTML = `<input class="isearch" id="iconQ" placeholder="Search icons: car, laptop, bike..." value="${esc(iconQuery)}"><div class="ig" id="iconGrid">${iconGrid()}</div><p>The icon color follows your theme color.</p>`;
  document.body.appendChild(el);
  const r = btn.getBoundingClientRect();
  el.style.left = Math.max(8, Math.min(r.left, innerWidth - el.offsetWidth - 8)) + 'px';
  el.style.top = Math.max(8, Math.min(r.bottom + 8, innerHeight - el.offsetHeight - 8)) + 'px';
}
const closePop = () => $('#stylePop')?.remove();
function paintThumb(it) { const t = $('.titlerow .thumb'); if (t) t.innerHTML = ic(it.icon); }
function refreshPop() {
  const it = cur(); if (!it) return;
  $$('#stylePop [data-set]').forEach((b) => { const [k, v] = b.dataset.set.split(':'); b.classList.toggle('on', it[k] === v); });
}
function setStyle(k, v) { const it = cur(); it[k] = v; touch(it); paintThumb(it); refreshPop(); }

/* ---------- settings ---------- */
const APP_VERSION = '1.0', SRC_URL = 'https://github.com/HafizIbrahimSuriya/Fire-NoteMaker';
const SOCIALS = [['GitHub', 'b_github', 'HafizIbrahimSuriya', 'https://github.com/HafizIbrahimSuriya'], ['Instagram', 'b_instagram', 'HafizIbrahimSuriya', 'https://instagram.com/HafizIbrahimSuriya'], ['YouTube', 'b_youtube', 'HafizIbrahimSuriya', 'https://www.youtube.com/@HafizIbrahimSuriya'], ['Discord', 'b_discord', 'HafizIbrahimSuriya', '']];
let setTab = 'profile';
const avatar = () => `<img src="${S.settings.dp || '../assets/logo.png'}" alt="" class="${S.settings.dp ? 'dp' : ''}">`;
function renderMe() { $('#meBtn').innerHTML = `${avatar()}<span><b>${esc(S.settings.name || 'Fire user')}</b></span>`; }
const sw2 = (attr, on, t, d) => `<div class="srow"><div><b>${t}</b><small>${d}</small></div><label class="sw2"><input type="checkbox" ${attr} ${on ? 'checked' : ''}><i></i></label></div>`;
function renderSet() {
  const tabs = [['profile', 'Profile', 'user'], ['general', 'General', 'bell'], ['look', 'Appearance', 'sun'], ['data', 'Your data', 'download'], ['social', 'Social', 'globe'], ['about', 'About', 'info']], s = S.settings;
  const P2 = {
    profile: `<h3>Profile</h3><div class="prof"><div class="av">${avatar()}</div><div class="pbtn"><button class="btn" data-act="dpPick">${ic('image')} Change picture</button>${s.dp ? `<button class="btn" data-act="dpDel">Remove</button>` : ''}</div></div><label class="fld">Your name<input data-s="name" maxlength="30" value="${esc(s.name)}" placeholder="What should Fire call you?"></label><p class="hint">Your name and picture are used inside Fire only.</p>`,
    general: `<h3>General</h3>${sw2('data-s="notifications"', s.notifications, 'Notifications', 'Show a desktop alert for reminders and task deadlines')}${sw2('data-startup', false, 'Start with Windows', 'Fire opens quietly in the tray when you sign in')}`,
    look: `<h3>Appearance</h3><h5>Mode</h5><div class="seg">${['light', 'Light', 'dark', 'Dark', 'system', 'System'].map((v, i, a) => i % 2 ? '' : `<button data-mode="${v}" class="${S.theme.mode === v ? 'on' : ''}">${a[i + 1]}</button>`).join('')}</div><h5>Theme color</h5><div class="sw">${ACCENTS.map((c) => `<button data-accent="${c}" class="${S.theme.accent === c ? 'on' : ''}" style="background:${c}"></button>`).join('')}<label class="cdot big ${ACCENTS.includes(S.theme.accent) ? '' : 'on'}" title="Pick any color" style="${ACCENTS.includes(S.theme.accent) ? '' : 'background:' + S.theme.accent}"><input type="color" id="accIn" value="${S.theme.accent}"></label></div><p class="hint">Note colors, icon colors and labels all follow your theme color.</p>`,
    about: `<h3>About</h3><div class="aboutbox"><img src="../assets/logo.png" alt="Fire"><div><b class="an">Fire</b><small>Notes, tasks, goals and reminders. No account needed.</small></div></div><div class="kvs"><div class="kv"><span>Version</span><b>${APP_VERSION}</b></div><div class="kv"><span>Made by</span><b>HafizIbrahim</b></div><div class="kv"><span>Source code</span><b>Open source</b></div></div><p class="hint">Fire is free and open source. Read the code, report bugs or give it a star on GitHub.</p><button class="btn" data-ext="${SRC_URL}">${ic('b_github')} View source on GitHub ${ic('ext')}</button>`,
    social: `<h3>Social</h3><p class="hint" style="margin:0 0 6px">Follow HafizIbrahim, the maker of Fire.</p>${SOCIALS.map(([n, i, h, u]) => u ? `<button class="soc" data-ext="${u}"><span class="si">${ic(i)}</span><span class="st"><b>${n}</b><small>${h}</small></span>${ic('ext')}</button>` : `<button class="soc" data-copy="${h}"><span class="si">${ic(i)}</span><span class="st"><b>${n}</b><small>${h}</small></span><span class="cp">${ic('copy')} Copy</span></button>`).join('')}`,
    data: `<h3>Your data</h3><p class="hint" style="margin:0 0 8px">Every note is saved as its own .fire file in Documents\\Fire\\Notes, one folder per notebook. A .firedata backup holds everything: notes, notebooks, labels, goals, theme, your name and your picture.</p><button class="btn" data-act="exportAll">${ic('download')} Export all data (.firedata)</button><button class="btn" data-act="importData">${ic('upload')} Import .firedata backup</button><button class="btn" data-act="openFolder">${ic('folder')} Open Fire folder</button><button class="btn danger" data-act="wipe">${ic('trash')} Delete all notes</button><p class="hint" id="dpath"></p>`
  };
  $('#set').innerHTML = `<div class="setnav"><h2>Settings</h2>${tabs.map(([k, t, n]) => `<button class="nav ${setTab === k ? 'on' : ''}" data-stab="${k}">${ic(n)}${t}</button>`).join('')}</div><div class="setbody"><button class="ib xs" data-act="closeSet" title="Close">${ic('x')}</button>${P2[setTab]}</div>`;
  if (setTab === 'data' && window.fire) window.fire.dataPath().then((p) => { const e = $('#dpath'); if (e) e.textContent = 'Fire keeps all your data in: ' + p; });
  if (setTab === 'general' && window.fire) window.fire.getStartup().then((v) => { const c = $('[data-startup]'); if (c) c.checked = v; });
}
function openSettings(t) { setTab = t || setTab; renderSet(); if (!$('#set').open) $('#set').showModal(); }
$('#set').addEventListener('click', (e) => { if (e.target === $('#set')) $('#set').close(); });

/* ---------- import ---------- */
const defNb = () => S.view.startsWith('nb:') ? S.view.slice(3) : S.notebooks[0];
function addNotes(list, labels = []) {
  let last = null;
  labels.forEach((l) => newLabel(l.name));
  list.forEach((n) => {
    const it = newItem({ ...n, notebook: n.notebook || defNb(), id: uid(), html: clean(n.html), tasks: (n.tasks || []).map((t) => ({ ...newTask(), ...t, id: uid() })), labels: n.labels || [], notified: false });
    if (!S.notebooks.includes(it.notebook)) S.notebooks.push(it.notebook);
    it.labels.forEach(newLabel); S.items.unshift(it); last = it;
  });
  if (last) { S.sel = last.id; S.view = 'all'; S.tab = 'all'; }
}
async function importFiles(files, only) {
  for (const f of files) {
    const ext = f.name.split('.').pop().toLowerCase();
    if (only && ext !== only) { await ask('Wrong file type', `Only .${only} files can be imported here.`); continue; }
    try {
      const raw = await readFile(f);
      if (ext === 'fire') { const d = JSON.parse(raw); if (d.format !== 'fire-note') throw 0; delete d.note.notebook; addNotes([d.note], d.labels); }
      else if (ext === 'firedata') {
        const d = JSON.parse(raw); if (d.format !== 'fire-data') throw 0;
        const OLDNB = 'NoteBook-01', fx = (n) => n === OLDNB ? DEFAULT_NB : n;
        d.notebooks = (d.notebooks || []).map(fx); (d.items || []).forEach((i) => { i.notebook = fx(i.notebook); });
        const c = await ask('Import backup', 'Replace everything with this backup, or add its notes to what you already have?', [['Cancel', null], ['Add notes', false], ['Replace all', true, 'danger']]);
        if (c === null) continue;
        if (c) {
          S.items = []; S.notebooks = d.notebooks?.length ? d.notebooks : [DEFAULT_NB]; S.labels = d.labels || []; S.view = 'all';
          if (d.theme) S.theme = d.theme; if (d.settings) S.settings = { ...S.settings, ...d.settings };
        } else {
          (d.labels || []).forEach((l) => newLabel(l.name)); d.notebooks.forEach((n) => { if (!S.notebooks.includes(n)) S.notebooks.push(n); });
          if (!S.settings.name && d.settings?.name) S.settings.name = d.settings.name; if (!S.settings.dp && d.settings?.dp) S.settings.dp = d.settings.dp;
        }
        addNotes((d.items || []).reverse()); applyTheme();
      } else { addNotes([{ title: f.name.replace(/\.\w+$/, ''), html: esc(raw).replace(/\n/g, '<br>') }]); }
    } catch { await ask('Cannot open file', `"${f.name}" is not a valid Fire file.`); }
  }
  save(); renderAll(); renderMe(); if ($('#set').open) renderSet();
}

/* ---------- clicks ---------- */
function newNote() {
  const nb = S.view.startsWith('nb:') ? S.view.slice(3) : S.notebooks[0], it = newItem({ notebook: nb, labels: S.view.startsWith('lb:') ? [S.view.slice(3)] : [], pinned: S.view === 'pinned', starred: S.view === 'starred' });
  S.items.unshift(it); S.sel = it.id; editing = it.id; snap = JSON.stringify(it); freshId = it.id; if (S.view === 'archive' || S.tab === 'reminder' || ['tasks', 'reminders', 'goals'].includes(S.view)) { S.view = 'all'; S.tab = 'all'; }
  save(); renderAll(); $('[data-f=title]')?.focus();
}
document.addEventListener('click', async (e) => {
  const t = e.target, q = (s) => t.closest(s);
  if (!q('#stylePop,[data-act=style]')) closePop();
  let a;
  if ((a = q('[data-delnb]'))) {
    const n = a.dataset.delnb, k = S.items.filter((i) => i.notebook === n).length, to = S.notebooks.find((x) => x !== n) || 'General';
    if (await ask('Delete notebook?', `"${n}"${k ? ` has ${k} note${k > 1 ? 's' : ''}. They will move to "${to}".` : ' will be removed.'}`, DEL)) { S.items.forEach((i) => { if (i.notebook === n) i.notebook = to; }); S.notebooks = S.notebooks.filter((x) => x !== n); if (!S.notebooks.length) S.notebooks = [to]; if (S.view === 'nb:' + n) S.view = 'all'; go(S.view); }
    return;
  }
  if ((a = q('[data-dellb]'))) {
    const n = a.dataset.dellb;
    if (await ask('Delete label?', `"${n}" will be removed from all notes.`, DEL)) { S.items.forEach((i) => { i.labels = i.labels.filter((x) => x !== n); }); S.labels = S.labels.filter((l) => l.name !== n); if (S.view === 'lb:' + n) S.view = 'all'; go(S.view); }
    return;
  }
  if ((a = q('[data-rennb]'))) { renaming = { k: 'nb', name: a.dataset.rennb }; return renderSide(); }
  if ((a = q('[data-renlb]'))) { renaming = { k: 'lb', name: a.dataset.renlb }; return renderSide(); }
  if ((a = q('[data-view]'))) return go(a.dataset.view);
  if ((a = q('[data-open]'))) { open[a.dataset.open] = !open[a.dataset.open]; return renderSide(); }
  if ((a = q('[data-add]'))) { adding = a.dataset.add; return renderSide(); }
  if ((a = q('[data-tab]'))) { S.tab = a.dataset.tab; save(); return renderList(); }
  if ((a = q('[data-ext]'))) { const u = a.dataset.ext; return window.fire ? window.fire.openExternal(u) : window.open(u, '_blank'); }
  if ((a = q('[data-copy]'))) { const v = a.dataset.copy, c = a.querySelector('.cp'); (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).catch(() => {}); if (c) { c.innerHTML = ic('check') + ' Copied'; setTimeout(() => { if (c.isConnected) c.innerHTML = ic('copy') + ' Copy'; }, 1500); } return; }
  if ((a = q('[data-stab]'))) { setTab = a.dataset.stab; return renderSet(); }
  if ((a = q('[data-mode]'))) { S.theme.mode = a.dataset.mode; save(); applyTheme(); renderAll(); return renderSet(); }
  if ((a = q('[data-accent]'))) { S.theme.accent = a.dataset.accent; save(); applyTheme(); renderAll(); return renderSet(); }
  if ((a = q('[data-set]'))) { const [k, v] = a.dataset.set.split(':'); return setStyle(k, v); }
  if ((a = q('[data-cmd]'))) {
    $('#body').focus(); const c = a.dataset.cmd;
    if (c === 'h2') document.execCommand('formatBlock', false, 'H2'); else if (c === 'quote') document.execCommand('formatBlock', false, 'BLOCKQUOTE'); else document.execCommand(c);
    return syncBody();
  }
  if ((a = q('[data-lab]'))) { const it = cur(); it.labels = it.labels.filter((n) => n !== a.dataset.lab); touch(it); return renderEditor(); }
  if ((a = q('.row'))) { S.sel = a.dataset.id; save(); renderList(); return renderEditor(); }
  if (!(a = q('[data-act]'))) return;
  const it = cur(), act = a.dataset.act, tk = () => it.tasks.find((x) => x.id === a.closest('.task')?.dataset.tid);
  if (['deltask', 'addtask', 'goal', 'image'].includes(act) && (!it || editing !== it.id)) return;
  if (act === 'collapse') return toggleSide();
  if (act === 'settings') return openSettings();
  if (act === 'closeSet') return $('#set').close();
  if (act === 'import') return $('#file').click();
  if (act === 'importData') return $('#fileData').click();
  if (act === 'openFolder') return window.fire?.openFolder();
  if (act === 'new') return newNote();
  if (act === 'dpPick') return $('#dpIn').click();
  if (act === 'dpDel') { S.settings.dp = ''; save(); renderMe(); return renderSet(); }
  if (act === 'exportAll') return saveFile('fire-backup', JSON.stringify({ format: 'fire-data', version: 1, exported: Date.now(), items: S.items, notebooks: S.notebooks, labels: S.labels, theme: S.theme, settings: S.settings }), 'firedata');
  if (act === 'wipe') { if (await ask('Delete all notes?', 'Every note will be removed. Export a backup first if you are not sure.', DEL)) { S.items = []; S.notebooks = [DEFAULT_NB]; S.labels = []; S.sel = null; S.view = 'all'; save(); renderAll(); } return; }
  if (!it) return;
  if (act === 'edit') { editing = it.id; snap = JSON.stringify(it); freshId = null; renderEditor(); $('#body')?.focus(); return; }
  if (act === 'save') { editing = null; snap = null; freshId = null; flush(); renderList(); return renderEditor(); }
  if (act === 'cancel') {
    if (freshId === it.id && !it.title.trim() && !text(it.html).trim() && !it.html.includes('<img') && !it.tasks.length) { editing = null; snap = null; freshId = null; S.items = S.items.filter((x) => x !== it); S.sel = null; return go(S.view); }
    if (snap) { const o = JSON.parse(snap); Object.keys(it).forEach((k) => delete it[k]); Object.assign(it, o); }
    editing = null; snap = null; freshId = null; save(); return renderAll();
  }
  if (act === 'star') { it.starred = !it.starred; touch(it); renderEditor(); renderSide(); }
  if (act === 'pin') { it.pinned = !it.pinned; save(); renderList(); renderEditor(); renderSide(); }
  if (act === 'archive') { it.archived = !it.archived; save(); go(S.view); }
  if (act === 'dup') { const c = newItem({ ...JSON.parse(JSON.stringify(it)), id: uid(), title: it.title + ' (copy)', created: Date.now(), updated: Date.now() }); S.items.unshift(c); S.sel = c.id; save(); renderAll(); }
  if (act === 'del' && await ask('Delete this note?', 'This cannot be undone.', DEL)) { S.items = S.items.filter((x) => x !== it); S.sel = null; go(S.view); }
  if (act === 'export') saveFile(it.title || 'Untitled note', JSON.stringify(noteFile(it)), 'fire');
  if (act === 'image') { const s = getSelection(); range = s.rangeCount ? s.getRangeAt(0).cloneRange() : null; $('#imgIn').click(); }
  if (act === 'style') { $('#stylePop') ? closePop() : stylePop(); }
  if (act === 'nbmenu') { if (nbWasOpen) return; const btn = q('[data-act=nbmenu]'); closeCtx(); btn.classList.add('open'); const r = btn.getBoundingClientRect(), m = document.createElement('div'); m.id = 'ctx'; m.className = 'ctx'; m.dataset.nb = '1';
    m.innerHTML = `<div class=\"ch\">Notebook</div>${S.notebooks.map((n) => `<button data-mv=\"${esc(n)}\" class=\"${n === it.notebook ? 'cur' : ''}\">${ic(n === it.notebook ? 'tick' : 'folder')}${esc(n)}</button>`).join('')}`;
    document.body.appendChild(m); m.style.left = Math.max(8, Math.min(r.left, innerWidth - m.offsetWidth - 8)) + 'px'; m.style.top = Math.min(r.bottom + 6, innerHeight - m.offsetHeight - 8) + 'px';
    m.onclick = (ev) => { const b = ev.target.closest('[data-mv]'); if (b) { it.notebook = b.dataset.mv; touch(it); renderEditor(); renderSide(); } closeCtx(); }; }
  if (act === 'tick') { const k = tk(); k.done = !k.done; touch(it); renderEditor(); }
  if (act === 'deltask') { it.tasks = it.tasks.filter((x) => x !== tk()); touch(it); renderEditor(); renderSide(); }
  if (act === 'addtask') { it.tasks.push(newTask()); touch(it); renderEditor(); renderSide(); const x = $$('.tx'); x[x.length - 1]?.focus(); }
  if (act === 'goal') { it.goal = it.goal === null ? 0 : null; touch(it); renderEditor(); renderSide(); }
  if (act === 'cleardue') { it.due = ''; touch(it); renderEditor(); }
});
document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.id === 'iconQ') { iconQuery = t.value; $('#iconGrid').innerHTML = iconGrid(); }
  if (t.id === 'accIn') { S.theme.accent = t.value; save(); applyTheme(); renderAll(); t.parentElement.style.background = t.value; t.parentElement.classList.add('on'); $$('.sw [data-accent].on').forEach((b) => b.classList.remove('on')); }
  if (t.dataset.s === 'name') { S.settings.name = t.value; save(); renderMe(); }
});
document.addEventListener('change', async (e) => {
  const t = e.target;
  if (t.id === 'sort') { S.sort = t.value; save(); renderList(); }
  if (t.id === 'file') { await importFiles([...t.files]); t.value = ''; }
  if (t.id === 'fileData') { await importFiles([...t.files], 'firedata'); t.value = ''; }
  if (t.id === 'imgIn') { for (const f of t.files) await insertImage(f); t.value = ''; }
  if (t.id === 'dpIn' && t.files[0]) { S.settings.dp = await pic(t.files[0], 160, true); save(); renderMe(); renderSet(); t.value = ''; }
  if (t.dataset.s === 'notifications') { S.settings.notifications = t.checked; save(); }
  if (t.hasAttribute('data-startup') && window.fire) window.fire.setStartup(t.checked);
});
$('#q').addEventListener('input', renderList);
$('#meBtn').onclick = () => openSettings('profile');
$('#bellBtn').onclick = () => go('reminders');
$('#icSearch').innerHTML = ic('search');

/* ---------- reminders ---------- */
function notify(t, b) { if (!S.settings.notifications) return; window.fire ? window.fire.notify(t, b) : window.Notification && new Notification(t, { body: b }); }
function tick() {
  let ch = false; const now = new Date();
  for (const i of S.items) {
    if (i.due && !i.notified && new Date(i.due) <= now) { notify(i.title || 'Reminder', text(i.html).slice(0, 100) || 'Time is up!'); i.notified = true; ch = true; }
    for (const t of i.tasks) if (t.due && !t.done && !t.notified && new Date(t.due) <= now) { notify('Task due: ' + (t.text || 'Untitled'), i.title || ''); t.notified = true; ch = true; }
  }
  if (ch) { save(); renderList(); }
}
setInterval(tick, 15000);
if (window.fire) window.fire.onNewNote(newNote);


/* ---------- move notes between notebooks: drag, or right-click ---------- */
function moveNote(id, nb) {
  const it = S.items.find((x) => x.id === id); if (!it || it.notebook === nb) return;
  it.notebook = nb; it.updated = Date.now(); save();
  if (S.view.startsWith('nb:') && S.view !== 'nb:' + nb) { const l = visible(); if (!l.find((x) => x.id === S.sel)) S.sel = l[0]?.id || null; }
  renderAll();
}
let dragId = null;
document.addEventListener('dragstart', (e) => {
  const r = e.target.closest?.('.row'); if (!r) return;
  dragId = r.dataset.id; e.dataTransfer.setData('text/plain', dragId); e.dataTransfer.effectAllowed = 'move'; r.classList.add('dragging');
});
document.addEventListener('dragend', () => { dragId = null; $$('.row.dragging,.navrow.over').forEach((n) => n.classList.remove('dragging', 'over')); });
document.addEventListener('dragover', (e) => {
  const n = dragId && e.target.closest?.('[data-nbdrop]'); $$('.navrow.over').forEach((x) => { if (x !== n) x.classList.remove('over'); });
  if (n) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; n.classList.add('over'); }
});
document.addEventListener('drop', (e) => {
  const n = dragId && e.target.closest?.('[data-nbdrop]'); if (!n) return;
  e.preventDefault(); const id = dragId; dragId = null; moveNote(id, n.dataset.nbdrop);
});
function closeCtx() { $('#ctx')?.remove(); document.querySelector('.nbbtn.open')?.classList.remove('open'); }
let nbWasOpen = false;
document.addEventListener('mousedown', (e) => { nbWasOpen = !!(e.target.closest('.nbbtn') && $('#ctx')?.dataset.nb); }, true);
document.addEventListener('contextmenu', (e) => {
  const r = e.target.closest?.('.row'); closeCtx(); if (!r) return;
  e.preventDefault(); const it = S.items.find((x) => x.id === r.dataset.id); if (!it) return;
  const m = document.createElement('div'); m.id = 'ctx'; m.className = 'ctx';
  m.innerHTML = `<div class="ch">Move to notebook</div>${S.notebooks.map((n) => `<button data-mv="${esc(n)}" class="${n === it.notebook ? 'cur' : ''}">${ic(n === it.notebook ? 'tick' : 'folder')}${esc(n)}</button>`).join('')}`;
  document.body.appendChild(m);
  m.style.left = Math.min(e.clientX, innerWidth - m.offsetWidth - 8) + 'px'; m.style.top = Math.min(e.clientY, innerHeight - m.offsetHeight - 8) + 'px';
  m.onclick = (ev) => { const b = ev.target.closest('[data-mv]'); if (b) moveNote(it.id, b.dataset.mv); closeCtx(); };
});
document.addEventListener('mousedown', (e) => { if (!e.target.closest('#ctx')) closeCtx(); });
addEventListener('blur', closeCtx);

function renderAll() { renderRail(); renderSide(); renderList(); renderEditor(); }
applyTheme(); renderMe(); renderAll(); tick();
