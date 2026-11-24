
// app.js : 영화 보드 기능
// 검색, 필터, 정렬, 좋아요, 상세 정보
// 웹개발기초 실습과제 #3

// 1. 영화 배열을 다루는 함수

// 평균 평점
const average = list => {
    if (list.length === 0) return 0;

    let sum = 0;
    for (const m of list) {
        sum += m.rating;
    }

    return sum / list.length;
};

// 최고 평점 영화
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

// 평점 기준 필터
const filterByRating = (list, min = 0) => {
    return list.filter(m => m.rating >= min);
};

// 평점 기준 정렬
const sortByRating = list => {
    return [...list].sort((a, b) => b.rating - a.rating);
};

// 개봉 연도부터 지난 기간
const yearsSince = year => {
    return new Date().getFullYear() - year;
};

// 포스터 주소 만들기
const posterUrl = path => {
    if (!path) {
        return "https://placehold.co/400x600?text=No+Poster";
    }

    if (path.startsWith("http")) {
        return path;
    }

    return `https://image.tmdb.org/t/p/w500${path}`;
};


// 2. DOM 요소 가져오기

const board = document.getElementById("board");
const searchInput = document.getElementById("q");
const sortSelect = document.getElementById("sort");
const typeFilter = document.getElementById("typeFilter");

const countOutput = document.getElementById("count");
const likeCountOutput = document.getElementById("likeCount");
const averageOutput = document.getElementById("average");
const bestOutput = document.getElementById("best");

const emptyOutput = document.getElementById("empty");

const detailDialog = document.getElementById("detail");
const detailBody = document.getElementById("detailBody");
const closeDetail = document.getElementById("closeDetail");


// 3. 좋아요 데이터 저장하기

const STORAGE_KEY = "liked";

let likedIds = [];

try {
    likedIds = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
} catch (error) {
    likedIds = [];
}

const saveLiked = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(likedIds));
};


// 4. 영화 검색 함수

const searchMovies = (list, keyword) => {
    const q = keyword.trim().toLowerCase();

    if (!q) return list;

    return list.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.overview.toLowerCase().includes(q)
    );
};


// 5. 정렬 함수

const sortMovies = (list, sortValue) => {
    const result = [...list];

    switch (sortValue) {
        case "date-desc":
            return result.sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            );

        case "date-asc":
            return result.sort((a, b) =>
                new Date(a.date) - new Date(b.date)
            );

        case "rating-desc":
            return result.sort((a, b) => b.rating - a.rating);

        case "rating-asc":
            return result.sort((a, b) => a.rating - b.rating);

        case "title-asc":
            return result.sort((a, b) =>
                a.title.localeCompare(b.title, "ko")
            );

        case "year-desc":
            return result.sort((a, b) => b.year - a.year);

        default:
            return result;
    }
};


// 6. 검색 → 필터 → 정렬

const getView = () => {
    let result = [...movies];

    // 검색
    result = searchMovies(result, searchInput.value);

    // 종류 필터
    const selectedType = typeFilter.value;

    if (selectedType !== "all") {
        result = result.filter(m => m.type === selectedType);
    }

    // 정렬
    result = sortMovies(result, sortSelect.value);

    return result;
};


// 7. 영화 카드 만들기

const renderCards = list => {
    board.innerHTML = "";

    for (const m of list) {
        const card = document.createElement("article");

        card.className = "card";
        card.dataset.id = m.id;
        card.dataset.type = m.type;

        if (m.rating >= 8) {
            card.classList.add("hot");
        }

        const isLiked = likedIds.includes(m.id);

        card.innerHTML = `
            <div class="poster-wrap">

                <img
                    class="poster"
                    src="${posterUrl(m.poster)}"
                    alt="${m.title}"
                    loading="lazy"
                    onerror="this.src='https://placehold.co/400x600?text=No+Poster'"
                >

                ${m.rank ? `<span class="rank">TOP ${m.rank}</span>` : ""}

                ${m.rating >= 8 ? `<span class="badge">HOT</span>` : ""}

            </div>

            <div class="info">

                <h3>${m.title}</h3>

                <p>📅 ${m.year}년</p>

                <p>⭐ 평점 ${m.rating}</p>

                <p>${m.overview}</p>

                <button
                    type="button"
                    class="like ${isLiked ? "liked" : ""}"
                    aria-label="좋아요"
                    aria-pressed="${isLiked}"
                >
                    ${isLiked ? "♥" : "♡"}
                </button>

            </div>
        `;

        board.appendChild(card);
    }

    // 검색 결과가 없는 경우
    emptyOutput.style.display = list.length === 0 ? "block" : "none";
};


// 8. 통계 표시하기

const renderStats = list => {
    countOutput.textContent = list.length;

    likeCountOutput.textContent = likedIds.length;

    averageOutput.textContent = average(list).toFixed(1);

    const topMovie = best(list);

    bestOutput.textContent = topMovie
        ? `${topMovie.title} (${topMovie.rating})`
        : "-";
};


// 9. 화면 새로고침

const refresh = () => {
    const view = getView();

    renderCards(view);
    renderStats(view);
};


// 10. 상세 정보 열기

const openDetail = id => {
    const movie = movies.find(m => m.id === id);

    if (!movie) return;

    detailBody.innerHTML = `
        <div class="detail">

            <img
                src="${posterUrl(movie.poster)}"
                alt="${movie.title}"
                onerror="this.src='https://placehold.co/400x600?text=No+Poster'"
            >

            <div>
                <h2>${movie.title}</h2>

                <dl>
                    <dt>개봉 연도</dt>
                    <dd>${movie.year}</dd>

                    <dt>개봉일</dt>
                    <dd>${movie.date}</dd>

                    <dt>평점</dt>
                    <dd>⭐ ${movie.rating}</dd>

                    <dt>소개</dt>
                    <dd>${movie.overview}</dd>

                    <dt>개봉 후 경과 연도</dt>
                    <dd>${yearsSince(movie.year)}년</dd>

                    <dt>영화 종류</dt>
                    <dd>${movie.type === "mine" ? "내가 고른 영화" : "박스오피스"}</dd>
                </dl>
            </div>

        </div>
    `;

    detailDialog.showModal();
};


// 11. 이벤트 위임 - 카드 클릭과 좋아요

board.addEventListener("click", e => {
    const card = e.target.closest(".card");

    if (!card) return;

    const id = Number(card.dataset.id);

    // 좋아요 버튼 클릭
    if (e.target.closest(".like")) {
        if (likedIds.includes(id)) {
            likedIds = likedIds.filter(item => item !== id);
        } else {
            likedIds.push(id);
        }

        saveLiked();
        refresh();

        return;
    }

    // 카드 클릭 시 상세 정보
    openDetail(id);
});


// 12. 검색 이벤트

searchInput.addEventListener("input", refresh);


// 13. 정렬 이벤트

sortSelect.addEventListener("change", refresh);


// 14. 종류 필터 이벤트

typeFilter.addEventListener("change", refresh);


// 15. ESC 키로 검색 초기화

searchInput.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        searchInput.value = "";
        refresh();
    }
});


// 16. 상세 정보 닫기

closeDetail.addEventListener("click", () => {
    detailDialog.close();
});

detailDialog.addEventListener("click", e => {
    if (e.target === detailDialog) {
        detailDialog.close();
    }
});


// 17. 처음 화면 표시

refresh();


// 18. 콘솔 확인

console.log("평균 평점:", average(movies));
console.log("최고 평점 영화:", best(movies));
console.log("평점 8점 이상:", filterByRating(movies, 8));
console.log("평점순 정렬:", sortByRating(movies));
