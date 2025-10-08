// Year
document.getElementById('year').textContent = new Date().getFullYear();

// ==== Theme toggle with persistence & meta theme-color ====
const metaTheme = document.getElementById('metaTheme');
const saved = localStorage.getItem('theme');
if (saved === 'light') document.documentElement.classList.add('light');
function syncThemeColor(){
  const light = document.documentElement.classList.contains('light');
  metaTheme.setAttribute('content', light ? '#f7fbff' : '#0a1220');
}
syncThemeColor();
const toggle = document.getElementById('themeToggle');
function updateToggleIcon(){ toggle.textContent = document.documentElement.classList.contains('light') ? '☀' : '☾'; }
updateToggleIcon();
toggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
  localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
  updateToggleIcon();
  syncThemeColor();
});

// Smooth nav scroll
document.querySelectorAll('[data-nav]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const el = document.querySelector(a.getAttribute('href'));
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ==== Reveal on scroll ====
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry => { if (entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target);} });
},{ threshold:.2 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ==== 3D tilt hover ====
document.querySelectorAll('.r3d, .card, .project-card').forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -7;
    const ry = ((x / r.width) - 0.5) * 7;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = `perspective(900px) rotateX(0) rotateY(0)`;
  });
});

// ==== Starfield background ====
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];
function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
function makeStar(){ return { x: Math.random()*canvas.width, y: Math.random()*canvas.height, z: Math.random()*1.2+0.2, a: Math.random()*1}; }
function initStars(n=180){ stars = new Array(n).fill(0).map(makeStar); }
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const light = document.documentElement.classList.contains('light');
  ctx.fillStyle = light ? 'rgba(14,165,168,0.12)' : 'rgba(123,223,255,0.12)';
  stars.forEach(s => {
    s.a += 0.02;
    const r = (Math.sin(s.a)+1)/2 * (1.2*s.z) + 0.2;
    ctx.beginPath();
    ctx.arc(s.x, s.y, r, 0, Math.PI*2);
    ctx.fill();
    s.x += 0.02*(s.z);
    if (s.x > canvas.width+2) s.x = -2;
  });
  requestAnimationFrame(draw);
}
addEventListener('resize', ()=>{ resize(); initStars(); });
resize(); initStars(); draw();

// ==== Hydrate dynamic lists if needed ====
const projects = (window.__PROJECTS__ || []).slice(0, 12);
const grid = document.getElementById('projectGrid');
if (grid && !grid.children.length){
  grid.innerHTML = projects.map(p => `
    <a class="project-card r3d reveal" ${p.href ? `href="${p.href}" target="_blank" rel="noopener"` : ''}>
      <h3>${p.title}</h3>
      <p>${p.desc || ''}</p>
    </a>
  `).join('');
}
const experience = (window.__EXPERIENCE__ || []).slice(0, 10);
const exp = document.querySelector('.timeline .items');
if (exp && !exp.children.length){
  exp.innerHTML = experience.map(e => `
    <div class="item reveal r3d">
      <div class="dot"></div>
      <div class="dates">${e.dates || ''}</div>
      <h3>${e.title}</h3>
    </div>
  `).join('');
}
