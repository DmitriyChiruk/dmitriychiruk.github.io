const min_mobile_width = 720
const min_mobile_height = 500
var isExpandedNavbar = false;
var  previousScrollPosition = 0;

var backTop = document.getElementsByClassName('go_top_btn')[0];
var controls = document.querySelector('.controls');
var navbar_links = document.getElementsByClassName('nav-bar-link');
var icon = document.getElementById("toggler_img");
var links = document.querySelector('.links');
var mainpage = document.querySelectorAll(".main_page");
var name_status, email_status, subj_status, msg_status;


document.addEventListener('DOMContentLoaded', () => {
  try {
    if (window.location.protocol === 'file:') {
      console.error('[Portfolio] This page was opened via file://. Please run a local web server (e.g., Python http.server) or use GitHub Pages to avoid CORS/file protocol restrictions.');
      return;
    }

    fetch('data/site.json', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        renderProfile(data.profile);
        renderExperience(data.experience);
        renderEducation(data.education);
        renderProjects(data.projects);
        renderSocial(data.contacts?.social || []);
        renderSkills(data.profile?.skills);
        renderCertificates(data.certificates || []);
      })
      .catch(err => console.error('Failed to load site.json', err));
  } catch (e) {
    console.error(e);
  }
});

function renderProfile(profile){
  // Greeting name and title
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ');
  const gName = document.getElementById('greeting_name');
  if (gName && fullName) gName.textContent = `I'm ${fullName}`;
  const gTitle = document.getElementById('greeting_title');
  if (gTitle && profile?.title) gTitle.textContent = profile.title;

  // About section: name, title, bio paragraphs
  const aName = document.getElementById('about_name');
  if (aName && fullName) aName.textContent = fullName;
  const aTitle = document.getElementById('about_title');
  if (aTitle && profile?.title) aTitle.textContent = profile.title;

  const aboutBio = document.getElementById('about_bio');
  if (aboutBio && Array.isArray(profile?.summary)){
    // Clear existing
    aboutBio.innerHTML = '';
    profile.summary.forEach(p => {
      const pe = document.createElement('p');
      pe.textContent = p;
      aboutBio.appendChild(pe);
    });
  }

  // Location
  const fromSpan = document.getElementById('about_from');
  if (fromSpan && profile?.location?.from) fromSpan.textContent = profile.location.from;
  const liveInSpan = document.getElementById('about_livein');
  if (liveInSpan && profile?.location?.liveIn) liveInSpan.textContent = profile.location.liveIn;

  // CV link
  const cv = document.getElementById('about_cv_link');
  if (cv && profile?.downloadCV){
    cv.href = profile.downloadCV;
    cv.setAttribute('download', profile.downloadCV.split('/').pop());
  }

  // Photo
  const pic = document.getElementById('about_pic');
  if (pic && profile?.photo){
    pic.src = profile.photo;
    pic.alt = `${fullName} profile photo`;
  }

  // Age calculation
  const ageSpan = document.getElementById('my_age');
  
  if (ageSpan && profile?.birth?.year){
    const today = new Date();
    const y = profile.birth.year, m = (profile.birth.month ?? 1) - 1, d = profile.birth.day ?? 1;
  
    let age = today.getFullYear() - y;
  
    const hasBirthdayPassed = (today.getMonth() > m) || (today.getMonth() === m && today.getDate() >= d);
    if (!hasBirthdayPassed) age -= 1;
    ageSpan.textContent = String(age);
  }
}

function renderSkills(skills){
  if (!skills) return;
  
  const devUl = document.getElementById('dev_skills');
  
  if (devUl){
    devUl.querySelectorAll('li').forEach(n => n.remove());
    
    (skills.development || []).forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      devUl.appendChild(li);
    });
  }

  const langUl = document.getElementById('lang_skills');
  if (langUl){
    langUl.querySelectorAll('li').forEach(n => n.remove());
    
    (skills.languages || []).forEach(l => {
      const li = document.createElement('li');
      const b = document.createElement('b');
      
      b.textContent = `${l.name}:`;
      li.appendChild(b);
      li.appendChild(document.createTextNode(` ${l.level}`));
      langUl.appendChild(li);
    });
  }
}

