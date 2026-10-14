/* Escena 3D del gato en la laptop, extraída como init global.
   Llamar window.initCatScene() cuando el canvas #cat-canvas y THREE existan. */
window.initCatScene = function(){
  if(window.__catStarted) return true;
  const canvas = document.getElementById("cat-canvas");
  if(!canvas || !window.THREE) return false;
  window.__catStarted = true;
  const MODEL_URLS = [
    (window.__resources && window.__resources.catGlb) ? window.__resources.catGlb : "cat.glb",
    "https://raw.githubusercontent.com/DevTakao/threejs-cat/HEAD/assets/models/toon_cat_free.glb"
  ];

  const scene = new THREE.Scene();
  const stage = new THREE.Group();
  stage.scale.setScalar(0.78);
  scene.add(stage);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(1.0, 1.35, 6.1);
  camera.lookAt(0, 0.55, 0);
  let sceneX = 2.15;

  function computeSceneX(){
    const w = canvas.clientWidth || window.innerWidth;
    if(w < 680) return 0.05;
    if(w < 980) return 0.85;
    return 2.15;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  function sizeNow(){
    const w = canvas.clientWidth  || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  sizeNow();
  window.addEventListener("resize", sizeNow);

  scene.add(new THREE.AmbientLight(0x3a4560, 0.58));
  scene.add(new THREE.HemisphereLight(0xffe4c4, 0x0e1220, 0.45));
  const key = new THREE.DirectionalLight(0xffc88a, 1.55);
  key.position.set(5, 5.5, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 5;
  key.shadow.camera.left=-8; key.shadow.camera.right=8;
  key.shadow.camera.top=8; key.shadow.camera.bottom=-8;
  key.shadow.bias = -0.0004;
  scene.add(key);
  const warm = new THREE.PointLight(0xff9a42, 1.1, 14, 2);
  warm.position.set(1.8, 1.7, 2.6);
  scene.add(warm);
  const coolRim = new THREE.DirectionalLight(0x5a8fce, 0.7);
  coolRim.position.set(-6, 3, -4);
  scene.add(coolRim);
  const fill = new THREE.DirectionalLight(0xffd9b0, 0.45);
  fill.position.set(-2, 4, 6);
  scene.add(fill);

  function roundRect(g,x,y,w,h,r){ g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath(); }

  function woodTexture(){
    const c=document.createElement("canvas"); c.width=512; c.height=256;
    const g=c.getContext("2d");
    const grain=g.createLinearGradient(0,0,0,256);
    grain.addColorStop(0,"#4a2a20");
    grain.addColorStop(.48,"#523024");
    grain.addColorStop(1,"#49281e");
    g.fillStyle=grain; g.fillRect(0,0,512,256);
    const t=new THREE.CanvasTexture(c);
    t.encoding=THREE.sRGBEncoding;
    return t;
  }

  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(26, 0.4, 8),
    new THREE.MeshStandardMaterial({ map:woodTexture(), roughness:0.9, metalness:0.02 })
  );
  desk.position.y = -0.2; desk.receiveShadow = true; scene.add(desk);

  /* --- Modelo 3D de Laptop Realista (estilo MacBook Pro Space Gray) --- */
  const laptop = new THREE.Group();

  const aluMat = new THREE.MeshStandardMaterial({
    color: 0x565f70,
    roughness: 0.32,
    metalness: 0.72
  });
  const aluDarkMat = new THREE.MeshStandardMaterial({
    color: 0x2c3340,
    roughness: 0.42,
    metalness: 0.60
  });
  const wellMat = new THREE.MeshStandardMaterial({
    color: 0x12161f,
    roughness: 0.65,
    metalness: 0.25
  });
  const keycapMat = new THREE.MeshStandardMaterial({
    color: 0x1b202c,
    roughness: 0.52,
    metalness: 0.15
  });
  const bezelMat = new THREE.MeshStandardMaterial({
    color: 0x0b0e14,
    roughness: 0.22,
    metalness: 0.15
  });

  // Base inferior oscura + patitas de apoyo
  const underBase = new THREE.Mesh(new THREE.BoxGeometry(2.08, 0.03, 1.44), aluDarkMat);
  underBase.position.y = 0.025;
  underBase.castShadow = true;
  underBase.receiveShadow = true;
  laptop.add(underBase);

  const footGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.014, 16);
  const footMat = new THREE.MeshStandardMaterial({ color: 0x0f1218, roughness: 0.9 });
  [[-0.86, 0.007, -0.56], [0.86, 0.007, -0.56], [-0.86, 0.007, 0.56], [0.86, 0.007, 0.56]].forEach(([fx, fy, fz]) => {
    const foot = new THREE.Mesh(footGeo, footMat);
    foot.position.set(fx, fy, fz);
    laptop.add(foot);
  });

  // Cuerpo principal de aluminio (mantiene la altura superior en ~0.168 para que el gato pise exacto)
  const baseCore = new THREE.Mesh(new THREE.BoxGeometry(2.16, 0.115, 1.50), aluMat);
  baseCore.position.y = 0.095;
  baseCore.castShadow = true;
  baseCore.receiveShadow = true;
  laptop.add(baseCore);

  // Biseles laterales redondeados para suavizar el perfil del chasis
  const sideEdgeGeo = new THREE.CylinderGeometry(0.056, 0.056, 1.50, 16);
  sideEdgeGeo.rotateX(Math.PI / 2);
  [-1.08, 1.08].forEach((sx) => {
    const edge = new THREE.Mesh(sideEdgeGeo, aluMat);
    edge.position.set(sx, 0.095, 0);
    edge.scale.set(0.35, 1, 1);
    laptop.add(edge);
  });

  // Superficie superior cepillada (deck)
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(2.14, 0.016, 1.48),
    new THREE.MeshStandardMaterial({ color: 0x5e6778, roughness: 0.30, metalness: 0.70 })
  );
  deck.position.y = 0.158;
  deck.receiveShadow = true;
  laptop.add(deck);

  // Muesca frontal para levantar la pantalla (lip notch)
  const lipNotch = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.026, 0.04), aluDarkMat);
  lipNotch.position.set(0, 0.148, 0.738);
  laptop.add(lipNotch);

  // Cavidad hundida del teclado
  const keebWell = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.006, 0.78), wellMat);
  keebWell.position.set(0, 0.164, -0.14);
  laptop.add(keebWell);

  // Teclas 3D individuales con relieve
  const keyRows = 6;
  const keyCols = 14;
  const wellW = 1.60;
  const wellD = 0.73;
  const stepX = wellW / keyCols;
  const stepZ = wellD / keyRows;
  const stdKeyGeo = new THREE.BoxGeometry(stepX * 0.84, 0.012, stepZ * 0.80);
  const fnKeyGeo  = new THREE.BoxGeometry(stepX * 0.84, 0.010, stepZ * 0.52);

  for(let r = 0; r < keyRows; r++){
    const kz = -0.14 - wellD / 2 + (r + 0.5) * stepZ;
    for(let c = 0; c < keyCols; c++){
      // Barra espaciadora en la última fila
      if(r === keyRows - 1 && c >= 4 && c <= 8){
        if(c === 6){
          const spaceGeo = new THREE.BoxGeometry(stepX * 4.85, 0.012, stepZ * 0.82);
          const spaceKey = new THREE.Mesh(spaceGeo, keycapMat);
          spaceKey.position.set(0, 0.170, kz);
          laptop.add(spaceKey);
        }
        continue;
      }
      const kx = -wellW / 2 + (c + 0.5) * stepX;
      const kMesh = new THREE.Mesh(r === 0 ? fnKeyGeo : stdKeyGeo, keycapMat);
      kMesh.position.set(kx, 0.170, kz);
      laptop.add(kMesh);
    }
  }

  // Rejillas de altavoces laterales
  function speakerTexture(){
    const c = document.createElement("canvas"); c.width = 64; c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = "#5e6778"; g.fillRect(0, 0, 64, 256);
    g.fillStyle = "#1c222e";
    for(let y = 16; y < 240; y += 6){
      for(let x = 10; x < 54; x += 6){
        g.fillRect(x, y, 2, 2);
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    return t;
  }
  const spkMat = new THREE.MeshStandardMaterial({ map: speakerTexture(), roughness: 0.4, metalness: 0.6 });
  [-0.95, 0.95].forEach((sx) => {
    const spk = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.76), spkMat);
    spk.rotation.x = -Math.PI / 2;
    spk.position.set(sx, 0.167, -0.14);
    laptop.add(spk);
  });

  // Trackpad de cristal esmerilado con marco sutil
  const padBorder = new THREE.Mesh(
    new THREE.PlaneGeometry(0.68, 0.43),
    new THREE.MeshStandardMaterial({ color: 0x3b4252, roughness: 0.4, metalness: 0.6 })
  );
  padBorder.rotation.x = -Math.PI / 2;
  padBorder.position.set(0, 0.167, 0.47);
  laptop.add(padBorder);

  const pad = new THREE.Mesh(
    new THREE.PlaneGeometry(0.66, 0.41),
    new THREE.MeshStandardMaterial({ color: 0x4e5668, roughness: 0.24, metalness: 0.58 })
  );
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(0, 0.168, 0.47);
  laptop.add(pad);

  // Bisagra cilíndrica central
  const clutchGeo = new THREE.CylinderGeometry(0.036, 0.036, 1.42, 20);
  clutchGeo.rotateZ(Math.PI / 2);
  const clutch = new THREE.Mesh(clutchGeo, wellMat);
  clutch.position.set(0, 0.145, -0.71);
  laptop.add(clutch);

  function screenTexture(){
    const c=document.createElement("canvas"); c.width=512; c.height=320;
    const g=c.getContext("2d");
    const grd=g.createLinearGradient(0,0,512,320);
    grd.addColorStop(0,"#0a0f18"); grd.addColorStop(0.5,"#0e1522"); grd.addColorStop(1,"#080c14");
    g.fillStyle=grd; g.fillRect(0,0,512,320);
    // Sidebar del IDE
    g.fillStyle="#080b12"; g.fillRect(0,28,82,292);
    g.fillStyle="rgba(255,255,255,0.05)"; g.fillRect(82,28,1,292);
    for(let i=0;i<9;i++){
      g.fillStyle = i===2 ? "rgba(107,155,195,0.35)" : "rgba(148,163,184,0.18)";
      roundRect(g, 12, 42 + i*20, 42 + (i%3)*10, 6, 2); g.fill();
    }
    // Barra superior de ventana
    g.fillStyle="#111826"; g.fillRect(0,0,512,28);
    ["#ff5f56","#ffbd2e","#27c93f"].forEach((col,i)=>{ g.fillStyle=col; g.beginPath(); g.arc(18+i*18,14,4.5,0,7); g.fill(); });
    // Líneas de código limpias y equilibradas
    const palette=["#6b9bc3","#c8794b","#7ee787","#d2a8ff","#9aa3ba","#79c0ff"];
    let y=50;
    for(let row=0; row<15; row++){
      // Número de línea
      g.fillStyle="rgba(138,147,171,0.25)";
      g.fillRect(94, y+1, 8, 5);
      let x=114 + (row%4===0 ? 0 : row%2===0 ? 18 : 32);
      const segs=2+(row%3);
      for(let s=0;s<segs;s++){
        const w=22+((row*29 + s*43)%74);
        g.fillStyle=palette[(row+s)%palette.length]; g.globalAlpha=0.72;
        roundRect(g, x, y, w, 6.5, 2); g.fill();
        x+=w+10; if(x>475) break;
      }
      y+=16;
    }
    g.globalAlpha=.06;
    const shine=g.createLinearGradient(90,0,420,320);
    shine.addColorStop(0,"rgba(255,255,255,0)");
    shine.addColorStop(.48,"rgba(255,255,255,.35)");
    shine.addColorStop(1,"rgba(255,255,255,0)");
    g.fillStyle=shine; g.fillRect(0,0,512,320);
    g.globalAlpha=1;
    const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; return t;
  }

  function screenOffTexture(){
    const c=document.createElement("canvas"); c.width=512; c.height=320;
    const g=c.getContext("2d");
    const grd=g.createLinearGradient(0,0,512,320);
    grd.addColorStop(0,"#05070b"); grd.addColorStop(.48,"#0d121b"); grd.addColorStop(1,"#040508");
    g.fillStyle=grd; g.fillRect(0,0,512,320);
    g.globalAlpha=.045;
    g.fillStyle="#fff6df"; g.beginPath(); g.ellipse(210,118,170,18,-.35,0,Math.PI*2); g.fill();
    g.globalAlpha=1;
    const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; return t;
  }

  const scrTex = screenTexture();
  const scrOffTex = screenOffTexture();
  const screenOffMat = new THREE.MeshStandardMaterial({
    map: scrOffTex,
    roughness: 0.18,
    metalness: 0.08
  });
  const screenOnMat = new THREE.MeshStandardMaterial({
    map: scrTex,
    emissiveMap: scrTex,
    emissive: 0xffffff,
    emissiveIntensity: 0,
    roughness: 0.20,
    metalness: 0.05,
    transparent: true,
    opacity: 0
  });

  const hinge = new THREE.Group();
  hinge.position.set(0, 0.145, -0.72);

  // Carcasa trasera de aluminio más delgada y elegante
  const lid = new THREE.Mesh(new THREE.BoxGeometry(2.14, 1.38, 0.042), aluMat);
  lid.position.y = 0.69;
  lid.castShadow = true;

  // Marco frontal de cristal negro (bezel)
  const bezel = new THREE.Mesh(new THREE.PlaneGeometry(2.10, 1.34), bezelMat);
  bezel.position.set(0, 0.69, 0.022);

  // Panel LCD (con biseles delgados modernos)
  const scrOff = new THREE.Mesh(new THREE.PlaneGeometry(1.98, 1.22), screenOffMat);
  scrOff.position.set(0, 0.68, 0.023);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.98, 1.22), screenOnMat);
  scr.position.set(0, 0.68, 0.025);

  // Cámara web superior en el bisel
  const webcamLens = new THREE.Mesh(
    new THREE.CircleGeometry(0.012, 14),
    new THREE.MeshBasicMaterial({ color: 0x1a2636 })
  );
  webcamLens.position.set(0, 1.32, 0.024);

  const screenGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.08, 1.32),
    new THREE.MeshBasicMaterial({ color:0x6b9bc3, transparent:true, opacity:0, depthWrite:false, blending:THREE.AdditiveBlending })
  );
  screenGlow.position.set(0, 0.68, 0.03);

  hinge.add(lid);
  hinge.add(bezel);
  hinge.add(scrOff);
  hinge.add(scr);
  hinge.add(webcamLens);
  hinge.add(screenGlow);
  hinge.rotation.x = -0.28;
  laptop.add(hinge);

  // Luz de pantalla suave y realista
  const screenLight = new THREE.PointLight(0x7aa6d2, 0, 3.8, 2);
  screenLight.position.set(0, 0.85, -0.22);
  laptop.add(screenLight);

  // Micro-LED de estado discreto
  const powerLedMat = new THREE.MeshBasicMaterial({ color:0x1b222c });
  const powerLed = new THREE.Mesh(new THREE.SphereGeometry(0.008, 10, 8), powerLedMat);
  powerLed.position.set(0.96, 0.168, 0.62);
  laptop.add(powerLed);

  stage.add(laptop);

  function applySceneLayout(){
    sceneX = computeSceneX();
    stage.position.x = sceneX;
  }
  applySceneLayout();
  window.addEventListener("resize", applySceneLayout);

  const shTex = (function(){
    const c=document.createElement("canvas"); c.width=128; c.height=128;
    const g=c.getContext("2d");
    const grd=g.createRadialGradient(64,64,4,64,64,60);
    grd.addColorStop(0,"rgba(0,0,0,0.6)"); grd.addColorStop(1,"rgba(0,0,0,0)");
    g.fillStyle=grd; g.fillRect(0,0,128,128);
    return new THREE.CanvasTexture(c);
  })();
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.15), new THREE.MeshBasicMaterial({ map:shTex, transparent:true, depthWrite:false, opacity:0 }));
  blob.rotation.x = -Math.PI/2; stage.add(blob);

  const CAT_TARGET_LEN = 1.35;
  const catHolder = new THREE.Group();
  stage.add(catHolder);

  const rig = {};
  let tailChain = [];
  let catReady = false;

  let mixer = null, runAction = null, clipDur = 0.8333;
  const STRIDE_LEN = 1.55;
  const RAD_PER_UNIT = (Math.PI*2) / STRIDE_LEN;

  const AX = { legSwing:"x", legFold:"x", tailLift:"x", tailSway:"z", earTwitch:"z", headYaw:"z", headPitch:"x" };

  function normName(n){ return (n||"").toLowerCase().replace(/[._\s]/g,""); }
  function mapBones(root){
    const bones=[];
    root.traverse(o=>{ if(o.isBone) bones.push(o); });
    const find = (...pats)=> bones.find(b=>{ const n=normName(b.name); return pats.some(p=>n.includes(p)); });
    rig.root   = find("root01");
    rig.torso  = find("torso");
    rig.spine1 = find("spine01");
    rig.spine2 = find("spine02");
    rig.neck   = find("neck");
    rig.head   = find("head0","head");
    rig.earL   = find("earl");
    rig.earR   = find("earr");
    rig.mouth  = find("mouth");
    rig.eyeL   = find("eyel");
    rig.eyeR   = find("eyer");
    rig.flUp   = find("upperfl");  rig.flLo = find("lowerfl");  rig.flFt = find("footfl");
    rig.frUp   = find("upperfr");  rig.frLo = find("lowerfr");  rig.frFt = find("footfr");
    rig.blTh   = find("thighbl");  rig.blUp = find("upperbl");  rig.blLo = find("lowerbl"); rig.blFt = find("footbl");
    rig.brTh   = find("thighbr");  rig.brUp = find("upperbr");  rig.brLo = find("lowerbr"); rig.brFt = find("footbr");
    tailChain = ["tail07","tail01","tail02","tail03","tailend"]
      .map(p=>bones.find(b=>normName(b.name).startsWith(p)))
      .filter(Boolean);
    bones.forEach(b=>{
      b.userData.restQ = b.quaternion.clone();
      b.userData.restP = b.position.clone();
      b.userData.restS = b.scale.clone();
    });
    rig.all = bones;
  }
  const _e = new THREE.Euler(), _q = new THREE.Quaternion();
  function addRot(bone, x, y, z){
    if(!bone) return;
    _q.setFromEuler(_e.set(x||0, y||0, z||0));
    bone.quaternion.multiply(_q);
  }
  function axisRot(bone, axis, ang){
    if(!bone || !ang) return;
    addRot(bone, axis==="x"?ang:0, axis==="y"?ang:0, axis==="z"?ang:0);
  }
  function resetBones(){
    if(!rig.all) return;
    for(const b of rig.all){
      b.quaternion.copy(b.userData.restQ);
      b.position.copy(b.userData.restP);
      b.scale.copy(b.userData.restS);
    }
  }

  /* --- Shader del Gato: Gris Carbón Atigrado, Hocico Blanco y Ojos Verdes --- */
  function makeCatMaterial(eyeL, eyeR, nose, earL, earR){
    const mat = new THREE.MeshStandardMaterial({ roughness:0.92, metalness:0.02, skinning:true });
    mat.onBeforeCompile = (shader)=>{
      shader.uniforms.uEyeL = { value: eyeL };
      shader.uniforms.uEyeR = { value: eyeR };
      shader.uniforms.uNose = { value: nose };
      shader.uniforms.uEarL = { value: earL };
      shader.uniforms.uEarR = { value: earR };
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vBind;\nvarying vec3 vBindN;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvBind = position;\nvBindN = normal;");
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", `#include <common>
        varying vec3 vBind;
        varying vec3 vBindN;
        uniform vec3 uEyeL; uniform vec3 uEyeR; uniform vec3 uNose;
        uniform vec3 uEarL; uniform vec3 uEarR;
        float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
        float vnoise(vec2 p){
          vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(hash2(i),hash2(i+vec2(1.,0.)),f.x), mix(hash2(i+vec2(0.,1.)),hash2(i+vec2(1.,1.)),f.x), f.y);
        }`)
        .replace("#include <map_fragment>", `#include <map_fragment>
        {
          float ny = clamp(vBind.y / 3.70, 0.0, 1.0);
          float nz = clamp((vBind.z + 3.37) / 5.77, 0.0, 1.0);
          float g1 = vnoise(vBind.zy * 6.5 + vBind.xx * 3.2);
          float g2 = vnoise(vBind.zy * 24.0 + 7.3);
          float grizzle = g1*0.52 + g2*0.48;

          // Paleta gris carbón atigrado (inspirada en la foto)
          vec3 dorsal      = vec3(0.105, 0.110, 0.118); // Gris carbón oscuro en el lomo
          vec3 ticking     = vec3(0.235, 0.242, 0.252); // Pelaje agutí gris ceniza / plateado
          vec3 ventral     = vec3(0.175, 0.182, 0.192); // Gris medio oscuro en pecho y vientre
          vec3 dark        = vec3(0.016, 0.018, 0.022); // Rayas negras atigradas
          vec3 whiteMuzzle = vec3(0.900, 0.910, 0.925); // Blanco limpio para hocico y barbilla
          vec3 pinkN       = vec3(0.380, 0.165, 0.155); // Nariz terracota / rosado oscuro
          vec3 pinkE       = vec3(0.280, 0.215, 0.230); // Interior de oreja gris rosado suave

          vec3 fur = mix(ventral, dorsal, smoothstep(0.20, 0.72, ny));
          fur = mix(fur, ticking, grizzle*0.55);
          fur = mix(fur, fur*0.58, (1.0-grizzle)*0.32);

          // Línea dorsal oscura
          float spineLine = (1.0 - smoothstep(0.06, 0.17, abs(vBind.x)))
                          * smoothstep(0.60, 0.72, ny)
                          * smoothstep(0.18, 0.30, nz) * (1.0 - smoothstep(0.80, 0.90, nz));
          float stripes = spineLine * 0.92;

          // Rayas atigradas (mackerel tabby) en torso, cola, frente y patas
          float wob = (vnoise(vec2(vBind.z*2.1, vBind.x*2.3)) - 0.5) * 1.6;
          float band = sin(vBind.z*5.8 + vBind.y*0.85 + wob);
          float torso = smoothstep(0.30,0.52,ny)
                      * smoothstep(0.16,0.28,nz)
                      * (1.0 - smoothstep(0.75,0.86,nz));
          stripes += smoothstep(0.28, 0.72, band) * torso * (0.62 + 0.65*g2);

          // Anillos negros bien definidos en la cola
          float tailM = 1.0 - smoothstep(0.13, 0.20, nz);
          stripes += smoothstep(0.10, 0.60, sin(vBind.z*6.2)) * tailM * 0.95;

          // Rayas finas en la cabeza y mejillas
          float headM = smoothstep(0.72,0.82,ny) * smoothstep(0.74,0.86,nz);
          stripes += smoothstep(0.35,0.82,sin(vBind.x*14.5)) * headM * 0.90;

          // Rayas horizontales en las patas (en la foto las patas son grises atigradas, no blancas)
          float legM = (1.0 - smoothstep(0.38,0.52,ny)) * smoothstep(0.06,0.20,ny);
          stripes += smoothstep(0.32,0.78,sin(vBind.y*8.5 + vBind.x*1.3)) * legM * 0.68;

          fur = mix(fur, dark, clamp(stripes, 0.0, 1.0) * 0.92);

          // Pecho ligeramente más claro con collares atigrados
          float chest = smoothstep(0.64,0.92,nz) * (1.0 - smoothstep(0.30,0.54,ny));
          fur = mix(fur, ticking * 1.08, clamp(chest * 0.35, 0.0, 1.0));

          // Hocico, bigotera y barbilla blancos (como en la foto)
          float dMuzzle = length((vBind - (uNose + vec3(0.0, -0.07, -0.04))) * vec3(1.15, 1.35, 0.95));
          float muzzleSpot = (1.0 - smoothstep(0.16, 0.34, dMuzzle)) * smoothstep(uNose.z - 0.28, uNose.z + 0.15, vBind.z);
          float muzzleZone = smoothstep(0.87,0.96,nz) * smoothstep(0.44,0.55,ny) * (1.0 - smoothstep(0.68,0.76,ny));
          float whiteMask = clamp(max(muzzleSpot, muzzleZone * 0.92), 0.0, 1.0);
          fur = mix(fur, whiteMuzzle, whiteMask * 0.95);

          // Punta de la cola negra
          float tip = 1.0 - smoothstep(-3.34, -2.92, vBind.z);
          fur = mix(fur, dark, tip*0.95);

          // Orejas
          float dEar = min(length(vBind - uEarL), length(vBind - uEarR));
          float earFront = smoothstep(0.10, 0.50, vBindN.z);
          fur = mix(fur, pinkE, (1.0 - smoothstep(0.26, 0.40, dEar)) * earFront * 0.75);
          fur = mix(fur, dark, smoothstep(0.30,0.42,dEar)*(1.0-smoothstep(0.48,0.60,dEar))*0.45);

          // Nariz con borde oscuro
          float dN = length(vBind.xy - uNose.xy);
          float frontN = smoothstep(uNose.z - 0.15, uNose.z + 0.25, vBind.z);
          fur = mix(fur, dark, smoothstep(0.075, 0.105, dN) * (1.0 - smoothstep(0.105, 0.135, dN)) * frontN * 0.75);
          fur = mix(fur, pinkN, (1.0 - smoothstep(0.055, 0.098, dN)) * frontN);

          // Ojos verde claro luminoso con delineado negro y pupila vertical felina
          float dL = length(vBind.xy - uEyeL.xy);
          float dR = length(vBind.xy - uEyeR.xy);
          float dE = min(dL, dR);
          vec2 eyeLocal = (dL < dR) ? (vBind.xy - uEyeL.xy) : (vBind.xy - uEyeR.xy);
          float frontE = smoothstep(uEyeL.z - 0.15, uEyeL.z + 0.25, vBind.z);

          // Delineado negro alrededor de los ojos
          fur = mix(fur, dark, smoothstep(0.125,0.152,dE)*(1.0-smoothstep(0.172,0.215,dE)) * frontE * 0.92);

          // Iris verde salvia / esmeralda claro (como en la foto)
          vec3 irisOuter = vec3(0.150, 0.310, 0.135);
          vec3 irisInner = vec3(0.440, 0.650, 0.330);
          vec3 iris = mix(irisOuter, irisInner, smoothstep(0.135, 0.032, dE));
          // Anillo limbal oscuro exterior
          iris = mix(iris, vec3(0.015, 0.030, 0.015), smoothstep(0.112, 0.138, dE));
          // Pupila vertical felina
          float slit = length(vec2(eyeLocal.x * 2.35, eyeLocal.y * 0.92));
          iris = mix(vec3(0.004, 0.006, 0.005), iris, smoothstep(0.048, 0.074, slit));
          // Brillo especular del ojo
          float hl = min(length(vBind.xy - (uEyeL.xy + vec2(-0.042, 0.048))),
                         length(vBind.xy - (uEyeR.xy + vec2(-0.042, 0.048))));
          iris = mix(vec3(0.95, 0.97, 0.99), iris, smoothstep(0.018, 0.040, hl));

          fur = mix(fur, iris, (1.0 - smoothstep(0.135, 0.162, dE)) * frontE);
          diffuseColor.rgb = fur;
        }`);
    };
    return mat;
  }

  function measureSkinned(root){
    let sk=null; root.traverse(o=>{ if(o.isSkinnedMesh && !sk) sk=o; });
    if(!sk) return null;
    root.updateMatrixWorld(true);
    const pos=sk.geometry.attributes.position, v=new THREE.Vector3();
    const box=new THREE.Box3(); box.makeEmpty();
    const step=Math.max(1, Math.floor(pos.count/1200));
    for(let i=0;i<pos.count;i+=step){
      v.fromBufferAttribute(pos,i);
      if(sk.boneTransform) sk.boneTransform(i,v);
      v.applyMatrix4(sk.matrixWorld);
      box.expandByPoint(v);
    }
    return box;
  }

  function onModelReady(gltf){
    const model = gltf.scene;
    mapBones(model);
    model.updateMatrixWorld(true);
    let sk = null;
    model.traverse(o=>{ if(o.isSkinnedMesh && !sk) sk = o; });
    const bindOf = (bone, fx, fy, fz)=>{
      const p = new THREE.Vector3(fx, fy, fz);
      if(bone && sk && sk.skeleton){
        const i = sk.skeleton.bones.indexOf(bone);
        if(i >= 0){
          const m = new THREE.Matrix4().copy(sk.skeleton.boneInverses[i]).invert();
          p.setFromMatrixPosition(m);
        }
      }
      return p;
    };
    const eyeL = bindOf(rig.eyeL,  0.38, 2.72, 1.85);
    const eyeR = bindOf(rig.eyeR, -0.38, 2.72, 1.85);
    const nose = bindOf(rig.mouth, 0.0, 2.35, 1.88);
    nose.y += 0.06;
    const earL = bindOf(rig.earL,  0.55, 3.35, 1.10);
    const earR = bindOf(rig.earR, -0.55, 3.35, 1.10);
    const catMat = makeCatMaterial(eyeL, eyeR, nose, earL, earR);
    model.traverse(o=>{
      if(o.isMesh || o.isSkinnedMesh){
        o.castShadow = true; o.receiveShadow = false;
        o.frustumCulled = false;
        o.material = catMat;
      }
    });
    const box = measureSkinned(model);
    const align = new THREE.Group();
    let s = 1;
    if(box){
      const size=new THREE.Vector3(); box.getSize(size);
      const len = Math.max(size.x, size.z) || 1;
      s = CAT_TARGET_LEN / len;
      align.position.set(-(box.min.x+box.max.x)/2, -box.min.y, -(box.min.z+box.max.z)/2);
    }
    align.add(model);
    const inner = new THREE.Group();
    inner.rotation.y = Math.PI / 2;
    inner.scale.setScalar(s);
    inner.add(align);
    catHolder.add(inner);
    if(gltf.animations && gltf.animations.length){
      mixer = new THREE.AnimationMixer(model);
      const clip = gltf.animations[0];
      clipDur = clip.duration || clipDur;
      runAction = mixer.clipAction(clip);
      runAction.setLoop(THREE.LoopRepeat, Infinity);
      runAction.timeScale = 0;
      runAction.setEffectiveWeight(0);
      runAction.play();
    }
    catReady = true;
    blob.material.opacity = 0.5;
  }

  function loadModel(i){
    if(i >= MODEL_URLS.length){
      console.warn("[cat] No se pudo cargar el modelo del gato. Descarga cat.glb y ponlo junto a este HTML.");
      return;
    }
    new THREE.GLTFLoader().load(
      MODEL_URLS[i],
      onModelReady,
      undefined,
      ()=> loadModel(i+1)
    );
  }
  if(window.THREE && THREE.GLTFLoader) loadModel(0);
  else console.warn("[cat] GLTFLoader no disponible.");

  const LAPTOP_TOP = 0.17;
  const LYING_Y      = LAPTOP_TOP - 0.215;
  const LAP_STAND_Y  = LAPTOP_TOP;
  const DESK_STAND_Y = 0.0;
  const YAW_IDLE=-1.45, YAW_LEFT=-Math.PI, YAW_RIGHT=0;

  const randomRestDuration = () => 18 + Math.random() * 10;
  const SETTLE_TO_LIE_DUR = 2.4;
  const STATES = {
    LYING:    {dur:randomRestDuration()},
    STAND:    {dur:2.2},
    JUMP_DOWN:{dur:1.65},
    WALK_OFF: {dur:3.4},
    WALK_BACK:{dur:4.3},
    JUMP_UP:  {dur:2.6}
  };
  const ORDER = ["LYING","STAND","JUMP_DOWN","WALK_OFF","WALK_BACK","JUMP_UP"];
  let stateIdx=0, stateName="LYING", t=0;
  let idleInteractions = 0;
  let exitSide = 1;
  let from={x:0,y:LYING_Y,z:0.05,yaw:YAW_IDLE,pose:0};
  let to=Object.assign({},from);
  const state={x:0,y:LYING_Y,z:0.05,yaw:YAW_IDLE,pose:0};
  const smoothPos = { x: 0, y: LYING_Y, z: 0.05, yaw: YAW_IDLE, roll: 0 };

  const clamp01=(u)=>Math.min(1,Math.max(0,u));
  const smoothstep=(a,b,v)=>{
    const u=clamp01((v-a)/(b-a));
    return u*u*(3-2*u);
  };
  const smoother=(u)=>{
    u=clamp01(u);
    return u*u*u*(u*(u*6-15)+10);
  };
  const ease=smoother;

  function dampValue(cur, target, lambda, dt){
    return cur + (target - cur) * (1 - Math.exp(-lambda * dt));
  }
  function dampAngle(cur, target, lambda, dt){
    let d = ((target - cur + Math.PI) % (Math.PI * 2)) - Math.PI;
    if(d < -Math.PI) d += Math.PI * 2;
    return cur + d * (1 - Math.exp(-lambda * dt));
  }

  const JUMP_DOWN_LAND = { x:1.60, z:0.85 };
  const JUMP_UP_START  = { x:1.45, z:0.85 };

  function enter(name){
    const previousName = stateName;
    stateName=name; t=0; from=Object.assign({},state);
    if(name==="LYING"){
      if(previousName==="JUMP_UP") exitSide *= -1;
      STATES.LYING.dur = randomRestDuration();
      idleInteractions = 0;
    }
    if(name==="WALK_BACK" && previousName==="WALK_OFF"){
      Object.assign(state, {
        x:-exitSide*10.2, y:DESK_STAND_Y, z:0.85,
        yaw:exitSide > 0 ? YAW_RIGHT : YAW_LEFT, pose:1
      });
      smoothPos.x = state.x;
      smoothPos.y = state.y;
      smoothPos.z = state.z;
      smoothPos.yaw = state.yaw;
      from=Object.assign({},state);
    }
    switch(name){
      case "LYING":     to={x:0, y:LYING_Y,     z:0.05, yaw:YAW_IDLE, pose:0}; break;
      case "STAND":     to={x:0, y:LAP_STAND_Y, z:0.05, yaw:YAW_IDLE, pose:1}; break;
      case "JUMP_DOWN": to={x:exitSide*JUMP_DOWN_LAND.x, y:DESK_STAND_Y, z:JUMP_DOWN_LAND.z,
                            yaw:exitSide > 0 ? YAW_RIGHT : YAW_LEFT, pose:1}; break;
      case "WALK_OFF":  to={x:exitSide*10.4, y:DESK_STAND_Y, z:0.85,
                            yaw:exitSide > 0 ? YAW_RIGHT : YAW_LEFT, pose:1}; break;
      case "WALK_BACK": to={x:exitSide*JUMP_UP_START.x, y:DESK_STAND_Y, z:JUMP_UP_START.z,
                            yaw:exitSide > 0 ? YAW_RIGHT : YAW_LEFT, pose:1}; break;
      case "JUMP_UP":   to={x:0, y:LAP_STAND_Y, z:0.10, yaw:YAW_IDLE, pose:1}; break;
    }
  }
  function advance(){ stateIdx=(stateIdx+1)%ORDER.length; enter(ORDER[stateIdx]); }
  enter("LYING");

  let walkPhase=0, prevX=0, smoothLie=1, gaitBlend=0;
  let nextFlick=1.3, flickActive=false, flickT=0; const flickDur=0.95; let flickDir=1;
  let nextEar=3.0, earActive=false, earT=0; const earDur=0.38; let earWhich=0;
  let nextBlink=2.2, blinkActive=false, blinkT=0; const blinkDur=0.16;
  const clock = new THREE.Clock();
  let screenPower = 0;

  // Iluminación de pantalla atenuada y suave al prenderse
  function updateScreenPower(dt, force=false){
    const target = (stateName==="LYING" && state.pose < 0.3 && Math.abs(state.x) < 0.8) ? 0 : 1;
    const speed = target > screenPower ? 2.6 : 2.2;
    const k = force ? 1 : 1 - Math.exp(-dt * speed);
    screenPower += (target - screenPower) * k;
    screenOnMat.opacity = screenPower * 0.96;
    screenOnMat.emissiveIntensity = screenPower * 0.26;
    screenLight.intensity = screenPower * 0.22;
    screenGlow.material.opacity = screenPower * 0.025;
    powerLedMat.color.setHex(screenPower > 0.25 ? 0x6b9bc3 : 0x1b222c);
  }

  const ZERO_JUMP = {crouch:0, air:0, brace:0, land:0, wiggle:0, pitch:0};
  const smoothJump = {crouch:0, air:0, brace:0, land:0, wiggle:0, pitch:0};

  function poseSkeleton(now, dt, lie, walking, resting, jump){
    if(!catReady) return;
    resetBones();
    const poseK = 1-Math.exp(-dt*6.0);
    smoothLie += (lie - smoothLie) * poseK;
    gaitBlend += ((walking?1:0)-gaitBlend) * (1-Math.exp(-dt*6.5));
    const L = smoothLie;

    const rawJ = jump || ZERO_JUMP;
    const jK = 1 - Math.exp(-dt * 12.0);
    smoothJump.crouch += (rawJ.crouch - smoothJump.crouch) * jK;
    smoothJump.air    += (rawJ.air    - smoothJump.air)    * jK;
    smoothJump.brace  += (rawJ.brace  - smoothJump.brace)  * jK;
    smoothJump.land   += (rawJ.land   - smoothJump.land)   * jK;
    smoothJump.wiggle += (rawJ.wiggle - smoothJump.wiggle) * jK;
    smoothJump.pitch  += (rawJ.pitch  - smoothJump.pitch)  * jK;
    const J = smoothJump;

    const jumpTotal = Math.min(1, J.crouch + J.air + J.brace + J.land);
    if(runAction && mixer){
      runAction.setEffectiveWeight(gaitBlend);
      if(gaitBlend > 0.001){
        const cyc = walkPhase / (Math.PI*2);
        runAction.time = (cyc - Math.floor(cyc)) * clipDur;
      }
      mixer.update(0);
    }
    const lieRear  = Math.min(1, L*1.45);
    const lieFront = Math.max(0, (L-0.28)/0.72);
    const uSt = Math.min(t/STATES.STAND.dur, 1);
    const stretch = stateName==="STAND" ? Math.sin(uSt*Math.PI) * smoother(Math.sin(uSt*Math.PI)) : 0;
    let settle = 0;
    if(stateName==="LYING" && t < SETTLE_TO_LIE_DUR + 1.2){
      const st = Math.max(0, t - SETTLE_TO_LIE_DUR*0.45);
      settle = Math.sin(st*5.2) * Math.exp(-st*2.4) * 0.024;
    }
    if(rig.torso){
      const depth = 0.014 + L*0.018;
      const breathWave = Math.sin(now*(walking?4.8:1.45)) * 0.75 + Math.sin(now*0.72) * 0.25;
      rig.torso.scale.multiplyScalar(1 + breathWave*depth);
      axisRot(rig.torso, "z", settle);
    }
    if(rig.root && J.pitch) axisRot(rig.root, AX.headPitch, J.pitch);
    if(J.wiggle > 0.001){
      const w = Math.sin(now*13.0);
      axisRot(rig.spine1, AX.tailSway, w*0.075*J.wiggle);
      axisRot(rig.torso, "z", w*0.025*J.wiggle);
      axisRot(rig.blTh, "z",  w*0.05*J.wiggle);
      axisRot(rig.brTh, "z", -w*0.05*J.wiggle);
    }
    if(gaitBlend>0.001){
      axisRot(rig.spine1, AX.tailSway, Math.sin(walkPhase)*0.032*gaitBlend);
      axisRot(rig.spine2, AX.headPitch, Math.sin(walkPhase*2.0)*0.022*gaitBlend);
    }
    axisRot(rig.spine1, AX.headPitch, 0.10*L - 0.28*stretch - 0.14*J.crouch + 0.10*J.air + 0.09*J.land);
    axisRot(rig.spine2, AX.headPitch, -0.06*L + 0.15*stretch + 0.08*J.crouch - 0.08*J.air - 0.07*J.land);
    const microY = Math.sin(now*1.9)*0.014 + Math.sin(now*4.3)*0.006;
    const microP = Math.sin(now*2.4)*0.009;
    const lookY = (Math.sin(now*0.42)*0.14 + Math.sin(now*0.95)*0.05)*L + (walking ? Math.sin(walkPhase*0.5)*0.045 : 0);
    const lookP = Math.sin(now*0.75)*0.045*L + (walking ? Math.sin(walkPhase*2.0)*0.025 : 0);
    axisRot(rig.neck, AX.headPitch, lookP*0.5 + L*0.10 + 0.22*stretch - 0.09*J.air);
    axisRot(rig.head, AX.headPitch, lookP*0.5 + microP - 0.12*stretch - 0.09*J.crouch);
    axisRot(rig.head, AX.headYaw, lookY + microY);

    if(resting && !earActive && now>nextEar){ earActive=true; earT=0; earWhich=Math.random()<0.5?0:1; }
    if(earActive){
      earT+=dt;
      if(earT>=earDur){
        earActive=false;
        if(stateName==="LYING") idleInteractions += 1;
        nextEar=now+2.8+Math.random()*3.5;
      }
    }
    if(earActive){
      const p=earT/earDur, tw=Math.sin(p*Math.PI)*Math.sin(p*Math.PI)*0.44;
      axisRot(earWhich===0?rig.earL:rig.earR, AX.earTwitch, earWhich===0?tw:-tw);
    }
    if(J.air > 0.001){
      axisRot(rig.earL, AX.earTwitch,  0.26*J.air);
      axisRot(rig.earR, AX.earTwitch, -0.26*J.air);
    }
    if(!blinkActive && now>nextBlink){ blinkActive=true; blinkT=0; }
    if(blinkActive){
      blinkT+=dt; const p=blinkT/blinkDur;
      const s=Math.max(0.08, 1-Math.sin(p*Math.PI));
      if(rig.eyeL) rig.eyeL.scale.y *= s;
      if(rig.eyeR) rig.eyeR.scale.y *= s;
      if(blinkT>=blinkDur){ blinkActive=false; nextBlink=now+2.5+Math.random()*3.5; }
    }
    const standW = Math.max(0, (1-L)*(1-gaitBlend) - jumpTotal);
    if(standW > 0.001){
      const bF = 0.06*standW, bR = 0.08*standW;
      axisRot(rig.flUp, AX.legFold,  bF); axisRot(rig.frUp, AX.legFold,  bF);
      axisRot(rig.flLo, AX.legFold, -bF*1.2); axisRot(rig.frLo, AX.legFold, -bF*1.2);
      axisRot(rig.flFt, AX.legFold,  bF*0.5); axisRot(rig.frFt, AX.legFold,  bF*0.5);
      axisRot(rig.blTh, AX.legFold,  bR); axisRot(rig.brTh, AX.legFold,  bR);
      axisRot(rig.blLo, AX.legFold, -bR*1.1); axisRot(rig.brLo, AX.legFold, -bR*1.1);
      axisRot(rig.blFt, AX.legFold,  bR*0.5); axisRot(rig.brFt, AX.legFold,  bR*0.5);
      axisRot(rig.torso, "z", Math.sin(now*0.55)*0.018*standW);
      axisRot(rig.neck, AX.headYaw, Math.sin(now*0.34)*0.09*standW);
    }
    const lf = lieFront, lr = lieRear;
    axisRot(rig.flUp, AX.legFold, -0.78*lf - 0.36*stretch);
    axisRot(rig.flLo, AX.legFold,  0.62*lf + 0.15*stretch);
    axisRot(rig.flFt, AX.legFold,  0.30*lf);
    axisRot(rig.flUp, "z",  0.16*lf);
    axisRot(rig.frUp, AX.legFold, -0.78*lf - 0.36*stretch);
    axisRot(rig.frLo, AX.legFold,  0.62*lf + 0.15*stretch);
    axisRot(rig.frFt, AX.legFold,  0.30*lf);
    axisRot(rig.frUp, "z", -0.16*lf);
    axisRot(rig.blTh, AX.legFold,  0.92*lr);
    axisRot(rig.blLo, AX.legFold, -1.18*lr);
    axisRot(rig.blFt, AX.legFold,  0.48*lr);
    axisRot(rig.blTh, "z",  0.28*lr);
    axisRot(rig.brTh, AX.legFold,  0.92*lr);
    axisRot(rig.brLo, AX.legFold, -1.18*lr);
    axisRot(rig.brFt, AX.legFold,  0.48*lr);
    axisRot(rig.brTh, "z", -0.28*lr);
    if(jumpTotal > 0.001){
      const c=J.crouch, a=J.air, b=J.brace, ld=J.land;
      const frontUp = -0.22*c - 0.48*a + 0.15*b;
      const frontLo =  0.28*c - 0.22*a + 0.46*b + 0.28*ld;
      axisRot(rig.flUp, AX.legFold, frontUp); axisRot(rig.frUp, AX.legFold, frontUp);
      axisRot(rig.flLo, AX.legFold, frontLo); axisRot(rig.frLo, AX.legFold, frontLo);
      axisRot(rig.flFt, AX.legFold, -0.12*a + 0.20*b);
      axisRot(rig.frFt, AX.legFold, -0.12*a + 0.20*b);
      const rearTh =  0.50*c + 0.52*a + 0.42*ld;
      const rearLo = -0.70*c - 0.52*a - 0.60*ld;
      axisRot(rig.blTh, AX.legFold, rearTh); axisRot(rig.brTh, AX.legFold, rearTh);
      axisRot(rig.blLo, AX.legFold, rearLo); axisRot(rig.brLo, AX.legFold, rearLo);
      axisRot(rig.blFt, AX.legFold, 0.22*c + 0.28*a - 0.16*ld);
      axisRot(rig.brFt, AX.legFold, 0.22*c + 0.28*a - 0.16*ld);
    }
    if(J.air > 0.001 || J.crouch > 0.001){
      tailChain.forEach((seg,i)=>{
        axisRot(seg, AX.tailLift, (-0.14 - i*0.045)*J.air + 0.08*i*J.crouch*0.2);
        axisRot(seg, AX.tailSway, Math.sin(now*7.5 - i*0.75)*0.05*J.air);
      });
    } else if(gaitBlend>0.001){
      tailChain.forEach((seg,i)=>{
        axisRot(seg, AX.tailSway, Math.sin(walkPhase*0.5 - i*0.55)*0.065*(0.5 + i*0.25)*gaitBlend);
        axisRot(seg, AX.tailLift, 0.06 * (1 - i*0.12) * gaitBlend);
      });
    } else {
      if(resting && !flickActive && now>nextFlick){ flickActive=true; flickT=0; flickDir=Math.random()<0.5?1:-1; }
      let p=0, flickAmp=0;
      if(flickActive){
        flickT+=dt; p=flickT/flickDur; flickAmp=Math.sin(p*Math.PI);
        if(flickT>=flickDur){
          flickActive=false;
          if(stateName==="LYING") idleInteractions += 1;
          nextFlick=now+2.2+Math.random()*3.2;
        }
      }
      tailChain.forEach((seg,i)=>{
        const curl = L*(0.28 + i*0.10);
        const sway = (Math.sin(now*1.15 + i*0.55)*0.095 + Math.sin(now*0.55 + i*0.85)*0.045) * (1 + i*0.42);
        const whip = flickActive ? flickDir*flickAmp*Math.sin(p*Math.PI*2.5 - i*0.7)*(0.15 + i*0.08) : 0;
        axisRot(seg, AX.tailSway, curl + sway + whip);
        axisRot(seg, AX.tailLift, -0.05*L*i + 0.10*stretch + Math.sin(now*0.85 + i*0.7)*0.028*(0.4 + i*0.3));
      });
    }
  }

  function updateCat(dt){
    const now = clock.elapsedTime; t += dt;
    const cfg = STATES[stateName];
    const u = Math.min(t/cfg.dur, 1);
    const motionU = stateName==="LYING" ? Math.min(t/SETTLE_TO_LIE_DUR, 1) : u;
    const e = ease(motionU);
    const positionEase = stateName==="LYING" ? smoother(smoothstep(0.08,1,motionU)) : e;
    let jump = null;

    if(stateName==="JUMP_DOWN"){
      const facing = exitSide>0 ? YAW_RIGHT : YAW_LEFT;
      const turn = smoother(smoothstep(0.00,0.32,u));
      const air  = smoother(smoothstep(0.30,0.78,u));
      const arc  = Math.sin(clamp01((u - 0.30) / 0.48) * Math.PI);
      state.yaw = YAW_IDLE + (facing-YAW_IDLE)*turn;
      state.x = from.x + (to.x-from.x)*air;
      state.z = from.z + (to.z-from.z)*air;
      state.y = from.y + (to.y-from.y)*air + arc*0.18;
      state.pose = 1;
      jump = {
        crouch: smoothstep(0.10,0.28,u)*(1-smoothstep(0.30,0.44,u)),
        air:    smoothstep(0.32,0.48,u)*(1-smoothstep(0.64,0.80,u)),
        brace:  smoothstep(0.58,0.72,u)*(1-smoothstep(0.80,0.94,u)),
        land:   smoothstep(0.70,0.82,u)*(1-smoothstep(0.88,1.00,u)),
        wiggle: 0,
        pitch:  Math.sin(clamp01((u - 0.30) / 0.48) * Math.PI) * 0.28
      };
    } else if(stateName==="JUMP_UP"){
      const faceIn = exitSide>0 ? YAW_LEFT : YAW_RIGHT;
      const turnIn  = smoother(smoothstep(0.00,0.32,u));
      const turnOut = smoother(smoothstep(0.78,1.00,u));
      const air = smoother(smoothstep(0.44,0.78,u));
      const arc = Math.sin(clamp01((u - 0.44) / 0.34) * Math.PI);
      state.yaw = from.yaw + (faceIn-from.yaw)*turnIn + (YAW_IDLE-faceIn)*turnOut;
      state.x = from.x + (to.x-from.x)*air;
      state.z = from.z + (to.z-from.z)*air;
      state.y = from.y + (to.y-from.y)*air + arc*0.25;
      state.pose = 1;
      jump = {
        crouch: smoothstep(0.22,0.40,u)*(1-smoothstep(0.44,0.56,u)),
        air:    smoothstep(0.46,0.58,u)*(1-smoothstep(0.70,0.82,u)),
        brace:  smoothstep(0.64,0.75,u)*(1-smoothstep(0.82,0.94,u)),
        land:   smoothstep(0.72,0.82,u)*(1-smoothstep(0.88,1.00,u)),
        wiggle: smoothstep(0.26,0.36,u)*(1-smoothstep(0.42,0.50,u)),
        pitch: -Math.sin(clamp01((u - 0.44) / 0.34) * Math.PI) * 0.26
      };
    } else {
      state.x=from.x+(to.x-from.x)*positionEase;
      state.y=from.y+(to.y-from.y)*positionEase;
      state.z=from.z+(to.z-from.z)*positionEase;
      state.yaw=from.yaw+(to.yaw-from.yaw)*e;
      state.pose=from.pose+(to.pose-from.pose)*e;
    }

    const lie=1-state.pose;
    const walking=(stateName==="WALK_OFF"||stateName==="WALK_BACK");
    const resting=(stateName==="LYING"||stateName==="STAND");

    // Amortiguamiento continuo de la posición y rotación del contenedor
    smoothPos.x = dampValue(smoothPos.x, state.x, 18, dt);
    smoothPos.y = dampValue(smoothPos.y, state.y, 18, dt);
    smoothPos.z = dampValue(smoothPos.z, state.z, 18, dt);
    smoothPos.yaw = dampAngle(smoothPos.yaw, state.yaw, 14, dt);

    let bob=0, walkLean=0;
    const dx = smoothPos.x - prevX; prevX = smoothPos.x;
    if(walking){
      walkPhase += Math.abs(dx)*RAD_PER_UNIT;
      bob = Math.abs(Math.sin(walkPhase))*0.011*gaitBlend;
      walkLean = Math.sin(walkPhase*0.5)*0.009*gaitBlend;
    }
    smoothPos.roll = dampValue(smoothPos.roll, walkLean, 12, dt);

    catHolder.position.set(smoothPos.x, smoothPos.y+bob, smoothPos.z);
    catHolder.rotation.y = smoothPos.yaw;
    catHolder.rotation.z = smoothPos.roll;

    const onLaptop=(Math.abs(smoothPos.x)<1.1 && smoothPos.z<0.45);
    blob.position.set(smoothPos.x,(onLaptop?LAPTOP_TOP:0.0)+0.012,smoothPos.z);
    const near=Math.min(1,Math.max(0.22,1-Math.abs(smoothPos.x)/10));
    const airGap = Math.max(0, smoothPos.y - (onLaptop?LAPTOP_TOP:0));
    if(catReady){ blob.material.opacity=0.55*near*Math.max(0.25, 1-airGap*2.2); }
    blob.scale.setScalar((0.9+near*0.3)*(1+airGap*0.5));

    updateScreenPower(dt);
    poseSkeleton(now, dt, lie, walking, resting, jump);

    if(u>=1){
      if(stateName==="LYING" && idleInteractions < 4){
        t = cfg.dur - 0.35;
      } else {
        advance();
      }
    }
  }

  let running = false;
  let frameId = 0;
  let onScreen = false;

  function loop(){
    if(!running) return;
    frameId = requestAnimationFrame(loop);
    const dt=Math.min(clock.getDelta(),0.05);
    updateCat(dt);
    renderer.render(scene,camera);
  }

  function syncRendering(){
    const shouldRun = onScreen && !document.hidden;
    if(shouldRun === running) return;
    running = shouldRun;
    if(running){
      clock.getDelta();
      frameId = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(frameId);
    }
  }

  if("IntersectionObserver" in window){
    const observer = new IntersectionObserver(entries => {
      onScreen = entries[0].isIntersecting;
      syncRendering();
    });
    observer.observe(canvas);
  } else {
    onScreen = true;
    syncRendering();
  }
  document.addEventListener("visibilitychange", syncRendering);
  return true;
};