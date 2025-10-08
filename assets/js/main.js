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

// ==== Inject Projects from your original (edit array as needed) ====
// Replace titles/links with your real ones; this keeps what we detected + safe defaults
const projects = [
  { title: "code-atlas-rag", desc: "Semantic code search & explanations with embeddings + RAG.", href: "#" },
  { title: "internship-orbit", desc: "Job-source orchestration, tracking, and dashboards.", href: "#" },
  { title: "la-food-scenes", desc: "NLP trends across Reddit/Yelp/Maps for LA dining.", href: "#" },
  { title: "terra-ledger", desc: "Blockchain-based land registry with KYC & tax logic.", href: "#" },
  // add more from your original zip here…
];

const grid = document.getElementById('projectGrid');
grid.innerHTML = projects.map(p => `
  <a class="project-card reveal" ${p.href ? `href="${p.href}" target="_blank" rel="noopener"` : ''}>
    <h3>${p.title}</h3>
    <p>${p.desc || ''}</p>
  </a>
`).join('');

// ==== Experience (horizontal desktop / vertical mobile) ====
const experience = [
  { title: "USC ITS — Solutions Programmer / Student Engineer", dates: "Jan 2025 — Present" },
  { title: "Community Grocery Startup — Founder/Engineer", dates: "2020 — 2022" },
  { title: "Sprighub — Software Engineer (Intern/Contract)", dates: "2022 — 2023" },
  // add anything else from your original resume here…
];
const exp = document.getElementById('expItems');
exp.innerHTML = experience.map(e => `
  <div class="item reveal">
    <div class="dates">${e.dates}</div>
    <h3>${e.title}</h3>
  </div>
`).join('');
