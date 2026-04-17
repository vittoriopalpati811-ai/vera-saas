/* ╔══════════════════════════════════════════════════════
   ║  VERA ESG — Bubble & Mouse Animations
   ║  - Floating sustainability bubbles (pop on hover)
   ║  - Mouse glow cursor trail
   ║  - Click ripple
   ╚══════════════════════════════════════════════════════ */

(function(){
'use strict';

const WORDS = [
  'Carbon Neutral','Net Zero','ESG','GHG','VSME','GRI',
  'Scope 3','Doppia Materialità','EFRAG','CSRD','Emissioni',
  'Sostenibilità','PMI','Reporting','Impatto','ESRS',
  'Biodiversità','Governance','Circolare','Decarbonizzazione',
  'Scope 1','Scope 2','LCA','SDGs','Paris Agreement',
  'Bilancio ESG','Supply Chain','Stakeholder'
];

const GREEN  = 'oklch(0.72 0.21 150)';
const GREEN2 = 'oklch(0.63 0.185 148)';
const TEAL   = 'oklch(0.75 0.15 195)';
const COLORS = [GREEN, GREEN2, TEAL,
  'oklch(0.68 0.155 252)','oklch(0.72 0.175 47)'];

/* ── 1. CURSOR GLOW ────────────────────────────────────── */
const glow = document.createElement('div');
glow.id = 'vera-cursor-glow';
Object.assign(glow.style,{
  position:'fixed',pointerEvents:'none',zIndex:'9999',
  width:'320px',height:'320px',borderRadius:'50%',
  background:'radial-gradient(circle, oklch(0.72 0.21 150 / 0.08) 0%, transparent 70%)',
  transform:'translate(-50%,-50%)',transition:'opacity 0.3s',
  top:'-999px',left:'-999px'
});
document.body.appendChild(glow);

let mx=0,my=0,gx=0,gy=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  glow.style.left=mx+'px'; glow.style.top=my+'px';
});
document.addEventListener('mouseleave',()=>{ glow.style.opacity='0'; });
document.addEventListener('mouseenter',()=>{ glow.style.opacity='1'; });

/* smooth glow follow */
(function animGlow(){
  gx+=(mx-gx)*0.08; gy+=(my-gy)*0.08;
  glow.style.left=gx+'px'; glow.style.top=gy+'px';
  requestAnimationFrame(animGlow);
})();

/* ── 2. CLICK RIPPLE ───────────────────────────────────── */
document.addEventListener('click',e=>{
  if(e.target.closest('button,a,input,select,textarea,.bubble')) return;
  const r=document.createElement('div');
  Object.assign(r.style,{
    position:'fixed',pointerEvents:'none',zIndex:'9998',
    left:e.clientX+'px',top:e.clientY+'px',
    width:'8px',height:'8px',borderRadius:'50%',
    border:'2px solid '+GREEN,
    transform:'translate(-50%,-50%) scale(1)',
    opacity:'1',transition:'transform 0.6s ease-out, opacity 0.6s ease-out'
  });
  document.body.appendChild(r);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    r.style.transform='translate(-50%,-50%) scale(18)';
    r.style.opacity='0';
  }));
  setTimeout(()=>r.remove(), 700);
});

/* ── 3. FLOATING BUBBLES ───────────────────────────────── */
const BUBBLE_COUNT = 18;
const container = document.createElement('div');
container.id = 'vera-bubbles-layer';
Object.assign(container.style,{
  position:'fixed',inset:'0',pointerEvents:'none',
  zIndex:'1',overflow:'hidden'
});
document.body.appendChild(container);

function randRange(a,b){ return a+Math.random()*(b-a); }

