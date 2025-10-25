import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Client3DProps {
  item: "bottle" | "tshirt" | "pillow" | "cup";
  position: "entering" | "exiting" | "waiting" | "handed-off";
  isHappy?: boolean;
  hasObject?: boolean;
  shirtColor?: string;
}

export const Client3D = ({ position, isHappy, hasObject = true, shirtColor = "#5fa3d0" }: Client3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  
  // Animation logic
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Entering animation
    if (position === "entering") {
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        -3,
        0.05
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        0,
        0.05
      );
      
      // Walking animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 5) * 0.02;
    }
    
    // Exiting animation
    else if (position === "exiting") {
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        -6,
        0.05
      );
      // Walking animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 5) * 0.02;
    }
    
    // Waiting animation - subtle sway and breathing
    else if (position === "waiting") {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
    
    // Happy animation - head bobbing and scaling
    if (headRef.current && isHappy) {
      headRef.current.position.y = 1.35 + Math.abs(Math.sin(state.clock.elapsedTime * 5)) * 0.05;
      headRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 8) * 0.03);
      headRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.05;
    } else if (headRef.current) {
      headRef.current.position.y = 1.35;
      headRef.current.scale.setScalar(1);
      headRef.current.rotation.z = 0;
    }

    // Arms animation - holding vs not holding
    if (hasObject) {
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -1.3, 0.1);
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.2, 0.1);
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -1.3, 0.1);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, 0.1);
      }
      // Close hands when holding
      if (leftHandRef.current) {
        leftHandRef.current.scale.setScalar(0.9);
      }
      if (rightHandRef.current) {
        rightHandRef.current.scale.setScalar(0.9);
      }
    } else {
      // Arms down when not holding
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0.1, 0.1);
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.1, 0.1);
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0.1, 0.1);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.1, 0.1);
      }
      // Open hands
      if (leftHandRef.current) {
        leftHandRef.current.scale.setScalar(1);
      }
      if (rightHandRef.current) {
        rightHandRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group ref={groupRef} position={[-6, 0, 0]}>
      {/* Head - more detailed */}
      <mesh ref={headRef} position={[0, 1.35, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.23, 32, 32]} />
        <meshStandardMaterial 
          color="#ffdab9" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Detailed Hair */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.24, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#3d2817" roughness={0.95} />
      </mesh>
      
      {/* Hair strands detail */}
      <mesh position={[-0.1, 1.52, 0.15]} rotation={[0.3, -0.2, 0]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#3d2817" roughness={0.95} />
      </mesh>
      <mesh position={[0.1, 1.52, 0.15]} rotation={[0.3, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#3d2817" roughness={0.95} />
      </mesh>
      
      {/* Eyes - more detailed */}
      <group position={[0, 1.38, 0.18]}>
        {/* Left eye white */}
        <mesh position={[-0.08, 0, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Left pupil */}
        <mesh position={[-0.08, 0, 0.03]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color="#2c1810" />
        </mesh>
        
        {/* Right eye white */}
        <mesh position={[0.08, 0, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Right pupil */}
        <mesh position={[0.08, 0, 0.03]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color="#2c1810" />
        </mesh>
      </group>
      
      {/* Eyebrows */}
      <mesh position={[-0.08, 1.43, 0.2]} rotation={[0, 0, isHappy ? -0.2 : 0]}>
        <boxGeometry args={[0.08, 0.015, 0.01]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      <mesh position={[0.08, 1.43, 0.2]} rotation={[0, 0, isHappy ? 0.2 : 0]}>
        <boxGeometry args={[0.08, 0.015, 0.01]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 1.33, 0.22]} castShadow>
        <coneGeometry args={[0.02, 0.05, 8]} />
        <meshStandardMaterial color="#ffcda3" roughness={0.8} />
      </mesh>
      
      {/* Smile when happy */}
      {isHappy && (
        <mesh position={[0, 1.26, 0.21]} rotation={[Math.PI, 0, 0]}>
          <torusGeometry args={[0.09, 0.018, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#d94545" />
        </mesh>
      )}
      
      {/* Ears */}
      <mesh position={[-0.21, 1.36, 0]} rotation={[0, 0, -0.3]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#ffdab9" roughness={0.8} />
      </mesh>
      <mesh position={[0.21, 1.36, 0]} rotation={[0, 0, 0.3]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#ffdab9" roughness={0.8} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.17, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.09, 0.1, 0.15]} />
        <meshStandardMaterial color="#ffdab9" roughness={0.8} />
      </mesh>
      
      {/* Torso - more organic shape with clothing wrinkles */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.19, 0.55, 16, 32]} />
        <meshStandardMaterial 
          color={shirtColor} 
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
      
      {/* Clothing details - collar */}
      <mesh position={[0, 1.05, 0.15]} castShadow>
        <ringGeometry args={[0.1, 0.15, 16]} />
        <meshStandardMaterial 
          color={new THREE.Color(shirtColor).multiplyScalar(0.8).getHex()} 
          roughness={0.9}
        />
      </mesh>
      
      {/* Waist/Hips */}
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.21, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.85} />
      </mesh>
      
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.27, 0.98, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.16, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.065, 0.27, 8, 16]} />
          <meshStandardMaterial color={shirtColor} roughness={0.85} />
        </mesh>
        {/* Elbow joint */}
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color={new THREE.Color(shirtColor).multiplyScalar(0.9).getHex()} roughness={0.85} />
        </mesh>
        {/* Lower arm */}
        <mesh position={[0, -0.48, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.055, 0.24, 8, 16]} />
          <meshStandardMaterial color="#ffdab9" roughness={0.8} />
        </mesh>
        {/* Hand with fingers */}
        <group ref={leftHandRef} position={[0, -0.68, 0]}>
          {/* Palm */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.09, 0.11, 0.05]} />
            <meshStandardMaterial color="#ffdab9" roughness={0.8} />
          </mesh>
          {/* Thumb */}
          <mesh position={[-0.055, -0.03, 0.02]} rotation={[0, 0, -0.5]} castShadow>
            <capsuleGeometry args={[0.015, 0.04, 6, 8]} />
            <meshStandardMaterial color="#ffdab9" roughness={0.8} />
          </mesh>
          {/* Fingers */}
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={`left-finger-${i}`}
              position={[-0.035 + i * 0.025, -0.08, 0]}
              rotation={[0, 0, hasObject ? 0.3 : 0]}
              castShadow
            >
              <capsuleGeometry args={[0.012, 0.05, 6, 8]} />
              <meshStandardMaterial color="#ffdab9" roughness={0.8} />
            </mesh>
          ))}
        </group>
      </group>
      
      {/* Right Arm - mirror of left */}
      <group ref={rightArmRef} position={[0.27, 0.98, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.16, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.065, 0.27, 8, 16]} />
          <meshStandardMaterial color={shirtColor} roughness={0.85} />
        </mesh>
        {/* Elbow joint */}
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color={new THREE.Color(shirtColor).multiplyScalar(0.9).getHex()} roughness={0.85} />
        </mesh>
        {/* Lower arm */}
        <mesh position={[0, -0.48, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.055, 0.24, 8, 16]} />
          <meshStandardMaterial color="#ffdab9" roughness={0.8} />
        </mesh>
        {/* Hand with fingers */}
        <group ref={rightHandRef} position={[0, -0.68, 0]}>
          {/* Palm */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.09, 0.11, 0.05]} />
            <meshStandardMaterial color="#ffdab9" roughness={0.8} />
          </mesh>
          {/* Thumb */}
          <mesh position={[0.055, -0.03, 0.02]} rotation={[0, 0, 0.5]} castShadow>
            <capsuleGeometry args={[0.015, 0.04, 6, 8]} />
            <meshStandardMaterial color="#ffdab9" roughness={0.8} />
          </mesh>
          {/* Fingers */}
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={`right-finger-${i}`}
              position={[-0.035 + i * 0.025, -0.08, 0]}
              rotation={[0, 0, hasObject ? -0.3 : 0]}
              castShadow
            >
              <capsuleGeometry args={[0.012, 0.05, 6, 8]} />
              <meshStandardMaterial color="#ffdab9" roughness={0.8} />
            </mesh>
          ))}
        </group>
      </group>
      
      {/* Left Leg */}
      <group position={[-0.11, 0.38, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.085, 0.38, 8, 16]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.85} />
        </mesh>
        {/* Knee joint */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#243542" roughness={0.85} />
        </mesh>
        {/* Lower leg */}
        <mesh position={[0, -0.7, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.85} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.92, 0.08]} castShadow receiveShadow>
          <boxGeometry args={[0.14, 0.1, 0.24]} />
          <meshStandardMaterial color="#1a252f" roughness={0.7} metalness={0.1} />
        </mesh>
        {/* Shoe sole */}
        <mesh position={[0, -0.98, 0.08]}>
          <boxGeometry args={[0.15, 0.02, 0.26]} />
          <meshStandardMaterial color="#0f1419" roughness={0.9} />
        </mesh>
      </group>
      
      {/* Right Leg - mirror of left */}
      <group position={[0.11, 0.38, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.085, 0.38, 8, 16]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.85} />
        </mesh>
        {/* Knee joint */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#243542" roughness={0.85} />
        </mesh>
        {/* Lower leg */}
        <mesh position={[0, -0.7, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.85} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.92, 0.08]} castShadow receiveShadow>
          <boxGeometry args={[0.14, 0.1, 0.24]} />
          <meshStandardMaterial color="#1a252f" roughness={0.7} metalness={0.1} />
        </mesh>
        {/* Shoe sole */}
        <mesh position={[0, -0.98, 0.08]}>
          <boxGeometry args={[0.15, 0.02, 0.26]} />
          <meshStandardMaterial color="#0f1419" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};
