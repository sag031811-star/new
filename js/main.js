document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  const preloaderNum = document.getElementById('preloaderNum');
  if (preloader && preloaderNum) {
    let count = 0;
    const step = () => {
      count += Math.ceil(Math.random() * 18) + 4;
      if (count >= 100) {
        count = 100;
        preloaderNum.textContent = count;
        setTimeout(() => preloader.classList.add('hidden'), 300);
        return;
      }
      preloaderNum.textContent = count;
      setTimeout(step, 90);
    };
    step();
  }

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById('menuBtn');
  menuBtn.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.navbar_nav_link').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('menu-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Mobile services dropdown toggle */
  const navDd = document.querySelector('.navbar_nav_dd');
  const navDdBtn = document.querySelector('.navbar_nav_dd_btn');
  if (navDd && navDdBtn) {
    navDdBtn.addEventListener('click', () => {
      if (window.innerWidth <= 991) {
        const isOpen = navDd.classList.toggle('open');
        navDdBtn.setAttribute('aria-expanded', String(isOpen));
      }
    });
  }

  /* ---------- Hero background slideshow ---------- */
  const heroSlides = document.querySelectorAll('.hero_bg_slide');
  if (heroSlides.length > 1) {
    let heroIndex = 0;
    setInterval(() => {
      heroSlides[heroIndex].classList.remove('active');
      heroIndex = (heroIndex + 1) % heroSlides.length;
      heroSlides[heroIndex].classList.add('active');
    }, 6000);
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Stats count-up ---------- */
  const statNums = document.querySelectorAll('.about_stat_num');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (statNums.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statNums.forEach(el => statsObserver.observe(el));
  }

  /* ---------- Advantages accordion + image swap ---------- */
  const advantages = document.querySelectorAll('.advantage');
  const advantageImgs = document.querySelectorAll('.advantage_img');
  advantages.forEach(item => {
    item.addEventListener('click', () => {
      advantages.forEach(other => other.classList.remove('active'));
      item.classList.add('active');
      const imgIndex = item.dataset.img;
      advantageImgs.forEach(img => img.classList.remove('active'));
      const targetImg = document.querySelector(`.advantage_img:nth-child(${Number(imgIndex) + 1})`);
      if (targetImg) targetImg.classList.add('active');
    });
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth > 991) item.click();
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq_item_header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.faq_item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq_item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  /* ---------- Services carousel ---------- */
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (track && prevBtn && nextBtn) {
    const scrollAmount = () => track.querySelector('.carousel_card').offsetWidth + 20;
    prevBtn.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));

    let isDown = false, startX, scrollLeft;
    track.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX;
      scrollLeft = track.scrollLeft;
    });
    window.addEventListener('mouseup', () => { isDown = false; });
    track.addEventListener('mouseleave', () => { isDown = false; });
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      track.scrollLeft = scrollLeft - (e.pageX - startX);
    });
  }

  /* ---------- CTA parallax ---------- */
  const ctaBg = document.getElementById('ctaBg');
  const ctaSection = ctaBg ? ctaBg.closest('.cta') : null;
  if (ctaBg && ctaSection) {
    const updateParallax = () => {
      const rect = ctaSection.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = (vh - rect.top) / (vh + rect.height);
      const shift = (progress - 0.5) * 40;
      ctaBg.style.transform = `translateY(${shift}px) scale(1.12)`;
    };
    window.addEventListener('scroll', updateParallax);
    updateParallax();
  }

  /* ---------- Smooth anchor scroll offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
