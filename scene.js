import * as THREE from "https://cdn.skypack.dev/three";
import {OrbitControls} from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";


function northernSemisphereRandomDirection(){
    // Derived from https://mathworld.wolfram.com/SpherePointPicking.html

    //const u = Math.random(); //the altitude goes between 0 and 1.
    const u = Math.sqrt(2)/2;
	const t = Math.random() * Math.PI * 2;
	const f = Math.sqrt( 1 - u ** 2 );
    
    return new THREE.Vector3(   f * Math.cos( t ),
                                u,
                                f * Math.sin( t ));
    
    //return new THREE.Vector3(u, u,0); //for a true fractal tree, but it's 2d
}


class TreeBranch extends THREE.Mesh {
    constructor(pos, rotationQuaternion , h= 10, radius = 1){
		let geometry = new THREE.CylinderGeometry( radius, radius, h, 32 );
		let material = new THREE.MeshBasicMaterial( {color: 0x964b00} );
		super(geometry, material);
        this.position.copy(pos);
        this.height = h;
        this.radius = radius;
        this.quaternion.copy(rotationQuaternion);
    };

    isLeaf(){return this.children.length == 0;};

    addLayer(){
        if(this.isLeaf()){
            let relativeTopOfBranch = new THREE.Vector3(0,this.height/2,0);
            let child1Direction = northernSemisphereRandomDirection();
            let newHeight = this.height / 1.5;
            let child2Direction = northernSemisphereRandomDirection();
            let child1Position = relativeTopOfBranch.clone();
            let child2Position = relativeTopOfBranch.clone();

            child1Position.addScaledVector(child1Direction, newHeight / 2);
            child2Position.addScaledVector(child2Direction, newHeight / 2);
            let child1Rotation = new THREE.Quaternion();
            let child2Rotation = new THREE.Quaternion();

            
            child1Rotation.setFromUnitVectors(new THREE.Vector3(0,1,0), child1Direction);
            child2Rotation.setFromUnitVectors(new THREE.Vector3(0,1,0), child2Direction);
            let child1 = new TreeBranch(child1Position, child1Rotation ,newHeight, this.radius/1.5);
            let child2 = new TreeBranch(child2Position, child2Rotation ,newHeight, this.radius/1.5);
            this.add(child1);
            this.add(child2);
        }else{
            this.children.forEach(child => child.addLayer()); //we must go deeper
        }

    }


}


const scene = new THREE.Scene();
//scene.background = new THREE.Color('skyblue');
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

camera.position.set( 0, 30, 75 );
camera.lookAt( 0, 0, 0 );
controls.update();
 
let trunk = new TreeBranch(new THREE.Vector3(0,5,0), new THREE.Quaternion(0,0,0,1));
trunk.addLayer();
trunk.addLayer();
trunk.addLayer();
trunk.addLayer();
trunk.addLayer();
trunk.addLayer();
trunk.addLayer();

scene.add(trunk);


console.log(trunk);

function animate() {

	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

	renderer.render( scene, camera );

	renderer.setSize( window.innerWidth, window.innerHeight );

}

animate();

		