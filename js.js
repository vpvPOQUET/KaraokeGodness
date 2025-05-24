const intro = document.getElementById('intro-container');
const audio = document.getElementById('intro-audio');
const content = document.querySelector('.main-content');

// Al hacer clic en la intro, se reproduce el audio y se pasa a la web
intro.addEventListener('click', () => {
  audio.play().then(() => {
    // Cuando empiece el audio
    intro.style.display = 'none';
    content.style.display = 'block';
  }).catch(() => {
    // Si el navegador bloquea el autoplay, se oculta igual
    intro.style.display = 'none';
    content.style.display = 'block';
  });
});
