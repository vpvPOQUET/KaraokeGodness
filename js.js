window.addEventListener('load', () => {
  const intro = document.getElementById('intro-container');
  const logo = document.getElementById('logo');
  const wave = document.querySelector('.wave');
  const title = document.querySelector('.intro-title');
  const content = document.getElementById('main-content');

  function mostrarContenido() {
    wave.classList.add('expand');
    logo.style.opacity = 0;
    title.style.opacity = 0;

    setTimeout(() => {
      intro.style.display = 'none';
      content.style.display = 'block';
      document.body.style.overflow = 'auto';
    }, 2000);
  }

  // Mostrar contenido al hacer clic, tecla o toque
  ['click', 'keydown', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, mostrarContenido, { once: true });
  });
});
