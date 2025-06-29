import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const formEl = document.querySelector('.form');
const inputEl = formEl.querySelector('input[name="search-text"]');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';
const PER_PAGE = 15;

formEl.addEventListener('submit', async event => {
  event.preventDefault();
  currentQuery = inputEl.value.trim();
  if (!currentQuery) return;

  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!data.hits.length) {
      iziToast.error({
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'bottomRight',
      });
    } else {
      createGallery(data.hits);

      const totalPages = Math.ceil(data.totalHits / PER_PAGE);
      if (currentPage >= totalPages) {
        hideLoadMoreButton();
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'bottomRight',
        });
      } else {
        showLoadMoreButton();
      }
    }
  } catch (error) {
    iziToast.error({ 
      message: 'Something went wrong. Please try again later.',
      position: 'bottomRight',
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);

    const totalPages = Math.ceil(data.totalHits / PER_PAGE);
    if (currentPage >= totalPages) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'bottomRight',
      });
    } else {
      showLoadMoreButton();
    }

    smoothScroll();
  } catch (error) {
    iziToast.error({
    message: 'Something went wrong. Please try again later.',
    position: 'bottomRight', });
  } finally {
    hideLoader();
  }
});

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}