import confetti from "canvas-confetti";

function roleColors() {
  const styles = getComputedStyle(document.documentElement);
  const c1 = styles.getPropertyValue("--role-c1").trim() || "#6366f1";
  const c2 = styles.getPropertyValue("--role-c2").trim() || "#a78bfa";
  return [c1, c2, "#ffffff", "#fbbf24"];
}

export function burst(opts = {}) {
  const colors = roleColors();
  confetti({
    particleCount: 90,
    spread: 70,
    startVelocity: 38,
    origin: { y: 0.7 },
    colors,
    scalar: 0.9,
    ...opts,
  });
}

export function celebrate() {
  const colors = roleColors();
  const end = Date.now() + 800;
  const frame = () => {
    confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

export function levelUp() {
  const colors = roleColors();
  confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 }, colors, startVelocity: 45 });
  setTimeout(() => confetti({ particleCount: 80, spread: 140, origin: { y: 0.6 }, colors }), 200);
}

export function sparkleAt(x, y) {
  const colors = roleColors();
  confetti({
    particleCount: 24,
    spread: 60,
    startVelocity: 22,
    scalar: 0.7,
    ticks: 80,
    origin: { x, y },
    colors,
  });
}
