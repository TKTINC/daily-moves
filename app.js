/* Daily Moves app: schedule, guided mode and the animated routine player. */
const RT = window.ROUTINES;

/* ---------- The week (index = JS getDay: 0 Sun … 6 Sat) ---------- */
const W = (x)=>({w:x}); const L1={legs:0}, L3={legs:2};
const PLAN = [
  {name:'Sunday', theme:'Gentle reset & lymph care',
   am:['bed',W('walk'),'lymph','five','yoga10',L1,W('pran')],
   pm:[L3,'hips','neckA','stress',{v:'dizzyInfo',opt:true}],
   amNote:'A relaxed start: lymph flow, the longevity five and a full yoga flow.',
   pmNote:'Full 3 rounds of hip openers tonight, then neck release and wind-down.'},
  {name:'Monday', theme:'Wake-up energy & upper body',
   am:['bed',W('walk'),'energy','upper',L1,'vor',W('pran')],
   pm:[L3,'neckA','hips','stress'],
   amNote:'Two short energisers straight after the walk, while you are warm.',
   pmNote:'Undo the day’s desk posture, open the hips, then switch off.'},
  {name:'Tuesday', theme:'Heart, circulation & balance',
   am:['bed','dizzy',W('walk'),'five','heart','bp',L1,W('pran')],
   pm:[L3,'neckB','men40','chest'],
   amNote:'Steady standing first, then balance work and two heart-health routines.',
   pmNote:'Posture and the over-40 yoga, ending with the Om SaiRam chest release.'},
  {name:'Wednesday', theme:'Yoga flow & lymph care',
   am:['bed',W('walk'),'yoga10','lymph',L1,W('pran')],
   pm:[L3,'hipspine','neckA','stress'],
   amNote:'Mid-week lymph day: the 10-minute yoga flow, then lymph moves.',
   pmNote:'Hips and spine, neck release, wind-down.'},
  {name:'Thursday', theme:'Strength day',
   am:['bed',W('walk'),'four','target',L1,'vor',W('pran')],
   pm:[L3,'six','hips','chest'],
   amNote:'Your hardest morning. Go easy for the first two weeks.',
   pmNote:'A six-move yoga reset to loosen what you worked this morning.'},
  {name:'Friday', theme:'Circulation & anti-ageing',
   am:['bed','dizzy',W('walk'),'seven','no2','bp',L1,W('pran')],
   pm:[L3,'neckB','men40','stress'],
   amNote:'Light, rhythmic circulation work. Nothing heavy.',
   pmNote:'Posture and over-40 yoga, then wind-down.'},
  {name:'Saturday', theme:'Sun salutation & full body',
   am:['bed',W('walk'),'pose12','upper','energy',L1,'vor',W('pran')],
   pm:[L3,'six','hipspine','chest'],
   amNote:'More time today: Surya Namaskar step by step, then upper body and energy.',
   pmNote:'Yoga reset, hips and spine, and the chest release.'}
];
const YOURS = {
  walk:{t:'Your 30-minute walk',m:30,
    why:'Drink a glass of water first. Walking before the exercises warms the muscles, so the stretches go deeper and feel safer.',
    cues:['Brisk enough to breathe a little harder, easy enough to talk.','Walking later in the day instead? Just tick this and carry on.']},
  pran:{t:'Your pranayama',m:10,
    why:'This fits best last: the body is warm and settled after movement, so the breath slows down more easily. Traditionally, asana comes before pranayama.',
    cues:['Sit tall on a chair or cushion.','Your usual practice. End with a minute of quiet sitting.']}
};

