// The committee as a 3D scene: metallic department hubs orbiting a particle
// Company Brain, with camera fly-in on hover and zoom-to-agents on click.
// Falls back to the SVG map (constellation.js) when WebGL is unavailable.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const R = 7.6;                    // ring radius
// Idle distance scales with the viewport: on a short screen the tree has to sit
// in a narrower clear band between the header and the prompt bar.
// Narrow phone panels are width-limited instead, so fit the ring's width too.
const idleDistance = (w, h) => {
  const aspect = w / Math.max(1, h);
  const byHeight = 34 * (700 / Math.max(360, h));
  // labels are fixed-size DOM text: leave more side margin on portrait panels
  const byWidth = (aspect < 0.8 ? 14.5 : 11.5) / (Math.tan(22 * Math.PI / 180) * aspect);
  return Math.max(30, Math.min(80, Math.max(byHeight, byWidth)));
};
// Portrait panels stack the prompt bar under the tree, so lift the tree higher.
const worldLift = (w, h) => (w / Math.max(1, h) < 0.8 ? 7 : 3.4);
const CAM_HOVER = 18;             // gentle fly-in
const CAM_FOCUS = 12;             // close enough to read the agent labels
const TAU = Math.PI * 2;
const rnd = (a, b) => a + Math.random() * (b - a);

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d').createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  const ctx = c.getContext('2d');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export async function createScene3D(host, { depts, onSelect, onHover, onHoverEnd }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x03040a, 1);
  host.appendChild(renderer.domElement);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(host.clientWidth, host.clientHeight);
  labelRenderer.domElement.className = 'scene-labels';
  host.appendChild(labelRenderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x03040a, 0.016);
  const camera = new THREE.PerspectiveCamera(44, host.clientWidth / host.clientHeight, 0.1, 200);
  let camIdle = idleDistance(host.clientWidth, host.clientHeight);
  camera.position.set(0, 0, camIdle);

  // Metal needs something to reflect: a room environment gives hubs their sheen.
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  scene.add(new THREE.AmbientLight(0x404a6a, 0.6));
  const key = new THREE.PointLight(0x9fd8ff, 260, 60); key.position.set(10, 12, 16); scene.add(key);
  const rim = new THREE.PointLight(0xff8fc0, 180, 60); rim.position.set(-14, -8, 8); scene.add(rim);

  const world = new THREE.Group();
  // Slight lift: the prompt bar occupies the lower band of the hero.
  world.position.y = worldLift(host.clientWidth, host.clientHeight);
  scene.add(world);
  const sprite = glowTexture();

  // ---------------------------------------------------------------- brain
  const brain = new THREE.Group();
  world.add(brain);
  const brainCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.92, 3),
    new THREE.MeshStandardMaterial({ color: 0xdfe4ff, metalness: 1, roughness: 0.12, emissive: 0xffc9dd, emissiveIntensity: 0.38 }),
  );
  brain.add(brainCore);
  const gimbals = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.5 + i * 0.42, 0.022, 10, 120),
      new THREE.MeshStandardMaterial({ color: 0xcfd6ea, metalness: 1, roughness: 0.18, emissive: 0x6e7ba8, emissiveIntensity: 0.25 }),
    );
    ring.rotation.set(rnd(0, 3), rnd(0, 3), rnd(0, 3));
    gimbals.push(ring);
    brain.add(ring);
  }
  // particle shell
  const BRAIN_N = 2600;
  const bp = new Float32Array(BRAIN_N * 3), bc = new Float32Array(BRAIN_N * 3), bseed = new Float32Array(BRAIN_N * 2);
  const tmpC = new THREE.Color();
  for (let i = 0; i < BRAIN_N; i++) {
    const r = rnd(1.15, 2.75), th = rnd(0, TAU), ph = Math.acos(rnd(-1, 1));
    bp[i * 3] = r * Math.sin(ph) * Math.cos(th);
    bp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    bp[i * 3 + 2] = r * Math.cos(ph);
    bseed[i * 2] = rnd(0, TAU); bseed[i * 2 + 1] = rnd(0.25, 1);
    tmpC.setHex(Math.random() < 0.72 ? 0xe9e4f6 : Math.random() < 0.6 ? 0xffb9cd : 0xffe0ad);
    bc[i * 3] = tmpC.r; bc[i * 3 + 1] = tmpC.g; bc[i * 3 + 2] = tmpC.b;
  }
  const brainGeo = new THREE.BufferGeometry();
  brainGeo.setAttribute('position', new THREE.BufferAttribute(bp, 3));
  brainGeo.setAttribute('color', new THREE.BufferAttribute(bc, 3));
  const brainPts = new THREE.Points(brainGeo, new THREE.PointsMaterial({
    size: 0.055, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  }));
  brain.add(brainPts);
  const brainGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color: 0xffc3d8, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false }));
  brainGlow.scale.setScalar(6.5);
  brain.add(brainGlow);

  const brainLabel = document.createElement('div');
  brainLabel.className = 'n3-brain';
  brainLabel.innerHTML = '<span class="n3-brain-kicker">COMPANY BRAIN</span><span class="n3-brain-state">idle</span>';
  const brainLabelObj = new CSS2DObject(brainLabel);
  brainLabelObj.position.set(0, -3.5, 0);
  brain.add(brainLabelObj);

  // ---------------------------------------------------------------- hubs
  const nodes = {};
  const hubMeshes = [];
  depts.forEach((d, i) => {
    const a = -Math.PI / 2 + (i / depts.length) * TAU;
    // Flattened ring: leaves headroom for the lead text and the prompt bar.
    const pos = new THREE.Vector3(Math.cos(a) * R, Math.sin(a) * R * 0.58, Math.sin(i * 1.7) * 1.2);
    const col = new THREE.Color(d.color);
    const g = new THREE.Group();
    g.position.copy(pos);
    world.add(g);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.58, 2),
      new THREE.MeshStandardMaterial({ color: col, metalness: 1, roughness: 0.26, emissive: col, emissiveIntensity: 0.22 }),
    );
    core.userData.dept = d.id;
    g.add(core);
    // Forgiving hit target: the hub itself is only ~20px wide on screen.
    const hit = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 12), new THREE.MeshBasicMaterial({ visible: false }));
    hit.userData.dept = d.id;
    g.add(hit);
    hubMeshes.push(hit);

    const ringA = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.018, 8, 80),
      new THREE.MeshStandardMaterial({ color: col, metalness: 1, roughness: 0.2, emissive: col, emissiveIntensity: 0.5 }));
    const ringB = ringA.clone();
    ringB.rotation.y = Math.PI / 2;
    ringA.rotation.x = Math.PI / 2.4;
    g.add(ringA, ringB);

    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color: col, transparent: true, opacity: 0.26, blending: THREE.AdditiveBlending, depthWrite: false }));
    halo.scale.setScalar(3.2);
    g.add(halo);

    // constellation branches, fanning away from the centre
    const out = pos.clone().normalize();
    const pts = [], dots = [];
    for (let b = 0; b < 5; b++) {
      let p = pos.clone().add(out.clone().multiplyScalar(0.8));
      let dir = out.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), rnd(-0.9, 0.9));
      const segs = 2 + Math.floor(Math.random() * 3);
      for (let s = 0; s < segs; s++) {
        dir = dir.clone().applyAxisAngle(new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), 1).normalize(), rnd(-0.5, 0.5)).normalize();
        const next = p.clone().add(dir.clone().multiplyScalar(rnd(0.9, 1.8))).add(new THREE.Vector3(0, 0, rnd(-0.5, 0.5)));
        pts.push(p.clone(), next.clone());
        dots.push(next.clone());
        p = next;
      }
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0x9aa3c4, transparent: true, opacity: 0.32 }));
    world.add(lines);
    const dotGeo = new THREE.BufferGeometry().setFromPoints(dots);
    const dotPts = new THREE.Points(dotGeo, new THREE.PointsMaterial({ color: 0xdfe3f2, size: 0.11, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }));
    world.add(dotPts);

    // link to the brain, with beads that flow along it
    const linkPts = [pos.clone().multiplyScalar(0.92), pos.clone().normalize().multiplyScalar(3.1)];
    const link = new THREE.Line(new THREE.BufferGeometry().setFromPoints(linkPts),
      new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.3 }));
    world.add(link);
    const BEADS = 7;
    const beadGeo = new THREE.BufferGeometry();
    beadGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(BEADS * 3), 3));
    const beads = new THREE.Points(beadGeo, new THREE.PointsMaterial({ color: col, size: 0.16, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    world.add(beads);

    // sub-agents: small metal octahedra that appear when you zoom in
    const agents = (d.agents || []).map((ag, k, arr) => {
      const ang = (k / arr.length) * TAU;
      const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0),
        new THREE.MeshStandardMaterial({ color: col, metalness: 1, roughness: 0.25, emissive: col, emissiveIntensity: 0.6 }));
      m.position.set(Math.cos(ang) * 1.55, Math.sin(ang) * 1.55 * 0.7, Math.sin(ang * 2) * 0.5);
      m.scale.setScalar(0.001);
      const el = document.createElement('div');
      el.className = 'n3-agent';
      el.innerHTML = `<b>${ag.name}</b><span>${ag.watches}</span>`;
      const lab = new CSS2DObject(el);
      lab.position.set(0, 0.34, 0);
      m.add(lab);
      g.add(m);
      return { m, el, ang };
    });

    const labEl = document.createElement('div');
    labEl.className = 'n3-label';
    labEl.style.setProperty('--dc', d.color);
    labEl.innerHTML = `<span class="n3-name">${d.label.toUpperCase()}</span><span class="n3-sub">${d.sub}</span>`;
    const labObj = new CSS2DObject(labEl);
    labObj.position.copy(out.clone().multiplyScalar(2.1).setZ(0));
    g.add(labObj);

    nodes[d.id] = { d, g, core, ringA, ringB, halo, lines, dotPts, link, beads, agents, labEl, pos, col, state: 'idle', flow: 0, target: 1, scale: 1 };
  });

  // ---------------------------------------------------------------- dust + bursts
  const DUST = 900;
  const dp = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    const r = rnd(9, 30), th = rnd(0, TAU), ph = Math.acos(rnd(-1, 1));
    dp[i * 3] = r * Math.sin(ph) * Math.cos(th); dp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th); dp[i * 3 + 2] = r * Math.cos(ph) * 0.5;
  }
  const dust = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(dp, 3)),
    new THREE.PointsMaterial({ color: 0x8e97bb, size: 0.07, transparent: true, opacity: 0.5, depthWrite: false }),
  );
  scene.add(dust);

  const BURST = 700;
  const up = new Float32Array(BURST * 3), uc = new Float32Array(BURST * 3);
  const uv = new Float32Array(BURST * 3), ul = new Float32Array(BURST);
  const burstGeo = new THREE.BufferGeometry();
  burstGeo.setAttribute('position', new THREE.BufferAttribute(up, 3));
  burstGeo.setAttribute('color', new THREE.BufferAttribute(uc, 3));
  const bursts = new THREE.Points(burstGeo, new THREE.PointsMaterial({
    size: 0.13, vertexColors: true, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  }));
  world.add(bursts);
  let burstCursor = 0;
  function emit(origin, color, n = 60, speed = 3.4) {
    for (let k = 0; k < n; k++) {
      const i = burstCursor = (burstCursor + 1) % BURST;
      const th = rnd(0, TAU), ph = Math.acos(rnd(-1, 1)), s = rnd(0.3, 1) * speed;
      up[i * 3] = origin.x; up[i * 3 + 1] = origin.y; up[i * 3 + 2] = origin.z;
      uv[i * 3] = Math.sin(ph) * Math.cos(th) * s; uv[i * 3 + 1] = Math.sin(ph) * Math.sin(th) * s; uv[i * 3 + 2] = Math.cos(ph) * s;
      uc[i * 3] = color.r; uc[i * 3 + 1] = color.g; uc[i * 3 + 2] = color.b;
      ul[i] = 1;
    }
  }

  // ---------------------------------------------------------------- conflicts
  const conflictGroup = new THREE.Group();
  world.add(conflictGroup);

  // ---------------------------------------------------------------- post
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  // Restrained bloom: glow around the marks, not a white-out.
  const bloom = new UnrealBloomPass(new THREE.Vector2(host.clientWidth, host.clientHeight), 0.5, 0.55, 0.42);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // ---------------------------------------------------------------- camera state
  const camTarget = new THREE.Vector3(0, 0, camIdle);
  const lookTarget = new THREE.Vector3(0, 0, 0);
  const lookNow = new THREE.Vector3(0, 0, 0);
  let mode = 'idle', focused = null, hovered = null, hoverAt = null, orbit = 0, pointer = { x: 0, y: 0 };

  function desiredCamera() {
    if (mode === 'idle') {
      const x = Math.sin(orbit) * 2.0 + pointer.x * 1.8;
      const y = Math.cos(orbit * 0.8) * 1.1 + pointer.y * 1.3;
      camTarget.set(x, y, camIdle);
      lookTarget.set(0, 0, 0);
    } else {
      const n = nodes[focused || hovered];
      if (!n) return;
      const focusing = mode === 'focus';
      const z = focusing ? CAM_FOCUS : CAM_HOVER;
      // Drift toward the hub without flying through it, and shift right when the
      // agent panel is open on the left so the hub stays clear of it.
      const wp = n.pos.clone().add(world.position);
      camTarget.copy(wp).multiplyScalar(focusing ? 0.62 : 0.45)
        .add(new THREE.Vector3(pointer.x * 0.5 + (focusing ? 1.6 : 0), pointer.y * 0.4, z));
      lookTarget.copy(wp).multiplyScalar(focusing ? 0.92 : 0.8);
    }
  }

  // ---------------------------------------------------------------- picking
  const ray = new THREE.Raycaster();
  ray.params.Points.threshold = 0.3;
  const ndc = new THREE.Vector2();
  function pick(ev) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
    ndc.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(ndc, camera);
    return ray.intersectObjects(hubMeshes, false)[0]?.object.userData.dept || null;
  }

  function onMove(ev) {
    const r = renderer.domElement.getBoundingClientRect();
    pointer.x = ((ev.clientX - r.left) / r.width - 0.5) * 2;
    pointer.y = -((ev.clientY - r.top) / r.height - 0.5) * 2;
    let hit = pick(ev);
    // The fly-in moves the hub out from under the cursor. Keep the hover until
    // the pointer really moves away, so jitter or a click doesn't cancel it.
    if (!hit && hovered && hoverAt && Math.hypot(ev.clientX - hoverAt.x, ev.clientY - hoverAt.y) < 40) hit = hovered;
    if (hit !== hovered) {
      if (hit) {
        hovered = hit;
        hoverAt = { x: ev.clientX, y: ev.clientY };
        const n = nodes[hit];
        n.target = 1.45;
        emit(n.pos, n.col, 40, 2.6);
        if (mode !== 'focus') mode = 'hover';
        onHover?.(hit, ev.clientX, ev.clientY);
      } else {
        if (hovered) nodes[hovered].target = 1;
        hovered = null;
        if (mode !== 'focus') mode = 'idle';
        onHoverEnd?.();
      }
      renderer.domElement.style.cursor = hit ? 'pointer' : 'default';
    }
  }
  function onClick(ev) {
    // The hover fly-in slides the hub out from under a still cursor, so a click
    // that misses while a department is still hovered means that department.
    const hit = pick(ev) || hovered;
    if (hit) { api.focus(hit); onSelect?.(hit); }
    else if (focused) { api.focus(null); onSelect?.(null); }
  }
  renderer.domElement.addEventListener('pointermove', onMove);
  renderer.domElement.addEventListener('pointerleave', () => { if (hovered) nodes[hovered].target = 1; hovered = null; if (mode !== 'focus') mode = 'idle'; onHoverEnd?.(); });
  renderer.domElement.addEventListener('click', onClick);
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && focused) { api.focus(null); onSelect?.(null); } });

  // ---------------------------------------------------------------- loop
  const clock = new THREE.Clock();
  let running = true, visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.02 });
  io.observe(host);

  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;

    orbit += dt * 0.08;
    desiredCamera();
    camera.position.lerp(camTarget, 1 - Math.pow(0.002, dt));
    lookNow.lerp(lookTarget, 1 - Math.pow(0.004, dt));
    camera.lookAt(lookNow);

    brain.rotation.y += dt * 0.08;
    brainPts.rotation.y -= dt * 0.14;
    brainPts.rotation.x = Math.sin(t * 0.2) * 0.2;
    const pulse = 1 + Math.sin(t * 1.6) * 0.02;
    brainCore.scale.setScalar(pulse);
    gimbals.forEach((g, i) => { g.rotation.x += dt * (0.22 + i * 0.1); g.rotation.z += dt * (0.14 - i * 0.04); });
    dust.rotation.y += dt * 0.012;
    dust.rotation.x += dt * 0.004;

    for (const id in nodes) {
      const n = nodes[id];
      n.scale += (n.target - n.scale) * (1 - Math.pow(0.001, dt));
      n.g.scale.setScalar(n.scale);
      n.core.rotation.y += dt * 0.5;
      n.ringA.rotation.z += dt * 0.6;
      n.ringB.rotation.x += dt * 0.45;
      // beads flowing toward the brain
      const arr = n.beads.geometry.attributes.position.array;
      const speed = n.state === 'pending' ? 0.55 : n.state === 'done' ? 0.22 : 0.1;
      n.flow = (n.flow + dt * speed) % 1;
      const from = n.pos.clone().multiplyScalar(0.92), to = n.pos.clone().normalize().multiplyScalar(3.1);
      for (let k = 0; k < 7; k++) {
        const f = (n.flow + k / 7) % 1;
        arr[k * 3] = from.x + (to.x - from.x) * f;
        arr[k * 3 + 1] = from.y + (to.y - from.y) * f;
        arr[k * 3 + 2] = from.z + (to.z - from.z) * f + Math.sin(f * Math.PI) * 0.6;
      }
      n.beads.geometry.attributes.position.needsUpdate = true;
      n.beads.material.opacity = n.state === 'off' ? 0 : n.state === 'pending' ? 0.95 : n.state === 'done' ? 0.7 : 0.25;
      // agents orbit and fade in only when this department is focused
      const show = focused === id;
      n.agents.forEach((ag, k) => {
        const want = show ? 1 : 0.001;
        const s = ag.m.scale.x + (want - ag.m.scale.x) * (1 - Math.pow(0.004, dt));
        ag.m.scale.setScalar(s);
        ag.el.classList.toggle('on', show);
        const ang = ag.ang + t * 0.25;
        ag.m.position.set(Math.cos(ang) * 1.55, Math.sin(ang) * 1.55 * 0.7, Math.sin(ang * 2) * 0.5);
        ag.m.rotation.x += dt * 1.2; ag.m.rotation.y += dt * 0.9;
      });
      n.halo.material.opacity = (n.state === 'off' ? 0.04 : 0.2) + (hovered === id || focused === id ? 0.35 : 0) + (n.state === 'pending' ? Math.sin(t * 5) * 0.12 + 0.12 : 0);
    }

    // burst particles
    let anyAlive = false;
    for (let i = 0; i < BURST; i++) {
      if (ul[i] <= 0) continue;
      anyAlive = true;
      ul[i] -= dt * 0.75;
      const damp = Math.pow(0.12, dt);
      uv[i * 3] *= damp; uv[i * 3 + 1] *= damp; uv[i * 3 + 2] *= damp;
      up[i * 3] += uv[i * 3] * dt; up[i * 3 + 1] += uv[i * 3 + 1] * dt; up[i * 3 + 2] += uv[i * 3 + 2] * dt;
      const f = Math.max(0, ul[i]);
      uc[i * 3] *= 1; // colour set at emit; fade via alpha below
      burstGeo.attributes.color.array[i * 3] = uc[i * 3] * f;
      burstGeo.attributes.color.array[i * 3 + 1] = uc[i * 3 + 1] * f;
      burstGeo.attributes.color.array[i * 3 + 2] = uc[i * 3 + 2] * f;
    }
    if (anyAlive) { burstGeo.attributes.position.needsUpdate = true; burstGeo.attributes.color.needsUpdate = true; }

    conflictGroup.children.forEach((c, i) => { c.material.opacity = 0.35 + Math.sin(t * 2 + i) * 0.25; });

    composer.render();
    labelRenderer.render(scene, camera);
  }
  frame();

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    camIdle = idleDistance(w, h);
    world.position.y = worldLift(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
    bloom.setSize(w, h);
    labelRenderer.setSize(w, h);
  }
  window.addEventListener('resize', resize);

  const api = {
    is3d: true,
    setDept(id, state, v) {
      const n = nodes[id];
      if (!n) return;
      const was = n.state;
      n.state = state;
      n.labEl.dataset.state = state;
      n.labEl.dataset.stance = v?.stance || '';
      const sub = n.labEl.querySelector('.n3-sub');
      if (state === 'done' && v) {
        sub.textContent = `${v.stance} · ${v.confidence}%`;
        n.core.material.emissiveIntensity = 0.22 + (v.confidence / 100) * 0.5;
        n.lines.material.opacity = 0.3 + (v.confidence / 100) * 0.45;
        n.dotPts.material.opacity = 0.7 + (v.confidence / 100) * 0.3;
        n.link.material.opacity = v.stance === 'oppose' ? 0.15 : 0.55;
        if (was !== 'done') emit(n.pos, n.col, 110, 4.2);
      } else {
        sub.textContent = state === 'off' ? 'not on this committee' : state === 'pending' ? 'deliberating…' : state === 'error' ? 'no verdict' : n.d.sub;
        n.core.material.emissiveIntensity = state === 'off' ? 0.04 : 0.22;
        n.lines.material.opacity = state === 'off' ? 0.06 : 0.32;
        n.dotPts.material.opacity = state === 'off' ? 0.1 : 0.75;
        n.link.material.opacity = state === 'off' ? 0.05 : 0.3;
      }
      n.g.visible = true;
      n.halo.material.opacity = state === 'off' ? 0.05 : 0.35;
    },
    setBrain(state, decision) {
      brainLabel.dataset.state = state;
      const st = brainLabel.querySelector('.n3-brain-state');
      st.textContent = decision ? decision.label : state === 'thinking' ? 'weighing the verdicts…' : 'awaiting a decision';
      brainLabel.dataset.tone = decision?.tone || '';
      const tone = decision ? { good: 0x76e7b0, warn: 0xf2c46a, bad: 0xff8f7e }[decision.tone] : 0xffc9dd;
      brainCore.material.emissive.setHex(tone);
      brainGlow.material.color.setHex(tone);
      brainCore.material.emissiveIntensity = decision ? 0.9 : state === 'thinking' ? 0.75 : 0.55;
      brainPts.material.size = state === 'thinking' ? 0.075 : 0.055;
      if (decision) emit(new THREE.Vector3(0, 0, 0), new THREE.Color(tone), 220, 6);
    },
    setConflicts(pairs) {
      conflictGroup.clear();
      const involved = new Set(pairs.flatMap(p => [p.a, p.b]));
      pairs.forEach(({ a, b }) => {
        const A = nodes[a], B = nodes[b];
        if (!A || !B) return;
        const mid = A.pos.clone().add(B.pos).multiplyScalar(0.5).multiplyScalar(0.25);
        const curve = new THREE.QuadraticBezierCurve3(A.pos.clone(), mid, B.pos.clone());
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)),
          new THREE.LineBasicMaterial({ color: 0xfff3e2, transparent: true, opacity: 0.6 }));
        conflictGroup.add(line);
      });
      for (const id in nodes) {
        const dim = pairs.length > 0 && !involved.has(id);
        nodes[id].labEl.classList.toggle('dim', dim);
        nodes[id].core.material.opacity = 1;
        nodes[id].halo.material.opacity = dim ? 0.05 : 0.35;
        nodes[id].lines.material.opacity = dim ? 0.05 : 0.32;
      }
    },
    focus(id) {
      focused = id;
      if (id) { mode = 'focus'; emit(nodes[id].pos, nodes[id].col, 90, 3); }
      else { mode = hovered ? 'hover' : 'idle'; }
      host.dataset.focused = id || '';
      return id;
    },
    reset() {
      for (const id in nodes) api.setDept(id, nodes[id].state === 'off' ? 'off' : 'idle');
      api.setBrain('idle', null);
      api.setConflicts([]);
      api.focus(null);
    },
    dispose() {
      running = false;
      io.disconnect();
      window.removeEventListener('resize', resize);
      renderer.dispose();
      host.innerHTML = '';
    },
  };
  return api;
}
