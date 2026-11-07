import {cp,mkdir,rm,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

// Static site: copy public/ to dist/ as-is.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.resolve(root,'dist');
if(path.dirname(dist)!==root || path.basename(dist)!=='dist')throw new Error('Unexpected output directory');
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
await cp(path.join(root,'public'),dist,{recursive:true});
await writeFile(path.join(dist,'robots.txt'),'User-agent: *\nAllow: /\n');
console.log('Built amuguna lab (lab, puzzle)');
