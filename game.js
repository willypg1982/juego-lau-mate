// ============================================================================
// ROBLOX MATH OBBY 3D - MOTOR DEL JUEGO Y SISTEMA DE EXAMEN / PRÁCTICA
// ============================================================================

(function () {
  // --- Estado Global del Juego ---
  const state = {
    activityType: "practice", // "practice" (con pistas y fichas) | "exam" (sin pistas ni fichas)
    modeCount: 10, // 10, 15, o 24 preguntas
    skin: { torso: 0x00a2ff, legs: 0x10b981, head: 0xfacc15, name: "Clásico Roblox" },
    questions: [],
    currentGateIndex: 0, // Índice de la pregunta/barrera actual
    selectedOptionIndex: null,
    questionAnswered: false,
    isModalOpen: false,
    soundEnabled: true,
    musicEnabled: true,
    usingCustomMp3: false,
    autoPilot: false,
    scoreGood: 0,
    scoreBad: 0,
    coins: 0,
    // Registro de pistas y fichas para el reporte final
    currentQUsedHint: false,
    currentQViewedSheet: false,
    hintUsedQuestionMap: {}, // { gateIdx: { num, title, question, category } }
    sheetViewedQuestionMap: {}, // { gateIdx: { num, title, question, category, times } }
    totalSheetOpens: 0,
    history: [] // Registro detallado de cada pregunta contestada
  };

  // --- Paletas de Mundos estilo Roblox Obby ---
  const WORLD_THEMES = [
    { name: "Mundo 1: Isla del Tiempo ⏰", islandColor: 0x38bdf8, padColor: 0xfbbf24, gateColor: 0x0284c7 },
    { name: "Mundo 2: Volcán de Temperatura 🌡️", islandColor: 0xf97316, padColor: 0xfef08a, gateColor: 0xe11d48 },
    { name: "Mundo 3: Laboratorio de Expresiones ✨", islandColor: 0xa855f7, padColor: 0x34d399, gateColor: 0x7c3aed },
    { name: "Mundo 4: Castillo del Repaso Mágico 🏰", islandColor: 0x10b981, padColor: 0x60a5fa, gateColor: 0x059669 }
  ];

  // --- Efectos de Sonido con Web Audio API ---
  let audioCtx = null;
  function playSound(type) {
    if (!state.soundEnabled) return;
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === "suspended") audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "jump") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.16);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === "coin") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1318.5, now + 0.07);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "clickX") {
        osc.type = "square";
        osc.frequency.setValueAtTime(520, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === "hint") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === "correct") {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const o = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          o.type = "triangle";
          o.connect(g);
          g.connect(audioCtx.destination);
          o.frequency.setValueAtTime(freq, now + idx * 0.08);
          g.gain.setValueAtTime(0.2, now + idx * 0.08);
          g.gain.linearRampToValueAtTime(0.01, now + idx * 0.08 + 0.22);
          o.start(now + idx * 0.08);
          o.stop(now + idx * 0.08 + 0.22);
        });
      } else if (type === "wrong") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(210, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "victory") {
        const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const o = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          o.type = "triangle";
          o.connect(g);
          g.connect(audioCtx.destination);
          o.frequency.setValueAtTime(freq, now + idx * 0.11);
          g.gain.setValueAtTime(0.22, now + idx * 0.11);
          g.gain.linearRampToValueAtTime(0.01, now + idx * 0.11 + 0.25);
          o.start(now + idx * 0.11);
          o.stop(now + idx * 0.11 + 0.25);
        });
      }
    } catch (e) {
      // Ignorar si el navegador bloquea audio antes de interacción
    }
  }

  // ============================================================================
  // MÚSICA DE FONDO MÁGICA ESTILO HARRY POTTER (CAJA DE MÚSICA / CELESTA + MP3)
  // ============================================================================
  const NOTE_FREQS = {
    E3: 164.81, G3: 196.00, A3: 220.00, B3: 246.94,
    B4: 493.88,
    "D#5": 622.25, E5: 659.25, F5: 698.46, "F#5": 739.99, G5: 783.99, "G#5": 830.61, A5: 880.00, "A#5": 932.33, B5: 987.77,
    C6: 1046.50, "C#6": 1108.73, D6: 1174.66
  };

  // Partitura de la melodía mágica (Hedwig's Theme en compás de 3/8)
  const HEDWIG_MELODY = [
    // Frase 1
    { note: "B4", beats: 1, bass: null },
    { note: "E5", beats: 1.5, bass: "E3" },
    { note: "G5", beats: 0.5, bass: null },
    { note: "F#5", beats: 1, bass: "B3" },
    { note: "E5", beats: 2, bass: "E3" },
    { note: "B5", beats: 1, bass: "G3" },
    { note: "A5", beats: 3, bass: "A3" },
    { note: "F#5", beats: 3, bass: "B3" },
    // Frase 2
    { note: "E5", beats: 1.5, bass: "E3" },
    { note: "G5", beats: 0.5, bass: null },
    { note: "F#5", beats: 1, bass: "B3" },
    { note: "D#5", beats: 2, bass: "B3" },
    { note: "F5", beats: 1, bass: null },
    { note: "B4", beats: 4, bass: "E3" },
    // Frase 3
    { note: "B4", beats: 1, bass: null },
    { note: "E5", beats: 1.5, bass: "E3" },
    { note: "G5", beats: 0.5, bass: null },
    { note: "F#5", beats: 1, bass: "B3" },
    { note: "E5", beats: 2, bass: "E3" },
    { note: "B5", beats: 1, bass: "G3" },
    { note: "D6", beats: 2, bass: "G3" },
    { note: "C#6", beats: 1, bass: null },
    { note: "C6", beats: 2, bass: "A3" },
    { note: "G#5", beats: 1, bass: null },
    // Frase 4 (Cierre mágico)
    { note: "C6", beats: 1.5, bass: "A3" },
    { note: "B5", beats: 0.5, bass: null },
    { note: "A#5", beats: 1, bass: null },
    { note: "F#5", beats: 2, bass: "B3" },
    { note: "G5", beats: 1, bass: null },
    { note: "E5", beats: 4, bass: "E3" },
    { note: null, beats: 2, bass: null }
  ];

  let musicTimer = null;
  let melodyStepIndex = 0;

  function playCelestaNote(freq, durationSec, volume = 0.08) {
    if (!audioCtx || !state.musicEnabled || state.usingCustomMp3) return;
    const now = audioCtx.currentTime;

    // Oscilador principal (timbre de campana / celesta)
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = "sine";
    osc2.type = "triangle";
    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 2, now); // Armónico brillante de celesta

    const harmonicGain = audioCtx.createGain();
    harmonicGain.gain.setValueAtTime(0.22, now);
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + Math.min(durationSec * 0.6, 0.4));

    osc1.connect(gain);
    osc2.connect(harmonicGain);
    harmonicGain.connect(gain);
    gain.connect(audioCtx.destination);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + durationSec * 1.15);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + durationSec * 1.2);
    osc2.stop(now + durationSec * 1.2);
  }

  function scheduleNextMelodyNote() {
    if (musicTimer) clearTimeout(musicTimer);
    if (!state.musicEnabled || state.usingCustomMp3) return;

    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === "suspended") audioCtx.resume();

      const step = HEDWIG_MELODY[melodyStepIndex];
      const beatDurationSec = 0.28; // Tempo de vals mágico
      const noteDuration = step.beats * beatDurationSec;

      if (step.note && NOTE_FREQS[step.note]) {
        playCelestaNote(NOTE_FREQS[step.note], noteDuration, 0.075);
      }
      if (step.bass && NOTE_FREQS[step.bass]) {
        playCelestaNote(NOTE_FREQS[step.bass], noteDuration * 1.6, 0.035);
      }

      melodyStepIndex = (melodyStepIndex + 1) % HEDWIG_MELODY.length;
      musicTimer = setTimeout(scheduleNextMelodyNote, noteDuration * 1000);
    } catch (e) {
      // Esperar interacción del usuario
    }
  }

  function startBackgroundMusic() {
    const audioEl = document.getElementById("bg-custom-audio");
    if (!state.musicEnabled) {
      if (musicTimer) clearTimeout(musicTimer);
      if (audioEl) audioEl.pause();
      return;
    }

    if (state.usingCustomMp3 && audioEl) {
      if (musicTimer) clearTimeout(musicTimer);
      audioEl.volume = 0.38;
      audioEl.play().catch(() => {});
    } else {
      scheduleNextMelodyNote();
    }
  }

  // ============================================================================
  // ESCENA 3D CON THREE.JS (PERSONAJE ROBLOX, PLATAFORMAS, MONEDAS Y BARRERAS)
  // ============================================================================
  let scene, camera, renderer;
  let playerGroup, headMesh, torsoMesh, leftArmPivot, rightArmPivot, leftLegPivot, rightLegPivot;
  let platforms = [];
  let gates = [];
  let coinsList = [];
  let cloudsList = [];
  let trophyMesh = null;

  const playerPhysics = {
    x: 0,
    y: 2,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    speed: 14,
    jumpForce: 13.5,
    gravity: 32,
    onGround: false,
    safeSpawn: { x: 0, y: 2, z: 0 },
    walkCycle: 0
  };

  const keys = { forward: false, backward: false, left: false, right: false, jump: false };

  function createSmileyFaceTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#facc15";
    ctx.fillRect(0, 0, 128, 128);

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(44, 50, 9, 0, Math.PI * 2);
    ctx.arc(84, 50, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(41, 47, 3, 0, Math.PI * 2);
    ctx.arc(81, 47, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(64, 64, 24, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
  }

  function createNumberBadgeTexture(numText, bgColorHex) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = bgColorHex || "#0284c7";
    ctx.fillRect(0, 0, 256, 128);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 246, 118);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 44px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(numText, 128, 64);

    return new THREE.CanvasTexture(canvas);
  }

  function initThreeScene() {
    const container = document.getElementById("game-canvas-container");
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7dd3fc);
    scene.fog = new THREE.FogExp2(0x7dd3fc, 0.0065);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 400);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(30, 60, 40);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const cloudGeo = new THREE.BoxGeometry(10, 2.5, 6);
    const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    for (let i = 0; i < 36; i++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      cloud.position.set(
        (Math.random() - 0.5) * 140,
        12 + Math.random() * 18,
        -i * 22 + (Math.random() - 0.5) * 20
      );
      cloud.scale.set(0.8 + Math.random() * 1.4, 1, 0.8 + Math.random() * 1.2);
      scene.add(cloud);
      cloudsList.push(cloud);
    }

    buildRobloxCharacter();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  function buildRobloxCharacter() {
    if (playerGroup) scene.remove(playerGroup);
    playerGroup = new THREE.Group();

    const faceTex = createSmileyFaceTexture();
    const headMatYellow = new THREE.MeshLambertMaterial({ color: state.skin.head });
    const headMaterials = [
      headMatYellow,
      headMatYellow,
      headMatYellow,
      headMatYellow,
      new THREE.MeshLambertMaterial({ map: faceTex }),
      new THREE.MeshLambertMaterial({ map: faceTex })
    ];

    const headGeo = new THREE.BoxGeometry(1.15, 1.15, 1.15);
    headMesh = new THREE.Mesh(headGeo, headMaterials);
    headMesh.position.y = 2.75;
    headMesh.castShadow = true;
    playerGroup.add(headMesh);

    const torsoGeo = new THREE.BoxGeometry(1.5, 1.5, 0.75);
    const torsoMat = new THREE.MeshLambertMaterial({ color: state.skin.torso });
    torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
    torsoMesh.position.y = 1.45;
    torsoMesh.castShadow = true;
    playerGroup.add(torsoMesh);

    const armGeo = new THREE.BoxGeometry(0.55, 1.45, 0.55);
    const armMat = new THREE.MeshLambertMaterial({ color: state.skin.head });

    leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-1.05, 2.1, 0);
    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.y = -0.65;
    leftArmPivot.add(leftArm);
    playerGroup.add(leftArmPivot);

    rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(1.05, 2.1, 0);
    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.y = -0.65;
    rightArmPivot.add(rightArm);
    playerGroup.add(rightArmPivot);

    const legGeo = new THREE.BoxGeometry(0.68, 1.4, 0.72);
    const legMat = new THREE.MeshLambertMaterial({ color: state.skin.legs });

    leftLegPivot = new THREE.Group();
    leftLegPivot.position.set(-0.4, 0.7, 0);
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.y = -0.7;
    leftLegPivot.add(leftLeg);
    playerGroup.add(leftLegPivot);

    rightLegPivot = new THREE.Group();
    rightLegPivot.position.set(0.4, 0.7, 0);
    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.y = -0.7;
    rightLegPivot.add(rightLeg);
    playerGroup.add(rightLegPivot);

    scene.add(playerGroup);
  }

  function updateCharacterColors() {
    if (!torsoMesh) return;
    torsoMesh.material.color.setHex(state.skin.torso);
    leftLegPivot.children[0].material.color.setHex(state.skin.legs);
    rightLegPivot.children[0].material.color.setHex(state.skin.legs);
  }

  function buildObbyCourse() {
    platforms.forEach((p) => scene.remove(p.mesh));
    gates.forEach((g) => scene.remove(g.group));
    coinsList.forEach((c) => scene.remove(c.mesh));
    if (trophyMesh) scene.remove(trophyMesh);

    platforms = [];
    gates = [];
    coinsList = [];

    let currentZ = 0;

    addPlatform(0, 0, currentZ, 10, 1.5, 10, 0x00a2ff, true);

    const totalQuestions = state.questions.length;

    for (let i = 0; i < totalQuestions; i++) {
      const q = state.questions[i];
      const theme = WORLD_THEMES[q.worldIndex % WORLD_THEMES.length];

      const offset1 = (i % 2 === 0 ? 1 : -1) * 1.8;
      currentZ -= 8;
      addPlatform(offset1, 0.3, currentZ, 5.2, 1.2, 4.5, theme.padColor, false);
      addCoin(offset1, 2.3, currentZ);

      currentZ -= 7.5;
      addPlatform(-offset1 * 0.6, 0.6, currentZ, 5.2, 1.2, 4.5, theme.padColor, false);
      addCoin(-offset1 * 0.6, 2.6, currentZ);

      currentZ -= 9.5;
      addPlatform(0, 0, currentZ, 11, 1.6, 11, theme.islandColor, true);

      createGate(i, currentZ, theme);
    }

    currentZ -= 12;
    addPlatform(0, 0.5, currentZ, 14, 2, 14, 0xfbbf24, true);
    createFinalTrophy(currentZ);

    playerPhysics.x = 0;
    playerPhysics.y = 2;
    playerPhysics.z = 1;
    playerPhysics.vx = 0;
    playerPhysics.vy = 0;
    playerPhysics.vz = 0;
    playerPhysics.safeSpawn = { x: 0, y: 2, z: 1 };
  }

  function addPlatform(x, y, z, w, h, d, colorHex, isCheckpoint) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshLambertMaterial({ color: colorHex });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y - h / 2, z);
    mesh.receiveShadow = true;
    scene.add(mesh);

    const rimGeo = new THREE.BoxGeometry(w + 0.15, 0.2, d + 0.15);
    const rimMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.28 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.position.y = h / 2;
    mesh.add(rim);

    platforms.push({ mesh, x, y, z, w, h, d, isCheckpoint });
  }

  function addCoin(x, y, z) {
    const geo = new THREE.CylinderGeometry(0.85, 0.85, 0.28, 16);
    const mat = new THREE.MeshLambertMaterial({ color: 0xfacc15, emissive: 0xb45309, emissiveIntensity: 0.35 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(x, y, z);
    scene.add(mesh);

    coinsList.push({ mesh, x, y, z, collected: false });
  }

  function createGate(index, zPos, theme) {
    const group = new THREE.Group();
    group.position.set(0, 0, zPos);

    const pillarGeo = new THREE.BoxGeometry(1.1, 7.5, 1.1);
    const pillarMat = new THREE.MeshLambertMaterial({ color: theme.gateColor });

    const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
    leftPillar.position.set(-4.6, 3.75, 0);
    group.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
    rightPillar.position.set(4.6, 3.75, 0);
    group.add(rightPillar);

    const topGeo = new THREE.BoxGeometry(10.6, 2.1, 1.3);
    const labelPrefix = state.activityType === "exam" ? "EXAMEN" : "PREGUNTA";
    const badgeTex = createNumberBadgeTexture(`${labelPrefix} ${index + 1}`, "#0f172a");
    const topMat = new THREE.MeshLambertMaterial({ map: badgeTex });
    const topBar = new THREE.Mesh(topGeo, topMat);
    topBar.position.set(0, 7.8, 0);
    group.add(topBar);

    const barrierGeo = new THREE.BoxGeometry(8.2, 6.5, 0.35);
    const barrierMat = new THREE.MeshLambertMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.72
    });
    const barrierMesh = new THREE.Mesh(barrierGeo, barrierMat);
    barrierMesh.position.set(0, 3.3, 0);
    group.add(barrierMesh);

    const padGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.25, 24);
    const padMat = new THREE.MeshLambertMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5
    });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.position.set(0, 0.13, 2.2);
    group.add(padMesh);

    scene.add(group);

    gates.push({
      index,
      z: zPos,
      group,
      barrierMesh,
      padMesh,
      unlocked: false
    });
  }

  function createFinalTrophy(zPos) {
    const group = new THREE.Group();
    group.position.set(0, 0.5, zPos);

    const baseGeo = new THREE.BoxGeometry(3.5, 1.2, 3.5);
    const baseMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.6;
    group.add(base);

    const cupGeo = new THREE.CylinderGeometry(1.8, 0.9, 3.2, 16);
    const cupMat = new THREE.MeshLambertMaterial({
      color: 0xfacc15,
      emissive: 0xd97706,
      emissiveIntensity: 0.45
    });
    const cup = new THREE.Mesh(cupGeo, cupMat);
    cup.position.y = 2.8;
    group.add(cup);

    scene.add(group);
    trophyMesh = group;
  }

  // ============================================================================
  // BUCLE DE FÍSICA Y RENDERIZADO 3D
  // ============================================================================
  let lastTime = performance.now();

  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    coinsList.forEach((c) => {
      if (!c.collected) {
        c.mesh.rotation.z += dt * 3.2;
      }
    });
    if (trophyMesh) {
      trophyMesh.rotation.y += dt * 1.5;
    }

    if (!state.isModalOpen && state.questions.length > 0) {
      updatePlayerPhysics(dt);
    }

    if (playerGroup) {
      playerGroup.position.set(playerPhysics.x, playerPhysics.y, playerPhysics.z);

      const targetCamX = playerPhysics.x * 0.65;
      const targetCamY = playerPhysics.y + 6.2;
      const targetCamZ = playerPhysics.z + 11.5;

      camera.position.x += (targetCamX - camera.position.x) * 0.12;
      camera.position.y += (targetCamY - camera.position.y) * 0.12;
      camera.position.z += (targetCamZ - camera.position.z) * 0.12;
      camera.lookAt(playerPhysics.x * 0.3, playerPhysics.y + 1.8, playerPhysics.z - 6);
    }

    renderer.render(scene, camera);
  }

  function updatePlayerPhysics(dt) {
    let moveX = 0;
    let moveZ = 0;

    if (state.autoPilot) {
      const targetZ = getNextTargetZ();
      const targetPlatform = findNextPlatformTowards(targetZ);

      const destX = targetPlatform ? targetPlatform.x : 0;
      const dx = destX - playerPhysics.x;
      const dz = targetZ - playerPhysics.z;

      if (Math.abs(dx) > 0.25) moveX = Math.sign(dx);
      if (dz < -0.4) moveZ = -1;

      const distToEdge = checkGapAhead();
      if (distToEdge && playerPhysics.onGround) {
        playerPhysics.vy = playerPhysics.jumpForce;
        playerPhysics.onGround = false;
        playSound("jump");
      }
    } else {
      if (keys.left) moveX -= 1;
      if (keys.right) moveX += 1;
      if (keys.forward) moveZ -= 1;
      if (keys.backward) moveZ += 1;

      if (moveX !== 0 || moveZ !== 0) {
        const len = Math.hypot(moveX, moveZ);
        moveX /= len;
        moveZ /= len;
      }

      if (keys.jump && playerPhysics.onGround) {
        playerPhysics.vy = playerPhysics.jumpForce;
        playerPhysics.onGround = false;
        playSound("jump");
      }
    }

    playerPhysics.vx = moveX * playerPhysics.speed;
    playerPhysics.vz = moveZ * playerPhysics.speed;
    playerPhysics.vy -= playerPhysics.gravity * dt;

    let nextX = playerPhysics.x + playerPhysics.vx * dt;
    let nextY = playerPhysics.y + playerPhysics.vy * dt;
    let nextZ = playerPhysics.z + playerPhysics.vz * dt;

    // Bloqueo estricto en cada barrera de pregunta
    if (state.currentGateIndex < gates.length) {
      const activeGate = gates[state.currentGateIndex];
      if (!activeGate.unlocked) {
        const minAllowedZ = activeGate.z + 1.6;
        if (nextZ <= minAllowedZ) {
          nextZ = minAllowedZ;
          state.autoPilot = false;
          openQuestionModal(state.currentGateIndex);
        }
      }
    } else if (trophyMesh) {
      if (nextZ <= trophyMesh.position.z + 2.5) {
        state.autoPilot = false;
        openFinalReportModal();
      }
    }

    playerPhysics.onGround = false;
    for (let i = 0; i < platforms.length; i++) {
      const p = platforms[i];
      const halfW = p.w / 2 + 0.45;
      const halfD = p.d / 2 + 0.45;

      if (
        nextX >= p.x - halfW &&
        nextX <= p.x + halfW &&
        nextZ >= p.z - halfD &&
        nextZ <= p.z + halfD
      ) {
        if (playerPhysics.y >= p.y - 0.3 && nextY <= p.y && playerPhysics.vy <= 0) {
          nextY = p.y;
          playerPhysics.vy = 0;
          playerPhysics.onGround = true;

          if (p.isCheckpoint) {
            playerPhysics.safeSpawn = { x: 0, y: p.y + 1.5, z: p.z + 3 };
          }
          break;
        }
      }
    }

    playerPhysics.x = nextX;
    playerPhysics.y = nextY;
    playerPhysics.z = nextZ;

    if (playerPhysics.y < -10) {
      playerPhysics.x = playerPhysics.safeSpawn.x;
      playerPhysics.y = playerPhysics.safeSpawn.y;
      playerPhysics.z = playerPhysics.safeSpawn.z;
      playerPhysics.vx = 0;
      playerPhysics.vy = 0;
      playerPhysics.vz = 0;
    }

    coinsList.forEach((c) => {
      if (!c.collected) {
        const dist = Math.hypot(playerPhysics.x - c.x, playerPhysics.y + 1 - c.y, playerPhysics.z - c.z);
        if (dist < 2.1) {
          c.collected = true;
          c.mesh.visible = false;
          state.coins += 10;
          playSound("coin");
          updateHUD();
        }
      }
    });

    const isMoving = Math.abs(playerPhysics.vx) > 0.1 || Math.abs(playerPhysics.vz) > 0.1;
    if (isMoving && playerPhysics.onGround) {
      playerPhysics.walkCycle += dt * 12;
      const swing = Math.sin(playerPhysics.walkCycle) * 0.65;
      leftArmPivot.rotation.x = swing;
      rightArmPivot.rotation.x = -swing;
      leftLegPivot.rotation.x = -swing;
      rightLegPivot.rotation.x = swing;
    } else if (!playerPhysics.onGround) {
      leftArmPivot.rotation.x = Math.PI * 0.85;
      rightArmPivot.rotation.x = Math.PI * 0.85;
      leftLegPivot.rotation.x = -0.3;
      rightLegPivot.rotation.x = 0.3;
    } else {
      leftArmPivot.rotation.x *= 0.8;
      rightArmPivot.rotation.x *= 0.8;
      leftLegPivot.rotation.x *= 0.8;
      rightLegPivot.rotation.x *= 0.8;
    }
  }

  function getNextTargetZ() {
    if (state.currentGateIndex < gates.length) {
      return gates[state.currentGateIndex].z + 1.5;
    }
    return trophyMesh ? trophyMesh.position.z + 2.0 : playerPhysics.z;
  }

  function findNextPlatformTowards(targetZ) {
    let best = null;
    let bestZDiff = Infinity;
    for (const p of platforms) {
      if (p.z < playerPhysics.z + 1.5 && p.z >= targetZ - 6) {
        const diff = playerPhysics.z - p.z;
        if (diff >= -2 && diff < bestZDiff) {
          bestZDiff = diff;
          best = p;
        }
      }
    }
    return best;
  }

  function checkGapAhead() {
    const probeZ = playerPhysics.z - 2.3;
    for (const p of platforms) {
      const halfW = p.w / 2 + 0.3;
      const halfD = p.d / 2 + 0.3;
      if (
        playerPhysics.x >= p.x - halfW &&
        playerPhysics.x <= p.x + halfW &&
        probeZ >= p.z - halfD &&
        probeZ <= p.z + halfD
      ) {
        return false;
      }
    }
    return true;
  }

  // ============================================================================
  // REGISTRO DE PISTAS Y CONSULTAS A LAS FICHAS DE MATERIA
  // ============================================================================
  function recordHintUsageForCurrentQuestion() {
    if (state.activityType === "exam") return;
    const idx = state.currentGateIndex;
    const q = state.questions[idx];
    if (!q) return;

    state.currentQUsedHint = true;
    if (!state.hintUsedQuestionMap[idx]) {
      state.hintUsedQuestionMap[idx] = {
        num: idx + 1,
        title: q.title,
        question: q.question,
        category: q.category
      };
    }
  }

  function recordSheetViewForCurrentQuestion() {
    if (state.activityType === "exam") return;
    state.totalSheetOpens++;

    const idx = Math.min(state.currentGateIndex, state.questions.length - 1);
    const q = state.questions[idx];
    if (!q) return;

    state.currentQViewedSheet = true;
    if (!state.sheetViewedQuestionMap[idx]) {
      state.sheetViewedQuestionMap[idx] = {
        num: idx + 1,
        title: q.title,
        question: q.question,
        category: q.category,
        times: 1
      };
    } else {
      state.sheetViewedQuestionMap[idx].times++;
    }
  }

  // ============================================================================
  // SISTEMA DE PREGUNTAS DE MARCAR CON "X", PISTAS Y EXPLICACIÓN DE ERRORES
  // ============================================================================
  function openQuestionModal(gateIdx) {
    if (state.isModalOpen) return;
    state.isModalOpen = true;
    state.questionAnswered = false;
    state.selectedOptionIndex = null;
    // Conservar si ya había visto la ficha desde el HUD antes de tocar el portal
    state.currentQUsedHint = Boolean(state.hintUsedQuestionMap[gateIdx]);
    state.currentQViewedSheet = Boolean(state.sheetViewedQuestionMap[gateIdx]);

    keys.forward = keys.backward = keys.left = keys.right = keys.jump = false;

    const q = state.questions[gateIdx];
    const total = state.questions.length;
    const isExam = state.activityType === "exam";

    document.getElementById("q-badge-text").textContent = `${q.category} • Pregunta ${gateIdx + 1} de ${total}`;

    const modePill = document.getElementById("q-mode-pill");
    if (isExam) {
      modePill.textContent = "🎓 Modo Examen (Sin Ayudas)";
      modePill.className = "q-mode-tag exam";
    } else {
      modePill.textContent = "📘 Modo Práctica";
      modePill.className = "q-mode-tag practice";
    }

    document.getElementById("q-title-text").textContent = q.title;
    document.getElementById("q-stem-text").textContent = q.question;
    document.getElementById("q-visual-text").textContent = q.visualAid;

    // Configurar visibilidad de botones de ayuda según sea Práctica o Examen
    const hintBtn = document.getElementById("btn-show-hint");
    const peekSheetBtn = document.getElementById("btn-peek-sheet-q");
    const examLockBanner = document.getElementById("q-exam-lock-banner");

    if (isExam) {
      hintBtn.classList.add("hidden");
      peekSheetBtn.classList.add("hidden");
      examLockBanner.classList.remove("hidden");
    } else {
      hintBtn.classList.remove("hidden");
      peekSheetBtn.classList.remove("hidden");
      examLockBanner.classList.add("hidden");
    }

    const hintBox = document.getElementById("q-hint-box");
    hintBox.classList.add("hidden");
    hintBox.textContent = q.hint;

    const feedbackBox = document.getElementById("q-feedback-box");
    feedbackBox.classList.add("hidden");

    const actionsRow = document.getElementById("q-actions-row");
    actionsRow.classList.remove("hidden");

    const submitBtn = document.getElementById("btn-submit-answer");
    submitBtn.disabled = true;

    const optionsContainer = document.getElementById("q-options-list");
    optionsContainer.innerHTML = "";
    const letters = ["A)", "B)", "C)", "D)"];

    q.options.forEach((optText, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-row";
      btn.innerHTML = `
        <div class="x-checkbox" aria-hidden="true">X</div>
        <span class="option-letter">${letters[idx]}</span>
        <span class="option-text">${optText}</span>
      `;
      btn.addEventListener("click", () => selectOptionWithX(idx));
      optionsContainer.appendChild(btn);
    });

    document.getElementById("question-modal").classList.remove("hidden");
  }

  function selectOptionWithX(idx) {
    if (state.questionAnswered) return;
    playSound("clickX");
    state.selectedOptionIndex = idx;

    const rows = document.querySelectorAll("#q-options-list .option-row");
    rows.forEach((row, i) => {
      if (i === idx) {
        row.classList.add("selected");
      } else {
        row.classList.remove("selected");
      }
    });

    document.getElementById("btn-submit-answer").disabled = false;
  }

  function submitCurrentAnswer() {
    if (state.questionAnswered || state.selectedOptionIndex === null) return;
    state.questionAnswered = true;

    const gateIdx = state.currentGateIndex;
    const q = state.questions[gateIdx];
    const isCorrect = state.selectedOptionIndex === q.correctIndex;

    state.history.push({
      questionNum: gateIdx + 1,
      questionObj: q,
      selectedIndex: state.selectedOptionIndex,
      correctIndex: q.correctIndex,
      isCorrect,
      usedHint: Boolean(state.hintUsedQuestionMap[gateIdx]),
      viewedSheet: Boolean(state.sheetViewedQuestionMap[gateIdx])
    });

    if (isCorrect) {
      state.scoreGood++;
      state.coins += 25;
      playSound("correct");
    } else {
      state.scoreBad++;
      playSound("wrong");
    }

    updateHUD();

    const rows = document.querySelectorAll("#q-options-list .option-row");
    rows.forEach((row, i) => {
      row.classList.add("disabled");
      if (i === q.correctIndex) {
        row.classList.add("correct-answer");
      } else if (i === state.selectedOptionIndex && !isCorrect) {
        row.classList.add("wrong-answer");
      }
    });

    document.getElementById("q-actions-row").classList.add("hidden");

    const feedbackBox = document.getElementById("q-feedback-box");
    const feedbackHeader = document.getElementById("q-feedback-header");
    const feedbackExp = document.getElementById("q-feedback-explanation");
    const feedbackMem = document.getElementById("q-feedback-memory");

    feedbackBox.classList.remove("hidden", "correct", "wrong");

    if (isCorrect) {
      feedbackBox.classList.add("correct");
      feedbackHeader.innerHTML = `🎉 ¡EXCELENTE! Respuesta Correcta (+25 🪙)`;
      feedbackExp.textContent = `✅ ¿Por qué es correcta?\n${q.explanation}`;
    } else {
      feedbackBox.classList.add("wrong");
      const chosenText = q.options[state.selectedOptionIndex];
      const rightText = q.options[q.correctIndex];
      feedbackHeader.innerHTML = `💡 ¡Atención! Aprendamos por qué estaba incorrecta`;
      feedbackExp.textContent =
        `❌ Marcaste con X: «${chosenText}»\n` +
        `✅ La respuesta correcta es: «${rightText}»\n\n` +
        `📐 PASO A PASO PARA APRENDERLO:\n${q.explanation}`;
    }

    feedbackMem.textContent = q.memoryTrick;
  }

  function unlockGateAndContinue() {
    const gate = gates[state.currentGateIndex];
    if (gate) {
      gate.unlocked = true;
      gate.barrierMesh.material.color.setHex(0x10b981);
      gate.barrierMesh.material.opacity = 0.18;
      gate.barrierMesh.position.y = -2.5;
      gate.padMesh.material.color.setHex(0x10b981);
      playerPhysics.safeSpawn = { x: 0, y: 2, z: gate.z - 1.5 };
    }

    state.currentGateIndex++;
    state.isModalOpen = false;
    document.getElementById("question-modal").classList.add("hidden");

    updateHUD();
  }

  // ============================================================================
  // BOLETA DE CALIFICACIÓN FINAL + AUDITORÍA DE PISTAS Y FICHAS
  // ============================================================================
  function openFinalReportModal() {
    if (state.isModalOpen) return;
    state.isModalOpen = true;
    playSound("victory");

    const isExam = state.activityType === "exam";
    const total = state.questions.length;
    const good = state.scoreGood;
    const bad = state.scoreBad;
    const finalGrade = Math.round((good / total) * 100);

    // 1. Indicar claramente si concluyó un EXAMEN o una PRÁCTICA
    const modeBadge = document.getElementById("final-mode-badge");
    const completionBanner = document.getElementById("final-completion-banner");
    const msgSub = document.getElementById("final-message-sub");

    if (isExam) {
      modeBadge.textContent = "🎓 MODALIDAD REALIZADA: EXAMEN OFICIAL (SIN AYUDAS)";
      completionBanner.textContent = "🎓 ¡Tu EXAMEN fue concluido con éxito!";
    } else {
      modeBadge.textContent = "📘 MODALIDAD REALIZADA: PRÁCTICA INTERACTIVA";
      completionBanner.textContent = "📘 ¡Tu PRÁCTICA fue concluida con éxito!";
    }

    const gradeEl = document.getElementById("final-grade-number");
    const gradeCircle = document.getElementById("final-grade-circle");

    gradeEl.textContent = finalGrade;
    document.getElementById("final-good-count").textContent = good;
    document.getElementById("final-bad-count").textContent = bad;
    document.getElementById("final-total-count").textContent = `${good} / ${total}`;

    if (finalGrade >= 90) {
      gradeCircle.style.borderColor = "#10b981";
      gradeEl.style.color = "#047857";
      msgSub.textContent = isExam
        ? "¡Excelente dominio en el Examen Oficial sin ayudas!"
        : "¡Excelente práctica! Ahora estás listo para ponerte a prueba en el Examen Oficial.";
    } else if (finalGrade >= 70) {
      gradeCircle.style.borderColor = "#00a2ff";
      gradeEl.style.color = "#0369a1";
      msgSub.textContent = "Buen desempeño. Revisa abajo el detalle de las preguntas para llegar al 100.";
    } else {
      gradeCircle.style.borderColor = "#f59e0b";
      gradeEl.style.color = "#b45309";
      msgSub.textContent = "Repasa con atención el paso a paso de las preguntas malas y vuelve a intentarlo.";
    }

    // 2. Construir el Reporte de Pistas y Consultas de Ficha ("Ver Ficha")
    const auditContent = document.getElementById("final-audit-content");
    auditContent.innerHTML = "";

    const hintEntries = Object.values(state.hintUsedQuestionMap);
    const sheetEntries = Object.values(state.sheetViewedQuestionMap);

    if (isExam) {
      auditContent.innerHTML = `
        <div class="audit-card exam-clean">
          ✅ <strong>Examen Oficial Verificado:</strong> Este fue un examen real de evaluación.
          Las pistas (0 usadas) y la opción de «Ver Ficha» (0 vistas) estuvieron <strong>desactivadas</strong> durante toda la prueba.
        </div>
      `;
    } else {
      // Tarjeta de Pistas en Modo Práctica
      const hintCard = document.createElement("div");
      hintCard.className = "audit-card hint-audit";
      if (hintEntries.length === 0) {
        hintCard.innerHTML = `
          <div>💡 <strong>¿Pidió pistas?:</strong> No (0 pistas solicitadas en toda la práctica).</div>
        `;
      } else {
        const pillsHtml = hintEntries
          .map(
            (h) =>
              `<span class="audit-q-pill">Pregunta #${h.num}: ${h.title} (${h.category})</span>`
          )
          .join("");
        hintCard.innerHTML = `
          <div>💡 <strong>¿Pidió pistas?:</strong> Sí, pidió pista en <strong>${hintEntries.length} pregunta(s)</strong>:</div>
          <div class="audit-q-pills">${pillsHtml}</div>
        `;
      }
      auditContent.appendChild(hintCard);

      // Tarjeta de Consulta de Fichas ("Ver Ficha") en Modo Práctica
      const sheetCard = document.createElement("div");
      sheetCard.className = "audit-card sheet-audit";
      if (sheetEntries.length === 0) {
        sheetCard.innerHTML = `
          <div>📖 <strong>¿Se fijó en la Ficha («Ver Ficha»)?:</strong> No (0 veces abierta la ficha de materia).</div>
        `;
      } else {
        const sheetPillsHtml = sheetEntries
          .map(
            (s) =>
              `<span class="audit-q-pill">Pregunta #${s.num}: ${s.title} (${s.times > 1 ? `vista ${s.times} veces` : "vista 1 vez"})</span>`
          )
          .join("");
        sheetCard.innerHTML = `
          <div>📖 <strong>¿Se fijó en la Ficha («Ver Ficha»)?:</strong> Sí, abrió la ficha <strong>${state.totalSheetOpens} vez/veces</strong> en <strong>${sheetEntries.length} pregunta(s)</strong>:</div>
          <div class="audit-q-pills">${sheetPillsHtml}</div>
        `;
      }
      auditContent.appendChild(sheetCard);
    }

    // 3. Botones de acción al final
    const retryBadBtn = document.getElementById("btn-retry-wrong");
    if (bad > 0) {
      retryBadBtn.classList.remove("hidden");
      retryBadBtn.textContent = `🔄 Repetir solo las ${bad} que tuve malas`;
    } else {
      retryBadBtn.classList.add("hidden");
    }

    const switchToExamBtn = document.getElementById("btn-switch-to-exam");
    if (!isExam) {
      switchToExamBtn.classList.remove("hidden");
    } else {
      switchToExamBtn.classList.add("hidden");
    }

    // 4. Llenar lista de revisión detallada con etiquetas de pista/ficha por pregunta
    const reviewContainer = document.getElementById("final-review-list");
    reviewContainer.innerHTML = "";

    state.history.forEach((item, idx) => {
      const div = document.createElement("div");
      div.className = `review-item ${item.isCorrect ? "good" : "bad"}`;
      const statusIcon = item.isCorrect ? "✅ BUENA" : "❌ MALA";

      const helpBadges = [];
      if (item.usedHint) helpBadges.push("💡 Pidió Pista");
      if (item.viewedSheet) helpBadges.push("📖 Vio la Ficha");
      const helpTagStr = helpBadges.length > 0 ? ` • [${helpBadges.join(" | ")}]` : "";

      div.innerHTML = `
        <h4>Pregunta #${idx + 1}: [${statusIcon}]${helpTagStr} — ${item.questionObj.question}</h4>
        <p><strong>Tu respuesta:</strong> ${item.questionObj.options[item.selectedIndex]}
${
  !item.isCorrect
    ? `<strong>Respuesta correcta:</strong> ${item.questionObj.options[item.correctIndex]}\n<strong>Cómo se hace:</strong> ${item.questionObj.explanation}\n${item.questionObj.memoryTrick}`
    : `${item.questionObj.memoryTrick}`
}</p>
      `;
      reviewContainer.appendChild(div);
    });

    document.getElementById("final-modal").classList.remove("hidden");
  }

  // ============================================================================
  // ACTUALIZACIÓN DEL HUD Y CONFIGURACIÓN DE PARTIDA
  // ============================================================================
  function updateHUD() {
    const total = state.questions.length || 1;
    const answered = state.currentGateIndex;
    const pct = Math.min(100, Math.round((answered / total) * 100));
    const isExam = state.activityType === "exam";

    document.getElementById("hud-mode-indicator").textContent = isExam
      ? "🎓 Modo Examen Oficial (Sin Ayudas)"
      : "📘 Modo Práctica (Con Ayudas)";

    // Ocultar el botón de "Ver Ficha" del HUD si está en Modo Examen Oficial
    const hudStudyBtn = document.getElementById("btn-open-study-hud");
    if (isExam) {
      hudStudyBtn.classList.add("hidden");
    } else {
      hudStudyBtn.classList.remove("hidden");
    }

    document.getElementById("hud-progress-fill").style.width = `${pct}%`;
    document.getElementById("hud-stage-label").textContent =
      answered < total ? `Pregunta ${answered + 1} de ${total}` : `¡Rumbo al Trofeo Final! 🏆`;

    const currentQ = state.questions[Math.min(answered, total - 1)];
    if (currentQ) {
      document.getElementById("hud-world-pill").textContent = currentQ.category;
    }

    document.getElementById("hud-good").textContent = state.scoreGood;
    document.getElementById("hud-bad").textContent = state.scoreBad;
    document.getElementById("hud-coins").textContent = state.coins;

    const bannerText = document.getElementById("objective-text");
    if (answered < total) {
      bannerText.textContent = `🎯 Avanza por los bloques hasta el Portal #${answered + 1} (${currentQ.category})`;
    } else {
      bannerText.textContent = `🏆 ¡Todas las barreras superadas! Avanza al Trofeo Dorado para ver tu Nota Final`;
    }
  }

  function selectBalancedQuestions(count) {
    const all = [...window.QUESTION_BANK];
    if (count >= all.length) {
      return all;
    }

    const byWorld = [0, 1, 2, 3].map((w) =>
      all.filter((q) => q.worldIndex === w).sort(() => Math.random() - 0.5)
    );

    const picked = [];
    let wIdx = 0;
    while (picked.length < count) {
      const bucket = byWorld[wIdx % 4];
      if (bucket.length > 0) {
        picked.push(bucket.shift());
      }
      wIdx++;
    }

    return picked.sort((a, b) => a.worldIndex - b.worldIndex || a.id - b.id);
  }

  function startNewGame(customQuestionList) {
    state.questions = customQuestionList || selectBalancedQuestions(state.modeCount);
    state.currentGateIndex = 0;
    state.scoreGood = 0;
    state.scoreBad = 0;
    state.coins = 0;
    state.currentQUsedHint = false;
    state.currentQViewedSheet = false;
    state.hintUsedQuestionMap = {};
    state.sheetViewedQuestionMap = {};
    state.totalSheetOpens = 0;
    state.history = [];
    state.isModalOpen = false;
    state.autoPilot = false;

    document.getElementById("start-modal").classList.add("hidden");
    document.getElementById("final-modal").classList.add("hidden");
    document.getElementById("question-modal").classList.add("hidden");
    document.getElementById("study-modal").classList.add("hidden");

    buildObbyCourse();
    updateHUD();
    startBackgroundMusic();
  }

  // ============================================================================
  // EVENTOS DEL TECLADO, BOTONES TÁCTILES Y UI
  // ============================================================================
  function setupEventListeners() {
    window.addEventListener("keydown", (e) => {
      if (state.isModalOpen) return;
      state.autoPilot = false;
      const code = e.code;
      if (code === "KeyW" || code === "ArrowUp") keys.forward = true;
      if (code === "KeyS" || code === "ArrowDown") keys.backward = true;
      if (code === "KeyA" || code === "ArrowLeft") keys.left = true;
      if (code === "KeyD" || code === "ArrowRight") keys.right = true;
      if (code === "Space") {
        e.preventDefault();
        keys.jump = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      const code = e.code;
      if (code === "KeyW" || code === "ArrowUp") keys.forward = false;
      if (code === "KeyS" || code === "ArrowDown") keys.backward = false;
      if (code === "KeyA" || code === "ArrowLeft") keys.left = false;
      if (code === "KeyD" || code === "ArrowRight") keys.right = false;
      if (code === "Space") keys.jump = false;
    });

    const bindHoldButton = (id, keyName) => {
      const el = document.getElementById(id);
      if (!el) return;
      const start = (e) => {
        e.preventDefault();
        state.autoPilot = false;
        keys[keyName] = true;
        el.classList.add("active");
      };
      const end = (e) => {
        e.preventDefault();
        keys[keyName] = false;
        el.classList.remove("active");
      };
      el.addEventListener("mousedown", start);
      el.addEventListener("touchstart", start, { passive: false });
      window.addEventListener("mouseup", end);
      window.addEventListener("touchend", end);
    };

    bindHoldButton("btn-up", "forward");
    bindHoldButton("btn-down", "backward");
    bindHoldButton("btn-left", "left");
    bindHoldButton("btn-right", "right");
    bindHoldButton("btn-jump", "jump");

    const triggerAutoPilot = () => {
      if (state.isModalOpen) return;
      state.autoPilot = true;
    };
    document.getElementById("btn-autopilot-hud").addEventListener("click", triggerAutoPilot);
    document.getElementById("btn-autopilot-banner").addEventListener("click", triggerAutoPilot);

    const soundBtn = document.getElementById("btn-sound-toggle");
    soundBtn.addEventListener("click", () => {
      state.soundEnabled = !state.soundEnabled;
      soundBtn.textContent = state.soundEnabled ? "🔊 Efectos: ON" : "🔇 Efectos: OFF";
    });

    const musicBtn = document.getElementById("btn-music-toggle");
    if (musicBtn) {
      musicBtn.addEventListener("click", () => {
        state.musicEnabled = !state.musicEnabled;
        musicBtn.textContent = state.musicEnabled ? "🎵 Música Mágica: ON" : "🎵 Música Mágica: OFF";
        startBackgroundMusic();
      });
    }

    const mp3Input = document.getElementById("custom-mp3-input");
    const audioEl = document.getElementById("bg-custom-audio");
    if (mp3Input && audioEl) {
      // Si el usuario guardó assets/harry_potter.mp3 en la carpeta, detectarlo automáticamente
      audioEl.addEventListener("canplaythrough", () => {
        if (!state.usingCustomMp3 && audioEl.duration > 0) {
          state.usingCustomMp3 = true;
          if (!state.isModalOpen && state.musicEnabled) startBackgroundMusic();
        }
      }, { once: true });

      mp3Input.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        audioEl.src = objectUrl;
        state.usingCustomMp3 = true;
        state.musicEnabled = true;
        if (musicBtn) musicBtn.textContent = "🎵 Música MP3: ON";
        startBackgroundMusic();
      });
    }

    // Selector de Modalidad: Práctica vs Examen Oficial
    const startBtn = document.getElementById("btn-start-game");
    document.querySelectorAll(".exam-type-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".exam-type-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.activityType = btn.dataset.examType;
        if (state.activityType === "exam") {
          startBtn.textContent = "🎓 ¡COMENZAR EXAMEN OFICIAL (SIN AYUDAS)!";
        } else {
          startBtn.textContent = "📘 ¡COMENZAR PRÁCTICA AHORA!";
        }
      });
    });

    // Selector de cantidad de preguntas
    document.querySelectorAll(".mode-option-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".mode-option-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.modeCount = parseInt(btn.dataset.count, 10);
      });
    });

    // Selector de traje Roblox
    const skins = [
      { torso: 0x00a2ff, legs: 0x10b981, head: 0xfacc15 },
      { torso: 0xef4444, legs: 0x1e293b, head: 0xfde047 },
      { torso: 0x8b5cf6, legs: 0x3b82f6, head: 0xfacc15 },
      { torso: 0x10b981, legs: 0x047857, head: 0xfde047 }
    ];
    document.querySelectorAll(".skin-btn").forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".skin-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.skin = skins[idx] || skins[0];
        updateCharacterColors();
      });
    });

    startBtn.addEventListener("click", () => {
      playSound("correct");
      startNewGame();
    });

    // Botón de Pista / Ayuda dentro de la pregunta (Solo en Modo Práctica)
    document.getElementById("btn-show-hint").addEventListener("click", () => {
      if (state.activityType === "exam") return;
      playSound("hint");
      recordHintUsageForCurrentQuestion();
      const hintBox = document.getElementById("q-hint-box");
      hintBox.classList.remove("hidden");
    });

    document.getElementById("btn-submit-answer").addEventListener("click", submitCurrentAnswer);
    document.getElementById("btn-continue-obby").addEventListener("click", unlockGateAndContinue);

    // Modal de Hojas de Estudio (Solo en Modo Práctica, registra qué pregunta estaba haciendo)
    const openStudySheets = (defaultTabIdx) => {
      if (state.activityType === "exam") return;
      recordSheetViewForCurrentQuestion();
      const studyModal = document.getElementById("study-modal");
      studyModal.classList.remove("hidden");
      if (typeof defaultTabIdx === "number") {
        selectStudySheetTab(defaultTabIdx);
      }
    };

    document.getElementById("btn-open-study-hud").addEventListener("click", () => {
      const q = state.questions[Math.min(state.currentGateIndex, state.questions.length - 1)];
      openStudySheets(q ? q.worldIndex : 0);
    });

    document.getElementById("btn-peek-sheet-q").addEventListener("click", () => {
      const q = state.questions[state.currentGateIndex];
      openStudySheets(q ? q.worldIndex : 0);
    });

    document.getElementById("btn-close-study").addEventListener("click", () => {
      document.getElementById("study-modal").classList.add("hidden");
    });

    document.querySelectorAll(".sheet-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectStudySheetTab(parseInt(btn.dataset.sheetIndex, 10));
      });
    });

    // Botones de la Boleta Final
    document.getElementById("btn-play-again").addEventListener("click", () => {
      startNewGame();
    });

    document.getElementById("btn-switch-to-exam").addEventListener("click", () => {
      state.activityType = "exam";
      document.querySelectorAll(".exam-type-btn").forEach((b) => {
        if (b.dataset.examType === "exam") b.classList.add("selected");
        else b.classList.remove("selected");
      });
      startNewGame();
    });

    document.getElementById("btn-retry-wrong").addEventListener("click", () => {
      const wrongQuestions = state.history
        .filter((h) => !h.isCorrect)
        .map((h) => h.questionObj);
      if (wrongQuestions.length > 0) {
        startNewGame(wrongQuestions);
      }
    });

    document.getElementById("btn-change-mode").addEventListener("click", () => {
      document.getElementById("final-modal").classList.add("hidden");
      document.getElementById("start-modal").classList.remove("hidden");
    });
  }

  function selectStudySheetTab(idx) {
    const sheets = [
      "assets/hoja_tiempo.jpg",
      "assets/hoja_temperatura.jpg",
      "assets/hoja_expresiones.jpg",
      "assets/hoja_repaso_tablas.jpg"
    ];
    document.querySelectorAll(".sheet-tab-btn").forEach((b, i) => {
      if (i === idx) b.classList.add("active");
      else b.classList.remove("active");
    });
    document.getElementById("study-sheet-img").src = sheets[idx] || sheets[0];
  }

  window.addEventListener("DOMContentLoaded", () => {
    initThreeScene();
    setupEventListeners();
    state.questions = selectBalancedQuestions(10);
    buildObbyCourse();
    state.isModalOpen = true;
    requestAnimationFrame(animate);
  });
})();
