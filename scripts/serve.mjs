import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.xml':'application/xml'};
createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const relative=pathname==='/'?'index.html':pathname.slice(1);const target=path.resolve(root,relative);if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return}const data=await readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data)}catch{res.writeHead(404);res.end('Not found')}}).listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4173'));
