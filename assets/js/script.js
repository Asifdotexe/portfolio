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
      .then(response => response.json())
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
      .then(response => response.json())
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
      .then(response => response.json())
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
      .then(response => response.json())
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

  const populateProjects = () => {
    const projectList = document.getElementById('project-list');
    if (!projectList) return;

    fetch('./assets/data/projects.json')
      .then(response => response.json())
      .then(data => {
        // Step 1: Create and append all project items
        data.forEach(project => {
          const projectItem = document.createElement('li');
          // Add classes and data attributes for filtering
          projectItem.className = 'project-item active';
          projectItem.dataset.filterItem = '';
          projectItem.dataset.category = project.category;

          // Generate HTML for tags from the array
          const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

          projectItem.innerHTML = `
            <a href="${project.url}" target="_blank">
              <figure class="project-img">
                <img src="${project.image}" alt="${project.alt}" loading="lazy">
              </figure>
              <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-category">${project.category_desc}</p>
                <div class="project-tags">${tagsHtml}</div>
              </div>
            </a>
          `;
          projectList.appendChild(projectItem);
        });

        // Step 2: Initialize the filter functionality AFTER projects are loaded
        initializeProjectFilter();
      })
      .catch(error => console.error('Error fetching projects data:', error));
  };

  // Function to set up the project filtering event listeners
  const initializeProjectFilter = () => {
    const select = document.querySelector("[data-select]");
    const selectItems = document.querySelectorAll("[data-select-item]");
    const selectValue = document.querySelector("[data-selecct-value]");
    const filterBtn = document.querySelectorAll("[data-filter-btn]");

    // IMPORTANT: Select filterable items *after* they have been created
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

    if (select) {
        select.addEventListener("click", function () { elementToggleFunc(this); });
    }

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
  };

  // Call all the functions to load your dynamic content
  populateEducation();
  populateExperience();
  populateEvents();
  populateCertificates();
  populateProjects();

});