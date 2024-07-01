import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const formEl = document.querySelector('.search-form');
const divEL = document.querySelector('.gallery');
const loadMore = document.querySelector('.selector');

let page;
let currentQuery = '';

loadMore.classList.replace('load-more', 'visually-hidden');

const BASE_URL = 'https://pixabay.com/api/';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

// lightbox.refresh();

async function fetchImages(q, page) {
  try {
    const res = await axios.get(BASE_URL, {
      params: {
        key: '41146356-b4088fdd71d4692a67ba75dd6',
        q,
        page,
        per_page: 40,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err.message);
    throw err;
  } finally {
    console.log('finally');
  }
}

formEl.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  page = 1;
  Notiflix.Loading.circle('Searching...');

  divEL.innerHTML = '';

  currentQuery = e.target.elements.searchQuery.value;
  console.log(currentQuery);
  //   loadMore.setAttribute('visually-hidden', false);

  fetchImages(currentQuery, page)
    .then(data => {
      markupImages(data);
      Notiflix.Loading.remove();
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      loadMore.classList.replace('visually-hidden', 'load-more');
      formEl.reset();
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
      //   selectEl.setAttribute("hidden", true);
    })
    .finally(() => {});
}

function markupImages(data) {
  const markup = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card"><a class="gallery_link" href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a><div class="info"><p class="info-item"><b>Likes: ${likes}</b></p><p class="info-item"><b>Views: ${views}</b></p><p class="info-item"><b>Comments: ${comments}</b></p><p class="info-item"><b>Downloads: ${downloads}</b></p></div></div>`;
      }
    )
    .join('');
  divEL.insertAdjacentHTML('beforeend', markup);
}

loadMore.addEventListener('click', handleClick);

function handleClick(e) {
  page += 1;
  Notiflix.Loading.hourglass('Download...');

  fetchImages(currentQuery, page).then(data => {
    const maxPages = Math.ceil(data.totalHits / 40);

    if (data.totalHits === 0 || currentQuery.trim() === '') {
      Notify.warning('Please, fill the main field');
      return;
    }
    markupImages(data);
    lightbox.refresh();

    if (page === maxPages) {
      loadMore.classList.replace('load-more', 'visually-hidden');
    }
    Notiflix.Loading.remove();

    console.log(data.hits);

    // if (data.hits >= data.totalHits) {
    //   loadMore.classList.replace('load-more', 'visually-hidden');
    // }
  });
}
