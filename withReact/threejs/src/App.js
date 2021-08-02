import * as THREE from 'three';
import { useRef, useEffect } from 'react';

function App() {
  const mount = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const FOV = 200; // field of view (시야각) 멀어지고 가까워지는 것
    const camera = new THREE.PerspectiveCamera(
      FOV,
      window.innerWidth / window.innerHeight,
      0.1, // near ( 이거 이상 가까이 있는 건 render x 최적화용)
      1000 // far  ( 이거 이상 멀리 있는 것 render x 최적화용)
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 0.1);
    const material = new THREE.MeshStandardMaterial({ color: 0xcb8830 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.8);
    scene.add(light);
    camera.position.z = 0.8;
    camera.position.x = 0.8;
    camera.position.y = 0.8;

    // camera.position.y = 0.1;
    // cube.rotation.x = 2.2;
    // cube.rotation.z = 1.0;
    // cube.rotation.y = 3.5;
    const animate = function () {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
      // cube.rotation.z += 0.01;
      renderer.render(scene, camera);
    };
    animate();
  });
  return <div ref={mount}></div>;
}

export default App;
