/* WebCiv6 map model: no DOM or rendering dependencies. All yields are unimproved. */
const AtlasModel=(()=>{
const rules=typeof CIV_RULES!=='undefined'?CIV_RULES:require('./rules.js');
const resourceById=Object.fromEntries(rules.resources.map(r=>[r.id,r]));
const keys=['food','production','gold','science','culture','faith'];
const empty=()=>Object.fromEntries(keys.map(k=>[k,0]));
const base={grassland:{food:2},plains:{food:1,production:1},desert:{},tundra:{food:1},snow:{},coast:{food:1,gold:1},lake:{food:1,gold:1},ocean:{food:1}};
const terrainIds={grassland:'TERRAIN_GRASS',plains:'TERRAIN_PLAINS',desert:'TERRAIN_DESERT',tundra:'TERRAIN_TUNDRA',snow:'TERRAIN_SNOW',coast:'TERRAIN_COAST',lake:'TERRAIN_COAST',ocean:'TERRAIN_OCEAN'};
const water=t=>['coast','ocean','lake'].includes(t.terrain);
const passable=t=>!t.mountain&&!['FEATURE_ICE'].includes(t.feature)&&!['FEATURE_ULURU','FEATURE_CRATER_LAKE'].includes(t.wonder);
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const mod=(x,n)=>(x%n+n)%n;
function neighbors(m,t){const x=t.x,y=t.y,o=y&1;return[[1,0],[o,1],[o-1,1],[-1,0],[o-1,-1],[o,-1]].map(([dx,dy])=>y+dy<0||y+dy>=m.height?null:m.tiles[(y+dy)*m.width+mod(x+dx,m.width)])}
function distance(a,b,w=44){function cube(t){const q=t.x-(t.y-(t.y&1))/2;return[q,-q-t.y,t.y]}const A=cube(a);return Math.min(...[-w,0,w].map(dx=>{const B=cube({...b,x:b.x+dx});return Math.max(...A.map((v,i)=>Math.abs(v-B[i])))}))}
function visibleResource(t,view='inspector'){if(!t.resource)return null;const r=resourceById[t.resource];return r&&!(view==='turn1'&&r.reveal)?r:null}
function tileYields(t,m=null,view='inspector'){
 const total=empty(),parts=[];const add=(name,values)=>{const v={...values};parts.push({name,values:v});for(const k of keys)total[k]+=v[k]||0};
 if(t.wonder){const w=rules.features[t.wonder];if(t.wonder==='FEATURE_ULURU')add('Uluru · impassable',{});else add(w.name,w.yields)}
 else if(t.mountain||t.feature==='FEATURE_ICE')add(t.mountain?'Mountain · impassable':'Ice · impassable',{});
 else {add(t.terrain[0].toUpperCase()+t.terrain.slice(1),base[t.terrain]);if(t.hills)add('Hills',{production:1});if(t.feature)add(rules.features[t.feature]?.name||'Feature',rules.features[t.feature]?.yields||{});const r=visibleResource(t,view);if(r)add(r.name,r.yields)}
 if(m&&!t.mountain&&!t.wonder&&t.feature!=='FEATURE_ICE')for(const n of neighbors(m,t).filter(Boolean))if(n.wonder==='FEATURE_ULURU')add('Adjacent Uluru',{culture:2,faith:2});
 return {total,parts};
}
function canPlaceResource(t,id){const r=resourceById[id];if(!r||t.mountain||t.wonder||t.feature==='FEATURE_ICE'||t.feature==='FEATURE_OASIS'||t.feature==='FEATURE_GEOTHERMAL_FISSURE'||t.feature==='FEATURE_VOLCANO')return false;
 const terrain=terrainIds[t.terrain]+(t.hills?'_HILLS':'');
 // Existing features must explicitly permit a resource; terrain-only resources need a bare tile.
 if(t.feature){const featureRule=rules.features[t.feature];if(!featureRule?.resources?.includes(id))return false;return r.placements.includes(t.feature)||r.placements.includes(terrain)}
 return r.placements.includes(terrain);
}
function freshWater(m,t){if(t.rivers.length)return true;return neighbors(m,t).filter(Boolean).some(n=>n.terrain==='lake'||n.feature==='FEATURE_OASIS'||n.wonder==='FEATURE_CRATER_LAKE')}
function appeal(m,t){if(water(t)||t.mountain)return null;let val=t.rivers.length?1:0;for(const n of neighbors(m,t).filter(Boolean)){if(n.wonder){val+=n.wonder==='FEATURE_ULURU'?4:2;continue}if(n.mountain||water(n)||n.feature==='FEATURE_FOREST'||n.feature==='FEATURE_OASIS')val++;if(['FEATURE_JUNGLE','FEATURE_MARSH','FEATURE_FLOODPLAINS','FEATURE_FLOODPLAINS_GRASSLAND','FEATURE_FLOODPLAINS_PLAINS'].includes(n.feature))val--}return val}
function movement(t){if(!passable(t))return null;return 1+(t.hills?1:0)+(['FEATURE_FOREST','FEATURE_JUNGLE','FEATURE_MARSH'].includes(t.feature)||t.wonder==='FEATURE_PANTANAL'?1:0)}
function defense(t){return(t.hills?3:0)+(['FEATURE_FOREST','FEATURE_JUNGLE','FEATURE_REEF'].includes(t.feature)?3:0)+(['FEATURE_MARSH','FEATURE_FLOODPLAINS','FEATURE_FLOODPLAINS_GRASSLAND','FEATURE_FLOODPLAINS_PLAINS'].includes(t.feature)||t.wonder==='FEATURE_PANTANAL'?-2:0)}
// Connected land and reachable workable land are deliberately distinct from geological regions.
function assignLandmasses(m){
 const groups=[];for(const t of m.tiles)t.landmass=null;
 for(const t of m.tiles)if(!water(t)&&t.landmass===null){const id=groups.length,q=[t];t.landmass=id;for(const u of q)for(const n of neighbors(m,u))if(n&&!water(n)&&n.landmass===null){n.landmass=id;q.push(n)}groups.push({id,tiles:q.map(u=>u.id),usable:q.filter(u=>passable(u)&&!u.wonder).length})}
 m.landmasses=groups;return groups;
}
function reachableLand(m,t){const seen=new Set([t.id]),q=[t];for(const u of q)for(const n of neighbors(m,u))if(n&&!water(n)&&passable(n)&&!n.wonder&&!seen.has(n.id)){seen.add(n.id);q.push(n)}return seen}
function generate(options={}){
 let last;for(let attempt=0;attempt<100;attempt++){try{return generateOnce(options,attempt)}catch(e){if(!e.message.startsWith('Generation rejected:'))throw e;last=e}}
 throw new Error('Unable to satisfy map guarantees after 100 deterministic attempts: '+last?.message);
}
function generateOnce(options={},attempt=0){
 const settings={seed:'Aurelia',type:'continents',temperature:'temperate',rainfall:'normal',sea:'standard',resources:'standard',...options};settings.seed=String(settings.seed).slice(0,64)||'Aurelia';
 const s=hash(settings.seed+(attempt?':retry:'+attempt:'')),random=rng(s),W=44,H=26;
 const noise=(x,y,salt=0)=>{const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;const u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);const h=(a,b)=>{let z=Math.imul(a+salt*47+s,374761393)^Math.imul(b+salt*93,668265263);z=Math.imul(z^z>>>13,1274126177);return((z^z>>>16)>>>0)/4294967295};return(h(ix,iy)*(1-u)+h(ix+1,iy)*u)*(1-v)+(h(ix,iy+1)*(1-u)+h(ix+1,iy+1)*u)*v};
 const m={schemaVersion:3,generatorVersion:'0.3.0',generationAttempt:attempt,ruleset:rules.ruleset,width:W,height:H,wrapX:true,settings,tiles:[],rivers:[],wonders:[],starts:[],continents:[{id:0,name:'Aurelia',color:'#dab773'},{id:1,name:'Neridia',color:'#aebcce'}]};
 const phase=random()*20,centers=settings.type==='pangaea'?[[22,13,18,10]]:settings.type==='archipelago'?[[10,13,7,7],[32,13,7,7],[4,4,3.7,2.7],[26,4,3.7,2.7],[17,22,3.7,2.7],[39,22,3.7,2.7]]:[[11,13,10,10],[33,12,10,10]];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const blob=Math.max(...centers.map(([cx,cy,rx,ry])=>1-Math.sqrt(((x-cx)/rx)**2+((y-cy)/ry)**2)));
  // Matched home-island envelopes, independently weathered coastlines, and ocean corridors.
  const island=settings.type==='archipelago';
  const elevation=blob*.72+noise((island?x%22:x)/4+phase,y/4,1)*.30+noise(x/1.6,y/1.6,5)*.08-(island&&(mod(x-Math.round(Math.sin(y*.35+phase)),22)>=20||Math.abs(y-Math.round(7+1.3*Math.sin((x%22)*.4+phase)))<=1||Math.abs(y-Math.round(19+1.3*Math.sin((x%22)*.4+phase+1)))<=1)?2:0);
  const moisture=noise(x/5+phase,y/5,2)*.75+noise(x/2,y/2,8)*.25+({arid:-.18,normal:0,wet:.18}[settings.rainfall]||0);
  const heat=1-Math.abs((y-12.5)/12.5)+noise(x/5,y/5,3)*.14+({cold:-.16,temperate:0,hot:.16}[settings.temperature]||0);
  m.tiles.push({id:y*W+x,x,y,terrain:'ocean',hills:false,mountain:false,feature:null,resource:null,wonder:null,continent:null,elevation,moisture,heat,rivers:[],cliffs:[],site:null,start:null});
 }
 const landFraction={low:.53,standard:.45,high:.36}[settings.sea]||.45;const sorted=m.tiles.map(t=>t.elevation).sort((a,b)=>b-a);const seaLine=sorted[Math.floor(W*H*landFraction)];
 for(const t of m.tiles)if(t.elevation>=seaLine){t.continent=null;t.terrain=t.heat<.16?'snow':t.heat<.35?'tundra':t.heat>.5&&t.moisture<.35?'desert':t.moisture<.55?'plains':'grassland';const rugged=noise(t.x/2.8,t.y/3.1,19);t.mountain=rugged>.72&&t.elevation>seaLine+.17;t.hills=!t.mountain&&(rugged>.53||random()<.10)}
 // Two warped geological regions on a cylindrical world. Their contact zone drives relief.
 // The sinusoidal field is periodic east-west, so the wrap seam is not a special boundary.
 const region=t=>Math.sin(2*Math.PI*(t.x+.5*(t.y&1))/W + .85*Math.sin(t.y*.29+phase) + (noise(t.x/5,t.y/4,31)-.5)*.9 + phase) >=0?0:1;
 for(const t of m.tiles)if(!water(t))t.continent=region(t);
 const contacts=m.tiles.filter(t=>!water(t)&&neighbors(m,t).some(n=>n&&!water(n)&&n.continent!==t.continent));
 for(const t of contacts){t.geologicalBoundary=true;const roll=random();t.mountain=roll<.83;t.hills=!t.mountain;}
 for(const t of m.tiles)if(!water(t)&&!t.mountain&&!t.geologicalBoundary&&neighbors(m,t).some(n=>n?.geologicalBoundary)&&random()<.65)t.hills=true;
 // Identify genuinely enclosed small water bodies before expanding the shallow coast shelf.
 const seen=new Set();for(const t of m.tiles)if(water(t)&&!seen.has(t.id)){let group=[],stack=[t],boundary=false;seen.add(t.id);while(stack.length){let u=stack.pop();group.push(u);if(u.y===0||u.y===H-1)boundary=true;for(const n of neighbors(m,u).filter(Boolean))if(water(n)&&!seen.has(n.id)){seen.add(n.id);stack.push(n)}}if(!boundary&&group.length<=9)for(const u of group)u.terrain='lake'}
 // Guarantee a few small inland freshwater lakes without constructing reservoirs or improvements.
 for(let i=0;i<6;i++){const candidates=m.tiles.filter(t=>!water(t)&&!t.mountain&&t.y>4&&t.y<21&&neighbors(m,t).filter(Boolean).every(n=>!water(n)&&!n.mountain));if(candidates.length){candidates.sort((a,b)=>{const lakes=m.tiles.filter(n=>n.terrain==='lake');const separation=t=>lakes.length?Math.min(...lakes.map(n=>distance(t,n))):0;return separation(b)-separation(a)||hash(settings.seed+a.id)-hash(settings.seed+b.id)});const t=candidates[0];t.terrain='lake';t.hills=false;t.continent=null}}
 for(const t of m.tiles)if(t.terrain==='ocean'&&neighbors(m,t).filter(Boolean).some(n=>!water(n)))t.terrain='coast';
 const coast=m.tiles.filter(t=>t.terrain==='coast');for(const t of coast)for(const n of neighbors(m,t).filter(Boolean))if(n.terrain==='ocean'&&random()<.28)n.terrain='coast';
 // Drainage on the hex VERTEX graph: rivers are connected paths on shared tile edges.
 const verts=new Map(),edges=[];
 const vertex=(x,y)=>{const key=Math.round(x*1e5)+','+Math.round(y*1e5);if(!verts.has(key))verts.set(key,{key,x,y,edges:[],coastal:false,dist:Infinity,parent:null});return verts.get(key)};
 for(const t of m.tiles)if(!water(t)){
  const cx=Math.sqrt(3)*(t.x+.5*(t.y&1)),cy=1.5*t.y;
  const vs=Array.from({length:6},(_,i)=>vertex(cx+Math.cos((-30+i*60)*Math.PI/180),cy+Math.sin((-30+i*60)*Math.PI/180)));
  neighbors(m,t).forEach((n,d)=>{if(!n||Math.abs(n.x-t.x)>2)return;const a=vs[d],b=vs[(d+1)%6];if(water(n)){a.coastal=true;b.coastal=true}if(!water(n)&&n.id>t.id){const e={a,b,t,n,d};a.edges.push(e);b.edges.push(e);edges.push(e)}});
 }
 let queue=[...verts.values()].filter(v=>v.coastal);queue.forEach(v=>v.dist=0);
 while(queue.length){queue.sort((a,b)=>b.dist-a.dist);const v=queue.pop();for(const e of v.edges){const n=e.a===v?e.b:e.a,step=1+Math.max(0,(e.t.elevation+e.n.elevation)/2-seaLine)*.8;if(n.dist>v.dist+step){n.dist=v.dist+step;n.parent={vertex:v,edge:e};if(!queue.includes(n))queue.push(n)}}}
 const sources=[...verts.values()].filter(v=>v.dist>=4&&v.dist<Infinity).sort((a,b)=>b.dist-a.dist);const usedVertices=new Set(),riverNames=['Eos','Saffron','Iris','Aster','Orion','Lyra','Selene','Cedar'];
 for(const source of sources){if(m.rivers.length>=12)break;if(usedVertices.has(source.key)||m.rivers.some(r=>Math.hypot(r.source[0]-source.x,r.source[1]-source.y)<3.5))continue;let v=source,path=[];while(v.parent&&path.length<100){const {edge:e,vertex:n}=v.parent;path.push(e);if(usedVertices.has(n.key))break;v=n}if(path.length<4)continue;const segments=[];for(const e of path){if(!e.t.rivers.includes(e.d))e.t.rivers.push(e.d);const rev=(e.d+3)%6;if(!e.n.rivers.includes(rev))e.n.rivers.push(rev);usedVertices.add(e.a.key);usedVertices.add(e.b.key);segments.push({tile:e.t.id,edge:e.d,from:[e.a.x,e.a.y],to:[e.b.x,e.b.y]})}m.rivers.push({id:m.rivers.length,name:riverNames[m.rivers.length]||('River '+(m.rivers.length+1)),source:[source.x,source.y],segments})}
 for(const t of m.tiles){if(water(t)){if(t.heat<.15&&random()<.8)t.feature='FEATURE_ICE';else if(t.terrain==='coast'&&t.heat>.58&&random()<.18)t.feature='FEATURE_REEF';continue}
  if(t.mountain){if(random()<.16)t.feature='FEATURE_VOLCANO';continue}
  if(t.rivers.length&&!t.hills&&['desert','grassland','plains'].includes(t.terrain)&&random()<.75)t.feature={desert:'FEATURE_FLOODPLAINS',grassland:'FEATURE_FLOODPLAINS_GRASSLAND',plains:'FEATURE_FLOODPLAINS_PLAINS'}[t.terrain];
  else if(t.terrain==='desert'&&!t.hills&&!t.rivers.length&&random()<.05)t.feature='FEATURE_OASIS';
  else if(t.terrain==='plains'&&t.heat>.65&&t.moisture>.52&&random()<.55)t.feature='FEATURE_JUNGLE';
  else if(['grassland','plains','tundra'].includes(t.terrain)&&t.moisture>.39&&random()<.47)t.feature='FEATURE_FOREST';
  else if(t.terrain==='grassland'&&!t.hills&&t.moisture>.58&&random()<.2)t.feature='FEATURE_MARSH';
  else if(!t.hills&&t.terrain!=='snow'&&neighbors(m,t).some(n=>n?.mountain)&&random()<.1)t.feature='FEATURE_GEOTHERMAL_FISSURE';
  if(t.hills||t.mountain)neighbors(m,t).forEach((n,d)=>{if(n&&['coast','ocean'].includes(n.terrain)&&random()<.65)t.cliffs.push(d)})
 }
 // Geothermal vents sit near ridges; allow a two-hex neighborhood so the hill ring does not exclude all flat sites.
 for(const c of m.continents){if(m.tiles.some(t=>t.continent===c.id&&t.feature==='FEATURE_GEOTHERMAL_FISSURE'))continue;const candidates=m.tiles.filter(t=>t.continent===c.id&&!water(t)&&!t.hills&&!t.mountain&&!t.feature&&!t.rivers.length&&t.terrain!=='snow'&&m.tiles.some(n=>n.mountain&&distance(t,n)<=2)).sort((a,b)=>hash(settings.seed+'vent'+a.id)-hash(settings.seed+'vent'+b.id));if(candidates.length)candidates[0].feature='FEATURE_GEOTHERMAL_FISSURE';}
 // Two natural wonders from a documented supported pool. Footprints and yields are explicit.
 const wonderPool=['FEATURE_BARRIER_REEF','FEATURE_PANTANAL','FEATURE_ULURU','FEATURE_CRATER_LAKE']; // shuffle without an engine-dependent comparator
 for(let i=wonderPool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[wonderPool[i],wonderPool[j]]=[wonderPool[j],wonderPool[i]]}
 function placeWonder(id){let candidates=m.tiles.filter(t=>t.y>2&&t.y<23&&!t.wonder&&!t.rivers.length&&(!t.feature||['FEATURE_FOREST','FEATURE_MARSH','FEATURE_REEF'].includes(t.feature))&&!neighbors(m,t).some(n=>n?.wonder));
  if(id==='FEATURE_BARRIER_REEF')candidates=candidates.filter(t=>t.terrain==='coast'&&t.heat>.5);
  else if(id==='FEATURE_ULURU')candidates=candidates.filter(t=>t.terrain==='desert'&&!t.hills&&!t.mountain);
  else if(id==='FEATURE_PANTANAL')candidates=candidates.filter(t=>t.terrain==='grassland'&&!t.hills&&!t.mountain);
  else candidates=candidates.filter(t=>!water(t)&&!t.mountain&&neighbors(m,t).filter(Boolean).every(n=>!water(n)));
  for(const t of candidates.sort((a,b)=>hash(settings.seed+a.id+id)-hash(settings.seed+b.id+id))){let footprint=[t];if(id==='FEATURE_BARRIER_REEF'){const n=neighbors(m,t).find(n=>n&&n.terrain==='coast'&&!n.wonder&&n.feature!=='FEATURE_ICE');if(!n)continue;footprint.push(n)}if(id==='FEATURE_PANTANAL'){const ns=neighbors(m,t).filter(n=>n&&n.terrain==='grassland'&&!n.hills&&!n.mountain&&!n.wonder&&!n.rivers.length&&!n.feature);if(ns.length<3)continue;footprint.push(...ns.slice(0,3))}if(m.wonders.some(w=>distance(t,m.tiles[w.tiles[0]])<7))continue;
   for(const u of footprint){u.wonder=id;u.feature=null;u.hills=false;u.mountain=false;if(id==='FEATURE_CRATER_LAKE'){u.terrain='lake';u.continent=null}}
   m.wonders.push({id,name:rules.features[id].name,tiles:footprint.map(t=>t.id)});return true}return false;
 }
 for(const id of wonderPool){if(m.wonders.length===2)break;placeWonder(id)}
 // Crater Lake is a reliable fallback when a constrained multi-tile wonder has no valid footprint.
 if(m.wonders.length<2&&!m.wonders.some(w=>w.id==='FEATURE_CRATER_LAKE'))placeWonder('FEATURE_CRATER_LAKE');
 const abundance={sparse:.13,standard:.21,abundant:.31}[settings.resources]||.21;
 // Four land luxury types per continent; sea luxuries have a separate pool, as in Civ's broad pattern.
 const landLuxury=rules.resources.filter(r=>r.kind==='Luxury'&&r.placements.some(p=>p!=='TERRAIN_COAST'&&p!=='FEATURE_REEF'));
 const luxPools=m.continents.map(c=>landLuxury.filter(r=>m.tiles.some(t=>t.continent===c.id&&canPlaceResource(t,r.id))).sort((a,b)=>hash(settings.seed+c.id+a.id)-hash(settings.seed+c.id+b.id)).slice(0,4).map(r=>r.id));
 m.luxuryPools=luxPools;
 for(const t of m.tiles){if(random()>abundance)continue;let candidates=rules.resources.filter(r=>canPlaceResource(t,r.id));candidates=candidates.filter(r=>r.kind!=='Luxury'||water(t)||luxPools[t.continent]?.includes(r.id));if(!candidates.length)continue;const pick=random();const kind=pick<.55?'Bonus':pick<.86?'Luxury':'Strategic';const filtered=candidates.filter(r=>r.kind===kind);if(filtered.length)candidates=filtered;t.resource=candidates[Math.floor(random()*candidates.length)].id}
 // Seed rare but Ancient-relevant strategics in legal positions, independent of the display's reveal mode.
 for(const id of ['RESOURCE_HORSES','RESOURCE_IRON'])for(const c of m.continents){let existing=m.tiles.filter(t=>t.continent===c.id&&t.resource===id).length;const candidates=m.tiles.filter(t=>t.continent===c.id&&!t.resource&&canPlaceResource(t,id)).sort((a,b)=>hash(settings.seed+a.id+id)-hash(settings.seed+b.id+id));while(existing<2&&candidates.length){candidates.pop().resource=id;existing++}}
 // Validate freshwater expansion sites separately from their raw tile coverage.
 const cityCandidate=t=>!water(t)&&!t.mountain&&!t.wonder&&!['snow','tundra'].includes(t.terrain)&&!['FEATURE_OASIS','FEATURE_GEOTHERMAL_FISSURE'].includes(t.feature);
 const usableRing=t=>neighbors(m,t).filter(n=>n&&!water(n)&&!n.mountain&&!n.wonder);
 const strong=n=>{const y=tileYields(n,m,'turn1').total;return y.food>=2&&y.production>=2};
 const repairable=n=>!n.resource||resourceById[n.resource].kind==='Bonus';
 // Preserve a spaced set of at least ten freshwater city locations, creating inland lakes only where necessary.
 m.settlementSites=[];
 const chooseSites=(anchors=[])=>{m.settlementSites=[...anchors];const candidates=m.tiles.filter(t=>cityCandidate(t)&&freshWater(m,t)).sort((a,b)=>hash(settings.seed+'site'+a.id)-hash(settings.seed+'site'+b.id));for(const t of candidates)if(m.settlementSites.every(id=>distance(t,m.tiles[id])>=4))m.settlementSites.push(t.id)};
 chooseSites();
 for(let attempt=0;m.settlementSites.length<10&&attempt<12;attempt++){
  const candidates=m.tiles.filter(t=>cityCandidate(t)&&!t.resource&&!t.rivers.length&&!freshWater(m,t)&&m.settlementSites.every(id=>distance(t,m.tiles[id])>=4)&&neighbors(m,t).some(n=>n&&cityCandidate(n)&&!n.resource&&!n.rivers.length&&!n.feature&&neighbors(m,n).filter(Boolean).every(u=>!water(u))));
  if(!candidates.length)break;
  candidates.sort((a,b)=>hash(settings.seed+'lake'+a.id)-hash(settings.seed+'lake'+b.id));
  const t=candidates[0],lake=neighbors(m,t).find(n=>n&&cityCandidate(n)&&!n.resource&&!n.rivers.length&&!n.feature&&neighbors(m,n).filter(Boolean).every(u=>!water(u)));
  lake.terrain='lake';lake.hills=false;lake.continent=null;lake.cliffs=[];chooseSites();
 }
 const scores=m.tiles.filter(t=>cityCandidate(t)&&freshWater(m,t)&&usableRing(t).filter(n=>strong(n)||repairable(n)).length>=2).map(t=>{const nearby=m.tiles.filter(n=>distance(t,n)<=2);let score=nearby.reduce((v,n)=>{const y=tileYields(n,m,'turn1').total;return v+y.food*1.4+y.production},0)+usableRing(t).filter(strong).length*12;return {t,score}}).sort((a,b)=>b.score-a.score||a.t.id-b.t.id);
 const landmasses=assignLandmasses(m);
 const homes=settings.type==='archipelago'?[{x:10,y:13},{x:32,y:13}].map(center=>landmasses.filter(g=>g.usable>=45&&g.tiles.some(id=>distance(m.tiles[id],center)<=2)).sort((a,b)=>b.usable-a.usable)[0]).filter(Boolean):null;
 if(homes&&homes.length<2)throw new Error('Generation rejected: missing separate home islands');
 if(homes){
  // Compare pairs rather than independently choosing the richest tile on each island.
  const pools=homes.map(g=>scores.filter(p=>p.t.landmass===g.id).slice(0,24).map(p=>{
   const area=reachableLand(m,p.t),nearby=m.tiles.filter(t=>area.has(t.id)&&distance(t,p.t)<=5);
   return {...p,size:area.size,food:nearby.reduce((v,t)=>v+tileYields(t,m,'turn1').total.food,0),production:nearby.reduce((v,t)=>v+tileYields(t,m,'turn1').total.production,0)};
  }));
  let best=null;const comparable=(a,b,limit)=>Math.max(a,b)/Math.max(1,Math.min(a,b))<=limit;
  for(const a of pools[0])for(const b of pools[1])if(distance(a.t,b.t)>=14&&comparable(a.size,b.size,1.15)&&comparable(a.food,b.food,1.25)&&comparable(a.production,b.production,1.25)&&(!best||a.score+b.score>best[0].score+best[1].score))best=[a,b];
  if(!best)throw new Error('Generation rejected: no balanced start pair');
  for(const p of best){p.t.start=m.starts.length+1;m.starts.push(p.t.id)}
 }else for(const p of scores){if(m.starts.length===2)break;if(m.starts.some(id=>distance(p.t,m.tiles[id])<14))continue;p.t.start=m.starts.length+1;m.starts.push(p.t.id)}
 if(m.starts.length<2&&!homes){const c=scores.find(p=>!p.t.start&&distance(p.t,m.tiles[m.starts[0]])>=10);if(c){c.t.start=2;m.starts.push(c.t.id)}}
 for(const id of m.starts){const t=m.tiles[id];let good=usableRing(t).filter(strong).length;const candidates=usableRing(t).filter(n=>!strong(n)&&repairable(n)).sort((a,b)=>Number(!!a.resource)-Number(!!b.resource)||a.id-b.id);while(good<2&&candidates.length){const n=candidates.shift();n.terrain='grassland';n.hills=true;n.feature='FEATURE_FOREST';if(n.resource&&!canPlaceResource(n,n.resource))n.resource=null;good++;}if(!freshWater(m,t)||usableRing(t).filter(strong).length<2)throw new Error('Generation rejected: start validation failed');}
 chooseSites(m.starts);
 if(m.starts.length!==2||m.settlementSites.length<6)throw new Error('Generation rejected: insufficient valid settlement sites');
 m.startGuarantees={freshWater:true,firstRing:{minimumTiles:2,minimumFood:2,minimumProduction:2,visibility:'turn1',improvements:false},minimumSpacedFreshwaterSites:6,settlementSpacing:4};
 // All terrain edits are complete: refresh IDs before evaluating whole starting territories.
 assignLandmasses(m);
 if(settings.type==='archipelago'){
  const starts=m.starts.map(id=>m.tiles[id]),areas=starts.map(t=>reachableLand(m,t));
  const ratio=values=>Math.max(...values)/Math.max(1,Math.min(...values));
  const reject=reason=>{throw new Error('Generation rejected: '+reason)};
  if(starts[0].landmass===starts[1].landmass)reject('merged starting islands');
  const usableLand=areas.map(a=>a.size);
  if(ratio(usableLand)>1.15)reject('unequal reachable land');
  const totalLand=starts.map(t=>m.landmasses[t.landmass].usable);
  if(ratio(totalLand)>1.15)reject('unequal home island area');
  const citySites=starts.map((t,p)=>{
   // Anchor each independent packing at its capital; all sites stay in the reachable territory.
   const ids=[t.id],candidates=m.tiles.filter(n=>areas[p].has(n.id)&&cityCandidate(n)&&freshWater(m,n)).sort((a,b)=>hash(settings.seed+'expansion'+a.id)-hash(settings.seed+'expansion'+b.id));
   for(const n of candidates)if(ids.every(id=>distance(n,m.tiles[id])>=4))ids.push(n.id);
   return ids;
  });
  if(citySites.some(ids=>ids.length<3))reject('fewer than three freshwater cities on a home island');
  // Balance cumulative starting territory yields, not only the repaired first ring.
  const nearby=starts.map((t,p)=>m.tiles.filter(n=>areas[p].has(n.id)&&distance(t,n)<=5));
  let food=nearby.map(ts=>ts.reduce((v,t)=>v+tileYields(t,m,'turn1').total.food,0));
  let production=nearby.map(ts=>ts.reduce((v,t)=>v+tileYields(t,m,'turn1').total.production,0));
  if(ratio(food)>1.25||ratio(production)>1.25)reject('unequal nearby food or production');
  // Place missing strategics legally on the same reachable home island, within eight hexes.
  for(let p=0;p<2;p++)for(const id of ['RESOURCE_HORSES','RESOURCE_IRON']){
   if(m.tiles.some(t=>areas[p].has(t.id)&&distance(t,starts[p])<=8&&t.resource===id))continue;
   const candidates=m.tiles.filter(t=>areas[p].has(t.id)&&distance(t,starts[p])<=8&&!t.start&&!t.wonder&&(!t.resource||resourceById[t.resource].kind==='Bonus')&&canPlaceResource(t,id)).sort((a,b)=>Number(!!a.resource)-Number(!!b.resource)||distance(a,starts[p])-distance(b,starts[p])||a.id-b.id);
   // Avoid overwriting a first-ring yield resource; an unrevealed strategic cannot replace it fairly.
   const chosen=candidates.find(t=>distance(t,starts[p])>1);
   if(!chosen)reject('no legal nearby strategic position');chosen.resource=id;
  }
  food=nearby.map(ts=>ts.reduce((v,t)=>v+tileYields(t,m,'turn1').total.food,0));
  production=nearby.map(ts=>ts.reduce((v,t)=>v+tileYields(t,m,'turn1').total.production,0));
  if(ratio(food)>1.25||ratio(production)>1.25)reject('strategic repairs changed nearby yield balance');
  const otherIslands=m.landmasses.filter(g=>!starts.some(t=>t.landmass===g.id)&&g.usable>=4);
  if(!otherIslands.length)reject('missing expansion islands');
  const islandDistance=starts.map((t,p)=>Math.min(...otherIslands.flatMap(g=>g.tiles.map(id=>Math.min(...m.tiles.filter(u=>areas[p].has(u.id)).map(u=>distance(u,m.tiles[id])))))));
  if(Math.abs(islandDistance[0]-islandDistance[1])>2)reject('unequal access to additional islands');
  m.settlementSites=[...citySites[0],...citySites[1]];
  for(const id of [...new Set(m.tiles.filter(t=>cityCandidate(t)&&freshWater(m,t)).map(t=>t.id))])if(m.settlementSites.every(other=>distance(m.tiles[id],m.tiles[other])>=4))m.settlementSites.push(id);
  if(m.settlementSites.some((id,i)=>m.settlementSites.slice(i+1).some(other=>distance(m.tiles[id],m.tiles[other])<4)))reject('cross-island city spacing');
  m.balance={valid:true,usableLand,totalLand,food,production,citySites,islandDistance,limits:{landRatio:1.15,nearbyYieldRatio:1.25,minimumCities:3,citySpacing:4,strategicRadius:8,islandDistanceDifference:2}};
  m.startGuarantees.archipelago=m.balance.limits;
 }
 for(const t of m.tiles){if(water(t)||!passable(t)||t.wonder||t.start||t.resource||['FEATURE_OASIS','FEATURE_GEOTHERMAL_FISSURE'].includes(t.feature))continue;const d=Math.min(...m.starts.map(id=>distance(t,m.tiles[id])));if(d>3&&random()<.025&&!m.tiles.some(n=>n.site&&distance(t,n)<3))t.site='village';else if(d>6&&random()<.012&&!m.tiles.some(n=>n.site&&distance(t,n)<4))t.site='camp'}
 for(const t of m.tiles){t.rivers.sort();t.cliffs.sort();t.yields=tileYields(t,m,'inspector').total;t.freshWater=freshWater(m,t);t.appeal=appeal(m,t);t.movement=movement(t);t.defense=defense(t);delete t.moisture;delete t.heat;delete t.elevation}
 return m;
}
return{rules,resourceById,keys,water,passable,neighbors,distance,hash,rng,visibleResource,tileYields,canPlaceResource,freshWater,appeal,movement,defense,generate};
})();
if(typeof module!=='undefined')module.exports=AtlasModel;
