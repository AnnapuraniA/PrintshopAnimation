import * as THREE from "three";

export const WorkshopEnvironment = () => {
  return (
    <group>
      {/* Enhanced Floor with wood texture effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]} receiveShadow>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial 
          color="#4a3f35"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Floor planks pattern */}
      {[-4, -2, 0, 2, 4].map((z, i) => (
        <mesh key={`plank-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.24, z]} receiveShadow>
          <planeGeometry args={[25, 1.8]} />
          <meshStandardMaterial 
            color="#3d3228"
            roughness={0.95}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}

      {/* Back Wall */}
      <mesh position={[0, 2, -8]} receiveShadow>
        <boxGeometry args={[25, 8, 0.2]} />
        <meshStandardMaterial 
          color="#2d2620"
          roughness={0.95}
        />
      </mesh>

      {/* Shelves on back wall */}
      {[0.5, 1.5, 2.5].map((y, i) => (
        <group key={`shelf-${i}`}>
          <mesh position={[0, y, -7.8]} castShadow receiveShadow>
            <boxGeometry args={[8, 0.05, 0.4]} />
            <meshStandardMaterial 
              color="#5d4e37"
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
          {/* Sample products on shelves */}
          {[-2, -1, 0, 1, 2].map((x, j) => (
            <mesh key={`item-${i}-${j}`} position={[x * 1.5, y + 0.15, -7.7]} castShadow>
              <boxGeometry args={[0.15, 0.2, 0.15]} />
              <meshStandardMaterial 
                color={['#d97634', '#5fa3d0', '#6fbf73', '#f4d03f'][j % 4]}
                emissive={['#d97634', '#5fa3d0', '#6fbf73', '#f4d03f'][j % 4]}
                emissiveIntensity={0.1}
                roughness={0.7}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Work table/counter in background */}
      <group position={[-5, 0, -5]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.05, 1]} />
          <meshStandardMaterial color="#5d4e37" roughness={0.8} />
        </mesh>
        {/* Table legs */}
        {[[-0.9, -0.4], [0.9, -0.4], [-0.9, 0.4], [0.9, 0.4]].map((pos, i) => (
          <mesh key={`leg-${i}`} position={[pos[0], 0, pos[1]]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.8]} />
            <meshStandardMaterial color="#3d2817" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Tool rack */}
      <group position={[6, 1.5, -6]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.1, 1.5, 0.8]} />
          <meshStandardMaterial color="#3d2817" roughness={0.9} />
        </mesh>
        {/* Tools hanging */}
        {[0, 1, 2].map((i) => (
          <mesh key={`tool-${i}`} position={[0.1, 0.3 - i * 0.4, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.4]} />
            <meshStandardMaterial 
              color="#7a7a7a" 
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Storage boxes/crates */}
      <group position={[7, 0, 3]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.5, 0.8]} />
          <meshStandardMaterial color="#6d5d4b" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.5, 0.7]} />
          <meshStandardMaterial color="#7c6d5a" roughness={0.95} />
        </mesh>
      </group>

      {/* Hanging lamp above center */}
      <group position={[0, 3.5, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.5]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.8, 0]} castShadow>
          <coneGeometry args={[0.3, 0.4, 16, 1, true]} />
          <meshStandardMaterial 
            color="#d97634"
            emissive="#d97634"
            emissiveIntensity={0.2}
            roughness={0.6}
            metalness={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
        <pointLight position={[0, -1, 0]} color="#ffa85c" intensity={0.5} distance={5} castShadow />
      </group>

      {/* Side lamps */}
      {[-4, 4].map((x, i) => (
        <group key={`lamp-${i}`} position={[x, 2.5, -6]}>
          <mesh castShadow>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial 
              color="#ffd4a3"
              emissive="#ffa85c"
              emissiveIntensity={0.5}
              transparent
              opacity={0.9}
            />
          </mesh>
          <pointLight position={[0, 0, 0]} color="#ffa85c" intensity={0.4} distance={4} />
        </group>
      ))}

      {/* Decorative posters/signs on wall */}
      {[-3, 3].map((x, i) => (
        <mesh key={`poster-${i}`} position={[x, 2.5, -7.85]} castShadow>
          <boxGeometry args={[0.8, 1, 0.02]} />
          <meshStandardMaterial 
            color={i === 0 ? "#d97634" : "#5fa3d0"}
            emissive={i === 0 ? "#d97634" : "#5fa3d0"}
            emissiveIntensity={0.1}
            roughness={0.7}
          />
        </mesh>
      ))}

      {/* Atmospheric dust particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={new Float32Array(Array.from({ length: 300 }, () => (Math.random() - 0.5) * 20))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#d4c5b9"
          transparent
          opacity={0.3}
          sizeAttenuation
        />
      </points>

      {/* Ambient workshop glow - warm atmosphere */}
      <ambientLight intensity={0.3} color="#ffa85c" />
    </group>
  );
};

