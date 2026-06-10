// === BLOCK 0 ===

// ═══════════════════════════════════════════════
//  CHAPTER 1 — HERO: MANNEQUIN HAND + TEST TUBE
//  (adapted from user concept)
// ═══════════════════════════════════════════════
(function(){
  const cv = document.getElementById('three-canvas');
  const renderer = new THREE.WebGLRenderer({canvas:cv, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.physicallyCorrectLights = true;

  const scene = new THREE.Scene();
  // transparent — dark site background shows through

  const camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, 0.1, 100);
  camera.position.set(0, 2, 6);

  // OrbitControls — user can rotate the scene
  const controls = new THREE.OrbitControls(camera, cv);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 3.5;
  controls.maxDistance = 10;
  controls.maxPolarAngle = Math.PI / 1.6;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.6;

  // ── LIGHTING (studio style) ─────────────────────
  scene.add(new THREE.AmbientLight('#ffffff', 0.65));

  const studioLight = new THREE.DirectionalLight('#ffffff', 1.3);
  studioLight.position.set(5, 10, 7);
  studioLight.castShadow = true;
  scene.add(studioLight);

  // Back light — makes glass tube shimmer
  const backLight = new THREE.DirectionalLight('#b0d8ff', 0.9);
  backLight.position.set(-5, 5, -5);
  scene.add(backLight);

  // Accent cyan rim (matches site theme)
  const rimLight = new THREE.PointLight('#00d4ff', 3.5, 12);
  rimLight.position.set(-2, 3, 1);
  scene.add(rimLight);

  // Pink glow from liquid
  const liqGlow = new THREE.PointLight('#ff007f', 4, 5);
  liqGlow.position.set(0.2, 0.7, 0.5);
  scene.add(liqGlow);

  // ── MATERIALS ──────────────────────────────────
  const woodMat = new THREE.MeshStandardMaterial({
    color: '#ddc4a0',
    roughness: 0.42,
    metalness: 0.08
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: '#eef8ff',
    transparent: true,
    opacity: 0.28,
    roughness: 0.04,
    metalness: 0.05,
    transmission: 0.85,
    ior: 1.5,
    side: THREE.DoubleSide
  });

  const liquidMat = new THREE.MeshStandardMaterial({
    color: '#ff007f',
    roughness: 0.18,
    metalness: 0.05,
    emissive: '#cc0055',
    emissiveIntensity: 0.28,
    transparent: true,
    opacity: 0.92
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: '#ccddee',
    metalness: 0.5,
    roughness: 0.12
  });

  // ── LAB GROUP ──────────────────────────────────
  const LabGroup = new THREE.Group();

  // Wrist / lower arm base (tapered cylinder)
  const baseGeo = new THREE.CylinderGeometry(0.38, 0.55, 1.4, 32);
  const base = new THREE.Mesh(baseGeo, woodMat);
  base.position.y = -0.7; base.castShadow = true;
  LabGroup.add(base);

  // Palm (cylinder)
  const palmGeo = new THREE.CylinderGeometry(0.40, 0.38, 0.9, 32);
  const palm = new THREE.Mesh(palmGeo, woodMat);
  palm.position.y = 0.45; palm.castShadow = true;
  LabGroup.add(palm);

  // Palm top dome (knuckle area)
  const palmTopGeo = new THREE.SphereGeometry(0.40, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
  const palmTop = new THREE.Mesh(palmTopGeo, woodMat);
  palmTop.position.y = 0.9; palmTop.castShadow = true;
  LabGroup.add(palmTop);

  // ── TEST TUBE ───────────────────────────────────
  const tubeGroup = new THREE.Group();

  // Glass walls (open cylinder)
  tubeGroup.add(new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 2.4, 32, 1, true), glassMat));

  // Bottom hemisphere
  const tubeBotGeo = new THREE.SphereGeometry(0.18, 32, 16, 0, Math.PI*2, Math.PI/2, Math.PI/2);
  const tubeBot = new THREE.Mesh(tubeBotGeo, glassMat);
  tubeBot.position.y = -1.2; tubeGroup.add(tubeBot);

  // Top rim (glass edge ring)
  const tubeRim = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.01, 8, 32), rimMat);
  tubeRim.position.y = 1.2; tubeGroup.add(tubeRim);

  // Pink liquid — fills lower 45%
  const LH = 1.08;
  const LY = -1.2 + LH / 2;   // = -0.66
  const LT = -1.2 + LH;        // = -0.12

  const liqBody = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, LH, 32), liquidMat);
  liqBody.position.y = LY; tubeGroup.add(liqBody);

  const liqBotCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 32, 16, 0, Math.PI*2, Math.PI/2, Math.PI/2), liquidMat);
  liqBotCap.position.y = -1.195; tubeGroup.add(liqBotCap);

  const liqSurf = new THREE.Mesh(new THREE.CircleGeometry(0.17, 32), liquidMat);
  liqSurf.rotation.x = -Math.PI/2; liqSurf.position.y = LT; tubeGroup.add(liqSurf);

  // Glowing ring at surface
  const gRingM = new THREE.MeshBasicMaterial({color:0xff44aa, transparent:true, opacity:0.6});
  const gRing  = new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.016, 8, 32), gRingM);
  gRing.position.y = LT; tubeGroup.add(gRing);

  // Rising bubbles
  const bMat = new THREE.MeshBasicMaterial({color:0xff88cc, transparent:true, opacity:0.45});
  const bubbles = [];
  for(let i=0;i<10;i++){
    const r = 0.012 + Math.random()*0.022;
    const b = new THREE.Mesh(new THREE.SphereGeometry(r,8,8), bMat);
    const d = {
      oy: -1.15+Math.random()*0.95, spd:0.20+Math.random()*0.45,
      ox:(Math.random()-.5)*0.26, oz:(Math.random()-.5)*0.26, ph:Math.random()*Math.PI*2
    };
    b.position.set(d.ox,d.oy,d.oz); b.userData=d;
    tubeGroup.add(b); bubbles.push(b);
  }

  // Position tube — held at angle, protruding above hand
  tubeGroup.position.set(0.12, 1.14, 0.22);
  tubeGroup.rotation.z = -0.15;   // slight natural tilt (matches user's code)
  LabGroup.add(tubeGroup);

  // ── FINGERS ────────────────────────────────────
  function createFinger(x, y, z, pLen, mLen, dLen, rotZ, rotX) {
    const fg = new THREE.Group();
    fg.position.set(x, y, z);
    fg.rotation.z = rotZ;
    fg.rotation.x = rotX || 0;

    [[pLen, 0.075, 0.072], [mLen, 0.070, 0.067], [dLen, 0.064, 0.058]].forEach(([len, r1, r2], i) => {
      const seg = new THREE.Group();
      const pivot = new THREE.Group();

      const ph = new THREE.Mesh(new THREE.CylinderGeometry(r2, r1, len, 14), woodMat);
      ph.position.y = len / 2; ph.castShadow = true;
      const jt = new THREE.Mesh(new THREE.SphereGeometry(r1 * 1.08, 14, 12), woodMat);

      seg.add(ph, jt);
      pivot.position.y = i === 0 ? 0 : 0; // accumulated via nesting
      seg.rotation.z = i > 0 ? 0.12 : 0; // slight curl on mid/tip
      seg.position.y = i === 0 ? 0 : 0;

      if (i === 0) { fg.add(seg); fg._mid = seg; fg._midLen = len; }
      else if (i === 1) {
        const midAnchor = new THREE.Group(); midAnchor.position.y = pLen;
        midAnchor.rotation.z = 0.10;
        midAnchor.add(seg); fg._mid.add(midAnchor); fg._tipAnchor = midAnchor; fg._midLen2 = len;
      } else {
        const tipAnchor = new THREE.Group(); tipAnchor.position.y = mLen;
        tipAnchor.rotation.z = 0.08;
        tipAnchor.add(seg); fg._tipAnchor.add(tipAnchor);
      }
    });

    // Fingertip sphere
    const tipGrp = new THREE.Group(); tipGrp.position.y = dLen;
    const tipSph = new THREE.Mesh(new THREE.SphereGeometry(0.060, 12, 10), woodMat);
    fg._tipAnchor.children[0].add(tipGrp); tipGrp.add(tipSph);

    return fg;
  }

  // 4 fingers — slightly different lengths and angles, grip around tube
  LabGroup.add(createFinger(-0.22, 0.88, -0.16, 0.52, 0.38, 0.28,  0.42, -0.10));
  LabGroup.add(createFinger(-0.14, 0.92,  0.00, 0.58, 0.42, 0.30,  0.22,  0.00));
  LabGroup.add(createFinger(-0.08, 0.89,  0.15, 0.54, 0.40, 0.28,  0.18,  0.10));
  LabGroup.add(createFinger(-0.04, 0.84,  0.28, 0.44, 0.34, 0.24,  0.16,  0.18));

  // Thumb — from opposite side, short
  const thumbG = new THREE.Group();
  thumbG.position.set(0.30, 0.56, -0.10);
  thumbG.rotation.set(0.10, 0.28, -0.55);
  const th1 = new THREE.Mesh(new THREE.CylinderGeometry(0.070, 0.075, 0.40, 14), woodMat);
  th1.position.y = 0.20; thumbG.add(th1);
  const th1j = new THREE.Mesh(new THREE.SphereGeometry(0.078, 14, 12), woodMat); thumbG.add(th1j);
  const th2g = new THREE.Group(); th2g.position.y = 0.40; th2g.rotation.z = -0.15;
  const th2 = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.068, 0.32, 14), woodMat); th2.position.y = 0.16;
  const th2j = new THREE.Mesh(new THREE.SphereGeometry(0.070, 14, 12), woodMat);
  th2g.add(th2, th2j); thumbG.add(th2g);
  LabGroup.add(thumbG);

  scene.add(LabGroup);

  // ── PARTICLES ──────────────────────────────────
  const PC = 1600;
  const pp = new Float32Array(PC*3), pc = new Float32Array(PC*3);
  for(let i=0;i<PC;i++){
    const r=5+Math.random()*9, th=Math.random()*Math.PI*2, ph2=Math.acos(2*Math.random()-1);
    pp[i*3]=r*Math.sin(ph2)*Math.cos(th); pp[i*3+1]=r*Math.sin(ph2)*Math.sin(th); pp[i*3+2]=r*Math.cos(ph2);
    pc[i*3]=0.6+Math.random()*0.4; pc[i*3+1]=0; pc[i*3+2]=0.5+Math.random()*0.5; // pink-purple particles
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pp,3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(pc,3));
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({size:0.025,vertexColors:true,transparent:true,opacity:0.45})));

  // ── RESIZE & ANIMATION ─────────────────────────
  window.addEventListener('resize',()=>{
    camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
  });

  let t = 0;
  (function anim(){
    requestAnimationFrame(anim);
    t += 0.016;

    controls.update();

    // Bubble rise + reset
    bubbles.forEach(b => {
      const d = b.userData;
      b.position.y += d.spd * 0.007;
      b.position.x = d.ox + Math.sin(t*d.spd*1.6+d.ph)*0.04;
      if(b.position.y > LT) b.position.y = d.oy;
    });

    // Liquid glow pulse
    liqGlow.intensity = 3.5 + Math.sin(t*1.8)*1.5;
    gRing.material.opacity = 0.5 + Math.sin(t*2.0)*0.2;
    liquidMat.emissiveIntensity = 0.22 + Math.sin(t*1.4)*0.12;

    renderer.render(scene, camera);
  })();
})();

