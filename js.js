// js.js
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.intro').style.display = 'none';
    document.querySelector('.contenido').style.display = 'block';
    document.body.style.overflow = 'auto';
  }, 2500);
});
