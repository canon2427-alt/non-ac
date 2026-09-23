import {avatars} from './avatars-data.js?v=20260924-u';

const list=document.querySelector('#avatar-list');
const search=document.querySelector('#avatar-search');
const year=document.querySelector('#avatar-year');
const count=document.querySelector('#avatar-count');
const years=[...new Set(avatars.map(([,date])=>date.split('/')[0]))].sort();

for(const value of years){
  const option=document.createElement('option');
  option.value=value;
  option.textContent=value;
  year.append(option);
}

function render(){
  const query=search.value.trim().normalize('NFKC').toLocaleLowerCase('ja');
  const matches=avatars.map(([name,date,itemId],index)=>({name,date,itemId,index:index+1}))
    .filter(item=>(!year.value||item.date.startsWith(year.value+'/'))&&item.name.normalize('NFKC').toLocaleLowerCase('ja').includes(query));
  count.textContent=`${matches.length} / ${avatars.length} avatars`;
  list.replaceChildren();
  if(!matches.length){
    const empty=document.createElement('p');empty.className='avatar-empty';empty.textContent='該当するアバターはありません。';list.append(empty);return;
  }
  for(const value of years){
    const group=matches.filter(item=>item.date.startsWith(value+'/'));
    if(!group.length)continue;
    const section=document.createElement('section');section.className='avatar-year-group';
    const head=document.createElement('div');head.className='avatar-year-head';
    const heading=document.createElement('h2');heading.textContent=value;
    const total=document.createElement('span');total.textContent=`${group.length} ${group.length===1?'avatar':'avatars'}`;
    head.append(heading,total);section.append(head);
    const rows=document.createElement('div');rows.className='avatar-rows';
    for(const item of group){
      const row=document.createElement('div');row.className='avatar-row';
      const index=document.createElement('span');index.className='avatar-index';index.textContent=String(item.index).padStart(3,'0');
      const name=document.createElement('strong');name.className='avatar-name';name.textContent=item.name;
      const date=document.createElement('time');date.className='avatar-date';date.dateTime=item.date.split('/').map((part,i)=>i?part.padStart(2,'0'):part).join('-');date.textContent=item.date;
      const product=document.createElement(item.itemId?'a':'span');product.className='avatar-product';
      if(item.itemId){product.href=`https://booth.pm/ja/items/${item.itemId}`;product.target='_blank';product.rel='noopener noreferrer';product.textContent='購入ページ ↗';product.setAttribute('aria-label',`${item.name}の購入ページを開く`)}
      else product.textContent='リンク未確認';
      row.append(index,name,date,product);rows.append(row);
    }
    section.append(rows);list.append(section);
  }
}

search.addEventListener('input',render);
year.addEventListener('change',render);
render();