/* ---------- State ---------- */
const store = {
  get(k,d){try{const v=localStorage.getItem('dm:'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem('dm:'+k,JSON.stringify(v))}catch(e){}}
};
const now=new Date(), todayIdx=now.getDay(), WEEK_ORDER=[1,2,3,4,5,6,0];
let state={day:todayIdx, sess:now.getHours()<15?'am':'pm', tab:'today'};
function dateFor(dayIdx){ const d=new Date(now); d.setDate(d.getDate()+((dayIdx+6)%7)-((todayIdx+6)%7));
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
const doneKey=(day,sess)=>'done:'+dateFor(day)+':'+sess;
const getDone=(day,sess)=>store.get(doneKey(day,sess),{});
function setDone(day,sess,i,val){const d=getDone(day,sess); if(val)d[i]=1; else delete d[i]; store.set(doneKey(day,sess),d);}
const legsKey=()=>'legs:'+dateFor(state.day);
const getLegs=()=>store.get(legsKey(),[0,0,0]);
function setLeg(i,val){const l=getLegs(); l[i]=val?1:0; store.set(legsKey(),l);}
let voiceOn=store.get('voice',true);

/* ---------- Helpers ---------- */
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function resolve(s){
  if(typeof s==='string') return {kind:'routine',key:s,r:RT[s]};
  if(s.w) return {kind:'yours',key:s.w,r:YOURS[s.w]};
  if('legs' in s) return {kind:'routine',key:'legs',r:RT.legs,legSlot:s.legs};
  return {kind:'routine',key:s.v,r:RT[s.v],opt:s.opt};
}
const steps=(day,sess)=>PLAN[day][sess].map(resolve);
const total=list=>list.filter(s=>!s.opt).reduce((a,s)=>a+s.r.m,0);
const fmt=s=>`${Math.floor(s/60)}:${String(Math.max(0,Math.ceil(s%60))).padStart(2,'0')}`.replace(/:60$/,':59');
const secs=d=>d>=60?`${Math.round(d/60*10)/10} min`.replace('.0',''):`${d} s`;
const CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

/* The creator's original reel, played through Instagram's / Facebook's own embed player */
const hasVideo=r=>r.src&&!r.src.removed;
const platform=r=>/facebook/.test(r.src.url)?'Facebook':'Instagram';
function embedSrc(r){
  return platform(r)==='Facebook'
    ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(r.src.url)}&show_text=false`
    : r.src.url+'embed/';
}
function videoHTML(r){
  return `<div class="player"><iframe class="${platform(r)==='Facebook'?'fb':'ig'}" src="${embedSrc(r)}" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="${esc(r.t)} video by ${esc(r.src.by)}"></iframe>
  <small>Video by ${esc(r.src.by)} on ${platform(r)}. Tap to play. If it shows only a picture, use “Open in ${platform(r)}”.</small></div>`;
}
const openVid=new Set();
function credit(r){
  if(r.src.removed) return `<div class="credit">Your saved “${esc(r.src.lbl)}” reel has been removed from Instagram, so this routine uses the animated guide.</div>`;
  return `<div class="credit">Video: ${esc(r.src.by)} · your note: “${esc(r.src.lbl)}”. The animated guide and tips are extras made for this app.</div>`;
}
function movesList(key,r){
  if(r.info) return `<ul class="facts">${r.facts.map(([h,t])=>`<li><b>${esc(h)}.</b> ${esc(t)}</li>`).join('')}</ul>`;
  return `<details class="movelist" data-key="${key}"><summary>${r.moves.length} moves${r.rounds?` × ${r.rounds} rounds`:''}</summary>
    <ol>${r.moves.map((mv,i)=>`<li><canvas width="72" height="54" data-thumb="${key}:${i}" aria-hidden="true"></canvas>
      <div><b>${esc(mv.n)}</b><span>${secs(mv.d)}${mv.side?' · both sides':''}</span></div></li>`).join('')}</ol></details>`;
}
function drawThumbs(root){
  root.querySelectorAll('canvas[data-thumb]').forEach(c=>{
    if(c.offsetParent===null) return;
    const [k,i]=c.dataset.thumb.split(':'); const a=Figure.get(RT[k].moves[+i].a);
    Figure.paint(c,a,Figure.repTime(a),{still:1,small:1});
  });
}
function coverCanvas(key){ const r=RT[key]; if(r.info||!r.moves.length) return '';
  return `<canvas class="cover" data-cover="${key}" aria-hidden="true"></canvas>`; }
function drawCovers(root){
  root.querySelectorAll('canvas[data-cover]').forEach(c=>{ const r=RT[c.dataset.cover];
    const mv=r.moves[Math.min(1,r.moves.length-1)]; const a=Figure.get(mv.a); Figure.paint(c,a,Figure.repTime(a),{still:1,small:1}); });
}

/* ---------- Voice + sound ---------- */
let audioCtx=null, enVoice=null;
function pickVoice(){ try{ const vs=speechSynthesis.getVoices(); enVoice=vs.find(v=>/en[-_]IN/i.test(v.lang))||vs.find(v=>/^en[-_]GB/i.test(v.lang))||vs.find(v=>/^en/i.test(v.lang))||null; }catch(e){} }
try{ pickVoice(); speechSynthesis.onvoiceschanged=pickVoice; }catch(e){}
function say(text){ if(!voiceOn) return; try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); if(enVoice)u.voice=enVoice; u.rate=.93; speechSynthesis.speak(u);}catch(e){} }
function unlockAudio(){ try{ audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)(); audioCtx.resume(); }catch(e){} try{ const u=new SpeechSynthesisUtterance(' '); u.volume=0; speechSynthesis.speak(u);}catch(e){} }
function beep(freq=660,len=.12){ if(!voiceOn||!audioCtx) return; try{ const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.frequency.value=freq; o.connect(g); g.connect(audioCtx.destination);
  const t=audioCtx.currentTime; g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.25,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+len); o.start(t); o.stop(t+len+.02);}catch(e){} }
let wakeLock=null;
async function keepAwake(){ try{ wakeLock=await navigator.wakeLock?.request('screen'); }catch(e){} }
function releaseAwake(){ try{ wakeLock?.release(); }catch(e){} wakeLock=null; }

/* ---------- Routine player ---------- */
const READY=6;
class Player{
  constructor(host,key,{onDone}={}){
    this.key=key; this.r=RT[key]; this.onDone=onDone;
    this.q=[]; for(let rd=1;rd<=(this.r.rounds||1);rd++) this.r.moves.forEach(m=>this.q.push({m,rd}));
    this.i=0; this.phase='idle'; this.left=READY; this.paused=false; this.t0=performance.now(); this.last=this.t0; this.switched=false;
    host.innerHTML=`<div class="pl">
      <div class="plstage"><canvas></canvas><span class="plside" hidden>Other side</span></div>
      <div class="plinfo">
        <div class="label plpos"></div>
        <h3 class="plname"></h3>
        <div class="pltime"><span class="big"></span><span class="plstate"></span></div>
        <div class="progress"><span></span></div>
        <p class="plcue"></p>
        <div class="plnext"></div>
      </div>
      <div class="plctl">
        <button class="btn" data-a="prev" aria-label="Previous move">⏮</button>
        <button class="startbtn" data-a="play">▶ Start</button>
        <button class="btn" data-a="next" aria-label="Next move">⏭</button>
        <button class="btn voice" data-a="voice" aria-pressed="${voiceOn}">${voiceOn?'🔊':'🔇'}</button>
      </div></div>`;
    this.el=host.firstElementChild; this.cv=this.el.querySelector('canvas');
    this.el.addEventListener('click',e=>{const b=e.target.closest('button[data-a]'); if(b) this.act(b.dataset.a);});
    this.updateText(); this.loop=this.loop.bind(this); this.raf=requestAnimationFrame(this.loop);
  }
  get item(){ return this.q[this.i]; }
  act(a){
    if(a==='play'){
      if(this.phase==='idle'){ unlockAudio(); keepAwake(); this.startReady(true); }
      else if(this.phase==='done'){ this.i=0; this.startReady(true); }
      else { this.paused=!this.paused; if(this.paused) try{speechSynthesis.cancel()}catch(e){} }
    } else if(a==='next'){ if(this.i<this.q.length-1){ this.i++; this.startReady(); } else this.finish(); }
    else if(a==='prev'){ if(this.i>0) this.i--; this.startReady(); }
    else if(a==='voice'){ voiceOn=!voiceOn; store.set('voice',voiceOn); if(!voiceOn) try{speechSynthesis.cancel()}catch(e){}
      const b=this.el.querySelector('.voice'); b.textContent=voiceOn?'🔊':'🔇'; b.setAttribute('aria-pressed',voiceOn); }
    this.updateText();
  }
  startReady(first){
    this.phase='ready'; this.left=READY; this.paused=false; this.switched=false;
    const {m,rd}=this.item; const rounds=this.r.rounds||1;
    const pre = first ? `Starting ${this.r.t}. ` : (rd>1 && this.q[this.i-1]?.rd!==rd ? `Round ${rd}. ` : '');
    say(`${pre}Next: ${m.n}. ${m.side?'Start with your right side. ':''}${m.cue}`);
    this.t0=performance.now();
  }
  startGo(){ this.phase='go'; this.left=this.item.m.d; this.t0=performance.now(); beep(880,.18); }
  finish(){ this.phase='done'; this.left=0; say('Routine complete. Well done.'); beep(660,.15); setTimeout(()=>beep(990,.25),180); this.updateText(); this.onDone&&this.onDone(); }
  loop(ts){
    const dt=Math.min(.25,(ts-this.last)/1000); this.last=ts;
    if((this.phase==='ready'||this.phase==='go') && !this.paused){
      const before=this.left; this.left-=dt;
      if(this.phase==='go'){
        const m=this.item.m;
        if(m.side && !this.switched && this.left<=m.d/2){ this.switched=true; say('Switch sides.'); beep(740,.15); }
        if(Math.ceil(before)!==Math.ceil(this.left) && this.left>0 && this.left<=3) beep(520,.08);
      }
      if(this.left<=0){ if(this.phase==='ready') this.startGo(); else if(this.i<this.q.length-1){ this.i++; this.startReady(); } else this.finish(); this.updateText(); }
      this.updateTimer();
    }
    if(this.cv.isConnected){
      const m=this.item.m, anim=Figure.get(m.a);
      const tau=(this.phase==='go'&&!this.paused)||this.phase!=='go' ? (ts/1000) : (this.pausedAt||ts/1000);
      if(this.paused){ this.pausedAt=this.pausedAt||ts/1000; } else this.pausedAt=0;
      const mirror=this.phase==='go'&&m.side&&this.switched;
      Figure.paint(this.cv,anim,this.paused?this.pausedAt:tau,{mirror});
      this.el.querySelector('.plside').hidden=!mirror;
      this.raf=requestAnimationFrame(this.loop);
    }
  }
  updateTimer(){
    const big=this.el.querySelector('.big'), bar=this.el.querySelector('.progress span');
    if(this.phase==='go'){ big.textContent=fmt(this.left); bar.style.width=`${(1-this.left/this.item.m.d)*100}%`; }
    else if(this.phase==='ready'){ big.textContent=fmt(this.left); bar.style.width='0%'; }
    else if(this.phase==='done'){ big.textContent='✓'; bar.style.width='100%'; }
    else { big.textContent=fmt(this.item.m.d); bar.style.width='0%'; }
  }
  updateText(){
    const {m,rd}=this.item, rounds=this.r.rounds||1, n=this.r.moves.length, idx=this.r.moves.indexOf(m)+1;
    const nx=this.q[this.i+1];
    this.el.querySelector('.plpos').textContent=`Move ${idx} of ${n}${rounds>1?` · Round ${rd} of ${rounds}`:''}`;
    this.el.querySelector('.plname').textContent=this.phase==='done'?'Routine complete':m.n;
    this.el.querySelector('.plcue').textContent=this.phase==='done'?'Nicely done. Take a slow breath before moving on.':m.cue+(m.side?' Both sides: the app tells you when to switch.':'');
    this.el.querySelector('.plstate').textContent={idle:'Tap Start when ready',ready:'Get ready',go:this.paused?'Paused':'Go',done:''}[this.phase]+(this.paused&&this.phase==='ready'?' · paused':'');
    this.el.querySelector('.plnext').textContent=nx&&this.phase!=='done'?`Up next: ${nx.m.n}`:'';
    this.el.querySelector('[data-a="play"]').textContent={idle:'▶ Start',done:'↺ Again'}[this.phase]||(this.paused?'▶ Resume':'❚❚ Pause');
    this.el.classList.toggle('going',this.phase==='go'&&!this.paused);
    this.updateTimer();
  }
  destroy(){ cancelAnimationFrame(this.raf); try{speechSynthesis.cancel()}catch(e){} }
}

/* ---------- Header ---------- */
function renderHeader(){
  document.body.classList.toggle('evening',state.sess==='pm');
  document.getElementById('dayTitle').textContent = state.tab==='today' ? PLAN[state.day].name : {week:'This week',library:'All routines',guide:'Guide'}[state.tab];
  const d=new Date(dateFor(state.day)+'T12:00:00');
  document.getElementById('dateLabel').textContent = state.tab==='today' ? d.toLocaleDateString(undefined,{day:'numeric',month:'short'}) : '';
  const days=document.getElementById('days');
  document.querySelector('.seg').hidden = days.hidden = state.tab!=='today';
  days.innerHTML = WEEK_ORDER.map(i=>{
    const full=sess=>{const dn=getDone(i,sess);return steps(i,sess).every((s,j)=>s.opt||dn[j]);};
    return `<button data-day="${i}" aria-pressed="${i===state.day}" aria-label="${PLAN[i].name}">
      <span class="today-mark">${i===todayIdx?'today':''}</span><b>${PLAN[i].name.slice(0,2)}</b>
      <span class="dots"><i class="${full('am')?'full':''}"></i><i class="${full('pm')?'full':''}"></i></span></button>`;
  }).join('');
  document.getElementById('segAm').setAttribute('aria-pressed',state.sess==='am');
  document.getElementById('segPm').setAttribute('aria-pressed',state.sess==='pm');
  document.querySelectorAll('nav.tabs button').forEach(b=>{ if(b.dataset.tab===state.tab) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current'); });
}

/* ---------- Today ---------- */
function stepCard(s,i,done,{inGuide=false}={}){
  const r=s.r, isR=s.kind==='routine';
  const chips=[`<span class="pill">${r.m} min</span>`];
  if(s.kind==='yours') chips.unshift('<span class="pill">You already do this</span>');
  if(s.legSlot!=null) chips.unshift(`<span class="pill accent">Legs set ${s.legSlot+1} of 3</span>`);
  if(s.opt) chips.unshift('<span class="pill">Optional read</span>');
  if(isR && hasVideo(r)) chips.push(`<span class="pill">${platform(r)} video</span>`);
  if(isR && !r.info) chips.push(`<span class="pill">Animated guide</span>`);
  return `<div class="card">
    <div class="head"><div class="ttl">${isR&&!inGuide?coverCanvas(s.key):''}<div><h3>${esc(r.t)}</h3>${isR?`<div class="by">${esc(r.cat)}</div>`:''}</div></div>
      ${inGuide?'':`<button class="check" data-check="${i}" aria-pressed="${!!done}" aria-label="Mark ${esc(r.t)} done">${CHECK}</button>`}</div>
    <div class="meta">${chips.join('')}</div>
    <p class="why">${esc(r.why)}</p>
    ${r.note?`<div class="note">${esc(r.note)}</div>`:''}
    ${isR?movesList(s.key,r):`<ul class="cues">${r.cues.map(c=>`<li>${esc(c)}</li>`).join('')}</ul>`}
    ${isR&&!inGuide?cardActions(s.key,r):''}
    ${isR?credit(r):''}
  </div>`;
}
function cardActions(key,r){
  const open=openVid.has(key);
  return `${hasVideo(r)&&open?videoHTML(r):''}<div class="actions">
    ${hasVideo(r)?`<button class="btn primary" data-video="${key}">${open?'Hide video':'▶ Watch video'}</button>`:''}
    ${r.info?'':`<button class="btn ${hasVideo(r)?'':'primary'}" data-play="${key}">◐ Animated guide</button>`}
    ${hasVideo(r)?`<a class="btn" href="${r.src.url}" target="_blank" rel="noopener">Open in ${platform(r)} ↗</a>`:''}</div>`;
}
function renderToday(){
  const day=PLAN[state.day], list=steps(state.day,state.sess), done=getDone(state.day,state.sess);
  const req=list.map((s,i)=>[s,i]).filter(([s])=>!s.opt), nDone=req.filter(([s,i])=>done[i]).length;
  const legs=getLegs(), isAm=state.sess==='am';
  let html=`<section class="intro">
    <span class="label">${isAm?'Morning':'Evening'} · ${esc(day.theme)}</span>
    <h2>${isAm?day.amNote:day.pmNote}</h2>
    <div class="meta"><span class="pill accent">About ${total(list)} min</span>
      <span class="pill">${list.filter(s=>s.kind==='routine'&&!s.opt).length} routines</span>
      <span class="pill ${nDone===req.length?'ok':''}">${nDone} of ${req.length} done</span></div>
    <div class="progress" aria-hidden="true"><span style="width:${req.length?nDone/req.length*100:0}%"></span></div>
  </section>
  <button class="startbtn" id="startGuided">▶ Start guided ${isAm?'morning':'evening'}</button>
  <div class="legs"><div class="t"><b>Strong legs · 1 min × 3</b><span>Midday set is on your own. Tap to tick.</span></div>
    <div class="slots">${['AM','Noon','PM'].map((l,i)=>`<button data-leg="${i}" aria-pressed="${!!legs[i]}">${l}</button>`).join('')}</div></div>
  <ol class="steps">`;
  list.forEach((s,i)=>{
    html+=`<li class="step ${s.kind==='yours'?'yours':''} ${done[i]?'done':''}"><span class="num">${i+1}</span>${stepCard(s,i,done[i])}</li>`;
    if(i<list.length-1 && s.kind==='routine' && list[i+1].kind==='routine') html+=`<li class="pause" aria-hidden="true">Pause 30 s · stand tall · 3 slow breaths</li>`;
  });
  html+='</ol>';
  const view=document.getElementById('view'); view.innerHTML=html; drawCovers(view);
}

/* ---------- Week ---------- */
function shortName(s){return s.kind==='yours'?(s.key==='walk'?'Walk 30′':'Pranayama'):(s.legSlot!=null?'Strong legs 1′':s.r.t)+(s.opt?' (optional)':'');}
function renderWeek(){
  document.getElementById('view').innerHTML=`<p class="lede">Energising work sits in the mornings after your walk. Stretching and stress relief sit in the evenings, so you go to bed relaxed. Tap a day to open it.</p>
  <div class="week">${WEEK_ORDER.map(i=>{const p=PLAN[i];return `<button class="wday ${i===todayIdx?'is-today':''}" data-goto="${i}">
    <div class="wh"><h3>${p.name}</h3><span class="label">${i===todayIdx?'Today':''}</span></div>
    <div style="font-weight:700">${esc(p.theme)}</div>
    <div class="cols"><div class="a"><b>☀ Morning · ${total(steps(i,'am'))}′</b><ul>${steps(i,'am').map(s=>`<li>${esc(shortName(s))}</li>`).join('')}</ul></div>
    <div class="p"><b>☾ Evening · ${total(steps(i,'pm'))}′</b><ul>${steps(i,'pm').map(s=>`<li>${esc(shortName(s))}</li>`).join('')}</ul></div></div></button>`;}).join('')}</div>`;
}

/* ---------- Library ---------- */
function whenUsed(key){
  if(key==='legs') return 'Every day · 3 times';
  const out=[];WEEK_ORDER.forEach(i=>['am','pm'].forEach(se=>{if(steps(i,se).some(s=>s.key===key))out.push(PLAN[i].name.slice(0,3)+' '+(se==='am'?'AM':'PM'));}));
  return out.join(' · ');
}
function renderLibrary(){
  const cats=[...new Set(Object.values(RT).map(r=>r.cat))];
  const view=document.getElementById('view');
  view.innerHTML=`<p class="lede">All ${Object.keys(RT).length} routines, grouped by what they do. Each plays your saved video from its creator, with an animated, voice-guided version as backup.</p>`+
  cats.map(c=>`<section class="lib"><h2>${esc(c)}</h2><div class="libgrp">${Object.entries(RT).filter(([k,r])=>r.cat===c).map(([k,r])=>`
    <div class="libitem"><div class="head"><div class="ttl">${coverCanvas(k)}<div><h3>${esc(r.t)}</h3><div class="sched">${whenUsed(k)}</div></div></div><span class="pill">${r.m}′</span></div>
    ${movesList(k,r)}
    ${cardActions(k,r)}${credit(r)}</div>`).join('')}</div></section>`).join('');
  drawCovers(view);
}

/* ---------- Guide ---------- */
function renderGuide(){
  document.getElementById('view').innerHTML=`<div class="guide">
  <section><h2>How each day flows</h2>
    <ol><li><b>In bed:</b> wake-up stretches, plus steady standing on Tuesday and Friday.</li>
    <li><b>Water, then your 30-minute walk.</b> It warms you up for everything after.</li>
    <li><b>Main block:</b> 2–3 routines, with a 30-second breathing pause between each.</li>
    <li><b>Strong legs</b> set 1, and the VOR focus drill on Mon, Thu and Sat.</li>
    <li><b>Pranayama last,</b> when the body is warm and settled.</li>
    <li><b>Evening:</b> legs set 3, then neck, shoulders and hips, ending with stress relief before bed.</li></ol></section>
  <section><h2>The weekly rhythm</h2>
    <ul><li>Lymph flow on <b>Sunday and Wednesday</b>, as you planned.</li>
    <li>One harder strength morning (<b>Thursday</b>), with lighter days either side.</li>
    <li>Neck and hip work every evening, rotating so it stays fresh.</li>
    <li>Saturday teaches Surya Namaskar one pose at a time.</li></ul></section>
  <section><h2>Using the player</h2>
    <p>Every routine has your saved video. It also has an animated version with a timer. A voice coach names each move and its cue, tells you when to switch sides, and beeps for the last three seconds. Tap 🔊 to mute it. The screen stays awake while a routine plays.</p>
    <p><b>Guided mode</b> walks you through the whole morning or evening, showing each video in turn. Switch any step to the animated guide and it moves on by itself when the routine ends.</p></section>
  <section><h2>Safety first</h2>
    <ul><li>Move within comfort. A mild stretch is fine; sharp pain means stop.</li>
    <li>Never hold your breath during effort. It spikes blood pressure.</li>
    <li>On BP or sugar medicines, check with your doctor before adding the harder routines, and get up slowly from the floor.</li>
    <li>Stop and get help for chest pain or pressure, pain spreading to the arm or jaw, sudden breathlessness, or fainting.</li>
    <li>This app is general guidance, not medical advice.</li></ul></section>
  <section><h2>Add to your iPhone home screen</h2>
    <ol><li>Open this app’s web address in <b>Safari</b>.</li><li>Tap <b>Share</b> (the square with an arrow).</li>
    <li>Choose <b>Add to Home Screen</b>, then <b>Add</b>.</li><li>Open it from the sunrise icon. It runs full screen and works offline.</li></ol></section>
  <section><h2>About the routines</h2>
    <p>Each routine plays the reel you saved, straight from its creator through Instagram’s or Facebook’s own player, credited on every card. The videos need internet. The animated, voice-guided versions and the tips are made for this app; they work offline and cover the one reel that has been removed.</p></section>
  </div>`;
}

/* ---------- Modal player ---------- */
let modalPlayer=null;
function openModal(key){
  const r=RT[key], m=document.getElementById('modal');
  m.innerHTML=`<div class="gtop"><span class="label">${esc(r.cat)} · ${r.m} min</span><button class="closebtn" id="mClose">Close ✕</button></div>
    <div class="gbody"><div class="wrap"><h2>${esc(r.t)}</h2><div id="mPlayer"></div>
    <p class="why">${esc(r.why)}</p>${r.note?`<div class="note">${esc(r.note)}</div>`:''}${credit(r)}</div></div>`;
  m.hidden=false; document.body.style.overflow='hidden';
  modalPlayer=new Player(document.getElementById('mPlayer'),key);
  m.querySelector('#mClose').onclick=closeModal;
}
function closeModal(){ modalPlayer?.destroy(); modalPlayer=null; const m=document.getElementById('modal'); m.hidden=true; m.innerHTML=''; document.body.style.overflow=''; releaseAwake(); }

/* ---------- Guided mode ---------- */
let G=null, tick=null, gPlayer=null;
function startGuided(){
  const list=steps(state.day,state.sess), done=getDone(state.day,state.sess);
  let first=list.findIndex((s,i)=>!done[i]&&!s.opt); if(first<0)first=0;
  G={list,i:first,phase:'step',anim:false}; unlockAudio(); keepAwake();
  document.getElementById('guided').hidden=false; document.body.style.overflow='hidden'; renderGuided();
}
function closeGuided(){ clearInterval(tick); gPlayer?.destroy(); gPlayer=null; G=null; document.getElementById('guided').hidden=true; document.body.style.overflow=''; releaseAwake(); render(); }
function advanceGuided(){
  const s=G.list[G.i], n=G.list.length;
  setDone(state.day,state.sess,G.i,true); if(s.legSlot!=null) setLeg(s.legSlot,true);
  if(G.i===n-1){ showFinish(); return; }
  const wasR=s.kind==='routine'; G.i++;
  G.phase = wasR && G.list[G.i].kind==='routine' ? 'rest':'step'; renderGuided();
}
function renderGuided(){
  clearInterval(tick); gPlayer?.destroy(); gPlayer=null;
  const el=document.getElementById('guided'), s=G.list[G.i], n=G.list.length;
  const top=`<div class="gtop"><span class="label">Step ${G.i+1} of ${n} · ${state.sess==='am'?'Morning':'Evening'}</span><button class="closebtn" id="gClose">Close ✕</button></div>`;
  if(G.phase==='rest'){
    const next=G.list[G.i]; let left=30, dur=30, tsec=0;
    el.innerHTML=top+`<div class="gbody"><div class="wrap"><div class="rest">
      <span class="label">Pause</span>
      <div class="ring"><svg viewBox="0 0 190 190"><circle cx="95" cy="95" r="85" fill="none" stroke="var(--line)" stroke-width="10"/><circle id="rArc" cx="95" cy="95" r="85" fill="none" stroke="var(--accent-strong)" stroke-width="10" stroke-linecap="round" stroke-dasharray="534" stroke-dashoffset="0"/></svg><span class="big" id="rNum">${dur}</span></div>
      <div class="breath" id="breath">Breathe in… 4</div>
      <p class="muted">Stand tall, shoulders soft. Sip water if you need it.</p>
      <p>Up next: <b>${esc(next.r.t)}</b></p></div></div></div>
      <div class="gfoot"><button class="btn" id="gAdd">+15 s</button><button class="startbtn" id="gSkip">Skip pause →</button></div>`;
    say('Pause. Breathe in for four, out for six.');
    tick=setInterval(()=>{left--;tsec++;const c=tsec%10;
      document.getElementById('breath').textContent=c<4?`Breathe in… ${4-c}`:`Breathe out… ${10-c}`;
      document.getElementById('rNum').textContent=Math.max(left,0);
      document.getElementById('rArc').setAttribute('stroke-dashoffset',534*(1-Math.max(left,0)/dur));
      if(left<=0){G.phase='step';renderGuided();}},1000);
    el.querySelector('#gAdd').onclick=()=>{left+=15;dur+=15;};
    el.querySelector('#gSkip').onclick=()=>{G.phase='step';renderGuided();};
  } else {
    const isR=s.kind==='routine', vid=isR&&hasVideo(s.r), isPlay=isR&&!s.r.info&&(!vid||G.anim);
    const timerHTML = s.kind==='yours' ? `<div class="timer"><span class="big" id="tNum">${String(s.r.m).padStart(2,'0')}:00</span><button class="btn primary" id="tGo">Start timer</button></div>`:'';
    el.innerHTML=top+`<div class="gbody"><div class="wrap">
      <h2>${esc(s.r.t)}</h2>${timerHTML}${vid&&!G.anim?videoHTML(s.r):''}${isPlay?'<div id="gPlayer"></div>':''}
      ${vid&&!s.r.info?`<div class="actions"><button class="btn" id="gSwap">${G.anim?'▶ Show the video instead':'◐ Use the animated guide instead'}</button><a class="btn" href="${s.r.src.url}" target="_blank" rel="noopener">Open in ${platform(s.r)} ↗</a></div>`:''}
      ${stepCard(s,G.i,false,{inGuide:true})}</div></div>
      <div class="gfoot"><button class="btn" id="gBack" ${G.i===0?'disabled':''}>← Back</button>
      <button class="startbtn" id="gNext">${G.i===n-1?'Finish ✓':(isPlay?'Skip · next →':'Done · next →')}</button></div>`;
    if(isPlay) gPlayer=new Player(el.querySelector('#gPlayer'),s.key,{onDone:()=>setTimeout(()=>{ if(G&&G.list[G.i]===s){ G.anim=false; advanceGuided(); } },2500)});
    if(s.kind==='yours') say(s.key==='walk'?'Time for your walk. Drink a glass of water first.':'Time for your pranayama. Sit tall and settle in.');
    el.querySelector('#gBack').onclick=()=>{if(G.i>0){G.i--;G.phase='step';G.anim=false;renderGuided();}};
    el.querySelector('#gNext').onclick=()=>{G.anim=false;advanceGuided();};
    const sw=el.querySelector('#gSwap'); if(sw) sw.onclick=()=>{G.anim=!G.anim;renderGuided();};
    if(vid&&!G.anim) say(`${s.r.t}. Tap the video to play, and follow along.`);
    const tGo=el.querySelector('#tGo');
    if(tGo) tGo.onclick=()=>{ let left=s.r.m*60; tGo.disabled=true; tGo.textContent='Running';
      tick=setInterval(()=>{left--;const m=Math.floor(left/60),sec=left%60;document.getElementById('tNum').textContent=`${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
        if(left<=0){clearInterval(tick);tGo.textContent='Time’s up ✓';say('Time is up.');beep(880,.3);}},1000); };
    drawThumbs(el);
    el.querySelectorAll('details.movelist').forEach(d=>d.addEventListener('toggle',()=>drawThumbs(d)));
  }
  el.querySelector('#gClose').onclick=closeGuided;
  el.querySelector('.gbody').scrollTop=0;
}
function showFinish(){
  const el=document.getElementById('guided'), isAm=state.sess==='am';
  say(isAm?'Morning complete. Have a great day.':'Evening complete. Sleep well. Om Sai Ram.');
  el.innerHTML=`<div class="gtop"><span class="label">Complete</span><button class="closebtn" id="gClose">Close ✕</button></div>
  <div class="gbody"><div class="wrap"><div class="rest"><div class="ring"><svg viewBox="0 0 190 190"><circle cx="95" cy="95" r="85" fill="none" stroke="var(--ok)" stroke-width="10"/></svg><span class="big" style="color:var(--ok)">✓</span></div>
  <h2>${isAm?'Morning done.':'Evening done.'}</h2>
  <p class="muted">${isAm?'Remember your midday strong-legs minute. Tick “Noon” when it’s done.':'Lights low, screens down. Sleep well. Om SaiRam.'}</p></div></div></div>
  <div class="gfoot" style="grid-template-columns:1fr"><button class="startbtn" id="gDone">Back to today</button></div>`;
  el.querySelector('#gClose').onclick=closeGuided; el.querySelector('#gDone').onclick=closeGuided;
}

