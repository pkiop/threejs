import * as THREE from 'three';
import { useRef, useState, useEffect } from 'react';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as TWEEN from '@tweenjs/tween.js';
import { LoopDetected } from 'http-errors';

function App() {
  const gui = new dat.GUI();
  const mount = useRef();
  const path = 'http://localhost:3030/test.obj';
  const mesh1 = useRef(null);
  const mesh2 = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const FOV = 45; // field of view (시야각) 멀어지고 가까워지는 것
    console.log('innerWidth : ', window.innerWidth);
    const camera = new THREE.PerspectiveCamera(
      FOV,
      window.innerWidth / window.innerHeight,
      0.1, // near ( 이거 이상 가까이 있는 건 render x 최적화용)
      100 // far  ( 이거 이상 멀리 있는 것 render x 최적화용)
    );

    const canvas = mount.current;
    const renderer = new THREE.WebGLRenderer({ canvas });

    camera.position.set(0, 10, 20);
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');

    cameraRef.current = camera;
    rendererRef.current = renderer;
    sceneRef.current = scene;

    {
      const planeSize = 40;

      const loader = new THREE.TextureLoader();
      const texture = loader.load(
        'https://threejsfundamentals.org/threejs/resources/images/checker.png'
      );
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      const repeats = planeSize / 2;
      texture.repeat.set(repeats, repeats);

      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
      const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.rotation.x = Math.PI * -0.5;
      scene.add(mesh);
    }

    {
      const skyColor = 0xb1e1ff; // light blue
      const groundColor = 0xb97a20; // brownish orange
      const intensity = 1;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      scene.add(light);
    }

    {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(0, 10, 0);
      light.target.position.set(-5, 0, 0);
      scene.add(light);
      scene.add(light.target);
    }

    const loader = new OBJLoader();
    console.log('load start');
    loader.load(
      path,
      (obj) => {
        console.log('load complete');
        console.log('obj : ', obj);
        mesh1.current = obj.children[0];
        mesh2.current = obj.children[1];
        scene.add(obj);
      },
      (err) => {
        console.log('err : ', err);
      }
    );

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = window.innerWidth - 100;
      const height = window.innerHeight - 100;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    const requestCallback = (time) => {
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      renderer.render(scene, camera);
      TWEEN.update(time);
    };

    function animate(callback) {
      function loop(time) {
        callback(time);
        requestAnimationFrame(loop);
      }

      requestAnimationFrame(loop);
    }

    animate(requestCallback);
  }, []);

  const onClickHandler = () => {
    if (mesh1) {
      console.log('1 : ', mesh1.current);
      const cube = mesh1.current;
      cube.material.color.setHex(0x0f0f0f);
    }
    if (mesh2) {
      console.log('2 : ', mesh2.current);
    }
  };

  const viewOnTop = () => {
    const camera = cameraRef.current;
    console.log('click');
    if (camera) {
      console.log('do');
      const coords = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      };
      new TWEEN.Tween(coords)
        .to({ x: 0, y: 20, z: 0 })
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          camera.position.set(coords.x, coords.y, camera.position.z);
          camera.lookAt(0, 0, 0);
        })
        .start();
    }
  };

  const viewOn3D = () => {
    const camera = cameraRef.current;
    if (camera) {
      const coords = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      };
      new TWEEN.Tween(coords)
        .to({ x: -20, y: 20, z: 20 })
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          camera.position.set(coords.x, coords.y, camera.position.z);
          camera.lookAt(0, 0, 0);
        })
        .start();
    }
  };

  return (
    <div>
      <canvas ref={mount}></canvas>
      <button onClick={onClickHandler}>colorchange</button>
      <button onClick={viewOnTop}>viewOnTop</button>
      <button onClick={viewOn3D}>viewOn3D</button>
    </div>
  );
}

export default App;
