//Усложнённое задание
'use strict';

let citiesData, countryBlock;
const main = document.querySelector('.main');
const label = document.querySelector('label');
const inputCities = document.querySelector('.input-cities');
const selectCities = document.getElementById('select-cities');
const closeButton = document.querySelector('.close-button');
const dropdownLists = document.querySelector('.dropdown-lists');
const dropdownListsDefault = document.querySelector('.dropdown-lists__list--default');
const dropdownListsSelect = document.querySelector('.dropdown-lists__list--select');
const dropdownListsAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete');
const btnLink = document.querySelector('.button');
btnLink.removeAttribute('href');
const loader = document.getElementById('loader');
const emptySearch = {
  "name": "Ничего не найдено",
  "count": ""
};

const load = () => {
  inputCities.style.display = 'none';
  setTimeout(() => {
    inputCities.style.display = 'block';
    loader.remove();
  }, 1000);
};
load();

const loadData = (lang) => {
  return fetch('./db_cities.json')
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Status network not 200');
      }
      return response.json();
    })
    .then((response) => citiesData = response[lang])
    .catch(error => console.error(error));
};
loadData('RU');

const animate = (elem) => {
  elem.style.overflow = 'hidden';
  elem.style.display = 'block';
  elem.style.transform = 'translateX(100%)';
  let animation, count = 100;
  const transform = () => {
    animation = requestAnimationFrame(transform);
    count--;
    if (count >= 0) {
      elem.style.transform = `translateX(${count}%)`;
    } else {
      cancelAnimationFrame(animation);
    }
  };
  requestAnimationFrame(transform);
};

const render = (elem) => {
  const lists = elem.querySelector('.dropdown-lists__col');
  lists.textContent = '';
  countryBlock = document.createElement('div');
  countryBlock.classList.add('dropdown-lists__countryBlock');
  lists.prepend(countryBlock);
};
const itemCountry = (item) => {
  const div = document.createElement('div');
  div.classList.add('dropdown-lists__total-line');
  div.innerHTML = `
    <div class="dropdown-lists__country">${item.country}</div>
    <div class="dropdown-lists__count">${item.count}</div>
  `;
  countryBlock.append(div);
};
const cityList = (city) => {
  const divCity = document.createElement('div');
  divCity.classList.add('dropdown-lists__line');
  divCity.innerHTML = `
    <div class="dropdown-lists__city">${city.name}</div>
    <div class="dropdown-lists__count">${city.count}</div>`;
  countryBlock.append(divCity);
};

const getLink = (city) => {
  let link;
  citiesData.forEach((itemCountry) => {
    for (let i = 0; i < itemCountry.cities.length; i++) {
      if (city === itemCountry.cities[i].name) {
        link = itemCountry.cities[i].link;
        break;
      }
    }
  });
  return link;
};

const select = (target) => {
  const listsCity = document.querySelectorAll('.dropdown-lists__city');
  listsCity.forEach(item => {
    item.classList.remove('dropdown-lists__city--ip');
  });
  target.classList.add('dropdown-lists__city--ip');
  selectCities.value = target.textContent;
  btnLink.setAttribute('href', getLink(target.textContent));
  btnLink.setAttribute('target', '_blank');
};

const selectCountry = (target) => {
  document.querySelector('.dropdown-lists__list--default').style.display = 'none';
  const listSelect = document.querySelector('.dropdown-lists__list--select');
  animate(listSelect);
  selectCities.value = target.textContent;
  if (!listSelect.querySelector('.dropdown-lists__countryBlock')) {
    render(listSelect);
    citiesData.forEach((item) => {
      if (item.country === target.textContent) {
        itemCountry(item);
        item.cities.forEach((city) => {
          cityList(city);
        });
      }
    });
  }
};

const removed = () => {
  const countryBlock = document.querySelectorAll('.dropdown-lists__countryBlock');
  countryBlock.forEach(item => {
    item.remove();
  });
  btnLink.removeAttribute('href');
};

const removeAll = () => {
  selectCities.value = '';
  label.textContent = 'Страна или город';
  document.querySelector('.close-button').style.display = 'none';
  dropdownListsDefault.removeAttribute('style');
  dropdownListsSelect.removeAttribute('style');
  dropdownListsAutocomplete.removeAttribute('style');
};

const run = () => {
  removed();
  dropdownListsAutocomplete.style.display = 'none';
  dropdownListsDefault.removeAttribute('style');
  animate(dropdownListsDefault);
  render(dropdownListsDefault);
  closeButton.style.display = 'block';
  citiesData.forEach(item => {
    itemCountry(item);
    let countCity = 0;
    item.cities.forEach(city => {
      if (countCity >= 3) {
        return;
      } else {
        cityList(city);
        countCity++;
      }
    });
  });
};

const search = (text) => {
  const result = [];
  const pattern = new RegExp('^' + text, 'i');
  const replacerStrong = (str) => {
    return `<strong>${str}</strong>`;
  };
  citiesData.forEach((itemCountry) => {
    for (let i = 0; i < itemCountry.cities.length; i++) {
      if (pattern.test(itemCountry.cities[i].name)) {
        result.push(Object.create(itemCountry.cities[i]));
      }
    }
  });
  if (result.length === 0) {
    result.push(emptySearch);
  } else {
    result.forEach((item) => {
      item.name = item.name.replace(pattern, replacerStrong);
    });
  }
  return result;
};

dropdownLists.addEventListener('click', (event) => {
  label.textContent = '';
  const target = event.target;
  if (target.matches('.dropdown-lists__city')) {
    select(target);
  }
  if (target.matches('.dropdown-lists__country')) {
    selectCountry(target);
  }
});

main.addEventListener('click', (event) => {
  const target = event.target;
  if (target.matches('#select-cities')) {
    if (!document.querySelector('.dropdown-lists__countryBlock')) {
      run();
    }
  } else if (target.matches('.close-button') || target.matches('.main')) {
    removeAll();
    removed();
  } else if (target.matches('.button') && !btnLink.hasAttribute('href')) {
    removeAll();
    removed();
  }
});

selectCities.addEventListener('input', () => {
  dropdownListsDefault.style.display = 'none';
  dropdownListsSelect.style.display = 'none';
  dropdownListsAutocomplete.style.display = 'block';
  selectCities.value = selectCities.value.replace(/[^а-яё]/gi, '');
  const selectFilter = selectCities.value.toLowerCase();
  const resultInput = search(selectFilter);
  render(dropdownListsAutocomplete);
  resultInput.forEach((item) => {
    cityList(item);
  });
  if (selectCities.value === '') {
    run();
  }
});
