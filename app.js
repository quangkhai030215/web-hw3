
// app.js : 살아 움직이는 영화 보드
// 검색, 필터, 정렬, 찜, 상세 정보
// 웹개발기초 실습과제 #3

// ========================================
// 1. 영화 데이터 처리 함수
// ========================================

// average : 영화 배열 ⇒ 평균 평점
const average = list => {
    if (list.length === 0) return 0;

    let sum = 0;

    for (const m of list) {
        sum += m.rating;
    }

    return sum / list.length;
};


// best : 영화 배열 ⇒ 최고 평점 영화
const best = list => {
    if (list.length === 0) return null;

    let top = list[0];

    for (const m of list) {
        if (m.rating > top.rating) {
            top = m;
        }
    }

    return top;
};


// filterByRating : 최소 평점 이상인 영화만 필터링
const filterByRating = (list, min) =>
    list.filter(m => m.rating >= min);


// sortByRating : 평점이 높은 순서로 새 배열 만들기
const sortByRating = list =>
    [...list].sort((a, b) => b.rating - a.rating);


// yearsSince : 개봉일로부터 지난 연도 계산
const yearsSince = dateStr =>
    new Date().getFullYear() - new Date(dateStr).getFullYear();


// posterUrl : 포스터 경로 ⇒ TMDB 이미지 주소
const posterUrl = (path, size = "w342") => {
    if (!path) {
        return "https://placehold.co/342x513/1f2b44/ffffff?text=No+Poster";
    }

    if (path.startsWith("http")) {
        return path;
    }

    return "https://image.tmdb.org/t/p/" + size + path;
};


// ========================================
// 2. localStorage : 찜 목록 저장
// ========================================

let likedIds = [];

try {
    likedIds = JSON.parse(localStorage.getItem("likedMovies")) || [];
} catch (error) {
    likedIds = [];
}


// saveLiked : 찜 목록 ⇒ localStorage 저장
function saveLiked() {
    localStorage.setItem("likedMovies", JSON.stringify(likedIds));
}


// updateLikeCount : 찜한 영화 개수 표시
function updateLikeCount() {
    document.getElementById("likeCount").textContent =
        likedIds.length;
}


// ========================================
// 3. DOM 요소 가져오기
// ========================================

const board = document.getElementById("board");
const searchInput = document.getElementById("q");
const sortSelect = document.getElementById("sort");
const typeFilter = document.getElementById("typeFilter");

const countOutput = document.getElementById("count");
const likeCountOutput = document.getElementById("likeCount");

const detailDialog = document.getElementById("detail");
const detailBody = document.getElementById("detailBody");
const closeDetailButton = document.getElementById("closeDetail");


// ========================================
// 4. sortBy : 영화 배열, 키, 내림차순 여부
// ========================================

function sortBy(list, key, desc = true) {
    const copy = [...list];

    copy.sort((a, b) => {
        if (typeof a[key] === "string") {
            return a[key].localeCompare(b[key]);
        }

        return a[key] - b[key];
    });

    if (desc) {
        copy.reverse();
    }

    return copy;
}


// ========================================
// 5. search : 검색어로 영화 찾기
// ========================================

function search(list, keyword) {
    const word = keyword.trim().toLowerCase();

    if (word === "") {
        return [...list];
    }

    return list.filter(m =>
        m.title.toLowerCase().includes(word)
    );
}


// ========================================
// 6. renderCards : 영화 배열 ⇒ 카드 생성
// ========================================

function renderCards(list) {
    board.innerHTML = "";

    for (const m of list) {
        const card = document.createElement("article");

        card.className = "card";
        card.dataset.id = m.id;
        card.dataset.title = m.title;

        if (m.rating >= 8) {
            card.classList.add("hot");
        }

        if (m.boxoffice) {
            card.dataset.type = "boxoffice";
        } else {
            card.dataset.type = "mine";
        }

        const rankHTML = m.rank
            ? `<span class="rank">${m.rank}</span>`
            : "";

        const audienceHTML = m.audience
            ? `<p class="audience">누적 ${m.audience.toLocaleString("ko-KR")}명</p>`
            : "";

        const likedClass = likedIds.includes(m.id)
            ? "liked"
            : "";

        card.innerHTML = `
            <img
                class="poster"
                src="${posterUrl(m.poster, "w342")}"
                alt="${m.title} 포스터"
                loading="lazy"
            >

            ${rankHTML}

            <span class="badge">${m.rating.toFixed(1)}</span>

            <div class="info">
                <h3>${m.title}</h3>

                <p class="year">개봉 ${m.date}</p>

                ${audienceHTML}

                <button
                    class="like ${likedClass}"
                    type="button"
                    aria-label="찜하기"
                    aria-pressed="${likedIds.includes(m.id)}"
                >
                    ♥
                </button>
            </div>
        `;

        board.appendChild(card);
    }

    countOutput.textContent = list.length + "편";

    if (list.length === 0) {
        board.classList.add("is-empty");
    } else {
        board.classList.remove("is-empty");
    }

    updateLikeCount();
}