function makeBubble(){
  const word   = WORDS[Math.floor(Math.random()*WORDS.length)];
  const color  = COLORS[Math.floor(Math.random()*COLORS.length)];
  const size   = randRange(52,110);
  const left   = randRange(2, 96);
  const dur    = randRange(14, 28);
  const delay  = randRange(0, dur);
  const drift  = randRange(-60,60);

  const b = document.createElement('div');
  b.className = 'bubble';
  b.textContent = word;
  Object.assign(b.style,{
    position:'absolute',
    bottom: `-${size+20}px`,
    left: left+'%',
    width: size+'px', height: size+'px',
    borderRadius:'50%',
    display:'flex',alignItems:'center',justifyContent:'center',
    textAlign:'center',
    fontSize: Math.max(9, size*0.165)+'px',
    fontWeight:'600',
    color: color,
    border:`1.5px solid ${color.replace(')','/0.35)').replace('oklch(','oklch(')}`,
    background:`radial-gradient(circle at 35% 35%, ${color.replace(')','/0.12)').replace('oklch(','oklch(')} 0%, transparent 70%)`,
    backdropFilter:'blur(2px)',
    pointerEvents:'auto',
    cursor:'pointer',
    userSelect:'none',
    transition:'transform 0.2s, box-shadow 0.2s, opacity 0.2s',
    animationName:'veraBubbleFloat',
    animationDuration: dur+'s',
    animationDelay: `-${delay}s`,
    animationTimingFunction:'linear',
    animationIterationCount:'infinite',
    '--drift': drift+'px'
  });

  b.addEventListener('mouseenter',()=>{
    b.style.transform='scale(1.18)';
    b.style.boxShadow=`0 0 24px ${color.replace(')','/0.45)').replace('oklch(','oklch(')}`;
  });
  b.addEventListener('mouseleave',()=>{
    b.style.transform='scale(1)';
    b.style.boxShadow='none';
  });
  b.addEventListener('click',()=>popBubble(b, color));

  container.appendChild(b);
  return b;
}

function popBubble(b, color){
  b.style.animation='none';
  b.style.transition='transform 0.15s, opacity 0.3s';
  b.style.transform='scale(1.6)';
  b.style.opacity='0';
  // Particle burst
  const rect=b.getBoundingClientRect();
  const cx=rect.left+rect.width/2, cy=rect.top+rect.height/2;
  for(let i=0;i<10;i++){
    const p=document.createElement('div');
    const angle=Math.random()*Math.PI*2;
    const dist=randRange(30,90);
    const ps=randRange(4,9);
    Object.assign(p.style,{
      position:'fixed',pointerEvents:'none',zIndex:'9997',
      left:cx+'px',top:cy+'px',
      width:ps+'px',height:ps+'px',
      borderRadius:'50%',
      background:color,
      transform:'translate(-50%,-50%)',
      opacity:'1',
      transition:`transform ${0.4+Math.random()*0.3}s ease-out, opacity 0.5s ease-out`
    });
    document.body.appendChild(p);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      p.style.transform=`translate(calc(-50% + ${Math.cos(angle)*dist}px), calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`;
      p.style.opacity='0';
    }));
    setTimeout(()=>p.remove(),700);
  }
  setTimeout(()=>{ b.remove(); makeBubble(); }, 350);
}

/* inject keyframes */
const kfStyle=document.createElement('style');
kfStyle.textContent=`
@keyframes veraBubbleFloat{
  0%   { transform:translateY(0) translateX(0); opacity:0; }
  5%   { opacity:0.75; }
  45%  { transform:translateY(-45vh) translateX(var(--drift)); opacity:0.75; }
  90%  { opacity:0.6; }
  100% { transform:translateY(-110vh) translateX(calc(var(--drift)*1.5)); opacity:0; }
}
`;
document.head.appendChild(kfStyle);

/* spawn initial bubbles */
for(let i=0;i<BUBBLE_COUNT;i++) makeBubble();

/* ── 4. PARALLAX HERO on mousemove ─────────────────────── */
const hero = document.querySelector('.hero');
if(hero){
  window.addEventListener('mousemove',e=>{
    const rx=(e.clientX/window.innerWidth-.5)*12;
    const ry=(e.clientY/window.innerHeight-.5)*8;
    hero.style.transform=`perspective(800px) rotateY(${rx*0.18}deg) rotateX(${-ry*0.12}deg)`;
  });
  window.addEventListener('mouseleave',()=>{
    hero.style.transform='perspective(800px) rotateY(0deg) rotateX(0deg)';
  });
}

/* ── 5. SHOW ONLY ON LANDING ────────────────────────────── */
function syncVisibility(){
  const landing = document.getElementById('view-landing');
  const visible = landing && (landing.style.display !== 'none' && !landing.hidden);
  container.style.display = visible ? 'block' : 'none';
  glow.style.display = 'block';
}
// watch view changes
const obs = new MutationObserver(syncVisibility);
document.querySelectorAll('[id^="view-"]').forEach(el=>
  obs.observe(el,{attributes:true,attributeFilter:['style','hidden','class']})
);
syncVisibility();

})();
