import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Craftsman3DProps {
  isWorking: boolean;
  hasObject?: boolean;
}

export const Craftsman3D = ({ isWorking, hasObject = false }: Craftsman3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Subtle breathing/working animation
    if (isWorking) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.06;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
      
      // Head nods while working
      if (headRef.current) {
        headRef.current.rotation.x = 0.15 + Math.sin(state.clock.elapsedTime * 2.5) * 0.08;
      }
      
      // Arms moving while working - reaching toward machine
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.4 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
        leftArmRef.current.rotation.z = 0.3;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -0.4 - Math.sin(state.clock.elapsedTime * 4) * 0.3;
        rightArmRef.current.rotation.z = -0.3;
      }
    } else if (hasObject) {
      // Holding object pose - looking down
      groupRef.current.position.y = 0;
      if (headRef.current) {
        headRef.current.rotation.x = 0.3; // Looking down at object
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -1.1, 0.1);
        leftArmRef.current.rotation.z = 0.4;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -1.1, 0.1);
        rightArmRef.current.rotation.z = -0.4;
      }
      // Close hands
      if (leftHandRef.current) leftHandRef.current.scale.setScalar(0.9);
      if (rightHandRef.current) rightHandRef.current.scale.setScalar(0.9);
    } else {
      // Idle state - relaxed
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      if (headRef.current) {
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, 0.1);
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0.15, 0.1);
        leftArmRef.current.rotation.z = 0.15;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0.15, 0.1);
        rightArmRef.current.rotation.z = -0.15;
      }
      // Open hands
      if (leftHandRef.current) leftHandRef.current.scale.setScalar(1);
      if (rightHandRef.current) rightHandRef.current.scale.setScalar(1);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial color="#f4c2a0" roughness={0.85} />
      </mesh>

      {/* Cap/Hat - craftsman style */}
      <group position={[0, 1.65, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.27, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#d97634" roughness={0.8} />
        </mesh>
        {/* Cap visor */}
        <mesh position={[0, 0, 0.25]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.02, 0.15]} />
          <meshStandardMaterial color="#c26830" roughness={0.8} />
        </mesh>
      </group>
      
      {/* Eyes - detailed */}
      <group position={[0, 1.52, 0.2]}>
        <mesh position={[-0.09, 0, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.09, 0, 0.035]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshStandardMaterial color="#3d2817" />
        </mesh>
        <mesh position={[0.09, 0, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.09, 0, 0.035]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshStandardMaterial color="#3d2817" />
        </mesh>
      </group>

      {/* Eyebrows - thick, bushy */}
      <mesh position={[-0.09, 1.58, 0.22]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.1, 0.02, 0.015]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0.09, 1.58, 0.22]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.1, 0.02, 0.015]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 1.46, 0.24]} rotation={[0.5, 0, 0]} castShadow>
        <coneGeometry args={[0.025, 0.06, 8]} />
        <meshStandardMaterial color="#eba888" roughness={0.85} />
      </mesh>

      {/* Friendly smile */}
      <mesh position={[0, 1.40, 0.23]} rotation={[Math.PI, 0, 0]}>
        <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#d94545" />
      </mesh>

      {/* Mustache */}
      <group position={[0, 1.43, 0.23]}>
        <mesh position={[-0.05, 0, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.08, 0.025, 0.02]} />
          <meshStandardMaterial color="#654321" roughness={0.95} />
        </mesh>
        <mesh position={[0.05, 0, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.08, 0.025, 0.02]} />
          <meshStandardMaterial color="#654321" roughness={0.95} />
        </mesh>
      </group>

      {/* Ears */}
      <mesh position={[-0.24, 1.5, 0]} rotation={[0, 0, -0.3]} castShadow>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#f4c2a0" roughness={0.85} />
      </mesh>
      <mesh position={[0.24, 1.5, 0]} rotation={[0, 0, 0.3]} castShadow>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#f4c2a0" roughness={0.85} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.11, 0.18]} />
        <meshStandardMaterial color="#f4c2a0" roughness={0.85} />
      </mesh>

      {/* Torso - larger, more robust */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.27, 0.7, 16, 32]} />
        <meshStandardMaterial color="#7c90a0" roughness={0.85} />
      </mesh>

      {/* Apron - detailed with straps */}
      <mesh position={[0, 0.8, 0.28]} castShadow>
        <boxGeometry args={[0.45, 0.85, 0.02]} />
        <meshStandardMaterial color="#e8d4b8" roughness={0.95} />
      </mesh>
      
      {/* Apron pocket */}
      <mesh position={[0, 0.5, 0.30]} castShadow>
        <boxGeometry args={[0.25, 0.18, 0.015]} />
        <meshStandardMaterial color="#d4c5b0" roughness={0.95} />
      </mesh>

      {/* Apron straps - over shoulders */}
      <mesh position={[-0.12, 1.15, 0.24]} rotation={[0.4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.35]} />
        <meshStandardMaterial color="#d4c5b0" roughness={0.9} />
      </mesh>
      <mesh position={[0.12, 1.15, 0.24]} rotation={[0.4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.35]} />
        <meshStandardMaterial color="#d4c5b0" roughness={0.9} />
      </mesh>

      {/* Waist/Belt */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.24, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#34495e" roughness={0.85} />
      </mesh>
      
      {/* Belt buckle */}
      <mesh position={[0, 0.42, 0.25]} castShadow>
        <boxGeometry args={[0.08, 0.06, 0.02]} />
        <meshStandardMaterial color="#8b7355" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.35, 1.08, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.19, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.075, 0.32, 8, 16]} />
          <meshStandardMaterial color="#7c90a0" roughness={0.85} />
        </mesh>
        {/* Elbow */}
        <mesh position={[0, -0.37, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#6d8090" roughness={0.85} />
        </mesh>
        {/* Lower arm */}
        <mesh position={[0, -0.56, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.065, 0.3, 8, 16]} />
          <meshStandardMaterial color="#f4c2a0" roughness={0.85} />
        </mesh>
        {/* Hand with fingers */}
        <group ref={leftHandRef} position={[0, -0.78, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.1, 0.12, 0.06]} />
            <meshStandardMaterial color="#f4c2a0" roughness={0.85} />
          </mesh>
          {/* Thumb */}
          <mesh position={[-0.06, -0.04, 0.025]} rotation={[0, 0, -0.6]} castShadow>
            <capsuleGeometry args={[0.018, 0.045, 6, 8]} />
            <meshStandardMaterial color="#f4c2a0" roughness={0.85} />
          </mesh>
          {/* Fingers */}
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={`left-f-${i}`}
              position={[-0.04 + i * 0.028, -0.09, 0]}
              rotation={[0, 0, hasObject ? 0.4 : 0.1]}
              castShadow
            >
              <capsuleGeometry args={[0.014, 0.055, 6, 8]} />
              <meshStandardMaterial color="#f4c2a0" roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.35, 1.08, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.19, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.075, 0.32, 8, 16]} />
          <meshStandardMaterial color="#7c90a0" roughness={0.85} />
        </mesh>
        {/* Elbow */}
        <mesh position={[0, -0.37, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#6d8090" roughness={0.85} />
        </mesh>
        {/* Lower arm */}
        <mesh position={[0, -0.56, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.065, 0.3, 8, 16]} />
          <meshStandardMaterial color="#f4c2a0" roughness={0.85} />
        </mesh>
        {/* Hand with fingers */}
        <group ref={rightHandRef} position={[0, -0.78, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.1, 0.12, 0.06]} />
            <meshStandardMaterial color="#f4c2a0" roughness={0.85} />
          </mesh>
          {/* Thumb */}
          <mesh position={[0.06, -0.04, 0.025]} rotation={[0, 0, 0.6]} castShadow>
            <capsuleGeometry args={[0.018, 0.045, 6, 8]} />
            <meshStandardMaterial color="#f4c2a0" roughness={0.85} />
          </mesh>
          {/* Fingers */}
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={`right-f-${i}`}
              position={[-0.04 + i * 0.028, -0.09, 0]}
              rotation={[0, 0, hasObject ? -0.4 : -0.1]}
              castShadow
            >
              <capsuleGeometry args={[0.014, 0.055, 6, 8]} />
              <meshStandardMaterial color="#f4c2a0" roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Left Leg */}
      <group position={[-0.13, 0.42, 0]}>
        <mesh position={[0, -0.32, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.095, 0.42, 8, 16]} />
          <meshStandardMaterial color="#34495e" roughness={0.85} />
        </mesh>
        {/* Knee */}
        <mesh position={[0, -0.56, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.85} />
        </mesh>
        {/* Lower leg */}
        <mesh position={[0, -0.78, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.09, 0.36, 8, 16]} />
          <meshStandardMaterial color="#34495e" roughness={0.85} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -1.02, 0.08]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 0.12, 0.28]} />
          <meshStandardMaterial color="#5d4e37" roughness={0.8} metalness={0.1} />
        </mesh>
        {/* Boot sole */}
        <mesh position={[0, -1.09, 0.08]}>
          <boxGeometry args={[0.17, 0.03, 0.3]} />
          <meshStandardMaterial color="#3d2817" roughness={0.95} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.13, 0.42, 0]}>
        <mesh position={[0, -0.32, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.095, 0.42, 8, 16]} />
          <meshStandardMaterial color="#34495e" roughness={0.85} />
        </mesh>
        {/* Knee */}
        <mesh position={[0, -0.56, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.85} />
        </mesh>
        {/* Lower leg */}
        <mesh position={[0, -0.78, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.09, 0.36, 8, 16]} />
          <meshStandardMaterial color="#34495e" roughness={0.85} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -1.02, 0.08]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 0.12, 0.28]} />
          <meshStandardMaterial color="#5d4e37" roughness={0.8} metalness={0.1} />
        </mesh>
        {/* Boot sole */}
        <mesh position={[0, -1.09, 0.08]}>
          <boxGeometry args={[0.17, 0.03, 0.3]} />
          <meshStandardMaterial color="#3d2817" roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
};
