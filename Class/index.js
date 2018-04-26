let step = 0;
function animate() {
  /*rendering*/
  renderer.render(scene, camera);

  /*animation*/
  mesh.rotation.x += 0.02
  mesh.rotation.y += 0.02
  mesh.rotation.z += 0.02

  light.position.set(20 * Math.sin(0.01 * step), 0, 20 * Math.cos(0.01 * step));
  step++;

  /*next frame*/
  requestAnimationFrame(animate);
}

/*creating renderer and appending to page*/
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/*creating scene*/
const scene = new THREE.Scene();

/*creating and repositioning camera*/
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, .1, 100
);
camera.position.set(0, 0, 20);

/*creating camera controller*/
const controls = new THREE.OrbitControls(camera);

/*creating geometry and material*/
const geometry = new THREE.SphereGeometry(5, 5, 5);
const material = new THREE.MeshStandardMaterial({
  color: 0xff00ff
});
/*creating mesh and adding to the scene*/
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/*creating, and adding a point light to the scene*/
const light = new THREE.PointLight();
scene.add(light);

/*initializing animation*/
animate();
