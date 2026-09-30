/**
 * Cashew Factory Digital Twin - 3D Scene Environment Module
 * File: scene_environment.js
 *
 * Implements high-fidelity industrial digital-twin atmosphere:
 * - Digital Twin atmosphere: background #0b0f17, deep cyber fog, ACES tone mapping
 * - High-quality lighting: directional sun with soft shadows, dual-tone hemisphere,
 *   cyan rim light, roaster thermal amber glow, workstation task light, storage fill
 * - Dark-slate high-gloss epoxy floor: specularity, subtle grid seams, zoned floor slabs
 * - Completely OPEN roaster bay: removed partition at x = -5.8 and front partitions
 *   at [-13, 3] and [-7.2, 3.2], joining roaster with empty pack, box folding & walkway
 * - High-vis painted yellow industrial safety markings (OSHA/ISO compliant):
 *   roasting bay boundary, packaging cell boundary, finished goods boundary,
 *   main transit walkway aisle lines & zebra crosswalks, hazard hatching pads
 * - Camera controls: orbit, pan, zoom, smooth preset transitions (Overview, Bench, Top)
 * - Modular hooks & universal module definition (UMD / ES module / CommonJS)
 */

(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(typeof THREE !== 'undefined' ? THREE : require('three'));
  } else if (typeof define === 'function' && define.amd) {
    define(['three'], factory);
  } else {
    var threeRef = global.THREE || (typeof window !== 'undefined' ? window.THREE : null);
    global.SceneEnvironment = factory(threeRef);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this || window, function (THREE) {
  'use strict';

  // Fallback / warning if THREE is not yet loaded in global scope
  if (!THREE && typeof window !== 'undefined' && window.THREE) {
    THREE = window.THREE;
  }

  // --- Environment Default Configuration ---
  const DEFAULT_CONFIG = {
    background: '#0b0f17',
    fogColor: '#0b0f17',
    fogNear: 45,
    fogFar: 120,
    toneMappingExposure: 1.08,
    shadowMapSize: 2048,
    shadowBias: -0.0003,

    lighting: {
      sun: {
        color: 0xffffff,
        intensity: 1.6,
        position: [-12, 32, 16],
        castShadow: true
      },
      hemisphere: {
        sky: 0x1e2a3d,      // Deep slate navy sky
        ground: 0x0b0f17,   // Obsidian dark digital twin base
        intensity: 0.88
      },
      rimLight: {
        color: 0x38bdf8,    // Electric cyan industrial rim
        intensity: 0.95,
        position: [18, 18, -18]
      },
      roasterGlow: {
        color: 0xf59e0b,    // Warm amber production heat
        intensity: 0.70,
        position: [-10, 4.5, -5.5],
        distance: 16,
        decay: 2.0
      },
      benchTask: {
        color: 0xf0f9ff,    // High-CRI crisp inspection task light
        intensity: 0.45,
        position: [-1, 7.5, 4],
        distance: 16,
        decay: 2.0
      },
      storageFill: {
        color: 0x60a5fa,    // Cool cobalt warehouse wash
        intensity: 0.45,
        position: [11, 7, 4],
        distance: 18,
        decay: 1.8
      }
    },

    floor: {
      epoxyColor: 0x121824,
      epoxyRoughness: 0.18,
      epoxyMetalness: 0.24,
      subFoundationColor: 0x080c13,
      gridSpacing: 2.0,
      gridColor: 0x222d42
    },

    markings: {
      safetyYellow: 0xfacc15,
      safetyWhite: 0xf8fafc,
      safetyBlack: 0x0f172a,
      lineWidth: 0.12,
      lineHeight: 0.015,
      elevationY: 0.088
    },

    cameraPresets: {
      overview: {
        name: 'overview',
        label: 'Factory Overview',
        target: [0, 0, 0],
        radius: 42,
        theta: 0.65,
        phi: 0.80
      },
      bench: {
        name: 'bench',
        label: 'Bench Close-up',
        target: [-1, 1.1, 4],
        radius: 13,
        theta: 0.32,
        phi: 0.70
      },
      top: {
        name: 'top',
        label: 'Top View',
        target: [0, 0, 0],
        radius: 42,
        theta: 0.65,
        phi: 0.015
      },
      roaster: {
        name: 'roaster',
        label: 'Roasting Bay',
        target: [-10, 1.2, -5],
        radius: 16,
        theta: 0.45,
        phi: 0.75
      },
      storage: {
        name: 'storage',
        label: 'Finished Goods',
        target: [11, 1.5, 4],
        radius: 18,
        theta: 0.75,
        phi: 0.72
      }
    }
  };

  /**
   * Procedural canvas texture generator for diagonal hazard stripes (OSHA safety yellow & black)
   */
  function createHazardStripeTexture(width = 256, height = 256, stripeWidth = 24) {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    const step = stripeWidth * 2;
    for (let x = -height; x < width + height; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x + stripeWidth, 0);
      ctx.lineTo(x + stripeWidth + height, height);
      ctx.lineTo(x + height, height);
      ctx.closePath();
    }
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    if (THREE.sRGBEncoding) texture.encoding = THREE.sRGBEncoding;
    return texture;
  }

  /**
   * Material Registry: centralized cache of optimized PBR standard materials
   */
  function createMaterialRegistry(config = DEFAULT_CONFIG) {
    const mats = {};

    function getMat(color, metal = 0, roughness = null) {
      const key = `${color}_${metal}_${roughness}`;
      if (!mats[key]) {
        const rough = roughness !== null ? roughness : (metal > 0 ? 0.32 : 0.75);
        mats[key] = new THREE.MeshStandardMaterial({
          color: typeof color === 'string' ? new THREE.Color(color) : color,
          roughness: rough,
          metalness: metal
        });
      }
      return mats[key];
    }

    // Pre-create specialized digital twin environment materials
    const hazardTexture = createHazardStripeTexture(256, 256, 24);
    if (hazardTexture) {
      hazardTexture.repeat.set(4, 1);
    }

    return {
      get: getMat,
      // Floors
      slabBase: new THREE.MeshStandardMaterial({ color: 0x080c13, roughness: 0.8, metalness: 0.1 }),
      epoxyMain: new THREE.MeshStandardMaterial({
        color: config.floor.epoxyColor,
        roughness: config.floor.epoxyRoughness,
        metalness: config.floor.epoxyMetalness
      }),
      epoxyRoaster: new THREE.MeshStandardMaterial({ color: 0x151b26, roughness: 0.22, metalness: 0.22 }),
      epoxySupply: new THREE.MeshStandardMaterial({ color: 0x131926, roughness: 0.20, metalness: 0.25 }),
      epoxyPacking: new THREE.MeshStandardMaterial({ color: 0x141d2e, roughness: 0.15, metalness: 0.28 }),
      epoxyStorage: new THREE.MeshStandardMaterial({ color: 0x111620, roughness: 0.25, metalness: 0.18 }),
      epoxyWalkway: new THREE.MeshStandardMaterial({ color: 0x182235, roughness: 0.14, metalness: 0.32 }),
      epoxyOperatorPad: new THREE.MeshStandardMaterial({ color: 0x0c121d, roughness: 0.55, metalness: 0.05 }),
      gridSeam: new THREE.MeshStandardMaterial({ color: config.floor.gridColor, roughness: 0.35, metalness: 0.5 }),

      // Markings
      safetyYellow: new THREE.MeshStandardMaterial({
        color: config.markings.safetyYellow,
        roughness: 0.35,
        metalness: 0.08
      }),
      safetyWhite: new THREE.MeshStandardMaterial({
        color: config.markings.safetyWhite,
        roughness: 0.35,
        metalness: 0.08
      }),
      safetyBlack: new THREE.MeshStandardMaterial({
        color: config.markings.safetyBlack,
        roughness: 0.40,
        metalness: 0.05
      }),
      hazardStripe: hazardTexture ? new THREE.MeshStandardMaterial({
        map: hazardTexture,
        roughness: 0.35,
        metalness: 0.08
      }) : new THREE.MeshStandardMaterial({ color: config.markings.safetyYellow }),

      // Walls & Architecture
      wallPanel: new THREE.MeshStandardMaterial({ color: 0x161e2b, roughness: 0.65, metalness: 0.15 }),
      wallTrim: new THREE.MeshStandardMaterial({ color: 0x0d121a, roughness: 0.45, metalness: 0.35 }),
      wallCoping: new THREE.MeshStandardMaterial({ color: 0x222d3d, roughness: 0.35, metalness: 0.5 }),
      steelColumn: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.32, metalness: 0.65 }),
      partition: new THREE.MeshStandardMaterial({ color: 0x1a2333, roughness: 0.40, metalness: 0.30 }),
      partitionTrim: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.30, metalness: 0.60 })
    };
  }

  // --- Geometry Construction Helpers ---

  function makeBox(x, y, z, w, h, d, materialOrColor, parent, metal = 0, registry = null) {
    let matInstance;
    if (materialOrColor && materialOrColor.isMaterial) {
      matInstance = materialOrColor;
    } else if (registry && typeof materialOrColor === 'string') {
      matInstance = registry.get(materialOrColor, metal);
    } else {
      matInstance = new THREE.MeshStandardMaterial({
        color: typeof materialOrColor === 'string' ? new THREE.Color(materialOrColor) : materialOrColor,
        roughness: metal > 0 ? 0.32 : 0.75,
        metalness: metal
      });
    }
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matInstance);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (parent) parent.add(mesh);
    return mesh;
  }

  function makeCyl(x, y, z, r, h, materialOrColor, parent, metal = 0.2, registry = null) {
    let matInstance;
    if (materialOrColor && materialOrColor.isMaterial) {
      matInstance = materialOrColor;
    } else if (registry && typeof materialOrColor === 'string') {
      matInstance = registry.get(materialOrColor, metal);
    } else {
      matInstance = new THREE.MeshStandardMaterial({
        color: typeof materialOrColor === 'string' ? new THREE.Color(materialOrColor) : materialOrColor,
        roughness: 0.35,
        metalness: metal
      });
    }
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 24), matInstance);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (parent) parent.add(mesh);
    return mesh;
  }

  function makeGroup(x = 0, y = 0, z = 0, parent = null) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    if (parent) parent.add(g);
    return g;
  }

  function tagObject(groupOrMesh, title, text, picksArray) {
    groupOrMesh.traverse(obj => {
      if (obj.isMesh) {
        obj.userData.info = { title, text };
        if (picksArray && !picksArray.includes(obj)) {
          picksArray.push(obj);
        }
      }
    });
    return groupOrMesh;
  }

  // --- Core Module Functions ---

  /**
   * 1. Atmosphere Setup: Background, Fog, Renderer Tone Mapping
   */
  function setupAtmosphere(scene, renderer, config = DEFAULT_CONFIG) {
    scene.background = new THREE.Color(config.background);
    scene.fog = new THREE.Fog(config.fogColor, config.fogNear, config.fogFar);

    if (renderer) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = config.toneMappingExposure;
    }
    return { scene, renderer };
  }

  /**
   * 2. High-Quality Lighting Architecture
   */
  function setupLighting(scene, config = DEFAULT_CONFIG) {
    const lightsGroup = new THREE.Group();
    lightsGroup.name = 'EnvironmentLighting';
    scene.add(lightsGroup);

    // Hemisphere Ambient Fill
    const hemi = new THREE.HemisphereLight(
      config.lighting.hemisphere.sky,
      config.lighting.hemisphere.ground,
      config.lighting.hemisphere.intensity
    );
    lightsGroup.add(hemi);

    // Directional Sun / Key Light with Soft Shadows
    const sunCfg = config.lighting.sun;
    const sun = new THREE.DirectionalLight(sunCfg.color, sunCfg.intensity);
    sun.position.set(sunCfg.position[0], sunCfg.position[1], sunCfg.position[2]);
    sun.castShadow = true;
    sun.shadow.mapSize.set(config.shadowMapSize, config.shadowMapSize);
    Object.assign(sun.shadow.camera, {
      left: -26,
      right: 26,
      top: 24,
      bottom: -24,
      near: 1,
      far: 80
    });
    sun.shadow.bias = config.shadowBias;
    lightsGroup.add(sun);

    // Accent: Electric Cyan Rim / Kicker Light
    const rimCfg = config.lighting.rimLight;
    const rim = new THREE.DirectionalLight(rimCfg.color, rimCfg.intensity);
    rim.position.set(rimCfg.position[0], rimCfg.position[1], rimCfg.position[2]);
    lightsGroup.add(rim);

    // Accent: Roaster Bay Warm Amber Thermal Glow
    const roastCfg = config.lighting.roasterGlow;
    const roasterGlow = new THREE.PointLight(
      roastCfg.color,
      roastCfg.intensity,
      roastCfg.distance,
      roastCfg.decay
    );
    roasterGlow.position.set(roastCfg.position[0], roastCfg.position[1], roastCfg.position[2]);
    lightsGroup.add(roasterGlow);

    // Accent: Packing Workstation Task Light
    const taskCfg = config.lighting.benchTask;
    const benchTask = new THREE.PointLight(
      taskCfg.color,
      taskCfg.intensity,
      taskCfg.distance,
      taskCfg.decay
    );
    benchTask.position.set(taskCfg.position[0], taskCfg.position[1], taskCfg.position[2]);
    lightsGroup.add(benchTask);

    // Accent: Finished Goods Storage Fill
    const storeCfg = config.lighting.storageFill;
    const storageFill = new THREE.PointLight(
      storeCfg.color,
      storeCfg.intensity,
      storeCfg.distance,
      storeCfg.decay
    );
    storageFill.position.set(storeCfg.position[0], storeCfg.position[1], storeCfg.position[2]);
    lightsGroup.add(storageFill);

    return {
      group: lightsGroup,
      sun,
      hemi,
      rim,
      roasterGlow,
      benchTask,
      storageFill
    };
  }

  /**
   * 3. Dark-Slate High-Gloss Epoxy Floor & Grid Seams
   */
  function createEpoxyFloor(scene, materials, config = DEFAULT_CONFIG) {
    const floorGroup = new THREE.Group();
    floorGroup.name = 'FactoryFloor';
    scene.add(floorGroup);

    // 1) Sub-foundation base slab / platform edge
    const subFoundation = makeBox(0, -0.24, 0, 35, 0.4, 26, materials.slabBase, floorGroup);

    // 2) Main Factory Floor Base Slab (29 x 20)
    const mainSlab = makeBox(0, 0, 0, 29, 0.12, 20, materials.epoxyMain, floorGroup);

    // 3) Distinct Zoned Epoxy Floor Slabs (Elevated at y = 0.075 to give tactile layered depth)
    // - Roasting Bay Floor (x: -14 to -6, z: -9.5 to -0.5)
    const roastFloor = makeBox(-10, 0.075, -5, 8, 0.035, 9, materials.epoxyRoaster, floorGroup);

    // - Empty Pouch Supply & Box Folding Corridor Floor (x: -5.5 to 5.5, z: -9.5 to -0.5)
    const supplyFloor = makeBox(0, 0.075, -5, 11, 0.035, 9, materials.epoxySupply, floorGroup);

    // - Packing Cell Workstation Floor (x: -9 to 9, z: -0.5 to 9.5)
    const packingFloor = makeBox(0, 0.075, 4.5, 18, 0.035, 10, materials.epoxyPacking, floorGroup);

    // - Finished Goods Storage Floor (x: 8 to 14, z: -2.7 to 9.3)
    const storageFloor = makeBox(11, 0.075, 3.3, 6, 0.035, 12, materials.epoxyStorage, floorGroup);

    // - Central Transit Walkway Slab (x: -13.5 to 7.5, z: -0.5 to 1.1)
    const walkwayFloor = makeBox(-3, 0.078, 0.3, 21, 0.036, 1.8, materials.epoxyWalkway, floorGroup);

    // - Ergonomic Worker Standing Non-Slip Pad behind packing bench
    const operatorPad = makeBox(-0.8, 0.082, 5.9, 6.2, 0.015, 1.6, materials.epoxyOperatorPad, floorGroup);

    // 4) Subtle Grid Seams / Saw-Cut Expansion Joints (y = 0.095)
    const seamsGroup = new THREE.Group();
    seamsGroup.name = 'GridSeams';
    floorGroup.add(seamsGroup);

    // Longitudinal seams (along X)
    for (let x = -14; x < 15; x += config.floor.gridSpacing) {
      makeBox(x, 0.095, 0, 0.014, 0.012, 20, materials.gridSeam, seamsGroup);
    }
    // Transverse seams (along Z)
    for (let z = -10; z <= 10; z += config.floor.gridSpacing) {
      makeBox(0, 0.095, z, 29, 0.012, 0.014, materials.gridSeam, seamsGroup);
    }

    return {
      group: floorGroup,
      subFoundation,
      mainSlab,
      roastFloor,
      supplyFloor,
      packingFloor,
      storageFloor,
      walkwayFloor,
      operatorPad,
      seamsGroup
    };
  }

  /**
   * 4. Walls and Architectural Structure
   * CRITICAL REQUIREMENT:
   * - Partition wall at x = -5.8 is REMOVED!
   * - Front partitions at [-13, 3] and [-7.2, 3.2] are REMOVED!
   * - Roaster is completely open to empty pack area, box folding area, and main walkway!
   */
  function createWallsAndColumns(scene, materials, config = DEFAULT_CONFIG) {
    const wallsGroup = new THREE.Group();
    wallsGroup.name = 'FactoryWalls';
    scene.add(wallsGroup);

    const partitions = [];
    const columns = [];

    // Outer Back Enclosure Wall (z = -10, width 29, height 3, depth 0.15)
    const backWall = makeBox(0, 1.5, -10, 29, 3, 0.15, materials.wallPanel, wallsGroup);
    // Back wall architectural trims: top coping and dark baseboard
    makeBox(0, 3.05, -10, 29.2, 0.10, 0.22, materials.wallCoping, wallsGroup);
    makeBox(0, 0.12, -9.9, 29, 0.24, 0.06, materials.wallTrim, wallsGroup);

    // Outer Left Enclosure Wall (x = -14.5, width 0.15, height 3, depth 20)
    const leftWall = makeBox(-14.5, 1.5, 0, 0.15, 3, 20, materials.wallPanel, wallsGroup);
    // Left wall top coping and baseboard
    makeBox(-14.5, 3.05, 0, 0.22, 0.10, 20.2, materials.wallCoping, wallsGroup);
    makeBox(-14.4, 0.12, 0, 0.06, 0.24, 20, materials.wallTrim, wallsGroup);

    // Perimeter Structural Columns (Cobalt Steel H-Beams)
    const colX = [-14.3, -5.8, 7.8, 14.3];
    for (const x of colX) {
      // North perimeter columns
      const colN = makeBox(x, 2.3, -9.8, 0.26, 4.6, 0.26, materials.steelColumn, wallsGroup);
      makeBox(x, 0.25, -9.8, 0.32, 0.50, 0.32, materials.safetyYellow, wallsGroup); // Yellow safety base
      columns.push(colN);

      // South perimeter columns
      const colS = makeBox(x, 2.3, 9.8, 0.26, 4.6, 0.26, materials.steelColumn, wallsGroup);
      makeBox(x, 0.25, 9.8, 0.32, 0.50, 0.32, materials.safetyYellow, wallsGroup); // Yellow safety base
      columns.push(colS);
    }

    // --- Partitions ---
    // NOTICE: Partition at x = -5.8 (box(-5.8, .55, -5, .13, 1.1, 10)) has been INTENTIONALLY REMOVED!
    // NOTICE: Front partitions at [-13, 3] and [-7.2, 3.2] along z = 0.25 have been INTENTIONALLY REMOVED!
    // The roaster is completely open to the factory!

    // 1) Finished Goods Storage Dividing Partitions (at x = 7.8, with wide doorway opening z = 3.7 to 7.7)
    // North partition of storage (z: 0 to 3.7)
    const partStoreN = makeBox(7.8, 0.55, 1.85, 0.13, 1.1, 3.7, materials.partition, wallsGroup);
    makeBox(7.8, 1.13, 1.85, 0.16, 0.06, 3.72, materials.partitionTrim, wallsGroup);
    partitions.push(partStoreN);

    // South partition of storage (z: 7.7 to 10)
    const partStoreS = makeBox(7.8, 0.55, 8.85, 0.13, 1.1, 2.3, materials.partition, wallsGroup);
    makeBox(7.8, 1.13, 8.85, 0.16, 0.06, 2.32, materials.partitionTrim, wallsGroup);
    partitions.push(partStoreS);

    // Storage Doorway Header Beam
    const storeHeader = makeBox(7.8, 2.8, 5.65, 0.18, 0.20, 3.9, materials.steelColumn, wallsGroup);

    // 2) Packaging Cell Front Low Guard Partitions (at z = 0.25)
    // NOTE: partPack1 and partPack2 removed so central transit walkway & crosswalks are completely unobstructed.

    return {
      group: wallsGroup,
      backWall,
      leftWall,
      partitions,
      columns,
      storeHeader
    };
  }

  /**
   * 5. High-Vis Painted Yellow Industrial Safety Markings on the Floor
   * Delineates zones clearly:
   * - Roasting bay boundary
   * - Packaging cell boundary
   * - Finished goods boundary
   * - Transit walkway zebra / aisle lines
   */
  function createSafetyMarkings(scene, materials, config = DEFAULT_CONFIG) {
    const markingsGroup = new THREE.Group();
    markingsGroup.name = 'SafetyMarkings';
    scene.add(markingsGroup);

    const yellow = materials.safetyYellow;
    const white = materials.safetyWhite;
    const black = materials.safetyBlack;
    const hazardMat = materials.hazardStripe;

    const y = config.markings.elevationY; // 0.088
    const lw = config.markings.lineWidth; // 0.12
    const lh = config.markings.lineHeight; // 0.015

    // Helper: painted stripe box
    function stripe(cx, cz, w, d, mat = yellow) {
      return makeBox(cx, y, cz, w, lh, d, mat, markingsGroup);
    }

    // --- ZONE 1: ROASTING BAY BOUNDARY (x: -14 to -5.8, z: -9.5 to -0.5) ---
    // Now that walls are gone, crisp high-vis yellow floor markings delineate the bay!
    // East boundary (separating Roasting from Pouch Supply along x = -5.8)
    stripe(-5.8, -5.0, lw, 9.0, yellow);
    // South boundary (along main walkway at z = -0.5, x from -14 to -5.8)
    stripe(-9.9, -0.5, 8.2, lw, yellow);
    // North boundary (along back wall at z = -9.5, x from -14 to -5.8)
    stripe(-9.9, -9.5, 8.2, lw, yellow);

    // Roaster Equipment Caution Pad (Yellow/Black Diagonal Hazard Striping at machine front)
    // Placed at machine output apron: x: -11.5 to -8.5, z: -4.8 to -3.8
    makeBox(-10, y + 0.001, -4.3, 3.2, lh, 1.2, hazardMat, markingsGroup);

    // Corner L-brackets at Roaster Bay perimeter
    // Corner at [-5.8, -0.5]
    stripe(-6.15, -0.7, 0.6, lw, yellow);
    stripe(-5.95, -1.0, lw, 0.6, yellow);
    // Corner at [-14.0, -0.5]
    stripe(-13.7, -0.5, 0.8, lw, yellow);
    stripe(-14.1, -0.9, lw, 0.8, yellow);

    // --- ZONE 2: PACKAGING CELL BOUNDARY (x: -6.0 to 7.6, z: 1.1 to 7.8) ---
    // North boundary along main walkway:
    // Left segment (x: -6.0 to -0.8)
    stripe(-3.4, 1.1, 5.2, lw, yellow);
    // Right segment (x: 1.4 to 7.6)
    stripe(4.5, 1.1, 6.2, lw, yellow);
    // (Entry gap between -0.8 and 1.4 connects directly to the pedestrian zebra crosswalk!)

    // West boundary (along x = -6.0, z from 1.1 to 7.8)
    stripe(-6.0, 4.45, lw, 6.7, yellow);
    // South boundary (along z = 7.8, x from -6.0 to 7.6)
    stripe(0.8, 7.8, 13.6, lw, yellow);
    // East boundary (along storage wall x = 7.6, z from 1.1 to 7.8)
    stripe(7.6, 4.45, lw, 6.7, yellow);

    // Bench Equipment Footprint Clearance Line around Table [-1, 4]
    // Outline: x from -4.8 to 2.8, z from 2.8 to 5.2
    stripe(-1.0, 2.8, 7.4, 0.06, yellow);
    stripe(-1.0, 5.2, 7.4, 0.06, yellow);
    stripe(-4.7, 4.0, 0.06, 2.4, yellow);
    stripe(2.7, 4.0, 0.06, 2.4, yellow);

    // Worker Standing Zone Safety Outline (behind bench at x: -3.8 to 2.2, z: 5.2 to 6.6)
    stripe(-0.8, 5.2, 6.0, 0.05, yellow);
    stripe(-0.8, 6.6, 6.0, 0.05, yellow);
    stripe(-3.8, 5.9, 0.05, 1.4, yellow);
    stripe(2.2, 5.9, 0.05, 1.4, yellow);

    // --- ZONE 3: FINISHED GOODS BOUNDARY (x: 8.0 to 14.0, z: -2.5 to 9.2) ---
    // Perimeter safety boundary enclosing warehouse storage
    stripe(11.0, -2.5, 6.0, lw, yellow); // North border
    stripe(11.0, 9.2, 6.0, lw, yellow);  // South border
    stripe(14.0, 3.35, lw, 11.7, yellow); // East perimeter line

    // Staging Bay 1 (Center around [11, 1.3], size 3.8 x 1.6)
    stripe(11.0, 0.5, 3.8, 0.08, yellow);
    stripe(11.0, 2.1, 3.8, 0.08, yellow);
    stripe(9.1, 1.3, 0.08, 1.6, yellow);
    stripe(12.9, 1.3, 0.08, 1.6, yellow);

    // Staging Bay 2 (Center around [11, 6.5], size 3.8 x 1.6)
    stripe(11.0, 5.7, 3.8, 0.08, yellow);
    stripe(11.0, 7.3, 3.8, 0.08, yellow);
    stripe(9.1, 6.5, 0.08, 1.6, yellow);
    stripe(12.9, 6.5, 0.08, 1.6, yellow);

    // Landing Table Bay (Center around [11, 4.0], size 2.4 x 1.5)
    stripe(11.0, 3.25, 2.4, 0.08, yellow);
    stripe(11.0, 4.75, 2.4, 0.08, yellow);
    stripe(9.8, 4.0, 0.08, 1.5, yellow);
    stripe(12.2, 4.0, 0.08, 1.5, yellow);

    // Storage Doorway Threshold Hazard Pad (Yellow & Black stripes across entrance opening x = 7.8, z: 3.7 to 7.7)
    makeBox(7.8, y + 0.001, 5.7, 0.35, lh, 3.9, hazardMat, markingsGroup);

    // --- ZONE 4: MAIN TRANSIT WALKWAY AISLE LINES & ZEBRA CROSSINGS ---
    // Arterial walkway running east-west from Roaster Bay (x: -13.5) all the way to Storage entrance (x: 7.6)
    // Continuous yellow aisle boundary lines:
    // North aisle line along z = -0.5
    stripe(-3.0, -0.5, 21.0, lw, yellow);
    // South aisle line along z = 1.1
    // (Already segmented with entry gaps above)

    // Pedestrian Zebra Crossings (Alternating high-vis white bars across the walkway)
    function createZebraCrossing(startX, centerZ, barWidth = 0.32, barLength = 1.4, count = 5, spacing = 0.55) {
      for (let i = 0; i < count; i++) {
        const xPos = startX + (i - (count - 1) / 2) * spacing;
        makeBox(xPos, y + 0.001, centerZ, barWidth, lh, barLength, white, markingsGroup);
      }
    }

    // 1) Roaster Output Crosswalk: connects Roasting table to main walkway
    createZebraCrossing(-10.0, 0.3, 0.28, 1.4, 5, 0.52);

    // 2) Pouch Supply Delivery Crosswalk: connects cart aisle to packing bench
    createZebraCrossing(-2.6, 0.3, 0.28, 1.4, 5, 0.52);

    // 3) Box Folding Crosswalk: connects box folding table to main walkway
    createZebraCrossing(4.0, 0.3, 0.28, 1.4, 5, 0.52);

    // 4) Storage Entry Crosswalk: leads worker into finished goods storage
    for (let i = 0; i < 6; i++) {
      const zPos = 4.2 + i * 0.55;
      makeBox(6.8, y + 0.001, zPos, 1.2, lh, 0.28, white, markingsGroup);
    }

    // Directional Walkway Arrow / Chevrons
    function chevron(cx, cz) {
      makeBox(cx - 0.2, y + 0.002, cz - 0.15, 0.4, lh, 0.08, yellow, markingsGroup).rotation.y = 0.6;
      makeBox(cx - 0.2, y + 0.002, cz + 0.15, 0.4, lh, 0.08, yellow, markingsGroup).rotation.y = -0.6;
    }
    chevron(-6.5, 0.3);
    chevron(0.5, 0.3);

    return {
      group: markingsGroup
    };
  }

  /**
   * 6. Digital Twin Floating Signs - Pure Monochrome Brutalist Badges
   */
  function createDigitalTwinSign(text, x, y, z, width = 4.8, parent = null, options = {}) {
    if (typeof document === 'undefined') return null;

    // High-resolution canvas for razor-sharp mipmapped 3D rendering
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');

    const cleanText = (text || '').trim().toUpperCase();

    // 1. Pitch black background (#000000)
    ctx.fillStyle = options.bgColor || '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Crisp 1px solid white border (#ffffff)
    // 4px stroke in 1024x180 canvas translates to a razor-sharp 1px border at 3D sprite scale
    const strokeWidth = options.borderWidth || 4;
    ctx.strokeStyle = options.borderColor || '#ffffff';
    ctx.lineWidth = strokeWidth;
    ctx.strokeRect(strokeWidth / 2, strokeWidth / 2, canvas.width - strokeWidth, canvas.height - strokeWidth);

    // 3. Monospace typography: JetBrains Mono / ui-monospace, bold, all caps
    ctx.fillStyle = options.textColor || '#ffffff';
    let fontSize = options.fontSize || 44;
    ctx.font = `bold ${fontSize}px "JetBrains Mono", ui-monospace, "SFMono-Regular", "Roboto Mono", Menlo, Monaco, Consolas, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Auto-fit font size if text is long to prevent edge clipping
    const maxTextWidth = canvas.width - 64;
    let measuredWidth = ctx.measureText(cleanText).width;
    if (measuredWidth > maxTextWidth) {
      fontSize = Math.floor(fontSize * (maxTextWidth / measuredWidth));
      ctx.font = `bold ${fontSize}px "JetBrains Mono", ui-monospace, "SFMono-Regular", "Roboto Mono", Menlo, Monaco, Consolas, monospace`;
    }

    ctx.fillText(cleanText, canvas.width / 2, canvas.height / 2);

    // High quality canvas texture with anisotropic filtering and mipmapping
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 8;
    if (THREE.sRGBEncoding) texture.encoding = THREE.sRGBEncoding;

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      depthTest: true,
      depthWrite: false,
      transparent: true
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(x, y, z);
    const aspect = canvas.height / canvas.width;
    sprite.scale.set(width, width * aspect, 1);

    if (parent) parent.add(sprite);
    return sprite;
  }

  function setupSigns(scene, config = DEFAULT_CONFIG) {
    const signsGroup = new THREE.Group();
    signsGroup.name = 'FactorySigns';
    scene.add(signsGroup);

    // Pure Monochrome Brutalist Badges with clean place names
    const signs = {
      roasting: createDigitalTwinSign('ROASTING BAY', -10, 4.3, -7.5, 3.8, signsGroup),
      emptyPacks: createDigitalTwinSign('EMPTY POUCHES', -2.5, 4.3, -7.5, 3.8, signsGroup),
      boxFolding: createDigitalTwinSign('BOX FOLDING', 4, 4.3, -7.5, 3.6, signsGroup),
      packingCell: createDigitalTwinSign('PACKAGING BENCH', -1, 5.8, 4.0, 4.0, signsGroup),
      finishedGoods: createDigitalTwinSign('FINISHED GOODS', 11, 4.3, 2.5, 4.0, signsGroup),
      storageAccess: createDigitalTwinSign('STORAGE ACCESS', 7.8, 3.4, 5.65, 3.6, signsGroup)
    };

    return {
      group: signsGroup,
      signs,
      createSign: (text, x, y, z, w, parent = signsGroup, options = {}) => createDigitalTwinSign(text, x, y, z, w, parent, options)
    };
  }


  /**
   * 7. Camera Controller with Orbit, Pan, Zoom, and Smooth Preset Transitions
   */
  function setupCameraController(camera, renderer, options = {}) {
    const domElement = renderer.domElement;
    const config = options.config || DEFAULT_CONFIG;

    // --- Mode State: 'orbit' | 'firstPerson' | 'transition' ---
    let mode = 'orbit';
    let transitionTargetMode = null; // 'orbit' | 'firstPerson'

    // --- Camera Spherical Coordinate State (Orbit Mode) ---
    const state = {
      target: new THREE.Vector3(0, 0, 0),
      radius: 42,
      theta: 0.65,
      phi: 0.80,
      activePreset: 'overview',
      minRadius: 5,
      maxRadius: 68,
      minPhi: 0.015,
      maxPhi: 1.48
    };

    // --- Orbit Preset Tween State ---
    const tween = {
      active: false,
      startTime: 0,
      duration: 650,
      startTarget: new THREE.Vector3(),
      endTarget: new THREE.Vector3(),
      startRadius: 42,
      endRadius: 42,
      startTheta: 0.65,
      endTheta: 0.65,
      startPhi: 0.80,
      endPhi: 0.80
    };

    // --- First-Person Mode State ---
    const EYE_HEIGHT = 2.20; // 25% taller than worker (~1.76m) to clearly observe workstation operations
    const X_MIN = -14;
    const X_MAX = 14;
    const Z_MIN = -11;
    const Z_MAX = 9;
    const PITCH_MIN = -1.45; // ~ -83 deg (look up)
    const PITCH_MAX = 1.45;  // ~ +83 deg (look down)

    const fpPosition = new THREE.Vector3(0, EYE_HEIGHT, 3);
    let fpYaw = 0;   // In radians, around world Y axis (0 = looking down -Z)
    let fpPitch = 0; // In radians, looking up/down

    const moveKeys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false
    };

    // --- Mode Transition Tween State ---
    const modeTransition = {
      active: false,
      startTime: 0,
      duration: 650,
      startPos: new THREE.Vector3(),
      endPos: new THREE.Vector3(),
      startQuat: new THREE.Quaternion(),
      endQuat: new THREE.Quaternion(),
      destPreset: null,
      destTarget: new THREE.Vector3(),
      destRadius: 42,
      destTheta: 0.65,
      destPhi: 0.80,
      destFpYaw: 0,
      destFpPitch: 0
    };

    function cubicEaseOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function cancelTween() {
      tween.active = false;
    }

    function cancelModeTransition() {
      modeTransition.active = false;
    }

    function clampFloorBounds(pos) {
      pos.x = Math.max(X_MIN, Math.min(X_MAX, pos.x));
      pos.y = EYE_HEIGHT;
      pos.z = Math.max(Z_MIN, Math.min(Z_MAX, pos.z));
    }

    function updateCameraPosition() {
      const { target, radius, theta, phi } = state;
      camera.position.set(
        target.x + radius * Math.sin(phi) * Math.sin(theta),
        target.y + radius * Math.cos(phi),
        target.z + radius * Math.sin(phi) * Math.cos(theta)
      );
      camera.lookAt(target);
    }

    // --- Crosshair DOM Element Management ---
    let crosshairEl = null;
    let crosshairHintEl = null;

    function ensureCrosshairDOM() {
      if (typeof document === 'undefined') return null;
      if (!crosshairEl) {
        crosshairEl = document.getElementById('digital-twin-fp-crosshair');
      }
      if (!crosshairEl && domElement && domElement.parentElement) {
        const container = domElement.parentElement;
        crosshairEl = document.createElement('div');
        crosshairEl.id = 'digital-twin-fp-crosshair';
        crosshairEl.style.cssText = [
          'position: absolute',
          'top: 50%',
          'left: 50%',
          'transform: translate(-50%, -50%)',
          'pointer-events: none',
          'z-index: 100',
          'display: none',
          'flex-direction: column',
          'align-items: center',
          'justify-content: center',
          'user-select: none'
        ].join(';');

        crosshairEl.innerHTML = `
          <div class="fp-reticle" style="position: relative; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">
            <span class="fp-dot" style="width: 4px; height: 4px; background: #ffffff; border-radius: 50%; box-shadow: 0 0 3px #000000;"></span>
            <span style="position: absolute; top: 0; left: 9px; width: 2px; height: 5px; background: #ffffff;"></span>
            <span style="position: absolute; bottom: 0; left: 9px; width: 2px; height: 5px; background: #ffffff;"></span>
            <span style="position: absolute; left: 0; top: 9px; height: 2px; width: 5px; background: #ffffff;"></span>
            <span style="position: absolute; right: 0; top: 9px; height: 2px; width: 5px; background: #ffffff;"></span>
          </div>
        `;
        container.appendChild(crosshairEl);
      }
      crosshairHintEl = null;
      return crosshairEl;
    }

    function setCrosshairVisible(visible) {
      ensureCrosshairDOM();
      if (crosshairEl) {
        crosshairEl.style.display = visible ? 'flex' : 'none';
        if (!visible && crosshairHintEl) {
          crosshairHintEl.style.display = 'none';
        }
      }
    }

    // --- Pointer Lock Helper ---
    function isPointerLocked() {
      return typeof document !== 'undefined' && document.pointerLockElement === domElement;
    }

    function requestPointerLock() {
      if (domElement && domElement.requestPointerLock) {
        try {
          domElement.requestPointerLock();
        } catch (e) {}
      }
    }

    function exitPointerLock() {
      if (typeof document !== 'undefined' && document.exitPointerLock && isPointerLocked()) {
        try {
          document.exitPointerLock();
        } catch (e) {}
      }
    }

    // --- Central Raycasting Proximity Inspection Helpers ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function getInspectionTarget(maxDistance = 8.0) {
      if (!options.picks || options.picks.length === 0) return null;
      camera.updateMatrixWorld(true);
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

      const hits = raycaster.intersectObjects(options.picks, true);
      for (let i = 0; i < hits.length; i++) {
        const hit = hits[i];
        if (hit.distance > maxDistance) break;
        let o = hit.object;
        let visible = true;
        while (o) {
          if (!o.visible) {
            visible = false;
            break;
          }
          o = o.parent;
        }
        if (!visible) continue;

        if (hit.object.userData && hit.object.userData.info) {
          return {
            hit,
            object: hit.object,
            info: hit.object.userData.info,
            distance: hit.distance
          };
        }
      }
      return null;
    }

    function inspectCenter(maxDistance = 8.0) {
      const target = getInspectionTarget(maxDistance);
      if (target) {
        if (options.onInspect) {
          options.onInspect(target.info, target.hit);
        } else if (typeof document !== 'undefined') {
          const titleEl = document.getElementById('objectTitle');
          const textEl = document.getElementById('objectText');
          if (titleEl) titleEl.textContent = target.info.title;
          if (textEl) textEl.textContent = target.info.text;
        }
        return target;
      }
      return null;
    }

    function updateCrosshairHUD() {
      // Clean minimal HUD: no floating inspection text
    }

    // --- Synchronize UI Toolbar Buttons ---
    function syncToolbarUI(presetName = null, isFP = false) {
      if (typeof document === 'undefined') return;
      ['overview', 'bench', 'top', 'roaster', 'storage'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.classList.toggle('on', !isFP && id === presetName);
      });
      const walkBtn = document.getElementById('walk') || document.getElementById('walkBtn');
      if (walkBtn) walkBtn.classList.toggle('on', isFP);
      const topWalkBtn = document.getElementById('topWalkBtn');
      if (topWalkBtn) topWalkBtn.classList.toggle('active', isFP);

      const crosshair = document.getElementById('walkCrosshair');
      if (crosshair) crosshair.style.display = isFP ? 'block' : 'none';

      const prompt = document.getElementById('walkPrompt');
      if (prompt) prompt.style.display = 'none';
    }

    function isFirstPerson() {
      return mode === 'firstPerson' || (mode === 'transition' && transitionTargetMode === 'firstPerson');
    }

    function enterFirstPerson(opts = {}) {
      if (mode === 'firstPerson' && !opts.position && !opts.lookAt) return true;

      cancelTween();

      // Determine destination FP position
      const destPos = new THREE.Vector3();
      if (opts.position) {
        if (Array.isArray(opts.position)) {
          destPos.set(opts.position[0], EYE_HEIGHT, opts.position[opts.position.length === 3 ? 2 : 1]);
        } else if (opts.position.isVector3) {
          destPos.copy(opts.position);
        }
      } else {
        // Natural vantage based on current target or preset
        if (state.target.x < -5) {
          destPos.set(-9.5, EYE_HEIGHT, -2.8);
        } else if (state.target.x > 6) {
          destPos.set(8.8, EYE_HEIGHT, 3.8);
        } else if (state.target.z > 2) {
          destPos.set(-1.0, EYE_HEIGHT, 6.2);
        } else {
          destPos.set(0, EYE_HEIGHT, 2.5);
        }
      }
      clampFloorBounds(destPos);

      // Determine look direction
      const lookTarget = opts.lookAt ? (opts.lookAt.isVector3 ? opts.lookAt : new THREE.Vector3(...opts.lookAt)) : state.target;
      const dx = lookTarget.x - destPos.x;
      const dy = lookTarget.y - destPos.y;
      const dz = lookTarget.z - destPos.z;
      const destYaw = Math.atan2(-dx, -dz);
      const distXZ = Math.hypot(dx, dz);
      const destPitch = Math.max(PITCH_MIN, Math.min(PITCH_MAX, Math.atan2(dy, Math.max(0.1, distXZ))));

      const smooth = opts.smooth !== false;
      const duration = opts.duration || 650;

      if (!smooth) {
        cancelModeTransition();
        mode = 'firstPerson';
        transitionTargetMode = null;
        fpPosition.copy(destPos);
        fpYaw = destYaw;
        fpPitch = destPitch;
        camera.position.copy(fpPosition);
        camera.rotation.set(fpPitch, fpYaw, 0, 'YXZ');
        camera.updateMatrixWorld(true);
        setCrosshairVisible(true);
        syncToolbarUI(null, true);
        return true;
      }

      // Smooth transition to First-Person
      mode = 'transition';
      transitionTargetMode = 'firstPerson';
      modeTransition.active = true;
      modeTransition.startTime = performance.now();
      modeTransition.duration = duration;
      modeTransition.startPos.copy(camera.position);
      modeTransition.endPos.copy(destPos);
      modeTransition.startQuat.copy(camera.quaternion);

      const targetEuler = new THREE.Euler(destPitch, destYaw, 0, 'YXZ');
      modeTransition.endQuat.setFromEuler(targetEuler);
      modeTransition.destFpYaw = destYaw;
      modeTransition.destFpPitch = destPitch;

      syncToolbarUI(null, true);
      return true;
    }

    function exitFirstPerson(presetName = 'overview', smooth = true) {
      if (mode === 'orbit' && !modeTransition.active) return false;

      setCrosshairVisible(false);
      exitPointerLock();

      const preset = config.cameraPresets[presetName] || config.cameraPresets.overview;
      const destTarget = new THREE.Vector3(...preset.target);
      const destRadius = preset.radius;
      const destTheta = preset.theta;
      const destPhi = preset.phi;

      const destPos = new THREE.Vector3(
        destTarget.x + destRadius * Math.sin(destPhi) * Math.sin(destTheta),
        destTarget.y + destRadius * Math.cos(destPhi),
        destTarget.z + destRadius * Math.sin(destPhi) * Math.cos(destTheta)
      );

      // Compute destination quaternion looking at destTarget
      const lookMatrix = new THREE.Matrix4().lookAt(destPos, destTarget, new THREE.Vector3(0, 1, 0));
      const destQuat = new THREE.Quaternion().setFromRotationMatrix(lookMatrix);

      if (!smooth) {
        cancelModeTransition();
        mode = 'orbit';
        transitionTargetMode = null;
        state.target.copy(destTarget);
        state.radius = destRadius;
        state.theta = destTheta;
        state.phi = destPhi;
        state.activePreset = presetName;
        updateCameraPosition();
        syncToolbarUI(presetName, false);
        return true;
      }

      mode = 'transition';
      transitionTargetMode = 'orbit';
      modeTransition.active = true;
      modeTransition.startTime = performance.now();
      modeTransition.duration = 650;
      modeTransition.startPos.copy(camera.position);
      modeTransition.endPos.copy(destPos);
      modeTransition.startQuat.copy(camera.quaternion);
      modeTransition.endQuat.copy(destQuat);
      modeTransition.destTarget.copy(destTarget);
      modeTransition.destRadius = destRadius;
      modeTransition.destTheta = destTheta;
      modeTransition.destPhi = destPhi;
      modeTransition.destPreset = presetName;

      syncToolbarUI(presetName, false);
      return true;
    }

    function setPreset(presetName, smooth = true) {
      if (presetName === 'walk') {
        return enterFirstPerson({ smooth });
      }

      // If in First-Person or transitioning to First-Person, smoothly exit to preset
      if (mode === 'firstPerson' || (mode === 'transition' && transitionTargetMode === 'firstPerson')) {
        return exitFirstPerson(presetName, smooth);
      }

      const preset = config.cameraPresets[presetName];
      if (!preset) return false;

      cancelModeTransition();
      state.activePreset = presetName;
      syncToolbarUI(presetName, false);

      const destTarget = new THREE.Vector3(...preset.target);
      const destRadius = preset.radius;
      const destTheta = preset.theta;
      const destPhi = preset.phi;

      if (!smooth) {
        cancelTween();
        state.target.copy(destTarget);
        state.radius = destRadius;
        state.theta = destTheta;
        state.phi = destPhi;
        updateCameraPosition();
        return true;
      }

      // Start smooth tween
      tween.active = true;
      tween.startTime = performance.now();
      tween.duration = 650;
      tween.startTarget.copy(state.target);
      tween.endTarget.copy(destTarget);
      tween.startRadius = state.radius;
      tween.endRadius = destRadius;
      tween.startTheta = state.theta;
      tween.endTheta = destTheta;
      tween.startPhi = state.phi;
      tween.endPhi = destPhi;

      return true;
    }

    function updateFirstPerson(dt = 0.016) {
      if (mode !== 'firstPerson') return;

      const sinY = Math.sin(fpYaw);
      const cosY = Math.cos(fpYaw);
      const forwardX = -sinY;
      const forwardZ = -cosY;
      const rightX = cosY;
      const rightZ = -sinY;

      let moveX = 0;
      let moveZ = 0;

      if (moveKeys.forward) {
        moveX += forwardX;
        moveZ += forwardZ;
      }
      if (moveKeys.backward) {
        moveX -= forwardX;
        moveZ -= forwardZ;
      }
      if (moveKeys.left) {
        moveX -= rightX;
        moveZ -= rightZ;
      }
      if (moveKeys.right) {
        moveX += rightX;
        moveZ += rightZ;
      }

      const len = Math.hypot(moveX, moveZ);
      if (len > 1e-4) {
        moveX /= len;
        moveZ /= len;
        const speed = moveKeys.sprint ? 5.8 : 3.4; // m/s
        fpPosition.x += moveX * speed * dt;
        fpPosition.z += moveZ * speed * dt;
      }

      clampFloorBounds(fpPosition);

      camera.position.copy(fpPosition);
      camera.rotation.set(fpPitch, fpYaw, 0, 'YXZ');
      camera.updateMatrixWorld(true);

      updateCrosshairHUD();
    }

    let lastFrameTime = performance.now();

    function update(now = performance.now()) {
      const dt = Math.min(0.1, Math.max(0.001, (now - lastFrameTime) / 1000));
      lastFrameTime = now;

      if (mode === 'transition') {
        const elapsed = now - modeTransition.startTime;
        const progress = Math.min(1, Math.max(0, elapsed / modeTransition.duration));
        const ease = cubicEaseOut(progress);

        camera.position.lerpVectors(modeTransition.startPos, modeTransition.endPos, ease);
        camera.quaternion.slerpQuaternions(modeTransition.startQuat, modeTransition.endQuat, ease);

        if (progress >= 1) {
          modeTransition.active = false;
          if (transitionTargetMode === 'firstPerson') {
            mode = 'firstPerson';
            transitionTargetMode = null;
            fpPosition.copy(modeTransition.endPos);
            fpYaw = modeTransition.destFpYaw;
            fpPitch = modeTransition.destFpPitch;
            camera.position.copy(fpPosition);
            camera.rotation.set(fpPitch, fpYaw, 0, 'YXZ');
            setCrosshairVisible(true);
          } else if (transitionTargetMode === 'orbit') {
            mode = 'orbit';
            transitionTargetMode = null;
            state.target.copy(modeTransition.destTarget);
            state.radius = modeTransition.destRadius;
            state.theta = modeTransition.destTheta;
            state.phi = modeTransition.destPhi;
            state.activePreset = modeTransition.destPreset;
            updateCameraPosition();
          }
        }
        return;
      }

      if (mode === 'firstPerson') {
        updateFirstPerson(dt);
        return;
      }

      // Orbit mode update
      if (tween.active) {
        const elapsed = now - tween.startTime;
        const progress = Math.min(1, Math.max(0, elapsed / tween.duration));
        const ease = cubicEaseOut(progress);

        state.target.lerpVectors(tween.startTarget, tween.endTarget, ease);
        state.radius = THREE.MathUtils.lerp(tween.startRadius, tween.endRadius, ease);
        state.theta = THREE.MathUtils.lerp(tween.startTheta, tween.endTheta, ease);
        state.phi = THREE.MathUtils.lerp(tween.startPhi, tween.endPhi, ease);

        if (progress >= 1) {
          tween.active = false;
        }
      }
      updateCameraPosition();
    }

    // --- Interactive Mouse / Pointer Event Handling ---
    let drag = null;

    function onPointerDown(e) {
      if (mode === 'transition') return;

      if (mode === 'firstPerson') {
        if (!isPointerLocked() && domElement.requestPointerLock) {
          requestPointerLock();
        }
        drag = {
          x: e.clientX,
          y: e.clientY,
          startX: e.clientX,
          startY: e.clientY,
          button: e.button
        };
        return;
      }

      // Orbit mode
      cancelTween();
      drag = {
        x: e.clientX,
        y: e.clientY,
        startX: e.clientX,
        startY: e.clientY,
        button: e.button
      };
      if (domElement.setPointerCapture) {
        domElement.setPointerCapture(e.pointerId);
      }
    }

    function onPointerMove(e) {
      if (mode === 'firstPerson') {
        if (isPointerLocked()) {
          const sens = 0.0022;
          fpYaw -= (e.movementX || 0) * sens;
          fpPitch -= (e.movementY || 0) * sens;
          fpPitch = Math.max(PITCH_MIN, Math.min(PITCH_MAX, fpPitch));
          camera.rotation.set(fpPitch, fpYaw, 0, 'YXZ');
          updateCrosshairHUD();
          return;
        }

        // Mouse drag look when pointer lock is not active
        if (drag) {
          const dx = e.clientX - drag.x;
          const dy = e.clientY - drag.y;
          const sens = 0.0035;
          fpYaw -= dx * sens;
          fpPitch -= dy * sens;
          fpPitch = Math.max(PITCH_MIN, Math.min(PITCH_MAX, fpPitch));
          camera.rotation.set(fpPitch, fpYaw, 0, 'YXZ');
          drag.x = e.clientX;
          drag.y = e.clientY;
          updateCrosshairHUD();
        }
        return;
      }

      // Orbit mode
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;

      // Pan: Right drag or Shift + Left drag
      if (drag.button === 2 || e.shiftKey) {
        const panFactor = state.radius * 0.0014;
        const cosT = Math.cos(state.theta);
        const sinT = Math.sin(state.theta);

        state.target.x += (-dx * cosT + dy * sinT) * panFactor;
        state.target.z += (dx * sinT + dy * cosT) * panFactor;
      } else {
        // Orbit: Left drag
        state.theta -= dx * 0.0065;
        state.phi = Math.max(state.minPhi, Math.min(state.maxPhi, state.phi + dy * 0.0065));
      }

      drag.x = e.clientX;
      drag.y = e.clientY;
      updateCameraPosition();
    }

    function onPointerUp(e) {
      if (mode === 'firstPerson') {
        if (drag) {
          const moveDist = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY);
          if (moveDist < 6) {
            inspectCenter(8.0);
          }
        }
        drag = null;
        return;
      }

      // Orbit mode
      if (drag) {
        const moveDist = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY);
        // Click detection for inspector picks
        if (moveDist < 6 && options.picks && options.picks.length > 0) {
          const rect = domElement.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);

          const hits = raycaster.intersectObjects(options.picks);
          const hit = hits.find(h => {
            let o = h.object;
            while (o) {
              if (!o.visible) return false;
              o = o.parent;
            }
            return true;
          });

          if (hit && hit.object.userData && hit.object.userData.info) {
            const info = hit.object.userData.info;
            if (options.onInspect) {
              options.onInspect(info, hit);
            } else if (typeof document !== 'undefined') {
              const titleEl = document.getElementById('objectTitle');
              const textEl = document.getElementById('objectText');
              if (titleEl) titleEl.textContent = info.title;
              if (textEl) textEl.textContent = info.text;
            }
          }
        }
      }
      drag = null;
    }

    function onPointerCancel() {
      drag = null;
    }

    function onWheel(e) {
      if (mode === 'firstPerson') return; // Do not zoom in first person
      e.preventDefault();
      cancelTween();
      const zoomFactor = Math.exp(e.deltaY * 0.001);
      state.radius = Math.max(state.minRadius, Math.min(state.maxRadius, state.radius * zoomFactor));
      updateCameraPosition();
    }

    function onContextMenu(e) {
      e.preventDefault();
    }

    // --- Keyboard Event Handling ---
    function onKeyDown(e) {
      if (typeof document !== 'undefined' && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      const key = (e.key || '').toLowerCase();
      const code = e.code || '';

      if (mode === 'firstPerson') {
        if (key === 'e' || code === 'KeyE') {
          e.preventDefault();
          inspectCenter(8.0);
          return;
        }
        if (key === 'escape' || code === 'Escape') {
          if (isPointerLocked()) {
            exitPointerLock();
          } else {
            exitFirstPerson('overview', true);
          }
          return;
        }
        if (key === 'w' || code === 'KeyW' || key === 'arrowup') {
          moveKeys.forward = true;
          e.preventDefault();
        }
        if (key === 's' || code === 'KeyS' || key === 'arrowdown') {
          moveKeys.backward = true;
          e.preventDefault();
        }
        if (key === 'a' || code === 'KeyA') {
          moveKeys.left = true;
          e.preventDefault();
        }
        if (key === 'd' || code === 'KeyD') {
          moveKeys.right = true;
          e.preventDefault();
        }
        if (key === 'shift' || code === 'ShiftLeft' || code === 'ShiftRight') {
          moveKeys.sprint = true;
        }
      }
    }

    function onKeyUp(e) {
      const key = (e.key || '').toLowerCase();
      const code = e.code || '';

      if (key === 'w' || code === 'KeyW' || key === 'arrowup') moveKeys.forward = false;
      if (key === 's' || code === 'KeyS' || key === 'arrowdown') moveKeys.backward = false;
      if (key === 'a' || code === 'KeyA') moveKeys.left = false;
      if (key === 'd' || code === 'KeyD') moveKeys.right = false;
      if (key === 'shift' || code === 'ShiftLeft' || code === 'ShiftRight') moveKeys.sprint = false;
    }

    function onWindowBlur() {
      moveKeys.forward = false;
      moveKeys.backward = false;
      moveKeys.left = false;
      moveKeys.right = false;
      moveKeys.sprint = false;
    }

    function onPointerLockChange() {
      // Retain cursor state synchronization
    }

    // Attach listeners
    domElement.addEventListener('contextmenu', onContextMenu);
    domElement.addEventListener('pointerdown', onPointerDown);
    domElement.addEventListener('pointermove', onPointerMove);
    domElement.addEventListener('pointerup', onPointerUp);
    domElement.addEventListener('pointercancel', onPointerCancel);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      window.addEventListener('blur', onWindowBlur);
    }
    if (typeof document !== 'undefined') {
      document.addEventListener('pointerlockchange', onPointerLockChange);
    }

    // Initial positioning
    updateCameraPosition();

    return {
      state,
      tween,
      setPreset,
      view: (name, smooth = true) => setPreset(name, smooth),
      update,
      cancelTween,
      updateCameraPosition,

      // First-Person Mode APIs
      enterFirstPerson,
      exitFirstPerson,
      isFirstPerson,
      updateFirstPerson,
      inspectCenter,
      getInspectionTarget,
      toggleFirstPerson: () => (isFirstPerson() ? exitFirstPerson('overview', true) : enterFirstPerson()),
      requestPointerLock,
      exitPointerLock,
      getFpPosition: () => fpPosition.clone(),
      getFpLook: () => ({ yaw: fpYaw, pitch: fpPitch }),

      // Backwards-compatibility aliases
      isWalkMode: () => isFirstPerson(),
      setWalkMode: (enable, opts) => (enable ? enterFirstPerson(opts) : exitFirstPerson('overview', true)),
      toggleWalkMode: (enable) => (isFirstPerson() ? exitFirstPerson('overview', true) : enterFirstPerson()),
      getWalkState: () => ({ position: fpPosition, yaw: fpYaw, pitch: fpPitch, keys: moveKeys }),

      dispose: () => {
        domElement.removeEventListener('contextmenu', onContextMenu);
        domElement.removeEventListener('pointerdown', onPointerDown);
        domElement.removeEventListener('pointermove', onPointerMove);
        domElement.removeEventListener('pointerup', onPointerUp);
        domElement.removeEventListener('pointercancel', onPointerCancel);
        domElement.removeEventListener('wheel', onWheel);

        if (typeof window !== 'undefined') {
          window.removeEventListener('keydown', onKeyDown);
          window.removeEventListener('keyup', onKeyUp);
          window.removeEventListener('blur', onWindowBlur);
        }
        if (typeof document !== 'undefined') {
          document.removeEventListener('pointerlockchange', onPointerLockChange);
        }
        if (crosshairEl && crosshairEl.parentElement) {
          crosshairEl.parentElement.removeChild(crosshairEl);
          crosshairEl = null;
        }
      }
    };
  }

  /**
   * 8. Master Initializer: combines atmosphere, lights, floor, markings, walls, and camera
   */
  function createSceneEnvironment(options = {}) {
    const config = Object.assign({}, DEFAULT_CONFIG, options.config || {});

    // Obtain or construct Three.js Scene, Camera, Renderer
    let scene = options.scene;
    let camera = options.camera;
    let renderer = options.renderer;

    if (!scene) {
      scene = new THREE.Scene();
    }

    if (!camera) {
      camera = new THREE.PerspectiveCamera(43, 1, 0.1, 180);
    }

    if (!renderer && options.canvas) {
      renderer = new THREE.WebGLRenderer({
        canvas: options.canvas,
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance'
      });
      const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
      renderer.setPixelRatio(Math.min(dpr, 2.0));
      const parent = options.canvas.parentElement;
      if (parent) {
        const r = parent.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          renderer.setSize(r.width, r.height, false);
          camera.aspect = r.width / r.height;
          camera.updateProjectionMatrix();
        }
      }
    }

    // Material Registry
    const materials = options.materials || createMaterialRegistry(config);

    // Setup Atmosphere & Tone Mapping
    setupAtmosphere(scene, renderer, config);

    // Setup Lighting
    const lights = setupLighting(scene, config);

    // Create Dark-Slate High-Gloss Epoxy Floor & Seams
    const floor = createEpoxyFloor(scene, materials, config);

    // Create Walls, Columns & Partitions (Open Roaster!)
    const walls = createWallsAndColumns(scene, materials, config);

    // Create High-Vis Painted Yellow Industrial Safety Markings
    const markings = createSafetyMarkings(scene, materials, config);

    // Create Digital Twin Floating Signs
    const signs = setupSigns(scene, config);

    // Setup Camera Controller
    let cameraController = null;
    if (renderer && renderer.domElement) {
      cameraController = setupCameraController(camera, renderer, {
        config,
        picks: options.picks || [],
        onInspect: options.onInspect
      });
    }

    // Responsive Canvas Resize Observer Helper
    function resize() {
      if (!renderer || !renderer.domElement) return;
      const parent = renderer.domElement.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    }

    // Wall Height Toggle Helper (low vs high)
    let wallHigh = false;
    function toggleWalls(high = null) {
      wallHigh = high !== null ? high : !wallHigh;
      walls.partitions.forEach(w => {
        w.scale.y = wallHigh ? 2.7 : 1.0;
        w.position.y = wallHigh ? 1.485 : 0.55;
      });
      return wallHigh;
    }

    // Trigger initial sizing
    resize();

    return {
      scene,
      camera,
      renderer,
      config,
      materials,
      lights,
      floor,
      walls,
      partitions: walls.partitions,
      columns: walls.columns,
      markings,
      signs: signs.group,
      signMap: signs.signs,
      cameraController,
      // Preset view helper compatible with existing factoryAPI.view('preset')
      view: (v, smooth = true) => {
        if (v === 'walk') {
          if (cameraController) cameraController.enterFirstPerson();
        } else {
          if (cameraController && cameraController.isFirstPerson && cameraController.isFirstPerson()) {
            cameraController.exitFirstPerson(v, smooth);
          } else if (cameraController) {
            cameraController.setPreset(v, smooth);
          }
        }
      },
      enterFirstPerson: (opts) => cameraController && cameraController.enterFirstPerson(opts),
      exitFirstPerson: (preset, smooth) => cameraController && cameraController.exitFirstPerson(preset, smooth),
      isFirstPerson: () => (cameraController ? cameraController.isFirstPerson() : false),
      updateFirstPerson: (dt) => cameraController && cameraController.updateFirstPerson(dt),
      inspectCenter: (maxDist) => cameraController && cameraController.inspectCenter(maxDist),
      getInspectionTarget: (maxDist) => cameraController && cameraController.getInspectionTarget(maxDist),
      toggleFirstPerson: () => cameraController && cameraController.toggleFirstPerson(),
      toggleWalkMode: (enable) => cameraController ? cameraController.toggleWalkMode(enable) : false,
      setWalkMode: (enable, opts) => cameraController ? cameraController.setWalkMode(enable, opts) : false,
      isWalkMode: () => cameraController ? cameraController.isWalkMode() : false,
      toggleWalls,
      resize,
      helpers: {
        box: (x, y, z, w, h, d, c, p = scene, m = 0) => makeBox(x, y, z, w, h, d, c, p, m, materials),
        cyl: (x, y, z, r, h, c, p = scene, m = 0.2) => makeCyl(x, y, z, r, h, c, p, m, materials),
        group: (x = 0, y = 0, z = 0, p = scene) => makeGroup(x, y, z, p),
        tag: (g, t, txt, picks) => tagObject(g, t, txt, picks || options.picks),
        sign: (t, x, y, z, w = 4.8, p = signs.group, opts = {}) => createDigitalTwinSign(t, x, y, z, w, p, opts)
      }
    };
  }

  // Exports object
  const SceneEnvironment = {
    DEFAULT_CONFIG,
    createMaterialRegistry,
    setupAtmosphere,
    setupLighting,
    createEpoxyFloor,
    createWallsAndColumns,
    createSafetyMarkings,
    createDigitalTwinSign,
    setupSigns,
    setupCameraController,
    createSceneEnvironment,
    // Utilities
    makeBox,
    makeCyl,
    makeGroup,
    tagObject
  };

  return SceneEnvironment;
});
