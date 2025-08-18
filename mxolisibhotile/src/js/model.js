import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.querySelector('#three-canvas');
// Mobile canvas sizing fix
function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

// WebGL support fallback
if (!window.WebGLRenderingContext) {
  canvas.style.display = 'none';
  const fallback = document.createElement('div');
  fallback.className = 'webgl-fallback';
  fallback.textContent = 'WebGL is not supported on this device.';
  canvas.parentNode.insertBefore(fallback, canvas);
}

const scene = new THREE.Scene();

// Improved camera initialization
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.8, 7); // Better vertical centering

const renderer = new THREE.WebGLRenderer({ 
  canvas, 
  alpha: true, 
  antialias: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
hemiLight.position.set(0, 10, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(3, 10, 10);
dirLight.castShadow = true;
scene.add(dirLight);

let model;

const loadingManager = new THREE.LoadingManager(
  () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  },
  (url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100;
    console.log(`Loading progress: ${progress.toFixed(0)}%`);
  },
  (url) => {
    console.error(`Error loading resource: ${url}`);
  }
);

function loadModel() {
  const loader = new GLTFLoader(loadingManager);
  loader.load('/model/mxolisi.glb', (gltf) => {
    model = gltf.scene;

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.metalness = 0.2;
          child.material.roughness = 0.8;
        }
      }
    });

    scene.add(model);
    resizeModel();
    animate();
  }, undefined, (error) => {
    console.error('Error loading GLTF model:', error);
  });
}

// Lazy load model when canvas is visible
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadModel();
      observer.disconnect();
    }
  });
}, { threshold: 0.1 });
observer.observe(canvas);

function resizeModel() {
  if (!model) return;
  const width = window.innerWidth;
  const dpr = window.devicePixelRatio > 1 ? Math.min(1.5, window.devicePixelRatio) : 1;
  renderer.setPixelRatio(dpr);

  // Improved positioning for different screen sizes
  if (width < 600) {
    model.scale.set(0.8, 0.8, 0.8);
    camera.position.set(0, 0.5, 5);
    camera.fov = 60;
  } else if (width < 1024) {
    model.scale.set(1.2, 1.2, 1.2);
    camera.position.set(0, 0.8, 6);
    camera.fov = 55;
  } else {
    model.scale.set(1.5, 1.5, 1.5);
    camera.position.set(0, 0.8, 7);
    camera.fov = 50;
  }
  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    model.rotation.y += 0.002;
    model.rotation.x = Math.sin(Date.now() * 0.001) * 0.01;
  }
  renderer.render(scene, camera);
}

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    resizeModel();
  }, 200);
});

document.addEventListener('mousemove', (e) => {
  if (!model) return;
  const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  const mouseY = (e.clientY / window.innerHeight) * 2 - 1;

  model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, mouseX * 0.2, 0.05);
  model.rotation.x = THREE.MathUtils.lerp(model.rotation.x, -mouseY * 0.1, 0.05);
});


let lastTouch = null;
canvas.addEventListener('touchstart', (e) => {
  if (!model || !e.touches[0]) return;
  lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });

canvas.addEventListener('touchmove', (e) => {
  if (!model || !e.touches[0] || !lastTouch) return;
  e.preventDefault();
  const deltaX = e.touches[0].clientX - lastTouch.x;
  const deltaY = e.touches[0].clientY - lastTouch.y;
  lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  model.rotation.y += deltaX * 0.005;
  model.rotation.x += -deltaY * 0.005;
}, { passive: false });

window.addEventListener('beforeunload', () => {
  if (model) {
    model.traverse(child => {
      if (child.isMesh) {
        child.geometry.dispose();
        if (child.material) {
          Object.keys(child.material).forEach(prop => {
            if (child.material[prop] && child.material[prop].dispose) {
              child.material[prop].dispose();
            }
          });
        }
      }
    });
  }
  renderer.dispose();
});