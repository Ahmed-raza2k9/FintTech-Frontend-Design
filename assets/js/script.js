document.addEventListener('DOMContentLoaded', () => {
  // Animated Cursor
  const cursor = document.createElement('div');
  const cursorFollower = document.createElement('div');
  cursor.className = 'cursor';
  cursorFollower.className = 'cursor-follower';
  document.body.appendChild(cursor);
  document.body.appendChild(cursorFollower);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX = mouseX;
    cursorY = mouseY;
    followerX += (mouseX - followerX) * 0.5;
    followerY += (mouseY - followerY) * 0.5;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Add hover effect to interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .btn, .portfolio-item, .subject-chip');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorFollower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorFollower.classList.remove('hover');
    });
  });


  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navContainer = document.querySelector('.nav-container');

  // Toggle Mobile Menu
  if (mobileMenuToggle) {
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
  }

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

  // Portfolio Tabs - only run if we have tabs on this page
  const portfolioTabs = document.querySelectorAll('.portfolio-tab');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const isPortfolioPage = window.location.pathname.includes('portfolio.html');

  if (isPortfolioPage && portfolioTabs.length > 0 && portfolioItems.length > 0) {
    // Only run tab functionality on portfolio.html
    portfolioTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        portfolioTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');

        const category = tab.dataset.category;

        portfolioItems.forEach(item => {
          item.classList.add('hidden');
          if (category === 'all') {
            // On portfolio page, show all items for "all"
            item.classList.remove('hidden');
          } else {
            if (item.dataset.category === category) {
              item.classList.remove('hidden');
            }
          }
        });
      });
    });

    // Initialize portfolio - show all items
    portfolioItems.forEach(item => {
      item.classList.remove('hidden');
    });
  }

  // Lightbox functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg && lightboxCaption && lightboxClose) {
    // Add click listeners to all portfolio items
    portfolioItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('.portfolio-image img');
        const title = item.querySelector('.portfolio-info h3');
        const description = item.querySelector('.portfolio-info p');
        
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          
          let captionText = '';
          if (title) captionText += title.textContent;
          if (description) captionText += captionText ? ' - ' + description.textContent : description.textContent;
          lightboxCaption.textContent = captionText;
          
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // Close lightbox
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});