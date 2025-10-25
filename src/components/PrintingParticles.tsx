import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PrintingParticlesProps {
  active: boolean;
  position: [number, number, number];
}

export const PrintingParticles = ({ active, position }: PrintingParticlesProps) => {
  const particlesRef = useRef<THREE.Points>(null);
  const sparklesRef = useRef<THREE.Points>(null);

  // Create particles
  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Particles emanate from center
      positions[i3] = (Math.random() - 0.5) * 0.5;
      positions[i3 + 1] = Math.random() * 0.3;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.5;
      
      // Orange/yellow/gold colors
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i3] = 1.0; colors[i3 + 1] = 0.42; colors[i3 + 2] = 0.21; // Orange
      } else if (colorChoice < 0.66) {
        colors[i3] = 0.96; colors[i3 + 1] = 0.82; colors[i3 + 2] = 0.25; // Yellow
      } else {
        colors[i3] = 0.89; colors[i3 + 1] = 0.65; colors[i3 + 2] = 0.29; // Gold
      }
      
      sizes[i] = Math.random() * 0.05 + 0.02;
    }
    
    return { positions, colors, sizes };
  }, []);

  // Sparkles
  const sparkles = useMemo(() => {
    const count = 50;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 0.8;
      positions[i3 + 1] = Math.random() * 0.5;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.8;
      sizes[i] = Math.random() * 0.08 + 0.03;
    }
    
    return { positions, sizes };
  }, []);

  useFrame((state) => {
    if (!active) return;
    
    // Animate main particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Rise upward
        positions[i + 1] += 0.01;
        
        // Swirl effect
        const angle = state.clock.elapsedTime * 2 + i;
        positions[i] += Math.sin(angle) * 0.002;
        positions[i + 2] += Math.cos(angle) * 0.002;
        
        // Reset if too high
        if (positions[i + 1] > 0.8) {
          positions[i + 1] = 0;
          positions[i] = (Math.random() - 0.5) * 0.5;
          positions[i + 2] = (Math.random() - 0.5) * 0.5;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    
    // Animate sparkles
    if (sparklesRef.current) {
      const sizes = sparklesRef.current.geometry.attributes.size.array as Float32Array;
      
      for (let i = 0; i < sizes.length; i++) {
        sizes[i] = (Math.sin(state.clock.elapsedTime * 5 + i) + 1) * 0.04 + 0.02;
      }
      
      sparklesRef.current.geometry.attributes.size.needsUpdate = true;
      sparklesRef.current.rotation.y = -state.clock.elapsedTime * 0.5;
    }
  });

  if (!active) return null;

  return (
    <group position={position}>
      {/* Main particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particles.sizes.length}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Sparkles */}
      <points ref={sparklesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={sparkles.positions.length / 3}
            array={sparkles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={sparkles.sizes.length}
            array={sparkles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#ffffff"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Laser beam effect */}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <meshBasicMaterial
          color="#f4d03f"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Glow orb at center */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial
          color="#ff8c42"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Additional point lights for atmosphere */}
      <pointLight position={[0, 0, 0]} color="#f4d03f" intensity={1} distance={2} />
      <pointLight position={[0, 0.3, 0]} color="#ff8c42" intensity={0.5} distance={1.5} />
    </group>
  );
};

