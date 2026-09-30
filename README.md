# CASHEW WORKS // DIGITAL TWIN 3D SIMULATION

Modern industrial digital-twin simulation and lean workstation visualization for cashew nut packaging operations (IE-101 Industrial Engineering).

---

## 🚀 Key Upgrades & Features

### 1. 🏭 Open-Concept Factory Layout (Roaster Wall Removed)
- **Seamless Integration**: The enclosing partition walls around the continuous roaster (`x = -5.8` and front barriers) have been completely removed.
- **Unified Floor Plan**: The roasting bay is now directly connected to the empty pouch supply rack, carton folding table, and central transit walkway.
- **Safety Markings**: High-visibility OSHA safety yellow boundary lines (`#facc15`) and pedestrian zebra crosswalks delineate functional cells without restricting visual or physical flow.

### 2. 🌌 Modern Digital Twin 3D Aesthetics
- **Dark-Slate High-Gloss Epoxy Floor**: Multi-layered PBR materials with subtle specularity, reflections, and 2-meter saw-cut expansion joints.
- **Studio Industrial Lighting**: Multi-point lighting with directional sun, soft shadows (`PCFSoftShadowMap`), cyan kicker rim light, thermal amber roaster glow, and workstation task lighting.
- **Cinematic Atmosphere**: Dark slate canvas background (`#0b0f17`) with matching industrial depth fog.

### 3. 🎛️ Floating Glassmorphic HUD & Telemetry Cockpit
- **Translucent Glass Panels**: High-end frosted glass (`backdrop-filter: blur(16px)`, `rgba(15, 23, 42, 0.75)`).
- **Header Telemetry**: Active simulation status indicator, Takt pace target badge (`17.78m / CTN`), dataset summary (`300 Batches · μ = 25.4m`), and snapshot export action.
- **Interactive Sidebar Cockpit**:
  - Step progression stepper across all 10 stages (Orientation & Measured Cycle).
  - 12-second deterministic animation clock with scrubber slider and replay action.
  - Interactive Batch Selector supporting all 300 recorded production batches.
  - Live Takt Delta badge calculating `+/- %` vs. 17.78 min target.
  - Color-coded arrival timestamp chips for Cashews, Pouches, and Carton.
  - Process stage duration bars with active-step animated highlights.
  - Dynamic Equipment Inspector displaying technical specs on raycast click.

### 4. ⚙️ Rich 3D Mechanical Detailing
- **Continuous Roaster**: Dual-tier insulated furnace, top feed hopper with safety grating, stainless exhaust ductwork, side NEMA 4X PLC cabinet with glowing LEDs, and inspection viewport with glowing combustion bed.
- **Packing Workstation**: Extruded aluminum T-slot frame with brushed stainless steel tabletop, digital precision scale with LED weight display (`150.0 g`), hinged heat sealer with Teflon strip, and product label roll dispenser.
- **Supply Cart**: Polyurethane swivel caster wheels, 2-tier wire frame, and tubular push handle.
- **Storage Racks**: Heavy-duty teardrop pallet uprights with safety orange load beams and corrugated shipping cartons with procedural barcode labels.
- **Food-Grade Worker Character**: Cleanroom jacket, navy vinyl apron, bouffant hairnet, surgical mask, nitrile gloves, and articulated walking joints.

---

## 📁 Project Structure

```
├── index.html           # Main simulation entry point (open directly in any modern browser)
├── app.js               # Application controller, animation engine & 300-batch dataset
├── scene_environment.js # 3D digital-twin environment, lighting, floor & camera presets
├── equipment_models.js  # 3D mechanical models, logistics carts & procedural canvas textures
├── three.min.js         # Bundled Three.js r128 (100% offline, zero external dependencies)
└── README.md            # Documentation and operating guide
```

---

## 🎮 Controls & Shortcuts

- **Left Mouse Drag**: Orbit camera around target.
- **Right Mouse Drag / Shift + Drag**: Pan camera across horizontal plane.
- **Scroll Wheel**: Smooth zoom in / out.
- **Click Equipment**: Inspect equipment in the sidebar inspector card.
- **Toolbar Buttons**:
  - `Factory`: Default isometric overview camera.
  - `Bench close-up`: Workstation inspection camera.
  - `Top view`: Top-down orthographic plant layout.
  - `Walls: low / full`: Toggle perimeter wall cutaway height.
  - `Flow arrows`: Toggle 3D supply flow vector vectors.
  - `Signs`: Toggle 3D station signboards.
  - `Floor Markings`: Toggle safety boundary and walkway lines.
  - `Shadows`: Toggle dynamic directional shadows.
  - `Save image`: Export high-resolution PNG snapshot.
- **Keyboard Shortcuts**:
  - `→` / `←`: Step forward / backward through process sequence (available in all views, including walk mode).
  - `WASD`: Walk & strafe movement in first-person walk mode.
  - `Space`: Stop / resume motion (pause/resume animation).
  - `T`: Play / pause guided tour.
  - `R`: Fullscreen pure simulation view (hides all UI overlays).
  - `Tab` / `ESC`: Toggle / close IE study & telemetry drawer.
  - `V`: Cycle camera views.

---

## 📊 Industrial Engineering Reference (IES-101)

- **Target Output**: 540 packs / shift = 27 cartons / shift (20 × 150 g pouches per carton).
- **Shift Duration**: 480 minutes (8-hour shift).
- **Takt Time**: `480 min / 27 cartons = 17.78 min / carton`.
- **Recorded Batches**: 300 unique observed cycles (`Mean = 25.44 min`, `Min = 13.7 min`, `Max = 75.0 min`, `Std Dev = 20.43 min`).
