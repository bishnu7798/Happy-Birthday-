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
function youtubeCommand(func,args=[]){if(!youtubeFrame?.contentWindow)return;youtubeFrame.contentWindow.postMessage(JSON.stringify({event:'command',func,args}),'*')}
function startMusic(){musicOn=true;youtubeCommand('playVideo');youtubeCommand('unMute');youtubeCommand('setVolume',[70]);const control=document.getElementById('musicControl');control.classList.remove('off');control.textContent='♫';control.title='Turn birthday tune off'}
function stopMusic(){musicOn=false;youtubeCommand('pauseVideo');const control=document.getElementById('musicControl');control.classList.add('off');control.textContent='🔇';control.title='Play birthday tune'}
function enterExperience(){document.body.classList.remove('locked');opening.classList.add('hide');startMusic();burst(110);showPage(1)}
enterBtn.addEventListener('click',enterExperience);
document.getElementById('musicControl').addEventListener('click',()=>musicOn?stopMusic():startMusic());

// Celebration effects
const confetti=document.getElementById('confetti');
const toast=document.getElementById('toast');
function burst(amount=100){for(let i=0;i<amount;i++){const el=document.createElement('i');el.className='confetti';el.style.left=Math.random()*100+'%';el.style.animationDelay=Math.random()*.65+'s';el.style.background=['#ff72b6','#fff','#a58bff','#65dcff','#ffd166'][Math.floor(Math.random()*5)];el.style.borderRadius=Math.random()>.5?'50%':'2px';confetti.appendChild(el);setTimeout(()=>el.remove(),3500)}}
function showToast(text){toast.textContent=text;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3000)}

// -----------------------------------------------------------------------------
// REAL INTERACTIVE CAKE CUTTING
// The visitor physically drags the hand-held knife across the cake.
// Nothing cuts automatically.
// -----------------------------------------------------------------------------
const wishBtn=document.getElementById('wishBtn');
const wishResult=document.getElementById('wishResult');
const afterWish=document.getElementById('afterWish');
const cakeStage=document.getElementById('cakeStage');
const cake=document.getElementById('cake');
const cutMessage=document.getElementById('cutMessage');
let wished=false;
let cutting=false;
let cutComplete=false;

// Add a polished SVG-style hand holding the knife. It is created in JS so the
// existing HTML remains compatible with the previous version of the site.
const hand=document.createElement('div');
hand.className='interactive-hand';
hand.setAttribute('aria-hidden','true');
hand.innerHTML=`
  <div class="hand-arm"></div>
  <div class="hand-palm">
    <span class="finger f1"></span><span class="finger f2"></span><span class="finger f3"></span><span class="finger f4"></span>
    <span class="thumb"></span>
  </div>
  <div class="hand-knife"><span class="knife-blade"></span><span class="knife-handle"></span></div>`;
cakeStage.appendChild(hand);

// Instructions are also created dynamically.
const cutHint=document.createElement('div');
cutHint.className='cut-hint';
cutHint.innerHTML='<span>☝</span> Drag the hand across the cake to cut it';
cakeStage.appendChild(cutHint);

