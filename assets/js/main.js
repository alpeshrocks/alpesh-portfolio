// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle with persistence
const saved = localStorage.getItem('theme');
if (saved === 'light') document.documentElement.classList.add('light');
const toggle = document.getElementById('themeToggle');
function updateToggleIcon(){
  toggle.textContent = document.documentElement.classList.contains('light') ? '☀' : '☾';
}
updateToggleIcon();
toggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
  localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
  updateToggleIcon();
});

// Smooth scroll
document.querySelectorAll('[data-nav]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const el = document.querySelector(a.getAttribute('href'));
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry => { if (entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target);} });
},{ threshold:.2 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// 3D tilt hover
document.querySelectorAll('.project-card, .card').forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -6;
    const ry = ((x / r.width) - 0.5) * 6;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = `perspective(800px) rotateX(0) rotateY(0)`;
  });
});

// Hydrate from server-injected data (keeps site usable without JS too)
const projects = (window.__PROJECTS__ || []).slice(0, 12);
const grid = document.getElementById('projectGrid');
if (grid && projects.length){
  // If server rendered, do nothing; else render
  if (!grid.children.length){
    grid.innerHTML = projects.map(p => `
      <a class="project-card reveal" ${p.href ? `href="${p.href}" target="_blank" rel="noopener"` : ''}>
        <h3>${p.title}</h3>
        <p>${p.desc || ''}</p>
      </a>
    `).join('');
  }
}

const experience = (window.__EXPERIENCE__ || []).slice(0, 10);
const exp = document.getElementById('expItems');
if (exp && experience.length){
  if (!exp.children.length){
    exp.innerHTML = experience.map(e => `
      <div class="item reveal">
        <div class="dates">${e.dates || ''}</div>
        <h3>${e.title}</h3>
      </div>
    `).join('');
  }
}
