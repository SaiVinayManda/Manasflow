import fs from 'node:fs/promises';
import path from 'node:path';
const origin=process.env.MANASFLOW_SOURCE_ORIGIN;if(!origin)throw new Error('Set MANASFLOW_SOURCE_ORIGIN before collecting reference assets.');const dir='public/sites/manasflow/pages';await fs.mkdir(dir,{recursive:true});
const queue=new Map();
for(const file of ['temp/catalog-asset-requests.json','temp/linked-pages/industry-case-assets.json']){try{for(const a of JSON.parse(await fs.readFile(file,'utf8')))queue.set(a.url,a.local);}catch{}}
for(const file of ['ai-staff-augmentation-browserbase.webp','engineer-placement-browserbase.webp'])queue.set(`${origin}/images/generated/${file}`,`${dir}/${file}`);
for(const file of ['sage.png','wonderbox.png','neoday.png','xgrowth.png','arcads.png','argil.svg','earleads.png','justrussel.svg'])queue.set(`${origin}/clients/${file}`,`${dir}/${file}`);
try{for(const a of JSON.parse(await fs.readFile('temp/linked-pages/detail-asset-requests.json','utf8')))queue.set(a.url,a.local);}catch{}
const results=[];let cursor=0;const jobs=[...queue];
await Promise.all(Array.from({length:10},async()=>{while(cursor<jobs.length){const[url,local]=jobs[cursor++];try{try{const stat=await fs.stat(local);if(stat.size>50){results.push({url,local,cached:true});continue;}}catch{}const r=await fetch(url);if(!r.ok)throw new Error(`HTTP ${r.status}`);const bytes=Buffer.from(await r.arrayBuffer());await fs.mkdir(path.dirname(local),{recursive:true});await fs.writeFile(local,bytes);results.push({url,local,bytes:bytes.length,type:r.headers.get('content-type')});}catch(error){results.push({url,local,error:String(error)});}}}));
await fs.mkdir('docs/research/manasflow/linked-pages',{recursive:true});await fs.writeFile('docs/research/manasflow/linked-pages/asset-map.json',JSON.stringify(results,null,2));
console.log(JSON.stringify({assets:results.length,failures:results.filter(x=>x.error)},null,2));
// Reference API evidence for the source courses hub (not a runtime dependency).
try{const r=await fetch(`${origin}/api/courses?page=1&limit=12`);await fs.writeFile('temp/linked-pages/courses-api.json',await r.text());console.log('Courses API:',r.status);}catch(error){console.log(String(error));}
