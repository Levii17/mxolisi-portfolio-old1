// Initialize theme BEFORE DOMContentLoaded
import { initTheme } from './theme.js';
initTheme();

// Dynamically import other scripts
document.addEventListener('DOMContentLoaded', () => {
  // Load 3D model if canvas exists
  if (document.getElementById('three-canvas')) {
    import('./model.js').then(mod => {
      if (mod.initModel) mod.initModel();
    });
  }

  // Initialize global scripts
  import('./script.js').then(mod => {
    if (mod.initScript) mod.initScript();
  });

  // HERO section: particles.js
  if (document.getElementById('particles-js')) {
    // Load particles.js from CDN and initialize
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = () => {
      if (window.particlesJS) {
        window.particlesJS.load('particles-js', '/particles.json', function() {
          // particles.js loaded
        });
      }
    };
    document.body.appendChild(script);
  }

  // Section-specific scripts
  if (document.getElementById('about')) {
    import('./about.js').then(mod => {
      if (mod.initAbout) mod.initAbout();
    });
  }
  if (document.getElementById('benefits')) {
    import('./benefits.js');
  }
  if (document.getElementById('contact')) {
    import('./contact.js');
  }
  if (document.querySelector('footer')) {
    import('./footer.js');
  }
  if (document.getElementById('process')) {
    import('./process.js').then(mod => mod.initProcess());
  }
  if (document.getElementById('works')) {
    import('./works.js');
  }
});