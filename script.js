// ===== NAVIGATION =====
function navigate(section) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  document.getElementById('section-' + section).classList.add('active');
  const navLink = document.querySelector('.sidebar-nav a[data-section="' + section + '"]');
  if(navLink) navLink.classList.add('active');
  window.scrollTo(0, 0);
}
document.querySelectorAll('.sidebar-nav a').forEach(a => {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    navigate(this.dataset.section);
  });
});

// ===== PORTFOLIO FILTER =====
document.querySelectorAll('.pf-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.pf;
    document.querySelectorAll('#portfolioGrid .portfolio-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.pf === filter) ? '' : 'none';
    });
  });
});

// ===== BLOG FILTER =====
document.querySelectorAll('.blog-filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.blog-filter-btn').forEach(b => {
      b.classList.remove('active', 'active-bracket');
    });
    this.classList.add('active', 'active-bracket');
    const filter = this.dataset.blog;
    document.querySelectorAll('#blogGrid .blog-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.blog === filter) ? '' : 'none';
    });
  });
});

// Blog search
document.getElementById('blogSearch').addEventListener('input', function() {
  const q = this.value.toLowerCase();
  document.querySelectorAll('#blogGrid .blog-card').forEach(card => {
    const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
    card.style.display = title.includes(q) ? '' : 'none';
  });
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('.form-submit');
  btn.textContent = '✓ MESSAGE SENT!';
  btn.style.background = '#2d7a4f';
  setTimeout(() => {
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> SEND MESSAGE';
    btn.style.background = '';
    this.reset();
  }, 3000);
});

// ===== TYPEWRITER EFFECT FOR HERO =====
(function() {
  const subtitle = document.querySelector('.hero-subtitle');
  const texts = ['QA/QC Engineer', 'Automation Tester', 'Test Leader', 'ISTQB Certified'];
  let idx = 0, charIdx = 0, deleting = false;
  function type() {
    const current = texts[idx];
    if(!deleting) {
      charIdx++;
      subtitle.innerHTML = current.slice(0, charIdx) + '<span class="cursor-block"></span>';
      if(charIdx === current.length) { deleting = true; setTimeout(type, 2000); return; }
    } else {
      charIdx--;
      subtitle.innerHTML = current.slice(0, charIdx) + '<span class="cursor-block"></span>';
      if(charIdx === 0) { deleting = false; idx = (idx + 1) % texts.length; }
    }
    setTimeout(type, deleting ? 40 : 80);
  }
  setTimeout(type, 800);
})();