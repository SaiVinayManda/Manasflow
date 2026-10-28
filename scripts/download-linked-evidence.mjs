import fs from 'node:fs/promises';
import path from 'node:path';
const origin=process.env.MANASFLOW_SOURCE_ORIGIN;
if (!origin) throw new Error('Set MANASFLOW_SOURCE_ORIGIN before collecting reference assets.');
await fs.mkdir('temp/linked-pages/chunks',{recursive:true});
const files=(await fs.readdir('temp/linked-pages')).filter(f=>f.endsWith('.html')&&!f.endsWith('.main.html'));
const urls=new Set();
for(const file of files){const html=await fs.readFile(`temp/linked-pages/${file}`,'utf8');for(const m of html.matchAll(/<script[^>]+src="([^"]+)"/g)){if(/chunks\//.test(m[1])&&!/polyfills|webpack|main-app|4bd1b696|9da6db1e/.test(m[1]))urls.add(new URL(m[1].replaceAll('&amp;','&'),origin).href);}}
let cursor=0;const entries=[...urls];
await Promise.all(Array.from({length:8},async()=>{while(cursor<entries.length){const url=entries[cursor++];const name=path.basename(new URL(url).pathname);const target=`temp/linked-pages/chunks/${name}`;try{await fs.access(target);continue;}catch{}const r=await fetch(url);if(!r.ok){console.log(r.status,url);continue;}await fs.writeFile(target,await r.text());}}));
for(const route of ['/sitemap.xml','/robots.txt']){const r=await fetch(origin+route);await fs.writeFile('temp/linked-pages/'+route.slice(1),await r.text());}
console.log(`Downloaded ${entries.length} reference chunks plus sitemap/robots.`);