function renderExperience(experience){
  const list = document.getElementById('work_exp_list');
  
  if (!list || !Array.isArray(experience)) return;
  
  list.innerHTML = '';
  experience.forEach(exp => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h4 class="period">${escapeHtml(exp.period)}</h4>
      <p class="title"><b>${escapeHtml(exp.position)}&#32;at&#32;${escapeHtml(exp.company)}</b></p>
    `;

    if (Array.isArray(exp.details)){
      exp.details.forEach(t => {
        const p = document.createElement('p');
        p.className = 'content';
        p.textContent = t;
        li.appendChild(p);
      });
    }

    if (exp.checklist_title){
      const header = document.createElement('p');
      header.innerHTML = `<b>${escapeHtml(exp.checklist_title)}</b>`;
      li.appendChild(header);
    }

    if (Array.isArray(exp.checklist) && exp.checklist.length){
      const header = document.createElement('p');
      li.appendChild(header);
      
      const ul = document.createElement('ul');
      ul.className = 'checklist';
      
      exp.checklist.forEach(c => {
        const cli = document.createElement('li');
        cli.textContent = c;
        ul.appendChild(cli);
      });
      li.appendChild(ul);
    }

    list.appendChild(li);
  });
}

function renderEducation(education){
  if (!education) return;
  
  const uni = document.getElementById('education_university');
  
  if (uni){
    uni.innerHTML = '';
  
    (education.university || []).forEach(u => {
      const li = document.createElement('li');
      
      li.innerHTML = `
        <h4 class="period">${escapeHtml(u.period)}</h4>
        <p class="title"><b>${escapeHtml(u.institution)}</b></p>
        <p class="content">${escapeHtml(u.degree)}</p>
      `;
      uni.appendChild(li);
    });
  }

  const courses = document.getElementById('education_courses');
  if (courses){
    courses.innerHTML = '';
    
    (education.courses || []).forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `
        <h4 class="period">${escapeHtml(c.period)}</h4>
        <p class="title"><b>${escapeHtml(c.institution)}</b></p>
        <p class="content">${escapeHtml(c.description)}</p>
      `;
      courses.appendChild(li);
    });
  }
}

function renderProjects(projects){
  const list = document.getElementById('projects_list');
  
  if (!list || !Array.isArray(projects)) return;
  
  list.innerHTML = '';
  projects.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <p class="title"><b>${escapeHtml(p.title)}</b></p>
      <p class="content">${escapeHtml(p.description)}</p>
    `;
    list.appendChild(li);
  });
}

function renderCertificates(certs){
  const section = document.getElementById('certificates');
  const carousel = document.getElementById('certificates_carousel');
  if (!section) return;

  if (!Array.isArray(certs) || certs.length === 0){
    section.style.display = 'none';
    return;
  }

  section.style.display = '';
  if (!carousel) return;
  carousel.innerHTML = '';

  const track = document.createElement('div');
  track.className = 'carousel-track';
  carousel.appendChild(track);

  certs.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card';

    const upper = document.createElement('div');
    upper.className = 'thumb';

    const img = document.createElement('img');
    img.alt = `${c.title || 'Certificate'} preview`;
    
    const fullSrc = c.image || c.thumbnail;
    createSquarePreview(fullSrc).then(previewUrl => {
      img.src = previewUrl || fullSrc;
    }).catch(() => { img.src = fullSrc; });
    img.addEventListener('click', () => openCertModal(fullSrc, c.title));
    upper.appendChild(img);

    const lower = document.createElement('div');
    lower.className = 'meta';
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = c.title;
    lower.appendChild(title);
    
    if (c.credentialId){
      const cred = document.createElement('div');
      cred.className = 'cred';
      cred.textContent = `Credential ID: ${c.credentialId}`;
      lower.appendChild(cred);
    }
    
    if (c.description){
      const desc = document.createElement('div');
      desc.className = 'desc';
      desc.textContent = c.description;
      lower.appendChild(desc);
    }

    card.appendChild(upper);
    card.appendChild(lower);
    track.appendChild(card);
  });

  const prev = section.querySelector('.carousel-btn.prev');
  const next = section.querySelector('.carousel-btn.next');

  const scrollBy = () => {
    const cards = track.querySelectorAll('.card');
    if (!cards.length) return 300;
    const rect = cards[0].getBoundingClientRect();
    let gap = 16;
    if (cards.length > 1){
      const rect2 = cards[1].getBoundingClientRect();
      const computedGap = Math.round(rect2.left - rect.right);
      if (!isNaN(computedGap) && computedGap >= 0) gap = computedGap;
    } else {
      // try computed style
      const cs = window.getComputedStyle(track);
      const g = parseInt(cs.columnGap || cs.gap || '16', 10);
      if (!isNaN(g)) gap = g;
    }
    return rect.width + gap;
  };

  let offset = 0;
  const maxOffset = () => Math.max(0, track.scrollWidth - carousel.clientWidth);

  const apply = () => {
    offset = Math.max(0, Math.min(offset, maxOffset()));
    track.style.transform = `translateX(${-offset}px)`;
  };
  prev?.addEventListener('click', () => { offset -= scrollBy(); apply(); });
  next?.addEventListener('click', () => { offset += scrollBy(); apply(); });
  window.addEventListener('resize', apply);
  apply();

  // Wheel horizontal scroll support
  carousel.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      offset += e.deltaX;
      apply();
    }
  }, { passive: false });

  // Drag / touch to scroll
  let isDown = false, startX = 0, startOffset = 0;
  const startDrag = (clientX) => { isDown = true; startX = clientX; startOffset = offset; carousel.classList.add('grabbing'); };
  const moveDrag = (clientX) => { if (!isDown) return; const dx = clientX - startX; offset = startOffset - dx; apply(); };
  const endDrag = () => { isDown = false; carousel.classList.remove('grabbing'); };
  carousel.addEventListener('mousedown', (e) => startDrag(e.clientX));
  window.addEventListener('mousemove', (e) => moveDrag(e.clientX));
  window.addEventListener('mouseup', endDrag);
  carousel.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
  window.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX), { passive: true });
  window.addEventListener('touchend', endDrag);

  const modal = document.getElementById('certificate_modal');
  const closeBtn = document.getElementById('modal_close');
  const backdrop = modal?.querySelector('.modal-backdrop');
  closeBtn?.addEventListener('click', closeCertModal);
  backdrop?.addEventListener('click', closeCertModal);
}

