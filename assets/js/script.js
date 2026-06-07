'use strict';

// --------------------------------------------------------------------
// SCROLL SPY — IntersectionObserver for active section highlighting
// --------------------------------------------------------------------

const initScrollSpy = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('[data-nav-link]');
  if (!sections.length || !navLinks.length) return;

  let currentActiveId = '';

  const setActive = (id) => {
    if (id === currentActiveId) return;
    currentActiveId = id;
    navLinks.forEach(link => {
      const target = link.dataset.navLink;
      link.classList.toggle('active', target === id);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    let maxRatio = 0;
    let bestId = currentActiveId;

    entries.forEach(entry => {
      if (entry.intersectionRatio > maxRatio) {
        maxRatio = entry.intersectionRatio;
        bestId = entry.target.id;
      }
    });

    if (bestId) setActive(bestId);
  }, {
    threshold: [0, 0.25, 0.5, 0.75, 1],
    rootMargin: '-56px 0px -40% 0px'
  });

  sections.forEach(s => observer.observe(s));

  // Set initial active based on scroll position
  const onScroll = () => {
    let bestSection = null;
    let bestDist = Infinity;
    const navHeight = 56;

    sections.forEach(s => {
      const rect = s.getBoundingClientRect();
      const dist = Math.abs(rect.top - navHeight);
      if (dist < bestDist) {
        bestDist = dist;
        bestSection = s;
      }
    });

    if (bestSection && bestSection.id !== currentActiveId) {
      setActive(bestSection.id);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};

// --------------------------------------------------------------------
// NAV CLICK — smooth scroll to section
// --------------------------------------------------------------------

const initNavClick = () => {
  const navLinks = document.querySelectorAll('[data-nav-link]');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetId = link.dataset.navLink;
      const targetSection = document.getElementById(targetId);
      if (!targetSection) return;

      const navHeight = 56;
      const top = targetSection.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });

      // Set active immediately for responsiveness
      navLinks.forEach(l => l.classList.toggle('active', l === link));
    });
  });
};

// --------------------------------------------------------------------
// KEYBOARD NAVIGATION
// --------------------------------------------------------------------

const initKeyboardNav = () => {
  const links = Array.from(document.querySelectorAll('[data-nav-link]'));

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const visibleLinks = links.filter(l => l.offsetParent !== null);
    if (!visibleLinks.length) return;

    const num = parseInt(e.key);
    if (num >= 1 && num <= visibleLinks.length) {
      e.preventDefault();
      visibleLinks[num - 1].click();
      return;
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const activeIdx = visibleLinks.findIndex(l => l.classList.contains('active'));
      const step = e.key === 'ArrowRight' ? 1 : -1;
      const next = (activeIdx + step + visibleLinks.length) % visibleLinks.length;
      visibleLinks[next].click();
    }
  });
};

// --------------------------------------------------------------------
// FORM VALIDATION & SUBMIT
// --------------------------------------------------------------------

const initFormSubmit = () => {
  const form = document.querySelector('.contact-form form');
  if (!form) return;

  const inputs = form.querySelectorAll('[data-form-input]');
  const btn = form.querySelector('[data-form-btn]');
  const msgEl = form.querySelector('[data-form-message]');

  const validate = () => {
    const emailField = form.querySelector('input[type="email"]');
    let valid = Array.from(inputs).every(i => i.value.trim() !== '');
    if (emailField && emailField.value.trim() !== '') {
      valid = valid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim());
    }
    btn.disabled = !valid;
  };

  inputs.forEach(i => i.addEventListener('input', validate));
  validate();

  const showMessage = (type, text) => {
    msgEl.textContent = text;
    msgEl.className = 'form-message form-message--visible form-message--' + type;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (btn.disabled) return;

    btn.classList.add('form-btn--loading');
    btn.disabled = true;
    msgEl.className = 'form-message';

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, { method: 'POST', body: data });
      const json = await res.json();
      if (json.success) {
        showMessage('success', 'Message sent successfully! I\'ll get back to you soon.');
        form.reset();
        validate();
      } else {
        showMessage('error', json.message || 'Something went wrong. Please try again.');
        btn.disabled = false;
      }
    } catch {
      showMessage('error', 'Network error. Please check your connection and try again.');
      btn.disabled = false;
    }

    btn.classList.remove('form-btn--loading');
  });
};

