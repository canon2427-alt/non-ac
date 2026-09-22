const dialog=document.querySelector('#lightbox');
if(dialog){
  const image=dialog.querySelector('.lightbox-img');
  const title=dialog.querySelector('.lightbox-title');
  document.querySelectorAll('[data-full]').forEach(button=>button.addEventListener('click',()=>{image.src=button.dataset.full;image.alt=button.querySelector('img').alt;title.textContent=button.dataset.title;dialog.showModal()}));
  dialog.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&dialog.open)dialog.close()});
}
const year=document.querySelector('[data-year]');
if(year)year.textContent=new Date().getFullYear();
