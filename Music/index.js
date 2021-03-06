function animate() {
  analyser.getByteFrequencyData(dataArray);
  let range = 53;
  for (let s = 0; s < 8; s++) {
    let total = 0;
    let initial = s * range;
    for (let i = initial; i < initial + range; i++)
      total += dataArray[i];

    spheres[s].material.uniforms.amplitude.value = (total / range) / 255;
  }
  let cameraMovement = spheres[5].material.uniforms.amplitude.value;
  camera.position.z = 20 - (10 * 2 * (cameraMovement - 0.5));
    
  for (let i = particleCount - 1; i >= 0; i--) {
    let particle = particles.vertices[i];
    if (particle.y > 250 || particle.y < -250 || particle.x > 250 || particle.x < -250) {
      particle.y = 500 * Math.random() - 250;
      particle.x = 500 * Math.random() - 250;
      particle.velocity.y = -0.01;
    }
    
    particle.velocity.y -= Math.random() * cameraMovement;
    particle.add(particle.velocity);
  }
  particleSystem.geometry.verticesNeedUpdate = true;
  
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

let vShader = `
uniform float amplitude;
attribute float displacement;
varying vec3 vNormal;

void main() {
  vNormal = vec3(modelViewMatrix * vec4(normal, 0.0));
  vec3 newPosition = position + (amplitude * displacement * normal);
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition, 1.0);
}`

let fShader = `
uniform float amplitude;
varying vec3 vNormal;

void main() {
  vec3 light = vec3(0.5, 0.2, 1.0);
  light = normalize(light);
  float dProd = max(0.0, dot(vNormal, light));
  vec3 color = (amplitude * vec3(1.0, 0, 0)) + (1.0 - amplitude) * vec3(0, 1.0, 0);
  gl_FragColor = vec4(dProd * color, 1.0);
}`

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser();
analyser.fftSize = 1024;
let bufferLength = analyser.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);

let file = document.getElementById('file');
let audio = document.getElementById('audio');

file.addEventListener('change', e => {
  let files = file.files;
  audio.src = URL.createObjectURL(files[0]);
  audio.load();
  audio.play();
  let src = audioCtx.createMediaElementSource(audio);
  src.connect(analyser);
  analyser.connect(audioCtx.destination);
  console.log(audioCtx.sampleRate);
});

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 5, 1000
);
camera.position.z = 20;

let spheres = [];
let positions = [
  new THREE.Vector3(-16 + 10.66, 4, 0),
  new THREE.Vector3(-16 + 10.66, -4, 0),
  new THREE.Vector3(-16 + 2 * 10.66, 4, 0),
  new THREE.Vector3(-16 + 2 * 10.66, -4, 0),
  new THREE.Vector3(-16, -4, 0),
  new THREE.Vector3(-16, 4, 0),
  new THREE.Vector3(-16 + 3 * 10.66, 4, 0),
  new THREE.Vector3(-16 + 3 * 10.66, -4, 0),
];

for (let i = 0; i < 8; i++) {
  let sphereGeometry = new THREE.SphereBufferGeometry(3, 30, 30);
  let sphereMaterial = new THREE.ShaderMaterial({
    vertexShader: vShader,
    fragmentShader: fShader,
    uniforms: {
      amplitude: {
        type: 'f',
        value: 0
      }
    }
  });
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(positions[i].x, positions[i].y, positions[i].z);
  scene.add(sphere);
  
  let displacement = [];
  let vertices = sphereGeometry.attributes.position;
  for (let j = 0; j < vertices.count; j++)
  displacement.push(Math.random() * 3);
  displacement = new Float32Array(displacement);
  sphereGeometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));
  
  spheres.push(sphere);
}


let light = new THREE.PointLight(0xffffff, 1.5, 700, 2);
scene.add(light);
scene.add(light.target);

const particleCount = 20000;
const particles = new THREE.Geometry();
let particlesMaterial = new THREE.PointsMaterial({
  size: 5,
  blending: THREE.AdditiveBlending,
  alphaTest: 0.0,
  transparent: true
});
let particleSystem = new THREE.Points(particles, particlesMaterial);


for (let i = 0; i < particleCount; i++) {
  let x = Math.random() * 500 - 250;
  let y = Math.random() * 500 - 250;
  let z = Math.random() * 500 - 250;
  let particle = new THREE.Vector3(x, y, z);
  particle.velocity = new THREE.Vector3(0, -0.01, 0);
  particles.vertices.push(particle);
}

particles.vertices.sort((a, b) => {
  return a.z - b.z;
});

let textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = true;
let string = 'https://aerotwist.com/static/tutorials/creating-particles-with-three-js/images/particle.png';
textureLoader.load(string, texture => {
  particlesMaterial.map = texture;
  particlesMaterial.needsUpdate = true;
  scene.add(particleSystem);
});

animate();