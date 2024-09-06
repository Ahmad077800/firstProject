document.addEventListener("DOMContentLoaded", function() {
    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar").innerHTML = data;
        });
});

const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector("[data-user-container]");
const searchInput = document.querySelector("[data-search]");
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageNumberDisplay = document.getElementById('pageNumber');

let users = [];
let currentPage = 1;
let usersPerPage = 4; 


if (window.location.pathname.includes("requests.html")) {
    usersPerPage = 20; 
}


searchInput.addEventListener("input", e => {
    currentPage = 1;
    displayUsers();
});


fetch('./data.json')
    .then(res => res.json())
    .then(data => {
        users = data.map(user => {
            const card = userCardTemplate.content.cloneNode(true).children[0];
            const name = card.querySelector("[data-name]");
            const submitted = card.querySelector("[data-Submitted]");
            const duration = card.querySelector("[data-duration]");
            const salary = card.querySelector("[data-salary]");
            const img = card.querySelector(".img-card");

            name.textContent = user.name;
            submitted.textContent = user.Submitted_on;
            duration.textContent = user.Duration;
            salary.textContent = user.Salary;
            img.src = user.image;

            card.classList.add("user-card");
            return {
                name: user.name,
                element: card
            };
        });
        displayUsers();
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

function displayUsers() {
    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchInput.value.toLowerCase()));
    userCardContainer.innerHTML = '';
    filteredUsers.slice(start, end).forEach(user => {
        userCardContainer.append(user.element);
    });

    pageNumberDisplay.textContent = currentPage;
    prevPageBtn.classList.toggle('disabled', currentPage === 1);
    nextPageBtn.classList.toggle('disabled', end >= filteredUsers.length);
}


prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayUsers();
    }
});


nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(users.length / usersPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayUsers();
    }
});


document.querySelector('.select-all').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.card-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.style.display = this.checked ? 'block' : 'none';
        checkbox.checked = this.checked;  
    });
});
