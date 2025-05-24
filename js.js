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

// 👇 Truco para lanzar play() lo antes posible
function intentarIniciarAudio() {
  // Esperamos a que el navegador dé permiso al menos 1 frame
  requestAnimationFrame(() => {
    audio.play().then(() => {
      setupAudioReactive();
      audio.addEventListener('ended', startSite);
    }).catch((err) => {
      console.warn("Autoplay con sonido bloqueado por el navegador:", err);
      // Si falla, puedes mostrar un texto tipo "haz clic para empezar"
    });

    // Fallback por duración
    setTimeout(() => {
      if (!skipRequested) startSite();
    }, 8000); // o audio.duration * 1000 si se conoce
  });
}

window.addEventListener('load', intentarIniciarAudio);

// También permitir salir con clic, tecla, touch
['click', 'keydown', 'touchstart'].forEach(evt =>
  window.addEventListener(evt, startSite)
);
