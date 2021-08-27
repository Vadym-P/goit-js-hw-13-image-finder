import ImgApiService from './api-service';
import imagesTpl from '../templates/gallery.hbs';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/desktop/dist/PNotifyDesktop';
import '@pnotify/core/dist/BrightTheme.css';
import { error } from '@pnotify/core';

const refs = {
  searchForm: document.querySelector('.search-form'),
  input: document.querySelector('.input-field'),
  searchBtn: document.querySelector('.js-btn-src'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
  gallery: document.querySelector('.gallery'),
};
const imgApiService = new ImgApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
refs.input.addEventListener('input', clearInputField);

addHiddenClass();

function clearInputField(e) {
  const inputField = e.target.value.trim();
  if (inputField === '') {
    refs.gallery.innerHTML = '';
    addHiddenClass();
    return;
  }
}

function onSearch(e) {
  e.preventDefault();

  imgApiService.query = e.currentTarget.elements.query.value.trim();
  if (imgApiService.query === '') {
    error({
      title: `Nothing entered.`,
      text: `Please, enter search parameters!`,
      styling: 'brighttheme',
      delay: 3000,
    });
    return;
  } else {
    imgApiService.resetPage();
    imgApiService
      .fetchImages()
      .then(hits => {
        clearGalleryContainerNewRequest();
        appendImagesMarkup(hits);
      })
      .then(removeHidden);
  }
}

function onLoadMore() {
  imgApiService.fetchImages().then(appendImagesMarkup);
}

function appendImagesMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', imagesTpl(hits));
}

function clearGalleryContainerNewRequest() {
  refs.gallery.innerHTML = '';
  addHiddenClass();
}

function addHiddenClass() {
  refs.loadMoreBtn.classList.add('hidden');
}

function removeHidden() {
  refs.loadMoreBtn.classList.remove('hidden');
}