// ========================================
// 7. getView : 검색 → 필터 → 정렬
// ========================================

function getView() {
    // 1단계 : 검색
    const keyword = searchInput.value;

    let result = search(movies, keyword);


    // 2단계 : 필터
    const selectedType = typeFilter.querySelector(
        'input[name="type"]:checked'
    ).value;

    if (selectedType === "mine") {
        result = result.filter(m => m.type === "mine");
    }

    if (selectedType === "boxoffice") {
        result = result.filter(m => m.boxoffice === true);
    }


    // 3단계 : 정렬
    const key = sortSelect.value;

    const descending = key !== "title";

    result = sortBy(result, key, descending);

    return result;
}


// ========================================
// 8. refresh : 현재 조건으로 화면 다시 그리기
// ========================================

function refresh() {
    renderCards(getView());
}


// ========================================
// 9. openDetail : 영화 상세 정보 표시
// ========================================

function openDetail(id) {
    const movie = movies.find(m => m.id === id);

    if (!movie) return;

    detailBody.innerHTML = `
        <div class="detail">

            <div>
                <img
                    src="${posterUrl(movie.poster, "w500")}"
                    alt="${movie.title} 포스터"
                >
            </div>

            <div>
                <h2>${movie.title}</h2>

                <dl>
                    <dt>개봉일</dt>
                    <dd>${movie.date}</dd>

                    <dt>개봉 연도</dt>
                    <dd>${movie.year}년</dd>

                    <dt>평점</dt>
                    <dd>⭐ ${movie.rating.toFixed(1)}점</dd>

                    <dt>영화 소개</dt>
                    <dd>${movie.overview}</dd>

                    ${movie.audience
                        ? `
                            <dt>누적 관객 수</dt>
                            <dd>${movie.audience.toLocaleString("ko-KR")}명</dd>
                        `
                        : ""
                    }

                    ${movie.rank
                        ? `
                            <dt>박스오피스 순위</dt>
                            <dd>${movie.rank}위</dd>
                        `
                        : ""
                    }
                </dl>
            </div>

        </div>
    `;

    detailDialog.showModal();
}


// ========================================
// 10. Event Delegation : 카드 클릭 처리
// ========================================

// .board에 이벤트 리스너 한 번만 등록
board.addEventListener("click", function(e) {

    // 실제 클릭한 요소에서 카드 찾기
    const card = e.target.closest(".card");

    if (!card) return;

    const id = Number(card.dataset.id);


    // 찜 버튼 클릭
    const likeButton = e.target.closest(".like");

    if (likeButton) {
        if (likedIds.includes(id)) {
            likedIds = likedIds.filter(item => item !== id);
        } else {
            likedIds.push(id);
        }

        saveLiked();
        refresh();

        return;
    }


    // 카드 클릭 : 상세 정보 열기
    openDetail(id);
});


// ========================================
// 11. 이벤트 리스너 등록
// ========================================

// 검색 : 글자를 입력할 때마다 다시 표시
searchInput.addEventListener("input", refresh);


// 검색창에서 Escape : 검색어 지우기
searchInput.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        searchInput.value = "";
        refresh();
    }
});


// 정렬 : 선택 값이 바뀌면 다시 표시
sortSelect.addEventListener("change", refresh);


// 필터 : 라디오 버튼이 바뀌면 다시 표시
typeFilter.addEventListener("change", refresh);


// 상세 창 닫기 버튼
closeDetailButton.addEventListener("click", () => {
    detailDialog.close();
});


// 다이얼로그 바깥쪽 클릭 시 닫기
detailDialog.addEventListener("click", e => {
    if (e.target === detailDialog) {
        detailDialog.close();
    }
});


// ========================================
// 12. 페이지 처음 실행
// ========================================

// 페이지 제목 설정
document.title = "내 영화 " + movies.length + "편";


// 영화 통계 표시
const topMovie = best(movies);

document.getElementById("out").textContent =
    "전체 영화 " + movies.length + "편\n" +
    "평균 평점 " + average(movies).toFixed(1) + "점\n" +
    "최고 평점 영화: " + topMovie.title;


// 콘솔에서 데이터 확인
console.log("전체 영화:", movies.length + "편");
console.log("평균 평점:", average(movies).toFixed(1));
console.log("최고 평점:", best(movies).title);
console.log("8점 이상:", filterByRating(movies, 8).length + "편");
console.log("평점순 정렬:", sortByRating(movies));


// 처음 화면 표시
refresh();
