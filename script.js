/* ============================================================
   Ahmed Naveed — Portfolio
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* 1. Smooth Scroll (Lenis) */
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);

/* 2. Preloader */
const loader = document.getElementById('loader');
const loaderProgress = document.getElementById('loaderProgress');
const loaderPercent = document.getElementById('loaderPercent');

let loadVal = 0;
const loadInterval = setInterval(() => {
  loadVal = Math.min(loadVal + Math.random() * 20 + 5, 100);
  const rounded = Math.round(loadVal);
  if (loaderProgress) loaderProgress.style.width = rounded + '%';
  if (loaderPercent) loaderPercent.textContent = rounded + '%';

  if (loadVal >= 100) {
    clearInterval(loadInterval);
    gsap.to(loader, {
      yPercent: -100,
      duration: 1,
      ease: 'power4.inOut',
      delay: 0.2,
      onComplete: () => {
        loader.style.display = 'none';
        document.body.style.overflow = '';
        initSite();
      }
    });
  }
}, 120);

/* 3. Site animations — run once the loader clears */
function initSite() {
  // Hero entrance
  gsap.from('.hero-container > *', {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Section reveals
  document.querySelectorAll('section:not(.hero)').forEach((sec) => {
    gsap.from(sec.querySelectorAll(':scope > .container > *'), {
      scrollTrigger: { trigger: sec, start: 'top 80%' },
      y: 50,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out'
    });
  });

  // Animated stat counters
  document.querySelectorAll('.stat-number').forEach((el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const counter = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => (el.textContent = Math.round(counter.val))
        });
      }
    });
  });

  // Animated skill bars
  document.querySelectorAll('.skill-bar').forEach((bar) => {
    const width = bar.dataset.width || 0;
    const fill = bar.querySelector('.skill-fill');
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(fill, { width: width + '%', duration: 1.4, ease: 'power3.out' });
      }
    });
  });
}

/* 4. Custom cursor (desktop only) */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

if (cursor && follower && !isTouch) {
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
  });

  document.querySelectorAll('.hoverable').forEach((el) => {
    el.addEventListener('mouseenter', () => follower.classList.add('hovered'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hovered'));
  });
} else if (cursor && follower) {
  cursor.style.display = 'none';
  follower.style.display = 'none';
}

/* 5. Navbar scroll state */
const navbar = document.getElementById('navbar');
if (navbar) {
  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    onUpdate: (self) => {
      navbar.classList.toggle('scrolled', self.scroll() > 80);
    }
  });
}

/* 6. Mobile menu */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  mobileMenu.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
}

/* 7. Contact form */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"] span');
    const original = btn.textContent;
    btn.textContent = 'Message Sent ✓';
    contactForm.reset();
    setTimeout(() => (btn.textContent = original), 2500);
  });
}