// CSS for the hand, knife and actual slicing interaction.
const interactiveStyle=document.createElement('style');
interactiveStyle.textContent=`
.cake-stage{touch-action:none;overflow:visible}
.interactive-hand{position:absolute;z-index:20;right:6%;bottom:72px;width:190px;height:170px;pointer-events:none;transform:translate(115px,-15px) rotate(-7deg);transform-origin:75% 70%;transition:transform .35s ease,opacity .35s;filter:drop-shadow(0 15px 15px rgba(0,0,0,.28))}
.hand-arm{position:absolute;right:-10px;bottom:5px;width:125px;height:70px;border-radius:55px 25px 25px 55px;background:linear-gradient(135deg,#f5b08d,#d77d62);transform:rotate(-18deg);box-shadow:inset 7px 5px 12px rgba(255,255,255,.18)}
.hand-palm{position:absolute;right:53px;bottom:45px;width:78px;height:82px;border-radius:45% 50% 42% 48%;background:linear-gradient(145deg,#ffd0ae,#e99576);transform:rotate(-12deg);box-shadow:inset 8px 5px 12px rgba(255,255,255,.2)}
.finger{position:absolute;width:22px;height:58px;border-radius:14px;background:linear-gradient(90deg,#ffc5a2,#df8a6c);top:-29px;box-shadow:inset 3px 0 5px rgba(255,255,255,.16)}
.f1{left:7px;transform:rotate(8deg)}.f2{left:25px;top:-35px;transform:rotate(2deg)}.f3{left:43px;top:-31px;transform:rotate(-6deg)}.f4{left:59px;top:-22px;transform:rotate(-14deg)}
.thumb{position:absolute;width:27px;height:51px;left:-17px;top:28px;border-radius:16px;background:linear-gradient(90deg,#e39172,#ffc3a0);transform:rotate(48deg)}
.hand-knife{position:absolute;left:3px;top:18px;width:128px;height:30px;transform:rotate(-18deg);transform-origin:right center}
.knife-blade{position:absolute;left:0;top:4px;width:103px;height:18px;border-radius:5px 3px 3px 5px;background:linear-gradient(180deg,#fff,#b8c0ca 48%,#f7f7f7);clip-path:polygon(0 0,100% 0,84% 100%,0 100%);box-shadow:0 2px 5px rgba(0,0,0,.35)}
.knife-handle{position:absolute;right:0;top:1px;width:38px;height:25px;border-radius:5px 12px 12px 5px;background:linear-gradient(180deg,#3b3144,#17121c);box-shadow:inset 0 2px rgba(255,255,255,.16)}
.cut-hint{position:absolute;z-index:21;left:50%;bottom:8px;transform:translateX(-50%);padding:10px 17px;border:1px solid rgba(255,255,255,.15);border-radius:999px;background:rgba(8,1,15,.7);backdrop-filter:blur(10px);font-size:.76rem;color:#f8eaf3;white-space:nowrap;transition:.3s;pointer-events:none}
.cut-hint span{font-size:1rem;margin-right:7px}
.cake-stage.ready-to-cut .interactive-hand{transform:translate(0,-10px) rotate(-7deg);opacity:1}
.cake-stage.dragging .interactive-hand{transition:none}
.cake-stage.dragging .cut-hint{opacity:.25}
.cake-stage.cut-complete .interactive-hand{animation:handAfterCut .8s ease forwards}
.cake-stage.cut-complete .cut-hint{opacity:0}
.cake-stage.cut-complete .cake{animation:cakeCelebrate .65s ease}
.cake-stage.cut-complete .top{animation:realSliceMove 1.1s .15s cubic-bezier(.2,.8,.2,1) forwards}
.cake-stage.cut-complete .icing{animation:realSliceMove 1.1s .15s cubic-bezier(.2,.8,.2,1) forwards}
.cake-stage.cut-complete .candle{animation:candleFall .8s .2s forwards}
@keyframes handAfterCut{to{transform:translate(145px,-20px) rotate(-14deg);opacity:.15}}
@keyframes realSliceMove{to{transform:translateX(65px) rotate(4deg);opacity:.72}}
@keyframes cakeCelebrate{40%{transform:scale(1.055) translateY(-5px)}100%{transform:scale(1)}}
@media(max-width:760px){.interactive-hand{right:-3%;bottom:65px;transform:translate(85px,-5px) scale(.82) rotate(-7deg)}.cake-stage.ready-to-cut .interactive-hand{transform:translate(-4px,-3px) scale(.82) rotate(-7deg)}.cut-hint{font-size:.68rem;max-width:92%;text-align:center}}
`;
document.head.appendChild(interactiveStyle);

