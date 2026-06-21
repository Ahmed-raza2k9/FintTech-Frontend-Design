document.addEventListener('DOMContentLoaded', function () {
  if (typeof AOS === 'undefined') return;

  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 90,
    disable: function () {
      return window.innerWidth < 480;
    }
  });
});
