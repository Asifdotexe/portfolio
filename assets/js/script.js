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

// Project filter select
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
if (select && selectItems.length > 0) {
  const selectValue = document.querySelector("[data-selecct-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");
  const filterItems = document.querySelectorAll("[data-filter-item]");
  const filterFunc = function (selectedValue) {
    filterItems.forEach(item => {
      if (selectedValue === "all" || selectedValue === item.dataset.category) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }
  select.addEventListener("click", function () { elementToggleFunc(this); });
  selectItems.forEach(item => {
    item.addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  });
  if (filterBtn.length > 0) {
    let lastClickedBtn = filterBtn[0];
    filterBtn.forEach(btn => {
      btn.addEventListener("click", function () {
        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);
        lastClickedBtn.classList.remove("active");
        this.classList.add("active");
        lastClickedBtn = this;
      });
    });
  }
}

// Page navigation
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");
if (navigationLinks.length > 0 && pages.length > 0) {
  navigationLinks.forEach(link => {
    link.addEventListener("click", function () {
      const targetPage = this.innerHTML.toLowerCase();
      pages.forEach(page => {
        page.classList.toggle("active", targetPage === page.dataset.page);
      });
      navigationLinks.forEach(navLink => {
        navLink.classList.toggle("active", navLink === this);
      });
      window.scrollTo(0, 0);
    });
  });
}

// --------------------------------------------------------------------
// DYNAMIC CONTENT LOADING (The Correct Way)
// --------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

  // Function to populate the Education section
  const populateEducation = () => {
    const educationList = document.getElementById('education-list');
    if (!educationList) return;
    fetch('./assets/data/education.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status} while fetching education.json`);
        return response.json();
      })
      .then(data => {
        data.forEach(edu => {
          const item = document.createElement('li');
          item.className = 'timeline-item';
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
    fetch('./assets/data/experience.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status} while fetching experience.json`);
        return response.json();
      })
      .then(data => {
        data.forEach(exp => {
          const item = document.createElement('li');
          item.className = 'timeline-item';
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
    fetch('./assets/data/events.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status} while fetching events.json`);
        return response.json();
      })
      .then(data => {
        data.forEach(event => {
          const item = document.createElement('li');
          item.className = 'blog-post-item';
          item.innerHTML = `<a href="${event.url}" target="_blank" rel="noopener noreferrer"><figure class="blog-banner-box"><img src="${event.image}" alt="${event.title}" loading="lazy"></figure><div class="blog-content"><div class="blog-meta"><p class="blog-category">${event.category}</p><span class="dot"></span><time datetime="${event.date}">${event.formattedDate}</time></div><h3 class="h3 blog-item-title">${event.title}</h3><p class="blog-text">${event.description}</p></div></a>`;
          eventsList.appendChild(item);
        });
      })
      .catch(error => console.error('Error fetching events data:', error));
  };

  // Dynamically populate certificates section
  const populateCertificates = () => {
    const certificatesGrid = document.getElementById('certificates-grid');
    if (!certificatesGrid) return; // Good practice to add this check
    fetch('./assets/data/certificates.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status} while fetching certificates.json`);
        return response.json();
      })
      .then(data => {
        data.forEach(cert => {
          const certificateItem = document.createElement('div');
          certificateItem.className = 'certificate-item';

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
      })
      .catch(error => console.error('Error fetching certificates data:', error));
  };

// Helper function to calculate relative time
const timeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000; // 365.25 days
    if (interval > 1) {
        const years = Math.floor(interval);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 2592000; // 30 days
    if (interval > 1) {
        const months = Math.floor(interval);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 86400; // 24 hours
    if (interval > 1) {
        const days = Math.floor(interval);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 3600; // 1 hour
    if (interval > 1) {
        const hours = Math.floor(interval);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 60;
    if (interval > 1) {
        const minutes = Math.floor(interval);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    return `just now`;
};

// Helper function to toggle active class (was missing from original script)
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

/**
 * Populates the project list from a JSON file, fetches GitHub data,
 * sorts by update date, and then renders the projects.
 */
const populateProjects = async () => {
    const projectList = document.getElementById("project-list");
    if (!projectList) return;

    try {
        // Step 1: Fetch project data from JSON file
        const response = await fetch("./assets/data/projects.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projects = await response.json();

        // Step 2: Fetch last updated info from GitHub for each project
        const projectsWithUpdates = await Promise.all(
            projects.map(async (project) => {
                // Use the 'github' field for a more direct API call
                if (project.github) {
                    try {
                        const apiUrl = `https://api.github.com/repos/${project.github}`;
                        const res = await fetch(apiUrl);
                        if (res.ok) {
                            const repoData = await res.json();
                            project.updated_at = repoData.updated_at; // Add updated_at to the project object
                        } else {
                            console.warn(`Could not fetch GitHub data for ${project.github}. Status: ${res.status}`);
                            project.updated_at = null;
                        }
                    } catch (err) {
                        console.error(`Error fetching GitHub data for ${project.github}:`, err);
                        project.updated_at = null;
                    }
                } else {
                    // Project is not on GitHub (e.g., Medium, Tableau)
                    project.updated_at = null;
                }
                return project;
            })
        );

        // Step 3: Sort projects by last updated date in descending order (newest first)
        projectsWithUpdates.sort((a, b) => {
            // Projects with update dates come before those without
            if (a.updated_at && b.updated_at) {
                return new Date(b.updated_at) - new Date(a.updated_at);
            }
            if (a.updated_at) return -1; // a comes first
            if (b.updated_at) return 1;  // b comes first
            return 0; // maintain original order if neither has a date
        });

        // Step 4: Render projects into the DOM
        projectList.innerHTML = ''; // Clear existing list before rendering
        projectsWithUpdates.forEach((project) => {
            const li = document.createElement("li");
            // Set data attributes for filtering and add default active class
            li.className = "project-item active";
            li.setAttribute("data-filter-item", "");
            li.setAttribute("data-category", project.category.toLowerCase());

            // Create HTML for tech stack tags
            const tagsHtml = project.tags
                .map((tag) => `<span class="tag">${tag}</span>`)
                .join("");

            // Create HTML for the 'last updated' date if it exists
            const updatedHtml = project.updated_at
                ? `<p class="project-category">Last updated: ${timeAgo(project.updated_at)}</p>`
                : "";

            li.innerHTML = `
                <a href="${project.url}" target="_blank" rel="noopener noreferrer">
                    <figure class="project-img">
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

        // Step 5: Initialize the filtering logic now that items are in the DOM
        initializeProjectFilter();

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

    // The core filtering function
    const filterFunc = function (selectedValue) {
        for (let i = 0; i < filterItems.length; i++) {
            if (selectedValue === "all" || selectedValue === filterItems[i].dataset.category) {
                filterItems[i].classList.add("active");
            } else {
                filterItems[i].classList.remove("active");
            }
        }
    }

    // Filter functionality for desktop buttons
    let lastClickedBtn = filterBtns[0];
    for (let i = 0; i < filterBtns.length; i++) {
        filterBtns[i].addEventListener("click", function () {
            let selectedValue = this.innerText.toLowerCase();
            filterFunc(selectedValue);

            lastClickedBtn.classList.remove("active");
            this.classList.add("active");
            lastClickedBtn = this;
        });
    }

    // Filter functionality for mobile select dropdown
    if (select) {
        select.addEventListener("click", function () { elementToggleFunc(this); });

        for (let i = 0; i < selectItems.length; i++) {
            selectItems[i].addEventListener("click", function () {
                let selectedValue = this.innerText.toLowerCase();
                selectValue.innerText = this.innerText;
                elementToggleFunc(select);
                filterFunc(selectedValue);
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

});