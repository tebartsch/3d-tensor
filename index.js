import * as THREE from 'three';
import { SVGRenderer } from "three/addons/renderers/SVGRenderer.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 3D-Object Parameters
let cube_dim = 0.5
let cols = 6;
let rows = 2;
let depth = 2;

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.00000000001, 100000 );
camera.position.z = 12;

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
const fog_color = 0xFFFFFF;
const fog_density = 0.5;
scene.fog = new THREE.Fog(fog_color, fog_density);

const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
// renderer.setAnimationLoop( animation );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.setClearColor( 0x000000, 0 );
const cube_geometry = new RoundedBoxGeometry( cube_dim, cube_dim, cube_dim, 2, 0.025 );
const cube_material = new THREE.MeshMatcapMaterial({color: 0x8EC3B0, transparent: true, opacity: 0.975});

/*const renderer = new SVGRenderer({alpha: true});
renderer.overdraw = 0;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement); // Add the SVG in the DOM
renderer.domElement.setAttribute('xmlns' ,'http://www.w3.org/2000/svg');
const cube_geometry = new THREE.BoxGeometry( cube_dim, cube_dim, cube_dim);
const cube_material = new THREE.MeshBasicMaterial({color: 0x8EC3B0});*/

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', () => {
  renderer.render(scene, camera);
});


var sub_group = new THREE.Group();

// Cubes
for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
        for (let d = 0; d < depth; d++) {
            const cube = new THREE.Mesh( cube_geometry, cube_material );
            cube.translateX( - cols / 2 + c + cube_dim);
            cube.translateY( - rows / 2 + r + cube_dim);
            cube.translateZ( - depth / 2 + d + cube_dim);
            sub_group.add( cube );
        }
    }
}

// Surrounding Box
const surrounding_box_material = new THREE.MeshMatcapMaterial({color: 0xDEF5E5, transparent: true, opacity: 0.1});
const surrounding_box_geometry = new RoundedBoxGeometry( cols, rows, depth );
const surrounding_box = new THREE.Mesh( surrounding_box_geometry, surrounding_box_material, 2, 0.05 );
sub_group.add(surrounding_box)
/*const surrounding_box_edges_geometry = new THREE.EdgesGeometry( surrounding_box_geometry );
const surrounding_box_edges = new THREE.LineSegments( surrounding_box_edges_geometry,
    new THREE.LineBasicMaterial( { color: 0x000000 } ) );
sub_group.add(surrounding_box_edges)*/

// Multiply sub_group
var group = new THREE.Group();
for ( var r = -0.5; r < 1; r = r + 1 ) {
    for ( var c = -0.5; c < 1; c = c + 1) {
        for ( var d = -0.5; d < 1; d = d + 1) {
            var mesh = sub_group.clone();
            mesh.position.set( c * (cols + 1), r * (rows + 1), d * (depth + 1) );
            group.add( mesh );
        }
    }
}
scene.add(group);

// Rotate
const preset_angle_x = 28
const preset_angle_y = -17
const preset_angle_z = 0

group.rotation.x = preset_angle_x / 360 * (2 * 3.1459);
group.rotation.y = preset_angle_y / 360 * (2 * 3.1459);
group.rotation.z = preset_angle_z / 360 * (2 * 3.1459);

renderer.render( scene, camera );