function openCertModal(imgUrl, title){
  const modal = document.getElementById('certificate_modal');
  const mimg = document.getElementById('modal_image');

  if (!modal || !mimg) return;

  mimg.src = imgUrl;
  mimg.alt = title || 'Certificate';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  // lock body scroll
  document.body.classList.add('modal-open');
  // ESC key to close
  modal._onKey = (e) => { if (e.key === 'Escape') closeCertModal(); };
  window.addEventListener('keydown', modal._onKey);
  // handle Android back button / browser back
  modal._onPop = () => closeCertModal();
  window.addEventListener('popstate', modal._onPop);
  history.pushState({ certModal: true }, '');
}

function closeCertModal(){
  const modal = document.getElementById('certificate_modal');

  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (modal._onKey) { window.removeEventListener('keydown', modal._onKey); delete modal._onKey; }
  if (modal._onPop) { window.removeEventListener('popstate', modal._onPop); delete modal._onPop; }
  if (history.state && history.state.certModal) {
    history.back();
  }
}

function createSquarePreview(src){
  return new Promise((resolve, reject) => {
    if (!src) { reject(new Error('No image src')); return; }

    const img = new Image();
    img.onload = () => {
      try {
        const size = Math.min(img.naturalWidth || img.width, img.naturalHeight || img.height);
        const sx = Math.max(0, Math.floor((img.naturalWidth - size) / 2));
        const sy = Math.max(0, Math.floor((img.naturalHeight - size) / 2));
        const canvas = document.createElement('canvas');

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

        const url = canvas.toDataURL('image/jpeg', 0.9);
        resolve(url);
      }
      catch (e) {
        resolve(src);
      }
    };
    
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

function renderSocial(social){
  const ul = document.getElementById('social_links');
  
  if (!ul || !Array.isArray(social)) return;
  
  ul.innerHTML = '';
  social.forEach(s => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.href;
  
    if (s.target) a.target = s.target;
    a.textContent = ' ' + s.text;
  
    const b = document.createElement('b');
    b.textContent = s.label + ':';
  
    li.appendChild(b);
    li.appendChild(a);
    ul.appendChild(li);
  });
}

function escapeHtml(str){
  if (str == null) return '';
  
  return String(str).replace(/[&<>"']/g, function(m){
    switch(m){
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return m;
    }
  });
}

window.onscroll = function () {
  if (document.documentElement.scrollTop > 400) {
    backTop.style.visibility = "visible";
    backTop.style.opacity = "1";
  } else {
    backTop.style.visibility = "hidden";
    backTop.style.opacity = "0";
  }

  if (isExpandedNavbar){
    mobile_navbar();
  }

  let controls_height = window.screen.height * 0.15;
  if (is_mobile_version()){
    if (isScrollingDown()){
      console.log(controls_height)
      controls.style.top = "-70px";
    }
    else {
      controls.style.top = "0";
    }
  }
  else {
    controls.style.top = "0";
  }
};

function navbar_default(){
  for (let i=0; i < navbar_links.length; i++){
    navbar_links[i].className = "nav-bar-link";
  }
}

function navbar_click(elem){
  navbar_default();
  elem.className += " active";

  if(isExpandedNavbar){
    mobile_navbar();
  }
}

function mobile_navbar(){
  controls.classList.toggle("open");
  links.classList.toggle("open");

  if(isExpandedNavbar){
      hide_navbar();
  }
  else{
      show_navbar();
  }
}

function hide_navbar(){
  isExpandedNavbar = false;
  icon.src = "img/hamburger.svg";
}

function show_navbar(){
  isExpandedNavbar = true;
  icon.src = "img/cross.svg";
}

for (let i = 0; i<mainpage.length; i++){
  mainpage[i].addEventListener("click", () => {
    if (isExpandedNavbar){
      mobile_navbar();
    }
  });
}

function send_email(){
  console.log("send_email()");

  if (name_status && email_status && subj_status && msg_status){
    var link = "mailto:dchiruk@gmail.com"
             + "?subject=" + escape(document.getElementById('Subject').value)
             + "&body=" + escape("Hi, I`m " + document.getElementById('Name').value
             + ". \nThis is the message from your website.\n\n"
             + document.getElementById('Message').value + "\n\n");
    window.location.href = link;
    reset_mail_fields();
  }
  else {
      check_name();
      check_email();
      check_subject();
      check_message();
  }
}

function reset_mail_fields(){
  document.getElementById('Name').value = "";
  document.getElementById('Email').value = "";
  document.getElementById('Subject').value = "";
  document.getElementById('Message').value = "";

  name_status = undefined;
  email_status = undefined;
  subj_status = undefined;
  msg_status = undefined;
}

function contains_special_chars(str) {
  const special_chars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return special_chars.test(str);
}

function contains_digits(str){
  const digits = /\d/;
  return digits.test(str);
}

function check_name() {
  let name = document.getElementById('Name');

  if(name.value.length == 0){
    name_status = false;
  } else if (contains_special_chars(name.value) || contains_digits(name.value)){
    alert("Use only letters in your name!");
    name_status = false;
  } else  if (name.value[0] != name.value[0].toUpperCase()){
    alert("Respect yourself, type Your name starting with a capital letter!");
    name_status = false;
  } else  if (name.value.split(" ").length > 2){
    alert("Your first and last name would be enough)");
    name_status = false;
  } else {
    name_status = true;
  }

  if (name_status == false){
    name.className = "form wronginput";
  } else {
    name.className = "form";
  }
}

function check_email(){
  let email = document.getElementById('Email');
  let email_template = /^[a-zA-Z0-9.]+@+[a-zA-Z\d]+(.com)$/;

  if(email.value.length == 0){
    email_status = false;
  } else if (email.value[0] != '.' && email.value.match(email_template)){
    email_status = true;
  } else {
    alert("Email is not valid, try another one!");
    email_status = false;
  }

  if (!email_status){
    email.className = "form wronginput";
  } else {
    email.className = "form";
  }
}

function check_subject(){
  let subj = document.getElementById('Subject');
  subj_status = (subj.value.length != 0);

  if (!subj_status){
    subj.className = "form wronginput";
  } else {
    subj.className = "form";
  }
}

function check_message(){
  let msg = document.getElementById('Message');
  msg_status = (msg.value.length != 0);

  if (!msg_status){
    msg.className = "form wronginput";
  } else {
    msg.className = "form";
  }
}

function is_mobile_version(){
  if (window.screen.width <= min_mobile_width){
    return true
  }

  if (window.screen.height <= min_mobile_height){
    return true
  }

  return false
}

function isScrollingDown() {
  let goingDown = false;

  let scrollPosition = window.pageYOffset;

  if (scrollPosition > previousScrollPosition) {
    goingDown = true;
  }

  previousScrollPosition = scrollPosition;

  return goingDown;
}
