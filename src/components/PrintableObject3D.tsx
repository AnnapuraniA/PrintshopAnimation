import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PrintableObject3DProps {
  type: "bottle" | "tshirt" | "pillow" | "cup";
  isPrinted: boolean;
  position: [number, number, number];
  scale?: number;
}

export const PrintableObject3D = ({ type, isPrinted, position, scale = 1 }: PrintableObject3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  // Gentle floating and rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
    
    // Glow when printed
    if (glowRef.current && isPrinted) {
      glowRef.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  const renderObject = () => {
    switch (type) {
      case "bottle":
        return (
          <group>
            {/* Bottle body */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.12, 0.15, 0.6, 24]} />
              <meshStandardMaterial 
                color={isPrinted ? "#5fa3d0" : "#e8e8e8"} 
                transparent
                opacity={0.95}
                roughness={0.2}
                metalness={0.3}
                envMapIntensity={1.5}
              />
            </mesh>
            {/* Bottle neck */}
            <mesh position={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 0.15, 16]} />
              <meshStandardMaterial 
                color={isPrinted ? "#5fa3d0" : "#e8e8e8"} 
                transparent
                opacity={0.95}
                roughness={0.2}
                metalness={0.3}
              />
            </mesh>
            {/* Cap */}
            <mesh position={[0, 0.45, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
              <meshStandardMaterial 
                color="#1a1a1a" 
                roughness={0.6}
                metalness={0.4}
              />
            </mesh>
            {/* Label/Design when printed */}
            {isPrinted && (
              <>
                <mesh position={[0, 0, 0.13]}>
                  <boxGeometry args={[0.22, 0.35, 0.01]} />
                  <meshStandardMaterial 
                    color="#d97634" 
                    emissive="#d97634"
                    emissiveIntensity={0.3}
                    roughness={0.7}
                  />
                </mesh>
                {/* Design pattern */}
                <mesh position={[0, 0.1, 0.14]}>
                  <torusGeometry args={[0.06, 0.015, 8, 16]} />
                  <meshStandardMaterial 
                    color="#f4d03f" 
                    emissive="#f4d03f"
                    emissiveIntensity={0.4}
                  />
                </mesh>
              </>
            )}
          </group>
        );

      case "tshirt":
        return (
          <group>
            {/* T-shirt body */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.5, 0.4, 0.12]} />
              <meshStandardMaterial 
                color={isPrinted ? "#d94545" : "#f5f5f5"} 
                roughness={0.9}
                metalness={0.0}
              />
            </mesh>
            {/* Left sleeve */}
            <mesh position={[-0.35, 0.1, 0]} rotation={[0, 0, 0.3]} castShadow>
              <boxGeometry args={[0.25, 0.14, 0.12]} />
              <meshStandardMaterial 
                color={isPrinted ? "#d94545" : "#f5f5f5"} 
                roughness={0.9}
              />
            </mesh>
            {/* Right sleeve */}
            <mesh position={[0.35, 0.1, 0]} rotation={[0, 0, -0.3]} castShadow>
              <boxGeometry args={[0.25, 0.14, 0.12]} />
              <meshStandardMaterial 
                color={isPrinted ? "#d94545" : "#f5f5f5"} 
                roughness={0.9}
              />
            </mesh>
            {/* Collar */}
            <mesh position={[0, 0.22, 0.06]}>
              <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
              <meshStandardMaterial 
                color={isPrinted ? "#a83838" : "#d0d0d0"} 
                roughness={0.9}
              />
            </mesh>
            {/* Design when printed */}
            {isPrinted && (
              <>
                <mesh position={[0, 0, 0.07]}>
                  <circleGeometry args={[0.18, 32]} />
                  <meshStandardMaterial 
                    color="#f4d03f" 
                    emissive="#f4d03f"
                    emissiveIntensity={0.4}
                    roughness={0.8}
                  />
                </mesh>
                <mesh position={[0, 0, 0.08]}>
                  <ringGeometry args={[0.12, 0.15, 32]} />
                  <meshStandardMaterial 
                    color="#ffffff" 
                    emissive="#ffffff"
                    emissiveIntensity={0.3}
                  />
                </mesh>
              </>
            )}
          </group>
        );

      case "pillow":
        return (
          <group>
            {/* Pillow body - soft rounded */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.55, 0.38, 0.18]} />
              <meshStandardMaterial 
                color={isPrinted ? "#6fbf73" : "#fafafa"} 
                roughness={0.95}
                metalness={0.0}
              />
            </mesh>
            {/* Soft edges */}
            {[[-0.25, 0], [0.25, 0], [0, -0.17], [0, 0.17]].map((pos, i) => (
              <mesh key={i} position={[pos[0], pos[1], 0]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial 
                  color={isPrinted ? "#6fbf73" : "#fafafa"} 
                  roughness={0.95}
                />
              </mesh>
            ))}
            {/* Stitching when printed */}
            {isPrinted && (
              <>
                <mesh position={[0, 0.1, 0.1]}>
                  <torusGeometry args={[0.14, 0.02, 12, 24]} />
                  <meshStandardMaterial 
                    color="#d97634" 
                    emissive="#d97634"
                    emissiveIntensity={0.3}
                    roughness={0.8}
                  />
                </mesh>
                <mesh position={[0, 0.1, 0.11]}>
                  <sphereGeometry args={[0.06, 16, 16]} />
                  <meshStandardMaterial 
                    color="#f4d03f" 
                    emissive="#f4d03f"
                    emissiveIntensity={0.4}
                  />
                </mesh>
              </>
            )}
          </group>
        );

      case "cup":
        return (
          <group>
            {/* Cup body */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.13, 0.11, 0.45, 24]} />
              <meshStandardMaterial 
                color={isPrinted ? "#f4d03f" : "#ffffff"} 
                roughness={0.15}
                metalness={0.4}
                envMapIntensity={1.2}
              />
            </mesh>
            {/* Handle */}
            <mesh position={[0.17, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <torusGeometry args={[0.12, 0.025, 12, 24, Math.PI * 1.3]} />
              <meshStandardMaterial 
                color={isPrinted ? "#f4d03f" : "#ffffff"} 
                roughness={0.15}
                metalness={0.4}
              />
            </mesh>
            {/* Rim */}
            <mesh position={[0, 0.23, 0]}>
              <torusGeometry args={[0.13, 0.01, 12, 24]} />
              <meshStandardMaterial 
                color={isPrinted ? "#e0bd30" : "#f0f0f0"} 
                roughness={0.2}
                metalness={0.5}
              />
            </mesh>
            {/* Design when printed */}
            {isPrinted && (
              <>
                <mesh position={[0, 0.05, 0.14]}>
                  <boxGeometry args={[0.2, 0.18, 0.01]} />
                  <meshStandardMaterial 
                    color="#d97634" 
                    emissive="#d97634"
                    emissiveIntensity={0.3}
                    roughness={0.6}
                  />
                </mesh>
                <mesh position={[0, 0.05, 0.15]}>
                  <torusGeometry args={[0.05, 0.01, 8, 16]} />
                  <meshStandardMaterial 
                    color="#5fa3d0" 
                    emissive="#5fa3d0"
                    emissiveIntensity={0.4}
                  />
                </mesh>
              </>
            )}
          </group>
        );
    }
  };

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {renderObject()}
      {/* Glow effect when printed */}
      {isPrinted && (
        <pointLight 
          ref={glowRef}
          position={[0, 0, 0]} 
          color="#f4d03f" 
          intensity={0.5} 
          distance={1.5}
        />
      )}
    </group>
  );
};
