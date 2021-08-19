import * as THREE from 'three';
import { useRef, useState, useEffect } from 'react';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function App() {
  const gui = new dat.GUI();
  const mount = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const FOV = 1000; // field of view (시야각) 멀어지고 가까워지는 것
    const camera = new THREE.PerspectiveCamera(
      FOV,
      window.innerWidth / window.innerHeight,
      0.1, // near ( 이거 이상 가까이 있는 건 render x 최적화용)
      100 // far  ( 이거 이상 멀리 있는 것 render x 최적화용)
    );
    const loader = new GLTFLoader();
    console.log('load start');
    loader.load(
      './src/model/deskmat.gltf',
      (gltf) => {
        console.log('load complete');
        scene.add(gltf.scene);
      },
      (err) => {
        console.log('err : ', err);
      }
    );
    camera.position.x = -3;
    camera.position.y = -3;
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.current.appendChild(renderer.domElement);

    // camera.position.x = 5;
    // camera.position.y = -5;
    // camera.lookAt(new THREE.Vector3(0, 0, 0));
    // camera.position.z = 10 * Math.cos(defaultValue);

    // scene.add(camera);  // add camera

    const geometry = new THREE.BoxGeometry(3, 1, 0.5); // 물체 자체
    const material = new THREE.MeshStandardMaterial({ color: 0xcb8830 }); // 그 물체의 skin

    const cube = new THREE.Mesh(geometry, material);
    cube.cursor = 'pointer';
    scene.add(cube);

    const whiteLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 4);
    // light.position.x = 0;
    // light.position.x = 0;
    // light.position.x = 0;
    whiteLight.position.set(1, 1, 1); // same
    scene.add(whiteLight);
    gui.add(whiteLight.position, 'y');
    // const blackLight = new THREE.HemisphereLight(0x00ff00, 0x00ff00, 9);
    // // light.position.x = 0;
    // // light.position.x = 0;
    // // light.position.x = 0;
    // blackLight.position.set(1, 1, -1); // same
    // scene.add(blackLight);
    // gui.add(blackLight.position, 'y');

    const whiteLightHelper = new THREE.PointLightHelper(whiteLight, 3);
    scene.add(whiteLightHelper);

    // camera.position.y = 0.1;
    // cube.rotation.x = 2.2;
    // cube.rotation.z = 1.0;
    // cube.rotation.y = 3.5;
    cube.position.set(0, 0, 0);

    const animate = function () {
      requestAnimationFrame(animate);
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
      // cube.rotation.z += 0.01;
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  return (
    <div>
      <div ref={mount}></div>
    </div>
  );
}

export default App;
