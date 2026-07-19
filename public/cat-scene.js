/* Escena 3D del gato en la laptop — extraída como init global.
   Llamar window.initCatScene() cuando el canvas #cat-canvas y THREE existan. */
window.initCatScene = function(){
  if(window.__catStarted) return true;
  const canvas = document.getElementById("cat-canvas");
  if(!canvas || !window.THREE) return false;
  window.__catStarted = true;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, preserveDrawingBuffer:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;

  function sizeNow(){
    const w = canvas.clientWidth  || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  sizeNow();
  window.addEventListener("resize", sizeNow);

  scene.add(new THREE.AmbientLight(0x3a4560, 0.55));
  scene.add(new THREE.HemisphereLight(0xffe4c4, 0x0e1220, 0.42));
  const key = new THREE.DirectionalLight(0xffc27a, 1.7);
  key.position.set(5, 5.5, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 7;
  key.shadow.camera.left=-8; key.shadow.camera.right=8;
  key.shadow.camera.top=8; key.shadow.camera.bottom=-8;
  key.shadow.bias = -0.0004;
  scene.add(key);
  const warm = new THREE.PointLight(0xff9a42, 1.3, 14, 2);
  warm.position.set(1.8, 1.7, 2.6);
  scene.add(warm);
  const coolRim = new THREE.DirectionalLight(0x5a8fce, 0.75);
  coolRim.position.set(-6, 3, -4);
  scene.add(coolRim);
  const fill = new THREE.DirectionalLight(0xffd9b0, 0.5);
  fill.position.set(-2, 4, 6);
  scene.add(fill);

  function roundRect(g,x,y,w,h,r){ g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath(); }

  function woodTexture(){
    const c=document.createElement("canvas"); c.width=512; c.height=256;
    const g=c.getContext("2d");
    g.fillStyle="#54290f"; g.fillRect(0,0,512,256);
    for(let y=0;y<256;y+=3){
      g.globalAlpha=.04+Math.random()*.06;
      g.strokeStyle=Math.random()>.5?"#6d3a18":"#3e1d0b";
      g.lineWidth=1+Math.random()*1.6;
      g.beginPath(); g.moveTo(0,y);
      for(let x=0;x<=512;x+=32) g.lineTo(x, y+Math.sin(x*.02+y*.7)*1.8);
      g.stroke();
    }
    for(let i=0;i<4;i++){
      const x=60+Math.random()*400, y=30+Math.random()*200;
      g.globalAlpha=.10;
      g.strokeStyle="#31160a";
      for(let r=3;r<14;r+=3.5){ g.beginPath(); g.ellipse(x,y,r*1.5,r,0,0,7); g.stroke(); }
    }
    g.globalAlpha=1;
    const t=new THREE.CanvasTexture(c);
    t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(3,1.6); t.encoding=THREE.sRGBEncoding;
    return t;
  }
  function brushedMetalTexture(){
    const c=document.createElement("canvas"); c.width=256; c.height=256;
    const g=c.getContext("2d");
    g.fillStyle="#283040"; g.fillRect(0,0,256,256);
    for(let y=0;y<256;y++){
      g.globalAlpha=.08+Math.random()*.12;
      g.strokeStyle = y%5===0 ? "#6d7689" : "#1c2330";
      g.beginPath(); g.moveTo(0,y); g.lineTo(256,y+Math.random()*1.5); g.stroke();
    }
    g.globalAlpha=1;
    const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(2.4,1.2); t.encoding=THREE.sRGBEncoding; return t;
  }
  const metalMap = brushedMetalTexture();

  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(26, 0.4, 8),
    new THREE.MeshStandardMaterial({ map:woodTexture(), roughness:0.9, metalness:0.02 })
  );
  desk.position.y = -0.2; desk.receiveShadow = true; scene.add(desk);

  const laptop = new THREE.Group();
  const aluMat = new THREE.MeshStandardMaterial({ map:metalMap, color:0x343d4e, roughness:0.38, metalness:0.78, bumpMap:metalMap, bumpScale:0.01 });

  const base = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.14, 1.5), aluMat);
  base.position.y = 0.09; base.castShadow = true; base.receiveShadow = true; laptop.add(base);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.02, 1.38), new THREE.MeshStandardMaterial({ map:metalMap, color:0x404a5f, roughness:0.42, metalness:0.62, bumpMap:metalMap, bumpScale:0.006 }));
  deck.position.y = 0.161; laptop.add(deck);

  function keebTexture(){
    const c=document.createElement("canvas"); c.width=256; c.height=150;
    const g=c.getContext("2d");
    g.fillStyle="#141a26"; g.fillRect(0,0,256,150);
    g.fillStyle="#2b3242";
    const cols=14, rows=5, kw=15, kh=21, gap=3, ox=8, oy=6;
    for(let r=0;r<rows;r++)for(let cc=0;cc<cols;cc++){ roundRect(g,ox+cc*(kw+gap),oy+r*(kh+gap),kw,kh,3); g.fill(); }
    roundRect(g,72,oy+5*(kh+gap)-1,108,17,3); g.fill();
    const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; return t;
  }
  const keeb = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 0.82), new THREE.MeshStandardMaterial({ map:keebTexture(), roughness:0.7 }));
  keeb.rotation.x = -Math.PI/2; keeb.position.set(0, 0.172, -0.12); laptop.add(keeb);
  const pad = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.4), new THREE.MeshStandardMaterial({ color:0x394152, roughness:0.3, metalness:0.5 }));
  pad.rotation.x = -Math.PI/2; pad.position.set(0, 0.172, 0.46); laptop.add(pad);

  function screenTexture(){
    const c=document.createElement("canvas"); c.width=512; c.height=320;
    const g=c.getContext("2d");
    const grd=g.createLinearGradient(0,0,512,320);
    grd.addColorStop(0,"#07131d"); grd.addColorStop(0.5,"#0d1825"); grd.addColorStop(1,"#04101a");
    g.fillStyle=grd; g.fillRect(0,0,512,320);
    g.fillStyle="#172336"; g.fillRect(0,0,512,34);
    ["#ff5f56","#ffbd2e","#27c93f"].forEach((col,i)=>{ g.fillStyle=col; g.beginPath(); g.arc(22+i*22,17,6,0,7); g.fill(); });
    const palette=["#7ee787","#79c0ff","#ffa657","#d2a8ff","#a5d6ff","#f0883e","#8b949e"];
    let y=58;
    for(let row=0; row<16; row++){
      let x=24 + (Math.floor(Math.random()*3))*22;
      const segs=2+Math.floor(Math.random()*4);
      for(let s=0;s<segs;s++){
        const w=20+Math.random()*90;
        g.fillStyle=palette[Math.floor(Math.random()*palette.length)]; g.globalAlpha=0.92;
        g.fillRect(x,y,w,9); x+=w+12; if(x>470) break;
      }
      y+=16;
    }
    g.globalAlpha=.16;
    const shine=g.createLinearGradient(90,0,420,320);
    shine.addColorStop(0,"rgba(255,255,255,0)");
    shine.addColorStop(.48,"rgba(255,255,255,.42)");
    shine.addColorStop(1,"rgba(255,255,255,0)");
    g.fillStyle=shine; g.fillRect(0,0,512,320);
    g.globalAlpha=1;
    const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; return t;
  }
  function screenOffTexture(){
    const c=document.createElement("canvas"); c.width=512; c.height=320;
    const g=c.getContext("2d");
    const grd=g.createLinearGradient(0,0,512,320);
    grd.addColorStop(0,"#05070b"); grd.addColorStop(.48,"#111722"); grd.addColorStop(1,"#030407");
    g.fillStyle=grd; g.fillRect(0,0,512,320);
    g.globalAlpha=.075;
    g.fillStyle="#fff6df"; g.beginPath(); g.ellipse(210,118,170,18,-.35,0,Math.PI*2); g.fill();
    g.globalAlpha=.035;
    g.strokeStyle="#9bd6ff"; g.lineWidth=3; g.beginPath(); g.moveTo(36,276); g.lineTo(470,56); g.stroke();
    g.globalAlpha=1;
    const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; return t;
  }
  const scrTex = screenTexture();
  const scrOffTex = screenOffTexture();
  const screenOffMat = new THREE.MeshBasicMaterial({ map:scrOffTex });
  const screenOnMat = new THREE.MeshStandardMaterial({
    map:scrTex, emissiveMap:scrTex, emissive:0x9bf5e8, emissiveIntensity:0,
    roughness:0.28, transparent:true, opacity:0
  });
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.14, -0.72);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(2.15, 1.4, 0.07), aluMat);
  lid.position.y = 0.7; lid.castShadow = true;
  const scrOff = new THREE.Mesh(new THREE.PlaneGeometry(1.94, 1.2), screenOffMat);
  scrOff.position.set(0, 0.7, 0.048);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.94, 1.2), screenOnMat);
  scr.position.set(0, 0.7, 0.052);
  const screenGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 1.44),
    new THREE.MeshBasicMaterial({ color:0x56d0c0, transparent:true, opacity:0, depthWrite:false, blending:THREE.AdditiveBlending })
  );
  screenGlow.position.set(0, 0.7, 0.06);
  hinge.add(lid); hinge.add(scrOff); hinge.add(scr); hinge.add(screenGlow);
  hinge.rotation.x = -0.32; laptop.add(hinge);
  const screenLight = new THREE.PointLight(0x56d0c0, 0, 7, 2);
  screenLight.position.set(0, 0.9, -0.2); laptop.add(screenLight);
  const powerLedMat = new THREE.MeshBasicMaterial({ color:0x162020 });
  const powerLed = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 8), powerLedMat);
  powerLed.position.set(0.92, 0.188, 0.58); laptop.add(powerLed);
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

  function makeCatMaterial(eyeL, eyeR, nose, earL, earR){
    const mat = new THREE.MeshStandardMaterial({ roughness:0.94, metalness:0.0, skinning:true });
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
          float g1 = vnoise(vBind.zy * 6.0 + vBind.xx * 3.0);
          float g2 = vnoise(vBind.zy * 22.0 + 7.3);
          float grizzle = g1*0.55 + g2*0.45;
          vec3 dorsal  = vec3(0.215, 0.152, 0.122);
          vec3 ticking = vec3(0.400, 0.300, 0.235);
          vec3 ventral = vec3(0.640, 0.545, 0.470);
          vec3 dark    = vec3(0.045, 0.033, 0.028);
          vec3 cream   = vec3(0.730, 0.645, 0.575);
          vec3 pinkN   = vec3(0.545, 0.235, 0.200);
          vec3 pinkE   = vec3(0.470, 0.250, 0.265);
          vec3 fur = mix(ventral, dorsal, smoothstep(0.20, 0.72, ny));
          fur = mix(fur, ticking, grizzle*0.45);
          fur = mix(fur, fur*0.62, (1.0-grizzle)*0.30);
          float spineLine = (1.0 - smoothstep(0.06, 0.17, abs(vBind.x)))
                          * smoothstep(0.60, 0.72, ny)
                          * smoothstep(0.18, 0.30, nz) * (1.0 - smoothstep(0.80, 0.90, nz));
          float stripes = spineLine * 0.9;
          float wob = (vnoise(vec2(vBind.z*2.1, vBind.x*2.3)) - 0.5) * 1.6;
          float band = sin(vBind.z*5.6 + vBind.y*0.8 + wob);
          float torso = smoothstep(0.38,0.55,ny)
                      * smoothstep(0.16,0.28,nz)
                      * (1.0 - smoothstep(0.72,0.84,nz));
          stripes += smoothstep(0.35, 0.75, band) * torso * (0.55 + 0.65*g2);
          float tailM = 1.0 - smoothstep(0.13, 0.20, nz);
          stripes += smoothstep(0.15, 0.65, sin(vBind.z*5.6)) * tailM;
          float headM = smoothstep(0.74,0.82,ny) * smoothstep(0.76,0.86,nz);
          stripes += smoothstep(0.40,0.85,sin(vBind.x*14.0)) * headM * 0.85;
          float legM = (1.0 - smoothstep(0.34,0.48,ny)) * smoothstep(0.17,0.26,ny);
          stripes += smoothstep(0.40,0.80,sin(vBind.y*7.5 + vBind.x*1.3)) * legM * 0.5;
          fur = mix(fur, dark, clamp(stripes, 0.0, 1.0) * 0.88);
          float paw = 1.0 - smoothstep(0.16, 0.42, vBind.y);
          float chest = smoothstep(0.62,0.95,nz) * (1.0 - smoothstep(0.30,0.55,ny));
          float muzzle = smoothstep(0.88,0.965,nz) * smoothstep(0.46,0.56,ny) * (1.0 - smoothstep(0.70,0.78,ny));
          fur = mix(fur, cream, clamp(paw,0.0,1.0)*0.9);
          fur = mix(fur, cream, clamp(chest*0.70 + muzzle*0.85, 0.0, 1.0));
          float tip = 1.0 - smoothstep(-3.34, -2.92, vBind.z);
          fur = mix(fur, dark, tip*0.9);
          float dEar = min(length(vBind - uEarL), length(vBind - uEarR));
          float earFront = smoothstep(0.10, 0.50, vBindN.z);
          fur = mix(fur, pinkE, (1.0 - smoothstep(0.26, 0.40, dEar)) * earFront * 0.85);
          fur = mix(fur, dark, smoothstep(0.30,0.42,dEar)*(1.0-smoothstep(0.48,0.60,dEar))*0.30);
          float dN = length(vBind.xy - uNose.xy);
          float frontN = smoothstep(uNose.z - 0.15, uNose.z + 0.25, vBind.z);
          fur = mix(fur, pinkN, (1.0 - smoothstep(0.055, 0.105, dN)) * frontN);
          float dL = length(vBind.xy - uEyeL.xy);
          float dR = length(vBind.xy - uEyeR.xy);
          float dE = min(dL, dR);
          float frontE = smoothstep(uEyeL.z - 0.15, uEyeL.z + 0.25, vBind.z);
          fur = mix(fur, dark, smoothstep(0.125,0.155,dE)*(1.0-smoothstep(0.175,0.215,dE)) * frontE * 0.8);
          vec3 iris = mix(vec3(0.012,0.022,0.060), vec3(0.035,0.065,0.115), smoothstep(0.14, 0.02, dE));
          iris = mix(iris, vec3(0.004,0.006,0.014), smoothstep(0.105,0.135,dE));
          iris = mix(vec3(0.003,0.004,0.010), iris, smoothstep(0.075, 0.100, dE));
          float hl = min(length(vBind.xy - (uEyeL.xy + vec2(-0.045, 0.050))),
                         length(vBind.xy - (uEyeR.xy + vec2(-0.045, 0.050))));
          iris = mix(vec3(0.92, 0.94, 0.98), iris, smoothstep(0.020, 0.042, hl));
          fur = mix(fur, iris, (1.0 - smoothstep(0.135, 0.165, dE)) * frontE);
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

  const randomRestDuration = () => 20 + Math.random() * 10;
  const SETTLE_TO_LIE_DUR = 2.15;
  const STATES = {
    LYING:    {dur:randomRestDuration()},
    STAND:    {dur:2.1},
    JUMP_DOWN:{dur:1.55},
    WALK_OFF: {dur:3.0},
    WALK_BACK:{dur:4.1},
    JUMP_UP:  {dur:2.7}
  };
  const ORDER = ["LYING","STAND","JUMP_DOWN","WALK_OFF","WALK_BACK","JUMP_UP"];
  let stateIdx=0, stateName="LYING", t=0;
  let idleInteractions = 0;
  let exitSide = 1;
  let from={x:0,y:LYING_Y,z:0.05,yaw:YAW_IDLE,pose:0};
  let to=Object.assign({},from);
  const state={x:0,y:LYING_Y,z:0.05,yaw:YAW_IDLE,pose:0};
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
  let nextFlick=1.3, flickActive=false, flickT=0; const flickDur=0.85; let flickDir=1;
  let nextEar=3.0, earActive=false, earT=0; const earDur=0.32; let earWhich=0;
  let nextBlink=2.2, blinkActive=false, blinkT=0; const blinkDur=0.15;
  const clock = new THREE.Clock();
  let screenPower = 0;

  function updateScreenPower(dt, force=false){
    const target = (stateName==="LYING" && state.pose < 0.3 && Math.abs(state.x) < 0.8) ? 0 : 1;
    const speed = target > screenPower ? 4.2 : 3.0;
    const k = force ? 1 : Math.min(1, dt * speed);
    screenPower += (target - screenPower) * k;
    const flicker = screenPower > 0.05 ? Math.sin(clock.elapsedTime * 7.5) * 0.035 : 0;
    screenOnMat.opacity = screenPower;
    screenOnMat.emissiveIntensity = Math.max(0, screenPower * 1.16 + flicker);
    screenLight.intensity = screenPower * 1.55;
    screenGlow.material.opacity = screenPower * 0.16;
    powerLedMat.color.setHex(screenPower > 0.25 ? 0x56d0c0 : 0x162020);
  }

  const ZERO_JUMP = {crouch:0, air:0, brace:0, land:0, wiggle:0, pitch:0};
  function poseSkeleton(now, dt, lie, walking, resting, jump){
    if(!catReady) return;
    resetBones();
    const poseK = 1-Math.exp(-dt*5.0);
    smoothLie += (lie - smoothLie) * poseK;
    gaitBlend += ((walking?1:0)-gaitBlend) * (1-Math.exp(-dt*7.5));
    const L = smoothLie;
    const J = jump || ZERO_JUMP;
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
    const lieFront = Math.max(0, (L-0.30)/0.70);
    const uSt = Math.min(t/STATES.STAND.dur, 1);
    const stretch = stateName==="STAND" ? Math.sin(uSt*Math.PI) : 0;
    let settle = 0;
    if(stateName==="LYING" && t < SETTLE_TO_LIE_DUR + 1.0){
      const st = Math.max(0, t - SETTLE_TO_LIE_DUR*0.5);
      settle = Math.sin(st*6.4) * Math.exp(-st*2.8) * 0.028;
    }
    if(rig.torso){
      const depth = 0.016 + L*0.02;
      rig.torso.scale.multiplyScalar(1 + Math.sin(now*(walking?5.0:1.6))*depth);
      axisRot(rig.torso, "z", settle);
    }
    if(rig.root && J.pitch) axisRot(rig.root, AX.headPitch, J.pitch);
    if(J.wiggle > 0.001){
      const w = Math.sin(now*15.0);
      axisRot(rig.spine1, AX.tailSway, w*0.085*J.wiggle);
      axisRot(rig.torso, "z", w*0.030*J.wiggle);
      axisRot(rig.blTh, "z",  w*0.06*J.wiggle);
      axisRot(rig.brTh, "z", -w*0.06*J.wiggle);
    }
    if(gaitBlend>0.001){
      axisRot(rig.spine2, AX.headPitch, Math.sin(walkPhase*2.0)*0.02*gaitBlend);
    }
    axisRot(rig.spine1, AX.headPitch, 0.10*L - 0.30*stretch - 0.14*J.crouch + 0.10*J.air + 0.10*J.land);
    axisRot(rig.spine2, AX.headPitch, -0.06*L + 0.16*stretch + 0.08*J.crouch - 0.08*J.air - 0.08*J.land);
    const microY = Math.sin(now*2.9)*0.012 + Math.sin(now*6.7)*0.007;
    const microP = Math.sin(now*3.7)*0.009;
    const lookY = Math.sin(now*0.5)*0.15*L + (walking ? Math.sin(walkPhase*0.5)*0.05 : 0);
    const lookP = Math.sin(now*0.85)*0.05*L + (walking ? Math.sin(walkPhase*2.0)*0.03 : 0);
    axisRot(rig.neck, AX.headPitch, lookP*0.5 + L*0.10 + 0.24*stretch - 0.10*J.air);
    axisRot(rig.head, AX.headPitch, lookP*0.5 + microP - 0.14*stretch - 0.10*J.crouch);
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
      const p=earT/earDur, tw=Math.sin(p*Math.PI)*0.5;
      axisRot(earWhich===0?rig.earL:rig.earR, AX.earTwitch, earWhich===0?tw:-tw);
    }
    if(J.air > 0.001){
      axisRot(rig.earL, AX.earTwitch,  0.30*J.air);
      axisRot(rig.earR, AX.earTwitch, -0.30*J.air);
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
      axisRot(rig.torso, "z", Math.sin(now*0.55)*0.020*standW);
      axisRot(rig.neck, AX.headYaw, Math.sin(now*0.34)*0.10*standW);
    }
    const lf = lieFront, lr = lieRear;
    axisRot(rig.flUp, AX.legFold, -0.78*lf - 0.38*stretch);
    axisRot(rig.flLo, AX.legFold,  0.62*lf + 0.16*stretch);
    axisRot(rig.flFt, AX.legFold,  0.30*lf);
    axisRot(rig.flUp, "z",  0.16*lf);
    axisRot(rig.frUp, AX.legFold, -0.78*lf - 0.38*stretch);
    axisRot(rig.frLo, AX.legFold,  0.62*lf + 0.16*stretch);
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
      const frontUp = -0.22*c - 0.52*a + 0.16*b;
      const frontLo =  0.28*c - 0.24*a + 0.50*b + 0.30*ld;
      axisRot(rig.flUp, AX.legFold, frontUp); axisRot(rig.frUp, AX.legFold, frontUp);
      axisRot(rig.flLo, AX.legFold, frontLo); axisRot(rig.frLo, AX.legFold, frontLo);
      axisRot(rig.flFt, AX.legFold, -0.12*a + 0.22*b);
      axisRot(rig.frFt, AX.legFold, -0.12*a + 0.22*b);
      const rearTh =  0.52*c + 0.55*a + 0.45*ld;
      const rearLo = -0.72*c - 0.55*a - 0.65*ld;
      axisRot(rig.blTh, AX.legFold, rearTh); axisRot(rig.brTh, AX.legFold, rearTh);
      axisRot(rig.blLo, AX.legFold, rearLo); axisRot(rig.brLo, AX.legFold, rearLo);
      axisRot(rig.blFt, AX.legFold, 0.24*c + 0.30*a - 0.18*ld);
      axisRot(rig.brFt, AX.legFold, 0.24*c + 0.30*a - 0.18*ld);
    }
    if(J.air > 0.001 || J.crouch > 0.001){
      tailChain.forEach((seg,i)=>{
        axisRot(seg, AX.tailLift, (-0.16 - i*0.05)*J.air + 0.10*i*J.crouch*0.2);
        axisRot(seg, AX.tailSway, Math.sin(now*9 - i*0.8)*0.06*J.air);
      });
    } else if(gaitBlend>0.001){
      tailChain.forEach((seg,i)=>{
        axisRot(seg, AX.tailSway, Math.sin(walkPhase*0.5 - i*0.55)*0.06*(0.5 + i*0.25)*gaitBlend);
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
        // richer resting sway: a lazy primary wave + a slower secondary wave,
        // amplitude grows toward the tail tip so the end feels loose & alive.
        const sway = (Math.sin(now*1.25 + i*0.55)*0.10 + Math.sin(now*0.6 + i*0.9)*0.05) * (1 + i*0.45);
        const whip = flickActive ? flickDir*flickAmp*Math.sin(p*Math.PI*3 - i*0.75)*(0.18 + i*0.09) : 0;
        axisRot(seg, AX.tailSway, curl + sway + whip);
        // gentle vertical breathing of the tail while lying
        axisRot(seg, AX.tailLift, -0.05*L*i + 0.10*stretch + Math.sin(now*0.9 + i*0.7)*0.03*(0.4 + i*0.3));
      });
    }
  }

  function updateCat(dt){
    const now = clock.elapsedTime; t += dt;
    const cfg = STATES[stateName];
    const u = Math.min(t/cfg.dur, 1);
    const motionU = stateName==="LYING" ? Math.min(t/SETTLE_TO_LIE_DUR, 1) : u;
    const e = ease(motionU);
    const positionEase = stateName==="LYING" ? smoother(smoothstep(0.12,1,motionU)) : e;
    let jump = null;
    if(stateName==="JUMP_DOWN"){
      const facing = exitSide>0 ? YAW_RIGHT : YAW_LEFT;
      const turn = smoother(smoothstep(0.00,0.26,u));
      const air  = smoothstep(0.36,0.72,u);
      state.yaw = YAW_IDLE + (facing-YAW_IDLE)*turn;
      state.x = from.x + (to.x-from.x)*air;
      state.z = from.z + (to.z-from.z)*air;
      state.y = from.y + (to.y-from.y)*air + Math.sin(air*Math.PI)*0.14;
      state.pose = 1;
      jump = {
        crouch: smoothstep(0.16,0.32,u)*(1-smoothstep(0.34,0.44,u)),
        air:    smoothstep(0.38,0.50,u)*(1-smoothstep(0.62,0.76,u)),
        brace:  smoothstep(0.60,0.72,u)*(1-smoothstep(0.80,0.92,u)),
        land:   smoothstep(0.70,0.80,u)*(1-smoothstep(0.86,1.00,u)),
        wiggle: 0,
        pitch:  (smoothstep(0.38,0.52,u)*(1-smoothstep(0.66,0.82,u)))*0.34
      };
    } else if(stateName==="JUMP_UP"){
      const faceIn = exitSide>0 ? YAW_LEFT : YAW_RIGHT;
      const turnIn  = smoother(smoothstep(0.00,0.30,u));
      const turnOut = smoother(smoothstep(0.84,1.00,u));
      const air = smoothstep(0.50,0.72,u);
      state.yaw = from.yaw + (faceIn-from.yaw)*turnIn + (YAW_IDLE-faceIn)*turnOut;
      state.x = from.x + (to.x-from.x)*air;
      state.z = from.z + (to.z-from.z)*air;
      state.y = from.y + (to.y-from.y)*air + Math.sin(air*Math.PI)*0.22;
      state.pose = 1;
      jump = {
        crouch: smoothstep(0.28,0.42,u)*(1-smoothstep(0.50,0.58,u)),
        air:    smoothstep(0.52,0.62,u)*(1-smoothstep(0.70,0.82,u)),
        brace:  smoothstep(0.66,0.76,u)*(1-smoothstep(0.84,0.94,u)),
        land:   smoothstep(0.72,0.82,u)*(1-smoothstep(0.90,1.00,u)),
        wiggle: smoothstep(0.32,0.40,u)*(1-smoothstep(0.46,0.53,u)),
        pitch: -(smoothstep(0.50,0.60,u)*(1-smoothstep(0.72,0.86,u)))*0.30
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
    let bob=0, walkLean=0;
    const dx = state.x - prevX; prevX = state.x;
    if(walking){
      walkPhase += Math.abs(dx)*RAD_PER_UNIT;
      bob = Math.abs(Math.sin(walkPhase))*0.012*gaitBlend;
      walkLean = Math.sin(walkPhase*0.5)*0.010*gaitBlend;
    }
    catHolder.position.set(state.x, state.y+bob, state.z);
    catHolder.rotation.y=state.yaw;
    catHolder.rotation.z=walkLean;
    const onLaptop=(Math.abs(state.x)<1.1 && state.z<0.45);
    blob.position.set(state.x,(onLaptop?LAPTOP_TOP:0.0)+0.012,state.z);
    const near=Math.min(1,Math.max(0.22,1-Math.abs(state.x)/10));
    const airGap = Math.max(0, state.y - (onLaptop?LAPTOP_TOP:0));
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

  function loop(){
    const dt=Math.min(clock.getDelta(),0.05);
    updateCat(dt);
    if(!reduce){
      const now=clock.elapsedTime;
      camera.position.x=1.0+Math.sin(now*0.24)*0.28;
      camera.position.y=1.35+Math.sin(now*0.33)*0.1;
      camera.lookAt(0,0.55,0);
    } else {
      camera.position.set(1.0,1.35,6.1);
      camera.lookAt(0,0.55,0);
    }
    renderer.render(scene,camera);
    requestAnimationFrame(loop);
  }
  loop();
  return true;
};
