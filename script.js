(function(){
'use strict';
var cv=document.getElementById('paint');if(!cv)return;
var ctx=cv.getContext('2d'),dpr=Math.min(window.devicePixelRatio||1,2),W=0,H=0;
var LIFE=3500,pts=[],last=null,hue=260,running=false;
function resize(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
resize();addEventListener('resize',resize);
var brush=document.createElement('div');brush.className='brush';
brush.innerHTML='<svg width="34" height="34" viewBox="0 0 34 34"><path d="M5 29c4-1 5-4 6-6l4 4c-2 2-5 4-10 2z" fill="#ff7eb6"/><path d="M13 21l13-15a2.2 2.2 0 013 3L16 25z" fill="#7c5cff"/><path d="M13 21l3 4 2-2-3-4z" fill="#d9ccff"/></svg>';
document.body.appendChild(brush);
function add(x,y){
 hue=(hue+4)%360;
 var n=3;
 for(var i=0;i<n;i++){
  pts.push({x:x+(Math.random()-.5)*10,y:y+(Math.random()-.5)*10,r:9+Math.random()*13,h:hue+Math.random()*30,t:performance.now()});
 }
 if(pts.length>900)pts.splice(0,pts.length-900);
}
addEventListener('pointermove',function(e){
 if(e.pointerType==='touch')return;
 brush.classList.add('on');
 brush.style.transform='translate('+(e.clientX-4)+'px,'+(e.clientY-30)+'px)';
 if(last){
  var dx=e.clientX-last.x,dy=e.clientY-last.y,d=Math.hypot(dx,dy),steps=Math.max(1,Math.floor(d/7));
  for(var s=1;s<=steps;s++)add(last.x+dx*s/steps,last.y+dy*s/steps);
 }
 last={x:e.clientX,y:e.clientY};
 if(!running){running=true;requestAnimationFrame(draw)}
});
document.addEventListener('mouseleave',function(){brush.classList.remove('on');last=null});
function draw(now){
 ctx.clearRect(0,0,W,H);
 var alive=[];
 for(var i=0;i<pts.length;i++){
  var p=pts[i],age=now-p.t;
  if(age>=LIFE)continue;
  var k=1-age/LIFE,a=k*k*.32,r=p.r*(1+(1-k)*.35);
  var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
  g.addColorStop(0,'hsla('+p.h+',80%,68%,'+a+')');
  g.addColorStop(1,'hsla('+p.h+',80%,68%,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r,0,6.2832);ctx.fill();
  alive.push(p);
 }
 pts=alive;
 if(pts.length)requestAnimationFrame(draw);else running=false;
}
})();
