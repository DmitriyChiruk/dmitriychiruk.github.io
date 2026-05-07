export class Renderer {
    renderAll(data) {
        if (data.profile) this.renderProfile(data.profile);
        if (data.experience) this.renderExperience(data.experience);
        if (data.education) this.renderEducation(data.education);
        if (data.projects) this.renderProjects(data.projects);
        if (data.contacts?.social) this.renderSocial(data.contacts.social);
        if (data.profile?.skills) this.renderSkills(data.profile.skills);
        if (data.certificates) this.renderCertificates(data.certificates);
    }

    escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/[&<>"']/g, function(m) {
            switch(m) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case "'": return '&#39;';
                default: return m;
            }
        });
    }

    renderProfile(profile) {
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
        if (aboutBio && Array.isArray(profile?.summary)) {
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
        if (cv && profile?.downloadCV) {
            cv.href = profile.downloadCV;
            cv.setAttribute('download', profile.downloadCV.split('/').pop());
        }


        // Photo
        const pic = document.getElementById('about_pic');
        if (pic && profile?.photo) {
            pic.src = profile.photo;
            pic.alt = `${fullName} profile photo`;
        }


        // Age calculation
        const ageSpan = document.getElementById('my_age');
        if (ageSpan && profile?.birth?.year) {
            const today = new Date();
            const y = profile.birth.year, m = (profile.birth.month ?? 1) - 1, d = profile.birth.day ?? 1;

            let age = today.getFullYear() - y;
            
            const hasBirthdayPassed = (today.getMonth() > m) || (today.getMonth() === m && today.getDate() >= d);
            
            if (!hasBirthdayPassed) age -= 1;
            ageSpan.textContent = String(age);
        }
    }

    renderSkills(skills) {
        if (!skills) return;
        
        const devUl = document.getElementById('dev_skills');
        if (devUl) {
            devUl.querySelectorAll('li').forEach(n => n.remove());
            (skills.development || []).forEach(s => {
                const li = document.createElement('li');
                li.textContent = s;
                devUl.appendChild(li);
            });
        }

        const langUl = document.getElementById('lang_skills');
        if (langUl) {
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

    renderExperience(experience) {
        const list = document.getElementById('work_exp_list');
        if (!list || !Array.isArray(experience)) return;
        
        list.innerHTML = '';
        experience.forEach(exp => {
            const li = document.createElement('li');
            li.className = 'resume-card';
            li.innerHTML = `
                <h4 class="period">${this.escapeHtml(exp.period)}</h4>
                <p class="title"><b>${this.escapeHtml(exp.position)}&#32;at&#32;${this.escapeHtml(exp.company)}</b></p>
            `;

            if (Array.isArray(exp.details)) {
                exp.details.forEach(t => {
                    const p = document.createElement('p');
                    p.className = 'content';
                    p.textContent = t;
                    li.appendChild(p);
                });
            }

            if (exp.checklist_title) {
                const header = document.createElement('p');
                header.innerHTML = `<b>${this.escapeHtml(exp.checklist_title)}</b>`;
                li.appendChild(header);
            }

            if (Array.isArray(exp.checklist) && exp.checklist.length) {
                const header = document.createElement('p');
                li.appendChild(header);
                
                const ul = document.createElement('ul');
                ul.className = 'checklist';
                exp.checklist.forEach(c => {
                    const cli = document.createElement('li');
                    cli.className = 'task-item';
                    cli.textContent = c;
                    ul.appendChild(cli);
                });
                li.appendChild(ul);
            }
            list.appendChild(li);
        });
    }

    renderEducation(education) {
        if (!education) return;
        
        const uni = document.getElementById('education_university');
        
        if (uni) {
            uni.innerHTML = '';
        
            (education.university || []).forEach(u => {
                const li = document.createElement('li');
                li.className = 'resume-card';
        
                li.innerHTML = `
                    <h4 class="period">${this.escapeHtml(u.period)}</h4>
                    <p class="title"><b>${this.escapeHtml(u.institution)}</b></p>
                    <p class="content">${this.escapeHtml(u.degree)}</p>
                `;
        
                uni.appendChild(li);
            });
        }


        const courses = document.getElementById('education_courses');
        
        if (courses) {
            courses.innerHTML = '';
        
            (education.courses || []).forEach(c => {
                const li = document.createElement('li');
                li.className = 'resume-card';
        
                li.innerHTML = `
                    <h4 class="period">${this.escapeHtml(c.period)}</h4>
                    <p class="title"><b>${this.escapeHtml(c.institution)}</b></p>
                    <p class="content">${this.escapeHtml(c.description)}</p>
                `;
        
                courses.appendChild(li);
            });
        }
    }

    renderProjects(projects) {
        const list = document.getElementById('projects_list');
        if (!list || !Array.isArray(projects)) return;
        
        list.innerHTML = '';
        projects.forEach(p => {
            const li = document.createElement('li');
            li.className = 'resume-card';
            li.innerHTML = `<p class="title"><b>${this.escapeHtml(p.title)}</b></p>`;

            if (Array.isArray(p.description)) {
                p.description.forEach(t => {
                    const p = document.createElement('p');
                    p.className = 'content';
                    p.textContent = t;
                    li.appendChild(p);
                });
            }
            list.appendChild(li);
        });
    }

    renderSocial(social) {
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

    renderCertificates(certs) {
        const section = document.getElementById('certificates');
        const carousel = document.getElementById('certificates_carousel');
        if (!section) return;

        if (!Array.isArray(certs) || certs.length === 0) {
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
            this.createSquarePreview(fullSrc).then(previewUrl => {
                img.src = previewUrl || fullSrc;
            }).catch(() => { img.src = fullSrc; });
            
            img.dataset.src = fullSrc; 
            img.dataset.title = c.title || '';
            upper.appendChild(img);

            const lower = document.createElement('div');
            lower.className = 'meta';
            const title = document.createElement('div');
            title.className = 'title';
            title.textContent = c.title;
            lower.appendChild(title);
            
            if (c.credentialId) {
                const cred = document.createElement('div');
                cred.className = 'cred';
                cred.textContent = `Credential ID: ${c.credentialId}`;
                lower.appendChild(cred);
            }
            
            if (c.description) {
                const desc = document.createElement('div');
                desc.className = 'desc';
                desc.textContent = c.description;
                lower.appendChild(desc);
            }

            card.appendChild(upper);
            card.appendChild(lower);
            track.appendChild(card);
        });
    }

    createSquarePreview(src) {
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
            
                    resolve(canvas.toDataURL('image/jpeg', 0.9));
                } catch (e) {
                    resolve(src);
                }
            };
            img.onerror = () => resolve(src);
            img.src = src;
        });
    }    
}