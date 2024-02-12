import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';
import { Water } from 'jsm/objects/Water.js';
import { Sky } from 'jsm/objects/Sky.js';


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
const loader = new GLTFLoader().setPath('models/Serpent/');
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

const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

const water = new Water(
  waterGeometry,
  {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load( '/texture/water.jpg', function ( texture ) {

      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    } ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined
  }
);
water.position.set(0, -1.5, 0);
water.rotation.x = - Math.PI / 2;
water.receiveShadow = true;

scene.add( water );

// Skybox

const sky = new Sky();
sky.scale.setScalar( 10000 );
scene.add( sky );

const sun = new THREE.Vector3();

const skyUniforms = sky.material.uniforms;

				skyUniforms[ 'turbidity' ].value = 10;
				skyUniforms[ 'rayleigh' ].value = 2;
				skyUniforms[ 'mieCoefficient' ].value = 0.005;
				skyUniforms[ 'mieDirectionalG' ].value = 0.8;

				const parameters = {
					elevation: 2,
					azimuth: 10
				};

				const pmremGenerator = new THREE.PMREMGenerator( renderer );
				const sceneEnv = new THREE.Scene();

				let renderTarget;

				// function updateSun() {

					const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
					const theta = THREE.MathUtils.degToRad( parameters.azimuth );

					sun.setFromSphericalCoords( 1, phi, theta );

					sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
				// 	water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

					if ( renderTarget !== undefined ) renderTarget.dispose();

					sceneEnv.add( sky );
					renderTarget = pmremGenerator.fromScene( sceneEnv );
					scene.add( sky );

					scene.environment = renderTarget.texture;

				// }

				// updateSun();



// const seaTexture = new THREE.TextureLoader().load('models/darkSea.jpg');
// const planeMaterial = new THREE.MeshStandardMaterial({
//   // map: seaTexture,
//   color: 0x000000,
//   side: THREE.DoubleSide 
// });

// const groundMash = new THREE.Mesh(planeGermetry, planeMaterial);
// scene.add(groundMash);
// groundMash.receiveShadow = true;
// groundMash.position.set(0, -1.5, 0);

const ambiLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambiLight)


const light = new THREE.DirectionalLight(0xffffff, 10);
light.position.set(-5, 5, 5);
scene.add(light);
// light.castShadow = true;

// const lightHelper = new THREE.DirectionalLightHelper(light);
// scene.add(lightHelper);

// const lightCamHelper = new THREE.CameraHelper(light.shadow.camera);
// scene.add(lightCamHelper);

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}
window.addEventListener( 'resize', onWindowResize );

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera )
  water.material.uniforms[ 'time' ].value += 1.0 / 200.0;
  controls.update();
}

animate();