// ═══════════════════════════════════════════════
//  CHAPTER 2 — PRODUCT 3D VIEWER (interactive)
// ═══════════════════════════════════════════════
(function(){
  const wrap = document.querySelector('.pd-view');
  const cv = document.getElementById('prod-canvas');
  if(!wrap||!cv) return;

  const W=wrap.offsetWidth, H=wrap.offsetHeight;
  const renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(W,H);
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.1;

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(50,W/H,0.1,100);
  camera.position.set(3.5,2.2,4.5);
  camera.lookAt(0,0,0);

  const g=new THREE.Group();

  // Main chamber body
  const bodyG=new THREE.BoxGeometry(2.6,1.6,2.0);
  const steelM=new THREE.MeshStandardMaterial({color:0x2a3a4a,metalness:.85,roughness:.2});
  g.add(new THREE.Mesh(bodyG,steelM));

  // Glass front panel
  const glassG=new THREE.BoxGeometry(2.58,1.58,0.04);
  const glassM=new THREE.MeshStandardMaterial({color:0x00aacc,metalness:.1,roughness:.05,transparent:true,opacity:.22});
  const glass=new THREE.Mesh(glassG,glassM);
  glass.position.z=1.0;
  g.add(glass);

  // Frame edges
  const edgeM=new THREE.MeshBasicMaterial({color:0x00d4ff,wireframe:true,transparent:true,opacity:.35});
  g.add(new THREE.Mesh(bodyG,edgeM));

  // Glove ports
  const portG=new THREE.TorusGeometry(.3,.05,16,40);
  const portM=new THREE.MeshStandardMaterial({color:0x111a26,metalness:.7,roughness:.3,emissive:0x001122});
  const ringM=new THREE.MeshBasicMaterial({color:0x00d4ff});
  const ringG=new THREE.TorusGeometry(.3,.012,8,40);
  for(let x of[-0.6,0.6]){
    const p=new THREE.Mesh(portG,portM); p.position.set(x,0,1.02); g.add(p);
    const r=new THREE.Mesh(ringG,ringM); r.position.set(x,0,1.04); g.add(r);
  }

  // Antechamber (right side cylinder)
  const acG=new THREE.CylinderGeometry(.38,.38,.7,32);
  const acM=new THREE.MeshStandardMaterial({color:0x1e2d3d,metalness:.9,roughness:.15});
  const ac=new THREE.Mesh(acG,acM);
  ac.rotation.z=Math.PI/2; ac.position.set(1.65,0,0);
  g.add(ac);
  // Antechamber door ring
  const adG=new THREE.TorusGeometry(.38,.025,8,32);
  const adM=new THREE.MeshBasicMaterial({color:0x00d4ff,transparent:true,opacity:.5});
  const ad=new THREE.Mesh(adG,adM);
  ad.rotation.y=Math.PI/2; ad.position.set(2.0,0,0);
  g.add(ad);

  // Legs
  const legG=new THREE.CylinderGeometry(.06,.06,.9,8);
  const legM=new THREE.MeshStandardMaterial({color:0x445566,metalness:.9,roughness:.2});
  for(const x of[-1,1]) for(const z of[-0.75,0.75]){
    const l=new THREE.Mesh(legG,legM);
    l.position.set(x,-1.25,z); g.add(l);
  }
  // Base plate
  const bpG=new THREE.BoxGeometry(2.4,.06,1.7);
  g.add(new THREE.Mesh(bpG,steelM));
  const bp=new THREE.Mesh(bpG,steelM);
  bp.position.y=-0.83; g.add(bp);

  // Interior glow plane
  const igG=new THREE.PlaneGeometry(2.3,1.4);
  const igM=new THREE.MeshBasicMaterial({color:0x003344,transparent:true,opacity:.6,side:THREE.DoubleSide});
  const ig=new THREE.Mesh(igG,igM);
  ig.position.set(0,0,.98); g.add(ig);

  scene.add(g);

  // Lights
  scene.add(new THREE.AmbientLight(0x334466,2.5));
  const l1=new THREE.PointLight(0x00d4ff,5,20); l1.position.set(3,5,4); scene.add(l1);
  const l2=new THREE.PointLight(0x0055ff,3,15); l2.position.set(-4,0,3); scene.add(l2);
  const l3=new THREE.PointLight(0x00ffaa,2,10); l3.position.set(0,3,-2); scene.add(l3);

  // Orbit controls (manual)
  let drag=false,lx=0,ly=0,ry=-.3,rx=.18;
  cv.addEventListener('mousedown',e=>{drag=true;lx=e.clientX;ly=e.clientY;});
  document.addEventListener('mouseup',()=>drag=false);
  document.addEventListener('mousemove',e=>{
    if(!drag)return;
    ry+=(e.clientX-lx)*.012; rx+=(e.clientY-ly)*.006;
    rx=Math.max(-.55,Math.min(.7,rx));
    lx=e.clientX;ly=e.clientY;
  });
  // Touch support
  cv.addEventListener('touchstart',e=>{drag=true;lx=e.touches[0].clientX;ly=e.touches[0].clientY;});
  document.addEventListener('touchend',()=>drag=false);
  document.addEventListener('touchmove',e=>{
    if(!drag)return;
    ry+=(e.touches[0].clientX-lx)*.012; rx+=(e.touches[0].clientY-ly)*.006;
    lx=e.touches[0].clientX;ly=e.touches[0].clientY;
  });

  let auto=0;
  (function anim(){
    requestAnimationFrame(anim);
    if(!drag) auto+=.004;
    g.rotation.y=auto+ry;
    g.rotation.x=rx;
    renderer.render(scene,camera);
  })();

  window.addEventListener('resize',()=>{
    const nW=wrap.offsetWidth,nH=wrap.offsetHeight;
    camera.aspect=nW/nH; camera.updateProjectionMatrix();
    renderer.setSize(nW,nH);
  });
})();

