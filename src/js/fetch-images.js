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
  labelLoadMoreBtn: document.querySelector('.label-load-more__btn'),
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

  clearGalleryContainerNewRequest();
  imgApiService.query = e.currentTarget.elements.query.value.trim();
  if (imgApiService.query === '') {
    return error({
      title: `Nothing entered.`,
      text: `Please, enter search parameters!`,
      styling: 'brighttheme',
      delay: 3000,
    });
  } else {
    removeHiddenClass();
    addSpinner();
    imgApiService.resetPage();
    imgApiService.fetchImages().then(hits => {
      appendImagesMarkup(hits);
      removeSpinner();
      removeHiddenClass();
    });
  }
}

function onLoadMore() {
  addSpinner();
  imgApiService.fetchImages().then(appendImagesMarkup).then(() => removeSpinner());
  
}

function appendImagesMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', imagesTpl(hits));
}

function clearGalleryContainerNewRequest() {
  refs.gallery.innerHTML = '';
  addHiddenClass();
}

function addHiddenClass() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

function removeHiddenClass() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function addSpinner() {
  refs.labelLoadMoreBtn.textContent = 'Loading';
  refs.loadMoreBtn.setAttribute('disabled', true);
  refs.loadMoreBtn.classList.add('spin');
}

function removeSpinner() {
  refs.labelLoadMoreBtn.textContent = 'Load more';
  refs.loadMoreBtn.removeAttribute('disabled');
  refs.loadMoreBtn.classList.remove('spin');
}
