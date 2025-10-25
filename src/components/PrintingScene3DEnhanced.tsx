import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Volume2, VolumeX } from "lucide-react";
import { Footer } from "./Footer";
import { soundManager } from "@/utils/soundEffects";

type ItemType = "bottle" | "tshirt" | "pillow" | "cup";

export const PrintingScene3DEnhanced = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    soundManager.setMuted(newMutedState);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
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

    // Renderer - dynamically calculate available space
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const getAvailableHeight = () => {
      // Get actual container height instead of calculating
      return containerRef.current?.clientHeight || window.innerHeight - 200;
    };
    renderer.setSize(window.innerWidth, getAvailableHeight());
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(8, 10, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = isMobile ? 1024 : 2048;
    keyLight.shadow.mapSize.height = isMobile ? 1024 : 2048;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffa85c, 0.6);
    fillLight.position.set(-5, 8, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff8c42, 0.4);
    rimLight.position.set(0, 3, -8);
    scene.add(rimLight);

    // Spotlight for printing (initially off)
    const printSpotlight = new THREE.SpotLight(0xf4d03f, 0, 10, Math.PI / 6, 0.5);
    printSpotlight.position.set(3, 4, 2);
    printSpotlight.target.position.set(3, 1, 0.5);
    printSpotlight.castShadow = true;
    scene.add(printSpotlight);
    scene.add(printSpotlight.target);

    // === WORKSHOP ENVIRONMENT ===
    
    // Floor (wooden planks look)
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x5a4a35, // Warmer wood color
      roughness: 0.9,
      metalness: 0.0,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Floor planks detail (lines to simulate wood planks)
    for (let i = -10; i <= 10; i += 2) {
      const plankLineGeometry = new THREE.PlaneGeometry(0.05, 20);
      const plankLineMaterial = new THREE.MeshBasicMaterial({ color: 0x4a3a25, transparent: true, opacity: 0.3 });
      const plankLine = new THREE.Mesh(plankLineGeometry, plankLineMaterial);
      plankLine.rotation.x = -Math.PI / 2;
      plankLine.position.set(i, 0.01, 0);
      scene.add(plankLine);
    }

    // Back Wall (brick texture look)
    const wallGeometry = new THREE.BoxGeometry(20, 5, 0.3);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x6b5d52, // Lighter brown for contrast
      roughness: 1.0,
    });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(0, 2.5, -5);
    wall.receiveShadow = true;
    scene.add(wall);

    // Wall shelves with items
    for (let i = 0; i < 3; i++) {
      const shelfGroup = new THREE.Group();
      
      // Shelf board
      const shelfGeometry = new THREE.BoxGeometry(2, 0.05, 0.3);
      const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.8 });
      const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
      shelfGroup.add(shelf);

      // Items on shelf (small boxes)
      for (let j = 0; j < 3; j++) {
        const boxGeometry = new THREE.BoxGeometry(0.3, 0.25, 0.2);
        const boxMaterial = new THREE.MeshStandardMaterial({ 
          color: [0x8b4513, 0x654321, 0xa0522d][j],
          roughness: 0.7,
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(-0.7 + j * 0.7, 0.15, 0);
        box.castShadow = true;
        shelfGroup.add(box);
      }

      shelfGroup.position.set(-3 + i * 3, 2 + i * 0.8, -4.85);
      scene.add(shelfGroup);
    }

    // Tool rack on wall
    const toolRackGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.05);
    const toolRackMaterial = new THREE.MeshStandardMaterial({ color: 0x3a3a3a });
    const toolRack = new THREE.Mesh(toolRackGeometry, toolRackMaterial);
    toolRack.position.set(3.5, 2, -4.9);
    scene.add(toolRack);

    // Tools hanging on rack
    const toolColors = [0xff4444, 0x4444ff, 0x44ff44];
    for (let i = 0; i < 3; i++) {
      const toolGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.4);
      const toolMaterial = new THREE.MeshStandardMaterial({ color: toolColors[i], metalness: 0.7 });
      const tool = new THREE.Mesh(toolGeometry, toolMaterial);
      tool.position.set(3 + i * 0.5, 1.7, -4.88);
      tool.castShadow = true;
      scene.add(tool);
    }

    // Hanging Lamps
    for (let i = -1; i <= 1; i++) {
      const lampGroup = new THREE.Group();
      
      // Lamp cord
      const cordGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5);
      const cordMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
      const cord = new THREE.Mesh(cordGeometry, cordMaterial);
      cord.position.y = 3.25;
      lampGroup.add(cord);

      // Lamp shade
      const shadeGeometry = new THREE.ConeGeometry(0.3, 0.4, 16, 1, true);
      const shadeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a,
        side: THREE.DoubleSide,
      });
      const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
      shade.position.y = 2.3;
      lampGroup.add(shade);

      // Point light
      const lampLight = new THREE.PointLight(0xffcc88, 0.5, 5);
      lampLight.position.y = 2.2;
      lampGroup.add(lampLight);

      lampGroup.position.x = i * 3;
      scene.add(lampGroup);
    }

    // Work Table
    const tableGroup = new THREE.Group();
    const tableTopGeometry = new THREE.BoxGeometry(2, 0.1, 1);
    const tableTopMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x5a4a3a,
      roughness: 0.7,
    });
    const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
    tableTop.position.y = 0.8;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    // Table legs
    const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x3a2a1a });
    const positions = [[-0.9, 0.4, -0.4], [-0.9, 0.4, 0.4], [0.9, 0.4, -0.4], [0.9, 0.4, 0.4]];
    positions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(...pos);
      leg.castShadow = true;
      tableGroup.add(leg);
    });

    tableGroup.position.set(-4, 0, -3);
    scene.add(tableGroup);

    // === DETAILED CUSTOMER CHARACTER ===
    
    const customerGroup = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
    const customerShirtMaterial = new THREE.MeshStandardMaterial({ color: 0x4a90e2 });
    const body = new THREE.Mesh(bodyGeometry, customerShirtMaterial);
    body.position.y = 1.2;
    body.castShadow = true;
    customerGroup.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, skinMaterial);
    head.position.y = 1.9;
    head.castShadow = true;
    customerGroup.add(head);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.08, 1.95, 0.2);
    customerGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.08, 1.95, 0.2);
    customerGroup.add(rightEye);

    // Nose
    const noseGeometry = new THREE.ConeGeometry(0.03, 0.08, 8);
    const nose = new THREE.Mesh(noseGeometry, skinMaterial);
    nose.position.set(0, 1.88, 0.23);
    nose.rotation.x = Math.PI / 2;
    customerGroup.add(nose);

    // Smile (initially hidden)
    const smileCurve = new THREE.EllipseCurve(0, 0, 0.12, 0.06, 0, Math.PI, false, 0);
    const smilePoints = smileCurve.getPoints(20);
    const smileGeometry = new THREE.BufferGeometry().setFromPoints(smilePoints);
    const smileMaterial = new THREE.LineBasicMaterial({ 
      color: 0xff6b6b,
      linewidth: 2,
    });
    const smile = new THREE.Line(smileGeometry, smileMaterial);
    smile.position.set(0, 1.82, 0.24);
    smile.rotation.x = Math.PI;
    smile.visible = false;
    customerGroup.add(smile);

    // Hair
    const hairGeometry = new THREE.SphereGeometry(0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x3a2a1a });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.y = 2.05;
    customerGroup.add(hair);

    // Arms (single unified arm with hand at end)
    const armGeometry = new THREE.CapsuleGeometry(0.08, 0.6, 4, 8);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.38, 1.0, 0);
    leftArm.rotation.z = Math.PI / 8;
    leftArm.castShadow = true;
    customerGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.38, 1.0, 0);
    rightArm.rotation.z = -Math.PI / 8;
    rightArm.castShadow = true;
    customerGroup.add(rightArm);

    // Legs
    const legGeometry2 = new THREE.CylinderGeometry(0.12, 0.12, 0.7);
    const pantsMaterial = new THREE.MeshStandardMaterial({ color: 0x2c2c2c });
    
    const leftLeg = new THREE.Mesh(legGeometry2, pantsMaterial);
    leftLeg.position.set(-0.15, 0.35, 0);
    leftLeg.castShadow = true;
    customerGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry2, pantsMaterial);
    rightLeg.position.set(0.15, 0.35, 0);
    rightLeg.castShadow = true;
    customerGroup.add(rightLeg);

    customerGroup.position.set(-6, 0, 0);
    scene.add(customerGroup);

    // === DETAILED CRAFTSMAN CHARACTER ===
    
    const craftsmanGroup = new THREE.Group();
    
    // Body with apron
    const craftsmanBodyGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
    const craftsmanShirtMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const craftsmanBody = new THREE.Mesh(craftsmanBodyGeometry, craftsmanShirtMaterial);
    craftsmanBody.position.y = 1.2;
    craftsmanBody.castShadow = true;
    craftsmanGroup.add(craftsmanBody);

    // Apron (more defined with straps and pocket)
    const apronGeometry = new THREE.PlaneGeometry(0.5, 0.7);
    const apronMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xe8e8e8,
      roughness: 0.7,
      side: THREE.DoubleSide,
    });
    const apron = new THREE.Mesh(apronGeometry, apronMaterial);
    apron.position.set(0, 1.1, 0.31);
    apron.castShadow = true;
    craftsmanGroup.add(apron);

    // Apron pocket
    const pocketGeometry = new THREE.PlaneGeometry(0.25, 0.15);
    const pocketMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc,
      roughness: 0.8,
    });
    const pocket = new THREE.Mesh(pocketGeometry, pocketMaterial);
    pocket.position.set(0, 0.85, 0.32);
    craftsmanGroup.add(pocket);

    // Apron straps
    const strapGeometry = new THREE.BoxGeometry(0.05, 0.4, 0.02);
    const strapMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    
    const leftStrap = new THREE.Mesh(strapGeometry, strapMaterial);
    leftStrap.position.set(-0.15, 1.55, 0.3);
    leftStrap.rotation.z = -0.1;
    craftsmanGroup.add(leftStrap);

    const rightStrap = new THREE.Mesh(strapGeometry, strapMaterial);
    rightStrap.position.set(0.15, 1.55, 0.3);
    rightStrap.rotation.z = 0.1;
    craftsmanGroup.add(rightStrap);

    // Head
    const craftsmanHead = new THREE.Mesh(headGeometry, skinMaterial);
    craftsmanHead.position.y = 1.9;
    craftsmanHead.castShadow = true;
    craftsmanGroup.add(craftsmanHead);

    // Cap
    const capGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.15, 16);
    const capMaterial = new THREE.MeshStandardMaterial({ color: 0x2c5f8d });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 2.12;
    craftsmanGroup.add(cap);

    const visorGeometry = new THREE.BoxGeometry(0.35, 0.02, 0.2);
    const visor = new THREE.Mesh(visorGeometry, capMaterial);
    visor.position.set(0, 2.05, 0.22);
    craftsmanGroup.add(visor);

    // Eyes
    const craftsmanLeftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    craftsmanLeftEye.position.set(-0.08, 1.95, 0.2);
    craftsmanGroup.add(craftsmanLeftEye);

    const craftsmanRightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    craftsmanRightEye.position.set(0.08, 1.95, 0.2);
    craftsmanGroup.add(craftsmanRightEye);

    // Mustache
    const mustacheGeometry = new THREE.BoxGeometry(0.2, 0.03, 0.05);
    const mustacheMaterial = new THREE.MeshStandardMaterial({ color: 0x3a2a1a });
    const mustache = new THREE.Mesh(mustacheGeometry, mustacheMaterial);
    mustache.position.set(0, 1.85, 0.23);
    craftsmanGroup.add(mustache);

    // Arms (unified with hands at end)
    const craftsmanLeftArm = new THREE.Mesh(armGeometry, armMaterial);
    craftsmanLeftArm.position.set(-0.38, 1.0, 0);
    craftsmanLeftArm.rotation.z = Math.PI / 8;
    craftsmanLeftArm.castShadow = true;
    craftsmanGroup.add(craftsmanLeftArm);

    const craftsmanRightArm = new THREE.Mesh(armGeometry, armMaterial);
    craftsmanRightArm.position.set(0.38, 1.0, 0);
    craftsmanRightArm.rotation.z = -Math.PI / 8;
    craftsmanRightArm.castShadow = true;
    craftsmanGroup.add(craftsmanRightArm);

    // Legs
    const craftsmanLeftLeg = new THREE.Mesh(legGeometry2, pantsMaterial);
    craftsmanLeftLeg.position.set(-0.15, 0.35, 0);
    craftsmanLeftLeg.castShadow = true;
    craftsmanGroup.add(craftsmanLeftLeg);

    const craftsmanRightLeg = new THREE.Mesh(legGeometry2, pantsMaterial);
    craftsmanRightLeg.position.set(0.15, 0.35, 0);
    craftsmanRightLeg.castShadow = true;
    craftsmanGroup.add(craftsmanRightLeg);

    craftsmanGroup.position.set(0, 0, 0);
    scene.add(craftsmanGroup);

    // === PRINTING MACHINE ===
    
    const machineGroup = new THREE.Group();
    
    // Machine body
    const machineBodyGeometry = new THREE.BoxGeometry(1.2, 1.5, 0.8);
    const machineMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x555555,
      metalness: 0.7,
      roughness: 0.3,
    });
    const machineBody = new THREE.Mesh(machineBodyGeometry, machineMaterial);
    machineBody.position.y = 0.75;
    machineBody.castShadow = true;
    machineGroup.add(machineBody);

    // Screen
    const screenGeometry = new THREE.PlaneGeometry(0.6, 0.4);
    const screenMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 0.3,
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1.2, 0.41);
    machineGroup.add(screen);

    // Control buttons
    for (let i = 0; i < 3; i++) {
      const buttonGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16);
      const buttonMaterial = new THREE.MeshStandardMaterial({ 
        color: i === 0 ? 0xff0000 : i === 1 ? 0x00ff00 : 0x0000ff,
        emissive: i === 0 ? 0xff0000 : i === 1 ? 0x00ff00 : 0x0000ff,
        emissiveIntensity: 0.5,
      });
      const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
      button.position.set(-0.2 + i * 0.2, 0.85, 0.41);
      button.rotation.x = Math.PI / 2;
      machineGroup.add(button);
    }

    // Print rollers
    const rollerGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
    const rollerMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      metalness: 0.8,
    });
    const topRoller = new THREE.Mesh(rollerGeometry, rollerMaterial);
    topRoller.position.set(0, 1.0, 0);
    topRoller.rotation.z = Math.PI / 2;
    machineGroup.add(topRoller);

    machineGroup.position.set(3, 0, 0);
    scene.add(machineGroup);

    // === PRINTABLE OBJECTS (Multiple Types) ===
    
    const objectsData: Record<ItemType, THREE.Group> = {
      bottle: new THREE.Group(),
      tshirt: new THREE.Group(),
      pillow: new THREE.Group(),
      cup: new THREE.Group(),
    };

    // Bottle (more detailed with label)
    const bottleBodyGeometry = new THREE.CylinderGeometry(0.15, 0.18, 0.5, 20);
    const bottleNeckGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.15, 16);
    const bottleCapGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.05, 16);
    
    const bottleMaterial = new THREE.MeshPhysicalMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.3, // Glass-like
      thickness: 0.5,
    });
    const bottleCapMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      roughness: 0.4,
      metalness: 0.6,
    });
    
    const bottleBody = new THREE.Mesh(bottleBodyGeometry, bottleMaterial);
    bottleBody.position.y = 0.25;
    bottleBody.castShadow = true;
    objectsData.bottle.add(bottleBody);
    
    // Bottle label (plain band)
    const labelGeometry = new THREE.CylinderGeometry(0.16, 0.17, 0.25, 20);
    const labelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf0f0f0,
      roughness: 0.9,
    });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.y = 0.25;
    objectsData.bottle.add(label);
    
    const bottleNeck = new THREE.Mesh(bottleNeckGeometry, bottleMaterial);
    bottleNeck.position.y = 0.58;
    objectsData.bottle.add(bottleNeck);
    
    const bottleCap = new THREE.Mesh(bottleCapGeometry, bottleCapMaterial);
    bottleCap.position.y = 0.68;
    objectsData.bottle.add(bottleCap);

    // T-shirt (more defined with collar)
    const tshirtBodyGeometry = new THREE.BoxGeometry(0.5, 0.4, 0.12);
    const tshirtSleeveGeometry = new THREE.BoxGeometry(0.15, 0.25, 0.12);
    const tshirtCollarGeometry = new THREE.TorusGeometry(0.08, 0.02, 8, 16, Math.PI);
    
    const tshirtMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      roughness: 0.9,
    });
    
    const tshirtBody = new THREE.Mesh(tshirtBodyGeometry, tshirtMaterial);
    tshirtBody.position.y = 0.35;
    tshirtBody.castShadow = true;
    objectsData.tshirt.add(tshirtBody);
    
    // Collar
    const collar = new THREE.Mesh(tshirtCollarGeometry, tshirtMaterial);
    collar.position.set(0, 0.54, 0.06);
    collar.rotation.x = Math.PI / 2;
    objectsData.tshirt.add(collar);
    
    const leftSleeve = new THREE.Mesh(tshirtSleeveGeometry, tshirtMaterial);
    leftSleeve.position.set(-0.325, 0.425, 0);
    leftSleeve.castShadow = true;
    objectsData.tshirt.add(leftSleeve);
    
    const rightSleeve = new THREE.Mesh(tshirtSleeveGeometry, tshirtMaterial);
    rightSleeve.position.set(0.325, 0.425, 0);
    rightSleeve.castShadow = true;
    objectsData.tshirt.add(rightSleeve);

    // Bottom hem detail
    const hemGeometry = new THREE.BoxGeometry(0.52, 0.03, 0.12);
    const hem = new THREE.Mesh(hemGeometry, new THREE.MeshStandardMaterial({ color: 0xeeeeee }));
    hem.position.y = 0.16;
    objectsData.tshirt.add(hem);

    // Pillow (more defined with seams)
    const pillowGeometry = new THREE.BoxGeometry(0.5, 0.15, 0.4);
    const pillowMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      roughness: 1.0,
    });
    const pillow = new THREE.Mesh(pillowGeometry, pillowMaterial);
    pillow.position.y = 0.3;
    pillow.castShadow = true;
    // Make pillow slightly curved/soft looking
    pillow.scale.set(1, 0.8, 1);
    objectsData.pillow.add(pillow);

    // Pillow seam lines
    const seamGeometry = new THREE.PlaneGeometry(0.52, 0.02);
    const seamMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd, transparent: true, opacity: 0.5 });
    const seamTop = new THREE.Mesh(seamGeometry, seamMaterial);
    seamTop.position.set(0, 0.38, 0);
    seamTop.rotation.x = -Math.PI / 2;
    objectsData.pillow.add(seamTop);

    const seamBottom = new THREE.Mesh(seamGeometry, seamMaterial);
    seamBottom.position.set(0, 0.22, 0);
    seamBottom.rotation.x = -Math.PI / 2;
    objectsData.pillow.add(seamBottom);

    // Cup (more detailed with rim and base)
    const cupGeometry = new THREE.CylinderGeometry(0.13, 0.1, 0.35, 20);
    const cupHandleGeometry = new THREE.TorusGeometry(0.08, 0.025, 10, 16, Math.PI);
    const cupRimGeometry = new THREE.TorusGeometry(0.13, 0.02, 8, 20);
    
    const cupMaterial = new THREE.MeshPhysicalMaterial({ 
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 0.5, // Shiny ceramic look
      clearcoatRoughness: 0.3,
    });
    
    const cupBody = new THREE.Mesh(cupGeometry, cupMaterial);
    cupBody.position.y = 0.25;
    cupBody.castShadow = true;
    objectsData.cup.add(cupBody);

    // Cup rim
    const cupRim = new THREE.Mesh(cupRimGeometry, cupMaterial);
    cupRim.position.y = 0.43;
    cupRim.rotation.x = Math.PI / 2;
    objectsData.cup.add(cupRim);
    
    const cupHandle = new THREE.Mesh(cupHandleGeometry, cupMaterial);
    cupHandle.position.set(0.14, 0.25, 0);
    cupHandle.rotation.y = -Math.PI / 2;
    cupHandle.castShadow = true;
    objectsData.cup.add(cupHandle);

    // Cup base
    const baseGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.03, 20);
    const base = new THREE.Mesh(baseGeometry, cupMaterial);
    base.position.y = 0.09;
    objectsData.cup.add(base);

    // Add all objects to scene (initially hidden)
    Object.values(objectsData).forEach(obj => {
      obj.position.set(-6, 0.7, 0.5);
      obj.visible = false;
      scene.add(obj);
    });

    // === PRINTING PARTICLES ===
    
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
      particlePositions[i] = (Math.random() - 0.5) * 2;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xf4d03f,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.position.set(3, 1.0, 0.5);
    particles.visible = false;
    scene.add(particles);

    // === ANIMATION STATE ===
    
    const items: ItemType[] = ["bottle", "tshirt", "pillow", "cup"];
    let currentItemIndex = 0;
    let currentItem: ItemType = items[0];
    let phase = 'idle';
    let phaseTime = 0;
    let customerVisible = false;
    let objectVisible = false;
    let customerX = -6;
    let objectX = -6;
    let objectY = 0.7;
    let isHappy = false;
    let isPrinted = false;

    // Shirt colors based on item
    const shirtColors: Record<ItemType, number> = {
      bottle: 0x4a90e2,
      tshirt: 0xe74c3c,
      pillow: 0x9b59b6,
      cup: 0x27ae60,
    };

    // Printed colors
    const printedColors: Record<ItemType, number> = {
      bottle: 0xff6b6b,
      tshirt: 0x3498db,
      pillow: 0xf39c12,
      cup: 0xe91e63,
    };

    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      phaseTime += delta;

      // Phase management
      if (phase === 'idle' && phaseTime > 1) {
        phase = 'customer-entering';
        phaseTime = 0;
        customerVisible = true;
        objectVisible = true;
        customerX = -6;
        objectX = -6;
        isPrinted = false;
        isHappy = false;
        smile.visible = false;
        
        // Set shirt color based on current item
        customerShirtMaterial.color.setHex(shirtColors[currentItem]);
        
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
        objectY = 1.0;
        particles.visible = true;
        printSpotlight.intensity = 1.5;
        soundManager.playPrinting(2);
      } else if (phase === 'printing' && phaseTime > 2) {
        phase = 'printed';
        phaseTime = 0;
        isPrinted = true;
        particles.visible = false;
        printSpotlight.intensity = 0;
        
        // Change object colors
        Object.entries(objectsData).forEach(([type, obj]) => {
          if (type === currentItem) {
            obj.children.forEach(child => {
              if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.color.setHex(printedColors[currentItem]);
                child.material.emissive.setHex(printedColors[currentItem]);
                child.material.emissiveIntensity = 0.2;
              }
            });
          }
        });
      } else if (phase === 'printed' && phaseTime > 0.5) {
        phase = 'from-machine';
        phaseTime = 0;
        objectX = 0;
        objectY = 0.7;
        soundManager.playWhoosh();
      } else if (phase === 'from-machine' && phaseTime > 0.8) {
        phase = 'to-customer';
        phaseTime = 0;
        objectX = customerX;
        soundManager.playWhoosh();
      } else if (phase === 'to-customer' && phaseTime > 0.8) {
        phase = 'customer-happy';
        phaseTime = 0;
        isHappy = true;
        smile.visible = true;
        soundManager.playSuccess();
      } else if (phase === 'customer-happy' && phaseTime > 0.8) {
        phase = 'customer-leaving';
        phaseTime = 0;
        soundManager.playFootstep();
      } else if (phase === 'customer-leaving' && phaseTime > 1.5) {
        phase = 'idle';
        phaseTime = 0;
        customerVisible = false;
        objectVisible = false;
        
        // Reset object colors
        Object.entries(objectsData).forEach(([type, obj]) => {
          obj.visible = false;
          if (type === currentItem) {
            obj.children.forEach(child => {
              if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.color.setHex(0xffffff);
                child.material.emissive.setHex(0x000000);
                child.material.emissiveIntensity = 0;
              }
            });
          }
        });
        
        // Move to next item
        currentItemIndex = (currentItemIndex + 1) % items.length;
        currentItem = items[currentItemIndex];
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
      } else if (phase === 'handoff') {
        objectX = THREE.MathUtils.lerp(objectX, 0, delta * 3);
      } else if (phase === 'to-machine') {
        objectX = THREE.MathUtils.lerp(objectX, 3, delta * 3);
        objectY = THREE.MathUtils.lerp(objectY, 1.0, delta * 3);
      } else if (phase === 'from-machine' || phase === 'to-customer') {
        objectX = THREE.MathUtils.lerp(objectX, customerX, delta * 3);
        objectY = THREE.MathUtils.lerp(objectY, 0.7, delta * 3);
      }

      // Update positions
      customerGroup.position.x = customerX;
      customerGroup.visible = customerVisible;
      
      // Show/hide current object
      Object.entries(objectsData).forEach(([type, obj]) => {
        obj.position.x = objectX;
        obj.position.y = objectY;
        obj.visible = objectVisible && type === currentItem;
      });

      // Walking animation for legs
      if (phase === 'customer-entering' || phase === 'customer-leaving') {
        const walkCycle = Math.sin(elapsed * 10);
        leftLeg.rotation.x = walkCycle * 0.5;
        rightLeg.rotation.x = -walkCycle * 0.5;
      } else {
        leftLeg.rotation.x = THREE.MathUtils.lerp(leftLeg.rotation.x, 0, delta * 5);
        rightLeg.rotation.x = THREE.MathUtils.lerp(rightLeg.rotation.x, 0, delta * 5);
      }

      // Simple animations
      body.rotation.z = Math.sin(elapsed * 2) * 0.03;
      craftsmanBody.rotation.z = Math.sin(elapsed * 1.5) * 0.02;
      
      // Craftsman working animation
      if (phase === 'handoff' || phase === 'to-machine' || phase === 'printing' || phase === 'printed' || phase === 'from-machine') {
        craftsmanLeftArm.rotation.z = Math.PI / 6 + Math.sin(elapsed * 3) * 0.2;
        craftsmanRightArm.rotation.z = -Math.PI / 6 - Math.sin(elapsed * 3) * 0.2;
      }

      // Machine pulse during printing
      if (phase === 'printing') {
        screenMaterial.emissiveIntensity = 0.3 + Math.sin(elapsed * 10) * 0.2;
        topRoller.rotation.x += delta * 5;
        
        // Animate particles
        const particlePositionsArray = particles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          particlePositionsArray[i * 3 + 1] += Math.sin(elapsed * 5 + i) * 0.02;
          if (particlePositionsArray[i * 3 + 1] > 1.5) particlePositionsArray[i * 3 + 1] = 0.5;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        particles.rotation.y += delta;
      }

      // Rotate objects slightly
      if (objectVisible) {
        objectsData[currentItem].rotation.y += delta * 0.5;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize - auto-adjust to screen size
    const handleResize = () => {
      const availableHeight = getAvailableHeight();
      camera.aspect = window.innerWidth / availableHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, availableHeight);
    };
    window.addEventListener('resize', handleResize);
    
    // Initial adjustment after a brief delay to ensure container is sized
    setTimeout(() => handleResize(), 100);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [isMobile]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-gradient-to-b from-[hsl(28,30%,18%)] to-[hsl(28,35%,15%)]">
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

      {/* 3D Scene Container - flex-grow to take available space */}
      <div 
        ref={containerRef} 
        className="w-full flex-1 relative"
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

