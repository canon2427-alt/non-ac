(()=>{
  const lead=document.querySelector('[data-profile-lead]');
  const name=document.querySelector('[data-profile-name]');
  const facts=document.querySelector('[data-profile-facts]');
  if(!lead||!name||!facts)return;
  const english={概要:'Overview',好き:'Likes',嫌い:'Dislikes',活動:'Activity'};
  fetch('profile.json',{cache:'no-store'})
    .then(response=>{if(!response.ok)throw new Error('Profile unavailable');return response.json()})
    .then(profile=>{
      if(!profile||!Array.isArray(profile.fields))return;
      lead.textContent=typeof profile.lead==='string'?profile.lead:'';
      lead.hidden=!lead.textContent;
      name.textContent=profile.displayName||'';
      name.hidden=!name.textContent;
      facts.replaceChildren();
      for(const field of profile.fields){
        if(!field||typeof field.label!=='string'||!field.label.trim())continue;
        const row=document.createElement('div');
        const term=document.createElement('dt');
        const eyebrow=document.createElement('span');
        eyebrow.textContent=english[field.label]||'Profile';
        term.append(eyebrow,document.createTextNode(field.label));
        const description=document.createElement('dd');
        description.textContent=typeof field.value==='string'?field.value:'';
        row.append(term,description);
        facts.append(row);
      }
    })
    .catch(()=>{});
})();
