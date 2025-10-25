import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Volume2, VolumeX } from "lucide-react";
import { Client3D } from "./Client3D";
import { Craftsman3D } from "./Craftsman3D";
import { PrintingMachine3D } from "./PrintingMachine3D";
import { PrintableObject3D } from "./PrintableObject3D";
import { PrintingParticles } from "./PrintingParticles";
import { WorkshopEnvironment } from "./WorkshopEnvironment";
import { Footer } from "./Footer";
import { soundManager } from "@/utils/soundEffects";

type ItemType = "bottle" | "tshirt" | "pillow" | "cup";
type ScenePhase = 
  | "client-entering" 
  | "client-to-craftsman" 
  | "craftsman-to-machine" 
  | "printing" 
  | "machine-to-craftsman" 
  | "craftsman-to-client" 
  | "client-leaving";

const items: ItemType[] = ["bottle", "tshirt", "pillow", "cup"];

export const PrintingScene = () => {
  const [phase, setPhase] = useState<ScenePhase>("client-entering");
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [objectPosition, setObjectPosition] = useState<[number, number, number]>([-6, 0.35, 0.5]);
  const [isPrinted, setIsPrinted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const currentItem = items[currentItemIndex];

  // Handle mute toggle
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    soundManager.setMuted(newMutedState);
  };

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Play sounds based on phase changes
  useEffect(() => {
    switch (phase) {
      case "client-entering":
        // Footsteps while walking in
        const enterInterval = setInterval(() => {
          soundManager.playFootstep();
        }, 300);
        setTimeout(() => clearInterval(enterInterval), 1400);
        break;
      
      case "client-to-craftsman":
        soundManager.playWhoosh();
        setTimeout(() => soundManager.playClick(), 800);
        break;
      
      case "craftsman-to-machine":
        soundManager.playWhoosh();
        break;
      
      case "printing":
        soundManager.playPrinting(3);
        break;
      
      case "machine-to-craftsman":
        soundManager.playWhoosh();
        break;
      
      case "craftsman-to-client":
        soundManager.playWhoosh();
        setTimeout(() => {
          soundManager.playClick();
          soundManager.playSuccess();
        }, 800);
        break;
      
      case "client-leaving":
        // Footsteps while walking out
        const exitInterval = setInterval(() => {
          soundManager.playFootstep();
        }, 300);
        setTimeout(() => clearInterval(exitInterval), 1400);
        break;
    }
  }, [phase]);

  useEffect(() => {
    const timings: Record<ScenePhase, number> = {
      "client-entering": 1500,
      "client-to-craftsman": 1000,
      "craftsman-to-machine": 1200,
      "printing": 3000,
      "machine-to-craftsman": 1200,
      "craftsman-to-client": 1000,
      "client-leaving": 1500,
    };

    const timer = setTimeout(() => {
      switch (phase) {
        case "client-entering":
          setPhase("client-to-craftsman");
          break;
        case "client-to-craftsman":
          setPhase("craftsman-to-machine");
          break;
        case "craftsman-to-machine":
          setPhase("printing");
          break;
        case "printing":
          setIsPrinted(true);
          setPhase("machine-to-craftsman");
          break;
        case "machine-to-craftsman":
          setPhase("craftsman-to-client");
          break;
        case "craftsman-to-client":
          setPhase("client-leaving");
          break;
        case "client-leaving":
          const nextIndex = (currentItemIndex + 1) % items.length;
          setCurrentItemIndex(nextIndex);
          setIsPrinted(false);
          setClientX(-6);
          setObjectPosition([-6, 0.35, 0.5]);
          setPhase("client-entering");
          break;
      }
    }, timings[phase]);

    return () => clearTimeout(timer);
  }, [phase, currentItemIndex, currentItem]);

  // Track client position for object following
  const [clientX, setClientX] = useState(-6);

  // Animate object position based on phase
  useEffect(() => {
    const animateObject = setInterval(() => {
      switch (phase) {
        case "client-entering":
          setObjectPosition([clientX, 0.35, 0.5]);
          break;
        case "client-to-craftsman":
          setObjectPosition(prev => [
            prev[0] + (0 - prev[0]) * 0.1,
            prev[1] + (0.3 - prev[1]) * 0.1,
            prev[2] + (0.6 - prev[2]) * 0.1
          ]);
          break;
        case "craftsman-to-machine":
          setObjectPosition(prev => [
            prev[0] + (3 - prev[0]) * 0.08,
            prev[1] + (1.0 - prev[1]) * 0.08,
            prev[2] + (0.5 - prev[2]) * 0.08
          ]);
          break;
        case "printing":
          setObjectPosition([3, 1.0, 0.5]);
          break;
        case "machine-to-craftsman":
          setObjectPosition(prev => [
            prev[0] + (0 - prev[0]) * 0.08,
            prev[1] + (0.3 - prev[1]) * 0.08,
            prev[2] + (0.6 - prev[2]) * 0.08
          ]);
          break;
        case "craftsman-to-client":
          setObjectPosition(prev => [
            prev[0] + (clientX - prev[0]) * 0.1,
            prev[1] + (0.35 - prev[1]) * 0.1,
            prev[2] + (0.5 - prev[2]) * 0.1
          ]);
          break;
        case "client-leaving":
          setObjectPosition([clientX, 0.35, 0.5]);
          break;
      }
    }, 16);

    return () => clearInterval(animateObject);
  }, [phase, clientX]);

  // Update client X position
  useEffect(() => {
    const updateClientPosition = setInterval(() => {
      if (phase === "client-entering") {
        setClientX(prev => prev + (-3 - prev) * 0.05);
      } else if (phase === "client-leaving") {
        setClientX(prev => prev + (-6 - prev) * 0.05);
      } else {
        setClientX(-3);
      }
    }, 16);

    return () => clearInterval(updateClientPosition);
  }, [phase]);

  const isClientVisible = [
    "client-entering",
    "client-to-craftsman",
    "craftsman-to-machine",
    "printing",
    "machine-to-craftsman",
    "craftsman-to-client",
    "client-leaving"
  ].includes(phase);
  
  const clientHasObject = [
    "client-entering",
    "craftsman-to-client",
    "client-leaving"
  ].includes(phase);
  
  const craftsmanHasObject = [
    "client-to-craftsman",
    "craftsman-to-machine",
    "machine-to-craftsman",
    "craftsman-to-client"
  ].includes(phase);
  
  const isClientHappy = ["craftsman-to-client", "client-leaving"].includes(phase);
  const isMachineActive = phase === "printing";
  const isCraftsmanWorking = phase === "printing";
  
  const showObject = phase !== "client-entering";

  // Different shirt colors for different objects
  const getShirtColor = (item: ItemType): string => {
    switch (item) {
      case "bottle":
        return "#5fa3d0"; // Blue
      case "tshirt":
        return "#d94545"; // Red
      case "pillow":
        return "#6fbf73"; // Green
      case "cup":
        return "#f4a742"; // Orange
      default:
        return "#5fa3d0";
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[hsl(28,30%,18%)] to-[hsl(28,35%,15%)]">
      {/* Main container for animation */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Subtle animated background glow */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div 
            className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, hsl(25 85% 58% / 0.3) 0%, transparent 70%)",
              animation: "pulse 4s ease-in-out infinite"
            }}
          />
          <div 
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, hsl(45 95% 60% / 0.2) 0%, transparent 70%)",
              animation: "pulse 5s ease-in-out infinite 1s"
            }}
          />
        </div>
        {/* 3D Canvas */}
        <Canvas 
          shadows 
          className="w-full h-full"
          gl={{ 
            antialias: true,
            powerPreference: isMobile ? "low-power" : "high-performance"
          }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
        >
          <PerspectiveCamera 
            makeDefault 
            position={isMobile ? [0, 2.5, 10] : [0, 2, 8]} 
            fov={isMobile ? 60 : 50} 
          />
          <OrbitControls 
            enableZoom={!isMobile}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            minDistance={5}
            maxDistance={15}
            enableDamping
            dampingFactor={0.05}
          />

          {/* Fog for depth */}
          <fog attach="fog" args={['#2d251e', 5, 20]} />

          {/* Enhanced Lighting System */}
          <ambientLight intensity={0.8} color="#ffffff" />
          
          {/* Key light - main illumination */}
          <directionalLight 
            position={[8, 10, 5]} 
            intensity={1.5} 
            castShadow
            shadow-mapSize-width={isMobile ? 1024 : 2048}
            shadow-mapSize-height={isMobile ? 1024 : 2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            color="#ffffff"
          />
          
          {/* Fill light - softer, from opposite */}
          <directionalLight 
            position={[-5, 8, -3]} 
            intensity={0.6} 
            color="#ffa85c"
          />
          
          {/* Rim light - for character separation */}
          <directionalLight 
            position={[0, 3, -8]} 
            intensity={0.4} 
            color="#ff8c42"
          />
          
          {/* Spotlight on machine during printing */}
          {isMachineActive && (
            <spotLight 
              position={[3, 4, 2]} 
              intensity={1.5} 
              angle={0.5}
              penumbra={0.5}
              castShadow
              color="#f4d03f"
              target-position={[3, 1, 0.5]}
            />
          )}

          {/* Test: Simple box inside React Three Fiber */}
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="hotpink" />
          </mesh>

          {/* Workshop Environment - Disabled for testing */}
          {/* <WorkshopEnvironment /> */}

          {/* Characters - Disabled for testing */}
          {/* {isClientVisible && (
            <Client3D
              item={currentItem}
              position={
                phase === "client-entering" 
                  ? "entering" 
                  : phase === "client-leaving" 
                  ? "exiting" 
                  : clientHasObject
                  ? "waiting"
                  : "handed-off"
              }
              isHappy={isClientHappy}
              hasObject={clientHasObject}
              shirtColor={getShirtColor(currentItem)}
            />
          )}
          
          <Craftsman3D 
            isWorking={isCraftsmanWorking} 
            hasObject={craftsmanHasObject}
          />
          
          <PrintingMachine3D isActive={isMachineActive} />

          {/* Printable Object */}
          {/* {showObject && (
            <PrintableObject3D
              type={currentItem}
              isPrinted={isPrinted}
              position={objectPosition}
              scale={0.8}
            />
          )} */}

          {/* Printing Particles - Disabled for testing */}
          {/* <PrintingParticles 
            active={isMachineActive} 
            position={[3, 1.0, 0.5]} 
          /> */}
        </Canvas>

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
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Footer />
      </div>
    </div>
  );
};
