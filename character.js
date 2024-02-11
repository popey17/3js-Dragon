import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set (1 , 1 , 3)
// camera.lookAt(0, 0, 0);

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.enablePan = false;
controls.minPolarAngle = 0.3;
controls.maxPolarAngle = 1.5;
controls.autoRotate = true;
controls.autoRotateSpeed = 2;
controls.update();

//3d object
const loader = new GLTFLoader().setPath('/models/Serpent/');
loader.load('scene.gltf', (gltf)=> {
  scene.add(gltf.scene);
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  gltf.scene.castShadow = true;
  gltf.scene.position.set(0, -0.5, 0);
  gltf.scene.rotation.y = 1 ;
  // gltf.scene.scale.set(0.01, 0.01, 0.01);
  // gltf.scene.rotation.y = Math.PI;
})

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const planeGermetry = new THREE.PlaneGeometry( 30, 30);
planeGermetry.rotateX(-Math.PI / 2);


const seaTexture = new THREE.TextureLoader().load('/models/darkSea.jpg');
const planeMaterial = new THREE.MeshStandardMaterial({
  // map: seaTexture,
  color: 0x000000,
  side: THREE.DoubleSide 
});

const groundMash = new THREE.Mesh(planeGermetry, planeMaterial);
scene.add(groundMash);
groundMash.receiveShadow = true;
groundMash.position.set(0, -1.5, 0);

const light = new THREE.DirectionalLight(0xffffff, 10);
// const light = new THREE.AmbientLight(0xffffff, 2);
light.position.set(0, 5, 5);
scene.add(light);
light.castShadow = true;

// const lightHelper = new THREE.DirectionalLightHelper(light);
// scene.add(lightHelper);

// const lightCamHelper = new THREE.CameraHelper(light.shadow.camera);
// scene.add(lightCamHelper);

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera )
  controls.update();
}

animate();