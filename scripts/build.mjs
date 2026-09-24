import {readFile,writeFile,cp,mkdir,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const release=JSON.parse(await readFile(path.join(root,'release.json'),'utf8'));
const configured=/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(release.repository);
if(!configured && process.env.VERCEL) throw new Error('배포 전에 release.json의 repository를 설정하세요.');
if(configured && !/^[a-f0-9]{64}$/i.test(release.sha256)) throw new Error('다운로드 ZIP의 SHA-256 값이 필요합니다.');
const mac=release.mac;
const macConfigured=configured && mac && /^[A-Za-z0-9_.-]+$/.test(mac.tag) && /^[A-Za-z0-9_.-]+\.zip$/.test(mac.asset) && /^[a-f0-9]{64}$/i.test(mac.sha256) && mac.bytes>0;
if(!macConfigured) throw new Error('Mac 다운로드의 태그, 파일명, 크기, SHA-256을 설정하세요.');
const site=(release.siteUrl || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')).replace(/\/$/,'');
if(site && !/^https:\/\/[a-z0-9.-]+$/i.test(site)) throw new Error('siteUrl은 HTTPS 도메인이어야 합니다.');
const repo=`https://github.com/${release.repository}`;
const replacements={
  VERSION:release.version,SIZE:`${(release.bytes/1000000).toFixed(1)} MB`,
  DOWNLOAD_URL:configured?`${repo}/releases/latest/download/${encodeURIComponent(release.asset)}`:'#download',
  RELEASE_URL:configured?`${repo}/releases/latest`:'#download',
  DOWNLOAD_STATE:configured?'':'aria-disabled="true" tabindex="-1"',
  DOWNLOAD_LABEL:configured?'Windows용 다운로드':'다운로드 연결 준비 중',
  SOCIAL_IMAGE:`${site}/assets/social-card.png`,
  MAC_VERSION:mac.version,MAC_SIZE:`${(mac.bytes/1000000).toFixed(1)} MB`,
  MAC_DOWNLOAD_URL:`${repo}/releases/download/${encodeURIComponent(mac.tag)}/${encodeURIComponent(mac.asset)}`,
  MAC_RELEASE_URL:`${repo}/releases/tag/${encodeURIComponent(mac.tag)}`,
  MAC_DOWNLOAD_STATE:'',MAC_DOWNLOAD_LABEL:mac.preview?'Mac 테스트 버전 다운로드':'Mac용 다운로드'
};
const dist=path.resolve(root,'dist');
if(path.dirname(dist)!==root || path.basename(dist)!=='dist')throw new Error('Unexpected output directory');
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
await cp(path.join(root,'public'),dist,{recursive:true});
for(const file of ['index.html','mac.html']){
  let html=await readFile(path.join(root,'public',file),'utf8');
  html=html.replace(/\{\{([A-Z_]+)\}\}/g,(_,key)=>{if(!(key in replacements))throw new Error(`Unknown template: ${key}`);return replacements[key]});
  const url=`${site}/${file==='index.html'?'':file}`;
  if(site)html=html.replace('</head>',`  <link rel="canonical" href="${url}">\n  <meta property="og:url" content="${url}">\n</head>`);
  await writeFile(path.join(dist,file),html);
}
await writeFile(path.join(dist,'release.json'),JSON.stringify(release,null,2)+'\n');
await writeFile(path.join(dist,'robots.txt'),`User-agent: *\nAllow: /\n${site?`Sitemap: ${site}/sitemap.xml\n`:''}`);
if(site)await writeFile(path.join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site}/</loc></url><url><loc>${site}/mac.html</loc></url></urlset>`);
console.log(`Built desktop-keyring Windows v${release.version} / Mac v${mac.version}`);
