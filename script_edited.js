let allMovieList = [];

const fetchMovie = async () => {
  const { results } = await fetch(
    "https://api.themoviedb.org/3/movie/top_rated",
    {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NTZjNWIzMjBjZDA2NjBmMzY3Y2Q4ZTM2ZDg0Nzc1ZCIsInN1YiI6IjY0NzU3MDBiOTYzODY0MDEzNTNmYjZmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JO9YF8eo1XGWCi_IjCrCxsAB9R-CEtqJgWsQ88rpBBA",
      },
    }
  ).then((response) => response.json());

  return results;
  //회원가입
  // fetch("https://api.themoviedb.org/3/movie/top_rated").then(() => {
  //   //로그인
  //   fetch("https://api.themoviedb.org/3/movie/top_rated").then(() => {
  //     //마이페이지 정보를 불러옴
  //     fetch("https://api.themoviedb.org/3/movie/top_rated").then(() => {
  //       window.location.href("/home");
  //     });
  //   });
  // });
  //회원가입
  // const response = await fetch("https://api.themoviedb.org/3/movie/top_rated");
  //로그인
  // await fetch("https://api.themoviedb.org/3/movie/top_rated", result);
  //마이페이지
  // await fetch("https://api.themoviedb.org/3/movie/top_rated");
  // window.location.href("/home");
};

function renderMovieList(movieList) {
  const movieListElement = document.getElementsByClassName("movie-list")[0];

  movieListElement.innerHTML = movieList.reduce((newMovieList, movieItem) => {
    const { id, poster_path, title, overview, vote_average } = movieItem;

    return (newMovieList += `   
      <li class="movie-item" onclick="alert('movie_id:${id}')"> 
        <img class="movie-poster" src="https://image.tmdb.org/t/p/w500/${poster_path}"/>
        <h2 class="movie-title">${title}</h2>
        <p class="movie-desc">${overview}</p>
        <p class="movie-rating">Rating: ${vote_average}</p>
      </li>`);
  }, "");
}

function filter(event) {
  event.preventDefault();

  const keyword = document.querySelector(".search-box").value.toUpperCase();

  const result = allMovieList.filter((movieItem) =>
    movieItem.title.toUpperCase().includes(keyword)
  );

  result.length > 0 ? renderMovieList(result) : alert("검색 결과가 없습니다.");
}

const loadMovie = async () => {
  allMovieList = await fetchMovie();

  renderMovieList(allMovieList);
};

loadMovie();
