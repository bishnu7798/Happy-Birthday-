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

// YouTube background music — the exact tune supplied by the user.
// It begins from the Enter button click (a real user gesture), then loops continuously.
const youtubeFrame=document.getElementById('birthdayYoutube');
let musicOn=false;
let youtubeReady=false;
function youtubeCommand(command){
  if(!youtubeFrame||!youtubeFrame.contentWindow)return;
  youtubeFrame.contentWindow.postMessage(JSON.stringify({event:'command',func:command,args:[]}),'*');
}
window.addEventListener('message',event=>{
  try{
    const data=typeof event.data==='string'?JSON.parse(event.data):event.data;
    if(data&&data.event==='onReady')youtubeReady=true;
  }catch(_){/* ignore non-JSON YouTube messages */}
});
// Ask the YouTube player to initialize its JS API.
setTimeout(()=>{youtubeFrame?.contentWindow?.postMessage(JSON.stringify({event:'listening'}),'*')},300);
function startMusic(){
  musicOn=true;
  youtubeCommand('playVideo');
  youtubeCommand('unMute');
  youtubeCommand('setVolume');
  const musicControl=document.getElementById('musicControl');
  musicControl.classList.remove('off');
  musicControl.textContent='♫';
  musicControl.title='Birthday tune — turn music off';
  showToast('♫ Birthday tune is playing');
}
function stopMusic(){
  musicOn=false;
  youtubeCommand('pauseVideo');
  const musicControl=document.getElementById('musicControl');
  musicControl.classList.add('off');
  musicControl.textContent='🔇';
  musicControl.title='Play birthday tune';
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
