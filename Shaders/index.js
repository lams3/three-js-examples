function animate() {
  renderer.render(scene, camera);
  rocket.rotation.x += 0.01;
  rocket.rotation.y += 0.01;
  rocket.rotation.z += 0.01;
  rocketMaterial.uniforms.amplitude.value += 0.1;
  requestAnimationFrame(animate);
}

let vShader = `
uniform float amplitude;
attribute float displacement;
varying vec3 vNormal;

void main() {
  vNormal = vec3(modelViewMatrix * vec4(normal, 0.0));
  vec3 newPosition = position + (sin(amplitude) * displacement * normal);
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPosition, 1.0);
}`

let fShader = `
varying vec3 vNormal;

void main() {
  vec3 light = vec3(0.5, 0.2, 1.0);
  light = normalize(light);
  float dProd = max(0.0, dot(vNormal, light));

  gl_FragColor = vec4(dProd, dProd, dProd, 1.0);
}`

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 5, 100
);
camera.position.z = 20;

let control = new THREE.OrbitControls(camera);

let rocketGeometry = new THREE.SphereBufferGeometry(10, 20, 20);
let rocketMaterial = new THREE.ShaderMaterial({
  vertexShader: vShader,
  fragmentShader: fShader,
  uniforms: {
    amplitude: {
      type: 'f',
      value: 0
    }
  }
});
let rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);
scene.add(rocket);

let displacement = [];
let vertices = rocketGeometry.attributes.position;
for (var i = 0; i < vertices.count; i++) {
  displacement.push(Math.random() * 3);
}
displacement = new Float32Array(displacement);
rocketGeometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));

animate();
