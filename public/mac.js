const isMobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
document.querySelector('#mac-mobile').hidden=!isMobile;
const dialog=document.querySelector('#copy-dialog'),toast=document.querySelector('#toast');
let timer;
document.querySelector('#mac-copy').addEventListener('click',async()=>{
  const url=new URL(location.href);url.hash='';url.search='';
  try{await navigator.clipboard.writeText(url.href);toast.textContent='링크를 복사했어요. Mac에서 열어주세요.';toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),3200)}
  catch{const field=document.querySelector('#share-url');field.value=url.href;dialog.showModal();field.focus();field.select()}
});
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
document.querySelectorAll('[aria-disabled="true"]').forEach(link=>link.addEventListener('click',event=>event.preventDefault()));
