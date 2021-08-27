import ImgApiService from './api-service';
import imagesTpl from '../templates/gallery.hbs'

const refs = {
    searchForm: document.querySelector('.search-form'),
    // input: document.querySelector('.input-field'),
    searchBtn: document.querySelector('.js-btn-src'),
    loadMoreBtn: document.querySelector('[data-action="load-more"]'),
    gallery: document.querySelector('.gallery-container'),
}
const imgApiService = new ImgApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore)


function onSearch(e) {
    e.preventDefault();
    imgApiService.query = e.currentTarget.elements.query.value;
    imgApiService.resetPage();
    imgApiService.fetchImages().then(appendImagesMarkup);
}

function onLoadMore() {
    imgApiService.fetchImages().then(appendImagesMarkup);
}

function appendImagesMarkup(image) {
    refs.gallery.innerHTML = imagesTpl(image);
}