// ═══════════════════════════════════════════════
//  CHAPTER 3 — GSAP SCROLL ANIMATIONS
// ═══════════════════════════════════════════════
gsap.registerPlugin(ScrollTrigger);

// Header scroll state
ScrollTrigger.create({start:'top -50',onUpdate:s=>{
  document.getElementById('hdr').classList.toggle('on',s.progress>0);
}});

// Hero entrance
gsap.from('.hero-badge',{duration:1,opacity:0,y:20,delay:.3});
gsap.from('.hero-h1',{duration:1.3,opacity:0,y:45,delay:.5});
gsap.from('.hero-sub',{duration:1,opacity:0,y:28,delay:.85});
gsap.from('.hero-btns',{duration:1,opacity:0,y:18,delay:1.1});

// ── REVEAL: IntersectionObserver + guaranteed fallback ──────────
const io=new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target);}});
},{threshold:0, rootMargin:'0px 0px 120px 0px'});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

// Fallback: reveal everything after 1.8s regardless of scroll position
setTimeout(()=>document.querySelectorAll('.rv:not(.vis)').forEach(el=>el.classList.add('vis')),1800);

// ── CATALOG ACCORDION (mobile) ──────────────────────────────────
(function(){
  // Inject toggle button into each cat-hdr on mobile
  function setupAccordion(){
    if(window.innerWidth > 768) return;
    document.querySelectorAll('.cat-section').forEach(sec=>{
      const hdr = sec.querySelector('.cat-hdr');
      if(!hdr || hdr.querySelector('.cat-toggle')) return;
      const title = hdr.querySelector('.cat-hdr-left');
      const count = hdr.querySelector('.cat-count');
      // Wrap in button
      const btn = document.createElement('button');
      btn.className='cat-toggle';
      btn.setAttribute('aria-expanded','false');
      btn.appendChild(title.cloneNode(true));
      const iconEl = document.createElement('span');
      iconEl.className='cat-toggle-icon'; iconEl.textContent='+';
      btn.appendChild(iconEl);
      hdr.innerHTML='';
      if(count) hdr.appendChild(count);
      hdr.appendChild(btn);
      btn.addEventListener('click',()=>{
        const open = sec.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true':'false');
        // Reveal cards inside when opened
        if(open) sec.querySelectorAll('.rv:not(.vis)').forEach(el=>el.classList.add('vis'));
      });
    });
  }
  setupAccordion();
  window.addEventListener('resize', setupAccordion);
})();

