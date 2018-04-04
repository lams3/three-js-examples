javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='http://rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()

function radians(angle) {
  return angle * (Math.PI / 180);
}

function animate() {
  renderer.render(scene, camera);
  particleSystem.rotateY(radians(0.5));
  for (let i = particleCount - 1; i >= 0; i--) {
    let particle = particles.vertices[i];
    if (particle.y < -200) {
      particle.y = 250;
      particle.x = 500 * Math.random() - 250;
      particle.velocity.x = 2 * Math.random() - 1;
      particle.velocity.y = -Math.random();
    }

    particle.velocity.y -= Math.random() * .1;
    particle.add(particle.velocity);
    particleSystem.geometry.verticesNeedUpdate = true;
  }
  requestAnimationFrame(animate);
}

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let light = new THREE.PointLight(0xffffff, 1.5, 700, 2);
scene.add(light);
scene.add(light.target);

const particleCount = 2000;
const particles = new THREE.Geometry();
let material;
let particleSystem;

for (let i = 0; i < particleCount; i++) {
  let x = Math.random() * 500 - 250;
  let y = Math.random() * 500 - 250;
  let z = Math.random() * 500 - 250;
  let particle = new THREE.Vector3(x, y, z);
  particle.velocity = new THREE.Vector3(0, -Math.random(), 0);
  particles.vertices.push(particle);
}

let textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = true;
let string = 'https://aerotwist.com/static/tutorials/creating-particles-with-three-js/images/particle.png';
textureLoader.load(string, texture => {
  material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 10,
    map: texture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthTest: false
  });
  particleSystem = new THREE.Points(particles, material);
  scene.add(particleSystem);
  animate();
});
