const dialog=document.querySelector('#lightbox');
if(dialog){
  const image=dialog.querySelector('.lightbox-img');
  const title=dialog.querySelector('.lightbox-title');
  document.addEventListener('click',event=>{const button=event.target.closest('[data-full]');if(!button)return;image.src=button.dataset.full;image.alt=button.querySelector('img').alt;title.textContent=button.dataset.title;dialog.showModal()});
  dialog.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&dialog.open)dialog.close()});
}
const year=document.querySelector('[data-year]');
if(year)year.textContent=new Date().getFullYear();
const previews=document.querySelectorAll('[data-collection-preview]');
if(previews.length){
  fetch('gallery.json',{cache:'no-cache'}).then(response=>response.json()).then(data=>{
    for(const card of previews){
      const items=data.items.filter(item=>item.collection===card.dataset.collectionPreview);
      if(!items.length)continue;
      const featured=items.find(item=>item.featured)||items[0];
      const image=document.createElement('img');
      image.src=featured.thumb||featured.images?.[0]?.thumb||'';
      image.alt=featured.alt||`${card.dataset.collectionPreview} コレクションの代表画像`;
      card.prepend(image);
      card.querySelector('small').textContent=`${items.length.toString().padStart(2,'0')} ${card.dataset.collectionPreview==='figure'?'series':'photographs'}`;
    }
  }).catch(()=>{});
}
