let TO_RADIANS = Math.PI / 180;
function getImageParticle(options) {
  let {
    img,
    maxSize,
    useShimmer,
    spin,
    hue = -1,
    alpha,
    fade,
    gravity,
    drag,
    pos,
    size,
    sizeMult,
    vel,
  } = options;
  let { x, y } = pos;
  let rotation = 0;
  let compositionOperation = "source-over";

  function update() {
    vel.x *= drag; // drag → slows particle
    vel.y *= drag;
    vel.y += gravity; // gravity → pulls it down
    x += vel.x; // velocity → movement
    y += vel.y;

    // Particle shrinks, fades, and spins over time
    size *= sizeMult;
    if (maxSize > 0 && size > maxSize) {
      size = maxSize;
    }

    alpha -= fade;
    if (alpha < 0) {
      alpha = 0;
    }
    rotation += spin;
  }

  function render(c) {
    if (alpha === 0) {
      return;
    }

    c.save();
    c.translate(x, y);
    let s = useShimmer ? size * Math.random() : size;
    c.scale(s, s);
    c.rotate(rotation * TO_RADIANS);
    if (window.innerWidth >= 900) {
      c.translate(img.width * -0.5, img.width * -1);
    } else {
      c.translate(img.width * -0.8, img.width * -0.5);
    }
    c.globalAlpha = alpha;
    c.globalCompositeOperation = compositionOperation;
    if (hue !== -1) {
      c.filter = `hue-rotate(${hue}deg)`;
    }
    c.drawImage(img, 0, 0);
    c.restore();
  }
  return { update, render };
}

export default getImageParticle;