/* ---------- Render + events ---------- */
function render(){
  renderHeader();
  ({today:renderToday,week:renderWeek,library:renderLibrary,guide:renderGuide})[state.tab]();
}
document.addEventListener('click',e=>{
  const t=e.target.closest('button'); if(!t||t.closest('#guided')||t.closest('#modal'))return;
  if(t.dataset.day){state.day=+t.dataset.day;render();}
  else if(t.id==='segAm'||t.id==='segPm'){state.sess=t.id==='segAm'?'am':'pm';render();}
  else if(t.dataset.tab){state.tab=t.dataset.tab;render();window.scrollTo(0,0);}
  else if(t.dataset.check!=null){const i=+t.dataset.check,cur=!!getDone(state.day,state.sess)[i];setDone(state.day,state.sess,i,!cur);
    const s=steps(state.day,state.sess)[i]; if(s.legSlot!=null)setLeg(s.legSlot,!cur); render();}
  else if(t.dataset.play){openModal(t.dataset.play);}
  else if(t.dataset.video){const k=t.dataset.video; openVid.has(k)?openVid.delete(k):openVid.add(k); render();}
  else if(t.dataset.leg!=null){const i=+t.dataset.leg;setLeg(i,!getLegs()[i]);render();}
  else if(t.dataset.goto!=null){state.day=+t.dataset.goto;state.tab='today';render();window.scrollTo(0,0);}
  else if(t.id==='startGuided'){startGuided();}
});
document.addEventListener('toggle',e=>{ if(e.target.matches?.('details.movelist')) drawThumbs(e.target); },true);
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible'&&(G||modalPlayer)) keepAwake(); });
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{ Figure.resetColors(); render(); });
render();
if('serviceWorker' in navigator && location.protocol==='https:'){ navigator.serviceWorker.register('sw.js').catch(()=>{}); }
