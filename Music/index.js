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
  //console.log(cameraMovement);
  camera.position.z = 20 - (10 * 2 * (cameraMovement - 0.5));
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
  75, window.innerWidth / window.innerHeight, 5, 100
);
camera.position.z = 20;

let control = new THREE.OrbitControls(camera);

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

console.log(positions);

for (let i = 0; i < 8; i++) {
  let sphereGeometry = new THREE.SphereBufferGeometry(3, 100, 100);
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
  console.log(sphere.position);
  scene.add(sphere);

  let displacement = [];
  let vertices = sphereGeometry.attributes.position;
  for (let j = 0; j < vertices.count; j++)
    displacement.push(Math.random() * 3);
  displacement = new Float32Array(displacement);
  sphereGeometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));

  spheres.push(sphere);
}


animate();
