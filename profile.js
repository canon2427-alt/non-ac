(()=>{
  const lead=document.querySelector('[data-profile-lead]');
  const facts=document.querySelector('[data-profile-facts]');
  if(!lead||!facts)return;
  const multiline=value=>typeof value==='string'?value.replace(/\r?\n[ \t]*<br\s*\/?\s*>/gi,'\n').replace(/<br\s*\/?\s*>/gi,'\n'):'';
  fetch('profile.json',{cache:'no-store'})
    .then(response=>{if(!response.ok)throw new Error('Profile unavailable');return response.json()})
    .then(profile=>{
      if(!profile||!Array.isArray(profile.fields))return;
      lead.textContent=multiline(profile.lead);
      lead.hidden=!lead.textContent;
      facts.replaceChildren();
      for(const field of profile.fields){
        if(!field||typeof field.label!=='string'||!field.label.trim())continue;
        const row=document.createElement('div');
        const term=document.createElement('dt');
        term.textContent=field.label;
        const description=document.createElement('dd');
        description.textContent=multiline(field.value);
        row.append(term,description);
        facts.append(row);
      }
    })
    .catch(()=>{});
})();
