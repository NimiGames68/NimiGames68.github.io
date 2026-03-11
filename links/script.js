// Stagger fadeUp animation on each link button
document.querySelectorAll('.btn').forEach(function(btn, i) {
  btn.style.animationDelay = (0.1 + i * 0.05) + 's';
});