// ═══════════════════════════════════════════════
//  CHAPTER 4 — MODAL / FORM LOGIC
// ═══════════════════════════════════════════════
function openModal(product){
  document.getElementById('modal').classList.add('on');
  document.body.style.overflow='hidden';
  if(product) document.getElementById('m-prod').value=product;
}
function closeModal(){
  document.getElementById('modal').classList.remove('on');
  document.body.style.overflow='';
  setTimeout(()=>{
    document.getElementById('m-form').style.display='block';
    document.getElementById('m-ok').style.display='none';
    document.getElementById('m-name').value='';
    document.getElementById('m-phone').value='';
    document.getElementById('m-prod').value='';
    document.getElementById('m-msg').value='';
  },350);
}
document.getElementById('modal').addEventListener('click',function(e){if(e.target===this)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

function submitModal(){
  const n=document.getElementById('m-name').value.trim();
  const p=document.getElementById('m-phone').value.trim();
  if(!n||!p){alert('Пожалуйста, укажите имя и телефон');return;}
  document.getElementById('m-form').style.display='none';
  document.getElementById('m-ok').style.display='block';
}

function submitPage(){
  const n=document.getElementById('pf-name').value.trim();
  const p=document.getElementById('pf-phone').value.trim();
  if(!n||!p){alert('Пожалуйста, укажите имя и телефон');return;}
  document.getElementById('page-form').style.display='none';
  document.getElementById('page-ok').style.display='block';
}

// ═══════════════════════════════════════════════
//  CHAPTER 5 — WEB AUDIO MILESTONE TONES
// ═══════════════════════════════════════════════
let actx=null;
function initAudio(){if(actx)return;actx=new(window.AudioContext||window.webkitAudioContext)();}
function tone(f,d=.12,v=.04){
  if(!actx)return;
  const o=actx.createOscillator(),g=actx.createGain();
  o.connect(g);g.connect(actx.destination);
  o.frequency.value=f;o.type='sine';
  g.gain.setValueAtTime(v,actx.currentTime);
  g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+d);
  o.start();o.stop(actx.currentTime+d);
}
document.addEventListener('click',initAudio,{once:true});
document.querySelectorAll('.prod-c,.news-c,.meth-c').forEach(c=>{
  c.addEventListener('mouseenter',()=>tone(880,.08,.025));
});
document.querySelectorAll('.btn-p').forEach(b=>{
  b.addEventListener('mouseenter',()=>tone(1046,.1,.03));
});

