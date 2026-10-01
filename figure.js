/* Daily Moves animation engine.
   A 2D figure built from segments (forward kinematics), drawn on canvas.
   Side view faces right. Angles are degrees measured from straight down,
   turning toward the direction the figure faces (0 down, 90 forward, 180 up, -90 back).
   Front view angles are measured from straight down, turning outward from the body. */
(function(){
const D = Math.PI/180;
const LEN = {torso:1, neck:.13, head:.2, ua:.58, fa:.52, th:.8, sh:.78, ft:.2};
const SIDE0  = {t:180,h:0,c:0,hx:0,br:1,a1:0,f1:0,a2:0,f2:0,l1:0,s1:0,l2:0,s2:0};
const FRONT0 = {t:0,x:0,sh:0,ht:0,hr:0,br:1,aL:8,fL:8,aR:8,fR:8,lL:4,sL:4,lR:4,sR:4,kL:0,kR:0};
const v = (a,l)=>[Math.sin(a*D)*l, Math.cos(a*D)*l];
const add = (p,q)=>[p[0]+q[0], p[1]+q[1]];

/* ---------- Pose library: side view (1 = near limbs, 2 = far limbs) ---------- */
const S = {};
const s = (name, base, o)=>{ S[name] = Object.assign({}, base ? S[base] : {}, o); };
s('stand', null, {});
s('soft', null, {l1:4,s1:-3,l2:4,s2:-3});
s('armsUp', null, {a1:180,f1:180,a2:180,f2:180});
s('reachBack', null, {a1:175,f1:178,a2:175,f2:178,c:-.35,h:18});
s('armsFwd', null, {a1:90,f1:90,a2:90,f2:90});
s('armsBack', null, {a1:-35,f1:-35,a2:-35,f2:-35,h:12,c:-.3});
s('prayer', null, {a1:40,f1:150,a2:40,f2:150});
s('breatheIn', null, {br:1.04,c:-.12,h:6,a1:25,f1:120,a2:25,f2:120});
s('breatheOut', null, {br:1,c:.06,h:-4,a1:25,f1:120,a2:25,f2:120});
s('fold', null, {t:40,h:-10,c:.3,a1:15,f1:60,a2:15,f2:60,l1:8,s1:-4,l2:8,s2:-4});
s('halfLift', null, {t:108,h:12,a1:12,f1:25,a2:12,f2:25,l1:6,s1:-3,l2:6,s2:-3});
s('squat', null, {t:145,h:22,l1:80,s1:-25,l2:80,s2:-25,a1:90,f1:90,a2:90,f2:90});
s('halfSquat', null, {t:160,h:10,l1:45,s1:-20,l2:45,s2:-20,a1:70,f1:80,a2:70,f2:80});
s('chairSit', null, {t:178,l1:90,s1:0,l2:90,s2:0,a1:20,f1:80,a2:20,f2:80});
s('chairLean', null, {t:140,h:22,l1:85,s1:-12,l2:85,s2:-12,a1:70,f1:90,a2:70,f2:90});
s('chairArms', 'chairSit', {a1:90,f1:90,a2:90,f2:90});
s('chairBreatheIn', 'chairSit', {br:1.04,c:-.12,h:6,a1:25,f1:120,a2:25,f2:120});
s('chairBreatheOut', 'chairSit', {br:1,c:.06,h:-4,a1:25,f1:120,a2:25,f2:120});
s('chairMarch1', 'chairSit', {l1:112,s1:12});
s('chairMarch2', 'chairSit', {l2:112,s2:12});
s('chairToesUp', 'chairSit', {ft1:125,ft2:125});
s('chairHeelsUp', 'chairSit', {ft1:40,ft2:40});
s('standArmsFwd', null, {a1:90,f1:90,a2:90,f2:90});
s('toeStand', null, {a1:90,f1:90,a2:90,f2:90,ft1:38,ft2:38});
s('calfUp', null, {ft1:35,ft2:35,a1:5,f1:10,a2:5,f2:10});
s('heelBounce', null, {ft1:62,ft2:62});
s('march1', null, {l1:80,s1:0,a1:-30,f1:30,a2:35,f2:95});
s('march2', null, {l2:80,s2:0,a2:-30,f2:30,a1:35,f1:95});
s('knee1Up', null, {l1:95,s1:5,a1:170,f1:175,a2:170,f2:175});
s('highLunge', null, {l1:82,s1:-5,l2:-25,s2:-30,ft2:40,a1:180,f1:180,a2:180,f2:180,c:-.1});
s('highLungeHands', null, {t:165,l1:82,s1:-5,l2:-25,s2:-30,ft2:40,a1:60,f1:100,a2:60,f2:100});
s('lungeDown', null, {l1:82,s1:-5,l2:-15,s2:-85,ft2:5,a1:20,f1:120,a2:20,f2:120});
s('lowLunge', null, {t:172,h:5,c:-.2,l1:85,s1:-15,l2:-13,s2:-90,ft2:-90,a1:180,f1:180,a2:180,f2:180});
s('lowLungeHands', 'lowLunge', {c:0,a1:60,f1:100,a2:60,f2:100});
s('lungeHandsDown', null, {t:125,h:25,l1:100,s1:-20,l2:-15,s2:-88,ft2:-90,a1:5,f1:0,a2:5,f2:0});
s('wgs1', null, {t:120,h:10,l1:92,s1:-20,l2:-35,s2:-40,ft2:40,a2:5,f2:5,a1:20,f1:20});
s('wgs2', 'wgs1', {a1:180,f1:180,h:30});
s('plank', null, {t:115,l1:-65,s1:-65,l2:-65,s2:-65,ft1:20,ft2:20});
s('eightLimb', null, {t:62,h:22,l1:-35,s1:-85,l2:-35,s2:-85,ft1:-80,ft2:-80,a1:-40,f1:25,a2:-40,f2:25});
s('dog', null, {t:42,a1:42,f1:42,a2:42,f2:42,l1:-26,s1:-26,l2:-26,s2:-26,ft1:60,ft2:60});
s('dogPedal1', 'dog', {l1:-5,s1:-50,ft1:20});
s('dogPedal2', 'dog', {l2:-5,s2:-50,ft2:20});
s('allFours', null, {t:105,a1:0,f1:0,a2:0,f2:0,l1:0,s1:-90,l2:0,s2:-90,ft1:-90,ft2:-90});
s('cat', 'allFours', {c:.6,h:-45});
s('cow', 'allFours', {c:-.5,h:35});
s('birdDog1', 'allFours', {a1:100,f1:100,l2:-95,s2:-95,ft2:-100});
s('birdDog2', 'allFours', {a2:100,f2:100,l1:-95,s1:-95,ft1:-100});
s('tspineUp', 'allFours', {a1:185,f1:185,h:20});
s('needle', 'allFours', {t:85,h:-30,a1:-60,f1:-70});
s('child', null, {t:62,h:40,c:.25,l1:55,s1:-90,l2:55,s2:-90,ft1:-90,ft2:-90,a1:97,f1:93,a2:97,f2:93});
s('childBreathe', 'child', {c:.36,br:1.03});
s('puppy', null, {t:38,h:55,c:-.3,l1:0,s1:-90,l2:0,s2:-90,ft1:-90,ft2:-90,a1:96,f1:92,a2:96,f2:92});
s('prone', null, {t:90,l1:-90,s1:-90,l2:-90,s2:-90,ft1:-90,ft2:-90,a1:-92,f1:-92,a2:-92,f2:-92});
s('cobra', 'prone', {t:150,h:15,c:-.4,a1:-50,f1:30,a2:-50,f2:30});
s('cobraLow', 'prone', {t:118,h:12,c:-.2,a1:-60,f1:40,a2:-60,f2:40});
s('locust', 'prone', {t:103,h:8,l1:-103,s1:-103,l2:-103,s2:-103,ft1:-103,ft2:-103,a1:-100,f1:-100,a2:-100,f2:-100});
s('supine', null, {t:-90,l1:90,s1:90,l2:90,s2:90,ft1:170,ft2:170,a1:90,f1:90,a2:90,f2:90});
s('supineReach', 'supine', {a1:-90,f1:-90,a2:-90,f2:-90,ft1:140,ft2:140});
s('ankleUp', 'supine', {ft1:182,ft2:182});
s('anklePoint', 'supine', {ft1:118,ft2:118});
s('hook', 'supine', {l1:140,s1:-38,ft1:90,l2:140,s2:-38,ft2:90});
s('kneeHug', 'supine', {h:-10,l1:205,s1:105,l2:200,s2:100,ft1:190,ft2:190,a1:135,f1:150,a2:135,f2:150});
s('kneeHugRock', 'kneeHug', {l1:195,l2:190,s1:95,s2:90});
s('singleHug', 'hook', {l1:205,s1:105,ft1:190,a1:135,f1:150,a2:135,f2:150,l2:90,s2:90,ft2:170});
s('bridge', null, {t:-65,h:-25,l1:115,s1:-10,ft1:90,l2:115,s2:-10,ft2:90,a1:92,f1:90,a2:92,f2:90});
s('bridgeMarch1', 'bridge', {l1:160,s1:100,ft1:190});
s('bridgeMarch2', 'bridge', {l2:160,s2:100,ft2:190});
s('legsUp', 'supine', {l1:178,s1:178,l2:180,s2:180,ft1:270,ft2:270});
s('figure4', 'hook', {l1:160,s1:80,ft1:170});
s('figure4Deep', 'hook', {l1:175,s1:90,ft1:180,l2:155,s2:-10});
s('rest', 'supine', {a1:80,f1:80,a2:80,f2:80});
s('restIn', 'rest', {br:1.03,c:-.08});
s('longSit', null, {t:178,l1:90,s1:90,l2:90,s2:90,ft1:180,ft2:180,a1:-8,f1:10,a2:-8,f2:10});
s('seatedFold', 'longSit', {t:115,h:-10,c:.4,a1:95,f1:95,a2:95,f2:95});
s('malasana', null, {t:170,h:5,l1:100,s1:-22,l2:100,s2:-22,ft1:90,ft2:90,a1:45,f1:150,a2:45,f2:150});
s('kneelSit', null, {l1:85,s1:-90,l2:85,s2:-90,ft1:-90,ft2:-90,a1:10,f1:60,a2:10,f2:60});
s('tallKneel', null, {l1:0,s1:-90,l2:0,s2:-90,ft1:-90,ft2:-90,a1:10,f1:20,a2:10,f2:20});
s('wallOut', null, {t:158,l1:-22,s1:-22,l2:-22,s2:-22,ft1:68,ft2:68,a1:95,f1:95,a2:95,f2:95});
s('wallIn', null, {t:150,l1:-30,s1:-30,l2:-30,s2:-30,ft1:60,ft2:60,a1:60,f1:110,a2:60,f2:110});
s('hingeUp', null, {a1:30,f1:160,a2:30,f2:160});
s('hingeDown', null, {t:105,h:10,l1:10,s1:-5,l2:10,s2:-5,a1:30,f1:160,a2:30,f2:160});
s('punch1', null, {l1:8,s1:-5,l2:8,s2:-5,a1:90,f1:90,a2:-15,f2:110});
s('punch2', null, {l1:8,s1:-5,l2:8,s2:-5,a2:90,f2:90,a1:-15,f1:110});
s('pressDown', null, {a1:70,f1:178,a2:70,f2:178});
s('doorway', null, {h:5,c:-.15,l1:18,s1:0,l2:-10,s2:-10,a1:-90,f1:180,a2:-90,f2:180});
s('chinIn', null, {hx:-.07});
s('chinOut', null, {hx:.03});
s('nodUp', null, {h:22});
s('nodDown', null, {h:-22});
s('standCat', null, {t:150,c:.55,h:-30,l1:30,s1:-15,l2:30,s2:-15,a1:25,f1:35,a2:25,f2:35});
s('standCow', null, {t:150,c:-.45,h:25,l1:30,s1:-15,l2:30,s2:-15,a1:25,f1:35,a2:25,f2:35});

/* ---------- Pose library: front view ---------- */
const F = {};
const f = (name, base, o)=>{ F[name] = Object.assign({}, base ? F[base] : {}, o); };
f('stand', null, {});
f('T', null, {aL:90,fL:90,aR:90,fR:90});
f('up', null, {aL:165,fL:170,aR:165,fR:170});
f('upL', null, {aL:165,fL:170});
f('upR', null, {aR:165,fR:170});
f('W', null, {aL:55,fL:150,aR:55,fR:150});
f('Wsq', null, {aL:68,fL:168,aR:68,fR:168,sh:.03});
f('Y', null, {aL:145,fL:150,aR:145,fR:150});
f('goal', null, {aL:90,fL:175,aR:90,fR:175});
f('hug', null, {aL:55,fL:-75,aR:55,fR:-75});
f('bendR', null, {t:16,aL:160,fL:170,aR:10,fR:10});
f('bendL', null, {t:-16,aR:160,fR:170,aL:10,fL:10});
f('tiltL', null, {ht:-26});
f('tiltR', null, {ht:26});
f('turnL', null, {hr:-1});
f('turnR', null, {hr:1});
f('vorL', null, {hr:-.85});
f('vorR', null, {hr:.85});
f('shrug', null, {sh:-.1});
f('drop', null, {sh:.03});
f('jackL', null, {lL:22,sL:22,aL:150,fL:160,aR:150,fR:160});
f('jackR', null, {lR:22,sR:22,aL:150,fL:160,aR:150,fR:160});
f('stepL', null, {x:-.28,lR:14,sR:10,aL:90,fL:90,aR:90,fR:90});
f('stepR', null, {x:.28,lL:14,sL:10,aL:90,fL:90,aR:90,fR:90});
f('stepMid', null, {aL:30,fL:30,aR:30,fR:30});
f('hipL', null, {x:-.08,t:4});
f('hipR', null, {x:.08,t:-4});
f('handsHead', null, {aL:125,fL:-130,aR:125,fR:-130});
f('crunchR', null, {t:-12,aL:95,fL:-120,aR:130,fR:-130,kR:.9,lR:-8,sR:-5});
f('crunchL', null, {t:12,aR:95,fR:-120,aL:130,fL:-130,kL:.9,lL:-8,sL:-5});
f('marchL', null, {kL:.8});
f('marchR', null, {kR:.8});
f('butterfly', null, {lL:100,sL:-80,lR:100,sR:-80,aL:12,fL:-25,aR:12,fR:-25});
f('butterflyUp', 'butterfly', {lL:115,sL:-64,lR:115,sR:-64});
f('twistL', null, {hr:-.7,aL:35,fL:20,aR:-20,fR:-80});
f('twistR', null, {hr:.7,aR:35,fR:20,aL:-20,fL:-80});
f('shake1', null, {aL:16,fL:28,aR:6,fR:-4,x:.02});
f('shake2', null, {aL:6,fL:-4,aR:16,fR:28,x:-.02});
f('belly', null, {aL:22,fL:-45,aR:22,fR:-45});
f('bellyIn', 'belly', {br:1.04,sh:-.03});

/* ---------- Animations: view, props, keyframes [pose, moveSeconds, holdSeconds] ---------- */
const A = {
  anklePump:{v:'side',mat:1,k:[['ankleUp',.6,.3],['anklePoint',.6,.3]]},
  singleHug:{v:'side',mat:1,k:[['hook',1,.3],['singleHug',1.2,2],['hook',1,.3]]},
  kneeHug:{v:'side',mat:1,k:[['hook',1,.2],['kneeHug',1.2,.6],['kneeHugRock',1,.2],['kneeHug',1,.6],['hook',1,.3]]},
  bridgeLift:{v:'side',mat:1,k:[['hook',1.2,.3],['bridge',1.5,1],['hook',1.5,.3]]},
  bridgeHold:{v:'side',mat:1,k:[['hook',2,.5],['bridge',2,3]]},
  bridgeMarch:{v:'side',mat:1,k:[['bridge',1,.3],['bridgeMarch1',1,.3],['bridge',.8,.2],['bridgeMarch2',1,.3]]},
  bodyReach:{v:'side',mat:1,k:[['supine',1.5,.5],['supineReach',2,2]]},
  bedSit:{v:'side',chair:1,k:[['chairBreatheIn',3,.5],['chairBreatheOut',3.5,.5]]},
  chairAnkle:{v:'side',chair:1,k:[['chairToesUp',.7,.2],['chairHeelsUp',.7,.2]]},
  chairMarch:{v:'side',chair:1,k:[['chairMarch1',.6,.1],['chairSit',.5,0],['chairMarch2',.6,.1],['chairSit',.5,0]]},
  chairFists:{v:'side',chair:1,k:[['chairSit',1,.3],['chairArms',1,1.2]]},
  slowStand:{v:'side',chair:1,k:[['chairSit',1,.5],['chairLean',1,.5],['standArmsFwd',1.5,2.5],['chairLean',1.5,.3],['chairSit',1,.5]]},
  standBreathe:{v:'side',k:[['breatheIn',3,.5],['breatheOut',3.5,.5]]},
  chairBreathe:{v:'side',chair:1,k:[['chairBreatheIn',4,.5],['chairBreatheOut',5,.5]]},
  march:{v:'side',k:[['march1',.45,0],['stand',.4,0],['march2',.45,0],['stand',.4,0]]},
  highKnees:{v:'side',k:[['march1',.35,0],['soft',.3,0],['march2',.35,0],['soft',.3,0]]},
  kneeDrive:{v:'side',k:[['armsUp',.6,0],['knee1Up',.6,.1]],side:1},
  squatReach:{v:'side',k:[['squat',1,.2],['armsUp',1,.3]]},
  squats:{v:'side',k:[['stand',1.1,.2],['squat',1.3,.3]]},
  squatsFast:{v:'side',k:[['stand',.6,0],['squat',.7,0]]},
  squatHold:{v:'side',k:[['halfSquat',1.5,.5],['squat',1.5,3],['stand',1.5,.5]]},
  armSwing:{v:'side',k:[['soft',.7,0],['armsUp',.7,0]]},
  armCircle:{v:'side',circle:1,k:[]},
  wallPush:{v:'side',wall:1,k:[['wallOut',1,.3],['wallIn',1.2,.3]]},
  punch:{v:'side',k:[['punch1',.35,.1],['punch2',.35,.1]]},
  press:{v:'side',k:[['pressDown',.8,.2],['armsUp',.8,.2]]},
  pressFast:{v:'side',k:[['pressDown',.5,0],['armsUp',.5,0]]},
  calfRaise:{v:'side',k:[['stand',.8,.2],['calfUp',.8,.6]]},
  heelBounce:{v:'side',k:[['stand',.25,0],['heelBounce',.25,0]]},
  reverseLunge:{v:'side',k:[['stand',1,.2],['lungeDown',1.2,.4]],side:1},
  chairToToe:{v:'side',chair:1,k:[['chairSit',.8,.3],['chairLean',.8,.1],['standArmsFwd',1,.2],['toeStand',.8,.6],['standArmsFwd',.6,.1],['chairLean',1,.1],['chairSit',.8,.3]]},
  tspine:{v:'side',mat:1,k:[['allFours',1,.3],['needle',1.2,.5],['tspineUp',1.5,.8]],side:1},
  needle:{v:'side',mat:1,k:[['allFours',1.2,.3],['needle',1.5,2.5]],side:1},
  wgs:{v:'side',mat:1,k:[['wgs1',1.5,.5],['wgs2',1.5,1.5],['wgs1',1.2,.3]],side:1},
  kneelUp:{v:'side',mat:1,k:[['kneelSit',1.2,.5],['tallKneel',1.2,1]]},
  mountain:{v:'side',k:[['stand',2,1],['armsUp',2.5,1.5]]},
  foldLift:{v:'side',k:[['armsUp',1.5,.5],['fold',2,2],['halfLift',1.5,1.5],['fold',1.5,1.5]]},
  lowLunge:{v:'side',mat:1,k:[['lowLungeHands',2,1],['lowLunge',2,4]],side:1},
  lungeStretch:{v:'side',mat:1,k:[['lowLungeHands',2,3],['lowLunge',2,3]],side:1},
  crescent:{v:'side',k:[['highLungeHands',1.5,.5],['highLunge',2,3]],side:1},
  dog:{v:'side',mat:1,k:[['allFours',1.5,.3],['dog',2,4]]},
  dogPedal:{v:'side',mat:1,k:[['dogPedal1',.8,.3],['dog',.6,0],['dogPedal2',.8,.3],['dog',.6,0]]},
  cobra:{v:'side',mat:1,k:[['prone',2,1],['cobra',2.5,3]]},
  locust:{v:'side',mat:1,k:[['prone',1.5,.5],['locust',1.5,2.5]]},
  child:{v:'side',mat:1,k:[['child',2.5,.5],['childBreathe',3,.5]]},
  catCow:{v:'side',mat:1,k:[['cat',2.2,.5],['cow',2.2,.5]]},
  birdDog:{v:'side',mat:1,k:[['allFours',1,.2],['birdDog1',1.2,1],['allFours',1,.2],['birdDog2',1.2,1]]},
  plank:{v:'side',mat:1,k:[['plank',1,2],['plank',1,2]]},
  puppy:{v:'side',mat:1,k:[['allFours',1.5,.5],['puppy',2,4]]},
  malasana:{v:'side',k:[['halfSquat',1.5,.3],['malasana',1.5,4]]},
  seatedFold:{v:'side',mat:1,k:[['longSit',2,1],['seatedFold',2.5,3]]},
  kneeRock:{v:'side',mat:1,k:[['kneeHug',1.2,.2],['kneeHugRock',1.2,.2]]},
  rest:{v:'side',mat:1,k:[['restIn',4,.5],['rest',5,.5]]},
  legsUp:{v:'side',mat:1,wallAt:'feet',k:[['legsUp',3,.5],['legsUp',3,.5]]},
  figure4:{v:'side',mat:1,k:[['hook',1.5,.5],['figure4',1.5,1],['figure4Deep',1.5,3]],side:1},
  hinge:{v:'side',k:[['hingeUp',1.2,.2],['hingeDown',1.4,.4]]},
  armsBack:{v:'side',k:[['stand',1.5,.5],['armsBack',2,3]]},
  doorway:{v:'side',door:1,k:[['stand',1.5,.5],['doorway',2,4]],side:1},
  chinTuck:{v:'side',k:[['chinOut',.8,.3],['chinIn',.8,1.5]]},
  nod:{v:'side',target:1,k:[['nodUp',.6,0],['nodDown',.6,0]]},
  standCatCow:{v:'side',k:[['standCat',2,.5],['standCow',2,.5]]},
  sun12:{v:'side',mat:1,k:[['prayer',1.5,1],['reachBack',2,1],['fold',2,1],['lungeHandsDown',2,1],['plank',1.5,1],['eightLimb',1.5,1],['cobra',1.5,1],['dog',1.5,1],['lungeHandsDown',1.5,1],['fold',1.5,1],['reachBack',2,1],['stand',1.5,1]]},
  /* front view */
  fArmsOpen:{v:'front',k:[['T',2.5,.5],['hug',2.5,.8]]},
  fW:{v:'front',k:[['W',1,.2],['Wsq',1,1.2]]},
  fY:{v:'front',k:[['W',1,.2],['Y',1.2,.6]]},
  fTilt:{v:'front',k:[['tiltL',1.5,3],['stand',1,.3],['tiltR',1.5,3],['stand',1,.3]]},
  fTurn:{v:'front',k:[['turnL',1.2,1.2],['stand',1,.2],['turnR',1.2,1.2],['stand',1,.2]]},
  fShrug:{v:'front',k:[['shrug',.9,.2],['drop',.9,.2]]},
  fJacks:{v:'front',k:[['jackL',.6,.1],['stand',.5,0],['jackR',.6,.1],['stand',.5,0]]},
  fJacksFast:{v:'front',k:[['jackL',.45,0],['stand',.4,0],['jackR',.45,0],['stand',.4,0]]},
  fStep:{v:'front',k:[['stepL',.7,.1],['stepMid',.5,0],['stepR',.7,.1],['stepMid',.5,0]]},
  fHips:{v:'front',k:[['hipL',.9,0],['stand',.9,0],['hipR',.9,0],['stand',.9,0]]},
  fBend:{v:'front',k:[['bendR',1.5,1.5],['stand',1.2,.2],['bendL',1.5,1.5],['stand',1.2,.2]]},
  fCrunch:{v:'front',k:[['handsHead',.6,0],['crunchR',.6,.1],['handsHead',.6,0],['crunchL',.6,.1]]},
  fArmRaise:{v:'front',k:[['upL',.5,0],['stand',.4,0],['upR',.5,0],['stand',.4,0]]},
  fPump:{v:'front',k:[['goal',.8,.1],['up',.8,.2]]},
  fButterfly:{v:'front',mat:1,k:[['butterfly',1,.2],['butterflyUp',1,.2]]},
  fTwist:{v:'front',k:[['twistL',1.3,.3],['twistR',1.3,.3]]},
  fShake:{v:'front',k:[['shake1',.18,0],['shake2',.18,0]]},
  fVor:{v:'front',target:1,k:[['vorL',.55,0],['vorR',.55,0]]},
  fVorSlow:{v:'front',target:1,k:[['vorL',.9,.1],['vorR',.9,.1]]},
  fBelly:{v:'front',k:[['bellyIn',4,.5],['belly',5,.5]]}
};
/* arm circles: generated keyframes going all the way round */
A.armCircle.k = [0,90,180,270,360].map((a,i)=>[{a1:a,f1:a,a2:a,f2:a},i===0?0:.45,0]);

/* ---------- Geometry ---------- */
function full(view, p){
  const pose = typeof p==='string' ? (view==='side'?S:F)[p] : p;
  if(!pose) throw new Error('Unknown pose '+p);
  const b = Object.assign({}, view==='side'?SIDE0:FRONT0, pose);
  if(view==='side'){ if(b.ft1==null) b.ft1=b.s1+90; if(b.ft2==null) b.ft2=b.s2+90; }
  return b;
}
function lerp(a,b,u){ const o={}; for(const k in a) o[k] = a[k] + ((b[k]??a[k]) - a[k])*u; return o; }
const ease = u => .5 - .5*Math.cos(Math.PI*u);

function sideJ(p){
  const hip=[0,0], sh=add(hip, v(p.t, LEN.torso*p.br)), ha=p.t+p.h;
  const head=add(sh, v(ha, LEN.neck+LEN.head)); head[0]+=p.hx;
  const e1=add(sh,v(p.a1,LEN.ua)), w1=add(e1,v(p.f1,LEN.fa)), e2=add(sh,v(p.a2,LEN.ua)), w2=add(e2,v(p.f2,LEN.fa));
  const k1=add(hip,v(p.l1,LEN.th)), n1=add(k1,v(p.s1,LEN.sh)), t1=add(n1,v(p.ft1,LEN.ft));
  const k2=add(hip,v(p.l2,LEN.th)), n2=add(k2,v(p.s2,LEN.sh)), t2=add(n2,v(p.ft2,LEN.ft));
  const eye=add(add(head, v(ha-90, LEN.head*.55)), v(ha,.03));
  const pts=[hip,sh,e1,w1,e2,w2,k1,n1,t1,k2,n2,t2];
  const low=Math.max(...pts.map(q=>q[1]), head[1]+LEN.head);
  return {view:'side',hip,sh,head,ha,e1,w1,e2,w2,k1,n1,t1,k2,n2,t2,eye,c:p.c,low,pts:pts.concat([[head[0],head[1]-LEN.head],[head[0]-LEN.head,head[1]],[head[0]+LEN.head,head[1]]])};
}
function frontJ(p){
  const c=Math.cos(p.t*D), sn=Math.sin(p.t*D);
  const R=q=>[q[0]*c - q[1]*sn + p.x, q[0]*sn + q[1]*c];
  const top=-LEN.torso*p.br;
  const neck=[0,top], shL=[-.25,top+.07+p.sh], shR=[.25,top+.07+p.sh];
  const hc=c2(p.ht), headU=[0, top]; // head centre rotates about the neck
  function c2(a){ return [Math.sin(a*D)*(LEN.neck+LEN.head), -Math.cos(a*D)*(LEN.neck+LEN.head)]; }
  const head=[neck[0]+hc[0], neck[1]+hc[1]];
  const arm=(sh,side,a,fa)=>{ const e=[sh[0]+side*Math.sin(a*D)*LEN.ua, sh[1]+Math.cos(a*D)*LEN.ua]; return [e,[e[0]+side*Math.sin(fa*D)*LEN.fa, e[1]+Math.cos(fa*D)*LEN.fa]]; };
  const [eL,wL]=arm(shL,-1,p.aL,p.fL), [eR,wR]=arm(shR,1,p.aR,p.fR);
  const leg=(hx,side,l,s,k)=>{ const hp=[hx+p.x,0], tl=LEN.th*(1-.7*k);
    const kn=[hp[0]+side*Math.sin(l*D)*tl, hp[1]+Math.cos(l*D)*tl]; const an=[kn[0]+side*Math.sin(s*D)*LEN.sh, kn[1]+Math.cos(s*D)*LEN.sh];
    return [hp,kn,an,[an[0]+side*.13, an[1]]]; };
  const L=leg(-.13,-1,p.lL,p.sL,p.kL), Rl=leg(.13,1,p.lR,p.sR,p.kR);
  const J={view:'front', neck:R(neck), base:[p.x,0], shL:R(shL), shR:R(shR), head:R(head), ht:p.t+p.ht, hr:p.hr,
    eL:R(eL), wL:R(wL), eR:R(eR), wR:R(wR), legL:L, legR:Rl};
  const pts=[J.neck,J.shL,J.shR,J.eL,J.wL,J.eR,J.wR,...L,...Rl,[J.head[0],J.head[1]-LEN.head],[J.head[0]-LEN.head,J.head[1]],[J.head[0]+LEN.head,J.head[1]]];
  J.low=Math.max(...L.map(q=>q[1]), ...Rl.map(q=>q[1]), J.wL[1], J.wR[1], 0);
  J.pts=pts; return J;
}
function joints(view,p){ return view==='side' ? sideJ(p) : frontJ(p); }

/* Pose at time tau (seconds) within an animation's loop */
function poseAt(anim, tau){
  const ks=anim._k || (anim._k = anim.k.map(([p,m,h])=>[full(anim.v,p),m,h]));
  const cyc=anim._cyc || (anim._cyc = ks.reduce((a,k)=>a+k[1]+k[2],0));
  let t=((tau%cyc)+cyc)%cyc;
  for(let i=0;i<ks.length;i++){
    const [p,m,h]=ks[i], prev=ks[(i-1+ks.length)%ks.length][0];
    if(t < m) return lerp(prev,p,ease(t/m));
    t-=m; if(t < h) return p; t-=h;
  }
  return ks[ks.length-1][0];
}

/* Bounding box over the whole loop, so the figure doesn't drift inside the frame */
function frameOf(anim){
  if(anim._box) return anim._box;
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
  const cyc=poseAt(anim,0) && anim._cyc;
  for(let i=0;i<=24;i++){
    const J=joints(anim.v, poseAt(anim, cyc*i/24)); const g=J.low;
    J.pts.forEach(q=>{x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]-g);y1=Math.max(y1,q[1]-g);});
  }
  const J0=joints(anim.v, poseAt(anim,0));
  const props={};
  if(anim.chair){ props.chair=[J0.hip[0], J0.hip[1]-J0.low-.085]; x0=Math.min(x0,J0.hip[0]-.45); }
  if(anim.wall){ props.wall=Math.max(J0.w1[0],J0.w2[0])+.1; x1=Math.max(x1,props.wall+.1); }
  if(anim.wallAt==='feet'){ props.wall=J0.t1[0]+.25; x1=Math.max(x1,props.wall+.1); }
  if(anim.door){ props.wall=J0.sh[0]-.45; x0=Math.min(x0,props.wall-.1); }
  if(anim.target && anim.v==='side'){ props.target=[J0.head[0]+.85, J0.eye[1]]; x1=Math.max(x1,J0.head[0]+1); }
  if(anim.circle){ y0=Math.min(y0,-3.3); }
  return anim._box={x0,x1,y0:Math.min(y0,-.2),y1:0,props};
}

