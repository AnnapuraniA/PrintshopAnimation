import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeTest = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1410);

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight - 72);
    containerRef.current.appendChild(renderer.domElement);

    // Create a simple cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0xff1493 }); // hotpink
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add light
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / (window.innerHeight - 72);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight - 72);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full" 
      style={{ height: 'calc(100vh - 72px)' }}
    />
  );
};

