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

function iniciarAnimacionYAudio() {
  try {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Audio permitido automáticamente
          setupAudioReactive();
          audio.addEventListener('ended', startSite);
        })
        .catch(() => {
          // Autoplay bloqueado: pedir clic al usuario
          mostrarBotonManual();
        });
    }
  } catch (e) {
    mostrarBotonManual();
  }
}

function mostrarBotonManual() {
  const boton = document.createElement('button');
  boton.textContent = 'Iniciar experiencia';
  boton.style.position = 'fixed';
  boton.style.top = '50%';
  boton.style.left = '50%';
  boton.style.transform = 'translate(-50%, -50%)';
  boton.style.padding = '1rem 2rem';
  boton.style.fontSize = '16px';
  boton.style.zIndex = '10000';
  boton.onclick = () => {
    boton.remove();
    audio.play().then(() => {
      setupAudioReactive();
      audio.addEventListener('ended', startSite);
    });
  };
  document.body.appendChild(boton);
}

window.addEventListener('load', () => {
  iniciarAnimacionYAudio();
});

// Permitir que el usuario la salte en cualquier momento
['click', 'keydown', 'touchstart'].forEach(event => {
  window.addEventListener(event, startSite);
});
