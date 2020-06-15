const employeeGallery = document.getElementById("gallery");

let employeeCardData = [];

// creates search bar and then uses the serachName function to filter and display employees by name.
const searchContainer = document.querySelector(".search-container");
const search = document.createElement("form");
search.action = "#";
search.method = "get";
search.id = "search-form";
search.innerHTML = `<input type="search" id="search-input" class="search-input" placeholder="Search...">
<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">`;
searchContainer.appendChild(search);

document.getElementById("search-form").addEventListener("submit", searchName);

function searchName() {
  const nameQuery = document.getElementById("search-input").value.toLowerCase();
  const employeeCards = Array.from(document.getElementsByClassName("card"));

  employeeCards.forEach((employeeCard) => {
    const employeeName = employeeCard
      .getElementsByClassName("card-name")[0]
      .innerHTML.toLowerCase();

    if (employeeName.includes(nameQuery)) {
      employeeCard.style.display = "";
    } else {
      employeeCard.style.display = "none";
    }
  });
}

//Requests random user data
function fetchData(url) {
  return fetch(url)
    .then((employeeData) => employeeData.json())
    .then((employeeData) => employeeData.results);
}

//Creates a modal window for a selected employee.
//Toggle feature allows for user to click between employees using window buttons.

function showModalWindow(i) {
  if (i > employeeCardData.length - 1) {
    i = 0;
  } else if (i < 0) {
    i = 11;
  }

  const lastModalWindow = document.getElementsByClassName("modal-container")[0];

  if (lastModalWindow) {
    lastModalWindow.remove();
  }

  const modalWindowContainer = document.createElement("div");
  modalWindowContainer.classList.add("modal-container");

  const modalWindow = document.createElement("div");
  modalWindow.classList.add("modal");

  const windowCloseBtn = document.createElement("button");
  windowCloseBtn.classList.add("modal-close-btn");
  windowCloseBtn.id = "modal-close-btn";
  windowCloseBtn.innerHTML = "<strong>X</strong>";

  const infoContainer = document.createElement("div");
  infoContainer.classList.add("modal-info-container");
  infoContainer.innerHTML = `<img class="modal-img" src=${employeeCardData[i].image} alt="profile picture">
  <h3 id="name" class="modal-name cap">${employeeCardData[i].name}</h3>
  <p class="modal-text">${employeeCardData[i].email}</p>
  <p class="modal-text cap">${employeeCardData[i].city}</p>
  <hr>
  <p class="modal-text">${employeeCardData[i].phone}</p>
  <p class="modal-text">${employeeCardData[i].address}</p>
  <p class="modal-text">Birthday: ${employeeCardData[i].birthday}</p>`;

  employeeGallery.appendChild(modalWindowContainer);
  modalWindowContainer.appendChild(modalWindow);
  modalWindow.appendChild(windowCloseBtn);
  modalWindow.appendChild(infoContainer);

  const modalBtnContainer = document.createElement("div");
  modalBtnContainer.classList.add("modal-btn-container");
  modalBtnContainer.innerHTML = `<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
  <button type="button" id="modal-next" class="modal-next btn">Next</button>`;
  modalWindow.appendChild(modalBtnContainer);

  document.getElementById("modal-prev").addEventListener("click", () => {
    showModalWindow(i - 1);
  });
  document.getElementById("modal-next").addEventListener("click", () => {
    showModalWindow(i + 1);
  });

  windowCloseBtn.addEventListener("click", () => {
    modalWindowContainer.remove();
  });
}

//Formats raw birthday data
function formatBirthday(rawBirthday) {
  const regex = /(\d{2})(\d{2})-(\d{2})-(\d{2})/;
  bday = rawBirthday.match(regex);
  return bday[3] + "/" + bday[4] + "/" + bday[2];
}
// Formats raw address data
function formatAddress(rawAddress) {
  const street = rawAddress.street.number + " " + rawAddress.street.name;
  return `${street}, ${rawAddress.state} ${rawAddress.postcode}`;
}

// Creates employee cards to populate in gallery
function createEmployeeCards(employeeData) {
  employeeCardData = employeeData.map((employee) => ({
    name: `${employee.name.first} ${employee.name.last}`,
    email: employee.email,
    city: employee.location.city,
    image: employee.picture.thumbnail,
    phone: employee.phone,
    birthday: formatBirthday(employee.dob.date),
    address: formatAddress(employee.location),
  }));

  for (let i = 0; i < employeeData.length; i++) {
    const employeeCard = document.createElement("div");
    employeeCard.classList.add("card");

    const employeeImageContainer = document.createElement("div");
    employeeImageContainer.classList.add("card-img-container");
    employeeImageContainer.innerHTML = `<img class="card-img" src=${employeeCardData[i].image} alt="profile picture"></img>`;

    const employeeInfoContainer = document.createElement("div");
    employeeInfoContainer.classList.add("card-info-container");
    employeeInfoContainer.innerHTML = `<h3 id="name" class="card-name cap">${employeeCardData[i].name}</h3>
    <p class="card-text">${employeeCardData[i].email}</p>
    <p class="card-text cap">${employeeCardData[i].city}</p>`;

    employeeGallery.appendChild(employeeCard);
    employeeCard.appendChild(employeeImageContainer);
    employeeCard.appendChild(employeeInfoContainer);

    employeeCard.addEventListener("click", () => {
      showModalWindow(i);
    });
  }
}

//Fetches and formats employee data and then populates gallery with formatted data.
async function createEmployeeGallery() {
  const employeeData = await fetchData(
    "https://randomuser.me/api/?results=12&nat=us"
  );
  createEmployeeCards(employeeData);
}

createEmployeeGallery();