function prepareCake(){
  cakeStage.classList.remove('cutting','cut-complete','dragging');
  cakeStage.classList.add('ready-to-cut');
  hand.style.opacity='1';
  cutHint.innerHTML='<span>☝</span> Drag the hand across the cake to cut it';
}

function completeCut(){
  if(cutComplete)return;
  cutComplete=true;
  cutting=false;
  cakeStage.classList.remove('dragging');
  cakeStage.classList.add('cut-complete');
  wishResult.textContent='Beautiful! You cut the cake — now a sweet new chapter begins.';
  cutMessage.classList.add('show');
  burst(220);
  showToast('🎂 Cake cut! Your birthday wish is released.');
  setTimeout(()=>afterWish.classList.remove('hidden'),900);
}

// Pressing Make the Wish prepares the cake. The cake does NOT cut yet.
// The user must then drag the hand/knife across the cake.
wishBtn.addEventListener('click',()=>{
  if(wished)return;
  wished=true;
  wishBtn.disabled=true;
  wishBtn.textContent='Now Cut the Cake';
  wishResult.textContent='Your wish is safe now. Use your finger or mouse and drag the hand across the cake.';
  prepareCake();
  showToast('☝ Now drag the hand across the cake.');
});

// Pointer/touch cutting gesture. A horizontal swipe through the cake's center
// is required before the slice animation is triggered.
cakeStage.addEventListener('pointerdown',e=>{
  if(!wished||cutComplete)return;
  cutting=true;
  cakeStage.classList.add('dragging');
  cakeStage.setPointerCapture?.(e.pointerId);
  hand.style.transform='translate(0,-5px) rotate(-10deg)';
});

cakeStage.addEventListener('pointermove',e=>{
  if(!cutting||cutComplete)return;
  const rect=cakeStage.getBoundingClientRect();
  const x=Math.max(0,Math.min(rect.width,e.clientX-rect.left));
  const y=Math.max(0,Math.min(rect.height,e.clientY-rect.top));
  const targetX=x-92;
  const targetY=y-92;
  hand.style.transform=`translate(${targetX}px,${targetY}px) rotate(-10deg)`;

  const cakeRect=cake.getBoundingClientRect();
  const withinVertical=e.clientY>cakeRect.top+cakeRect.height*.28 && e.clientY<cakeRect.bottom-cakeRect.height*.12;
  const crossedCake=e.clientX>cakeRect.left+cakeRect.width*.12 && e.clientX<cakeRect.right-cakeRect.width*.05;
  if(withinVertical&&crossedCake&&x>rect.width*.38){completeCut()}
});

function cancelCut(){
  if(!cutting||cutComplete)return;
  cutting=false;
  cakeStage.classList.remove('dragging');
  cakeStage.classList.add('ready-to-cut');
  showToast('Try dragging the knife straight across the cake.');
}
cakeStage.addEventListener('pointerup',cancelCut);
cakeStage.addEventListener('pointercancel',cancelCut);

// Start again is also manual: it returns to Page 01 only when clicked.
document.getElementById('againBtn').addEventListener('click',()=>{
  window.scrollTo({top:0,behavior:'smooth'});
  showPage(1);
  wished=false;cutting=false;cutComplete=false;
  wishBtn.disabled=false;wishBtn.textContent='Make the Wish';
  wishResult.textContent='The candle is waiting for your wish...';
  cutMessage.classList.remove('show');afterWish.classList.add('hidden');
  cakeStage.classList.remove('ready-to-cut','dragging','cut-complete','cutting');
  hand.style.transform='translate(115px,-15px) rotate(-7deg)';
  burst(100);
});

// Gentle pointer glow only; it never changes pages.
if(matchMedia('(pointer:fine)').matches){document.querySelectorAll('.glass,.wish').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.background=`radial-gradient(circle at ${e.clientX-r.left}px ${e.clientY-r.top}px,rgba(255,120,200,.11),transparent 32%),linear-gradient(145deg,rgba(255,255,255,.095),rgba(255,255,255,.025))`}))}
