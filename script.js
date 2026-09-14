const canvas=document.getElementById('particles');
const ctx=canvas.getContext('2d');
let particles=[];
function resize(){canvas.width=innerWidth;canvas.height=innerHeight}
resize();addEventListener('resize',resize);
for(let i=0;i<150;i++)particles.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.8+.3,v:Math.random()*.35+.08,a:Math.random()*6.28});
function animate(){ctx.clearRect(0,0,canvas.width,canvas.height);for(const p of particles){p.y-=p.v;p.x+=Math.sin(p.a+=.005)*.12;if(p.y<0)p.y=canvas.height;ctx.globalAlpha=.12+Math.random()*.4;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill()}requestAnimationFrame(animate)}animate();

// No automatic page changes. The visitor controls every step.
const opening=document.getElementById('opening');
const enterBtn=document.getElementById('enterBtn');
const pages=[...document.querySelectorAll('.page')];
const count=document.getElementById('chapterCount');
let current=1;

function showPage(n){
  n=Math.max(1,Math.min(pages.length,n));
  current=n;
  pages.forEach((page,i)=>page.classList.toggle('active',i===n-1));
  count.textContent=String(n).padStart(2,'0')+' / '+String(pages.length).padStart(2,'0');
  if(n>1)pages[n-1].scrollIntoView({behavior:'smooth',block:'start'});
}

document.querySelectorAll('[data-next]').forEach(button=>button.addEventListener('click',()=>showPage(Number(button.dataset.next))));

// Exact YouTube tune supplied by the user. It starts only after the Enter click.
const youtubeFrame=document.getElementById('birthdayYoutube');
let musicOn=false;
function youtubeCommand(func,args=[]){
  if(!youtubeFrame?.contentWindow)return;
  youtubeFrame.contentWindow.postMessage(JSON.stringify({event:'command',func,args}),'*');
}
function startMusic(){
  musicOn=true;
  youtubeCommand('playVideo');
  youtubeCommand('unMute');
  youtubeCommand('setVolume',[70]);
  const control=document.getElementById('musicControl');
  control.classList.remove('off');control.textContent='♫';control.title='Turn birthday tune off';
}
function stopMusic(){
  musicOn=false;youtubeCommand('pauseVideo');
  const control=document.getElementById('musicControl');
  control.classList.add('off');control.textContent='🔇';control.title='Play birthday tune';
}

function enterExperience(){
  document.body.classList.remove('locked');
  opening.classList.add('hide');
  startMusic();
  burst(110);
  showPage(1);
}
enterBtn.addEventListener('click',enterExperience);
document.getElementById('musicControl').addEventListener('click',()=>musicOn?stopMusic():startMusic());

// Celebration effects
const confetti=document.getElementById('confetti');
const toast=document.getElementById('toast');
function burst(amount=100){
  for(let i=0;i<amount;i++){
    const el=document.createElement('i');el.className='confetti';
    el.style.left=Math.random()*100+'%';
    el.style.animationDelay=Math.random()*.65+'s';
    el.style.background=['#ff72b6','#fff','#a58bff','#65dcff','#ffd166'][Math.floor(Math.random()*5)];
    el.style.borderRadius=Math.random()>.5?'50%':'2px';
    confetti.appendChild(el);setTimeout(()=>el.remove(),3500);
  }
}
function showToast(text){toast.textContent=text;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3000)}

// Cake wish + cutting animation. The final page unlocks only after this button is pressed.
const wishBtn=document.getElementById('wishBtn');
const wishResult=document.getElementById('wishResult');
const afterWish=document.getElementById('afterWish');
const cakeStage=document.getElementById('cakeStage');
const cutMessage=document.getElementById('cutMessage');
let wished=false;

wishBtn.addEventListener('click',()=>{
  if(wished)return;
  wished=true;
  wishBtn.disabled=true;
  wishBtn.textContent='Wish Received';
  wishResult.textContent='Your wish is safe now — between your heart and the universe.';
  cakeStage.classList.add('cutting');
  burst(180);
  showToast('Your wish is on its way to the stars.');
  setTimeout(()=>cutMessage.classList.add('show'),1500);
  setTimeout(()=>afterWish.classList.remove('hidden'),2100);
});

// Start again is also manual: it returns to Page 01 only when clicked.
document.getElementById('againBtn').addEventListener('click',()=>{
  window.scrollTo({top:0,behavior:'smooth'});
  showPage(1);
  burst(100);
});

// Gentle pointer glow only; it never changes pages.
if(matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.glass,.wish').forEach(card=>card.addEventListener('pointermove',e=>{
    const r=card.getBoundingClientRect();
    card.style.background=`radial-gradient(circle at ${e.clientX-r.left}px ${e.clientY-r.top}px,rgba(255,120,200,.11),transparent 32%),linear-gradient(145deg,rgba(255,255,255,.095),rgba(255,255,255,.025))`;
  }));
}
