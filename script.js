// 0. TMDB에서 긁어온 "Top Rated" 영화 관련 코드들..
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NTZjNWIzMjBjZDA2NjBmMzY3Y2Q4ZTM2ZDg0Nzc1ZCIsInN1YiI6IjY0NzU3MDBiOTYzODY0MDEzNTNmYjZmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JO9YF8eo1XGWCi_IjCrCxsAB9R-CEtqJgWsQ88rpBBA",
  },
};

// 1. fetch 이용 -> TMDB 데이터 끌어오기 (비동기 함수 fetch 실행)
fetch(
  "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
  options
) // promise인 fetch -> .then으로 넘어가기 까지 시간이 걸린다.
  // 지금은 promise - .then (프로미스 체이닝) => 차후 권장: async-await (비동기, 동기 신경안쓰면서 쭉 읽을 수 있어, 가독성 좋아진다.)
  .then((response) => response.json())
  .then((response) => {
    // fetch로 가져온 JSON 형식의 데이터 결과를 배열 형태로 바꿔주는 건가?...?....?
    let fetchMovie = response.results;
    // 아래에서 만들 getMovie함수에 fetch로 가져온 데이터 결과 값인 response.results를 넣어줘.
    // getMovie함수를 여기서 fetch 안에서 호출하네.
    getMovie(fetchMovie);
  })
  .catch((err) => console.error("에러 =>", err));

// 2. 영화 카드 생성 함수 만들어야지.
function getMovie(fetchMovie) {
  // html에 영화 카드 붙여 넣을 movie-list 부분 가져와서 movie_list라는 변수로 놓고
  const movie_list = document.getElementsByClassName("movie-list")[0];
  // [0]은 왜 하는 걸까.. getElementsByClassName은 해당 클래스의 모든 요소를 배열 형태로 반환하기 때문에, 특정 요소에 접근하려면 인덱스로 접근해야 해서 !
  // 아주 중요!!!!!!!!! [0] 하나 빠지면 카드 못 붙여옴..
  movie_list.innerHTML = "";
  // .innerHTML = ""는 무슨 역할이지? => html 보면 <p> </p> 이런식으로 있잖아. 그 꺽쇠 사이로 내용물이 들어간다는 뜻!

  // fetchMovie 로 받아온 값은 rows 변수로 지정.
  // rows를 돌면서 이 객체의 각각의 값을 movie_item 으로 묶어서 영화 카드 붙일거야. 클릭시 id 값 알람 기능도..
  // 여기 forEach에서 쓰는 게 바로 구조 분해 할당 !..!
  // ...rest 나중에 사용할 때를 위해 적어둔 건데, 여기선 굳이 필요없기는 하다. 필요 시, rest의 요소들 또한 구조분해 할당 가능
  let rows = fetchMovie;
  rows.forEach(
    ({ id, poster_path, title, overview, vote_average, ...rest }) => {
      let movie_item = `   
    <li class="movie-item" onclick="alert('movie_id:${id}')"> 
    <img class="movie-poster" src="https://image.tmdb.org/t/p/w500/${poster_path}"/>
    <h2 class="movie-title">${title}</h2>
    <p class="movie-desc">${overview}</p>
    <p class="movie-rating">Rating: ${vote_average}</p>
    </li>`;
      movie_list.innerHTML += movie_item; // 처음에 가져온 move_list 빈 값의 <html> 꺽쇠 사이로 만들어낸 movie_item 데이터 값들을 붙여준다..
    }
  );
}

