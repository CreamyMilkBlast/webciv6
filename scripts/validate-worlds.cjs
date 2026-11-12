const M=require('../model'),a=require('node:assert/strict');
let count=0,maxAttempt=0,maxMs=0;const configs=[];
for(const temperature of ['cold','temperate','hot'])for(const rainfall of ['arid','normal','wet'])for(const sea of ['low','standard','high'])for(const resources of ['sparse','standard','abundant'])configs.push({type:'archipelago',temperature,rainfall,sea,resources});
for(const type of ['continents','pangaea'])for(const sea of ['low','standard','high'])for(const temperature of ['cold','temperate','hot'])configs.push({type,sea,temperature});
for(const c of configs){const started=Date.now(),m=M.generate({...c,seed:'sweep-'+count});maxMs=Math.max(maxMs,Date.now()-started);maxAttempt=Math.max(maxAttempt,m.generationAttempt);a.equal(m.starts.length,2);a.equal(m.wonders.length,2);
for(const id of m.starts){const t=m.tiles[id];a.ok(M.freshWater(m,t));a.ok(M.neighbors(m,t).filter(n=>n&&!M.water(n)&&M.passable(n)&&!n.wonder&&M.tileYields(n,m,'turn1').total.food>=2&&M.tileYields(n,m,'turn1').total.production>=2).length>=2)}
for(const t of m.tiles){if(t.resource)a.ok(M.canPlaceResource(t,t.resource));for(const d of t.rivers)a.ok(M.neighbors(m,t)[d]?.rivers.includes((d+3)%6));if(!M.water(t))a.ok(Number.isInteger(t.landmass));}
for(const id of m.settlementSites)for(const other of m.settlementSites)if(id!==other)a.ok(M.distance(m.tiles[id],m.tiles[other])>=4);
if(c.type==='archipelago'){a.ok(m.balance.valid);a.notEqual(...m.starts.map(id=>m.tiles[id].landmass));for(const k of ['usableLand','totalLand'])a.ok(Math.max(...m.balance[k])/Math.min(...m.balance[k])<=1.15);for(const k of ['food','production'])a.ok(Math.max(...m.balance[k])/Math.min(...m.balance[k])<=1.25);a.ok(m.balance.citySites.every(ids=>ids.length>=3));a.ok(Math.abs(m.balance.islandDistance[0]-m.balance.islandDistance[1])<=2)}
count++;if(count%20===0)console.log('Validated',count,'worlds');}
console.log(JSON.stringify({worlds:count,starts:count*2,maxAttempt,maxGenerationMs:maxMs}));
