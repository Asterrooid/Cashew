/**
 * Cashew Factory Digital Twin - Upgraded Mechanical Equipment Models
 * (c) 2026 Cashew Works Digital Twin Engineering
 * 
 * High-fidelity PBR 3D equipment models:
 * - Industrial Continuous Roaster at x = -10, z = -6
 * - Cooling Table & Nut Tray at x = -10, z = -2.5
 * - Packing Workstation Bench at x = -1, z = 4
 * - Digital Precision Scale at x = -3.2, y = 1.03, z = 4.0
 * - Bench Cashew Tray at x = -2.1, y = 1.03, z = 4.4
 * - Hinged Heat Sealer at x = -0.9, y = 1.03, z = 3.8
 * - Industrial Tape/Label Dispenser at x = 1.25, y = 1.03, z = 3.7
 * - Supply Cart at x = -2.6, z = -3.8
 * - Heavy-Duty Storage Racks at x = 11, z = 1.3 & x = 11, z = 6.5
 * - Food-Grade Cleanroom Packing Worker with Apron & Hairnet
 * 
 * Retains complete userData.info on all meshes for click-to-inspect raycasting.
 */

(function (global) {
  'use strict';

  // Ensure THREE is accessible
  const THREE = global.THREE || (typeof window !== 'undefined' ? window.THREE : null);
  if (!THREE) {
    console.error('Three.js is required for equipment_models.js');
  }

  // Shared material cache
  const materialCache = new Map();

  function getMaterial(color, metalness = 0.0, roughness = 0.7, emissive = 0x000000, emissiveIntensity = 0.0, extra = {}) {
    const key = `${color}_${metalness.toFixed(2)}_${roughness.toFixed(2)}_${emissive}_${emissiveIntensity.toFixed(2)}_${JSON.stringify(extra)}`;
    if (materialCache.has(key)) {
      return materialCache.get(key);
    }
    const mat = new THREE.MeshStandardMaterial({
      color: color,
      metalness: metalness,
      roughness: roughness,
      emissive: emissive,
      emissiveIntensity: emissiveIntensity,
      ...extra
    });
    materialCache.set(key, mat);
    return mat;
  }

  // Tag helper to preserve click-to-inspect raycasting info
  function tagObject(obj, title, text, picksArray) {
    if (!obj) return obj;
    obj.traverse(child => {
      if (child.isMesh) {
        child.userData.info = { title, text };
        child.castShadow = true;
        child.receiveShadow = true;
        if (picksArray && Array.isArray(picksArray)) {
          if (!picksArray.includes(child)) {
            picksArray.push(child);
          }
        }
      }
    });
    return obj;
  }

  // Helper primitives
  function createBoxMesh(w, h, d, mat, parent) {
    const geom = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (parent) parent.add(mesh);
    return mesh;
  }

  function createCylMesh(rt, rb, h, segs, mat, parent) {
    const geom = new THREE.CylinderGeometry(rt, rb, h, segs);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (parent) parent.add(mesh);
    return mesh;
  }

  // Procedural Textures
  let _barcodeTexture = null;
  function getBarcodeTexture() {
    if (_barcodeTexture) return _barcodeTexture;
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 160);
    ctx.strokeStyle = '#002060';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 152);

    ctx.fillStyle = '#002060';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('CASHEW WORKS INC.', 16, 26);
    ctx.fillStyle = '#475569';
    ctx.font = '11px sans-serif';
    ctx.fillText('LOT: 2026-09-28   GRADE: W-240', 16, 42);
    ctx.fillText('QTY: 20 x 150g    NET: 3.00 KG', 16, 56);

    ctx.fillStyle = '#000000';
    const bars = [3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 1, 3, 2, 1, 4, 2, 1, 2, 3, 1, 3, 2, 1, 4, 1, 2, 1, 3, 2];
    let bx = 16;
    for (let i = 0; i < bars.length; i++) {
      const w = bars[i] * 2.2;
      if (i % 2 === 0) {
        ctx.fillRect(bx, 68, w, 56);
      }
      bx += w + 2;
      if (bx > 238) break;
    }

    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('* CW-PKG-3000-BATCH *', 128, 142);

    _barcodeTexture = new THREE.CanvasTexture(canvas);
    _barcodeTexture.encoding = THREE.sRGBEncoding;
    return _barcodeTexture;
  }

  let _scaleDisplayTexture = null;
  function getScaleDisplayTexture() {
    if (_scaleDisplayTexture) return _scaleDisplayTexture;
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#03140a';
    ctx.fillRect(0, 0, 256, 96);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, 252, 92);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('STABLE  NET  ZERO  [PT: 0.00g]', 14, 20);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 44px monospace';
    ctx.fillText(' 150.0 g', 20, 68);

    ctx.beginPath();
    ctx.arc(234, 48, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#34d399';
    ctx.fill();

    _scaleDisplayTexture = new THREE.CanvasTexture(canvas);
    _scaleDisplayTexture.encoding = THREE.sRGBEncoding;
    return _scaleDisplayTexture;
  }

  let _hmiDisplayTexture = null;
  function getHmiDisplayTexture() {
    if (_hmiDisplayTexture) return _hmiDisplayTexture;
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0b132b';
    ctx.fillRect(0, 0, 256, 192);

    ctx.fillStyle = '#1c2541';
    ctx.fillRect(0, 0, 256, 32);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('ROASTER CONVECT-3000', 12, 21);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('ACTIVE', 198, 21);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '12px sans-serif';
    ctx.fillText('CHAMBER TEMP:', 14, 58);
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('162.5 °C', 116, 58);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '12px sans-serif';
    ctx.fillText('AIRFLOW BLOWER:', 14, 88);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('850 m³/h', 116, 88);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '12px sans-serif';
    ctx.fillText('FEED CHUTE:', 14, 118);
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('3.0 kg/min', 116, 118);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(14, 138, 228, 18);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(14, 138, 178, 18);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('PID HEATER POWER: 78%', 20, 151);

    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.fillText('STATUS: CONTINUOUS NORMAL', 14, 178);

    _hmiDisplayTexture = new THREE.CanvasTexture(canvas);
    _hmiDisplayTexture.encoding = THREE.sRGBEncoding;
    return _hmiDisplayTexture;
  }

  let _labelRollTexture = null;
  function getLabelRollTexture() {
    if (_labelRollTexture) return _labelRollTexture;
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 128);

    for (let x = 0; x < 512; x += 128) {
      ctx.strokeStyle = '#002060';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 4, 8, 120, 112);
      ctx.fillStyle = '#002060';
      ctx.fillRect(x + 4, 8, 120, 26);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ROYAL CASHEW', x + 64, 25);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('ROASTED 150g', x + 64, 52);
      ctx.font = '8px sans-serif';
      ctx.fillText('PREMIUM GRADE W240', x + 64, 68);
      ctx.fillText('INGREDIENTS: CASHEWS, SALT', x + 64, 82);
      ctx.fillStyle = '#d97706';
      ctx.fillText('100% NATURAL', x + 64, 102);
    }
    _labelRollTexture = new THREE.CanvasTexture(canvas);
    _labelRollTexture.wrapS = THREE.RepeatWrapping;
    _labelRollTexture.repeat.set(2, 1);
    _labelRollTexture.encoding = THREE.sRGBEncoding;
    return _labelRollTexture;
  }

  // 3D Cashew Nut Geometry Generator
  function createCashewNutMesh(colorVariation = '#d4a257') {
    const geom = new THREE.TorusGeometry(0.046, 0.022, 10, 18, 2.7);
    const mat = getMaterial(colorVariation, 0.08, 0.65);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  // ==========================================
  // 1. Industrial Continuous Roaster
  // ==========================================
  function createContinuousRoaster(options = {}) {
    const x = options.x !== undefined ? options.x : -10;
    const y = options.y !== undefined ? options.y : 0;
    const z = options.z !== undefined ? options.z : -6;
    const picks = options.picks || (typeof global.picks !== 'undefined' ? global.picks : []);

    const roasterGroup = new THREE.Group();
    roasterGroup.position.set(x, y, z);

    const steelDark = getMaterial('#1e2530', 0.85, 0.45);
    const steelBase = getMaterial('#28313e', 0.65, 0.55);
    const lowerBodyMat = getMaterial('#2b3543', 0.55, 0.5);
    const upperBodyMat = getMaterial('#334e68', 0.45, 0.42);
    const stainlessBright = getMaterial('#cbd5e1', 0.9, 0.22);
    const stainlessBrushed = getMaterial('#94a3b8', 0.82, 0.32);
    const amberGlowMat = getMaterial('#ff7700', 0.2, 0.1, 0xff6600, 1.6);
    const glassMat = getMaterial('#ffffff', 0.2, 0.1, 0x000000, 0.0, { transparent: true, opacity: 0.65 });
    const greenLedMat = getMaterial('#22c55e', 0.2, 0.2, 0x22c55e, 1.4);
    const amberLedMat = getMaterial('#f59e0b', 0.2, 0.2, 0xf59e0b, 1.4);
    const cyanLedMat = getMaterial('#06b6d4', 0.2, 0.2, 0x06b6d4, 1.2);
    const estopRed = getMaterial('#dc2626', 0.3, 0.3, 0x991b1b, 0.4);
    const estopYellow = getMaterial('#facc15', 0.2, 0.4);

    // 1. Heavy steel mounting feet with anchor bolts
    const footPositions = [
      [-1.45, 0.04, -1.05],
      [1.45, 0.04, -1.05],
      [-1.45, 0.04, 1.05],
      [1.45, 0.04, 1.05]
    ];
    footPositions.forEach(([fx, fy, fz]) => {
      const foot = createBoxMesh(0.42, 0.08, 0.42, steelDark, roasterGroup);
      foot.position.set(fx, fy, fz);
      // 4 anchor bolts per foot
      for (let bx of [-0.14, 0.14]) {
        for (let bz of [-0.14, 0.14]) {
          const bolt = createCylMesh(0.022, 0.022, 0.04, 8, stainlessBright, roasterGroup);
          bolt.position.set(fx + bx, fy + 0.05, fz + bz);
        }
      }
      // Vertical gusset plate
      const gusset = createBoxMesh(0.06, 0.24, 0.24, steelDark, roasterGroup);
      gusset.position.set(fx, fy + 0.14, fz);
    });

    // Longitudinal chassis rails
    const rail1 = createBoxMesh(3.2, 0.12, 0.15, steelBase, roasterGroup);
    rail1.position.set(0, 0.12, -1.05);
    const rail2 = createBoxMesh(3.2, 0.12, 0.15, steelBase, roasterGroup);
    rail2.position.set(0, 0.12, 1.05);

    // 2. Dual-tier furnace body
    // Lower Tier (Combustion & blower chamber)
    const lowerBody = createBoxMesh(3.0, 0.98, 2.2, lowerBodyMat, roasterGroup);
    lowerBody.position.set(0, 0.65, 0);

    // Louvered ventilation slats on front lower tier
    for (let i = 0; i < 6; i++) {
      const louver = createBoxMesh(1.2, 0.035, 0.03, steelDark, roasterGroup);
      louver.position.set(-0.4, 0.38 + i * 0.08, 1.11);
    }
    // Lower maintenance access door panel
    const door = createBoxMesh(1.1, 0.65, 0.04, getMaterial('#1f2733', 0.5, 0.5), roasterGroup);
    door.position.set(0.85, 0.65, 1.11);
    const doorLatch1 = createBoxMesh(0.04, 0.12, 0.06, stainlessBright, roasterGroup);
    doorLatch1.position.set(1.35, 0.8, 1.14);
    const doorLatch2 = createBoxMesh(0.04, 0.12, 0.06, stainlessBright, roasterGroup);
    doorLatch2.position.set(1.35, 0.5, 1.14);

    // Intermediate transition flange separating lower and upper tiers
    const flange = createBoxMesh(3.18, 0.08, 2.38, steelDark, roasterGroup);
    flange.position.set(0, 1.18, 0);

    // Upper Tier (Roasting & heat treatment tunnel)
    const upperBody = createBoxMesh(2.9, 1.1, 2.1, upperBodyMat, roasterGroup);
    upperBody.position.set(0, 1.77, 0);

    // Front decorative panel & nameplate
    const upperPanel = createBoxMesh(2.6, 0.85, 0.06, getMaterial('#2a435c', 0.45, 0.4), roasterGroup);
    upperPanel.position.set(0, 1.77, 1.08);

    // Upper beveled roof cap
    const roof = createBoxMesh(2.9, 0.16, 2.1, getMaterial('#23374d', 0.5, 0.45), roasterGroup);
    roof.position.set(0, 2.38, 0);

    // 3. Inspection Viewport with internal amber glow
    const viewportX = -0.55;
    const viewportY = 1.77;
    const viewportZ = 1.08;

    // Stainless outer circular bezel
    const bezel = createCylMesh(0.28, 0.28, 0.08, 24, stainlessBright, roasterGroup);
    bezel.rotation.x = Math.PI / 2;
    bezel.position.set(viewportX, viewportY, viewportZ + 0.04);

    // Viewport glass
    const glass = createCylMesh(0.21, 0.21, 0.04, 24, glassMat, roasterGroup);
    glass.rotation.x = Math.PI / 2;
    glass.position.set(viewportX, viewportY, viewportZ + 0.06);

    // Internal amber glowing combustion bed
    const amberBed = createCylMesh(0.19, 0.19, 0.04, 24, amberGlowMat, roasterGroup);
    amberBed.rotation.x = Math.PI / 2;
    amberBed.position.set(viewportX, viewportY, viewportZ - 0.02);

    // Internal amber point light casting realistic convection glow
    const glowLight = new THREE.PointLight(0xff8811, 1.2, 3.8, 2);
    glowLight.position.set(viewportX, viewportY, viewportZ + 0.15);
    roasterGroup.add(glowLight);

    // 8 stainless hex bolts in circular pattern
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const bx = viewportX + Math.cos(a) * 0.25;
      const by = viewportY + Math.sin(a) * 0.25;
      const bolt = createCylMesh(0.016, 0.016, 0.03, 8, stainlessBrushed, roasterGroup);
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(bx, by, viewportZ + 0.08);
    }

    // 4. Side PLC Control Cabinet with status LEDs
    const cabX = 1.56;
    const cabY = 1.45;
    const cabZ = 0.25;
    const cabBody = createBoxMesh(0.28, 0.95, 0.65, getMaterial('#e2e8f0', 0.55, 0.35), roasterGroup);
    cabBody.position.set(cabX, cabY, cabZ);

    // HMI Touchscreen display
    const hmiMat = new THREE.MeshStandardMaterial({
      map: getHmiDisplayTexture(),
      roughness: 0.25,
      metalness: 0.1
    });
    const hmiScreen = createBoxMesh(0.02, 0.38, 0.48, hmiMat, roasterGroup);
    hmiScreen.position.set(cabX + 0.145, cabY + 0.14, cabZ);

    // Emergency Stop Button
    const estopCollar = createCylMesh(0.045, 0.045, 0.02, 16, estopYellow, roasterGroup);
    estopCollar.rotation.z = Math.PI / 2;
    estopCollar.position.set(cabX + 0.145, cabY - 0.24, cabZ - 0.18);
    const estopBtn = createCylMesh(0.035, 0.035, 0.035, 16, estopRed, roasterGroup);
    estopBtn.rotation.z = Math.PI / 2;
    estopBtn.position.set(cabX + 0.165, cabY - 0.24, cabZ - 0.18);

    // Glowing Status LEDs
    const ledX = cabX + 0.145;
    const ledZ = cabZ + 0.15;
    const ledG = createCylMesh(0.022, 0.022, 0.02, 16, greenLedMat, roasterGroup);
    ledG.rotation.z = Math.PI / 2;
    ledG.position.set(ledX, cabY - 0.15, ledZ);

    const ledA = createCylMesh(0.022, 0.022, 0.02, 16, amberLedMat, roasterGroup);
    ledA.rotation.z = Math.PI / 2;
    ledA.position.set(ledX, cabY - 0.22, ledZ);

    const ledC = createCylMesh(0.022, 0.022, 0.02, 16, cyanLedMat, roasterGroup);
    ledC.rotation.z = Math.PI / 2;
    ledC.position.set(ledX, cabY - 0.29, ledZ);

    // Conduit hose connecting cabinet to body
    const conduit = createCylMesh(0.035, 0.035, 0.35, 12, stainlessBrushed, roasterGroup);
    conduit.rotation.z = Math.PI / 4;
    conduit.position.set(cabX - 0.12, cabY - 0.45, cabZ);

    // 5. Top Raw-Cashew Feed Hopper
    const hopX = -0.75;
    const hopY = 2.46;
    const hopZ = 0;
    // Throat cylinder
    const throat = createCylMesh(0.24, 0.24, 0.22, 20, steelDark, roasterGroup);
    throat.position.set(hopX, hopY + 0.11, hopZ);

    // Inverted truncated pyramid hopper
    const hopperGeom = new THREE.CylinderGeometry(0.55, 0.24, 0.72, 4);
    const hopper = new THREE.Mesh(hopperGeom, stainlessBrushed);
    hopper.rotation.y = Math.PI / 4;
    hopper.position.set(hopX, hopY + 0.56, hopZ);
    hopper.castShadow = true;
    hopper.receiveShadow = true;
    roasterGroup.add(hopper);

    // Hopper top rim flange
    const hopRim = createBoxMesh(0.85, 0.05, 0.85, stainlessBright, roasterGroup);
    hopRim.position.set(hopX, hopY + 0.94, hopZ);

    // Safety grating on top of hopper
    for (let gx of [-0.25, 0, 0.25]) {
      const bar = createBoxMesh(0.03, 0.03, 0.78, steelDark, roasterGroup);
      bar.position.set(hopX + gx, hopY + 0.96, hopZ);
    }
    // Raw cashew nuts inside hopper
    for (let i = 0; i < 8; i++) {
      const nut = createCashewNutMesh('#e5c185');
      nut.scale.setScalar(0.9);
      nut.position.set(hopX - 0.15 + (i % 3) * 0.15, hopY + 0.65, hopZ - 0.15 + Math.floor(i / 3) * 0.15);
      nut.rotation.set(Math.random(), Math.random(), Math.random());
      roasterGroup.add(nut);
    }

    // 6. Stainless Exhaust Stack & Ductwork
    const stackX = 0.65;
    const stackZ = 0;
    // Lower ductwork manifold
    const manifold = createBoxMesh(0.65, 0.35, 0.65, stainlessBrushed, roasterGroup);
    manifold.position.set(stackX, 2.55, stackZ);

    // Main vertical exhaust stack
    const stack = createCylMesh(0.24, 0.24, 1.85, 24, stainlessBright, roasterGroup);
    stack.position.set(stackX, 3.65, stackZ);

    // Stack flange rings
    const sFlange1 = createCylMesh(0.29, 0.29, 0.06, 24, stainlessBrushed, roasterGroup);
    sFlange1.position.set(stackX, 2.78, stackZ);
    const sFlange2 = createCylMesh(0.29, 0.29, 0.06, 24, stainlessBrushed, roasterGroup);
    sFlange2.position.set(stackX, 3.75, stackZ);

    // Top exhaust cowl & rain cap
    const cowl = createCylMesh(0.36, 0.24, 0.28, 24, stainlessBrushed, roasterGroup);
    cowl.position.set(stackX, 4.65, stackZ);
    const rainCone = createCylMesh(0.02, 0.42, 0.15, 24, stainlessBright, roasterGroup);
    rainCone.position.set(stackX, 4.84, stackZ);

    // Wall / roof brace struts
    const brace = createBoxMesh(0.04, 0.04, 1.4, steelDark, roasterGroup);
    brace.position.set(stackX, 3.8, stackZ - 0.7);

    // Tag entire assembly for click-to-inspect
    tagObject(roasterGroup, 'Roasting section', 'Upstream source of roasted cashews. Continuous dual-tier convection roaster with raw feed hopper, exhaust ducting, and automated PLC control. Roasting time is not included in the workbook packing cycle.', picks);

    if (options.scene) {
      options.scene.add(roasterGroup);
    }
    return roasterGroup;
  }

  // ==========================================
  // 2. Cooling Table & Nut Tray
  // ==========================================
  function createCoolingTable(options = {}) {
    const x = options.x !== undefined ? options.x : -10;
    const y = options.y !== undefined ? options.y : 0;
    const z = options.z !== undefined ? options.z : -2.5;
    const picks = options.picks || (typeof global.picks !== 'undefined' ? global.picks : []);

    const tableGroup = new THREE.Group();
    tableGroup.position.set(x, y, z);

    const stainlessBrushed = getMaterial('#94a3b8', 0.85, 0.3);
    const stainlessBright = getMaterial('#cbd5e1', 0.9, 0.22);
    const steelDark = getMaterial('#334155', 0.75, 0.4);
    const meshBedMat = getMaterial('#a0aec0', 0.7, 0.5);

    // 1. Tubular stainless steel frame
    const legX = [-1.35, 1.35];
    const legZ = [-0.52, 0.52];
    legX.forEach(lx => {
      legZ.forEach(lz => {
        // Leg tube
        const leg = createCylMesh(0.045, 0.045, 0.96, 16, stainlessBrushed, tableGroup);
        leg.position.set(lx, 0.48, lz);
        // Sanitary bullet leveling foot
        const foot = createCylMesh(0.048, 0.038, 0.08, 16, steelDark, tableGroup);
        foot.position.set(lx, 0.04, lz);
        // Threaded stem
        const stud = createCylMesh(0.02, 0.02, 0.05, 12, stainlessBright, tableGroup);
        stud.position.set(lx, 0.09, lz);
      });
    });

    // Lower H-stretcher frame & perforated undershelf
    const underShelf = createBoxMesh(2.7, 0.03, 1.05, meshBedMat, tableGroup);
    underShelf.position.set(0, 0.32, 0);
    const stretch1 = createBoxMesh(2.75, 0.05, 0.05, stainlessBrushed, tableGroup);
    stretch1.position.set(0, 0.32, -0.52);
    const stretch2 = createBoxMesh(2.75, 0.05, 0.05, stainlessBrushed, tableGroup);
    stretch2.position.set(0, 0.32, 0.52);

    // Upper perimeter apron frame
    const apronFront = createBoxMesh(2.9, 0.08, 0.05, stainlessBrushed, tableGroup);
    apronFront.position.set(0, 0.94, 0.52);
    const apronBack = createBoxMesh(2.9, 0.08, 0.05, stainlessBrushed, tableGroup);
    apronBack.position.set(0, 0.94, -0.52);
    const apronLeft = createBoxMesh(0.05, 0.08, 1.05, stainlessBrushed, tableGroup);
    apronLeft.position.set(-1.35, 0.94, 0);
    const apronRight = createBoxMesh(0.05, 0.08, 1.05, stainlessBrushed, tableGroup);
    apronRight.position.set(1.35, 0.94, 0);

    // Heavy stainless tabletop support plate
    const topPlate = createBoxMesh(3.0, 0.05, 1.3, stainlessBright, tableGroup);
    topPlate.position.set(0, 1.0, 0);

    // 2. Perforated Stainless Steel Cooling Pan with Rim
    const panGroup = new THREE.Group();
    panGroup.position.set(0, 1.025, 0);
    tableGroup.add(panGroup);

    // Pan base plate
    const panBase = createBoxMesh(2.2, 0.03, 0.85, stainlessBright, panGroup);
    panBase.position.set(0, 0.015, 0);

    // Raised folded sanitary rims
    const rimFront = createBoxMesh(2.24, 0.09, 0.025, stainlessBright, panGroup);
    rimFront.position.set(0, 0.06, 0.425);
    const rimBack = createBoxMesh(2.24, 0.09, 0.025, stainlessBright, panGroup);
    rimBack.position.set(0, 0.06, -0.425);
    const rimLeft = createBoxMesh(0.025, 0.09, 0.85, stainlessBright, panGroup);
    rimLeft.position.set(-1.11, 0.06, 0);
    const rimRight = createBoxMesh(0.025, 0.09, 0.85, stainlessBright, panGroup);
    rimRight.position.set(1.11, 0.06, 0);

    // Tubular stainless lifting grab handles on both ends
    [-1.13, 1.13].forEach(hx => {
      const handle = createBoxMesh(0.03, 0.04, 0.28, stainlessBright, panGroup);
      handle.position.set(hx, 0.07, 0);
    });

    // 3. 3D Roasted Cashews on the tray
    const nutColors = ['#d4a257', '#c89345', '#deaf6c', '#be853b', '#caa05e'];
    const nuts = [];
    for (let i = 0; i < 32; i++) {
      const col = i % 8;
      const row = Math.floor(i / 8);
      const nx = -0.9 + col * 0.25 + (Math.sin(i * 3.7) * 0.04);
      const nz = -0.28 + row * 0.18 + (Math.cos(i * 2.3) * 0.03);
      const color = nutColors[i % nutColors.length];
      const nut = createCashewNutMesh(color);
      nut.position.set(nx, 0.05, nz);
      nut.rotation.x = Math.PI / 2 + (i % 3) * 0.2;
      nut.rotation.z = (i * 0.8) % (Math.PI * 2);
      nut.scale.setScalar(0.95 + (i % 4) * 0.05);
      panGroup.add(nut);
      nuts.push(nut);
    }
    tableGroup.nuts = nuts;

    tagObject(tableGroup, 'Roasted-cashew tray', 'One incoming tray supplies enough cashews for 20 × 150 g pouches, or 3 kg per carton. Perforated stainless steel pan allows rapid convective ambient cooling.', picks);

    if (options.scene) {
      options.scene.add(tableGroup);
    }
    return tableGroup;
  }

  // ==========================================
  // 3. Packing Workstation Bench
  // ==========================================
  function createPackingBench(options = {}) {
    const x = options.x !== undefined ? options.x : -1;
    const y = options.y !== undefined ? options.y : 0;
    const z = options.z !== undefined ? options.z : 4;
    const picks = options.picks || (typeof global.picks !== 'undefined' ? global.picks : []);

    const benchGroup = new THREE.Group();
    benchGroup.position.set(x, y, z);

    const aluExtrusion = getMaterial('#94a3b8', 0.72, 0.35);
    const aluDarkGroove = getMaterial('#475569', 0.85, 0.45);
    const stainlessTop = getMaterial('#d8e2ec', 0.88, 0.28);
    const steelDark = getMaterial('#1e293b', 0.8, 0.5);

    // 1. Heavy Extruded Aluminum T-Slot Frame (6 Upright Legs)
    const legXPositions = [-3.3, 0, 3.3];
    const legZPositions = [-0.92, 0.92];

    legXPositions.forEach(lx => {
      legZPositions.forEach(lz => {
        // Main 45x45 profile leg
        const leg = createBoxMesh(0.12, 0.95, 0.12, aluExtrusion, benchGroup);
        leg.position.set(lx, 0.475, lz);

        // Center T-slot recessed accent
        const grooveZ = createBoxMesh(0.124, 0.93, 0.03, aluDarkGroove, benchGroup);
        grooveZ.position.set(lx, 0.475, lz);
        const grooveX = createBoxMesh(0.03, 0.93, 0.124, aluDarkGroove, benchGroup);
        grooveX.position.set(lx, 0.475, lz);

        // Cast corner gusset bracket at top joint
        const gusset = createBoxMesh(0.16, 0.16, 0.16, aluExtrusion, benchGroup);
        gusset.position.set(lx, 0.88, lz);

        // Swivel leveling foot at base
        const foot = createCylMesh(0.065, 0.065, 0.03, 16, steelDark, benchGroup);
        foot.position.set(lx, 0.015, lz);
        const stem = createCylMesh(0.02, 0.02, 0.06, 12, aluExtrusion, benchGroup);
        stem.position.set(lx, 0.05, lz);
      });
    });

    // Longitudinal and transverse horizontal support rails
    [-0.92, 0.92].forEach(lz => {
      const rail = createBoxMesh(6.75, 0.10, 0.10, aluExtrusion, benchGroup);
      rail.position.set(0, 0.90, lz);
      const lowerStretcher = createBoxMesh(6.75, 0.08, 0.08, aluExtrusion, benchGroup);
      lowerStretcher.position.set(0, 0.28, lz);
    });

    legXPositions.forEach(lx => {
      const crossRail = createBoxMesh(0.10, 0.10, 1.84, aluExtrusion, benchGroup);
      crossRail.position.set(lx, 0.90, 0);
      const crossStretcher = createBoxMesh(0.08, 0.08, 1.84, aluExtrusion, benchGroup);
      crossStretcher.position.set(lx, 0.28, 0);
    });

    // 2. Brushed Stainless Steel Bench Top
    const top = createBoxMesh(7.0, 0.08, 2.1, stainlessTop, benchGroup);
    top.position.set(0, 0.99, 0);

    // Bullnose front ergonomic bumper rail
    const bullnose = createBoxMesh(7.02, 0.09, 0.03, aluExtrusion, benchGroup);
    bullnose.position.set(0, 0.99, 1.055);

    // Rear tool retaining upstand lip
    const upstand = createBoxMesh(7.02, 0.08, 0.03, stainlessTop, benchGroup);
    upstand.position.set(0, 1.05, -1.04);

    tagObject(benchGroup, 'Packing workstation', 'One worker completes all eight measured steps sequentially here and at adjacent storage. Heavy-duty extruded aluminum T-slot frame with brushed stainless steel tabletop.', picks);

    if (options.scene) {
      options.scene.add(benchGroup);
    }
    return benchGroup;
  }

  // ==========================================
  // 4. Digital Precision Scale
  // ==========================================
  function createPrecisionScale(options = {}) {
    const x = options.x !== undefined ? options.x : -3.2;
    const y = options.y !== undefined ? options.y : 1.03;
    const z = options.z !== undefined ? options.z : 4.0;
    const picks = options.picks || (typeof global.picks !== 'undefined' ? global.picks : []);

    const scaleGroup = new THREE.Group();
    scaleGroup.position.set(x, y, z);

    const baseDark = getMaterial('#1e293b', 0.65, 0.45);
    const platterStainless = getMaterial('#f1f5f9', 0.92, 0.18);
    const pillarMat = getMaterial('#334155', 0.7, 0.4);
    const rubberMat = getMaterial('#0f172a', 0.1, 0.85);

    // Scale housing base
    const base = createBoxMesh(0.85, 0.14, 0.75, baseDark, scaleGroup);
    base.position.set(0, 0.07, 0);

    // 4 rubber feet
    for (let fx of [-0.38, 0.38]) {
      for (let fz of [-0.32, 0.32]) {
        const foot = createCylMesh(0.04, 0.04, 0.03, 16, rubberMat, scaleGroup);
        foot.position.set(fx, 0.015, fz);
      }
    }

    // Stainless steel weighing platter
    const platter = createBoxMesh(0.72, 0.05, 0.62, platterStainless, scaleGroup);
    platter.position.set(0, 0.165, 0);

    // Rear pedestal column
    const col = createBoxMesh(0.12, 0.38, 0.08, pillarMat, scaleGroup);
    col.position.set(0, 0.30, -0.32);

    // Angled digital display head
    const head = createBoxMesh(0.52, 0.28, 0.12, baseDark, scaleGroup);
    head.rotation.x = -0.22;
    head.position.set(0, 0.48, -0.28);

    // Glowing LED Display Readout Texture
    const displayMat = new THREE.MeshStandardMaterial({
      map: getScaleDisplayTexture(),
      roughness: 0.1,
      metalness: 0.1,
      emissive: 0x059669,
      emissiveIntensity: 0.25
    });
    const screen = createBoxMesh(0.40, 0.16, 0.015, displayMat, scaleGroup);
    screen.rotation.x = -0.22;
    screen.position.set(0, 0.50, -0.215);

    // Keypad membrane buttons
    const keyZero = createBoxMesh(0.08, 0.04, 0.01, getMaterial('#2563eb'), scaleGroup);
    keyZero.rotation.x = -0.22;
    keyZero.position.set(-0.14, 0.40, -0.235);
    const keyTare = createBoxMesh(0.08, 0.04, 0.01, getMaterial('#eab308'), scaleGroup);
    keyTare.rotation.x = -0.22;
    keyTare.position.set(0, 0.40, -0.235);
    const keyPwr = createBoxMesh(0.08, 0.04, 0.01, getMaterial('#ef4444'), scaleGroup);
    keyPwr.rotation.x = -0.22;
    keyPwr.position.set(0.14, 0.40, -0.235);

    tagObject(scaleGroup, 'Weighing scale', 'Portion 150 g into each of the 20 pouches. Industrial digital precision bench scale with bright LED weight display. Weigh Cashew is one observed duration for the entire carton.', picks);

    if (options.scene) {
      options.scene.add(scaleGroup);
    }
    return scaleGroup;
  }

  // ==========================================
  // 5. Tabletop Heat Sealer
  // ==========================================
  function createHeatSealer(options = {}) {
    const x = options.x !== undefined ? options.x : -0.9;
    const y = options.y !== undefined ? options.y : 1.03;
    const z = options.z !== undefined ? options.z : 3.8;
    const picks = options.picks || (typeof global.picks !== 'undefined' ? global.picks : []);

    const sealerGroup = new THREE.Group();
    sealerGroup.position.set(x, y, z);

    const bodyNavy = getMaterial('#002060', 0.5, 0.4);
    const jawMetal = getMaterial('#94a3b8', 0.8, 0.3);
    const teflonAmber = getMaterial('#d97706', 0.2, 0.6);
    const handleBlack = getMaterial('#0f172a', 0.15, 0.8);
    const chromePin = getMaterial('#cbd5e1', 0.95, 0.15);

    // 0. Base housing (Child index 0 for compatibility)
    const base = createBoxMesh(1.08, 0.20, 0.46, bodyNavy, sealerGroup);
    base.position.set(0, 0.10, 0);

    // Heating wire strip with PTFE Teflon cover tape
    const teflonStrip = createBoxMesh(0.96, 0.02, 0.045, teflonAmber, sealerGroup);
    teflonStrip.position.set(0, 0.21, 0.08);

    // Rear hinge pivot block
    const hingeBlock = createBoxMesh(0.98, 0.12, 0.12, bodyNavy, sealerGroup);
    hingeBlock.position.set(0, 0.22, -0.16);

    // Hinge axle pin
    const pin = createCylMesh(0.02, 0.02, 1.02, 16, chromePin, sealerGroup);
    pin.rotation.z = Math.PI / 2;
    pin.position.set(0, 0.25, -0.16);

    // Front adjustment knob & indicator
    const dial = createCylMesh(0.045, 0.045, 0.025, 20, handleBlack, sealerGroup);
    dial.position.set(0.38, 0.21, 0.15);
    const ledSeal = createCylMesh(0.015, 0.015, 0.01, 12, getMaterial('#ef4444', 0.2, 0.2, 0xef4444, 1.0), sealerGroup);
    ledSeal.position.set(0.46, 0.21, 0.15);

    // 1. Hinged Jaw Assembly (Child index 1 for backward compatibility: sealer.children[1])
    const jawPivot = new THREE.Group();
    jawPivot.position.set(0, 0.25, -0.16);
    sealerGroup.add(jawPivot);

    // Jaw compression arm
    const jawArm = createBoxMesh(0.96, 0.08, 0.20, jawMetal, jawPivot);
    jawArm.position.set(0, 0.04, 0.20);

    // Silicone rubber pressure strip underneath the jaw
    const pressureStrip = createBoxMesh(0.94, 0.02, 0.04, getMaterial('#f1f5f9', 0.2, 0.7), jawPivot);
    pressureStrip.position.set(0, -0.01, 0.24);

    // Ergonomic insulated handle
    const handleStem = createBoxMesh(0.04, 0.05, 0.22, jawMetal, jawPivot);
    handleStem.position.set(0, 0.10, 0.32);
    const handleGrip = createCylMesh(0.035, 0.035, 0.38, 16, handleBlack, jawPivot);
    handleGrip.rotation.z = Math.PI / 2;
    handleGrip.position.set(0, 0.14, 0.42);

    // Direct reference to jaw for animation rotation
    sealerGroup.jaw = jawPivot;

    tagObject(sealerGroup, 'Tabletop heat sealer', 'Closes each filled pouch. Heavy-duty impulse heat sealer with hinged compression jaw, ergonomic handle, and nichrome heating element.', picks);

    if (options.scene) {
      options.scene.add(sealerGroup);
    }
    return sealerGroup;
  }

  // ==========================================
  // 6. Industrial Tape / Label Dispenser
  // ==========================================
  function createLabelDispenser(options = {}) {
    const x = options.x !== undefined ? options.x : 1.25;
    const y = options.y !== undefined ? options.y : 1.03;
    const z = options.z !== undefined ? options.z : 3.7;
    const picks = options.picks || (typeof global.picks !== 'undefined' ? global.picks : []);

    const dispenserGroup = new THREE.Group();
    dispenserGroup.position.set(x, y, z);

    const baseCast = getMaterial('#334155', 0.75, 0.4);
    const spindleMetal = getMaterial('#cbd5e1', 0.9, 0.2);
    const brassNut = getMaterial('#d97706', 0.6, 0.35);

    // Heavy anti-slip weighted base plate
    const base = createBoxMesh(0.48, 0.06, 0.52, baseCast, dispenserGroup);
    base.position.set(0, 0.03, 0);

    // Dual vertical triangular spindle stanchions
    [-0.22, 0.22].forEach(sx => {
      const stanchion = createBoxMesh(0.04, 0.38, 0.24, baseCast, dispenserGroup);
      stanchion.position.set(sx, 0.22, 0);
    });

    // Horizontal spindle axle pin
    const axle = createCylMesh(0.025, 0.025, 0.54, 16, spindleMetal, dispenserGroup);
    axle.rotation.z = Math.PI / 2;
    axle.position.set(0, 0.28, 0);

    // Brass knurled tension thumb nut
    const nut = createCylMesh(0.045, 0.045, 0.04, 16, brassNut, dispenserGroup);
    nut.rotation.z = Math.PI / 2;
    nut.position.set(0.26, 0.28, 0);

    // Label spool roll with realistic repeated printed label texture
    const labelMat = new THREE.MeshStandardMaterial({
      map: getLabelRollTexture(),
      roughness: 0.65,
      metalness: 0.05
    });
    const roll = createCylMesh(0.24, 0.24, 0.38, 32, labelMat, dispenserGroup);
    roll.rotation.z = Math.PI / 2;
    roll.position.set(0, 0.28, 0);
    dispenserGroup.roll = roll;

    // Dispensing guide plate & peel-off blade
    const guidePlate = createBoxMesh(0.44, 0.03, 0.24, baseCast, dispenserGroup);
    guidePlate.position.set(0, 0.07, 0.24);

    // Protruding peelable white label
    const peelLabel = createBoxMesh(0.26, 0.015, 0.12, getMaterial('#ffffff', 0.0, 0.7), dispenserGroup);
    peelLabel.position.set(0, 0.09, 0.34);

    tagObject(dispenserGroup, 'Label supply', 'Labels are applied to the sealed pouches, then the batch is checked. Industrial reel dispenser with friction guide and roll core.', picks);

    if (options.scene) {
      options.scene.add(dispenserGroup);
    }
    return dispenserGroup;
  }

  // ==========================================
  // 7. Supply Cart
  // ==========================================
  function createSupplyCart(options = {}) {
    const x = options.x !== undefined ? options.x : -2.6;
    const y = options.y !== undefined ? options.y : 0;
    const z = options.z !== undefined ? options.z : -3.8;
    const picks = options.picks || (typeof global.picks !== 'undefined' ? global.picks : []);

    const cartGroup = new THREE.Group();
    cartGroup.position.set(x, y, z);

    const puOrange = getMaterial('#ea580c', 0.2, 0.45);
    const forkSteel = getMaterial('#94a3b8', 0.85, 0.3);
    const chromeTube = getMaterial('#cbd5e1', 0.88, 0.2);
    const hubMat = getMaterial('#475569', 0.75, 0.45);
    const wireGrid = getMaterial('#a0aec0', 0.8, 0.35);
    const gripBlack = getMaterial('#1e293b', 0.15, 0.85);

    // 1. Polyurethane Swivel Caster Wheels (4 corners)
    const casterPositions = [
      [-0.85, -0.45],
      [0.85, -0.45],
      [-0.85, 0.45],
      [0.85, 0.45]
    ];

    casterPositions.forEach(([cx, cz]) => {
      // Swivel mount top plate
      const mPlate = createBoxMesh(0.14, 0.02, 0.14, forkSteel, cartGroup);
      mPlate.position.set(cx, 0.28, cz);

      // Swivel kingpin & fork bracket
      const forkL = createBoxMesh(0.02, 0.14, 0.08, forkSteel, cartGroup);
      forkL.position.set(cx - 0.06, 0.20, cz);
      const forkR = createBoxMesh(0.02, 0.14, 0.08, forkSteel, cartGroup);
      forkR.position.set(cx + 0.06, 0.20, cz);

      // Wheel hub
      const hub = createCylMesh(0.08, 0.08, 0.09, 16, hubMat, cartGroup);
      hub.rotation.z = Math.PI / 2;
      hub.position.set(cx, 0.14, cz);

      // Polyurethane safety orange tire
      const tireGeom = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 20);
      const tire = new THREE.Mesh(tireGeom, puOrange);
      tire.rotation.z = Math.PI / 2;
      tire.position.set(cx, 0.14, cz);
      tire.castShadow = true;
      tire.receiveShadow = true;
      cartGroup.add(tire);
    });

    // 2. 2-Tier Wire Frame & Upright Tubular Posts
    const uprightX = [-0.92, 0.92];
    const uprightZ = [-0.52, 0.52];
    uprightX.forEach(ux => {
      uprightZ.forEach(uz => {
        // Vertical post
        const post = createCylMesh(0.025, 0.025, 1.15, 16, chromeTube, cartGroup);
        post.position.set(ux, 0.65, uz);
        // Chrome collar clips
        const collar1 = createCylMesh(0.032, 0.032, 0.04, 16, forkSteel, cartGroup);
        collar1.position.set(ux, 0.35, uz);
        const collar2 = createCylMesh(0.032, 0.032, 0.04, 16, forkSteel, cartGroup);
        collar2.position.set(ux, 1.0, uz);
      });
    });

    // Lower Shelf (y = 0.35)
    const lowerRim = createBoxMesh(2.0, 0.04, 1.2, chromeTube, cartGroup);
    lowerRim.position.set(0, 0.35, 0);
    const lowerDeck = createBoxMesh(1.92, 0.015, 1.12, wireGrid, cartGroup);
    lowerDeck.position.set(0, 0.35, 0);

    // Upper Shelf (y = 1.0)
    const upperRim = createBoxMesh(2.0, 0.04, 1.2, chromeTube, cartGroup);
    upperRim.position.set(0, 1.0, 0);
    const upperDeck = createBoxMesh(1.92, 0.015, 1.12, wireGrid, cartGroup);
    upperDeck.position.set(0, 1.0, 0);

    // Safety perimeter wire retaining lip on upper deck
    [-0.58, 0.58].forEach(sz => {
      const lip = createBoxMesh(1.96, 0.08, 0.015, chromeTube, cartGroup);
      lip.position.set(0, 1.05, sz);
    });

    // 3. Ergonomic Tubular Push Handle
    const handleLeft = createCylMesh(0.025, 0.025, 0.28, 16, chromeTube, cartGroup);
    handleLeft.position.set(-0.92, 1.12, -0.62);
    handleLeft.rotation.x = -0.3;

    const handleRight = createCylMesh(0.025, 0.025, 0.28, 16, chromeTube, cartGroup);
    handleRight.position.set(-0.92, 1.12, 0.62);
    handleRight.rotation.x = 0.3;

    const handleBar = createCylMesh(0.025, 0.025, 1.28, 16, chromeTube, cartGroup);
    handleBar.rotation.x = Math.PI / 2;
    handleBar.position.set(-0.96, 1.24, 0);

    // Rubberized grips
    [-0.35, 0.35].forEach(gz => {
      const grip = createCylMesh(0.035, 0.035, 0.28, 16, gripBlack, cartGroup);
      grip.rotation.x = Math.PI / 2;
      grip.position.set(-0.96, 1.24, gz);
    });

    // 4. Bundles of Empty Packaging Pouches on top deck
    const pouchMat = getMaterial('#e5ebf7', 0.3, 0.6);
    for (let i = 0; i < 5; i++) {
      const bundle = createBoxMesh(0.28, 0.16, 0.72, pouchMat, cartGroup);
      bundle.position.set(-0.64 + i * 0.32, 1.10, 0);
      // Pouch bundle band
      const band = createBoxMesh(0.284, 0.164, 0.08, getMaterial('#2563eb'), cartGroup);
      band.position.set(-0.64 + i * 0.32, 1.10, 0);
    }

    tagObject(cartGroup, 'Pouch delivery cart', 'Brings 20 empty small packs to the packing workstation. 2-tier wire frame with polyurethane swivel caster wheels and tubular push handle.', picks);

    if (options.scene) {
      options.scene.add(cartGroup);
    }
    return cartGroup;
  }

  // ==========================================
  // Versatile 4-Wheel Mobile Utility Cart
  // ==========================================
  function createUtilityCart(options = {}) {
    let cargo = options.cargo;
    if (!cargo) {
      if (options.title && options.title.toLowerCase().includes('cashew')) {
        cargo = 'cashews';
      } else if (options.title && options.title.toLowerCase().includes('carton')) {
        cargo = 'carton';
      } else if (options.title && options.title.toLowerCase().includes('pouch')) {
        cargo = 'pouches';
      } else {
        cargo = 'none';
      }
    }

    let defaultX = 0;
    let defaultZ = 0;
    if (cargo === 'cashews') {
      defaultX = -8.0;
      defaultZ = -1.5;
    } else if (cargo === 'carton') {
      defaultX = 4.0;
      defaultZ = -4.0;
    } else if (cargo === 'pouches') {
      defaultX = -2.6;
      defaultZ = -3.8;
    }

    const x = options.x !== undefined ? options.x : defaultX;
    const y = options.y !== undefined ? options.y : 0;
    const z = options.z !== undefined ? options.z : defaultZ;
    const picks = options.picks || (typeof global.picks !== 'undefined' ? global.picks : []);
    const title = options.title || (cargo === 'cashews' ? 'Cashew delivery cart' : cargo === 'carton' ? 'Carton delivery cart' : 'Mobile utility cart');
    const text = options.text || (cargo === 'cashews' ? 'Stainless steel mobile utility cart delivering the roasted cashew tray to the packaging station.' : cargo === 'carton' ? 'Mobile utility cart delivering the folded corrugated shipping carton.' : 'Heavy-duty 4-wheel mobile utility cart with lower and upper shelves and ergonomic tubular handle.');

    const cartGroup = new THREE.Group();
    cartGroup.position.set(x, y, z);
    if (options.rotationY !== undefined) cartGroup.rotation.y = options.rotationY;

    // Materials
    const puOrange = getMaterial('#ea580c', 0.2, 0.45); // Polyurethane orange tires
    const forkSteel = getMaterial('#94a3b8', 0.85, 0.3); // Steel bracket / fork
    const hubMat = getMaterial('#475569', 0.75, 0.45); // Hub
    const chromeTube = getMaterial('#cbd5e1', 0.88, 0.2); // Chrome tubular frame
    const shelfMat = getMaterial('#94a3b8', 0.88, 0.28); // Smooth stainless steel shelf
    const gripBlack = getMaterial('#1e293b', 0.15, 0.85); // Rubberized black grip

    // 1. 4 Polyurethane Swivel Caster Wheels at Corners (radius ~0.10, width 0.06)
    const casterPositions = [
      [-0.48, -0.28],
      [0.48, -0.28],
      [-0.48, 0.28],
      [0.48, 0.28]
    ];

    casterPositions.forEach(([cx, cz]) => {
      // Swivel mount plate (y = 0.20)
      const mPlate = createBoxMesh(0.12, 0.015, 0.12, forkSteel, cartGroup);
      mPlate.position.set(cx, 0.20, cz);

      // Swivel forks
      const forkF = createBoxMesh(0.06, 0.11, 0.016, forkSteel, cartGroup);
      forkF.position.set(cx, 0.14, cz + 0.045);
      const forkB = createBoxMesh(0.06, 0.11, 0.016, forkSteel, cartGroup);
      forkB.position.set(cx, 0.14, cz - 0.045);

      // Wheel hub
      const hub = createCylMesh(0.05, 0.05, 0.07, 16, hubMat, cartGroup);
      hub.rotation.x = Math.PI / 2;
      hub.position.set(cx, 0.10, cz);

      // Polyurethane wheel tire (radius 0.10, width 0.06)
      const tireGeom = new THREE.CylinderGeometry(0.10, 0.10, 0.06, 20);
      const tire = new THREE.Mesh(tireGeom, puOrange);
      tire.rotation.x = Math.PI / 2;
      tire.position.set(cx, 0.10, cz);
      tire.castShadow = true;
      tire.receiveShadow = true;
      cartGroup.add(tire);
    });

    // 2. Tubular Chrome Frame Posts at 4 Corners
    const postX = [-0.52, 0.52];
    const postZ = [-0.32, 0.32];
    postX.forEach(px => {
      postZ.forEach(pz => {
        // Vertical post from y = 0.20 to 0.86
        const post = createCylMesh(0.02, 0.02, 0.66, 16, chromeTube, cartGroup);
        post.position.set(px, 0.53, pz);

        // Chrome collar clips at lower and upper shelf joints
        const collar1 = createCylMesh(0.026, 0.026, 0.03, 16, forkSteel, cartGroup);
        collar1.position.set(px, 0.28, pz);
        const collar2 = createCylMesh(0.026, 0.026, 0.03, 16, forkSteel, cartGroup);
        collar2.position.set(px, 0.85, pz);
      });
    });

    // 3. Lower Shelf at y = 0.28
    const lowerRim = createBoxMesh(1.14, 0.03, 0.74, chromeTube, cartGroup);
    lowerRim.position.set(0, 0.28, 0);
    const lowerDeck = createBoxMesh(1.08, 0.015, 0.68, shelfMat, cartGroup);
    lowerDeck.position.set(0, 0.288, 0);

    // Retention lips
    [-0.35, 0.35].forEach(lz => {
      const lip = createBoxMesh(1.10, 0.025, 0.015, chromeTube, cartGroup);
      lip.position.set(0, 0.305, lz);
    });

    // 4. Upper Shelf at y = 0.85 (smooth stainless steel surface)
    const upperRim = createBoxMesh(1.14, 0.03, 0.74, chromeTube, cartGroup);
    upperRim.position.set(0, 0.85, 0);
    const upperDeck = createBoxMesh(1.08, 0.015, 0.68, shelfMat, cartGroup);
    upperDeck.position.set(0, 0.858, 0);

    // Corner bumpers
    postX.forEach(px => {
      postZ.forEach(pz => {
        const bumper = createCylMesh(0.032, 0.032, 0.04, 16, gripBlack, cartGroup);
        bumper.position.set(px, 0.85, pz);
      });
    });

    // 5. Tubular Push Handle at one end (x = -0.55, height 1.05)
    const riser1 = createCylMesh(0.02, 0.02, 0.23, 16, chromeTube, cartGroup);
    riser1.position.set(-0.55, 0.95, -0.32);
    riser1.rotation.z = -0.15;

    const riser2 = createCylMesh(0.02, 0.02, 0.23, 16, chromeTube, cartGroup);
    riser2.position.set(-0.55, 0.95, 0.32);
    riser2.rotation.z = -0.15;

    const handleBar = createCylMesh(0.02, 0.02, 0.70, 16, chromeTube, cartGroup);
    handleBar.rotation.x = Math.PI / 2;
    handleBar.position.set(-0.58, 1.05, 0);

    // Rubberized grips
    [-0.18, 0.18].forEach(gz => {
      const grip = createCylMesh(0.028, 0.028, 0.18, 16, gripBlack, cartGroup);
      grip.rotation.x = Math.PI / 2;
      grip.position.set(-0.58, 1.05, gz);
    });

    // 6. Cargo Options
    if (cargo === 'cashews') {
      // Cashew tray with nuts resting on top shelf at y = 0.865
      const trayGroup = new THREE.Group();
      trayGroup.position.set(0, 0.865, 0);
      cartGroup.add(trayGroup);

      const stainlessBright = getMaterial('#cbd5e1', 0.9, 0.22);
      const trayBase = createBoxMesh(0.90, 0.025, 0.52, stainlessBright, trayGroup);
      trayBase.position.set(0, 0.0125, 0);

      const rimF = createBoxMesh(0.92, 0.05, 0.02, stainlessBright, trayGroup);
      rimF.position.set(0, 0.035, 0.26);
      const rimB = createBoxMesh(0.92, 0.05, 0.02, stainlessBright, trayGroup);
      rimB.position.set(0, 0.035, -0.26);
      const rimL = createBoxMesh(0.02, 0.05, 0.52, stainlessBright, trayGroup);
      rimL.position.set(-0.46, 0.035, 0);
      const rimR = createBoxMesh(0.02, 0.05, 0.52, stainlessBright, trayGroup);
      rimR.position.set(0.46, 0.035, 0);

      [-0.47, 0.47].forEach(hx => {
        const h = createBoxMesh(0.025, 0.03, 0.18, stainlessBright, trayGroup);
        h.position.set(hx, 0.045, 0);
      });

      const nutColors = ['#d4a257', '#c89345', '#deaf6c', '#be853b', '#caa05e'];
      const nuts = [];
      for (let i = 0; i < 20; i++) {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const nx = -0.32 + col * 0.16 + (Math.sin(i * 2.8) * 0.02);
        const nz = -0.15 + row * 0.10 + (Math.cos(i * 1.9) * 0.02);
        const nut = createCashewNutMesh(nutColors[i % nutColors.length]);
        nut.scale.setScalar(0.78);
        nut.position.set(nx, 0.03, nz);
        nut.rotation.x = Math.PI / 2 + (i % 3) * 0.2;
        nut.rotation.z = (i * 0.9) % (Math.PI * 2);
        trayGroup.add(nut);
        nuts.push(nut);
      }
      cartGroup.tray = trayGroup;
      cartGroup.nuts = nuts;
    } else if (cargo === 'carton') {
      // Open carton resting on top shelf at y = 0.865
      const carton = createCorrugatedCarton(cartGroup, 0, 0.865, 0, false);
      cartGroup.carton = carton;
    } else if (cargo === 'pouches') {
      const pouchMat = getMaterial('#e5ebf7', 0.3, 0.6);
      const bundles = [];
      for (let i = 0; i < 4; i++) {
        const bundle = createBoxMesh(0.24, 0.15, 0.55, pouchMat, cartGroup);
        bundle.position.set(-0.36 + i * 0.24, 0.94, 0);
        const band = createBoxMesh(0.244, 0.154, 0.07, getMaterial('#2563eb'), cartGroup);
        band.position.set(-0.36 + i * 0.24, 0.94, 0);
        bundles.push(bundle);
      }
      cartGroup.bundles = bundles;
    }

    tagObject(cartGroup, title, text, picks);

    if (options.scene) {
      options.scene.add(cartGroup);
    }
    return cartGroup;
  }

  // ==========================================
  // 8. Heavy-Duty Storage Racks
  // ==========================================
  function createStorageRack(x = 11, z = 1.3, options = {}) {
    const picks = options.picks || (typeof global.picks !== 'undefined' ? global.picks : []);
    const title = options.title || 'Finished-goods storage';
    const text = options.text || 'The finished carton is placed in storage next to packing. Heavy-duty industrial teardrop pallet uprights with reinforced cross-braces, load beams, and corrugated shipping cartons with barcode labels.';

    const rackGroup = new THREE.Group();
    rackGroup.position.set(x, 0, z);

    const navyUpright = getMaterial('#002060', 0.45, 0.45);
    const orangeBeam = getMaterial('#ea580c', 0.4, 0.5);
    const galvanSteel = getMaterial('#94a3b8', 0.8, 0.35);
    const baseSteel = getMaterial('#1e293b', 0.85, 0.4);
    const deckWood = getMaterial('#ab9270', 0.05, 0.85);

    // 1. Teardrop Uprights (4 columns)
    const colX = [-1.7, 1.7];
    const colZ = [-0.6, 0.6];

    colX.forEach(cx => {
      colZ.forEach(cz => {
        // Main vertical column
        const col = createBoxMesh(0.12, 2.85, 0.12, navyUpright, rackGroup);
        col.position.set(cx, 1.425, cz);

        // Teardrop slot holes appearance
        for (let ySlot = 0.4; ySlot < 2.8; ySlot += 0.35) {
          const slot = createBoxMesh(0.124, 0.08, 0.03, getMaterial('#001540'), rackGroup);
          slot.position.set(cx, ySlot, cz);
        }

        // Heavy steel floor footplate
        const foot = createBoxMesh(0.24, 0.04, 0.24, baseSteel, rackGroup);
        foot.position.set(cx, 0.02, cz);
        // Anchor bolts
        for (let bx of [-0.08, 0.08]) {
          const bolt = createCylMesh(0.015, 0.015, 0.03, 8, galvanSteel, rackGroup);
          bolt.position.set(cx + bx, 0.04, cz);
        }
      });

      // 2. Cross-Braces (Galvanized steel lacing on left & right sides)
      for (let yTier = 0.3; yTier < 2.5; yTier += 0.8) {
        const braceDiag1 = createBoxMesh(0.03, 0.03, 1.35, galvanSteel, rackGroup);
        braceDiag1.position.set(cx, yTier + 0.4, 0);
        braceDiag1.rotation.x = 0.58;

        const braceHoriz = createBoxMesh(0.035, 0.035, 1.18, galvanSteel, rackGroup);
        braceHoriz.position.set(cx, yTier, 0);
      }
    });

    // 3. Horizontal Load Step Beams & Cartons
    const tierHeights = [0.25, 1.25, 2.25];

    tierHeights.forEach(yTier => {
      // Front and rear safety orange step beams
      [-0.6, 0.6].forEach(bz => {
        const beam = createBoxMesh(3.48, 0.12, 0.06, orangeBeam, rackGroup);
        beam.position.set(0, yTier + 0.06, bz);
        // Safety lock pin brackets
        [-1.68, 1.68].forEach(lx => {
          const lock = createBoxMesh(0.08, 0.16, 0.08, orangeBeam, rackGroup);
          lock.position.set(lx, yTier + 0.06, bz);
        });
      });

      // Wire / wood deck
      const deck = createBoxMesh(3.38, 0.04, 1.18, deckWood, rackGroup);
      deck.position.set(0, yTier + 0.06, 0);

      // 3 Corrugated shipping cartons with barcode labels per tier
      [-1.1, 0, 1.1].forEach(boxX => {
        createCorrugatedCarton(rackGroup, boxX, yTier + 0.08, 0, true);
      });
    });

    tagObject(rackGroup, title, text, picks);

    if (options.scene) {
      options.scene.add(rackGroup);
    }
    return rackGroup;
  }

  // ==========================================
  // Corrugated Carton Builder with Barcode Labels
  // ==========================================
  function createCorrugatedCarton(parent, x = 0, y = 0, z = 0, closed = false) {
    if (parent && typeof parent === 'object' && !(parent instanceof THREE.Object3D)) {
      const opts = parent;
      parent = opts.parent || null;
      x = opts.x !== undefined ? opts.x : 0;
      y = opts.y !== undefined ? opts.y : 0;
      z = opts.z !== undefined ? opts.z : 0;
      closed = opts.closed !== undefined ? opts.closed : (opts.open !== undefined ? !opts.open : false);
    }
    const cartonGroup = new THREE.Group();
    cartonGroup.position.set(x, y, z);
    if (parent) parent.add(cartonGroup);

    // Materials
    const exteriorKraft = getMaterial('#b58c59', 0.05, 0.82);
    const interiorKraft = getMaterial('#805b33', 0.05, 0.90);
    const kraftTapeMat = getMaterial('#d6b783', 0.1, 0.7);

    // 1. Bottom panel & Interior bottom plate
    const bottomPanel = createBoxMesh(0.85, 0.02, 0.60, exteriorKraft, cartonGroup);
    bottomPanel.position.set(0, 0.01, 0);

    const interiorBottom = createBoxMesh(0.81, 0.005, 0.56, interiorKraft, cartonGroup);
    interiorBottom.position.set(0, 0.022, 0);

    // 2. Real hollow exterior walls
    // Front wall: width 0.85, height 0.48, depth 0.02 at (0, 0.25, 0.29)
    const wallF = createBoxMesh(0.85, 0.48, 0.02, exteriorKraft, cartonGroup);
    wallF.position.set(0, 0.25, 0.29);

    // Back wall: width 0.85, height 0.48, depth 0.02 at (0, 0.25, -0.29)
    const wallB = createBoxMesh(0.85, 0.48, 0.02, exteriorKraft, cartonGroup);
    wallB.position.set(0, 0.25, -0.29);

    // Left wall: width 0.02, height 0.48, depth 0.56 at (-0.415, 0.25, 0)
    const wallL = createBoxMesh(0.02, 0.48, 0.56, exteriorKraft, cartonGroup);
    wallL.position.set(-0.415, 0.25, 0);

    // Right wall: width 0.02, height 0.48, depth 0.56 at (0.415, 0.25, 0)
    const wallR = createBoxMesh(0.02, 0.48, 0.56, exteriorKraft, cartonGroup);
    wallR.position.set(0.415, 0.25, 0);

    // 3. Interior side linings (thin inner faces with interiorKraft so inside looks dark and hollow)
    const liningF = createBoxMesh(0.81, 0.47, 0.002, interiorKraft, cartonGroup);
    liningF.position.set(0, 0.255, 0.279);

    const liningB = createBoxMesh(0.81, 0.47, 0.002, interiorKraft, cartonGroup);
    liningB.position.set(0, 0.255, -0.279);

    const liningL = createBoxMesh(0.002, 0.47, 0.56, interiorKraft, cartonGroup);
    liningL.position.set(-0.404, 0.255, 0);

    const liningR = createBoxMesh(0.002, 0.47, 0.56, interiorKraft, cartonGroup);
    liningR.position.set(0.404, 0.255, 0);

    if (closed) {
      // Left & right inner flaps flat at y = 0.495
      const innerFlapL = createBoxMesh(0.22, 0.012, 0.56, interiorKraft, cartonGroup);
      innerFlapL.position.set(-0.29, 0.495, 0);

      const innerFlapR = createBoxMesh(0.22, 0.012, 0.56, interiorKraft, cartonGroup);
      innerFlapR.position.set(0.29, 0.495, 0);

      // Front & back outer flaps flat at y = 0.505 (width 0.86, height 0.02, depth 0.61)
      const outerFlaps = createBoxMesh(0.86, 0.02, 0.61, exteriorKraft, cartonGroup);
      outerFlaps.position.set(0, 0.505, 0);

      // Center tape seam: width 0.88, height 0.012, depth 0.12, material getMaterial('#d6b783', 0.1, 0.7); position (0, 0.518, 0)
      const tape = createBoxMesh(0.88, 0.012, 0.12, kraftTapeMat, cartonGroup);
      tape.position.set(0, 0.518, 0);

      // Barcode shipping label on front face: createBoxMesh(0.32, 0.20, 0.012, labelMat, cartonGroup); position (0, 0.27, 0.306)
      const barcodeTex = getBarcodeTexture();
      const labelMat = barcodeTex
        ? new THREE.MeshStandardMaterial({ map: barcodeTex, roughness: 0.5, metalness: 0.0 })
        : getMaterial('#ffffff', 0.0, 0.9);
      const labelMesh = createBoxMesh(0.32, 0.20, 0.012, labelMat, cartonGroup);
      labelMesh.position.set(0, 0.27, 0.306);
    } else {
      // 4 outward-flared top flaps hinged along the top rims:
      // Front top flap: createBoxMesh(0.85, 0.015, 0.22, exteriorKraft, cartonGroup); position (0, 0.53, 0.38); rotation.x = 0.65 (tilted outward).
      const flapF = createBoxMesh(0.85, 0.015, 0.22, exteriorKraft, cartonGroup);
      flapF.position.set(0, 0.53, 0.38);
      flapF.rotation.x = 0.65;

      // Back top flap: createBoxMesh(0.85, 0.015, 0.22, exteriorKraft, cartonGroup); position (0, 0.53, -0.38); rotation.x = -0.65 (tilted outward).
      const flapB = createBoxMesh(0.85, 0.015, 0.22, exteriorKraft, cartonGroup);
      flapB.position.set(0, 0.53, -0.38);
      flapB.rotation.x = -0.65;

      // Left top flap: createBoxMesh(0.20, 0.015, 0.56, exteriorKraft, cartonGroup); position (-0.48, 0.53, 0); rotation.z = -0.65 (tilted outward).
      const flapL = createBoxMesh(0.20, 0.015, 0.56, exteriorKraft, cartonGroup);
      flapL.position.set(-0.48, 0.53, 0);
      flapL.rotation.z = -0.65;

      // Right top flap: createBoxMesh(0.20, 0.015, 0.56, exteriorKraft, cartonGroup); position (0.48, 0.53, 0); rotation.z = 0.65 (tilted outward).
      const flapR = createBoxMesh(0.20, 0.015, 0.56, exteriorKraft, cartonGroup);
      flapR.position.set(0.48, 0.53, 0);
      flapR.rotation.z = 0.65;
    }

    return cartonGroup;
  }

  // ==========================================
  // 9. Character / Packing Worker
  // ==========================================
  function createFoodGradeWorker(options = {}) {
    const x = options.x !== undefined ? options.x : -2;
    const y = options.y !== undefined ? options.y : 0;
    const z = options.z !== undefined ? options.z : 5.8;
    const picks = options.picks || (typeof global.picks !== 'undefined' ? global.picks : []);

    const workerGroup = new THREE.Group();
    workerGroup.position.set(x, y, z);

    const uniformWhite = getMaterial('#f8fafc', 0.05, 0.85);
    const apronNavy = getMaterial('#002060', 0.15, 0.35); // glossy food-grade vinyl
    const skinTone = getMaterial('#d4a373', 0.0, 0.75);
    const pantsNavy = getMaterial('#1e293b', 0.1, 0.8);
    const bootsBlack = getMaterial('#020617', 0.2, 0.7);
    const nitrileBlue = getMaterial('#0284c7', 0.2, 0.4);
    const hairnetBlue = getMaterial('#bae6fd', 0.05, 0.9);
    const maskBlue = getMaterial('#38bdf8', 0.05, 0.8);

    // 1. Torso & Upper Body
    const torso = createBoxMesh(0.48, 0.65, 0.26, uniformWhite, workerGroup);
    torso.position.set(0, 1.05, 0);

    // Mandarin sanitary collar
    const collar = createCylMesh(0.16, 0.16, 0.08, 16, uniformWhite, workerGroup);
    collar.position.set(0, 1.40, 0);

    // 2. Food-Grade Waterproof Apron
    // Apron chest bib
    const apronBib = createBoxMesh(0.34, 0.32, 0.02, apronNavy, workerGroup);
    apronBib.position.set(0, 1.18, 0.135);
    // Apron skirt (mid-thigh length)
    const apronSkirt = createBoxMesh(0.44, 0.52, 0.02, apronNavy, workerGroup);
    apronSkirt.position.set(0, 0.80, 0.135);
    // Apron neck loop
    const neckLoop = createBoxMesh(0.24, 0.02, 0.18, apronNavy, workerGroup);
    neckLoop.position.set(0, 1.35, 0.04);
    // Waist tie strap
    const waistTie = createBoxMesh(0.50, 0.04, 0.28, apronNavy, workerGroup);
    waistTie.position.set(0, 0.98, 0);

    // ID Badge on lapel
    const badge = createBoxMesh(0.08, 0.11, 0.015, getMaterial('#ffffff'), workerGroup);
    badge.position.set(-0.14, 1.25, 0.14);

    // 3. Head & Sanitary Bouffant Hairnet
    const head = createCylMesh(0.16, 0.16, 0.26, 16, skinTone, workerGroup);
    head.position.set(0, 1.55, 0);

    // Pleated bouffant hairnet
    const hairnet = createCylMesh(0.21, 0.19, 0.16, 16, hairnetBlue, workerGroup);
    hairnet.position.set(0, 1.72, 0);

    // Sanitary protective cleanroom face mask
    const mask = createBoxMesh(0.22, 0.11, 0.06, maskBlue, workerGroup);
    mask.position.set(0, 1.52, 0.12);

    // 4. Arms & Nitrile Gloves (Arm Pivots for animation)
    const armPivots = [];
    [-0.30, 0.30].forEach((armX, idx) => {
      const pivot = new THREE.Group();
      pivot.position.set(armX, 1.30, 0);
      workerGroup.add(pivot);

      // Upper arm with white uniform sleeve
      const upperArm = createBoxMesh(0.12, 0.32, 0.12, uniformWhite, pivot);
      upperArm.position.set(0, -0.16, 0.02);

      // Forearm with sanitary sleeve
      const forearm = createBoxMesh(0.11, 0.26, 0.11, uniformWhite, pivot);
      forearm.position.set(0, -0.38, 0.05);

      // Powder-blue nitrile food-handling glove
      const glove = createBoxMesh(0.10, 0.15, 0.10, nitrileBlue, pivot);
      glove.position.set(0, -0.52, 0.06);

      armPivots.push(pivot);
    });
    workerGroup.armPivots = armPivots;

    // 5. Legs & Cleanroom Boots (Legs array for walking animation)
    const legs = [];
    [-0.13, 0.13].forEach((legX) => {
      const legPivot = new THREE.Group();
      legPivot.position.set(legX, 0.72, 0);
      workerGroup.add(legPivot);

      // Trousers
      const pant = createBoxMesh(0.15, 0.65, 0.18, pantsNavy, legPivot);
      pant.position.set(0, -0.33, 0);

      // Slip-resistant safety boot
      const boot = createBoxMesh(0.16, 0.14, 0.28, bootsBlack, legPivot);
      boot.position.set(0, -0.65, 0.05);

      legs.push(legPivot);
    });
    workerGroup.legs = legs;

    // 6. Carton Carry Group for animation
    const carry = new THREE.Group();
    carry.position.set(0, 0.78, 0.43);
    createCorrugatedCarton(carry, 0, 0, 0, true);
    carry.visible = false;
    workerGroup.add(carry);
    workerGroup.carry = carry;

    tagObject(workerGroup, 'Packing worker', 'The same packing worker prepares, weighs, seals, labels, checks, boxes, carries to storage, and returns to clean. Food-grade cleanroom uniform with apron and hairnet.', picks);

    if (options.scene) {
      options.scene.add(workerGroup);
    }
    return workerGroup;
  }

  // ==========================================
  // 10. Bench Cashew Tray
  // ==========================================
  function createBenchTray(options = {}) {
    const x = options.x !== undefined ? options.x : -2.1;
    const y = options.y !== undefined ? options.y : 1.03;
    const z = options.z !== undefined ? options.z : 4.4;
    const picks = options.picks || (typeof global.picks !== 'undefined' ? global.picks : []);

    const trayGroup = new THREE.Group();
    trayGroup.position.set(x, y, z);

    const stainlessBright = getMaterial('#cbd5e1', 0.9, 0.22);
    // Tray base & rim
    const trayBase = createBoxMesh(0.90, 0.03, 0.50, stainlessBright, trayGroup);
    trayBase.position.set(0, 0.015, 0);
    const rimF = createBoxMesh(0.92, 0.06, 0.02, stainlessBright, trayGroup);
    rimF.position.set(0, 0.045, 0.25);
    const rimB = createBoxMesh(0.92, 0.06, 0.02, stainlessBright, trayGroup);
    rimB.position.set(0, 0.045, -0.25);
    const rimL = createBoxMesh(0.02, 0.06, 0.50, stainlessBright, trayGroup);
    rimL.position.set(-0.45, 0.045, 0);
    const rimR = createBoxMesh(0.02, 0.06, 0.50, stainlessBright, trayGroup);
    rimR.position.set(0.45, 0.045, 0);

    const nutColors = ['#d4a257', '#c89345', '#deaf6c', '#be853b'];
    const nuts = [];
    for (let i = 0; i < 24; i++) {
      const col = i % 6;
      const row = Math.floor(i / 6);
      const nx = -0.35 + col * 0.14 + (Math.sin(i * 2.5) * 0.02);
      const nz = -0.16 + row * 0.105 + (Math.cos(i * 1.8) * 0.02);
      const nut = createCashewNutMesh(nutColors[i % nutColors.length]);
      nut.scale.setScalar(0.75);
      nut.position.set(nx, 0.04, nz);
      nut.rotation.x = Math.PI / 2 + (i % 3) * 0.2;
      nut.rotation.z = (i * 0.9) % (Math.PI * 2);
      trayGroup.add(nut);
      nuts.push(nut);
    }
    trayGroup.nuts = nuts;

    tagObject(trayGroup, 'Cashew tray at the bench', 'The incoming batch is portioned into 20 small packs before sealing begins.', picks);

    if (options.scene) {
      options.scene.add(trayGroup);
    }
    return trayGroup;
  }

  // ==========================================
  // 11. Stand-up Coffee / Cashew Bag Package Packet Mock-Up
  // Based on authentic 15.8cm x 10.6cm x 22.5cm gusset pouch geometry
  // ==========================================
  function createCoffeeBagGeometry(W = 0.140, D = 0.095, H = 0.210) {
    const levels = [
      { y: 0.000, ws: 0.98, dfs: 0.95, dbs: 0.95, tuck: 0.00 }, // Base
      { y: H * 0.065, ws: 1.00, dfs: 1.00, dbs: 1.00, tuck: 0.05 }, // Base bevel
      { y: H * 0.220, ws: 1.02, dfs: 1.05, dbs: 1.05, tuck: 0.15 }, // Lower belly
      { y: H * 0.400, ws: 1.02, dfs: 1.04, dbs: 1.04, tuck: 0.30 }, // Mid belly
      { y: H * 0.580, ws: 1.01, dfs: 0.88, dbs: 0.88, tuck: 0.55 }, // Inward slope begins
      { y: H * 0.730, ws: 1.00, dfs: 0.55, dbs: 0.55, tuck: 0.80 }, // Steep slope
      { y: H * 0.840, ws: 1.00, dfs: 0.10, dbs: 0.10, tuck: 0.98 }, // Top pinch
      { y: H * 0.870, ws: 1.00, dfs: 0.03, dbs: 0.03, tuck: 1.00 }, // Sealed fin start
      { y: H,         ws: 1.00, dfs: 0.02, dbs: 0.02, tuck: 1.00 }, // Top sealed edge
    ];

    const vertices = [];
    const indices = [];
    const uvs = [];

    levels.forEach((lvl) => {
      const y = lvl.y;
      const hw = (W / 2) * lvl.ws;
      const hdf = (D / 2) * lvl.dfs;
      const hdb = (D / 2) * lvl.dbs;
      const tuck = lvl.tuck;

      const ring = [];
      // Front (5 points)
      for (let i = 0; i <= 4; i++) {
        const t = i / 4;
        const x = -hw + t * (2 * hw);
        const curveZ = Math.sin(t * Math.PI) * (hdf * 0.12);
        ring.push([x, y, hdf + curveZ]);
      }
      // Right gusset side (3 points)
      ring.push([hw * (1 - tuck * 0.15), y, hdf * 0.5]);
      ring.push([hw * (1 - tuck * 0.70), y, 0]);
      ring.push([hw * (1 - tuck * 0.15), y, -hdb * 0.5]);

      // Back (5 points)
      for (let i = 0; i <= 4; i++) {
        const t = i / 4;
        const x = hw - t * (2 * hw);
        const curveZ = Math.sin(t * Math.PI) * (hdb * 0.12);
        ring.push([x, y, -hdb - curveZ]);
      }

      // Left gusset side (3 points)
      ring.push([-hw * (1 - tuck * 0.15), y, -hdb * 0.5]);
      ring.push([-hw * (1 - tuck * 0.70), y, 0]);
      ring.push([-hw * (1 - tuck * 0.15), y, hdf * 0.5]);

      ring.forEach((pt, pIdx) => {
        vertices.push(...pt);
        uvs.push(pIdx / 16, y / H);
      });
    });

    const numLvl = levels.length;
    const numPerRing = 16;

    for (let l = 0; l < numLvl - 1; l++) {
      const r0 = l * numPerRing;
      const r1 = (l + 1) * numPerRing;
      for (let i = 0; i < numPerRing; i++) {
        const next = (i + 1) % numPerRing;
        indices.push(r0 + i, r0 + next, r1 + next);
        indices.push(r0 + i, r1 + next, r1 + i);
      }
    }

    // Bottom cap
    const bottomCenterIdx = vertices.length / 3;
    vertices.push(0, 0, 0);
    uvs.push(0.5, 0.5);
    for (let i = 0; i < numPerRing; i++) {
      const next = (i + 1) % numPerRing;
      indices.push(bottomCenterIdx, next, i);
    }

    // Top fin seal cap
    const topCenterIdx = vertices.length / 3;
    vertices.push(0, H, 0);
    uvs.push(0.5, 1.0);
    const topRingStart = (numLvl - 1) * numPerRing;
    for (let i = 0; i < numPerRing; i++) {
      const next = (i + 1) % numPerRing;
      indices.push(topCenterIdx, topRingStart + i, topRingStart + next);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  let cachedPouchLabelTexture = null;
  function getPouchLabelTexture() {
    if (cachedPouchLabelTexture) return cachedPouchLabelTexture;
    if (typeof document === 'undefined') return null;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Clean white high-opacity label backing
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);

    // Warm golden header ribbon
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, 0, 512, 105);

    // Brand Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ROYAL CASHEW', 256, 70);

    // Product Type
    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('ROASTED & SALTED', 256, 175);

    // Net Weight
    ctx.fillStyle = '#475569';
    ctx.font = '600 28px sans-serif';
    ctx.fillText('NET WT. 150g', 256, 230);

    // Cashew crescent graphic
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(256, 330, 56, 0.2, Math.PI * 1.2);
    ctx.lineWidth = 24;
    ctx.strokeStyle = '#d97706';
    ctx.stroke();

    // Barcode
    ctx.fillStyle = '#0f172a';
    for (let x = 110; x < 402; x += 12) {
      ctx.fillRect(x, 430, (x % 24 === 0 ? 8 : 4), 60);
    }

    cachedPouchLabelTexture = new THREE.CanvasTexture(canvas);
    return cachedPouchLabelTexture;
  }

  function createStandupCoffeePouch(options = {}) {
    const parent = options.parent || null;
    const x = options.x || 0;
    const y = options.y || 0;
    const z = options.z || 0;
    const color = options.color || '#0284c7';

    const pouchGroup = new THREE.Group();
    pouchGroup.position.set(x, y, z);
    if (parent) parent.add(pouchGroup);

    const W = 0.140;
    const D = 0.095;
    const H = 0.210;

    const geo = createCoffeeBagGeometry(W, D, H);
    const foilMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.28,
      metalness: 0.35,
      side: THREE.DoubleSide
    });

    const body = new THREE.Mesh(geo, foilMat);
    body.castShadow = true;
    body.receiveShadow = true;
    pouchGroup.add(body);

    // Horizontal heat-seal crimp bar across top fin
    const sealBarGeo = new THREE.BoxGeometry(W * 1.02, 0.004, 0.008);
    const sealBarMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.2, metalness: 0.5 });
    const seam = new THREE.Mesh(sealBarGeo, sealBarMat);
    seam.position.set(0, H * 0.88, 0);
    seam.visible = false;
    pouchGroup.add(seam);

    // Front label
    const lblTex = getPouchLabelTexture();
    const lblGeo = new THREE.PlaneGeometry(0.088, 0.098);
    const lblMat = lblTex
      ? new THREE.MeshStandardMaterial({ map: lblTex, roughness: 0.3, metalness: 0.05, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 })
      : getMaterial('#ffffff', 0.1, 0.9);
    const label = new THREE.Mesh(lblGeo, lblMat);
    label.position.set(0, H * 0.42, D * 0.52);
    label.rotation.x = -0.12; // tilt slightly along tapered front face
    label.visible = false;
    pouchGroup.add(label);

    return { group: pouchGroup, body, seam, label };
  }

  // ==========================================
  // Master Equipment Setup Function
  // ==========================================
  function setupAllEquipment(context = {}) {
    const scene = context.scene || (typeof global.scene !== 'undefined' ? global.scene : null);
    const picks = context.picks || (typeof global.picks !== 'undefined' ? global.picks : []);

    const roaster = createContinuousRoaster({ scene, picks });
    const coolingTable = createCoolingTable({ scene, picks });
    const packingBench = createPackingBench({ scene, picks });
    const scale = createPrecisionScale({ scene, picks });
    const sealer = createHeatSealer({ scene, picks });
    const labeler = createLabelDispenser({ scene, picks });
    const pouchCart = createSupplyCart({ scene, picks });
    const cart = pouchCart;
    const cashewCart = createUtilityCart({ scene, picks, title: 'Cashew delivery cart', text: 'Stainless steel mobile utility cart delivering the roasted cashew tray to the packaging station.' });
    const cartonCart = createUtilityCart({ scene, picks, title: 'Carton delivery cart', text: 'Mobile utility cart delivering the folded corrugated shipping carton.' });
    const storeRack1 = createStorageRack(11, 1.3, { scene, picks, title: 'Finished-goods storage', text: 'The finished carton is placed in storage next to packing. Rack sizes and stocked cartons are illustrative; they do not represent measured inventory.' });
    const storeRack2 = createStorageRack(11, 6.5, { scene, picks, title: 'Storage racks', text: 'Finished cartons await shipment. Shipping operations are outside the measured packing cycle.' });
    const supplyRack = createStorageRack(-2.8, -8, { scene, picks, title: 'Empty-pouch supply', text: 'Empty 150 g packaging arrives separately in sets of 20. Missing pouches can prevent preparation even if cashews are ready.' });
    const worker = createFoodGradeWorker({ scene, picks });
    const benchTray = createBenchTray({ scene, picks });

    return {
      roaster,
      coolingTable,
      packingBench,
      scale,
      sealer,
      labeler,
      cart,
      pouchCart,
      cashewCart,
      cartonCart,
      storeRack1,
      storeRack2,
      supplyRack,
      worker,
      benchTray
    };
  }

  // Export module
  const EquipmentModels = {
    getMaterial,
    tagObject,
    createCashewNutMesh,
    createContinuousRoaster,
    createCoolingTable,
    createPackingBench,
    createPrecisionScale,
    createHeatSealer,
    createLabelDispenser,
    createSupplyCart,
    createUtilityCart,
    createStorageRack,
    createCorrugatedCarton,
    createFoodGradeWorker,
    createBenchTray,
    setupAllEquipment,
    getBarcodeTexture,
    getScaleDisplayTexture,
    getHmiDisplayTexture,
    getLabelRollTexture,
    createCoffeeBagGeometry,
    getPouchLabelTexture,
    createStandupCoffeePouch
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EquipmentModels;
  }
  if (typeof window !== 'undefined') {
    window.EquipmentModels = EquipmentModels;
  }
  global.EquipmentModels = EquipmentModels;

})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
