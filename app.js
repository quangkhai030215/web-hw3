
// app.js : 영화 배열 함수와 DOM 이벤트
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

const STORAGE_KEY = "movie-board-liked";

let likedIds = [];

try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (Array.isArray(saved)) {
        likedIds = saved.filter(id =>
            movies.some(m => m.id === id)
        );
    }
} catch (error) {
    likedIds = [];
}

const saveLiked = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(likedIds));
};


// 4. 검색 함수

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

    // 영화 종류 필터
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

        const poster = document.createElement("img");
        poster.className = "poster";
        poster.src = posterUrl(m.poster);
        poster.alt = m.title;
        poster.loading = "lazy";

        // 포스터가 없거나 오류가 발생하면 대체 이미지
        poster.addEventListener("error", () => {
            poster.src = "https://placehold.co/400x600?text=No+Poster";
            poster.classList.add("poster-error");
        }, { once: true });

        const posterWrap = document.createElement("div");
        posterWrap.className = "poster-wrap";
        posterWrap.appendChild(poster);

        if (m.rank) {
            const rank = document.createElement("span");
            rank.className = "rank";
            rank.textContent = `TOP ${m.rank}`;
            posterWrap.appendChild(rank);
        }

        if (m.rating >= 8) {
            const badge = document.createElement("span");
            badge.className = "badge";
            badge.textContent = "HOT";
            posterWrap.appendChild(badge);
        }

        const info = document.createElement("div");
        info.className = "info";

        const title = document.createElement("h3");
        title.textContent = m.title;

        const year = document.createElement("p");
        year.textContent = `📅 ${m.year}년`;

        const rating = document.createElement("p");
        rating.textContent = `⭐ 평점 ${m.rating}`;

        const overview = document.createElement("p");
        overview.className = "card-overview";
        overview.textContent = m.overview;

        const likeButton = document.createElement("button");
        likeButton.type = "button";
        likeButton.className = `like ${isLiked ? "liked" : ""}`;
        likeButton.dataset.action = "like";
        likeButton.setAttribute("aria-label", "좋아요");
        likeButton.setAttribute("aria-pressed", isLiked);
        likeButton.textContent = isLiked ? "♥" : "♡";

        info.append(title, year, rating, overview, likeButton);
        card.append(posterWrap, info);

        board.appendChild(card);
    }

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


// 10. 상세 정보 표시하기

const openDetail = id => {
    const movie = movies.find(m => m.id === id);

    if (!movie) return;

    detailBody.innerHTML = "";

    const detail = document.createElement("div");
    detail.className = "detail";

    const poster = document.createElement("img");
    poster.className = "detail-poster";
    poster.src = posterUrl(movie.poster);
    poster.alt = movie.title;

    poster.addEventListener("error", () => {
        poster.src = "https://placehold.co/400x600?text=No+Poster";
    }, { once: true });

    const content = document.createElement("div");
    content.className = "detail-content";

    const title = document.createElement("h2");
    title.textContent = movie.title;

    const type = document.createElement("p");
    type.textContent = movie.type === "mine"
        ? "🎬 내가 고른 영화"
        : "🏆 박스오피스";

    const year = document.createElement("p");
    year.textContent = `개봉 연도: ${movie.year}년`;

    const date = document.createElement("p");
    date.textContent = `개봉일: ${movie.date}`;

    const rating = document.createElement("p");
    rating.textContent = `⭐ 평점: ${movie.rating}`;

    const rank = document.createElement("p");
    rank.textContent = movie.rank
        ? `🏅 순위: ${movie.rank}위`
        : "순위 정보 없음";

    const audience = document.createElement("p");
    audience.textContent = movie.audience
        ? `관객 수: ${movie.audience.toLocaleString()}명`
        : "관객 수 정보 없음";

    const elapsed = document.createElement("p");
    elapsed.textContent = `개봉 후 경과 연도: ${yearsSince(movie.year)}년`;

    const overviewTitle = document.createElement("h3");
    overviewTitle.textContent = "영화 소개";

    const overview = document.createElement("p");
    overview.className = "detail-overview";
    overview.textContent = movie.overview;

    content.append(
        title,
        type,
        year,
        date,
        rating,
        rank,
        audience,
        elapsed,
        overviewTitle,
        overview
    );

    detail.append(poster, content);
    detailBody.appendChild(detail);

    detailDialog.showModal();
};


// 11. 이벤트 위임 - 카드와 좋아요 버튼

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

    // 카드 또는 포스터 클릭 시 상세 정보
    openDetail(id);
});


// 12. 검색 이벤트

searchInput.addEventListener("input", refresh);


// 13. 정렬 이벤트

sortSelect.addEventListener("change", refresh);


// 14. 영화 종류 필터 이벤트

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

// dialog 바깥 영역 클릭 시 닫기
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
