function radians(angle) {
  return angle * (Math.PI / 180);
}

function animate() {
  renderer.render(scene, camera);
  spotLight.target = rocket1;
  requestAnimationFrame(animate);
}

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 5, 100
);
camera.position.z = 30;

let controls = new THREE.OrbitControls(camera);

let rocketGeometry = new THREE.SphereGeometry(1, 20, 20);
let rocketMaterial = new THREE.MeshStandardMaterial({
  color: 0x0055aa
});
let rocket1 = new THREE.Mesh(rocketGeometry, rocketMaterial);
let rocket2 = new THREE.Mesh(rocketGeometry, rocketMaterial);
let rocket3 = new THREE.Mesh(rocketGeometry, rocketMaterial);
let rocket4 = new THREE.Mesh(rocketGeometry, rocketMaterial);
let rocket5 = new THREE.Mesh(rocketGeometry, rocketMaterial);
let rocket6 = new THREE.Mesh(rocketGeometry, rocketMaterial);
rocket1.translateX(-30);
rocket2.translateX(0);
rocket3.translateX(30);
rocket4.translateX(-30);
rocket5.translateX(0);
rocket6.translateX(30);
rocket4.translateZ(10);
rocket5.translateZ(10);
rocket6.translateZ(10);
scene.add(rocket1);
scene.add(rocket2);
scene.add(rocket3);
scene.add(rocket4);
scene.add(rocket5);
scene.add(rocket6);


let directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(-30, 10, 5);
directionalLight.target = rocket1;
scene.add(directionalLight.target);
scene.add(directionalLight);
directionalLight.target.updateMatrixWorld()
let dlHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(dlHelper);

let pointLight = new THREE.PointLight(0xffffff, 1, 10);
pointLight.position.set(0, 0, 5);
scene.add(pointLight);
let plHelper = new THREE.PointLightHelper(pointLight);
scene.add(plHelper);

let spotLight = new THREE.SpotLight(0xffffff, 1, 10, Math.PI / 8, 0.2, 1);
spotLight.position.set(30, 0, 5);
scene.add(spotLight.target);
scene.add(spotLight);
spotLight.target = rocket3;
spotLight.target.updateMatrixWorld()
let slHelper = new THREE.SpotLightHelper(spotLight);
scene.add(slHelper);

animate();
