const canvas=document.getElementById('particles');
const ctx=canvas.getContext('2d');
let particles=[];
function resize(){canvas.width=innerWidth;canvas.height=innerHeight}
resize();
addEventListener('resize',resize);
for(let i=0;i<150;i++)particles.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.8+.3,v:Math.random()*.35+.08,a:Math.random()*6.28});
function animate(){ctx.clearRect(0,0,canvas.width,canvas.height);for(const p of particles){p.y-=p.v;p.x+=Math.sin(p.a+=.005)*.12;if(p.y<0)p.y=canvas.height;ctx.globalAlpha=.12+Math.random()*.4;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill()}requestAnimationFrame(animate)}
animate();

// Opening typewriter
const opening=document.getElementById('opening');
const enterBtn=document.getElementById('enterBtn');
const openingLine=document.getElementById('openingLine');
const introLines=[
  'This is not just a birthday page.',
  'It is five little moments made especially for today.',
  'There will be wishes, a song, a candle, and a surprise.',
  'Ready? Let the celebration begin. ✨'
];
let li=0;
function typeLine(text){openingLine.textContent='';let i=0;const t=setInterval(()=>{openingLine.textContent+=text[i++]||'';if(i>text.length)clearInterval(t)},35)}
setTimeout(()=>typeLine(introLines[0]),700);
const introTimer=setInterval(()=>{li++;if(li<introLines.length)typeLine(introLines[li]);else clearInterval(introTimer)},2300);

// Real-time Web Audio version of the familiar Happy Birthday melody.
// It starts only after the visitor presses Enter, which avoids browser autoplay blocking.
let audioCtx=null;
let master=null;
let musicOn=false;
let songTimer=null;
const beat=.34;
const birthdaySong=[
  [261.63,1],[261.63,1],[293.66,2],[261.63,2],[349.23,2],[329.63,4],
  [261.63,1],[261.63,1],[293.66,2],[261.63,2],[392.00,2],[349.23,4],
  [261.63,1],[261.63,1],[523.25,2],[440.00,2],[349.23,2],[329.63,2],[293.66,4],
  [466.16,1],[466.16,1],[440.00,2],[349.23,2],[392.00,2],[349.23,4]
];
const chords=[
  [130.81,164.81,196.00],[130.81,164.81,196.00],
  [146.83,174.61,220.00],[146.83,174.61,220.00],
  [174.61,220.00,261.63],[164.81,196.00,246.94],
  [130.81,164.81,196.00],[130.81,164.81,196.00],
  [146.83,174.61,220.00],[146.83,174.61,220.00],
  [196.00,246.94,293.66],[174.61,220.00,261.63],
  [130.81,164.81,196.00],[130.81,164.81,196.00],
  [261.63,329.63,392.00],[220.00,277.18,329.63],
  [174.61,220.00,261.63],[164.81,196.00,246.94],[146.83,174.61,220.00],
  [233.08,293.66,349.23],[233.08,293.66,349.23],
  [220.00,277.18,329.63],[174.61,220.00,261.63],
  [196.00,246.94,293.66],[174.61,220.00,261.63]
];
function playNote(freq,time,duration,type='triangle',volume=.075){
  if(!audioCtx||!master)return;
  const osc=audioCtx.createOscillator();
  const gain=audioCtx.createGain();
  osc.type=type;
  osc.frequency.setValueAtTime(freq,time);
  gain.gain.setValueAtTime(.0001,time);
  gain.gain.exponentialRampToValueAtTime(volume,time+.025);
  gain.gain.exponentialRampToValueAtTime(.0001,time+Math.max(.06,duration-.035));
  osc.connect(gain);gain.connect(master);
  osc.start(time);osc.stop(time+duration);
}
function scheduleBirthdaySong(){
  if(!musicOn||!audioCtx)return;
  const now=audioCtx.currentTime+.06;
  let offset=0;
  birthdaySong.forEach((item,index)=>{
    const [freq,beats]=item;
    const duration=beats*beat;
    playNote(freq,now+offset,duration*.9,'triangle',.095);
    if(chords[index]){
      chords[index].forEach(chordFreq=>playNote(chordFreq,now+offset,duration*.82,'sine',.018));
    }
    offset+=duration;
  });
  songTimer=setTimeout(scheduleBirthdaySong,offset*1000-80);
}
function startMusic(){
  audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==='suspended')audioCtx.resume();
  if(master)master.disconnect();
  master=audioCtx.createGain();
  master.gain.value=.82;
  master.connect(audioCtx.destination);
  musicOn=true;
  scheduleBirthdaySong();
  const musicControl=document.getElementById('musicControl');
  musicControl.classList.remove('off');
  musicControl.textContent='♫';
  musicControl.title='Happy Birthday song — turn music off';
}
function stopMusic(){
  musicOn=false;
  if(songTimer)clearTimeout(songTimer);
  songTimer=null;
  if(master&&audioCtx){master.gain.cancelScheduledValues(audioCtx.currentTime);master.gain.setValueAtTime(master.gain.value,audioCtx.currentTime);master.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.25)}
  const musicControl=document.getElementById('musicControl');
  musicControl.classList.add('off');
  musicControl.textContent='🔇';
  musicControl.title='Play Happy Birthday song';
}

