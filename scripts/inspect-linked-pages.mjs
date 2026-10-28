import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { parse } = require('next/dist/compiled/node-html-parser');
const origin = process.env.MANASFLOW_SOURCE_ORIGIN;
if (!origin) throw new Error('Set MANASFLOW_SOURCE_ORIGIN before collecting reference pages.');
const pages = process.argv.length>2 ? process.argv.slice(2) : ['/industries','/blog','/case-studies','/playbooks','/courses','/faq','/contact','/careers','/services','/tools','/models','/free-models','/models/pricing','/resources/claude-code-challenge','/resources/ai-automation-playbook','/resources/customer-support-workflow','/resources/lead-qualification-playbook'];
await fs.mkdir('temp/linked-pages', {recursive:true});
const output=[];
let cursor=0;
await Promise.all(Array.from({length:5},async()=>{
  while(cursor<pages.length){
    const route=pages[cursor++];
    try {
      const response=await fetch(origin+route);
      const html=await response.text();
      const name=route.slice(1).replaceAll('/','--');
      await fs.writeFile(`temp/linked-pages/${name}.html`,html);
      const root=parse(html);const main=root.querySelector('main');
      await fs.writeFile(`temp/linked-pages/${name}.main.html`,main?.outerHTML||'');
      for(const e of main?.querySelectorAll('script,style,svg')||[])e.remove();
      const links=(main?.querySelectorAll('a')||[]).map(a=>({title:a.textContent.trim().replace(/\s+/g,' '),href:a.getAttribute('href')}));
      const item={route,status:response.status,final:response.url,title:root.querySelector('title')?.textContent,headings:(main?.querySelectorAll('h1,h2,h3')||[]).map(a=>({tag:a.tagName,text:a.textContent.trim()})),links,text:main?.textContent.replace(/\s+/g,' ').trim()};
      output.push(item);
      await fs.writeFile(`temp/linked-pages/${name}.json`,JSON.stringify(item,null,2));
      console.log(route,response.status,html.length,links.length);
    }catch(error){output.push({route,error:String(error)});console.log(route,String(error));}
  }
}));
await fs.writeFile('temp/linked-pages/index.json',JSON.stringify(output,null,2));
