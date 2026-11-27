document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Active navbar link ---------- */
  let current = window.location.pathname.split('/').pop();
  if (!current) current = 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Cursor-following bird ---------- */
  const bird = document.getElementById('bird');
  if (!bird || window.matchMedia('(pointer: coarse)').matches) return;

  const OFFSET_X = 22; // half of the bird size so it centers on the cursor
  const OFFSET_Y = 22;
  const EASE = 0.08;   // lower = slower, floatier trail

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let birdX = mouseX;
  let birdY = mouseY;
  let facing = 1; // 1 = facing right, -1 = facing left

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function animate() {
    const prevX = birdX;
    birdX = lerp(birdX, mouseX, EASE);
    birdY = lerp(birdY, mouseY, EASE);

    const dx = birdX - prevX;
    if (dx > 0.15) facing = 1;
    else if (dx < -0.15) facing = -1;

    bird.style.transform =
      `translate3d(${birdX - OFFSET_X}px, ${birdY - OFFSET_Y}px, 0) scaleX(${facing})`;

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
