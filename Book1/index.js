function render() {
  cube.rotation.x += 0.02;
  cube.rotation.y += 0.02;
  cube.rotation.z += 0.02;

  step += 0.04;
  sphere.position.x = 20 + (10 * Math.cos(step));
  sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

let renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xEEEEEE, 1.0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(
  45, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(scene.position);

let axes = new THREE.AxesHelper(20);
scene.add(axes);

let planeGeometry = new THREE.PlaneGeometry(60, 20);
let planeMaterial = new THREE.MeshLambertMaterial({
  color: 0xFFFFFF
});
let plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 15;
scene.add(plane);

let cubeGeometry = new THREE.CubeGeometry(4, 4, 4);
let cubeMaterial = new THREE.MeshLambertMaterial({
  color: 0xFF0000
});
let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
cube.position.x = -4;
cube.position.y = 3;
cube.add(new THREE.AxesHelper(20));
scene.add(cube);

let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
let sphereMaterial = new THREE.MeshLambertMaterial({
  color: 0x7777FF
});
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.position.x = 20;
sphere.position.y = 4;
sphere.position.z = 2;
scene.add(sphere);

let spotLight = new THREE.SpotLight(0xFFFFFF);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
scene.add(spotLight);



let step = 0;
render();