// --------------------------------------------------------------------
// DYNAMIC CONTENT LOADING
// --------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

  initScrollSpy();
  initNavClick();
  initKeyboardNav();
  initFormSubmit();

  const showFetchError = (elementId, message = 'Could not load content. Please try again later.') => {
    const container = document.getElementById(elementId);
    if (!container) return;
    container.innerHTML = '<p class="fetch-error">' + message + '</p>';
  };

  // Populate Education
  const populateEducation = () => {
    const educationList = document.getElementById('education-list');
    if (!educationList) return;

    fetch('./assets/data/education.json')
      .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(data => {
        educationList.innerHTML = '';
        if (!data.length) {
          showFetchError('education-list', 'No education data available.');
          return;
        }
        data.forEach((edu) => {
          const item = document.createElement('li');
          item.className = 'timeline-item';
          item.innerHTML = '<h4 class="timeline-item-title">' + edu.institution + '</h4><span>' + edu.duration + '</span><p class="timeline-text">' + edu.description + '</p>';
          educationList.appendChild(item);
        });
      })
      .catch(error => {
        console.error('Error fetching education data:', error);
        showFetchError('education-list');
      });
  };

  // Populate Experience
  const populateExperience = () => {
    const experienceList = document.getElementById('experience-list');
    if (!experienceList) return;

    fetch('./assets/data/experience.json')
      .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(data => {
        experienceList.innerHTML = '';
        if (!data.length) {
          showFetchError('experience-list', 'No experience data available.');
          return;
        }
        data.forEach((exp) => {
          const item = document.createElement('li');
          item.className = 'timeline-item';
          item.innerHTML = '<h4 class="timeline-item-title">' + exp.role + '</h4><span>' + exp.date + '</span><p class="timeline-text">' + exp.description + '</p>';
          experienceList.appendChild(item);
        });
      })
      .catch(error => {
        console.error('Error fetching experience data:', error);
        showFetchError('experience-list');
      });
  };

  // Populate Events
  const populateEvents = () => {
    const eventsList = document.getElementById('events-list');
    if (!eventsList) return;

    fetch('./assets/data/events.json')
      .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(data => {
        eventsList.innerHTML = '';
        if (!data.length) {
          showFetchError('events-list', 'No events data available.');
          return;
        }
        data.forEach((event) => {
          const item = document.createElement('li');
          item.className = 'events-post-item';
          item.innerHTML = '<a href="' + event.url + '" target="_blank" rel="noopener noreferrer"><figure class="event-banner-box"><img src="' + event.image + '" alt="' + event.title + '" loading="lazy"></figure><div class="events-content"><div class="events-meta"><span class="event-category">' + event.category + '</span><span class="dot"></span><time datetime="' + event.date + '">' + event.formattedDate + '</time></div><h3 class="events-item-title">' + event.title + '</h3><p class="events-text">' + event.description + '</p></div></a>';
          eventsList.appendChild(item);
        });
      })
      .catch(error => {
        console.error('Error fetching events data:', error);
        showFetchError('events-list');
      });
  };

  // Populate Certificates
  const populateCertificates = () => {
    const certificatesGrid = document.getElementById('certificates-grid');
    if (!certificatesGrid) return;

    fetch('./assets/data/certificates.json')
      .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(data => {
        certificatesGrid.innerHTML = '';
        if (!data.length) {
          showFetchError('certificates-grid', 'No certificates available.');
          return;
        }
        data.forEach((cert) => {
          const certificateItem = document.createElement('div');
          certificateItem.className = 'certificate-item';
          certificateItem.innerHTML = '<a href="' + cert.url + '" target="_blank" rel="noopener noreferrer"><img src="' + cert.image + '" alt="' + cert.title + '" loading="lazy" onerror="this.parentElement.innerHTML=\'<div class=\\\\\'cert-placeholder\\\\\'>&gt; ' + cert.title.replace(/'/g, "\\'") + '</div>\'"></a><div class="certificate-content"><h3 class="certificate-title">' + cert.title + '</h3><p class="certificate-issuer">' + cert.issuer + '</p><time class="certificate-date">' + cert.date + '</time></div>';
          certificatesGrid.appendChild(certificateItem);
        });
      })
      .catch(error => {
        console.error('Error fetching certificates data:', error);
        showFetchError('certificates-grid');
      });
  };

  // Helper: timeAgo
  const timeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
      const years = Math.floor(interval);
      return years + ' year' + (years > 1 ? 's' : '') + ' ago';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      const months = Math.floor(interval);
      return months + ' month' + (months > 1 ? 's' : '') + ' ago';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      const days = Math.floor(interval);
      return days + ' day' + (days > 1 ? 's' : '') + ' ago';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      const hours = Math.floor(interval);
      return hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
    }
    interval = seconds / 60;
    if (interval > 1) {
      const minutes = Math.floor(interval);
      return minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ago';
    }
    return 'just now';
  };

  // Populate Projects
  const populateProjects = async () => {
    const projectList = document.getElementById('project-list');
    if (!projectList) return;

    try {
      const [projectsResponse, updatesResponse] = await Promise.all([
        fetch('./assets/data/projects.json'),
        fetch('./assets/data/last_updated.json')
      ]);

      if (!projectsResponse.ok) {
        throw new Error('Failed to load projects.json: ' + projectsResponse.statusText);
      }

      const projects = await projectsResponse.json();
      const updates = updatesResponse.ok ? await updatesResponse.json() : {};

      const projectsWithUpdates = projects.map(project => {
        const lastUpdated = project.github ? updates[project.github] : null;
        return { ...project, updated_at: lastUpdated };
      });

      projectsWithUpdates.sort((a, b) => {
        if (a.updated_at && b.updated_at) {
          return new Date(b.updated_at) - new Date(a.updated_at);
        }
        if (a.updated_at) return -1;
        if (b.updated_at) return 1;
        return 0;
      });

      projectList.innerHTML = '';
      projectsWithUpdates.forEach((project) => {
        const li = document.createElement('li');
        li.className = 'project-item active';
        li.setAttribute('data-filter-item', '');
        li.setAttribute('data-category', project.category.toLowerCase());

        const tagsHtml = project.tags
          .map(tag => '<span class="tag">' + tag + '</span>')
          .join('');

        const updatedHtml = project.updated_at
          ? '<p class="project-desc">Last updated: ' + timeAgo(project.updated_at) + '</p>'
          : '';

        li.innerHTML = '<a href="' + project.url + '" target="_blank" rel="noopener noreferrer"><div class="project-thumb"><img src="' + project.image + '" alt="' + project.alt + '" loading="lazy"></div><div class="project-body"><h3 class="project-title">' + project.title + '</h3><p class="project-desc">' + project.category_desc + '</p>' + updatedHtml + '</div><div class="project-tags">' + tagsHtml + '</div></a>';

        projectList.appendChild(li);
      });

      initializeProjectFilter();

    } catch (error) {
      console.error('Error loading projects:', error);
      projectList.innerHTML = '<li><p class="fetch-error">Could not load projects. Please try again later.</p></li>';
    }
  };

  // Initialize Project Filter
  const initializeProjectFilter = () => {
    const select = document.querySelector('[data-select]');
    const selectItems = document.querySelectorAll('[data-select-item]');
    const selectValue = document.querySelector('[data-selecct-value]');
    const filterBtns = document.querySelectorAll('[data-filter-btn]');
    const filterItems = document.querySelectorAll('[data-filter-item]');
    const indicator = document.querySelector('.filter-indicator');

    const updateFilterIndicator = (btn) => {
      if (!indicator || !btn) return;
      const wrapper = btn.closest('.filter-wrapper');
      if (!wrapper) return;
      const btnRect = btn.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      indicator.style.left = (btnRect.left - wrapperRect.left) + 'px';
      indicator.style.width = btnRect.width + 'px';
    };

    const filterFunc = function (selectedValue) {
      for (let i = 0; i < filterItems.length; i++) {
        if (selectedValue === 'all' || selectedValue === filterItems[i].dataset.category) {
          filterItems[i].classList.add('active');
        } else {
          filterItems[i].classList.remove('active');
        }
      }
    };

    if (indicator) {
      const initialActive = document.querySelector('.filter-item button.active');
      updateFilterIndicator(initialActive || filterBtns[0]);
    }

    let lastClickedBtn = filterBtns.length > 0 ? filterBtns[0] : null;
    if (lastClickedBtn) {
      for (let i = 0; i < filterBtns.length; i++) {
        filterBtns[i].addEventListener('click', function () {
          let selectedValue = this.innerText.toLowerCase();
          if (selectValue) selectValue.innerText = this.innerText;
          filterFunc(selectedValue);

          lastClickedBtn.classList.remove('active');
          this.classList.add('active');
          lastClickedBtn = this;

          updateFilterIndicator(this);
        });
      }
    }

    if (select) {
      select.addEventListener('click', function () { this.classList.toggle('active'); });

      for (let i = 0; i < selectItems.length; i++) {
        selectItems[i].addEventListener('click', function () {
          let selectedValue = this.innerText.toLowerCase();
          if (selectValue) selectValue.innerText = this.innerText;
          select.classList.remove('active');
          filterFunc(selectedValue);

          for (let j = 0; j < filterBtns.length; j++) {
            const match = filterBtns[j].innerText.toLowerCase() === selectedValue;
            filterBtns[j].classList.toggle('active', match);
            if (match) updateFilterIndicator(filterBtns[j]);
          }
        });
      }
    }
  };

  // Call all data loaders
  populateEducation();
  populateExperience();
  populateEvents();
  populateCertificates();
  populateProjects();

});
