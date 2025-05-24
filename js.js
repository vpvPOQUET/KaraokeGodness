const audio = document.getElementById('intro-audio');
const intro = document.getElementById('intro-container');
const content = document.querySelector('.main-content');
const pulse1 = document.getElementById('pulse1');
const pulse2 = document.getElementById('pulse2');

let skipRequested = false;
let audioActivated = false;

function startSite() {
  if (skipRequested) return;
  skipRequested = true;

  intro.style.display = 'none';
  content.style.display = 'block';
  document.body.style.overflow = 'auto';

  try {
    audio.pause();
    audio.currentTime = 0;
  } catch (e) {}
}

function setupAudioReactive() {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const src = context.createMediaElementSource(audio);
  const analyser = context.createAnalyser();
  src.connect(analyser);
  analyser.connect(context.destination);
  analyser.fftSize = 256;

  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function animate() {
    if (skipRequested) return;

    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    const scale = 1 + average / 100;
    const opacity = Math.min(1, average / 120);

    pulse1.style.transform = `translate(-50%, -50%) scale(${scale})`;
    pulse2.style.transform = `translate(-50%, -50%) scale(${scale * 1.3})`;

    pulse1.style.opacity = opacity;
    pulse2.style.opacity = opacity * 0.7;

    requestAnimationFrame(animate);
  }

  animate();
}

function animacionFalsaOndas() {
  let t = 0;
  function fakeAnimate() {
    if (skipRequested || audioActivated) return;

    const scale = 1 + Math.sin(t) * 0.2;
    const opacity = 0.4 + Math.sin(t) * 0.2;

    pulse1.style.transform = `translate(-50%, -50%) scale(${scale})`;
    pulse2.style.transform = `translate(-50%, -50%) scale(${scale * 1.2})`;

    pulse1.style.opacity = opacity;
    pulse2.style.opacity = opacity * 0.8;

    t += 0.1;
    requestAnimationFrame(fakeAnimate);
  }
  fakeAnimate();
}

// 1. Empezamos con animación falsa
window.addEventListener('load', () => {
  animacionFalsaOndas();
});

// 2. Al primer clic / tecla / toque: reiniciar audio con sonido real
function activarAudioReal() {
  if (audioActivated) return;
  audioActivated = true;

  audio.muted = false;
  audio.currentTime = 0;

  audio.play().then(() => {
    setupAudioReactive();
    audio.addEventListener('ended', startSite);
  }).catch(() => {
    setTimeout(startSite, 7000);
  });

  // También iniciar temporizador de seguridad
  setTimeout(() => {
    if (!skipRequested) startSite();
  }, 8000);
}

// 3. Si el usuario no interactúa, mostramos contenido tras 8s
setTimeout(() => {
  if (!skipRequested && !audioActivated) {
    startSite();
  }
}, 8000);

// 4. Detectar interacción para activar sonido real
['click', 'keydown', 'touchstart'].forEach(evt =>
  window.addEventListener(evt, activarAudioReal, { once: true })
);
['click', 'keydown', 'touchstart'].forEach(evt =>
  window.addEventListener(evt, startSite)
);
