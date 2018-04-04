function radians(angle) {
  return angle * (Math.PI / 180);
}

function animate() {
  renderer.render(scene, camera);
  rocket.rotation.x += 0.01;
  rocket.rotation.y += 0.01;
  rocket.rotation.z += 0.01;
  requestAnimationFrame(animate);
}

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 5, 100
);
camera.position.z = 20;

let control = new THREE.OrbitControls(camera);

let rocketGeometry = new THREE.SphereGeometry(10, 5, 5);
let rocketMaterial = new THREE.MeshNormalMaterial({
  color: 0x0055aa,
  wireframe: true
});
let rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);
rocket.translateZ(-10);
scene.add(rocket);

let localAxis = new THREE.AxisHelper(15);
rocket.add(localAxis);

let worldAxis = new THREE.AxisHelper(15);
scene.add(worldAxis)

animate();
