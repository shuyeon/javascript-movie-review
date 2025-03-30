var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _state;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function Input({ placeholder, id }) {
  return `
        <input type="text" id="${id}" name="${id}" placeholder="${placeholder}"></input>
    `;
}
function SearchForm() {
  return `
    <form class="search-input-box" id="searchForm">
        ${Input({ placeholder: "검색어를 입력하세요", id: "searchInput" })}
        <button type="submit">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 14L10 10M11.3333 6.66667C11.3333 9.244 9.244 11.3333 6.66667 11.3333C4.08934 11.3333 2 9.244 2 6.66667C2 4.08934 4.08934 2 6.66667 2C9.244 2 11.3333 4.08934 11.3333 6.66667Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </form>
    `;
}
const getElement = (selector) => document.querySelector(selector);
const createElement = (tag) => document.createElement(tag);
function Header() {
  function template() {
    return `
    
     <h1 class="logo">
            <img src="./images/logo.png" alt="MovieList" />
        </h1>
    <div class="header-container">

            ${SearchForm()}
    </div>
    `;
  }
  function render() {
    getElement("header").innerHTML = template();
  }
  render();
  const $el = document.querySelector(".logo");
  $el.addEventListener("click", () => window.location.reload());
}
const MOVIE_COUNT_PER_PAGE = 20;
const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const RATING_MESSAGES = {
  "null": { comment: "별점 미등록", rating: "0" },
  "0": { comment: "최악이에요", rating: "2" },
  "1": { comment: "별로예요", rating: "4" },
  "2": { comment: "보통이에요", rating: "6" },
  "3": { comment: "재밌어요", rating: "8" },
  "4": { comment: "명작이에요", rating: "10" }
};
function MovieItem({ img, rating, title }) {
  function template() {
    const imgSrc = img ? `${BASE_IMAGE_URL}${img}` : "./images/nullImage.png";
    return `<div class="item">
      <div class="skeleton-loading">
        <div class="skeleton-image"></div>
        <img
          class="thumbnail"
          src="${imgSrc}"
          alt="${title}"
        />
        </div>

        <div class="item-desc">
        
        <div class="skeleton-loading">
          <div class="skeleton-image"></div>
          <p class="rate">
            <img src="./images/star_empty.png" class="star" /><span
              >${rating}</span>
          </p>
          </div>
          <div class="skeleton-loading">
            <div class="skeleton-image"></div>
            <strong>${title}</strong>
          </div>
        </div>
       
      </div>`;
  }
  return template();
}
function roundRating(value) {
  return Math.round(value * 10) / 10;
}
function MovieList(dataList) {
  function template() {
    const ul = createElement("ul");
    ul.classList.add("thumbnail-list");
    ul.id = "thumbnailList";
    dataList.forEach((data) => {
      const li = createElement("li");
      li.innerHTML = MovieItem({ img: data.poster_path, rating: roundRating(data.vote_average), title: data.title });
      li.id = data.id;
      ul.appendChild(li);
    });
    return ul;
  }
  return { template };
}
function hideskeleton() {
  const skeletonItem = document.querySelectorAll(".skeleton-image");
  skeletonItem.forEach((element) => {
    element.style.opacity = "0";
    element.style.display = "none";
  });
}
const createSkeletonData = Array(MOVIE_COUNT_PER_PAGE).fill({
  poster_path: null,
  title: null,
  vote_average: null
});
function Modal(id, content) {
  function createModalBackdrop(id2) {
    const $el = document.querySelector(".modal-background");
    $el.id = id2;
    $el.addEventListener("click", () => Modal.close(id2));
    return $el;
  }
  function createModalContainer(content2) {
    const $el = document.querySelector(".modal");
    $el.innerHTML = content2;
    $el.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }
  createModalBackdrop(id);
  createModalContainer(content);
}
Modal.open = function(id) {
  const $el = document.getElementById(id);
  $el.classList.add("active");
  Modal.keydownHandler = (e) => {
    if (e.key === "Escape") {
      Modal.close(id);
    }
  };
  document.addEventListener("keydown", Modal.keydownHandler, { once: true });
};
Modal.close = function(id) {
  const $el = document.getElementById(id);
  $el.classList.remove("active");
  if (Modal.keydownHandler) {
    document.removeEventListener("keydown", Modal.keydownHandler);
    Modal.keydownHandler = null;
  }
};
function StarButton(state2, i) {
  return state2 ? `<img src="./images/star_filled.png" id="${i}" class="star-button" />` : `<img src="./images/star_empty.png" id="${i}" class="star-button" />`;
}
function createStorage(key) {
  return {
    get() {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    },
    set(value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    clear() {
      localStorage.removeItem(key);
    }
  };
}
function MyRating(title) {
  const ratingData = createStorage(`${title}`);
  const data = ratingData.get();
  const rating = data ? data : "null";
  const stars = Array.from(
    { length: 5 },
    (_, i) => i <= rating ? StarButton(true, i) : StarButton(false, i)
  ).join("");
  setTimeout(() => {
    const starEls = document.querySelectorAll(".star-button");
    starEls.forEach((movieListEl) => {
      movieListEl.addEventListener("click", async (event) => {
        ratingData.set(movieListEl.id);
        updateMyRating(title);
      });
    });
  }, 0);
  return `
    <div class="my-rating">
        <div style="display: flex;">
             ${stars}
        </div>
        <div  style="display: flex; gap: 10px;">
            <div >${RATING_MESSAGES[rating].comment}</div>
            <div class="my-rating-text">${RATING_MESSAGES[rating].rating}/10</div>
        </div>
    </div>
    `;
}
function updateMyRating(title) {
  const myRating = MyRating(title);
  document.querySelector(".my-rating-container").innerHTML = myRating;
}
function MovieDetail({ poster_path, title, vote_average, release_date, genres, overview }) {
  const imgSrc = poster_path ? `${BASE_IMAGE_URL}${poster_path}` : "./images/nullImage.png";
  const genresName = genres.map((genre) => genre.name).join(", ");
  const year = release_date.split("-")[0];
  const rating = roundRating(vote_average);
  const myRating = MyRating(title);
  document.querySelectorAll(".star-button");
  return `
        <button class="close-modal">
          <img src="./images/modal_button_close.png" />
        </button>
        <div class="modal-container">
          <div class="modal-image">
              <img
                src="${imgSrc}"
                alt="${title}"
             />
          </div>
          <div class="modal-description">
            <h2>${title}</h2>
            <p class="category">
              ${year} · ${genresName}
            </p>
            <p class="rate">
              <span>평균</span>
                  <img src="./images/star_filled.png" class="star" />
                  <span class="rate-text">${rating}</span>
            </p>
            <hr class="line"/>
            <p class="label-text">
              내 별점
            </p>
            <div class="my-rating-container">
              ${myRating}
            </div>
            <hr class="line"/>
            <p class="label-text">줄거리</p>
            <p class="detail">
              ${overview}
            </p>
          </div>
        </div>`;
}
const state = {
  searchKeyword: null
};
async function fetchPopularMovies(pageIndex) {
  const popularMovieUrl = `${"https://api.themoviedb.org/3/"}movie/popular?language=ko-Kr&page=${pageIndex}`;
  return await fetchUtil(popularMovieUrl);
}
async function fetchSearchMovies(pageIndex) {
  const searchMovieUrl = `${"https://api.themoviedb.org/3/"}search/movie?query=${state.searchKeyword}&include_adult=false&language=en-US&page=${pageIndex}`;
  return await fetchUtil(searchMovieUrl);
}
async function fetchDetailMovie(movieId) {
  const detailMovie = `${"https://api.themoviedb.org/3/"}movie/${movieId}?language=ko-Kr`;
  return await fetchUtil(detailMovie);
}
async function fetchUtil(url) {
  const options = {
    headers: {
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZTAxM2I1YmViOGE1MjMxNDM0ZDc0OWJlYjM3YzU2NiIsIm5iZiI6MTc0MjI3MTc4My45NjgsInN1YiI6IjY3ZDhmNTI3ZTFlM2NkY2JmOWM2YTA5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Gw36ZrbKKajI3n99z42jbhM_RL4wC6_p9UGhmkLgUew"}`
    }
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 404) {
        alert("페이지를 찾을 수 없습니다.");
      } else if (response.status === 500) {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
      throw new Error(data.message || "An error occurred");
    }
    return data;
  } catch (error) {
    throw error;
  }
}
class MovieLayout {
  constructor(movieData) {
    __privateAdd(this, _state);
    __privateSet(this, _state, {
      title: "지금 인기 있는 영화",
      eventName: "readMoreMovieList",
      movieData
    });
    this.render();
  }
  async setState(newState) {
    __privateSet(this, _state, { ...__privateGet(this, _state), ...newState });
    this.render();
  }
  static skeletonRender() {
    const skeletonTemplate = `
        <h2 id="movieListTitle" class="text-xl"></h2>
        <div id="movieListContainer">
            ${MovieList(createSkeletonData).template().outerHTML}
        </div>
    `;
    const movieSectionEl = getElement("#MovieSection");
    if (movieSectionEl) movieSectionEl.innerHTML = skeletonTemplate;
  }
  template() {
    var _a;
    if (((_a = __privateGet(this, _state).movieData) == null ? void 0 : _a.length) === 0) {
      return `
            <div class="flex-center gap-16">
                <img src="./images/hangsung.png" />
                <div class="text-xl">검색 결과가 없습니다.</div>
            </div>
            `;
    }
    return `
            <h2 id="movieListTitle" class="text-xl">${__privateGet(this, _state).title}</h2>
            <div id="movieListContainer">
                ${MovieList(__privateGet(this, _state).movieData).template().outerHTML}
            </div>
        `;
  }
  render() {
    const movieSectionEl = getElement("#MovieSection");
    if (movieSectionEl) movieSectionEl.innerHTML = this.template();
    hideskeleton();
    const movieListEl = getElement(".thumbnail-list");
    movieListEl.addEventListener("click", async (event) => {
      const clickedItem = event.target.closest("li");
      const { poster_path, title, vote_average, release_date, genres, overview } = await fetchDetailMovie(clickedItem.id);
      Modal(`${clickedItem.id}modal`, MovieDetail({ poster_path, title, vote_average, release_date, genres, overview }));
      Modal.open(`${clickedItem.id}modal`);
    });
  }
  newMovieListRender(dataList) {
    var _a;
    if (dataList.length !== 0) {
      const ul = MovieList(dataList).template();
      (_a = getElement("#movieListContainer")) == null ? void 0 : _a.appendChild(ul);
      const movieListEls = document.querySelectorAll(".thumbnail-list");
      movieListEls.forEach((movieListEl) => {
        movieListEl.addEventListener("click", async (event) => {
          const clickedItem = event.target.closest("li");
          const { poster_path, title, vote_average, release_date, genres, overview } = await fetchDetailMovie(clickedItem.id);
          Modal(`${clickedItem.id}modal`, MovieDetail({ poster_path, title, vote_average, release_date, genres, overview }));
          Modal.open(`${clickedItem.id}modal`);
        });
      });
    }
  }
}
_state = new WeakMap();
async function submitEvent(movieLayout) {
  document.addEventListener("submit", onSubmit.bind(this));
  async function getSearchData(event, form) {
    event.preventDefault();
    const formData = new FormData(form);
    const searchKeyword = String(formData.get("searchInput"));
    state.searchKeyword = searchKeyword;
    const { results: searchData } = await fetchSearchMovies(1);
    movieLayout.setState({ title: `"${state.searchKeyword}" 검색 결과`, eventName: "readMoreSearchList", movieData: searchData, isPossibleMore: searchData.length === MOVIE_COUNT_PER_PAGE });
    const inputEl = document.querySelector("#searchInput");
    inputEl == null ? void 0 : inputEl.setAttribute("value", state.searchKeyword);
  }
  async function onSubmit(event) {
    var _a;
    event.preventDefault();
    const form = event.target;
    if (!form) return;
    if (form.id === "searchForm") {
      await getSearchData(event, form);
    }
    (_a = getElement("#bannerSection")) == null ? void 0 : _a.setAttribute("style", "display: none");
    window.scrollTo({ top: 0, behavior: "smooth" });
    form.reset();
  }
}
function Button(id, text) {
  return `
        <a>
            <button id="${id}" class="primary" style="width: 120px">${text}</button>
        </a>
    `;
}
async function Banner(data) {
  const { poster_path, title, vote_average, release_date, genres, overview } = await fetchDetailMovie(data.id);
  const bannerElement = getElement("#bannerSection");
  if (bannerElement) bannerElement.innerHTML = `
    <div class="background-container" style="background-image: url('https://media.themoviedb.org/t/p/w440_and_h660_face/${data.poster_path}');">
        <div class="overlay" aria-hidden="true"></div>
          <div class="top-rated-movie">
            <div class="rate">
              <img src="./images/star_empty.png" class="star" />
              <span class="rate-value">${roundRating(data.vote_average)}</span>
            </div>
            <div class="title">${data.title}</div>
            ${Button("자세히 보기", "자세히 보기")}
          </div>
        </div>
      </div>
    `;
  const detailButton = document.getElementById("자세히 보기");
  detailButton.addEventListener("click", () => {
    Modal(`${data.id}modal`, MovieDetail({ poster_path, title, vote_average, release_date, genres, overview }));
    Modal.open(`${data.id}modal`, MovieDetail({ poster_path, title, vote_average, release_date, genres, overview }));
  });
}
const intersectionObserver = (movieLayout) => {
  const $target = document.getElementById("loader");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const handleFetch = async () => {
          try {
            if (!state.searchKeyword) {
              readMoreMovieList(movieLayout);
            } else {
              readMoreSearchList(movieLayout);
            }
          } catch (error) {
            console.error(error);
            observer.disconnect();
          }
        };
        handleFetch();
      }
    });
  });
  observer.observe($target);
};
const readMoreMovieList = /* @__PURE__ */ function() {
  let pageIndex = 2;
  async function loadMovieData() {
    const { results, total_pages } = await fetchPopularMovies(pageIndex);
    pageIndex++;
    return results;
  }
  return async function(movieLayout) {
    const movieData = await loadMovieData();
    movieLayout.newMovieListRender(movieData);
    hideskeleton();
  };
}();
const readMoreSearchList = /* @__PURE__ */ function() {
  let pageIndex = 2;
  async function loadMovieData() {
    const { results, total_pages } = await fetchSearchMovies(pageIndex);
    pageIndex++;
    return results;
  }
  return async function(movieLayout) {
    const movieData = await loadMovieData();
    if (movieData) movieLayout.newMovieListRender(movieData);
    hideskeleton();
  };
}();
addEventListener("load", async () => {
  MovieLayout.skeletonRender();
  const movieData = await fetchPopularMovies(1);
  const movieLayout = new MovieLayout(movieData.results);
  Banner(movieData.results[0]);
  await submitEvent(movieLayout);
  Header();
  intersectionObserver(movieLayout);
});
