const audio = document.getElementById('intro-audio');
const intro = document.querySelector('.intro-container');
const content = document.querySelector('.main-content');

function endIntro() {
  intro.style.display = 'none';
  content.style.display = 'block';
  document.body.style.overflow = 'auto';
}

audio.addEventListener('ended', endIntro);

// Fallback si el audio tarda mucho o falla
setTimeout(() => {
  if (intro.style.display !== 'none') {
    endIntro();
  }
}, 6000);
