'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// Dynamically populate experience section
document.addEventListener('DOMContentLoaded', () => {
  const experienceList = document.getElementById('experience-list');

  fetch('./assets/data/experience.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(exp => {
        const listItem = document.createElement('li');
        listItem.className = 'timeline-item';

        listItem.innerHTML = `
          <h4 class="h4 timeline-item-title">${exp.role}</h4>
          <span>${exp.date}</span>
          <p class="timeline-text">${exp.description}</p>
        `;

        experienceList.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error fetching experience data:', error));
});

// Dynamically populate education section
document.addEventListener('DOMContentLoaded', () => {
  const educationList = document.getElementById('education-list');

  fetch('./assets/data/education.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(edu => {
        const listItem = document.createElement('li');
        listItem.className = 'timeline-item';

        listItem.innerHTML = `
          <h4 class="h4 timeline-item-title">${edu.institution}</h4>
          <span>${edu.duration}</span>
          <p class="timeline-text">${edu.description}</p>
        `;

        educationList.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error fetching education data:', error));
});

// Dynamically populate events section
document.addEventListener('DOMContentLoaded', () => {
  const eventsList = document.getElementById('events-list');

  fetch('./assets/data/events.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(event => {
        const listItem = document.createElement('li');
        listItem.className = 'blog-post-item';

        listItem.innerHTML = `
          <a href="${event.url}" target="_blank">
            <figure class="blog-banner-box">
              <img src="${event.image}" alt="${event.title}" loading="lazy">
            </figure>
            <div class="blog-content">
              <div class="blog-meta">
                <p class="blog-category">${event.category}</p>
                <span class="dot"></span>
                <time datetime="${event.date}">${event.formattedDate}</time>
              </div>
              <h3 class="h3 blog-item-title">${event.title}</h3>
              <p class="blog-text">${event.description}</p>
            </div>
          </a>
        `;

        eventsList.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error fetching events data:', error));
});