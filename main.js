import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set (0 , 1 , 30)

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );

renderer.shadowMap.enabled = true;

const controls = new OrbitControls( camera, renderer.domElement );

document.body.appendChild( renderer.domElement );


//box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

//plane

const planeGeometry = new THREE.PlaneGeometry( 30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide });

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

const gridHelper = new THREE.GridHelper( 30, 30 );
scene.add( gridHelper );



//sphere
const sphereGeometry = new THREE.SphereGeometry( 4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, wireframe: false });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-10, 5, 0);
scene.add(sphere);
sphere.castShadow = true;

//GUI
const gui = new dat.GUI();
const option = { 
  color: 0xff0000,
  wireframe: false,
  speed: 0.01
};

gui.addColor(option, 'color').onChange((color) => {
  sphere.material.color.set(color);
});

gui.add(option, 'wireframe').onChange((wireframe) => {
  sphere.material.wireframe = wireframe;
})

gui.add(option, 'speed', 0, 0.1);

//light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-30, 50, 0);
scene.add(light);
light.castShadow = true;
light.shadow.camera.bottom = -12;

const dLhelper = new THREE.DirectionalLightHelper(light, 5);
scene.add(dLhelper);

const dLcamHelper = new THREE.CameraHelper(light.shadow.camera);
scene.add(dLcamHelper);


renderer.render(scene, camera);
let step = 0;


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
  controls.update();
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;

  step += option.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step))+4;
}
animate();
