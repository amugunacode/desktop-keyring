const toast=document.querySelector('#toast');
let toastTimer;
function announce(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3200)}
const mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
document.querySelector('#mobile-notice').hidden=!mobile;
if(mobile)document.querySelector('#demo-hint').textContent='손가락으로 움직여 보세요 ↗';
const dialog=document.querySelector('#copy-dialog');
document.querySelectorAll('.copy-link').forEach(button=>button.addEventListener('click',async()=>{
  const url=new URL(location.href);url.hash='';url.search='';
  try{await navigator.clipboard.writeText(url.href);announce('링크를 복사했어요. Windows PC에서 열어주세요.')}catch{
    const field=document.querySelector('#share-url');field.value=url.href;dialog.showModal();field.focus();field.select();
  }
}));
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
document.querySelectorAll('a[aria-disabled="true"]').forEach(link=>link.addEventListener('click',event=>event.preventDefault()));

// This is a lightweight web demonstration. The Windows app uses its own native renderer.
const stage=document.querySelector('#demo-stage'),canvas=document.querySelector('#keyring-canvas'),ctx=canvas.getContext('2d');
const bear=new Image();bear.src='/assets/teddy-bear.png';
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let width=0,height=0,scale=1,ready=false,count=1,dark=false,inside=false,inView=true,frame=0,last=0,accumulator=0,clock=0;
let pointer={x:0,y:0},anchor={x:0,y:0};
const segmentCount=11,step=1/120;
let ropes=[];
function reset(){
  anchor={x:width*.63,y:height*.21};pointer={...anchor};
  ropes=Array.from({length:3},(_,r)=>Array.from({length:segmentCount+1},(_,i)=>({x:anchor.x+(r-1)*i*2,y:anchor.y+i*(r===0?8.2:r===1?5.9:11),px:anchor.x+(r-1)*i*2,py:anchor.y+i*(r===0?8.2:r===1?5.9:11)})));
}
function resize(){const box=stage.getBoundingClientRect();width=box.width;height=box.height;scale=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);reset();draw()}
function update(dt){
  clock+=dt;
  let target=inside?pointer:{x:width*.63+Math.sin(clock*.78)*width*.14,y:height*.20+Math.cos(clock*1.02)*height*.045};
  if(reducedMotion.matches)target={x:width*.63,y:height*.21};
  const blend=1-Math.exp(-24*dt);anchor.x+=(target.x-anchor.x)*blend;anchor.y+=(target.y-anchor.y)*blend;
  for(let r=0;r<count;r++){
    const points=ropes[r],length=count===1?9:(r===0?7.3:r===1?10.8:13.6),damping=Math.exp(-2.9*dt);
    points[0].x=anchor.x;points[0].y=anchor.y;
    for(let i=1;i<points.length;i++){const p=points[i],vx=(p.x-p.px)*damping,vy=(p.y-p.py)*damping;p.px=p.x;p.py=p.y;p.x+=vx+(count===3?(r-1)*100:0)*dt*dt;p.y+=vy+1050*dt*dt}
    for(let iteration=0;iteration<18;iteration++){
      points[0].x=anchor.x;points[0].y=anchor.y;
      for(let i=0;i<segmentCount;i++){
        const a=points[i],b=points[i+1],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.001,k=(d-length)/d;
        if(i===0){b.x-=dx*k;b.y-=dy*k}else{a.x+=dx*k*.5;a.y+=dy*k*.5;b.x-=dx*k*.5;b.y-=dy*k*.5}
      }
    }
  }
}
function link(x,y,angle,side=false){ctx.save();ctx.translate(x,y);ctx.rotate(angle);const metal=ctx.createLinearGradient(-3,0,3,0);metal.addColorStop(0,'#66716d');metal.addColorStop(.24,'#eef1ea');metal.addColorStop(.49,'#b6beba');metal.addColorStop(.72,'#fafbf6');metal.addColorStop(1,'#64716c');ctx.strokeStyle=metal;ctx.lineWidth=side?2.4:2;ctx.beginPath();ctx.ellipse(0,0,side?1.4:3.2,5.5,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
function draw(){
  if(!ctx||!width)return;ctx.setTransform(scale,0,0,scale,0,0);ctx.clearRect(0,0,width,height);
  if(!ready)return;
  for(let r=count-1;r>=0;r--){
    const points=ropes[r];
    for(let i=0;i<segmentCount;i++){const a=points[i],b=points[i+1],dx=b.x-a.x,dy=b.y-a.y,distance=Math.hypot(dx,dy),links=Math.max(1,Math.round(distance/6));for(let j=0;j<links;j++){const t=(j+.5)/links;link(a.x+dx*t,a.y+dy*t,-Math.atan2(dx,dy),(i*2+j)%2===0)}}
    const end=points[segmentCount],before=points[segmentCount-2];
    const angle=Math.max(-.65,Math.min(.65,-Math.atan2(end.x-before.x,end.y-before.y)*.65));
    const size=count===1?119:90;
    ctx.save();ctx.translate(end.x,end.y);ctx.rotate(angle);
    ctx.strokeStyle=dark?'#bcc7c0':'#83918a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,3,5,7,0,0,Math.PI*2);ctx.stroke();
    ctx.shadowBlur=8;ctx.shadowColor='#20312b18';ctx.shadowOffsetY=6;ctx.drawImage(bear,-size/2,5,size,size);ctx.restore();
  }
  ctx.save();ctx.translate(anchor.x,anchor.y-1);ctx.rotate(-.1);ctx.fillStyle='#fffef8';ctx.strokeStyle='#34493d';ctx.lineWidth=1.3;ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-24);ctx.lineTo(18,-7);ctx.lineTo(9,-6);ctx.lineTo(6,2);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
}
function tick(now){frame=0;if(document.hidden||!inView||!ready)return;const elapsed=last?Math.min((now-last)/1000,.06):step;last=now;accumulator+=elapsed;while(accumulator>=step){update(step);accumulator-=step}draw();if(!reducedMotion.matches)frame=requestAnimationFrame(tick)}
function resume(){last=0;accumulator=0;if(!frame&&ready&&inView&&!document.hidden)frame=requestAnimationFrame(tick)}
function settle(){for(let i=0;i<360;i++)update(step);draw()}
stage.addEventListener('pointermove',event=>{const rect=stage.getBoundingClientRect();pointer={x:Math.max(18,Math.min(width-18,(event.clientX-rect.left)*width/rect.width)),y:Math.max(25,Math.min(height-140,(event.clientY-rect.top)*height/rect.height))};inside=true;resume()},{passive:true});
stage.addEventListener('pointerleave',()=>{inside=false});stage.addEventListener('pointerup',event=>{if(event.pointerType!=='mouse')inside=false});stage.addEventListener('pointercancel',()=>{inside=false});
document.querySelectorAll('[data-count]').forEach(button=>button.addEventListener('click',()=>{count=Number(button.dataset.count);document.querySelectorAll('[data-count]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));reset();if(reducedMotion.matches)settle();resume()}));
document.querySelector('#tone-button').addEventListener('click',event=>{dark=!dark;stage.classList.toggle('dark',dark);event.currentTarget.setAttribute('aria-pressed',String(dark));event.currentTarget.setAttribute('aria-label',`미리보기 ${dark?'밝은':'어두운'} 배경으로 변경`);draw()});
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){cancelAnimationFrame(frame);frame=0;settle()}else resume()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else resume()});
new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)resume();else{cancelAnimationFrame(frame);frame=0}},{threshold:0}).observe(stage);
new ResizeObserver(resize).observe(stage);
bear.addEventListener('load',()=>{if(!ctx)return;ready=true;document.querySelector('.demo-fallback').hidden=true;reset();settle();resume()});
if(bear.complete&&bear.naturalWidth){ready=true;document.querySelector('.demo-fallback').hidden=true;reset();settle();resume()}
