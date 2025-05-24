window.addEventListener('load', () => {
  const intro = document.getElementById('intro-container');
  const logo = document.getElementById('logo');
  const content = document.getElementById('main-content');

  // Inicia desvanecimiento del logo tras 1s
  setTimeout(() => {
    logo.style.opacity = 0;
  }, 1000);

  // Muestra el contenido tras la animación de onda (3s)
  setTimeout(() => {
    intro.style.display = 'none';
    content.style.display = 'block';
    document.body.style.overflow = 'auto';
  }, 3000);

  // Permitir que un clic o tecla también revele el contenido antes
  ['click', 'keydown', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, () => {
      intro.style.display = 'none';
      content.style.display = 'block';
      document.body.style.overflow = 'auto';
    }, { once: true });
  });
});
