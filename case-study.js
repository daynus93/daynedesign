// Hero image loader
(function() {
  var msgs = [
    'Loading awesomeness...',
    'Fetching pixels...',
    'Rendering the good stuff...',
    'Almost there...',
    'Cooking something nice...',
    'Worth the wait, promise.'
  ];
  var wrap = document.querySelector('.hero-img-wrap');
  var img = wrap && wrap.querySelector('img');
  var text = wrap && wrap.querySelector('.hero-loader-text');
  if (!wrap || !img) return;
  if (text) text.textContent = msgs[Math.floor(Math.random() * msgs.length)];
  function markLoaded() { wrap.classList.add('loaded'); }
  if (img.complete && img.naturalWidth > 0) { markLoaded(); return; }
  img.addEventListener('load', markLoaded);
  img.addEventListener('error', markLoaded);
})();

// Image skeleton loader
document.querySelectorAll('.study-img').forEach(function(img) {
  if (img.complete && img.naturalWidth > 0) return;
  var wrap = document.createElement('div');
  wrap.className = 'img-skel';
  var cs = getComputedStyle(img);
  wrap.style.marginTop = cs.marginTop;
  wrap.style.marginBottom = cs.marginBottom;
  img.style.marginTop = '0';
  img.style.marginBottom = '0';
  img.parentNode.insertBefore(wrap, img);
  wrap.appendChild(img);
  function markLoaded() { wrap.classList.add('loaded'); }
  img.addEventListener('load', markLoaded);
  img.addEventListener('error', markLoaded);
});

// Nav scroll dock/undock
const nav = document.getElementById('mainNav');
let navScrolled = false;
let navTicking = false;
window.addEventListener('scroll', () => {
  if (navTicking) return;
  navTicking = true;
  requestAnimationFrame(() => {
    navTicking = false;
    const should = window.scrollY > 60;
    if (should === navScrolled) return;
    if (should) {
      nav.classList.remove('attaching');
      nav.classList.add('scrolled', 'detaching');
      navScrolled = true;
      nav.addEventListener('animationend', function h(e) {
        if (e.animationName === 'nav-detach' || e.animationName === 'nav-detach-dark') { nav.classList.remove('detaching'); nav.removeEventListener('animationend', h); }
      });
    } else {
      nav.classList.remove('detaching', 'scrolled');
      nav.classList.add('attaching');
      navScrolled = false;
      nav.addEventListener('animationend', function h(e) {
        if (e.animationName === 'nav-attach' || e.animationName === 'nav-attach-dark') { nav.classList.remove('attaching'); nav.removeEventListener('animationend', h); }
      });
    }
  });
}, { passive: true });

// Scroll progress bar
const progressFill = document.getElementById('tocProgress');
function updateProgress() {
  if (!progressFill) return;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = total > 0 ? (window.scrollY / total * 100) : 0;
  progressFill.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
document.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
if (lightbox && lightboxImg && lightboxClose) {
  document.querySelectorAll('.study-img').forEach(img => {
    img.addEventListener('click', () => {
      const fullSrc = img.src.replace(/^https:\/\/i\d+\.wp\.com\//, 'https://').split('?')[0];
      lightboxImg.src = fullSrc;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
    });
  });
  function closeLightbox() { lightbox.classList.remove('open'); lightboxImg.src = ''; }
  lightbox.addEventListener('click', e => { if (e.target !== lightboxImg) closeLightbox(); });
  lightboxClose.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

// Active ToC link
const tocObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-20% 0px -70% 0px' });
document.querySelectorAll('.content-section').forEach(s => tocObserver.observe(s));

/* ── MOBILE NAV ── */
window.addEventListener('DOMContentLoaded', function() {
  var btn = document.getElementById('navHamburger');
  var menu = document.getElementById('mobileMenu');
  var nav = document.getElementById('mainNav');
  if (!btn || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    btn.classList.add('open');
    nav.classList.add('menu-open');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    var mdb = document.querySelector('.mobile-dark-btn'); if (mdb) mdb.style.display = 'flex';
  }
  var mobileWorkBtn = document.getElementById('mobileWorkBtn');
  var mobileWorkSub = document.getElementById('mobileWorkSub');

  function closeMenu() {
    menu.classList.remove('open');
    btn.classList.remove('open');
    nav.classList.remove('menu-open');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    var mdb = document.querySelector('.mobile-dark-btn'); if (mdb) mdb.style.display = 'none';
    if (mobileWorkSub) mobileWorkSub.classList.remove('open');
    if (mobileWorkBtn) mobileWorkBtn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', function() {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });
  menu.querySelectorAll('.mobile-link').forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMenu();
  });

  if (mobileWorkBtn && mobileWorkSub) {
    mobileWorkBtn.addEventListener('click', function() {
      var isOpen = mobileWorkSub.classList.contains('open');
      mobileWorkSub.classList.toggle('open', !isOpen);
      mobileWorkBtn.setAttribute('aria-expanded', String(!isOpen));
    });
    mobileWorkSub.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() { closeMenu(); });
    });
  }
});