// Five-screen navigation — intentionally BUTTON ONLY.
// Mouse wheel, keyboard arrows, dots and swipe do NOT change pages.
const pages=[...document.querySelectorAll('.page')];
const dots=[...document.querySelectorAll('#dots button')];
const count=document.getElementById('chapterCount');
let current=1;
function showPage(n,dir=1){
  n=Math.max(1,Math.min(5,n));
  if(n===current&&pages[n-1].classList.contains('active'))return;
  pages[current-1].classList.remove('active');
  current=n;
  pages[current-1].classList.add('active');
  count.textContent=String(current).padStart(2,'0')+' / 05';
  dots.forEach((d,i)=>d.classList.toggle('active',i===current-1));
  if(dir>0)burst(current===5?180:70);
}

document.querySelectorAll('[data-next]').forEach(button=>button.addEventListener('click',()=>showPage(Number(button.dataset.next),1)));
// Progress dots are visual only — no click navigation.
dots.forEach(dot=>{dot.setAttribute('aria-hidden','true');dot.tabIndex=-1;dot.style.cursor='default'});

// Confetti and surprise messages
const confetti=document.getElementById('confetti');
const toast=document.getElementById('toast');
function burst(count=100){
  for(let i=0;i<count;i++){
    const el=document.createElement('i');
    el.className='confetti';
    el.style.left=Math.random()*100+'%';
    el.style.animationDelay=Math.random()*.65+'s';
    el.style.background=['#ff72b6','#fff','#a58bff','#65dcff','#ffd166'][Math.floor(Math.random()*5)];
    el.style.borderRadius=Math.random()>.5?'50%':'2px';
    confetti.appendChild(el);
    setTimeout(()=>el.remove(),3500);
  }
}
function showToast(text){toast.textContent=text;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3400)}

function enterExperience(){
  document.body.classList.remove('locked');
  opening.classList.add('hide');
  startMusic();
  burst(110);
  showPage(1);
}
enterBtn.onclick=enterExperience;

document.getElementById('musicControl').onclick=()=>musicOn?stopMusic():startMusic();

// Wish interaction: candle reacts, screen celebrates, and final chapter unlocks.
const wishBtn=document.getElementById('wishBtn');
const wishResult=document.getElementById('wishResult');
const afterWish=document.getElementById('afterWish');
wishBtn.onclick=()=>{
  wishBtn.disabled=true;
  wishBtn.textContent='Wish Received ✨';
  wishResult.textContent='Your wish is safe now — between your heart and the universe.';
  document.querySelector('.cake-stage').classList.add('wish-made');
  burst(180);
  showToast('✨ Your wish has been sent into the stars.');
  setTimeout(()=>afterWish.classList.remove('hidden'),900);
};

document.getElementById('againBtn').onclick=()=>{
  showPage(1,-1);
  burst(140);
  showToast('✨ The magic begins again.');
};

// Desktop pointer light
if(matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.glass,.wish').forEach(card=>card.addEventListener('pointermove',e=>{
    const r=card.getBoundingClientRect();
    card.style.background=`radial-gradient(circle at ${e.clientX-r.left}px ${e.clientY-r.top}px,rgba(255,120,200,.11),transparent 32%),linear-gradient(145deg,rgba(255,255,255,.095),rgba(255,255,255,.025))`;
  }));
}
