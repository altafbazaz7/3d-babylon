import * as BABYLON from 'babylonjs';
import { useRef, useEffect, useState } from 'react';

function MapTexture() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);
  const boxRef = useRef(null);

  const [mapRegion, setMapRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 12,
    width: 512,
    height: 512
  });

  const createScene = (engine, canvas) => {
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

    const box = BABYLON.MeshBuilder.CreateBox('box', { width: 1, height: 1, depth: 1 }, scene);
    boxRef.current = box;


    const texture = new BABYLON.Texture(`https://maps.googleapis.com/maps/api/staticmap?center=${mapRegion.latitude},${mapRegion.longitude}&zoom=${mapRegion.zoom}&size=${mapRegion.width}x${mapRegion.height}&key=AIzaSyD64vmFIz_1hck8zgnaQaRxRYqQYKqGnp8`, scene);
    const material = new BABYLON.StandardMaterial('material', scene);
    material.diffuseTexture = texture;
    box.material = material;

    return scene;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    engineRef.current = engine;

    const scene = createScene(engine, canvas);
    sceneRef.current = scene;

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });

    return () => {
      scene.dispose();
      engine.dispose();
    }
  }, []);

  const handleButtonClick = () => {
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    const box = boxRef.current;

    const dataUrl = canvas.toDataURL();

    const texture = new BABYLON.Texture(dataUrl, scene);
    const material = new BABYLON.StandardMaterial('material', scene);
    material.diffuseTexture = texture;

    box.material = material;
  }

  const handleRegionChange = (region) => {
    setMapRegion(region);
  }

  return (
    <>
      <canvas ref={canvasRef} style={{ height: '80vh', width: '100%' }} />
      <button onClick={handleButtonClick}>Capture and Apply Texture</button>
    </>
  );
}

export default MapTexture;
