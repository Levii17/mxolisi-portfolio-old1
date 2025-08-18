// Theme Manager - uses event delegation for dynamic elements
let currentTheme = localStorage.getItem('theme') || 'light';

// Apply theme consistently
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeIcons(theme);
}

// Update all theme icons
function updateThemeIcons(theme) {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  themeToggles.forEach(btn => {
    const moonIcon = btn.querySelector('.moon-icon');
    const sunIcon = btn.querySelector('.sun-icon');
    
    if (theme === 'dark') {
      if (moonIcon) moonIcon.style.display = 'none';
      if (sunIcon) sunIcon.style.display = 'block';
    } else {
      if (moonIcon) moonIcon.style.display = 'block';
      if (sunIcon) sunIcon.style.display = 'none';
    }
  });
}

// Handle theme toggle clicks
function handleThemeToggle(e) {
  if (e.target.closest('.theme-toggle')) {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
  }
}

// Initialize theme
export function initTheme() {
  // Apply saved theme or system preference
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (!currentTheme) currentTheme = systemPrefersDark ? 'dark' : 'light';
  
  applyTheme(currentTheme);
  
  // Use event delegation for theme toggles
  document.body.addEventListener('click', handleThemeToggle);
  
  // Watch for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      currentTheme = e.matches ? 'dark' : 'light';
      applyTheme(currentTheme);
    }
  });
}