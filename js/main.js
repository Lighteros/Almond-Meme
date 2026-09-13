(() => {
  const orchard = document.getElementById("orchard");
  const warmth = document.getElementById("warmth");
  const ridge = document.getElementById("ridge");
  const hull = document.getElementById("hull");
  const grove = document.getElementById("grove");
  const husk = document.getElementById("husk");
  const kernel = document.getElementById("kernel");
  const kernelImg = kernel ? kernel.querySelector("img") : null;

  const seeds = [];
  const count = Math.min(28, Math.floor(window.innerWidth / 48));
  let width = 0;
  let height = 0;
  let ctx = null;
  let raf = 0;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    orchard.width = Math.floor(width * devicePixelRatio);
    orchard.height = Math.floor(height * devicePixelRatio);
    orchard.style.width = `${width}px`;
    orchard.style.height = `${height}px`;
    ctx = orchard.getContext("2d");
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  };

  const spawn = () => {
    seeds.length = 0;
    for (let i = 0; i < count; i += 1) {
      seeds.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 4 + Math.random() * 9,
        a: Math.random() * Math.PI * 2,
        s: 0.15 + Math.random() * 0.45,
        wobble: 0.4 + Math.random() * 0.8,
        alpha: 0.08 + Math.random() * 0.16,
      });
    }
  };

  const drawSeed = (seed, t) => {
    const x = seed.x + Math.sin(t * 0.0004 + seed.a) * 18 * seed.wobble;
    const y = (seed.y - t * seed.s * 0.02) % (window.innerHeight + 40);
    const yy = y < 0 ? y + window.innerHeight + 40 : y;
    ctx.save();
    ctx.translate(x, yy);
    ctx.rotate(seed.a + t * 0.00015);
    ctx.fillStyle = `rgba(166, 107, 58, ${seed.alpha})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, seed.r * 0.62, seed.r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const tick = (t) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    seeds.forEach((seed) => drawSeed(seed, t));
    raf = requestAnimationFrame(tick);
  };

  if (orchard) {
    resize();
    spawn();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      resize();
      spawn();
      raf = requestAnimationFrame(tick);
    });
  }

  window.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
    document.documentElement.style.setProperty("--my", `${event.clientY}px`);
    if (warmth) {
      warmth.style.setProperty("--mx", `${event.clientX}px`);
      warmth.style.setProperty("--my", `${event.clientY}px`);
    }
    if (kernelImg) {
      const box = kernel.getBoundingClientRect();
      const dx = (event.clientX - (box.left + box.width / 2)) / box.width;
      const dy = (event.clientY - (box.top + box.height / 2)) / box.height;
      kernelImg.style.transform = `translateY(-6px) rotateX(${(-dy * 12).toFixed(2)}deg) rotateY(${(dx * 14).toFixed(2)}deg)`;
    }
  });

  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    if (ridge) ridge.style.width = `${p * 100}%`;
    if (hull) hull.classList.toggle("is-tight", window.scrollY > 20);
  });

  document.querySelectorAll(".reveal").forEach((node) => {
    node.style.setProperty("--d", node.dataset.delay || 0);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-in");
      });
    },
    { threshold: 0.16 }
  );
  document.querySelectorAll(".reveal").forEach((node) => io.observe(node));

  document.querySelectorAll(".magnet").forEach((btn) => {
    btn.addEventListener("pointermove", (event) => {
      const box = btn.getBoundingClientRect();
      const x = event.clientX - box.left - box.width / 2;
      const y = event.clientY - box.top - box.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });

  if (husk && grove) {
    husk.addEventListener("click", () => {
      grove.classList.toggle("is-open");
    });
    grove.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => grove.classList.remove("is-open"));
    });
  }
})();
