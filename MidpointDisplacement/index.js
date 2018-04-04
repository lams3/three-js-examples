javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='http://rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()

function radians(angle) {
  return angle * (Math.PI / 180);
}

function midpointDisplacement(n) {
  let matrix = [];
  let last = Math.pow(2, n);

  for (let i = 0; i < last + 1; i++) {
    matrix[i] = [];
    for (let j = 0; j < last + 1; j++) {
      matrix[i][j] = 0;
    }
  }

  matrix[0][0] = Math.random();
  matrix[last][0] = Math.random();
  matrix[0][last] = Math.random();
  matrix[last][last] = Math.random();

  function recursiveDisplacement(m) {
      
  }

  recursiveDisplacement();
}

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let n = 8

console.log(midpointDisplacement(n));
