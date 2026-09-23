const root=document.querySelector('[data-special-gallery]');
const viewer=document.querySelector('#special-viewer');
const viewerImage=viewer.querySelector('img');
const viewerCaption=viewer.querySelector('.figure-viewer-caption');
let active=null,position=0;

function showPhoto(){
  const image=active.images[position];
  viewerImage.src=image.full;viewerImage.alt=image.alt||`${active.title||'Special'} ${position+1}`;
  viewerCaption.textContent=`${active.title||'Untitled'} — ${position+1} / ${active.images.length}`;
  viewer.querySelector('[data-step="-1"]').disabled=position===0;
  viewer.querySelector('[data-step="1"]').disabled=position===active.images.length-1;
}

viewer.querySelector('.lightbox-close').addEventListener('click',()=>viewer.close());
viewer.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>{position+=Number(button.dataset.step);showPhoto()}));
viewer.addEventListener('click',event=>{if(event.target===viewer)viewer.close()});
document.addEventListener('keydown',event=>{
  if(!viewer.open)return;
  if(event.key==='ArrowLeft'&&position>0){position--;showPhoto()}
  if(event.key==='ArrowRight'&&position<active.images.length-1){position++;showPhoto()}
});

function sourceUrl(value){
  try{
    const url=new URL(value);
    if(url.protocol!=='https:'||!['x.com','twitter.com','www.x.com','www.twitter.com'].includes(url.hostname))return null;
    if(!/^\/[A-Za-z0-9_]{1,15}\/status\/\d+(?:\/.*)?$/.test(url.pathname))return null;
    return url.href;
  }catch{return null}
}

const text=(tag,value,className)=>{
  const element=document.createElement(tag);
  element.textContent=value;
  if(className)element.className=className;
  return element;
};

try{
  const response=await fetch('gallery.json',{cache:'no-cache'});
  if(!response.ok)throw new Error('写真データを読み込めませんでした。');
  const {items=[]}=await response.json();
  const special=items.filter(item=>item.collection==='special');
  root.replaceChildren();
  if(!special.length)root.append(text('p','写真はまだありません。','gallery-empty'));
  for(const [index,item] of special.entries()){
    const article=document.createElement('article');article.className='special-entry';
    const head=document.createElement('div');head.className='special-entry-head';
    head.append(text('h2',item.title||'Untitled'),text('span',String(index+1).padStart(2,'0'),'entry-index'));
    const body=document.createElement('div');body.className='special-entry-body';
    const images=Array.isArray(item.images)?item.images:[{full:item.full,thumb:item.thumb,alt:item.alt}];
    const grid=document.createElement('div');grid.className='special-photo-grid';grid.dataset.count=String(images.length);
    for(const [photoIndex,image] of images.entries()){
      const photo=document.createElement('button');photo.type='button';photo.className='special-photo';
      photo.setAttribute('aria-label',`${item.title||'Special'}の写真${photoIndex+1}を拡大`);
      const thumbnail=document.createElement('img');thumbnail.src=image.thumb;thumbnail.alt=image.alt||item.title||'Special photograph';thumbnail.loading='lazy';photo.append(thumbnail);
      photo.addEventListener('click',()=>{active={title:item.title,images};position=photoIndex;showPhoto();viewer.showModal()});
      grid.append(photo);
    }
    const source=document.createElement('aside');source.className='special-source';source.append(text('span','Original post / X','special-source-label'));
    const url=sourceUrl(item.sourceUrl);
    if(url){
      const quote=document.createElement('blockquote');quote.className='twitter-tweet';quote.dataset.theme='dark';
      const anchor=document.createElement('a');anchor.href=url;anchor.textContent='Xの引用元ポストを見る';quote.append(anchor);source.append(quote);
      const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.className='special-source-link';link.textContent='元のポストを開く ↗';source.append(link);
    }else source.append(text('p','引用元ポストは確認できません。'));
    body.append(grid,source);article.append(head,body);
    if(item.tags?.length){const tags=document.createElement('div');tags.className='entry-tags';for(const tag of item.tags)tags.append(text('span',`#${tag}`));article.append(tags)}
    root.append(article);
  }
  if(special.some(item=>sourceUrl(item.sourceUrl))){
    const script=document.createElement('script');script.src='https://platform.twitter.com/widgets.js';script.async=true;script.charset='utf-8';document.body.append(script);
  }
}catch(error){root.replaceChildren(text('p',error.message,'gallery-empty'))}
