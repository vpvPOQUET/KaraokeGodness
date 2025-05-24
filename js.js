const audio = document.getElementById('intro-audio');
const intro = document.querySelector('.intro-container');
const content = document.querySelector('.main-content');

function endIntro() {
  intro.style.display = 'none';
  content.style.display = 'block';
}

audio.addEventListener('ended', endIntro);

setTimeout(() => {
  if (intro.style.display !== 'none') {
    endIntro();
  }
}, 6000);
