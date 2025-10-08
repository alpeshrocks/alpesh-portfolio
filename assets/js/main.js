// =====================
// Advanced interactions (vanilla JS)
// =====================

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Theme toggle
const toggle = document.getElementById('themeToggle');
toggle?.addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
  toggle.textContent = document.documentElement.classList.contains('light') ? '☀' : '☾';
});

// Smooth scroll with offset for fixed header
document.querySelectorAll('[data-nav]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Parallax: move layers with mouse and scroll
const parallax = document.querySelector('.parallax');
const layers = document.querySelectorAll('.layer');
function parallaxMove(e){
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  layers.forEach((layer, i) => {
    const depth = (i+1) * 12;
    layer.style.transform = `translateZ(${-depth}px) translate(${dx*depth}px, ${dy*depth}px)`;
  });
}
if (parallax){
  window.addEventListener('mousemove', parallaxMove);
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.12;
    layers.forEach((layer, i) => {
      layer.style.transform += ` translateY(${y*(i+1)*0.1}px)`;
    });
  });
}

// Liquid SVG peak morphing on scroll
const peak = document.getElementById('peakPath');
const d1 = "M0,160L120,176C240,192,480,224,720,213.3C960,203,1200,149,1320,122.7L1440,96L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z";
const d2 = "M0,192L120,186.7C240,181,480,171,720,165.3C960,160,1200,160,1320,165.3L1440,171L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z";
if (peak){
  let toggled = false;
  const onScroll = () => {
    const t = Math.min(1, window.scrollY / (window.innerHeight * 0.8));
    if (t > .3 && !toggled){ peak.setAttribute('d', d2); toggled = true; }
    else if (t <= .3 && toggled){ peak.setAttribute('d', d1); toggled = false; }
  };
  window.addEventListener('scroll', onScroll, { passive:true });
}

// Reveal on scroll with IntersectionObserver
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold:.2 });
revealEls.forEach(el => io.observe(el));

// 3D tilt effect on cards
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -8;
    const ry = ((x / r.width) - 0.5) * 8;
    card.style.setProperty('--rx', rx + 'deg');
    card.style.setProperty('--ry', ry + 'deg');
    card.style.setProperty('--x', (x / r.width) * 100 + '%');
    card.style.setProperty('--y', (y / r.height) * 100 + '%');
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });
});

// Leaf cursor trail (subtle particles)
const canvas = document.getElementById('leafTrail');
const ctx = canvas.getContext('2d');
let particles = [];
function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
function leafParticle(x,y){
  return { x, y, vx:(Math.random()-0.5)*0.6, vy: -Math.random()*0.6-0.2, life: 1, rot: Math.random()*Math.PI*2, r: 4+Math.random()*6 };
}
function drawLeaf(p){
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = Math.max(0, p.life);
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--leaf').trim() || '#70e000';
  ctx.beginPath();
  ctx.moveTo(0, -p.r);
  ctx.quadraticCurveTo(p.r, -p.r, p.r, 0);
  ctx.quadraticCurveTo(p.r, p.r, 0, p.r*0.8);
  ctx.quadraticCurveTo(-p.r, p.r, -p.r, 0);
  ctx.quadraticCurveTo(-p.r, -p.r, 0, -p.r);
  ctx.fill();
  ctx.restore();
}
function tick(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    p.vy += 0.004; // gravity
    p.rot += 0.02;
    p.life -= 0.01;
    drawLeaf(p);
  });
  particles = particles.filter(p => p.life > 0);
  requestAnimationFrame(tick);
}
window.addEventListener('resize', resize);
window.addEventListener('pointermove', (e)=>{
  for (let i=0;i<2;i++){ particles.push(leafParticle(e.clientX, e.clientY)); }
});
resize(); tick();

// Respect reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  window.removeEventListener('pointermove', ()=>{});
  particles = [];
}

// Keyboard focus style for cards
document.querySelectorAll('.card, .project-card').forEach(el => {
  el.addEventListener('focus', ()=> el.classList.add('focus'));
  el.addEventListener('blur', ()=> el.classList.remove('focus'));
});
