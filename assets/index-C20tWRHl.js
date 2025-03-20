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
function Input({ placeholder, eventName, id }) {
  return `
        <input type="text" id="${id}" name="${id}" data-action="${eventName}" placeholder="${placeholder}"></input>
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
function Header() {
  function template() {
    return `
    
     <h1 class="logo" data-action="reload">
            <img data-action="reload" src="./images/logo.png" alt="MovieList" />
        </h1>
    <div class="header-container">

            ${SearchForm()}
    </div>
    `;
  }
  function render() {
    document.querySelector("header").innerHTML = template();
  }
  render();
}
const createElement = (tag) => document.createElement(tag);
const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
function MovieItem({ img, rating, title }) {
  function template() {
    const imgSrc = img ? `${BASE_IMAGE_URL}${img}` : "./images/nullImage.png";
    return `<div class="item">
      <div class="skeleton-loading" data-action="skeletonEvent">
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
    const docfrag = document.createDocumentFragment();
    dataList.forEach((data) => {
      const li = createElement("li");
      li.innerHTML = MovieItem({ img: data.poster_path, rating: roundRating(data.vote_average), title: data.title });
      docfrag.appendChild(li);
    });
    ul.appendChild(docfrag);
    return ul;
  }
  return { template };
}
function Button({ content, eventName, type, width }) {
  return `
        <button type="${type}" style=${`width: ${width}`} class="primary" data-action="${eventName}">${content}</button>
    `;
}
function hideskeleton() {
  const skeletonItem = document.querySelectorAll(".skeleton-image");
  skeletonItem.forEach((element) => {
    setTimeout(() => {
      element.style.opacity = "0";
      element.style.display = "none";
    }, 300);
  });
}
const createSkeletonData = Array(20).fill({
  poster_path: null,
  title: null,
  vote_average: null
});
class MovieLayout {
  constructor(movieData) {
    __privateAdd(this, _state);
    __privateSet(this, _state, {
      title: "지금 인기 있는 영화",
      eventName: "readMoreMovieList",
      isPossibleMore: movieData.length === 20,
      movieData
    });
    this.render();
  }
  setState(newState) {
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
    const movieSectionEl = document.getElementById("MovieSection");
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
            ${__privateGet(this, _state).isPossibleMore ? Button({ content: "더보기", eventName: __privateGet(this, _state).eventName, type: "t", width: "100%" }) : ""}
        `;
  }
  render() {
    const movieSectionEl = document.getElementById("MovieSection");
    if (movieSectionEl) movieSectionEl.innerHTML = this.template();
    hideskeleton();
  }
  newMovieListRender(dataList) {
    var _a;
    const ul = MovieList(dataList).template();
    (_a = document.getElementById("movieListContainer")) == null ? void 0 : _a.appendChild(ul);
  }
}
_state = new WeakMap();
async function fetchPopularMovies(pageIndex) {
  const popularMovieUrl = `https://api.themoviedb.org/3/movie/popular?language=ko-Kr&page=${pageIndex}`;
  return await fetchUtil(popularMovieUrl);
}
async function fetchSearchMovies(searchKeyword, pageIndex) {
  const searchMovieUrl = `https://api.themoviedb.org/3/search/movie?query=${searchKeyword}&include_adult=false&language=en-US&page=${pageIndex}`;
  return await fetchUtil(searchMovieUrl);
}
async function fetchUtil(url) {
  const options = {
    headers: {
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZTAxM2I1YmViOGE1MjMxNDM0ZDc0OWJlYjM3YzU2NiIsIm5iZiI6MTc0MjI3MTc4My45NjgsInN1YiI6IjY3ZDhmNTI3ZTFlM2NkY2JmOWM2YTA5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Gw36ZrbKKajI3n99z42jbhM_RL4wC6_p9UGhmkLgUew"}`
    }
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    alert("서버와의 연결이 끊어졌습니다");
  }
  const { results, total_pages } = await response.json();
  return { results, total_pages };
}
function removeButton(movieLayout, total_pages, pageIndex) {
  if (total_pages < pageIndex) {
    movieLayout.setState(
      {
        isPossibleMore: false
      }
    );
  }
}
async function clickEvent(movieLayout) {
  document.addEventListener("click", onClick);
  function reload() {
    location.reload();
  }
  const readMoreMovieList = function() {
    let pageIndex = 2;
    setTimeout(hideskeleton, 500);
    async function loadMovieData() {
      const { results, total_pages } = await fetchPopularMovies(pageIndex);
      pageIndex++;
      removeButton(movieLayout, total_pages, pageIndex);
      return results;
    }
    return async function() {
      const movieData = await loadMovieData();
      movieLayout.newMovieListRender(movieData);
      hideskeleton();
    };
  }();
  const readMoreSearchList = /* @__PURE__ */ function() {
    let pageIndex = 2;
    async function loadMovieData() {
      var _a;
      const layoutTitleText = (_a = document.getElementById("movieListTitle")) == null ? void 0 : _a.innerText;
      const regex = /"([^"]*)"/;
      const match = layoutTitleText == null ? void 0 : layoutTitleText.match(regex);
      if (!match) {
        console.error("검색어를 찾을 수 없습니다:", layoutTitleText);
        return;
      }
      const searchKeyword = match[1];
      const { results, total_pages } = await fetchSearchMovies(searchKeyword, pageIndex);
      pageIndex++;
      removeButton(movieLayout, total_pages, pageIndex);
      return results;
    }
    return async function() {
      const movieData = await loadMovieData();
      if (movieData) movieLayout.newMovieListRender(movieData);
      hideskeleton();
    };
  }();
  async function onClick(event) {
    const target = event.target instanceof Element ? event.target.closest("[data-action]") : null;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action === "readMoreMovieList") {
      await readMoreMovieList();
    }
    if (target.dataset.action === "readMoreSearchList") {
      await readMoreSearchList();
    }
    if (target.dataset.action === "reload") reload();
  }
}
async function submitEvent(movieLayout) {
  document.addEventListener("submit", onSubmit.bind(this));
  async function getSearchData(event, form) {
    event.preventDefault();
    const formData = new FormData(form);
    const searchKeyword = String(formData.get("searchInput"));
    const { results: searchData } = await fetchSearchMovies(searchKeyword, 1);
    movieLayout.setState({ title: `"${searchKeyword}" 검색 결과`, eventName: "readMoreSearchList", movieData: searchData, isPossibleMore: searchData.length === 20 });
  }
  async function onSubmit(event) {
    var _a;
    event.preventDefault();
    const form = event.target;
    if (!form) return;
    if (form.id === "searchForm") {
      await getSearchData(event, form);
    }
    (_a = document.getElementById("bannerSection")) == null ? void 0 : _a.setAttribute("style", "display: none");
    window.scrollTo({ top: 0, behavior: "smooth" });
    form.reset();
  }
}
function Banner(data) {
  return `
    <div class="background-container" style="background-image: url('https://media.themoviedb.org/t/p/w440_and_h660_face/${data.poster_path}');">
        <div class="overlay" aria-hidden="true"></div>
          <div class="top-rated-movie">
            <div class="rate">
              <img src="./images/star_empty.png" class="star" />
              <span class="rate-value">${roundRating(data.vote_average)}</span>
            </div>
            <div class="title">${data.title}</div>
            <button class="primary detail" style="width: 120px">자세히 보기</button>
          </div>
        </div>
      </div>
    `;
}
addEventListener("load", async () => {
  MovieLayout.skeletonRender();
  const movieData = await fetchPopularMovies(1);
  const movieLayout = new MovieLayout(movieData.results);
  const bannerElement = document.getElementById("bannerSection");
  if (bannerElement) bannerElement.innerHTML = Banner(movieData.results[0]);
  await submitEvent(movieLayout);
  clickEvent(movieLayout);
  Header();
});
