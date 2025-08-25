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

  // HERO section: particles.js with error handling and fallback
  if (document.getElementById('particles-js')) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = () => {
      if (window.particlesJS) {
        // Try to load config from /particles.json
        fetch('/particles.json')
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Particles config not found');
          })
          .then(config => {
            window.particlesJS('particles-js', config);
          })
          .catch(error => {
            console.warn('Using fallback particles config:', error);
            // Fallback config if /particles.json fails or is missing
            window.particlesJS('particles-js', {
              particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: '#286EFF' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#286EFF', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
              },
              interactivity: {
                detect_on: 'canvas',
                events: {
                  onhover: { enable: true, mode: 'repulse' },
                  onclick: { enable: true, mode: 'push' },
                  resize: true
                },
                modes: {
                  repulse: { distance: 100, duration: 0.4 },
                  push: { particles_nb: 4 }
                }
              },
              retina_detect: true
            });
          });
      } else {
        console.error('particlesJS not found after script load.');
      }
    };
    script.onerror = () => {
      console.error('Failed to load particles.js from CDN.');
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