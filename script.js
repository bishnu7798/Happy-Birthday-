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
// SIMPLE TOUCH / MOUSE CAKE CUTTING
// No hand icon, no knife icon, and no cutting graphic is shown.
// The visitor simply touches or drags directly across the cake.
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
let startX=0;
let startY=0;

// Small instruction shown under the cake. It does not use any hand/knife icon.
const cutHint=document.createElement('div');
cutHint.className='cut-hint';
cutHint.textContent='কেকের উপর আঙুল দিয়ে স্পর্শ বা একটু ড্রাগ করলেই কেক কেটে যাবে';
cakeStage.appendChild(cutHint);

const interactiveStyle=document.createElement('style');
interactiveStyle.textContent=`
.cake-stage{touch-action:none;overflow:visible}
.cut-hint{position:absolute;z-index:21;left:50%;bottom:8px;transform:translateX(-50%);padding:10px 17px;border:1px solid rgba(255,255,255,.15);border-radius:999px;background:rgba(8,1,15,.7);backdrop-filter:blur(10px);font-size:.76rem;color:#f8eaf3;white-space:nowrap;transition:.3s;pointer-events:none;text-align:center}
.cake-stage.dragging .cut-hint{opacity:.25}
.cake-stage.cut-complete .cut-hint{opacity:0}
.cake-stage.cut-complete .cake{animation:cakeCelebrate .65s ease}
.cake-stage.cut-complete .top{animation:realSliceMove 1.1s .15s cubic-bezier(.2,.8,.2,1) forwards}
.cake-stage.cut-complete .icing{animation:realSliceMove 1.1s .15s cubic-bezier(.2,.8,.2,1) forwards}
.cake-stage.cut-complete .candle{animation:candleFall .8s .2s forwards}
@keyframes realSliceMove{to{transform:translateX(65px) rotate(4deg);opacity:.72}}
@keyframes cakeCelebrate{40%{transform:scale(1.055) translateY(-5px)}100%{transform:scale(1)}}
@media(max-width:760px){.cut-hint{font-size:.68rem;max-width:92%;white-space:normal}}
`;
document.head.appendChild(interactiveStyle);

function prepareCake(){
  cakeStage.classList.remove('dragging','cut-complete');
  cakeStage.classList.add('ready-to-cut');
}

function completeCut(){
  if(cutComplete)return;
  cutComplete=true;
  cutting=false;
  cakeStage.classList.remove('dragging');
  cakeStage.classList.add('cut-complete');
  wishResult.textContent='দারুণ! তুমি নিজেই কেক কেটে ফেলেছো — তোমার নতুন বছরটা মিষ্টি ও সুন্দর হোক।';
  cutMessage.classList.add('show');
  burst(220);
  showToast('🎂 কেক কাটা হয়ে গেছে!');
  setTimeout(()=>afterWish.classList.remove('hidden'),900);
}

// Pressing the wish button only prepares the cake. The user then touches or
// drags directly on the cake to complete the cut.
wishBtn.addEventListener('click',()=>{
  if(wished)return;
  wished=true;
  wishBtn.disabled=true;
  wishBtn.textContent='এবার কেক কাটো';
  wishResult.textContent='এখন কেকের উপর আঙুল দিয়ে একবার স্পর্শ করো অথবা একটু ড্রাগ করো।';
  prepareCake();
  showToast('কেকের উপর আঙুল দিয়ে স্পর্শ বা ড্রাগ করো');
});

// Direct touch/mouse gesture on the cake. A simple touch inside the cake OR a
// short drag across it is enough to trigger the cutting animation.
cakeStage.addEventListener('pointerdown',e=>{
  if(!wished||cutComplete)return;
  const rect=cake.getBoundingClientRect();
  const inside=e.clientX>=rect.left-10 && e.clientX<=rect.right+10 && e.clientY>=rect.top-10 && e.clientY<=rect.bottom+10;
  if(!inside)return;
  cutting=true;
  startX=e.clientX;
  startY=e.clientY;
  cakeStage.classList.add('dragging');
  cakeStage.setPointerCapture?.(e.pointerId);
});

cakeStage.addEventListener('pointermove',e=>{
  if(!cutting||cutComplete)return;
  const dx=e.clientX-startX;
  const dy=e.clientY-startY;
  const distance=Math.hypot(dx,dy);
  // A tiny drag is enough; a direct tap is handled on pointerup.
  if(distance>=18)completeCut();
});

cakeStage.addEventListener('pointerup',e=>{
  if(!cutting||cutComplete)return;
  const dx=e.clientX-startX;
  const dy=e.clientY-startY;
  const distance=Math.hypot(dx,dy);
  cutting=false;
  cakeStage.classList.remove('dragging');
  if(distance<18)completeCut();
});

cakeStage.addEventListener('pointercancel',()=>{
  cutting=false;
  cakeStage.classList.remove('dragging');
});

// Start again is also manual: it returns to Page 01 only when clicked.
document.getElementById('againBtn').addEventListener('click',()=>{
  window.scrollTo({top:0,behavior:'smooth'});
  showPage(1);
  wished=false;cutting=false;cutComplete=false;
  wishBtn.disabled=false;wishBtn.textContent='ইচ্ছে করে কেক কাটো';
  wishResult.textContent='মোমবাতির আলো তোমার ইচ্ছের অপেক্ষায়...';
  cutMessage.classList.remove('show');afterWish.classList.add('hidden');
  cakeStage.classList.remove('ready-to-cut','dragging','cut-complete');
  burst(100);
});

// Gentle pointer glow only; it never changes pages.
if(matchMedia('(pointer:fine)').matches){document.querySelectorAll('.glass,.wish').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.background=`radial-gradient(circle at ${e.clientX-r.left}px ${e.clientY-r.top}px,rgba(255,120,200,.11),transparent 32%),linear-gradient(145deg,rgba(255,255,255,.095),rgba(255,255,255,.025))`}))}
