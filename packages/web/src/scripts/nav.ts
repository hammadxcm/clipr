export function initNav(): void {
  const nav = document.getElementById('main-nav');
  const toggle = document.getElementById('nav-toggle');
  const desktopMenu = document.getElementById('nav-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!nav || !toggle) return;

  toggle.addEventListener('click', () => {
    if (!mobileMenu) return;
    const isOpen = mobileMenu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  let ticking = false;
  const handleScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    const sections = document.querySelectorAll('section[id]');
    const links = (desktopMenu || mobileMenu)?.querySelectorAll('a[href^="#"]') || [];
    let currentId = '';
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150) currentId = section.id;
    }
    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    },
    { passive: true },
  );
}
