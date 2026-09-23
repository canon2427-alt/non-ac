const root=document.querySelector('[data-figure-gallery]');
const dialog=document.querySelector('#figure-viewer');
const viewerImage=dialog.querySelector('img');
const caption=dialog.querySelector('.figure-viewer-caption');
let active=null,position=0;

const text=(tag,value,className)=>{const node=document.createElement(tag);node.textContent=value;if(className)node.className=className;return node};

function show(){
  const image=active.images[position];
  viewerImage.src=image.full;viewerImage.alt=image.alt||`${active.title||'Figure'} ${position+1}`;
  caption.textContent=`${active.title||'Untitled'} — ${position+1} / ${active.images.length}`;
  dialog.querySelector('[data-step="-1"]').disabled=position===0;
  dialog.querySelector('[data-step="1"]').disabled=position===active.images.length-1;
}

dialog.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());
dialog.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>{position+=Number(button.dataset.step);show()}));
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
document.addEventListener('keydown',event=>{
  if(!dialog.open)return;
  if(event.key==='ArrowLeft'&&position>0){position--;show()}
  if(event.key==='ArrowRight'&&position<active.images.length-1){position++;show()}
});

try{
  const response=await fetch('gallery.json',{cache:'no-cache'});
  if(!response.ok)throw new Error('写真データを読み込めませんでした。');
  const {items=[]}=await response.json();
  const groups=items.filter(item=>item.collection==='figure'&&Array.isArray(item.images)&&item.images.length);
  root.replaceChildren();
  if(!groups.length)root.append(text('p','作品はまだありません。','gallery-empty'));
  for(const [index,item] of groups.entries()){
    const article=document.createElement('article');article.className='figure-entry';
    const head=document.createElement('div');head.className='figure-entry-head';
    head.append(text('h2',item.title||'Untitled'),text('span',String(index+1).padStart(2,'0'),'entry-index'));
    const cover=document.createElement('button');cover.type='button';cover.className='figure-cover';cover.setAttribute('aria-label',`${item.title||'Figure'}、${item.images.length}枚の写真を開く`);
    for(const image of item.images.slice(0,3)){const img=document.createElement('img');img.src=image.thumb;img.alt=image.alt||item.title||'Figure photograph';img.loading='lazy';cover.append(img)}
    cover.append(text('span',`${item.images.length} photographs / View series`));
    cover.addEventListener('click',()=>{active=item;position=0;show();dialog.showModal()});
    article.append(head,cover);
    if(item.tags?.length){const tags=document.createElement('div');tags.className='entry-tags';for(const tag of item.tags)tags.append(text('span',`#${tag}`));article.append(tags)}
    root.append(article);
  }
}catch(error){root.replaceChildren(text('p',error.message,'gallery-empty'))}
