// 1. Create the button
var button = document.createElement("button");
button.innerHTML = "Do Something";

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);

// 3. Add event handler
button.addEventListener ("click", function() {
  alert("did something");
});

camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.x = 2;
camera.position.y = 0;
camera.position.z = 0;
//camera.lookAt (new THREE.Vector3(0,0,0))

scene = new THREE.Scene();
scene.add(camera)

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth*0.73, window.innerHeight*0.73);
document.body.appendChild( renderer.domElement );

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;
controls.dampingFactor = 0.25;
controls.enableZoom = false;

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

const color = 0xFFFFFF;
const intensity = 1;
const dirlight = new THREE.DirectionalLight(color, intensity);
dirlight.position.set(-1, 2, 4);
scene.add(dirlight);

//var controls = new THREE.OrbitControls( camera );
controls.update();
animate();

const objLoader = new THREE.OBJLoader2();
objLoader.load('https://raw.githubusercontent.com/PelissierCombescure/User_study/main/3DMesh/dragon.obj', (event) => {
    const root = event.detail.loaderRootNode;
    scene.add(root);
});


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
