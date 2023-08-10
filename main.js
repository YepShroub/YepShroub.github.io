import WebGL from 'three/addons/capabilities/WebGL.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';

if (WebGL.isWebGLAvailable()) {

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x3C3C3C);
    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const objectGeometry = new THREE.BoxGeometry(1, 1, 1);
    const objectMaterial = new THREE.MeshStandardMaterial({ color: 0x049ef4 });
    var object = new THREE.Mesh(objectGeometry, objectMaterial);
    const objectEdgesGeometry = new THREE.EdgesGeometry(object.geometry)
    const objectEdgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    const objectEdges = new THREE.LineSegments(objectEdgesGeometry, objectEdgesMaterial);
    object.add(objectEdges);

    scene.fog = new THREE.Fog(0x3C3C3C, 50, 60);

    const size = 1000;
    const divisions = 1000;
    const gridHelper = new THREE.GridHelper(size, divisions, new THREE.Color(0x2c2c2c), new THREE.Color(0x4B4B4B));
    scene.add(gridHelper);

    scene.add(object)

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.mouseButtons = {
        LEFT: null,
        MIDDLE: THREE.MOUSE.ROTATE,
        RIGHT: null
    };
    controls.update();

    var params = {
        upload: function() { 
            document.getElementById('fileUpload').click();
    }
    };

    const gui = new GUI();
    gui.add(params, 'upload').name('Upload');

    var stats = new Stats();
	document.body.appendChild( stats.dom );


    // function onMouseWheelScroll(e) {

    //     var lookingAt = new THREE.Vector3();
    //     camera.getWorldDirection(lookingAt);


    //     camera.translateZ(-e.wheelDeltaY * 0.005);


    //     camera.updateProjectionMatrix();
    //     console.log(camera.position.z);

    // }

    function onMouseButtonDown(e) {
        controls.mouseButtons = {
            LEFT: null,
            MIDDLE: THREE.MOUSE.PAN,
            RIGHT: null
        };
    }

    function onMouseButtonUp(e) {
        controls.mouseButtons = {
            LEFT: null,
            MIDDLE: THREE.MOUSE.ROTATE,
            RIGHT: null
        };
    }

    document.addEventListener('mousedown', onMouseButtonDown);
    document.addEventListener('mouseup', onMouseButtonUp);

    window.addEventListener('resize', onWindowResize, false);

    const gltfLoader = new GLTFLoader();

    const uploadButton = document.getElementById('fileUpload');
    uploadButton.onchange = () => {
        var file = uploadButton.files[0];
        scene.remove(object);
        gltfLoader.load(URL.createObjectURL(file), function(gltf){
            object = gltf.scene;
            scene.add(object);
        });
        
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function animate() {
        requestAnimationFrame(animate);
        console.log("Camera: " + "X: " + camera.position.x + "; Y: " + camera.position.y + "; Z: " + camera.position.z);
        controls.update();
        stats.update();

        renderer.render(scene, camera);
    }

    animate();

} else {

    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);

}

