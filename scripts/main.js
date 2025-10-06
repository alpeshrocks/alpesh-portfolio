document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      // For GitHub Pages, we can't run a backend.
      // This just gives the user a copyable mailto link.
      const subject = encodeURIComponent('Portfolio inquiry');
      const body = encodeURIComponent(`Hi Alpesh,\n\nMy name is ${data.name}.\n${data.message}\n\nReply to: ${data.email}`);
      const mailto = `mailto:alpeshsh@usc.edu?subject=${subject}&body=${body}`;
      window.location.href = mailto;
      msg.textContent = 'Opening your email client…';
      form.reset();
    });
  }
});