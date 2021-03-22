// 1. Створити сайт використовуючи swapi.dev. вибрати 1 з 6 проперті (films, characters etc..)
// і зробити запит по них, вибрати одну з перших проперті що отримаєте і витягнувши з неї "url" -
// отримати конкретну(планету, фільм, персонажа) з всією інформацією про нього. Додати кнопку при
// натисканні на яку вивести всю наявну інформацію на екран красиво структуровано.

const formRef = document.querySelector(".form");
const contentRef = document.querySelector(".content");
const loadMoreBtnRef = document.querySelector('[data-action="load-more"]');
const loadMoreBtnLabelRef = document.querySelector(
  '[data-action="load-more"] > .label'
);
const spinerRef = document.querySelector(".spiner");
const spanRef = document.querySelector(".span");
const contentList = document.querySelector(".content");

const loadMoreBtn = {
  enable() {
    loadMoreBtnRef.disabled = false;
    loadMoreBtnLabelRef.textContent = "Load More";
    spinerRef.classList.add("is-hidden");
  },

  disable() {
    loadMoreBtnRef.disabled = true;
    loadMoreBtnLabelRef.textContent = "Load...";
    spinerRef.classList.remove("is-hidden");
  },

  show() {
    loadMoreBtnRef.classList.remove("is-hidden");
  },

  hide() {
    loadMoreBtnRef.classList.add("is-hidden");
  },
};

const searchQuery = {
  searchInput: null,
  search: null,
  page: 1,
};

formRef.addEventListener("submit", (e) => {
  e.preventDefault();
  searchQuery.searchInput = e.target[0].value.trim();
  searchQuery.search = e.target[1].value;
  searchQuery.page = 1;
  contentRef.innerHTML = "";
  spanRef.innerHTML = "";
  renderContent();
  loadMoreBtn.show();
  loadMoreBtn.disable();
});

function fetchApi() {
  loadMoreBtn.disable();

  const search = searchQuery.searchInput
    ? `search=${searchQuery.searchInput}&`
    : "";

  const baseUrl = `https://swapi.dev/api/${searchQuery.search}/?${search}page=${searchQuery.page}`;

  return fetch(baseUrl)
    .then((data) => data.json())
    .then(({ results }) => results);
}

function renderContent() {
  fetchApi().then((results) => {
    if (results.length !== 0) {
      results.forEach((item) => {
        const url = `https${item.url.slice(4)}`;

        contentRef.insertAdjacentHTML(
          "beforeend",
          `<li data-source="${item.url}">${item.name || item.title}</li>`
        );
      });
      loadMoreBtn.show();
      loadMoreBtn.enable();

      if (results.length < 10) {
        spanRef.innerHTML =
          "В данній категорії більше не має інформації. При потребі ви можете обрати іншу категорію";
        loadMoreBtn.hide();
      }

      if (searchQuery.page > 2) {
        window.scrollTo({
          top: document.documentElement.offsetHeight - 100,
        });
      }
    } else {
      error404();
    }
  });

  searchQuery.page += 1;
}

loadMoreBtnRef.addEventListener("click", renderContent);

function error404() {
  loadMoreBtn.hide();
  spanRef.innerHTML =
    "По вашому запиту інформація не знайдена. Прохання уточнити запит або обрати іншу категорію";
  spanRef.classList.add("red");
}

contentList.addEventListener("click", (e) => {
  document.querySelector(".backdrop").classList.add("active");

  fetch(e.target.dataset.source)
    .then((res) => res.json())
    .then((res) => handleModal(res));
});

function handleModal(data) {
  switch (true) {
    case data.url.includes("planets"):
      showPlanets(data);
      break;
    case data.url.includes("films"):
      showFilms(data);
      break;
    case data.url.includes("people"):
      showPeople(data);
      break;
    case data.url.includes("species"):
      showSpecies(data);
      break;
    case data.url.includes("starships"):
      showStarships(data);
      break;
    case data.url.includes("vehicles"):
      showVehicles(data);
      break;
    default:
      return;
  }
}

