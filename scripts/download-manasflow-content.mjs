import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {parse}=require('next/dist/compiled/node-html-parser');
const origin=process.env.MANASFLOW_SOURCE_ORIGIN;
if (!origin) throw new Error('Set MANASFLOW_SOURCE_ORIGIN before collecting reference content.');
await fs.mkdir('temp/linked-pages/blog-pages',{recursive:true});
await fs.mkdir('temp/linked-pages/details',{recursive:true});
const jobs=[];
for(let page=1;page<=52;page++)jobs.push({url:`${origin}/blog?page=${page}`,target:`temp/linked-pages/blog-pages/page-${page}.html`,kind:'archive'});
const sitemap=await fs.readFile('temp/linked-pages/sitemap.xml','utf8');
const routes=[...new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname).filter(p=>/^\/(?:blog|case-studies|playbooks|courses|industries|resources|services)\/.+/.test(p)))];
for(const route of routes)jobs.push({url:origin+route,target:`temp/linked-pages/details/${encodeURIComponent(route)}.html`,kind:'detail',route});
let cursor=0,complete=0;const results=[];
await Promise.all(Array.from({length:12},async()=>{while(cursor<jobs.length){const job=jobs[cursor++];try{try{const old=await fs.readFile(job.target,'utf8');if(old.includes('<main')&&old.length>1000){results.push({...job,status:200,cached:true});continue;}}catch{}
  let response;for(let retry=0;retry<3;retry++){response=await fetch(job.url);if(response.ok||response.status===404)break;}
  const html=await response.text();await fs.writeFile(job.target,html);results.push({...job,status:response.status,final:response.url,bytes:html.length});complete++;if(complete%50===0)console.log(`${complete}/${jobs.length} source pages downloaded`);
}catch(error){results.push({...job,error:String(error)});}}}));
const extra=new Set();for(const job of jobs.filter(j=>j.kind==='archive')){try{const root=parse(await fs.readFile(job.target,'utf8'));for(const a of root.querySelectorAll('main a[href]')){const href=a.getAttribute('href');if(href?.startsWith('/blog/')&&!routes.includes(href))extra.add(href);}}catch{}}
for(const route of extra){const target=`temp/linked-pages/details/${encodeURIComponent(route)}.html`;const response=await fetch(origin+route);const html=await response.text();await fs.writeFile(target,html);results.push({url:origin+route,target,kind:'detail',route,status:response.status,bytes:html.length});}
await fs.writeFile('temp/linked-pages/download-report.json',JSON.stringify(results,null,2));
console.log(JSON.stringify({jobs:jobs.length,extra:extra.size,downloaded:results.length,failures:results.filter(x=>x.error||x.status!==200)},null,2));
