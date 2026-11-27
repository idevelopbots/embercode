document.addEventListener('DOMContentLoaded', () => {
  // 1. Highlight active navigation link based on current URL
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage) {
      link.classList.add('active');
    }
  });

  // 2. Smooth Cursor-Following Bird Animation (Homepage)
  const bird = document.getElementById('cursor-bird');
  if (!bird) return;

  const birdSvg = bird.querySelector('svg');
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let facingDirection = 1; // 1 = right, -1 = left

  // Track pointer position with a slight offset so the bird doesn't block clicks
  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX + 16;
    targetY = e.clientY - 18;
  });

  function animateBird() {
    const ease = 0.085;
    const dx = targetX - currentX;
    const dy = targetY - currentY;

    currentX += dx * ease;
    currentY += dy * ease;

    // Flip horizontally based on horizontal movement direction
    if (dx < -0.5) {
      facingDirection = -1;
    } else if (dx > 0.5) {
      facingDirection = 1;
    }

    // Subtle pitch tilt based on vertical velocity
    const tilt = Math.max(-22, Math.min(22, dy * 0.35)) * facingDirection;

    bird.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    if (birdSvg) {
      birdSvg.style.transform = `scaleX(${facingDirection}) rotate(${tilt}deg)`;
    }

    requestAnimationFrame(animateBird);
  }

  requestAnimationFrame(animateBird);
});
