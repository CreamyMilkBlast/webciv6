const {test}=require('node:test');const a=require('node:assert/strict');let art;try{art=require('../render-utils.js')}catch{art={}}
// Catches fractional hex channels silently turning Canvas terrain fills black.
test('terrain shading always returns valid six-digit CSS hex colors',()=>{a.equal(typeof art.tint,'function');a.equal(art.tint('#8baf78',.5),'#8cb079');a.equal(art.tint('#ffffff',20),'#ffffff');a.equal(art.tint('#000000',-20),'#000000')});
// Every yield unit must remain represented, even above five and across line wrapping.
test('yield pips represent every unit with no numeric substitute or cap',()=>{a.equal(typeof art.yieldPips,'function');const ps=art.yieldPips({food:3,production:2,gold:7});a.equal(ps.filter(p=>p.kind==='food').length,3);a.equal(ps.filter(p=>p.kind==='production').length,2);a.equal(ps.filter(p=>p.kind==='gold').length,7);a.equal(ps.length,12);a.ok(ps.every(p=>Math.abs(p.x)<=20&&p.y>=0&&p.y<=12))});
