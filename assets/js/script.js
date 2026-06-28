'use strict';

// --------------------------------------------------------------------
// Original UI Functionality (Sidebar, Modals, Filters, Navigation)
// --------------------------------------------------------------------

// Element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// Sidebar
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}

// Testimonials modal
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");
if (modalContainer && modalCloseBtn && overlay) {
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");
  const testimonialsModalFunc = function () {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }
  testimonialsItem.forEach(item => {
    item.addEventListener("click", function () {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
      testimonialsModalFunc();
    });
  });
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);
}



// --------------------------------------------------------------------
// NEW VISUAL EFFECTS (Typewriter, Tilt)
// --------------------------------------------------------------------

const initTypewriter = () => {
  const titleElement = document.querySelector('.info-content .title');
  if (!titleElement) return;

  const roles = ["Data Scientist", "Python Developer", "Problem Solver", "Analyst"];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  titleElement.classList.add('typewriter-cursor');

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      titleElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      titleElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 150;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500; // Pause before new word
    }

    setTimeout(type, typeSpeed);
  }

  type();
};

const initTiltEffect = () => {
  const cards = document.querySelectorAll('.project-item, .certification-item, .events-post-item');

  cards.forEach(card => {
    // Add base style class
    card.classList.add('tilt-effect');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
      const rotateY = ((x - centerX) / centerX) * 5;

      // Apply transform to the CARD itself, not the inner link.
      // This fixes the issue where the image detached from the background.
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
};


// --------------------------------------------------------------------
// DYNAMIC CONTENT LOADING
// --------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

  initTypewriter();

  // Helper to add skeleton loading state
  const showSkeleton = (elementId, count = 3, height = '100px') => {
    const container = document.getElementById(elementId);
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const div = document.createElement('div');
      div.classList.add('skeleton');
      div.style.height = height;
      div.style.marginBottom = '20px';
      container.appendChild(div);
    }
  }

  // Function to populate the Education section
  const populateEducation = () => {
    const educationList = document.getElementById('education-list');
    if (!educationList) return;

    showSkeleton('education-list', 3, '80px'); // Optional: enable if fetch is slow

    fetch('/assets/data/education.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status} while fetching education.json`);
        return response.json();
      })
      .then(data => {
        educationList.innerHTML = ''; // Clear skeleton
        data.forEach((edu, index) => {
          const item = document.createElement('li');
          item.className = 'timeline-item fade-in-up';
          item.style.animationDelay = `${index * 0.1}s`;
          item.innerHTML = `<h4 class="h4 timeline-item-title">${edu.institution}</h4><span>${edu.duration}</span><p class="timeline-text">${edu.description}</p>`;
          educationList.appendChild(item);
        });
      })
      .catch(error => console.error('Error fetching education data:', error));
  };

  // Function to populate the Experience section
  const populateExperience = () => {
    const experienceList = document.getElementById('experience-list');
    if (!experienceList) return;
    fetch('/assets/data/experience.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status} while fetching experience.json`);
        return response.json();
      })
      .then(data => {
        data.forEach((exp, index) => {
          const item = document.createElement('li');
          item.className = 'timeline-item fade-in-up';
          item.style.animationDelay = `${index * 0.1}s`;
          item.innerHTML = `<h4 class="h4 timeline-item-title">${exp.role}</h4><span>${exp.date}</span><p class="timeline-text">${exp.description}</p>`;
          experienceList.appendChild(item);
        });
      })
      .catch(error => console.error('Error fetching experience data:', error));
  };

  // Function to populate the Events section
  const populateEvents = () => {
    const eventsList = document.getElementById('events-list');
    if (!eventsList) return;
    fetch('/assets/data/events.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status} while fetching events.json`);
        return response.json();
      })
      .then(data => {
        const counts = { all: data.length };
        data.forEach((event, index) => {
          const item = document.createElement('li');
          item.className = 'event-post-item active fade-in-up';
          item.style.animationDelay = `${index * 0.1}s`;
          item.setAttribute("data-filter-item", "");
          const cat = event.type ? event.type.toLowerCase() : "organized";
          item.setAttribute("data-category", cat);
          counts[cat] = (counts[cat] || 0) + 1;
          
          item.innerHTML = `<a href="${event.url}"><figure class="event-banner-box"><img src="${event.image}" alt="${event.title}" loading="lazy"></figure><div class="event-content"><div class="event-meta"><p class="event-category">${event.category}</p><span class="dot"></span><time datetime="${event.date}">${event.formattedDate}</time></div><h3 class="h3 event-item-title">${event.title}</h3><p class="event-text">${event.description}</p></div></a>`;
          eventsList.appendChild(item);
        });
        
        const filterBtns = document.querySelectorAll("[data-filter-btn]");
        filterBtns.forEach(btn => {
          let baseText = btn.childNodes[0].nodeValue.trim();
          const cat = baseText.toLowerCase();
          if (counts[cat] !== undefined) {
            btn.innerHTML = `${baseText} <span class="count-pill">${counts[cat]}</span>`;
          }
        });

        const selectItems = document.querySelectorAll("[data-select-item]");
        selectItems.forEach(item => {
          let baseText = item.childNodes[0].nodeValue.trim();
          const cat = baseText.toLowerCase();
          if (counts[cat] !== undefined) {
            item.innerHTML = `${baseText} <span class="count-pill">${counts[cat]}</span>`;
          }
        });

        initializeProjectFilter();

        // Initialize tilt after DOM injection
        setTimeout(initTiltEffect, 500);
      })
      .catch(error => console.error('Error fetching events data:', error));
  };

  // Dynamically populate certifications section
  

  const populateCertifications = () => {
    const certificationsGrid = document.getElementById('certifications-grid');
    if (!certificationsGrid) return;

    showSkeleton('certifications-grid', 6, '200px');

    fetch('/assets/data/certifications.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status} while fetching certifications.json`);
        return response.json();
      })
      .then(data => {
        certificationsGrid.innerHTML = ''; // Clear skeletons
        data.forEach((cert, index) => {
          const certificationItem = document.createElement('div');
          certificationItem.className = 'certification-item fade-in-up';
          certificationItem.style.animationDelay = `${index * 0.05}s`; // Faster stagger

          // Removed style="display:block; height:100%;" from anchor to fix text offset issue
          certificationItem.innerHTML = `
            <a href="${cert.url}" target="_blank" rel="noopener noreferrer">
              <img
                src="${cert.image}"
                alt="${cert.title}"
                loading="lazy"
              >
            </a>
            <div class="certification-content">
              <h3 class="h4 certification-title">${cert.title}</h3>
              <p class="certification-issuer">${cert.issuer}</p>
              <time class="certification-date">${cert.date}</time>
            </div>
          `;

          certificationsGrid.appendChild(certificationItem);
        });
        setTimeout(initTiltEffect, 500);
      })
      .catch(error => console.error('Error fetching certifications data:', error));
  };

  // Helper function to calculate relative time
  const timeAgo = (dateString) => {
    if (!dateString) return '';
    const diff = (new Date() - new Date(dateString)) / 1000;
    if (diff < 60) return 'just now';
    const units = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]];
    const [unit, secs] = units.find(([, s]) => diff >= s);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-Math.floor(diff / secs), unit);
  };

  /**
   * Populates the project list by combining data from local JSON files.
   */
  const populateProjects = async () => {
    const projectList = document.getElementById("project-list");
    if (!projectList) return;

    showSkeleton('project-list', 4, '150px');

    try {
      const [projectsResponse, updatesResponse] = await Promise.all([
        fetch("/assets/data/projects.json"),
        fetch("/assets/data/last_updated.json")
      ]);

      if (!projectsResponse.ok) {
        throw new Error(`Failed to load projects.json: ${projectsResponse.statusText}`);
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

      projectList.innerHTML = ''; // Clear skeletons
      projectsWithUpdates.forEach((project, index) => {
        const li = document.createElement("li");
        li.className = `project-item active fade-in-up ${index === 0 ? 'featured' : ''}`;
        li.style.animationDelay = `${index * 0.1}s`;
        li.setAttribute("data-filter-item", "");
        li.setAttribute("data-category", project.category.toLowerCase());

        const tagsHtml = project.tags
          .map((tag) => `<span class="tag">${tag}</span>`)
          .join("");

        const updatedHtml = project.updated_at
          ? '<p class="project-category">Last updated: ' + timeAgo(project.updated_at) + '</p>'
          : "";

        const isLight = document.body.getAttribute("data-theme") === "light";
        const lightImage = project.image.replace('.webp', '_light.webp');
        const currentImage = isLight ? lightImage : project.image;

        li.innerHTML = `
                <a href="${project.url}" target="_blank" rel="noopener noreferrer" style="display: block; height: 100%;">
                    <figure class="project-img">
                        <div class="project-item-icon-box">
                            <ion-icon name="eye-outline"></ion-icon>
                        </div>
                        <img src="${currentImage}" data-dark-src="${project.image}" data-light-src="${lightImage}" class="theme-aware-img" alt="${project.alt}" loading="lazy">
                    </figure>
                    <div class="project-info">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-category">${project.category_desc}</p>
                        ${updatedHtml}
                        <div class="project-tags">${tagsHtml}</div>
                    </div>
                </a>
            `;

        projectList.appendChild(li);
      });

      const counts = { all: projectsWithUpdates.length };
      projectsWithUpdates.forEach(project => {
        const cat = project.category.toLowerCase();
        counts[cat] = (counts[cat] || 0) + 1;
      });

      const filterBtns = document.querySelectorAll("[data-filter-btn]");
      filterBtns.forEach(btn => {
        let baseText = btn.innerText.replace(/\s*\(\d+\)$/, '').trim();
        const cat = baseText.toLowerCase();
        if (counts[cat] !== undefined) {
          btn.innerHTML = `${baseText} <span class="count-pill">${counts[cat]}</span>`;
        }
      });
      
      const selectItems = document.querySelectorAll("[data-select-item]");
      selectItems.forEach(item => {
        let baseText = item.innerText.replace(/\s*\(\d+\)$/, '').trim();
        const cat = baseText.toLowerCase();
        if (counts[cat] !== undefined) {
          item.innerHTML = `${baseText} <span class="count-pill">${counts[cat]}</span>`;
        }
      });

      initializeProjectFilter();
      setTimeout(initTiltEffect, 500);

    } catch (error) {
      console.error("Error loading or processing projects:", error);
      projectList.innerHTML = '<li><p>Could not load projects. Please try again later.</p></li>';
    }
  };


  /**
   * Sets up event listeners for project category filtering.
   */
  const initializeProjectFilter = () => {
    const select = document.querySelector("[data-select]");
    const selectItems = document.querySelectorAll("[data-select-item]");
    const selectValue = document.querySelector("[data-selecct-value]");
    const filterBtns = document.querySelectorAll("[data-filter-btn]");
    const filterItems = document.querySelectorAll("[data-filter-item]");

    const filterFunc = function (selectedValue) {
      for (let i = 0; i < filterItems.length; i++) {
        if (selectedValue === "all" || selectedValue === filterItems[i].dataset.category) {
          filterItems[i].classList.add("active");
        } else {
          filterItems[i].classList.remove("active");
        }
      }
    }

    let lastClickedBtn = filterBtns.length > 0 ? filterBtns[0] : null;
    if (lastClickedBtn) {
      for (let i = 0; i < filterBtns.length; i++) {
        filterBtns[i].addEventListener("click", function () {
          let selectedValue = this.childNodes[0].nodeValue.trim().toLowerCase();
          if (selectValue) selectValue.innerHTML = this.innerHTML;
          filterFunc(selectedValue);

          lastClickedBtn.classList.remove("active");
          this.classList.add("active");
          lastClickedBtn = this;
        });
      }
    }

    if (select) {
      select.addEventListener("click", function () { elementToggleFunc(this); });

      for (let i = 0; i < selectItems.length; i++) {
        selectItems[i].addEventListener("click", function () {
          let selectedCat = this.childNodes[0].nodeValue.trim().toLowerCase();
          if (selectValue) {
            selectValue.innerHTML = this.innerHTML;
          }
          elementToggleFunc(select);
          filterFunc(selectedCat);
        });
      }
    }
  };


  // Call all the functions to load your dynamic content
  populateEducation();
  populateExperience();
  populateEvents();

  populateCertifications();
  populateProjects();

  // Update footer year dynamically
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Theme Toggle Logic
  const themeBtns = document.querySelectorAll("[data-theme-btn]");
  if (themeBtns.length > 0) {
    const currentTheme = localStorage.getItem("theme") || "dark";
    if (currentTheme === "light") {
      document.body.setAttribute("data-theme", "light");
    }
    
    themeBtns.forEach(btn => {
      btn.addEventListener("click", function () {
        const isLight = document.body.getAttribute("data-theme") === "light";
        if (isLight) {
          document.body.removeAttribute("data-theme");
          localStorage.setItem("theme", "dark");
          document.querySelectorAll('.theme-aware-img').forEach(img => {
            if (img.hasAttribute('data-dark-src')) img.src = img.getAttribute('data-dark-src');
          });
        } else {
          document.body.setAttribute("data-theme", "light");
          localStorage.setItem("theme", "light");
          document.querySelectorAll('.theme-aware-img').forEach(img => {
            if (img.hasAttribute('data-light-src')) img.src = img.getAttribute('data-light-src');
          });
        }
      });
    });
  }

  // Keyboard Accelerators
  document.addEventListener("keydown", function(e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    
    // Theme toggle (M)
    if ((e.key === "m" || e.key === "M") && !e.ctrlKey && !e.metaKey) {
      const themeBtn = document.querySelector("[data-theme-btn]");
      if (themeBtn) themeBtn.click();
    }
    
    // Navigation (1-6)
    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
      const navLinks = [
        "/",               // 1: About
        "/projects/",      // 2: Projects
        "/certifications/",// 3: Certifications
        "/events/",        // 4: Events
        "/blogs/",         // 5: Blogs
        "/contact/"        // 6: Contact
      ];
      
      const num = parseInt(e.key);
      if (num >= 1 && num <= 6) {
        window.location.href = navLinks[num - 1];
      }
    }
  });

  // Fetch and render latest GitHub activity
  (async function() {
      var cacheKey = "latest_github_activity";
      var cacheExpiry = 60 * 60 * 1000; // 1 hour
  
      function renderRepoCard(repo, commit) {
        var el = document.getElementById('cwo-content');
        if (!el) return;
        
        var repoUrl = repo.html_url;
        var repoName = repo.name;
        var commitMsg = commit.commit.message.split('\n')[0];
        var commitUrl = commit.html_url;
        var commitDate = new Date(commit.commit.author.date).toLocaleDateString(undefined, {
          year: 'numeric', month: 'short', day: 'numeric'
        });
  
        el.innerHTML = `
          <div style="background: var(--eerie-black-2); border: 1px solid var(--jet); border-radius: 14px; padding: 20px; box-shadow: var(--shadow-2); transition: var(--transition-1);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
              <h4 class="h4" style="margin: 0;">
                <a href="${repoUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--white-2); text-decoration: none; transition: var(--transition-1);">${repoName}</a>
              </h4>
              <time style="color: var(--light-gray-70); font-size: var(--fs-6); display: flex; align-items: center; gap: 5px;">
                <ion-icon name="time-outline"></ion-icon>${commitDate}
              </time>
            </div>
            <p class="timeline-text" style="margin: 0; padding: 0;">
              <a href="${commitUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--light-gray); text-decoration: none; display: flex; align-items: flex-start; gap: 8px;">
                <ion-icon name="git-commit-outline" style="margin-top: 3px; color: var(--vibrant-green); flex-shrink: 0;"></ion-icon>
                <span style="transition: var(--transition-1);">${commitMsg}</span>
              </a>
            </p>
          </div>
        `;
      }
  
      try {
        var cached = localStorage.getItem(cacheKey);
        if (cached) {
          var parsed = JSON.parse(cached);
          if (new Date().getTime() - parsed.timestamp < cacheExpiry) {
            renderRepoCard(parsed.repo, parsed.commit);
            return; // Exit early using cache
          }
        }
      } catch(e) {
        console.warn("Failed to read cache", e);
      }
  
      try {
        var r = await fetch('https://api.github.com/users/Asifdotexe/repos?sort=pushed&per_page=1');
        if (!r.ok) throw new Error('repos API error');
        var repos = await r.json();
        if (!repos || repos.length === 0) throw new Error('no repos');
        var repo = repos[0];
        var branch = repo.default_branch || 'main';
  
        var c = await fetch('https://api.github.com/repos/Asifdotexe/' + repo.name + '/commits/' + branch);
        if (!c.ok) throw new Error('commits API error');
        var commit = await c.json();
  
        var msg = commit.commit.message;
        if (msg.indexOf('Merge ') === 0) {
          var cl = await fetch('https://api.github.com/repos/Asifdotexe/' + repo.name + '/commits?sha=' + branch + '&per_page=5');
          if (cl.ok) {
            var list = await cl.json();
            for (var i = 0; i < list.length; i++) {
              if (list[i].commit.message.indexOf('Merge ') !== 0) {
                var cr = await fetch('https://api.github.com/repos/Asifdotexe/' + repo.name + '/commits/' + list[i].sha);
                if (cr.ok) { commit = await cr.json(); break; }
              }
            }
          }
        }
  
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: new Date().getTime(),
            repo: repo,
            commit: commit
          }));
        } catch(e) {
          console.warn("Failed to write to cache", e);
        }
  
        renderRepoCard(repo, commit);
  
      } catch (e) {
        console.warn("GitHub API rate limit reached or error occurred. Showing fallback.", e);
        var el = document.getElementById('cwo-content');
        if (el) {
          el.innerHTML = `
            <div style="background: var(--eerie-black-2); border: 1px solid var(--jet); border-radius: 14px; padding: 20px; box-shadow: var(--shadow-2);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h4 class="h4" style="margin: 0; color: var(--white-2);">GitHub Activity</h4>
              </div>
              <p class="timeline-text" style="margin: 0; color: var(--light-gray-70);">
                API rate limit exceeded. Please check back later.
              </p>
            </div>
          `;
        }
      }
  })();
});
