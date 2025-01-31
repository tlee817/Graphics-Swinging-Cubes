import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const scene = new THREE.Scene();

//THREE.PerspectiveCamera( fov angle, aspect ratio, near depth, far depth );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 10);
controls.target.set(0, 5, 0);

// Rendering 3D axis
const createAxisLine = (color, start, end) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: color });
    return new THREE.Line(geometry, material);
};
const xAxis = createAxisLine(0xff0000, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 0, 0)); // Red
const yAxis = createAxisLine(0x00ff00, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3, 0)); // Green
const zAxis = createAxisLine(0x0000ff, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 3)); // Blue
scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);


// ***** Assignment 2 *****
// Setting up the lights
const pointLight = new THREE.PointLight(0xffffff, 100, 100);
pointLight.position.set(5, 5, 5); // Position the light
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0.5, .0, 1.0).normalize();
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x505050);  // Soft white light
scene.add(ambientLight);

const phong_material = new THREE.MeshPhongMaterial({
    color: 0x00ff00, // Green color
    shininess: 100   // Shininess of the material
});


// Start here.

const l = 0.5
const positions = new Float32Array([
   // Front face (z = l = 0.5)
   -l, -l,  l, // 0 (-0.5,-0.5,0.5)
   l, -l,  l, // 1 (0.5,-0.5,0.5)
   l,  l,  l, // 2 (0.5,0.5,0.5)
  -l,  l,  l, // 3 (-0.5,0.5,0.5)

  // Left face (x = -l = -0.5)
  -l, -l, -l, // 4 (-0.5,-0.5,-0.5)
  -l, -l,  l, // 5 (-0.5,-0.5,0.5)
  -l,  l,  l, // 6 (-0.5,0.5,0.5)
  -l,  l, -l, // 7 (-0.5,0.5,-0.5)

  // Top face
  -l, l, l, // 8 
  l, l, l,  // 9
  l, l, -l, // 10
  -l, l, -l, // 11

  // Bottom face
  -l, -l, -l,  // 12
  l, -l, -l,   // 13
  l, -l, l,  // 14
  -l, -l, l, // 15

  // Right face (x = l = 0.5)
  l, -l, l, // 16
  l ,-l, -l,// 17
  l, l, -l, // 18
  l, l ,l , // 19

   // Back face
   -l, -l, -l, // 20
   l, -l, -l,  // 21
   l, l, -l,   // 22
   -l, l, -l,  // 23
  ]);
  
  const indices = [
    // Front face
    0, 1, 2,
    0, 2, 3,
  
    // Left face
    4, 5, 6,
    4, 6, 7,
  
    // Top face
    8, 9, 10,
    8, 10,11,
    
    // Bottom face
    12, 13, 14,
    12, 14, 15,
  
    // Right face
    16, 17, 18,
    16, 18, 19,

    // Back face
    20,23,22,
    22,21,20
  ];
  
  // Compute normals
  const normals = new Float32Array([
    // Front face
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
  
    // Left face
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
  
    // Top face
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    // Bottom face
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    // Right face
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    // Back face
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
  ]);

const custom_cube_geometry = new THREE.BufferGeometry();
custom_cube_geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
custom_cube_geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
custom_cube_geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

// let cube = new THREE.Mesh( custom_cube_geometry, phong_material );
// scene.add(cube);

// TODO: Implement wireframe geometry
const wireframe_vertices = new Float32Array([
  // Front face (z = l = 0.5)
  -l,-l,l,l,-l,l, // Bottom 
  l,-l,l,l,l,l,   // Right
  l,l,l,-l,l,l,   // Top 
  -l,l,l,-l,-l,l,  // Left

 // Back face edges
 -l,-l,-l,l,-l,-l,  
 l,-l,-l,l,l,-l,  
 l,l,-l,-l,l,-l,  
-l,l,-l,-l,-l,-l,  

  //Connecting edges
  -l,-l,l,-l,-l,-l,  
  l,-l,l,l,-l,-l,  
  l,l,l,l,l,-l,  
  -l,l,l,-l,l,-l   
]);