/* ── DESKTOP WORK DROPDOWN ── */
(function() {
  var dropBtn = document.getElementById('workDropBtn');
  var dropPanel = document.getElementById('workDropPanel');
  if (!dropBtn || !dropPanel) return;

  function openDrop() { dropPanel.classList.add('open'); dropBtn.setAttribute('aria-expanded', 'true'); }
  function closeDrop() { dropPanel.classList.remove('open'); dropBtn.setAttribute('aria-expanded', 'false'); }

  dropBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    dropPanel.classList.contains('open') ? closeDrop() : openDrop();
  });
  document.addEventListener('click', function() { closeDrop(); });
  dropPanel.addEventListener('click', function(e) { e.stopPropagation(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeDrop(); });
})();

/* ── DARK TOGGLE ── */
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.dark-toggle').forEach(function(b) {
    b.addEventListener('click', function() {
      var d = document.documentElement.classList.toggle('dark');
      localStorage.setItem('darkMode', d);
    });
  });
});

// ── MOBILE TOC PILL ──
(function(){
  var wrap=document.getElementById('mobileTocWrap'),pill=document.getElementById('mobileTocPill'),menu=document.getElementById('mobileTocMenu'),label=document.getElementById('mobileTocLabel');
  if(!wrap||!pill||!menu)return;
  var tocLinks=document.querySelectorAll('.toc-link');
  tocLinks.forEach(function(link){
    var btn=document.createElement('button');
    btn.className='mtoc-item';btn.textContent=link.textContent.trim();btn.dataset.target=link.getAttribute('href');
    menu.appendChild(btn);
    btn.addEventListener('click',function(){var t=document.querySelector(btn.dataset.target);if(t)t.scrollIntoView({behavior:'smooth'});close();});
  });
  if(tocLinks.length&&label)label.textContent=tocLinks[0].textContent.trim();
  function open(){wrap.classList.add('open');pill.setAttribute('aria-expanded','true');}
  function close(){wrap.classList.remove('open');pill.setAttribute('aria-expanded','false');}
  pill.addEventListener('click',function(e){e.stopPropagation();wrap.classList.contains('open')?close():open();});
  document.addEventListener('click',function(){close();});
  var hero=document.querySelector('.study-hero');
  if(hero){
    new IntersectionObserver(function(entries){
      if(!entries[0].isIntersecting){wrap.classList.add('visible');}
      else{wrap.classList.remove('visible');close();}
    },{threshold:0}).observe(hero);
  }
  var tocList=document.querySelector('.toc-list');
  if(tocList){
    new MutationObserver(function(){
      var active=document.querySelector('.toc-link.active');
      if(active&&label){
        label.textContent=active.textContent.trim();
        menu.querySelectorAll('.mtoc-item').forEach(function(item){item.classList.toggle('active',item.dataset.target===active.getAttribute('href'));});
      }
    }).observe(tocList,{subtree:true,attributes:true,attributeFilter:['class']});
  }
})();
