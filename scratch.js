// =============================================
// SCRATCH TO REVEAL â€” Canvas implementation
// =============================================

window.addEventListener('load', () => {
  const canvas  = document.getElementById('scratchCanvas');
  if (!canvas) return;

  const wrap    = canvas.parentElement;
  const ctx     = canvas.getContext('2d');
  const img     = new Image();
  img.src       = 'assets/layers/golden%20foil_Final_V2%201.png';

  img.onload = () => {
    canvas.width  = wrap.offsetWidth;
    canvas.height = wrap.offsetHeight;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  let isScratching = false;
  let totalPixels   = 0;
  let revealed      = false;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top)  * scaleY
    };
  }

  function scratch(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    checkReveal();
  }

  function checkReveal() {
    if (revealed) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) transparent++;
    }
    const pct = transparent / (canvas.width * canvas.height);
    if (pct > 0.55) {
      revealed = true;
      // Smooth full reveal
      canvas.style.transition = 'opacity 0.6s ease';
      canvas.style.opacity = '0';
      setTimeout(() => canvas.remove(), 700);
    }
  }

  // Mouse events
  canvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(...Object.values(getPos(e))); });
  canvas.addEventListener('mousemove', (e) => { if (isScratching) scratch(...Object.values(getPos(e))); });
  canvas.addEventListener('mouseup',   ()  => { isScratching = false; });

  // Touch events
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isScratching = true; scratch(...Object.values(getPos(e))); }, { passive: false });
  canvas.addEventListener('touchmove',  (e) => { e.preventDefault(); if (isScratching) scratch(...Object.values(getPos(e))); }, { passive: false });
  canvas.addEventListener('touchend',   ()  => { isScratching = false; });
});

