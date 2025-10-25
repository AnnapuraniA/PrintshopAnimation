import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PrintingMachine3DProps {
  isActive: boolean;
}

export const PrintingMachine3D = ({ isActive }: PrintingMachine3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const roller1Ref = useRef<THREE.Mesh>(null);
  const roller2Ref = useRef<THREE.Mesh>(null);
  const light1Ref = useRef<THREE.Mesh>(null);
  const light2Ref = useRef<THREE.Mesh>(null);
  const light3Ref = useRef<THREE.Mesh>(null);
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Vibration when active
    if (isActive) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 20) * 0.02;
      
      // Rotating rollers
      if (roller1Ref.current) {
        roller1Ref.current.rotation.x += 0.1;
      }
      if (roller2Ref.current) {
        roller2Ref.current.rotation.x -= 0.1;
      }
      
      // Blinking lights
      const pulse = Math.sin(state.clock.elapsedTime * 5);
      if (light1Ref.current) {
        (light1Ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + pulse * 0.5;
      }
      if (light2Ref.current) {
        (light2Ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 5 + 1) * 0.5;
      }
      if (light3Ref.current) {
        (light3Ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 5 + 2) * 0.5;
      }
      
      // Screen scanning effect
      if (screenRef.current) {
        (screenRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2 + Math.abs(pulse) * 0.3;
      }
    } else {
      groupRef.current.position.y = 0;
      
      // Dim lights when inactive
      if (light1Ref.current) {
        (light1Ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.1;
      }
      if (light2Ref.current) {
        (light2Ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.1;
      }
      if (light3Ref.current) {
        (light3Ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.1;
      }
      if (screenRef.current) {
        (screenRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.1;
      }
    }
  });

  return (
    <group ref={groupRef} position={[3, 0, 0]}>
      {/* Main machine body */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.6, 0.8]} />
        <meshStandardMaterial color="#4a9ead" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Screen/Display */}
      <mesh ref={screenRef} position={[0, 1.2, 0.41]} castShadow>
        <boxGeometry args={[1.2, 0.5, 0.05]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          emissive="#f4d03f"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Control Buttons */}
      <mesh ref={light1Ref} position={[-0.4, 0.6, 0.41]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color="#ff6b35" 
          emissive="#ff6b35"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh ref={light2Ref} position={[-0.2, 0.6, 0.41]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color="#f4d03f" 
          emissive="#f4d03f"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh ref={light3Ref} position={[0, 0.6, 0.41]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color="#4ecdc4" 
          emissive="#4ecdc4"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Printing slot */}
      <mesh position={[0, 0.3, 0.41]}>
        <boxGeometry args={[1, 0.2, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Rollers */}
      <mesh ref={roller1Ref} position={[-0.4, 0.2, 0.41]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2]} />
        <meshStandardMaterial color="#7c8a99" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh ref={roller2Ref} position={[0.4, 0.2, 0.41]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2]} />
        <meshStandardMaterial color="#7c8a99" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Base stand */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 0.2]} />
        <meshStandardMaterial color="#a8b2bd" />
      </mesh>

      {/* Glow effect when active */}
      {isActive && (
        <pointLight 
          position={[0, 1, 0.5]} 
          color="#f4d03f" 
          intensity={0.5} 
          distance={3}
        />
      )}
    </group>
  );
};

