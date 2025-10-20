const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');
let w, h;
let particles = [];
let mouse = { x: 0, y: 0 };

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Particle settings
const PARTICLE_COUNT = 100;
const SPEED = 0.5;
const BASE_SIZE = 1.5;
const COLORS = ['#ffffff', '#ffffff'];

// Create particles
function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      size: BASE_SIZE + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.3 + Math.random() * 0.7,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, w, h);
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.fill();

    // Move
    p.x += p.vx;
    p.y += p.vy;

    // Bounce off edges
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    // Hover interaction
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      p.vx += dx / dist * 0.02;
      p.vy += dy / dist * 0.02;
    }
  }
  ctx.globalAlpha = 1.0;
  requestAnimationFrame(drawParticles);
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

initParticles();
drawParticles();