const wireframe_greometry = new THREE.BufferGeometry();
wireframe_greometry.setAttribute( 'position', new THREE.BufferAttribute( wireframe_vertices, 3 ) );


function translationMatrix(tx, ty, tz) {
	return new THREE.Matrix4().set(
		1, 0, 0, tx,
		0, 1, 0, ty,
		0, 0, 1, tz,
		0, 0, 0, 1
	);
}
// TODO: Implement the other transformation functions.
function rotationMatrixZ(theta) {
	return new THREE.Matrix4().set(
    Math.cos(theta), -Math.sin(theta),0,0,
    Math.sin(theta),  Math.cos(theta),0,0,
    0,0,1,0,
    0,0,0,1
	);
}

function scalingMatrix(sx, sy, sz) {
  return new THREE.Matrix4().set(
    sx,0,0,0,
    0,sy,0,0,
    0,0,sz,0,
    0,0,0,1
  );
}

let cubes = [];
for (let i = 0; i < 7; i++) {
	let cube = new THREE.Mesh(custom_cube_geometry, phong_material);
	cube.matrixAutoUpdate = false;
	cubes.push(cube);
	scene.add(cube);
  //cubes[i].visible = false;
}

 let wireframe_cubes=[];
for (let i = 0; i < 7; i++) {
  let wireframe_cube = new THREE.LineSegments(wireframe_greometry, new THREE.LineBasicMaterial({ color: 0xffffff }));
	wireframe_cube.matrixAutoUpdate = false;
	wireframe_cubes.push(wireframe_cube);
	scene.add(wireframe_cube);
	//wireframe_cube.visible = true; 
}

// TODO: Transform cubes

let animation_time = 0;
let delta_animation_time;
let rotation_angle;
const clock = new THREE.Clock();
let visibility_switch = false;

let MAX_ANGLE = 10 * Math.PI/180 // 10 degrees converted to radians
let T = 2 // oscilation persiod in seconds

function animate() {
  delta_animation_time = clock.getDelta();
  animation_time += delta_animation_time; 
if(!still)
{
  rotation_angle = (MAX_ANGLE * Math.sin((2 * Math.PI / T) * animation_time) + MAX_ANGLE) / 2;
}
else
{
  rotation_angle=MAX_ANGLE;
}
  let model_transformation = new THREE.Matrix4();
  const rotation = rotationMatrixZ(rotation_angle); 
  const translation = translationMatrix(0,3*l,0); 
  model_transformation.multiplyMatrices(scalingMatrix(1,1.5,1),model_transformation); //Scale by 1.5 in the y direction
  

  // Apply transformations
  for (let i = 0; i < cubes.length; i++) {
     cubes[i].matrix.copy(model_transformation);
     wireframe_cubes[i].matrix.copy(model_transformation);
     model_transformation.multiplyMatrices(translationMatrix(0.5,0.75,0),model_transformation); //Move to origin
     model_transformation.multiplyMatrices(rotation, model_transformation); //Rotate to desired angle
     model_transformation.multiplyMatrices(translationMatrix(-0.5,-0.75,0),model_transformation); //translate back to original position
     model_transformation.multiplyMatrices(translation,model_transformation); //Translate 3 unit in the y direction to stack cubes up

     cubes[i].visible = visibility_switch;
     wireframe_cubes[i].visible = !visibility_switch;
  }
  renderer.render( scene, camera );
  controls.update();
}
renderer.setAnimationLoop( animate );

// TODO: Add event listener

let still = false;
window.addEventListener('keydown', onKeyPress); // onKeyPress is called each time a key is pressed
// Function to handle keypress
function onKeyPress(event) {
    switch (event.key) {
        case 's': // Note we only do this if s is pressed.
            still = !still;
            break;
        case 'w':
          visibility_switch= !visibility_switch;
          break;
        default:
            console.log(`Key ${event.key} pressed`);
    }
}