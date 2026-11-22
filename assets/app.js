"use strict";
const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const menuButton=document.getElementById("menu-toggle");
const navigation=document.getElementById("navigation");
menuButton.addEventListener("click",()=>{
  const isOpen=navigation.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded",String(isOpen));
  menuButton.setAttribute("aria-label",isOpen?"Close navigation":"Open navigation");
});
navigation.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
  navigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded","false");
  menuButton.setAttribute("aria-label","Open navigation");
}));
const revealEls=document.querySelectorAll(".reveal");
if(reducedMotion||!("IntersectionObserver" in window)){
  revealEls.forEach(el=>el.classList.add("visible"));
}else{
  const observer=new IntersectionObserver((entries)=>{
    for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}
  },{threshold:.08});
  revealEls.forEach(el=>observer.observe(el));
}
const roles=["AI/ML Student","Full-Stack Developer","Python Enthusiast","Creative Problem Solver"];
const typed=document.getElementById("typed-role");
if(!reducedMotion){
  let roleIndex=0,charIndex=roles[0].length,deleting=true;
  function typeNext(){
    const role=roles[roleIndex];
    if(deleting){charIndex=Math.max(0,charIndex-1)}else{charIndex=Math.min(role.length,charIndex+1)}
    typed.textContent=role.slice(0,charIndex);
    if(!deleting&&charIndex===role.length){deleting=true;setTimeout(typeNext,1650);return}
    if(deleting&&charIndex===0){deleting=false;roleIndex=(roleIndex+1)%roles.length}
    setTimeout(typeNext,deleting?55:85);
  }
  setTimeout(typeNext,1550);
}
const stars=document.getElementById("stars");
if(!reducedMotion){
  const fragment=document.createDocumentFragment();
  for(let i=0;i<38;i++){
    const star=document.createElement("span");
    star.className="star";
    // Deterministic pseudo-random layout, avoiding dependencies.
    star.style.left=(i*73.7%100)+"%";
    star.style.top=(i*39.1%97)+"%";
    star.style.animationDelay=((i%12)*.37)+"s";
    fragment.appendChild(star);
  }
  stars.appendChild(fragment);
}
const filters=document.querySelectorAll(".filter");
const cards=document.querySelectorAll(".project-card");
filters.forEach(button=>button.addEventListener("click",()=>{
  const selected=button.dataset.filter;
  filters.forEach(item=>{
    const active=item===button;
    item.classList.toggle("is-active",active);
    item.setAttribute("aria-pressed",String(active));
  });
  cards.forEach(card=>{card.hidden=selected!=="all"&&card.dataset.category!==selected});
}));
// Insert real public social links below; leave unknown ones empty.
// Example: linkedin: "https://www.linkedin.com/in/YOUR-HANDLE/"
const socialLinks={linkedin:"",instagram:"",resume:""};
const socialContainer=document.getElementById("optional-socials");
Object.entries(socialLinks).forEach(([label,url])=>{
  if(!/^https:\/\/[^/\s]+\//i.test(url))return;
  const a=document.createElement("a");
  a.href=url;a.textContent=label.charAt(0).toUpperCase()+label.slice(1)+" ↗";
  a.target="_blank";a.rel="noopener noreferrer";
  socialContainer.appendChild(a);
});
