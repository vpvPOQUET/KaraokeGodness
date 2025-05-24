const audio = document.getElementById('intro-audio');
const intro = document.getElementById('intro-container');
const content = document.querySelector('.main-content');
const pulse1 = document.getElementById('pulse1');
const pulse2 = document.getElementById('pulse2');

let skipRequested = false;

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

function handleStart() {
  if (skipRequested) return;

  audio.play().then(() => {
    setupAudioReactive();

    // Cuando termine el audio, entrar a la web
    audio.addEventListener('ended', startSite);

    // Como backup, entrar cuando el audio alcance su duración real
    setTimeout(() => {
      if (!skipRequested) startSite();
    }, (audio.duration || 6) * 1000); // Fallback: 6s si no se puede leer la duración
  }).catch((err) => {
    console.warn("No se pudo reproducir el audio automáticamente:", err);
    startSite(); // fallback
  });
}

// Lanzar todo al primer clic, tecla o toque
['click', 'keydown', 'touchstart'].forEach(event => {
  window.addEventListener(event, handleStart, { once: true });
  window.addEventListener(event, startSite, { once: true });
});
