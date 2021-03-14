//Усложнённое задание
'use strict';

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
const emptySearch = {
  "name": "Ничего не найдено",
  "count": ""
};

//Импорт из переменной data файла db_cities
const citiesData = data['RU']; //jshint ignore:line

let countryBlock;
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
      <div class="dropdown-lists__city" data-link="${city.link}">${city.name}</div>
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
  dropdownListsDefault.style.display = 'none';
  dropdownListsSelect.style.display = 'block';
  selectCities.value = target.textContent;
  if (!dropdownListsSelect.querySelector('.dropdown-lists__countryBlock')) {
    render(dropdownListsSelect);
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
  const closeBlock = document.querySelectorAll('.dropdown-lists__countryBlock');
  closeBlock.forEach(item => {
    item.remove();
  });
  btnLink.removeAttribute('href');
};

const removeAll = () => {
  selectCities.value = '';
  label.textContent = 'Страна или город';
  closeButton.style.display = 'none';
  dropdownListsDefault.removeAttribute('style');
  dropdownListsSelect.removeAttribute('style');
  dropdownListsAutocomplete.removeAttribute('style');
};

const run = () => {
  removed();
  dropdownListsAutocomplete.style.display = 'none';
  dropdownListsDefault.removeAttribute('style');
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
  const result = [];
  render(dropdownListsAutocomplete);
  citiesData.forEach((item) => {
    item.cities.forEach((city) => {
      const itemCity = city.name.toLowerCase();
      if (selectFilter === itemCity.substring(0, selectFilter.length)) {
        result.push(city);
        cityList(city);
      }
    });
  });
  if (result.length === 0) {
    cityList(emptySearch);
  } else if (selectCities.value === '') {
    run();
  }
});