function showPlanets(data) {
  document.querySelector(".modal-title").textContent = `Планета ${data.name}`;

  const markupModal = `
    <li>Назва планети: ${data.name}</li>
    <li>Період обертання: ${
      data.rotation_period && "невідомо скільки"
    } годин</li>
    <li>Орбітальний період: ${
      data.orbital_period && "невідомо скільки"
    } днів</li>
    <li>Діаметр планети: ${data.diameter && "невідомо скільки"} км</li>
    <li>Клімат: ${data.climate && "невідомо"}</li>
    <li>Гравітація: ${data.gravity && "невідомо"}</li>
    <li>Місцевість: ${data.terrain && "невідомо"}</li>
    <li>Площа водневої поверхні: ${
      data.surface_water && "невідомо скільки"
    } %</li>
    <li>Населення: ${data.population && "невідомо скільки"} чол</li>
  `;

  document.querySelector(".list1").innerHTML = markupModal;
}

function showFilms(data) {
  document.querySelector(".modal-title").textContent = `Фільм ${data.title}`;

  const markupModal = `
    <li>Назва фільму: ${data.title}</li>
    <li>Епізод: ${data.episode_id}</li>
    <li>Деталі: ${data.opening_crawl}</li>
    <li>Директор: ${data.director}</li>
    <li>Продюсери: ${data.producer}</li>
    <li>Дата виходу в прокат: ${data.release_date}</li>   
  `;

  document.querySelector(".list1").innerHTML = markupModal;
}

function showPeople(data) {
  document.querySelector(".modal-title").textContent = `Персонаж ${data.name}`;

  const markupModal = `
    <li>Герой: ${data.name}</li>
    <li>Зріст: ${data.height} см</li>
    <li>Вага: ${data.mass} кг</li>
    <li>Колір волося: ${data.hair_color}</li>
    <li>Колір шкіри: ${data.skin_color}</li>
    <li>Колір очей: ${data.eye_color}</li>
    <li>Рік народження: ${data.birth_year}</li>
    <li>Стать: ${data.gender}</li>    
  `;

  document.querySelector(".list1").innerHTML = markupModal;
}

function showSpecies(data) {
  document.querySelector(".modal-title").textContent = `Різновид ${data.name}`;

  const markupModal = `
    <li>Різновид: ${data.name}</li>
    <li>Класифікація: ${data.classification}</li>
    <li>Значення: ${data.designation}</li>
    <li>Середній зріст: ${data.average_height} см</li>
    <li>Колір шкіри: ${data.skin_colors}</li>
    <li>Колір очей: ${data.eye_colors}</li>
    <li>Середня тривалість життя: ${data.average_lifespan} років</li>
    <li>Мова: ${data.language}</li>    
  `;

  document.querySelector(".list1").innerHTML = markupModal;
}

function showStarships(data) {
  document.querySelector(
    ".modal-title"
  ).textContent = `Зірковий корабль ${data.name}`;

  const markupModal = `
    <li>Зірковий корабль: ${data.name}</li>
    <li>Вантажопідйомність: ${data.cargo_capacity} тон</li>
    <li>Термін придатності: ${data.consumables} </li>
    <li>Вартість: ${data.cost_in_credits}</li>
    <li>Створений: ${data.created}</li>
    <li>Довжина: ${data.length} м</li>
    <li>Виробник: ${data.manufacturer}</li>
    <li>Модель: ${data.model}</li>    
  `;

  document.querySelector(".list1").innerHTML = markupModal;
}

function showVehicles(data) {
  document.querySelector(".modal-title").textContent = `Транспорт ${data.name}`;

  const markupModal = `
    <li>Транспорт: ${data.name}</li>
    <li>Модель: ${data.model}</li>    
    <li>Вантажопідйомність: ${data.cargo_capacity} тон</li>
    <li>Розхідні матеріали: ${data.consumables} </li>
    <li>Створений: ${data.created}</li>
    <li>Екіпаж: ${data.crew}</li>
    <li>Довжина: ${data.length} м</li>
    <li>Виробник: ${data.manufacturer}</li>
  `;

  document.querySelector(".list1").innerHTML = markupModal;
}

// Закриття модалки

document.querySelector(".backdrop").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    document.querySelector(".backdrop").classList.remove("active");
  }
});

document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".backdrop").classList.remove("active");
});

// 2. Використовуючи параметр серч, розробити сайт який буде з допомогою інпута робити пошук за
// конкретним параметром і виводити дані на сторінку. (якщо 1 знахідка - вивести всю інфу про айтем,
// якщо більше 1 то вивести список по філду).
