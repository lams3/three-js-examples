function radians(angle) {
  return angle * (Math.PI / 180);
}

function animate() {
  renderer.render(scene, viewCamera);
  requestAnimationFrame(animate);
}

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 20, 100
);
camera.position.z = 20;

let cameraHelper = new THREE.CameraHelper(camera);
camera.add(cameraHelper);
scene.add(camera);

let viewCamera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
viewCamera.position.set(200, 0, 0);
viewCamera.lookAt(0, -12, -5);

let controls = new THREE.OrbitControls(viewCamera);

let light = new THREE.PointLight();
light.position.set(0, 20, 20);
scene.add(light);

let rocketGeometry = new THREE.SphereGeometry(15, 20, 20);
let rocketMaterial = new THREE.MeshStandardMaterial({color: 0x0055aa});
let rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);
scene.add(rocket);


animate();
