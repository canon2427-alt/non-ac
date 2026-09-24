const collection=document.body.dataset.collection;
const galleryRoot=document.querySelector('[data-gallery]');
const featuredRoot=document.querySelector('[data-featured]');
const filtersRoot=document.querySelector('[data-tag-filters]');
const countRoot=document.querySelector('[data-result-count]');

const escapeHtml=value=>String(value??'').replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
const titleFor=value=>{const title=String(value??'').trim();return /^untitled$/i.test(title)?'':title};
const card=item=>{const title=titleFor(item.title);return `<figure data-item-id="${escapeHtml(item.id)}"><button class="work-button" data-full="${escapeHtml(item.full)}" data-title="${escapeHtml(title)}"><img src="${escapeHtml(item.thumb)}" alt="${escapeHtml(item.alt)}" loading="lazy"></button>${title?`<figcaption><span>${escapeHtml(title)}</span></figcaption>`:''}<div class="item-tags">${(item.tags||[]).map(tag=>`<span class="item-tag">${escapeHtml(tag)}</span>`).join('')}</div></figure>`};

const response=await fetch('gallery.json',{cache:'no-cache'});
if(!response.ok)throw new Error('Gallery data could not be loaded.');
const data=await response.json();
const items=data.items.filter(item=>item.collection===collection);
const featured=items.find(item=>item.featured)||items[0];
const galleryItems=items.filter(item=>item.id!==featured?.id);
const tags=[...new Set(items.flatMap(item=>item.tags||[]))].sort((a,b)=>a.localeCompare(b,'ja'));
featuredRoot.hidden=!featured;
if(!items.length)filtersRoot.closest('.tag-panel').hidden=true;

if(featured){
  const title=titleFor(featured.title);
  featuredRoot.innerHTML=`<div class="featured-stage"><button data-full="${escapeHtml(featured.full)}" data-title="${escapeHtml(title)}"><img src="${escapeHtml(featured.thumb)}" alt="${escapeHtml(featured.alt)}" fetchpriority="high"></button></div><div class="featured-meta">${title?`<span>${escapeHtml(title)}</span>`:''}<span>Featured</span></div><div class="item-tags">${(featured.tags||[]).map(tag=>`<span class="item-tag">${escapeHtml(tag)}</span>`).join('')}</div>`;
}

filtersRoot.innerHTML=[`<button class="tag-filter" type="button" data-tag="" aria-pressed="true">すべて</button>`,...tags.map(tag=>`<button class="tag-filter" type="button" data-tag="${escapeHtml(tag)}" aria-pressed="false">${escapeHtml(tag)}</button>`)].join('');

const render=tag=>{
  const visible=tag?galleryItems.filter(item=>(item.tags||[]).includes(tag)):galleryItems;
  galleryRoot.innerHTML=visible.length?visible.map(card).join(''):`<p class="gallery-empty">${items.length?'該当する写真はありません。':'写真はまだありません。'}</p>`;
  countRoot.textContent=`${visible.length.toString().padStart(2,'0')} photographs`;
  filtersRoot.querySelectorAll('[data-tag]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.tag===tag)));
};

filtersRoot.addEventListener('click',event=>{
  const button=event.target.closest('[data-tag]');
  if(button)render(button.dataset.tag);
});
render('');
