(function(){
'use strict';
var IMGBB_KEY=''; /* optional: paste your imgbb API key here, or enter it on the page */
var ZW='\u200b';
var SEP={line:'────────────────────',dots:'• • • • • • • • • • •',bold:'▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬',space:ZW};
var IDS=['content','color','aName','aIcon','aUrl','title','tUrl','desc','thumb','image','fText','fIcon','ts'];
var S={fields:[],buttons:[]};
var $=function(i){return document.getElementById(i)};
var g=function(i){return $(i).value.trim()};
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function ok(u){return /^https?:\/\/\S+$/i.test(u||'')}
function md(s){
 s=esc(s).replace(/```([\s\S]*?)```/g,'<pre>$1</pre>').replace(/`([^`\n]+)`/g,'<code>$1</code>')
 .replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/__([^_]+)__/g,'<u>$1</u>').replace(/\*([^*\n]+)\*/g,'<i>$1</i>').replace(/~~([^~]+)~~/g,'<s>$1</s>')
 .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>')
 .replace(/^&gt; (.*)$/gm,'<blockquote>$1</blockquote>');
 return s.replace(/\n/g,'<br>');
}
var tt;function toast(m){var t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('show')},2800)}
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
function inp(o,k,ph,max,ta){var e=el(ta?'textarea':'input');if(!ta)e.type='text';e.placeholder=ph;if(max)e.maxLength=max;e.value=o[k]||'';e.addEventListener('input',function(){o[k]=e.value;sync()});return e}
function sel(o,k,opts,rebuild){var s=el('select');opts.forEach(function(p){var op=el('option',0,p[1]);op.value=p[0];s.appendChild(op)});s.value=o[k];s.onchange=function(){o[k]=s.value;if(rebuild)build();sync()};return s}
function ctl(arr,i){
 var w=el('span','ctl');
 [['↑',-1],['↓',1]].forEach(function(d){var b=el('button','mini',d[0]);b.type='button';b.setAttribute('aria-label',d[1]<0?'Move up':'Move down');b.onclick=function(){var j=i+d[1];if(j<0||j>=arr.length)return;var t=arr[i];arr[i]=arr[j];arr[j]=t;build();sync()};w.appendChild(b)});
 var x=el('button','mini danger','Remove');x.type='button';x.onclick=function(){arr.splice(i,1);build();sync()};w.appendChild(x);return w;
}
function build(){
 var fl=$('fieldList'),bl=$('btnList');fl.textContent='';bl.textContent='';
 S.fields.forEach(function(f,i){
  var li=el('div','li'),bar=el('div','bar');
  bar.appendChild(el('span','lbl',f.sep?'Separator':'Field '+(i+1)));bar.appendChild(ctl(S.fields,i));li.appendChild(bar);
  if(f.sep){li.appendChild(sel(f,'style',[['line','Thin line'],['dots','Dots'],['bold','Thick bar'],['space','Blank space']]))}
  else{
   li.appendChild(inp(f,'name','Field name',256));li.appendChild(inp(f,'value','Field value (markdown supported)',1024,1));
   var lab=el('label','chk'),c=el('input');c.type='checkbox';c.checked=!!f.inline;c.onchange=function(){f.inline=c.checked;sync()};
   lab.appendChild(c);lab.appendChild(document.createTextNode(' Inline'));li.appendChild(lab);
  }
  fl.appendChild(li);
 });
 S.buttons.forEach(function(b,i){
  var li=el('div','li'),bar=el('div','bar');
  bar.appendChild(el('span','lbl','Button '+(i+1)));bar.appendChild(ctl(S.buttons,i));li.appendChild(bar);
  li.appendChild(inp(b,'label','Button label',80));
  li.appendChild(sel(b,'style',[['5','Link'],['1','Primary'],['2','Secondary'],['3','Success'],['4','Danger']],true));
  li.appendChild(b.style==='5'?inp(b,'url','https://example.com'):inp(b,'id','custom_id (for bots)',100));
  bl.appendChild(li);
 });
}
function payload(){
 var e={},fl=[],p={};
 if(g('title')){e.title=g('title');if(ok(g('tUrl')))e.url=g('tUrl')}
 if(g('desc'))e.description=g('desc');
 if(g('aName')){e.author={name:g('aName')};if(ok(g('aIcon')))e.author.icon_url=g('aIcon');if(ok(g('aUrl')))e.author.url=g('aUrl')}
 S.fields.forEach(function(f){
  if(f.sep)fl.push({name:ZW,value:SEP[f.style]||SEP.line,inline:false});
  else if(f.name||f.value)fl.push({name:f.name||ZW,value:f.value||ZW,inline:!!f.inline});
 });
 if(fl.length)e.fields=fl;
 if(ok(g('thumb')))e.thumbnail={url:g('thumb')};
 if(ok(g('image')))e.image={url:g('image')};
 if(g('fText')){e.footer={text:g('fText')};if(ok(g('fIcon')))e.footer.icon_url=g('fIcon')}
 if($('ts').checked)e.timestamp=new Date().toISOString();
 var has=Object.keys(e).length>0;
 if(has)e.color=parseInt($('color').value.slice(1),16);
 if(g('content'))p.content=g('content');
 if(has)p.embeds=[e];
 var bs=S.buttons.filter(function(b){return b.label}).map(function(b,i){
  var o={type:2,style:+b.style,label:b.label};
  if(b.style==='5')o.url=b.url||'https://example.com';else o.custom_id=b.id||'btn_'+(i+1);
  return o;
 });
 if(bs.length)p.components=[{type:1,components:bs}];
 return p;
}
function render(p){
 var e=(p.embeds||[])[0],h='',n=0;
 if(p.content)h+='<div class="dc-txt">'+md(p.content)+'</div>';
 if(e){
  var col='#'+('000000'+e.color.toString(16)).slice(-6),m='',ft='';
  if(e.author){n+=e.author.name.length;m+='<div class="dc-au">'+(e.author.icon_url?'<img src="'+esc(e.author.icon_url)+'" alt="">':'')+(e.author.url?'<a href="'+esc(e.author.url)+'" target="_blank" rel="noopener">'+esc(e.author.name)+'</a>':esc(e.author.name))+'</div>'}
  if(e.title){n+=e.title.length;m+='<div class="dc-ti">'+(e.url?'<a href="'+esc(e.url)+'" target="_blank" rel="noopener">'+esc(e.title)+'</a>':esc(e.title))+'</div>'}
  if(e.description){n+=e.description.length;m+='<div class="dc-de">'+md(e.description)+'</div>'}
  if(e.fields){m+='<div class="dc-fields">';e.fields.forEach(function(f){n+=f.name.length+f.value.length;m+='<div class="dc-f'+(f.inline?' in':'')+(f.name===ZW?' sepf':'')+'">'+(f.name===ZW?'':'<b>'+md(f.name)+'</b>')+(f.value===ZW?'&nbsp;':md(f.value))+'</div>'});m+='</div>'}
  if(e.footer||e.timestamp){
   var d=new Date(),t='Today at '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2);
   if(e.footer)n+=e.footer.text.length;
   ft='<div class="dc-ft">'+(e.footer&&e.footer.icon_url?'<img src="'+esc(e.footer.icon_url)+'" alt="">':'')+(e.footer?esc(e.footer.text):'')+(e.footer&&e.timestamp?' • ':'')+(e.timestamp?t:'')+'</div>';
  }
  h+='<div class="dc-embed" style="border-left-color:'+col+'"><div class="dc-main">'+m+'</div>'+(e.thumbnail?'<img class="dc-th" src="'+esc(e.thumbnail.url)+'" alt="">':'')+(e.image?'<img class="dc-im" src="'+esc(e.image.url)+'" alt="">':'')+ft+'</div>';
 }
 if(p.components){h+='<div class="dc-btns">';p.components[0].components.forEach(function(b){h+='<span class="dc-btn s'+b.style+'">'+esc(b.label)+(b.style===5?' ↗':'')+'</span>'});h+='</div>'}
 $('pv').innerHTML=h||'<div class="dc-empty">Start typing to see your message.</div>';
 var tot=$('total');tot.textContent=n+' / 6000';tot.className='count'+(n>6000?' warn':'');
}
function sync(){var p=payload();render(p);$('json').value=JSON.stringify(p,null,2)}
function setv(i,v){var x=$(i);if(x.type==='checkbox')x.checked=!!v;else x.value=v||(i==='color'?'#7c5cff':'')}
function load(){
 var p,e;
 try{p=JSON.parse($('json').value)}catch(x){return toast('That JSON is not valid.')}
 e=(p.embeds&&p.embeds[0])||{};
 var a=e.author||{},f=e.footer||{};
 setv('content',p.content);setv('title',e.title);setv('tUrl',e.url);setv('desc',e.description);
 setv('aName',a.name);setv('aIcon',a.icon_url);setv('aUrl',a.url);
 setv('thumb',e.thumbnail&&e.thumbnail.url);setv('image',e.image&&e.image.url);
 setv('fText',f.text);setv('fIcon',f.icon_url);setv('ts',!!e.timestamp);
 setv('color',typeof e.color==='number'?'#'+('000000'+e.color.toString(16)).slice(-6):'');
 S.fields=(e.fields||[]).map(function(x){
  if(x.name===ZW){var k='line';for(var s in SEP)if(SEP[s]===x.value)k=s;return{sep:1,style:k}}
  return{name:x.name,value:x.value,inline:!!x.inline};
 });
 S.buttons=((p.components&&p.components[0]&&p.components[0].components)||[]).map(function(b){return{label:b.label||'',style:String(b.style||5),url:b.url||'',id:b.custom_id||''}});
 build();sync();toast('JSON loaded.');
}
function upload(file,target,btn){
 var key=g('apiKey')||IMGBB_KEY;
 if(!key)return toast('Add your imgbb API key first.');
 if(!/^image\//.test(file.type))return toast('Please choose an image file.');
 var fd=new FormData(),exp=$('exp').value;
 fd.append('image',file);
 btn.disabled=true;btn.textContent='Uploading…';
 fetch('https://api.imgbb.com/1/upload?key='+encodeURIComponent(key)+(exp?'&expiration='+exp:''),{method:'POST',body:fd})
 .then(function(r){return r.json()})
 .then(function(j){if(!j.success)throw new Error((j.error&&j.error.message)||'Upload failed');$(target).value=j.data.url;sync();toast('Image uploaded.')})
 .catch(function(x){toast(x.message||'Upload failed.')})
 .finally(function(){btn.disabled=false;btn.textContent='Upload'});
}
var pick={t:null,b:null};
$('file').addEventListener('change',function(){var f=this.files[0];this.value='';if(f&&pick.t)upload(f,pick.t,pick.b)});
Array.prototype.forEach.call(document.querySelectorAll('.up'),function(b){b.addEventListener('click',function(){pick={t:b.getAttribute('data-for'),b:b};$('file').click()})});
IDS.forEach(function(i){$(i).addEventListener('input',sync);$(i).addEventListener('change',sync)});
$('apiKey').value=store('canvas_imgbb')||IMGBB_KEY;
$('apiKey').addEventListener('input',function(){store('canvas_imgbb',this.value.trim())});
$('addField').onclick=function(){if(S.fields.length>=25)return toast('Discord allows 25 fields.');S.fields.push({name:'',value:'',inline:false});build();sync()};
$('addSep').onclick=function(){if(S.fields.length>=25)return toast('Discord allows 25 fields.');S.fields.push({sep:1,style:'line'});build();sync()};
$('addBtn').onclick=function(){if(S.buttons.length>=5)return toast('Discord allows 5 buttons per row.');S.buttons.push({label:'',style:'5',url:'',id:''});build();sync()};
$('copy').onclick=function(){var t=$('json').value;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){toast('JSON copied.')}).catch(function(){$('json').select();toast('Press Ctrl+C to copy.')})};
$('loadJson').onclick=load;
$('reset').onclick=function(){IDS.forEach(function(i){setv(i,'')});S.fields=[];S.buttons=[];build();sync();toast('Cleared.')};
$('send').onclick=function(){
 var u=g('hook'),p=payload(),b=this;
 if(!/^https:\/\/([a-z]+\.)?discord(app)?\.com\/api\/webhooks\//i.test(u))return toast('Enter a valid Discord webhook URL.');
 if(!p.content&&!p.embeds)return toast('Nothing to send yet.');
 if(p.components){p.components[0].components=p.components[0].components.filter(function(c){return c.style===5});if(!p.components[0].components.length)delete p.components}
 b.disabled=true;
 fetch(u+(p.components?(u.indexOf('?')<0?'?':'&')+'with_components=true':''),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)})
 .then(function(r){if(!r.ok)throw new Error('Discord returned '+r.status);toast('Sent to Discord!')})
 .catch(function(x){toast(x.message)}).finally(function(){b.disabled=false});
};
/* starter content */
setv('title','Welcome to the studio');setv('color','#7c5cff');setv('aName','Canvas');
setv('desc','Grab a **brush**, pick a color, and make something *beautiful*.\nRead the [rules](https://example.com) before you post.');
setv('fText','Powered by Canvas');setv('ts',true);
S.fields=[{name:'Showcase',value:'Share your art in #showcase',inline:true},{name:'Palettes',value:'Try /palette',inline:true},{sep:1,style:'line'},{name:'Need help?',value:'Open a ticket in #support',inline:false}];
S.buttons=[{label:'Rules',style:'5',url:'https://example.com',id:''},{label:'Verify',style:'3',url:'',id:'verify'}];
build();sync();
})();
