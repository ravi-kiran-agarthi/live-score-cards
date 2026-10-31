(function(){
"use strict";
var L=window.LSC,SB="https://site.api.espn.com/apis/site/v2/sports/",
P={nfl:"football/nfl",nba:"basketball/nba",wnba:"basketball/wnba",mlb:"baseball/mlb"},
RD={
nfl:[["Wild Card",/wild/i],["Divisional",/divis/i],["Conference",/conf/i],["Super Bowl",/super/i]],
nba:[["First Round",/1st|first/i],["Semifinals",/semi/i],["Conf. Finals",/\bfinals\b/i],["NBA Finals",/nba finals/i]],
mlb:[["Wild Card",/wild|[an]lwc/i],["Division Series",/division|[an]lds/i],["Championship Series",/champ|[an]lcs/i],["World Series",/world/i]],
wnba:[["First Round",/1st|first/i],["Semifinals",/semi/i],["WNBA Finals",/\bfinals\b/i]]},
SD={nfl:["AFC","NFC"],nba:["East","West"],mlb:["AL","NL"]},
EX={nfl:[3,2,1,1],nba:[4,2,1,1],mlb:[2,2,1,1],wnba:[4,2,1]},
TOP={nfl:7,mlb:6,nba:8,wnba:8},
P0={nfl:[[1,6],[2,5],[3,4]],mlb:[[2,5],[3,4]],nba:[[0,7],[3,4],[2,5],[1,6]],wnba:[[0,7],[3,4],[2,5],[1,6]]},
P1={nfl:[[0,-1],[-1,-1]],mlb:[[0,-1],[1,-1]]},
cur,timer,tok=0,sig="",el=L.el,
old=new Date(Date.now()-2*864e5).toISOString().slice(0,10).replace(/-/g,"");
var st=document.createElement("style");
st.textContent=".bk{display:flex;gap:40px;overflow-x:auto;scroll-snap-type:x proximity;padding:4px 0 12px}.bcol{flex:0 0 240px;display:flex;flex-direction:column;scroll-snap-align:start}.bk>:first-child{margin-left:auto}.bk>:last-child{margin-right:auto}.bcol h3{height:24px;line-height:24px;overflow:hidden;white-space:nowrap}.bcol h3.fin{font-size:.9rem;font-weight:800;color:#b45309}@media(prefers-color-scheme:dark){:root:not([data-theme=light]) .bcol h3.fin{color:#fbbf24}}:root[data-theme=dark] .bcol h3.fin{color:#fbbf24}.bcol h3{text-align:center;font-size:.75rem;color:var(--mut);margin:0 0 8px;text-transform:uppercase;letter-spacing:.04em}.bcol ol{list-style:none;margin:0;padding:0;flex:1;display:flex;flex-direction:column}.sl{flex:1 1 0;display:flex;align-items:center;position:relative;padding:6px 0}.sl .bc{width:100%}.bc{position:relative;background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:10px 12px}.bc.lv{border-color:var(--live)}.bc.tbd>*{opacity:.5}.bc .t i{font-size:1.1rem}.bf{color:var(--mut);font-size:.75rem;line-height:1.3;min-height:1.3em;margin-top:8px;padding-top:8px;border-top:1px solid var(--bd);overflow-wrap:anywhere}.bc small{color:var(--mut);font-weight:400;margin-left:6px}.bm{color:var(--mut);font-size:.72rem;margin-bottom:4px;min-height:1.2em}.lv .bm{color:var(--live);font-weight:600}.bn{color:var(--mut);font-size:.85rem;margin:12px 0}.lf .sl:after,.rt .sl:after{content:'';position:absolute;top:50%;width:20px;border-top:2px solid var(--mut)}.lf .sl:after{left:100%}.rt .sl:after{right:100%}.lf .sl:before,.rt .sl:before{content:'';position:absolute;width:0;border-left:2px solid var(--mut)}.lf .sl:before{left:calc(100% + 18px)}.rt .sl:before{right:calc(100% + 18px)}.sl:nth-child(odd):before{top:50%;bottom:0}.sl:nth-child(even):before{top:0;bottom:50%}.il .bc:before,.ir .bc:after{content:'';position:absolute;top:50%;width:20px;border-top:2px solid var(--mut)}.il .bc:before{right:100%}.ir .bc:after{left:100%}.sl:only-child:before{display:none}";
st.textContent+=".tm{margin:8px 0 24px}.tm h3{font-size:.95rem;margin:16px 0 8px}.tg{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}.tg div{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:10px 12px}.tg li img{vertical-align:middle;margin:0 6px 2px 0;object-fit:contain}.lgs{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,400px),1fr));gap:8px 32px;align-items:start}.tw{overflow-x:auto}.st{width:100%;border-collapse:collapse;font-size:.85rem}.st th,.st td{padding:6px 8px;text-align:right;white-space:nowrap}.st th:nth-child(2),.st td:nth-child(2){text-align:left;width:100%}.st td img{vertical-align:middle;margin:0 6px 2px 0}.st th{color:var(--mut);font-size:.75rem}.st tr+tr td{border-top:1px solid var(--bd)}.tg li{display:grid;grid-template-columns:subgrid;grid-column:1/-1;align-items:center;counter-increment:n}.tg li:before{content:counter(n) '.';text-align:right;color:var(--mut)}.tg li span{overflow-wrap:anywhere}.tg li i{width:20px}.rc{color:var(--mut);font-size:.8rem;text-align:right;white-space:nowrap}.tg li img{margin:0}.tg h4{margin:0 0 6px;font-size:.8rem;color:var(--mut)}.tg ol{margin:0;padding:0;list-style:none;counter-reset:n;display:grid;grid-template-columns:1.8em 20px 1fr auto;column-gap:8px;font-size:.85rem;line-height:1.6}";
document.head.appendChild(st);
var SL=[["eng.1","Premier League"],["esp.1","La Liga"],["ger.1","Bundesliga"],["fra.1","Ligue 1"],["uefa.champions","Champions League"]],SS,sm,sbusy;
function byRec(a,b){return b.sv-a.sv||String(a.displayName).localeCompare(b.displayName)}
function stat(e,n){for(var i=0;i<e.stats.length;i++)if(e.stats[i].name===n)return e.stats[i].displayValue;return""}
function lgo(t){var l=t.logos&&t.logos[0]&&t.logos[0].href;return l?'<img src="'+esc(l)+'" width=20 height=20 loading=lazy alt="">':"<i></i>"}
function ucl(){
  el.innerHTML='<p class="bn">Loading…</p>';
  J(SB+"soccer/uefa.champions/scoreboard").then(function(j){
    var en=(((j.leagues||[])[0]||{}).calendar||[])[0],es=en&&en.entries||[],k,i,f=function(d){return new Date(d).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric",timeZone:"UTC"})};
    for(i=0;i<es.length;i++)if(/knockout/i.test(es[i].label)){k=es[i];break}
    if(!sm)return;
    el.innerHTML='<p class="bn">'+(k?(new Date(k.startDate)>new Date()?"Knockout rounds start "+f(k.startDate)+". The bracket appears here then.":"Knockout rounds are underway. Today's games are in Live."):"Knockout dates not announced yet.")+"</p>";
  }).catch(function(){if(sm)el.innerHTML='<p class="bn">Could not load dates. Try again shortly.</p>'});
}
function soc(mode){
  sm=mode;
  if(mode==="ucl")return ucl();
  if(SS)return paintS();
  el.innerHTML='<p class="bn">Loading…</p>';
  if(sbusy)return;sbusy=1;
  Promise.all(SL.map(function(l){return J("https://site.api.espn.com/apis/v2/sports/soccer/"+l[0]+"/standings").then(function(j){return(j.children||[]).map(function(c){return[c.name,(c.standings||{}).entries||[]]})}).catch(function(){return[]})})).then(function(r){
    sbusy=0;SS=r;if(sm)paintS();
  });
}
function paintS(){
  var h="";
  SL.forEach(function(l,i){
    var gs=SS[i];if(!gs.length)return;
    h+="<div class=lg><h3>"+esc(l[1])+"</h3>";
    if(sm==="teams"){
      var a=[];gs.forEach(function(g){g[1].forEach(function(e){var t=e.team||{};t.rc=stat(e,"overall");t.sv=(+stat(e,"points")||0)+(parseInt(stat(e,"pointDifferential"),10)||0)/1e3;a.push(t)})});
      a.sort(byRec);
      h+="<div class=tg><div><ol>"+a.map(function(t){return"<li>"+lgo(t)+"<span>"+esc(t.displayName)+"</span><span class=rc>"+esc(t.rc)+"</span></li>"}).join("")+"</ol></div></div>";
    }else gs.forEach(function(g){
      var es=g[1].slice().sort(function(x,y){return(+stat(x,"rank"))-(+stat(y,"rank"))});
      h+='<div class=tw><table class=st><thead><tr><th>#<th>Team<th>P<th>W<th>D<th>L<th>GD<th>Pts<tbody>'+es.map(function(e){var t=e.team||{};return"<tr><td>"+stat(e,"rank")+"<td>"+lgo(t)+esc(t.displayName)+"<td>"+stat(e,"gamesPlayed")+"<td>"+stat(e,"wins")+"<td>"+stat(e,"ties")+"<td>"+stat(e,"losses")+"<td>"+stat(e,"pointDifferential")+"<td><b>"+stat(e,"points")+"</b>"}).join("")+"</table></div>";
    });
    h+="</div>";
  });
  el.innerHTML='<section class="tm">'+(sm==="teams"?"<h2>Teams by league</h2>":"<h2>Standings</h2>")+"<div class=lgs>"+h+"</div></section>";
}
var TM={},tsp;
function teams(sp){
  if(TM[sp]!=null)return;TM[sp]="";
  J("https://site.api.espn.com/apis/v2/sports/"+P[sp]+"/standings?level=3").then(function(j){
    var h="";
    (j.children||[]).forEach(function(c){
      var ds=c.children||[{name:"",standings:c.standings}];
      h+="<h3>"+esc(c.name)+"</h3><div class=tg>"+ds.map(function(d){
        return"<div>"+(d.name?"<h4>"+esc(d.name)+"</h4>":"")+"<ol>"+((d.standings||{}).entries||[]).map(function(e){var t=e.team||{};t.rc=stat(e,"overall")||stat(e,"wins")+"-"+stat(e,"losses");t.sv=+stat(e,"winPercent")||0;return t}).sort(byRec).map(function(t){var l=t.logos&&t.logos[0]&&t.logos[0].href;return"<li>"+(l?'<img src="'+esc(l)+'" width=20 height=20 loading=lazy alt="">':"<i></i>")+"<span>"+esc(t.displayName)+"</span><span class=rc>"+esc(t.rc)+"</span></li>"}).join("")+"</ol></div>"}).join("")+"</div>"});
    TM[sp]=h?'<section class="tm"><h2>Conferences, divisions and teams</h2>'+h+"</section>":"";
    if(tsp===sp)showT(sp);
  }).catch(function(){TM[sp]=null;if(tsp===sp)showT(sp)});
}
function showT(sp){el.innerHTML=TM[sp]||(TM[sp]===null?'<p class="bn">Could not load teams.</p>':'<p class="bn">Loading teams…</p>')}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function J(u){return fetch(u,{cache:"no-store"}).then(function(r){if(!r.ok)throw 0;return r.json()})}
function rd(sp,h){var a=RD[sp];for(var i=a.length;i--;)if(a[i][1].test(h||""))return i;return -1}
function norm(sp,e){
  var c=e.competitions[0],n=(c.notes||[])[0],sr=c.series,w={};
  if(sr&&sr.competitors)sr.competitors.forEach(function(x){w[x.id]=x.wins});
  return{id:e.id,d:e.date,st:e.status.type.state,det:e.status.type.shortDetail||"",post:!!e.season&&e.season.slug==="post-season",
    r:rd(sp,n&&n.headline),sm:sr&&sr.summary||"",
    t:c.competitors.slice().sort(function(a,b){return a.homeAway===b.homeAway?0:a.homeAway==="away"?-1:1}).map(function(x){var t=x.team||{};return{a:t.abbreviation||"TBD",f:t.displayName||"",l:t.logo||"",s:x.score,w:w[x.id],k:!!x.winner}})}
}
function day(sp,ds){
  var k="bk1:"+sp+":"+ds,c;
  try{c=localStorage.getItem(k)}catch(e){}
  if(c)return Promise.resolve(JSON.parse(c));
  return J(SB+P[sp]+"/scoreboard?dates="+ds).then(function(j){
    var ev=(j.events||[]).map(function(e){return norm(sp,e)});
    if(ds<old&&ev.length&&ev.every(function(e){return e.st==="post"}))try{localStorage.setItem(k,JSON.stringify(ev))}catch(e){}
    return ev;
  }).catch(function(){return[]});
}
function loadNfl(){
  return Promise.all([1,2,3,5].map(function(w){return J(SB+P.nfl+"/scoreboard?seasontype=3&week="+w).then(function(j){return(j.events||[]).map(function(e){return norm("nfl",e)})}).catch(function(){return[]})})).then(function(a){return[].concat.apply([],a)});
}
function loadDays(sp,part){
  return J(SB+P[sp]+"/scoreboard").then(function(j){
    var cal=((j.leagues||[{}])[0].calendar||[]).map(function(x){return String(x).slice(0,10).replace(/-/g,"")}),
    an=((j.day||{}).date||"").replace(/-/g,""),
    out=(j.events||[]).map(function(e){return norm(sp,e)});
    if(out.length&&!out.some(function(e){return e.post}))return out;
    var past=[],pd=new Date((an?an.slice(0,4)+"-"+an.slice(4,6)+"-"+an.slice(6,8):new Date().toISOString().slice(0,10))+"T12:00:00Z");
    for(var q=0;q<70;q++){pd=new Date(pd-864e5);past.push(pd.toISOString().slice(0,10).replace(/-/g,""))}
    var fut=cal.filter(function(d){return d>an}).slice(0,8);
    function batch(ds){return Promise.all(ds.map(function(d){return day(sp,d)}))}
    function back(i){
      if(i>=past.length||i>=70)return;
      return batch(past.slice(i,i+6)).then(function(r){
        var stop=0;
        r.forEach(function(ev){if(ev.length&&!ev.some(function(e){return e.post}))stop=1;else out=out.concat(ev.filter(function(e){return e.post}))});
        part(out);
        if(!stop)return back(i+6);
      });
    }
    return batch(fut).then(function(r){
      r.forEach(function(ev){out=out.concat(ev.filter(function(e){return e.post}))});
      part(out);return back(0);
    }).then(function(){return out});
  });
}
function real(sp,evs){
  var S={},arr=[],seen={};
  evs.forEach(function(e){
    if(seen[e.id]||e.r<0||!e.post)return;seen[e.id]=1;
    if(e.t.some(function(x){return x.a==="TBD"}))return;
    var k=sp==="nfl"?e.id:e.r+"|"+e.t.map(function(x){return x.a}).sort().join();
    if(!S[k])arr.push(S[k]={r:e.r,ev:[]});
    S[k].ev.push(e);
  });
  return arr.map(function(s){
    s.ev.sort(function(a,b){return a.d<b.d?-1:1});
    var lv=s.ev.filter(function(e){return e.st==="in"})[0],last=lv||s.ev[s.ev.length-1],ws=last.t[0].w!=null,m;
    m=lv?"● LIVE · "+lv.det+(ws?" · "+lv.t[0].a+" "+lv.t[0].s+"–"+lv.t[1].a+" "+lv.t[1].s:""):(last.sm||last.det);
    return{r:s.r,live:!!lv,m:m,o:s.ev[0].d,t:last.t.map(function(x){var sw=ws?/wins/i.test(last.sm)&&x.w>=Math.max(last.t[0].w,last.t[1].w):last.st==="post"&&x.k;return{a:x.a,f:x.f,l:x.l,k:!lv&&sw,v:x.w!=null?x.w:(last.st==="pre"?"":x.s)}})};
  });
}
function sideOf(sp,c){
  var sd=SD[sp];
  for(var i=0;i<c.t.length;i++){var x=sd.indexOf(String(L.side(sp,c.t[i].a)).split(/[ ·]/)[0]);if(x>=0)return x}
  return -1;
}
function fill(sp,cols){
  var rn=RD[sp].length;
  for(var r=0;r<rn;r++)cols[r].forEach(function(a){while(a.length<EX[sp][r])a.push({tbd:1})});
  return cols;
}
function place(sp,arr){
  var rn=RD[sp].length,sd=SD[sp],cols=[];
  for(var r=0;r<rn;r++)cols[r]=sd&&r<rn-1?[[],[]]:[[]];
  arr.sort(function(a,b){return a.o<b.o?-1:1}).forEach(function(c){
    var i=0;
    if(sd&&c.r<rn-1){i=sideOf(sp,c);if(i<0)i=cols[c.r][0].length<=cols[c.r][1].length?0:1}
    cols[c.r][i].push(c);
  });
  return fill(sp,cols);
}
function proj(sp){
  return J("https://site.api.espn.com/apis/v2/sports/"+P[sp]+"/standings?level=2").then(function(j){
    var cf=(j.children||[]).map(function(c){return((c.standings||{}).entries||[]).map(function(e){
      var s={},t=e.team||{};(e.stats||[]).forEach(function(x){s[x.name]=x.value});
      return{a:t.abbreviation,f:t.displayName||"",l:t.logos&&t.logos[0]&&t.logos[0].href||"",sd:s.playoffSeed||99,w:s.winPercent||0}
    }).sort(function(a,b){return a.sd-b.sd||b.w-a.w})});
    if(!SD[sp])cf=[[].concat.apply([],cf).sort(function(a,b){return b.w-a.w})];
    var rn=RD[sp].length,cols=[],top=TOP[sp];
    for(var r=0;r<rn;r++)cols[r]=SD[sp]&&r<rn-1?[[],[]]:[[]];
    function mk(t,n){return t?{a:t.a,f:t.f,l:t.l,v:"",n:n+1}:{a:"TBD",v:""}}
    cf.forEach(function(ts,i){
      ts=ts.slice(0,top);
      [P0[sp],P1[sp]||[]].forEach(function(pp,r){pp.forEach(function(p){
        var x=p[0]<0?null:ts[p[0]],y=p[1]<0?null:ts[p[1]];
        cols[r][i].push({r:r,m:"Projected",t:[mk(x,p[0]),mk(y,p[1])]});
      })});
    });
    return fill(sp,cols);
  });
}
function row(t){
  return'<div class="t"><span>'+(t.l?'<img loading="lazy" width="24" height="24" alt="" src="'+esc(t.l)+'">':"")+esc(t.a)+(t.k?" 🎉":"")+(t.n?"<small>#"+t.n+"</small>":"")+"</span><i>"+esc(t.v)+"</i></div>";
}
function card(c){
  if(c.bye)return'<li class="sl"><div class="bc tbd"><div class="bm">Bye</div><div class="t"><span>#1 seed</span></div><div class="t">&nbsp;</div><div class="bf"></div></div></li>';
  if(c.tbd)return'<li class="sl"><div class="bc tbd"><div class="bm">TBD</div><div class="t"><span>TBD</span></div><div class="t"><span>TBD</span></div><div class="bf"></div></div></li>';
  return'<li class="sl"><div class="bc'+(c.live?" lv":"")+'"><div class="bm">'+esc(c.m)+"</div>"+row(c.t[0])+row(c.t[1])+'<div class="bf">'+esc(c.t.map(function(x){return x.f}).filter(Boolean).join(" vs "))+"</div></div></li>";
}
function col(h,cs,cl,fin){
  if(/\b(lf|rt)\b/.test(cl)&&cs.length>1&&cs.length%2)cs=[{bye:1}].concat(cs);
  return'<section class="bcol '+cl+'"><h3'+(fin?' class=fin><span aria-hidden=true>\uD83C\uDF8A</span> '+esc(h)+' <span aria-hidden=true>\uD83C\uDF8A</span>':'>'+esc(h))+"</h3><ol>"+cs.map(card).join("")+"</ol></section>"}
function paint(sp,cols,live){
  
  var rn=RD[sp].length,sd=SD[sp],h="",r;
  if(sd){
    for(r=0;r<rn-1;r++)h+=col(sd[0]+" "+RD[sp][r][0],cols[r][0],"lf"+(r?" il":""));
    h+=col(RD[sp][rn-1][0],cols[rn-1][0],"il ir",1);
    for(r=rn-2;r>=0;r--)h+=col(sd[1]+" "+RD[sp][r][0],cols[r][1],"rt"+(r?" ir":""));
  }else for(r=0;r<rn;r++)h+=col(RD[sp][r][0],cols[r][0],(r<rn-1?"lf":"")+(r?" il":""),r===rn-1);
  h='<p class="bn">'+(live?"Live bracket · updates automatically":"Projected from current standings. Goes live when the playoffs start.")+'</p><div class="bk">'+h+"</div>";
  if(h===sig)return;
  sig=h;
  var o=el.querySelector(".bk"),sl=o?o.scrollLeft:0;
  el.innerHTML=h;
  el.querySelector(".bk").scrollLeft=sl;
}
function run(){
  var sp=cur,tk=++tok;
  function ok(){return sp===cur&&tk===tok}
  function tryReal(evs){var a=real(sp,evs);if(a.length&&ok())paint(sp,place(sp,a),1);return a.length}
  (sp==="nfl"?loadNfl():loadDays(sp,function(e){if(ok())tryReal(e)})).then(function(evs){
    if(!ok()||tryReal(evs))return;
    return proj(sp).then(function(c){if(ok())paint(sp,c,0)});
  }).catch(function(){if(ok()&&!sig)el.innerHTML='<p class="bn">Could not load bracket. Retrying…</p>'});
}
window.BK={
  ucl:function(){cur=null;tsp=null;clearInterval(timer);soc("ucl")},
  table:function(sp){cur=null;tsp=null;clearInterval(timer);soc("table")},
  teams:function(sp){if(sp==="soccer"){cur=null;clearInterval(timer);return soc("teams")}cur=null;tsp=sp;clearInterval(timer);if(TM[sp]===null)TM[sp]=undefined;showT(sp);teams(sp)},
  show:function(sp){cur=sp;sig="";el.innerHTML='<p class="bn">Loading bracket…</p>';clearInterval(timer);run();timer=setInterval(function(){if(!document.hidden)run()},30000)},
  hide:function(){cur=null;tsp=null;sm=null;clearInterval(timer)}
};
})();