// 3. 검색(filter) 기능 구현
function filter(event) {
  // event.preventDefault()는 이벤트의 기본 동작을 중지시키는 거래. 여기서는 form의 기본 제출 동작인 "페이지 새로고침"을 중지시킨다고
  event.preventDefault();
  // html에 영화 제목 입력하는 부분 가져오고, 모두 대문자로 변경(toUpperCase)해서 넣어주는 것!
  // 위에서 영화 카드 생성해서 html 넣기로 한 그 카드 묶음! li class="movie-item"
  // let write = document.getElementsByClassName("search-box")[0].value.toUpperCase();
  // -> 이거 굳이 배열로 받아와서 [0]로 요소 접근 안하고, querySelector(Class는 ."")로 요소 한 개만 잡아 올게.
  let write = document.querySelector(".search-box").value.toUpperCase();
  let items = document.getElementsByClassName("movie-item");
  // getElementsByClassName은 배열을 반환하므로 [0]를 추가해 첫번째 요소를 선택해야 한대. 그 입력 값에 value로 접근
  // items는 덩어리 그대로 쓸거야.

  // 3-1) 첫번째 시도: for문을 사용 -> 성공
  // items, 즉 영화 카드 묶어서 가져온 배열의 길이만큼 돌면서, i번째 영화의 movie-title 요소들을 title이라고 하자.
  // for (let i = 0; i < items.length; i++) {
  //   let title = items[i].querySelector(".movie-title"); // items[i]의 movie-title 요소 한 개만 잡아 온것.
  //   // 싱글 값이니까 querySelector! class 잡는 거는 ".movie-title" (cf. id 잡는 거는 "#movie-title") / 멀티 값이면 querySelectorAll
  //   if (title.innerHTML.toUpperCase().indexOf(write) > -1) {
  //     // title 변수에 저장한 "movie-title"을 innerHTML로 풀고, 대문자로 바꿔서 "write"값과 대조
  //     // indexOf(write) > -1 의 뜻: "write"한 검색어가 "movie-title"에 포함되어 있다면
  //     items[i].style.display = "flex";
  //   } else {
  //     items[i].style.display = "none";
  //   }
  // }

  // 3-2) 두번째 시도: forEach 사용 -> 실패
  // 이유: items는 "movie-item"이라는 class명을 가진 HTML의 collection인데, 여기에는 forEach 직접 사용 불가!
  // HTML collection은 배열의 메소드인 forEach를 상속받지 않는다.
  // HTML collection -> 배열로 변환하는 과정이 필요! => 3-3)에서 계속
  // items.forEach((item) => {
  //   let title = item.querySelector(".movie-title");
  //   if (title.innerHTML.toUpperCase().indexOf(write) > -1) {
  //     item.style.display = "flex";
  //   } else {
  //     item.style.display = "none";
  //   }
  // });

  // 3-3) 세번째 시도: forEach 사용 -> 성공
  // HTML의 collection 형태인 items -> 배열로 변환해준다!
  // let itemsArray = Array.from(items); // items를 배열로 변환
  // itemsArray.forEach((item) => {
  //   let title = item.querySelector(".movie-title");
  //   if (title.innerHTML.toUpperCase().includes(write)) {
  //     item.style.display = "flex";
  //   } else {
  //     item.style.display = "none";
  //   }
  // });

  // 3-4) 네번째 시도: filter + forEach 사용 -> 성공
  // 요구 사항 맞추려고 억지로 만들긴 했는데요.. 너무 구차한거 같은데요.. 비효율적이지 않냐고요..
  let itemsArray = Array.from(items); // items를 배열로 변환

  let filteredMovies = itemsArray.filter((item) => {
    let title = item.querySelector(".movie-title").innerHTML.toUpperCase();
    return title.indexOf(write) > -1;
  });
  // 현재 filtering 된 filteredMovies는 배열 -> forEach 적용
  filteredMovies.forEach((item) => {
    item.style.display = "flex";

    let unfilteredMovies = itemsArray.filter((item) => {
      let title = item.querySelector(".movie-title").innerHTML.toUpperCase();
      return title.indexOf(write) === -1;
    });
    unfilteredMovies.forEach((item) => {
      item.style.display = "none";
    });
  });
}

// 해강 님 왈 이 코드는 보이지 않게 할 뿐이지, 여전히 웹 상에 존재하고 있는 상태로 뜨기 때문에 개선이 필요하다고 !..!
// 해강 님 추천: for문 말고, filter나 forEach 등을 활용해서 다시 해보라고!

// 다른 어떤 분의 검색 필터..
// function searchMovie(event) {
//   event.preventDafault();

//   let searchValue = document.querySelector(".inputSearch").value;
//   let movies = document.querySelectorAll("form input");

//   movies.forEach((movie) => {
//     if (!movie.querySelector("#movieTitle").innerHTML.includes(searchValue)) {
//       movie.style.display = "none";
//     } else {
//       movie.style.display = "flex";
//     }
//   });
// }

//  전대현님 검색기능 -> 나 왜 안되냐..
//   function search() {
//     const write = document.querySelector(".search-box").value.toUpperCase();
//     const items = document.getElementByClassName("movie-item");
//     // const array = [];
//     // const array = new Array();
//     Array.from(items.childNodes).filter((item) => {
//       const title = item.querySelector("movie-title").innerText.toUpperCase();
//       if (title.indexOf(write) > -1) {
//         item.style.display = "";
//       } else {
//         item.style.display = "none";
//       }
//     });
// }
