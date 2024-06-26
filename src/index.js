import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const divEL = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

// const loadMore = document.createElement('button');
// loadMore.type = 'button';
// loadMore.textContent = 'Load more';
// loadMore.classList.add('load-more');
// loadMore.after(divEL);

loadMore.setAttribute('hidden', true);

console.log(loadMore);

const BASE_URL = 'https://pixabay.com/api/';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

lightbox.refresh();

let page = 6;

async function fetchImages(q, page = 1) {
  try {
    const res = await axios.get(BASE_URL, {
      params: {
        key: '41146356-b4088fdd71d4692a67ba75dd6',
        q,
        page,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    console.log(res.data.hits);
    return res.data.hits;
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

  //   loadMore.classList.remove('is-hidden');
  divEL.innerHTML = '';
  //   loadMore.setAttribute('hidden', false);

  fetchImages(e.target.elements.searchQuery.value, page)
    .then(hits => markupImages(hits))
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
      //   selectEl.setAttribute("hidden", true);
    })
    .finally(() => {
      loadMore.classList.add('hidden');

      //   loaderEl.classList.add("is-hidden");
    });
}

function markupImages(hits) {
  const markup = hits
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
  divEL.innerHTML = markup;
}