/* ---------- Drawing ---------- */
let colors=null;
function readColors(){
  const cs=getComputedStyle(document.documentElement);
  const g=n=>cs.getPropertyValue(n).trim();
  colors={fg:g('--fg'),far:g('--muted'),bg:g('--surface'),line:g('--line'),accent:g('--accent-strong')||g('--am-strong'),soft:g('--accent-soft')||g('--am-soft'),prop:g('--muted')};
}
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{colors=null;});

function draw(ctx, W, H, anim, tau, opts={}){
  if(!colors) readColors();
  const box=frameOf(anim);
  const bw=box.x1-box.x0, bh=box.y1-box.y0;
  const pad=opts.small?.1:.12;
  const S=Math.min(W*(1-2*pad)/bw, H*(1-2*pad)/bh, H*(1-2*pad)/3.15);
  const floorY=H*(1-pad*.8);
  const cx=(box.x0+box.x1)/2;
  ctx.clearRect(0,0,W,H);
  ctx.save();
  ctx.translate(W/2, floorY);
  if(opts.mirror) ctx.scale(-1,1);
  ctx.scale(S,S); ctx.translate(-cx,0);
  // floor
  ctx.strokeStyle=colors.line; ctx.lineWidth=2/S*(opts.small?.6:1); ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(box.x0-.6,.02); ctx.lineTo(box.x1+.6,.02); ctx.stroke();
  if(anim.mat){ ctx.fillStyle=colors.soft; roundRect(ctx, box.x0-.2, -.015, bw+.4, .05, .025); ctx.fill(); }
  const P=box.props;
  ctx.strokeStyle=colors.prop; ctx.lineWidth=.06;
  if(P.chair){ const [hx,hy]=P.chair; const sy=hy+.11;
    ctx.beginPath(); ctx.moveTo(hx-.32,sy); ctx.lineTo(hx+.28,sy); ctx.moveTo(hx-.28,sy); ctx.lineTo(hx-.28,0); ctx.moveTo(hx+.24,sy); ctx.lineTo(hx+.24,0);
    ctx.moveTo(hx-.32,sy); ctx.lineTo(hx-.36,sy-.9); ctx.stroke(); }
  if(P.wall!=null){ ctx.lineWidth=.08; ctx.beginPath(); ctx.moveTo(P.wall,0); ctx.lineTo(P.wall,-3.1); ctx.stroke(); }
  // figure
  const p=Object.assign({},poseAt(anim,tau));
  const breath=opts.still?0:.01*Math.sin(tau*1.7);
  p.br=(p.br||1)+breath;
  const J=joints(anim.v,p);
  ctx.translate(0,-J.low-.085);
  if(J.view==='side') drawSide(ctx,J,P,anim); else drawFront(ctx,J,anim);
  ctx.restore();
}
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function seg(ctx,pts,w,col){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.stroke();}
function drawSide(ctx,J,P,anim){
  const far=colors.far, fg=colors.fg;
  ctx.globalAlpha=.55;
  seg(ctx,[J.hip,J.k2,J.n2,J.t2],.17,far);
  seg(ctx,[J.sh,J.e2,J.w2],.15,far);
  ctx.globalAlpha=1;
  // torso with spine curve
  const u=[J.sh[0]-J.hip[0], J.sh[1]-J.hip[1]], back=[u[1],-u[0]];
  const mid=[(J.hip[0]+J.sh[0])/2 + back[0]*J.c*.35, (J.hip[1]+J.sh[1])/2 + back[1]*J.c*.35];
  ctx.strokeStyle=fg; ctx.lineWidth=.26; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(J.hip[0],J.hip[1]); ctx.quadraticCurveTo(mid[0],mid[1],J.sh[0],J.sh[1]); ctx.stroke();
  seg(ctx,[J.sh,J.head],.12,fg);
  ctx.fillStyle=fg; ctx.beginPath(); ctx.arc(J.head[0],J.head[1],LEN.head,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=colors.bg; ctx.beginPath(); ctx.arc(J.eye[0],J.eye[1],.032,0,Math.PI*2); ctx.fill();
  seg(ctx,[J.hip,J.k1,J.n1,J.t1],.18,fg);
  seg(ctx,[J.sh,J.e1,J.w1],.16,fg);
  if(P.target){ ctx.fillStyle=colors.accent; ctx.beginPath(); ctx.arc(P.target[0],P.target[1]+(-0),.06,0,Math.PI*2); ctx.fill();
    ctx.setLineDash([.05,.06]); ctx.strokeStyle=colors.accent; ctx.lineWidth=.02; ctx.beginPath(); ctx.moveTo(J.eye[0],J.eye[1]); ctx.lineTo(P.target[0],P.target[1]); ctx.stroke(); ctx.setLineDash([]); }
}
function drawFront(ctx,J,anim){
  const fg=colors.fg;
  const [hL,kL,aL,tL]=J.legL, [hR,kR,aR,tR]=J.legR;
  seg(ctx,[hL,kL,aL,tL],.18,fg); seg(ctx,[hR,kR,aR,tR],.18,fg);
  // pelvis + torso
  ctx.fillStyle=fg; ctx.beginPath();
  ctx.moveTo(hL[0]-.08,hL[1]+.04); ctx.lineTo(hR[0]+.08,hR[1]+.04); ctx.lineTo(J.shR[0]+.03,J.shR[1]-.02); ctx.lineTo(J.shL[0]-.03,J.shL[1]-.02); ctx.closePath();
  ctx.lineJoin='round'; ctx.strokeStyle=fg; ctx.lineWidth=.14; ctx.stroke(); ctx.fill();
  seg(ctx,[J.shL,J.eL,J.wL],.15,fg); seg(ctx,[J.shR,J.eR,J.wR],.15,fg);
  seg(ctx,[J.neck,J.head],.12,fg);
  // head turns: narrower when turned, eyes and nose shift
  const r=LEN.head, rx=r*(1-.14*Math.abs(J.hr));
  ctx.save(); ctx.translate(J.head[0],J.head[1]); ctx.rotate(J.ht*D);
  ctx.fillStyle=fg; ctx.beginPath(); ctx.ellipse(0,0,rx,r,0,0,Math.PI*2); ctx.fill();
  const faceShift=J.hr*.075;
  ctx.fillStyle=colors.bg;
  [-1,1].forEach(sd=>{ ctx.beginPath(); ctx.arc(faceShift+sd*.068*(1-.25*Math.abs(J.hr)), -.02, .03,0,Math.PI*2); ctx.fill(); });
  ctx.restore();
  if(anim.target){ /* a raised thumb held still in front of the face */
    const tx=J.base[0], ty=J.head[1]+.13;
    ctx.fillStyle=colors.accent; roundRect(ctx, tx-.035, ty-.06, .07, .14, .035); ctx.fill();
    roundRect(ctx, tx-.06, ty+.05, .12, .1, .045); ctx.fill(); }
}

/* Size a canvas for the device pixel ratio and draw one frame */
function paint(canvas, anim, tau, opts){
  const dpr=Math.min(window.devicePixelRatio||1,3);
  const w=canvas.clientWidth||canvas.width, h=canvas.clientHeight||canvas.height;
  if(canvas.width!==Math.round(w*dpr) || canvas.height!==Math.round(h*dpr)){ canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr); }
  const ctx=canvas.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
  draw(ctx,w,h,anim,tau,opts);
}

/* Look up an animation; "P:pose" makes a held pose with breathing */
function get(name){
  if(A[name]) return A[name];
  if(name.startsWith('P:')){ const p=name.slice(2); return A[name]={v:'side',mat:1,k:[[p,1,4],[p,1,4]]}; }
  throw new Error('Unknown animation '+name);
}
/* A representative moment for still thumbnails: the middle of the longest hold */
function repTime(anim){
  poseAt(anim,0); let t=0,best=-1,bt=0;
  anim._k.forEach(([p,m,h])=>{ if(h>best){best=h;bt=t+m+h/2;} t+=m+h; });
  return bt;
}
window.Figure = {A, get, paint, repTime, cycle:anim=>{poseAt(anim,0);return anim._cyc;}, resetColors:()=>{colors=null;}};
})();
