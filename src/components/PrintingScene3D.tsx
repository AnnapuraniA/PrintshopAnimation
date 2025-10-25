import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Volume2, VolumeX } from "lucide-react";
import { Footer } from "./Footer";
import { soundManager } from "@/utils/soundEffects";

export const PrintingScene3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    soundManager.setMuted(newMutedState);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2d251e);
    scene.fog = new THREE.Fog(0x2d251e, 5, 20);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 60 : 50,
      window.innerWidth / (window.innerHeight - 72),
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight - 72);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(8, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffa85c, 0.6);
    fillLight.position.set(-5, 8, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff8c42, 0.4);
    rimLight.position.set(0, 3, -8);
    scene.add(rimLight);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a2f26,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Customer (simple character)
    const customerGroup = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4a90e2 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.2;
    body.castShadow = true;
    customerGroup.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.9;
    head.castShadow = true;
    customerGroup.add(head);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.7);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2c2c2c });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.15, 0.35, 0);
    leftLeg.castShadow = true;
    customerGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.15, 0.35, 0);
    rightLeg.castShadow = true;
    customerGroup.add(rightLeg);

    customerGroup.position.set(-6, 0, 0);
    scene.add(customerGroup);

    // Craftsman (similar structure)
    const craftsmanGroup = new THREE.Group();
    
    const craftsmanBody = new THREE.Mesh(bodyGeometry, new THREE.MeshStandardMaterial({ color: 0x8B4513 }));
    craftsmanBody.position.y = 1.2;
    craftsmanBody.castShadow = true;
    craftsmanGroup.add(craftsmanBody);

    const craftsmanHead = new THREE.Mesh(headGeometry, headMaterial);
    craftsmanHead.position.y = 1.9;
    craftsmanHead.castShadow = true;
    craftsmanGroup.add(craftsmanHead);

    const craftsmanLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
    craftsmanLeftLeg.position.set(-0.15, 0.35, 0);
    craftsmanLeftLeg.castShadow = true;
    craftsmanGroup.add(craftsmanLeftLeg);

    const craftsmanRightLeg = new THREE.Mesh(legGeometry, legMaterial);
    craftsmanRightLeg.position.set(0.15, 0.35, 0);
    craftsmanRightLeg.castShadow = true;
    craftsmanGroup.add(craftsmanRightLeg);

    craftsmanGroup.position.set(0, 0, 0);
    scene.add(craftsmanGroup);

    // Printing Machine
    const machineGroup = new THREE.Group();
    
    const machineBody = new THREE.BoxGeometry(1.2, 1.5, 0.8);
    const machineMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x555555,
      metalness: 0.7,
      roughness: 0.3,
    });
    const machine = new THREE.Mesh(machineBody, machineMaterial);
    machine.position.y = 0.75;
    machine.castShadow = true;
    machineGroup.add(machine);

    // Machine screen
    const screenGeometry = new THREE.PlaneGeometry(0.6, 0.4);
    const screenMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 0.3,
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1.2, 0.41);
    machineGroup.add(screen);

    machineGroup.position.set(3, 0, 0);
    scene.add(machineGroup);

    // Printable Object (simple bottle)
    const objectGroup = new THREE.Group();
    
    const bottleBody = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
    const bottleMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });
    const bottle = new THREE.Mesh(bottleBody, bottleMaterial);
    bottle.position.y = 0.25;
    bottle.castShadow = true;
    objectGroup.add(bottle);

    objectGroup.position.set(-6, 0.7, 0.5);
    objectGroup.visible = false;
    scene.add(objectGroup);

    // Animation state
    let phase = 'idle';
    let phaseTime = 0;
    let customerVisible = false;
    let objectVisible = false;
    let customerX = -6;
    let objectX = -6;

    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      phaseTime += delta;

      // Phase management
      if (phase === 'idle' && phaseTime > 1) {
        phase = 'customer-entering';
        phaseTime = 0;
        customerVisible = true;
        objectVisible = true;
        customerX = -6;
        objectX = -6;
        soundManager.playFootstep();
      } else if (phase === 'customer-entering' && phaseTime > 1.5) {
        phase = 'customer-waiting';
        phaseTime = 0;
        customerX = -2;
        objectX = -2;
      } else if (phase === 'customer-waiting' && phaseTime > 0.5) {
        phase = 'handoff';
        phaseTime = 0;
        soundManager.playWhoosh();
      } else if (phase === 'handoff' && phaseTime > 0.8) {
        phase = 'to-machine';
        phaseTime = 0;
        objectX = 0;
        soundManager.playWhoosh();
      } else if (phase === 'to-machine' && phaseTime > 0.8) {
        phase = 'printing';
        phaseTime = 0;
        objectX = 3;
        soundManager.playPrinting(2);
        // Change object color
        bottleMaterial.color.setHex(0xff6b6b);
      } else if (phase === 'printing' && phaseTime > 2) {
        phase = 'from-machine';
        phaseTime = 0;
        objectX = 0;
        soundManager.playWhoosh();
      } else if (phase === 'from-machine' && phaseTime > 0.8) {
        phase = 'to-customer';
        phaseTime = 0;
        objectX = customerX;
        soundManager.playWhoosh();
        soundManager.playSuccess();
      } else if (phase === 'to-customer' && phaseTime > 0.8) {
        phase = 'customer-leaving';
        phaseTime = 0;
        soundManager.playFootstep();
      } else if (phase === 'customer-leaving' && phaseTime > 1.5) {
        phase = 'idle';
        phaseTime = 0;
        customerVisible = false;
        objectVisible = false;
        // Reset object color
        bottleMaterial.color.setHex(0xffffff);
      }

      // Animate customer movement
      if (phase === 'customer-entering') {
        customerX = THREE.MathUtils.lerp(customerX, -2, delta * 2);
      } else if (phase === 'customer-leaving') {
        customerX = THREE.MathUtils.lerp(customerX, 6, delta * 2);
      }

      // Animate object movement
      if (phase === 'customer-entering' || phase === 'customer-leaving') {
        objectX = customerX;
      }

      // Update positions
      customerGroup.position.x = customerX;
      customerGroup.visible = customerVisible;
      objectGroup.position.x = objectX;
      objectGroup.visible = objectVisible;

      // Simple animations
      body.rotation.z = Math.sin(Date.now() * 0.001) * 0.05;
      craftsmanBody.rotation.z = Math.sin(Date.now() * 0.002) * 0.03;
      
      // Machine pulse during printing
      if (phase === 'printing') {
        screenMaterial.emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.01) * 0.2;
      }

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
    };
  }, [isMobile]);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[hsl(28,30%,18%)] to-[hsl(28,35%,15%)]">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, hsl(25 95% 60% / 0.3) 0%, transparent 70%)",
            animation: "pulse 8s ease-in-out infinite"
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, hsl(45 95% 60% / 0.2) 0%, transparent 70%)",
            animation: "pulse 5s ease-in-out infinite 1s"
          }}
        />
      </div>

      {/* 3D Scene Container */}
      <div 
        ref={containerRef} 
        className="w-full" 
        style={{ height: 'calc(100vh - 72px)' }}
      />

      {/* Sound Toggle Button */}
      <button
        onClick={toggleMute}
        className="fixed bottom-24 right-6 z-50 p-3 rounded-full bg-gradient-to-br from-[hsl(25,85%,58%)] to-[hsl(35,90%,55%)] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
        title={isMuted ? "Unmute sounds" : "Mute sounds"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      <Footer />
    </div>
  );
};

