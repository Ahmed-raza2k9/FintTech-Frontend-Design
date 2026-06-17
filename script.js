document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navContainer = document.querySelector('.nav-container');

  // Toggle Mobile Menu
  mobileMenuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    navContainer.classList.toggle('nav-active');
    document.body.classList.toggle('no-scroll');
  });

  // Close Menu when clicking a Nav Link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      navContainer.classList.remove('nav-active');
      document.body.classList.remove('no-scroll');

      // Toggle active link visual class
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Close Menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navContainer.contains(e.target)) {
      mobileMenuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      navContainer.classList.remove('nav-active');
      document.body.classList.remove('no-scroll');
    }
  });

  // FAQ Accordion - Close others when one is opened
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.removeAttribute('open');
          }
        });
      }
    });
  });

  // Portfolio Tabs
  const portfolioTabs = document.querySelectorAll('.portfolio-tab');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  portfolioTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      portfolioTabs.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tab
      tab.classList.add('active');

      const category = tab.dataset.category;

      portfolioItems.forEach(item => {
        if (category === 'all') {
          item.classList.remove('hidden');
        } else {
          if (item.dataset.category === category) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        }
      });
    });
  });
});