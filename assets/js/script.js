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
  const cards = document.querySelectorAll('.project-item, .certificate-item, .events-post-item');

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
        data.forEach((event, index) => {
          const item = document.createElement('li');
          item.className = 'event-post-item active fade-in-up';
          item.style.animationDelay = `${index * 0.1}s`;
          item.setAttribute("data-filter-item", "");
          item.setAttribute("data-category", event.type ? event.type.toLowerCase() : "organized");
          item.innerHTML = `<a href="${event.url}"><figure class="event-banner-box"><img src="${event.image}" alt="${event.title}" loading="lazy"></figure><div class="event-content"><div class="event-meta"><p class="event-category">${event.category}</p><span class="dot"></span><time datetime="${event.date}">${event.formattedDate}</time></div><h3 class="h3 event-item-title">${event.title}</h3><p class="event-text">${event.description}</p></div></a>`;
          eventsList.appendChild(item);
        });
        
        initializeProjectFilter();

        // Initialize tilt after DOM injection
        setTimeout(initTiltEffect, 500);
      })
      .catch(error => console.error('Error fetching events data:', error));
  };

  // Dynamically populate certificates section
  

  const populateCertificates = () => {
    const certificatesGrid = document.getElementById('certificates-grid');
    if (!certificatesGrid) return;

    showSkeleton('certificates-grid', 6, '200px');

    fetch('/assets/data/certificates.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status} while fetching certificates.json`);
        return response.json();
      })
      .then(data => {
        certificatesGrid.innerHTML = ''; // Clear skeletons
        data.forEach((cert, index) => {
          const certificateItem = document.createElement('div');
          certificateItem.className = 'certificate-item fade-in-up';
          certificateItem.style.animationDelay = `${index * 0.05}s`; // Faster stagger

          // Removed style="display:block; height:100%;" from anchor to fix text offset issue
          certificateItem.innerHTML = `
            <a href="${cert.url}" target="_blank" rel="noopener noreferrer">
              <img
                src="${cert.image}"
                alt="${cert.title}"
                loading="lazy"
              >
            </a>
            <div class="certificate-content">
              <h3 class="h4 certificate-title">${cert.title}</h3>
              <p class="certificate-issuer">${cert.issuer}</p>
              <time class="certificate-date">${cert.date}</time>
            </div>
          `;

          certificatesGrid.appendChild(certificateItem);
        });
        setTimeout(initTiltEffect, 500);
      })
      .catch(error => console.error('Error fetching certificates data:', error));
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

        li.innerHTML = `
                <a href="${project.url}" target="_blank" rel="noopener noreferrer" style="display: block; height: 100%;">
                    <figure class="project-img">
                        <div class="project-item-icon-box">
                            <ion-icon name="eye-outline"></ion-icon>
                        </div>
                        <img src="${project.image}" alt="${project.alt}" loading="lazy">
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
          btn.innerHTML = `${baseText}&nbsp;(${counts[cat]})`;
        }
      });
      
      const selectItems = document.querySelectorAll("[data-select-item]");
      selectItems.forEach(item => {
        let baseText = item.innerText.replace(/\s*\(\d+\)$/, '').trim();
        const cat = baseText.toLowerCase();
        if (counts[cat] !== undefined) {
          item.innerHTML = `${baseText}&nbsp;(${counts[cat]})`;
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
          let selectedValue = this.innerText.replace(/\s*\(\d+\)$/, '').toLowerCase().trim();
          if (selectValue) selectValue.innerText = this.innerText;
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
          let selectedCat = this.innerText.replace(/\s*\(\d+\)$/, '').toLowerCase().trim();
          if (selectValue) {
            selectValue.innerText = this.innerText;
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

  populateCertificates();
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
        } else {
          document.body.setAttribute("data-theme", "light");
          localStorage.setItem("theme", "light");
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
});
