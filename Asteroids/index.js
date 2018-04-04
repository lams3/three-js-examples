javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='http://rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()

function radians(angle) {
  return angle * (Math.PI / 180);
}

function generateAsteroid() {
  let r = Math.random() * 20 + 5;
  let geometry = new THREE.IcosahedronGeometry(r);
  for (let i = 0; i < geometry.vertices.length; i++) {
    let x = Math.random() * 10 - 5;
    let y = Math.random() * 10 - 5;
    let z = Math.random() * 10 - 5;
    geometry.vertices[i].x += x;
    geometry.vertices[i].y += y;
    geometry.vertices[i].z += z;
  }
  geometry.verticesNeedUpdate = true;
  let material= new THREE.MeshLambertMaterial({map: text});
  let asteroid = new THREE.Mesh(geometry, material);
  let c = camera.position;
  x = Math.random() * 2 - 1;
  y = Math.random() * 2 - 1;
  z = -Math.random();
  let v = new THREE.Vector3(x, y, z);
  v.normalize();
  v.multiplyScalar(800 - Math.random() * 200);
  asteroid.position.set(c.x + v.x , c.x + v.y, c.z + v.z);
  x = Math.random() * 2 - 1;
  y = Math.random() * 2 - 1;
  z = Math.random() * 2;
  asteroid.velocity = new THREE.Vector3(x, y, z);
  return asteroid;
}

function generateParticle() {
  let r = Math.floor(Math.random() * 3);
  let color;
  switch (r) {
    case 0:
      color = 0xff0000;
      break;
    case 1:
      color = 0xffff00;
      break;
    case 2:
      color = 0xff8800;
      break;
  }
  let geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  let material = new THREE.MeshPhongMaterial({color: color});
  let particle = new THREE.Mesh(geometry, material);
  let rp = rocket.position;
  let radius = Math.random() * 2;
  let alpha = Math.random() * 360;
  particle.position.set(rp.x + radius * Math.cos(radians(alpha)), rp.y + radius * Math.sin(radians(alpha)), rp.z + 3);
  let pp = particle.position;
  particle.velocity = new THREE.Vector3((rp.x + 0.5 * Math.cos(radians(alpha))) - pp.x, (rp.y + 0.5 * Math.sin(radians(alpha))) - pp.y, (rp.z + 7) - pp.z);
  particle.velocity.multiplyScalar(0.02 + Math.random() * 0.03);
  return particle;
}

function recicleParticle(p) {

}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].position.distanceTo(rocket.position) >= 7) {
      //scene.remove(particles[i]);
      //particles.splice(i, 1);
      let rp = rocket.position;
      let radius = Math.random() * 2;
      let alpha = Math.random() * 360;
      particles[i].position.set(rp.x + radius * Math.cos(radians(alpha)), rp.y + radius * Math.sin(radians(alpha)), rp.z + 3);
      let pp = particles[i].position;
      particles[i].velocity = new THREE.Vector3((rp.x + 0.5 * Math.cos(radians(alpha))) - pp.x, (rp.y + 0.5 * Math.sin(radians(alpha))) - pp.y, (rp.z + 7) - pp.z);
      particles[i].velocity.multiplyScalar(0.02 + Math.random() * 0.03);
    } else {
      particles[i].position.add(particles[i].velocity);
    }
  }

  while (particles.length < 300) {
    particles.push(generateParticle());
    scene.add(particles[particles.length - 1]);
  }
}

function updateAsteroids() {
  for (let i = asteroids.length - 1; i >= 0; i--) {
    if (asteroids[i].position.distanceTo(camera.position) > 1000) {
      scene.remove(asteroids[i]);
      asteroids.splice(i, 1);
    } else {
      asteroids[i].position.add(asteroids[i].velocity);
    }
  }

  while (asteroids.length < 1000) {
    asteroids.push(generateAsteroid());
    scene.add(asteroids[asteroids.length - 1]);
  }
}

function animate() {
  updateAsteroids();
  updateParticles();
  let c = camera.position;
  light.position.set(c.x, c.y, c.z);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

let asteroids = [];
let particles = [];

let scene = new THREE.Scene();

let camera =
new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 20;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let light = new THREE.PointLight(0xffffff, 1.5, 700, 2);
scene.add(light);
scene.add(light.target);

let text;
let textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = true;
let string = 'https://raw.githubusercontent.com/lams3/ScreamingClaudio/master/13302.jpg';
textureLoader.load(string, texture => {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 2, 2 );
  text = texture;
  animate();
});

let rocketGeometry = new THREE.CylinderGeometry(3, 3, 6);
let rocketMaterial = new THREE.MeshStandardMaterial({color: 0x0055aa});
let rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);
rocket.translateY(-12);
rocket.translateZ(-5);
rocket.rotateX(radians(90));
scene.add(rocket);
