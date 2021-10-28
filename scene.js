import * as THREE from "https://cdn.skypack.dev/three";
import {OrbitControls} from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";
const e_1 = new THREE.Vector3(1,0,0);
const e_2 = new THREE.Vector3(0,1,0);
const e_3 = new THREE.Vector3(0,0,1);


function northernSemisphereRandomDirection(){
    // Derived from https://mathworld.wolfram.com/SpherePointPicking.html

    //const u = Math.random(); //the altitude goes between 0 and 1.
    const u = Math.random() * (0.8 - 0.6) + 0.6; //the altitude goes between 0.6 and 0.8, in order to let the tree grow more vertically, but it's a temporal solution.
	const t = Math.random() * Math.PI * 2;
	const f = Math.sqrt( 1 - u ** 2 );
    
    return new THREE.Vector3(   f * Math.cos( t ),
                                u,
                                f * Math.sin( t ));
    
}


class TreeBranch extends THREE.Mesh {
    constructor(center, topOfBranchDirection , h= 20, radius = 1){
		let geometry = new THREE.CylinderGeometry( radius, radius, h, 32 );
		let material = new THREE.MeshBasicMaterial( {color: 0x964b00} );
		super(geometry, material);
        this.position.copy(center);
        this.height = h;
        this.radius = radius;
        this.quaternion.setFromUnitVectors(e_2, topOfBranchDirection); //it rotates such that the direction of the object is topOfBranchDirection.  
    };

    isLeaf(){return this.children.length == 0;};

    addNewChild(){
        let childDirection = northernSemisphereRandomDirection();
        if(this.children.length == 0){
            childDirection.set(0,1,0); //This forces the tree to have a trunk all the way up
        }
        let newHeight = this.height / 1.5;
        let childCenter = new THREE.Vector3(0,this.height/2,0).addScaledVector(childDirection, newHeight / 2);
        let child = new TreeBranch(childCenter, childDirection ,newHeight, this.radius/1.5);

        this.add(child);
    }

    addLayer(){
        if(this.isLeaf()){
            this.addNewChild();
            this.addNewChild();
            this.addNewChild();
            this.addNewChild();
        }else{
            this.children.forEach(child => child.addLayer()); //we must go deeper
        }

    }


}


const scene = new THREE.Scene();
//scene.background = new THREE.Color('skyblue');

//Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 30, 75 );
camera.lookAt( 0, 0, 0 );

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();
    
//Tree
let trunk = new TreeBranch(new THREE.Vector3(0,0,0), e_2);
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
