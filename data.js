
// data.js : 내 영화 10편 데이터 / 영화 한 편 = 객체 하나

const movies = [
    { id: 1, title: "극장판 치이카와: 인어 섬의 비밀", year: 2026, date: "2026-07-24", rating: 7.1, poster: "/5TMyytCI5Pfc9c1eNsljiCdiB05.jpg", overview: "달콤한 보물과 맛있는 음식이 기다리는 섬, 그곳에 발을 들인 치이카와와 친구들은 귀여운 모험 뒤에 숨겨진 섬뜩한 진실과 마주한다.", type: "mine", rank: 1 },

    { id: 2, title: "실낙원", year: 2026, date: "2026-01-01", rating: 8.0, poster: "/wkm9BQLok7U2KihcCspCa663Qse.jpg", overview: "한 남자가 실낙원에서 벌어지는 미스터리한 사건에 휘말리며 벌어지는 스릴러 영화.", type: "mine", rank: 3 },

    { id: 3, title: "타짜: 벨제붑의 노래", year: 2026, date: "2026-09-23", rating: 7.0, poster: "/w5OX3u2SpMVRU0sol0mtIaf4LSI.jpg", overview: "타짜 시리즈의 새로운 이야기로, 벨제붑의 노래를 둘러싼 도박과 음모가 펼쳐지는 범죄 영화.", type: "mine", rank: 4 },

    { id: 4, title: "명탐정 코난: 100만 달러의 펜타그램", year: 2024, date: "2024-04-12", rating: 6.9, poster: "/4TMkOnI6rCYxqD059aeeQSBv5mc.jpg", overview: "명탐정 코난이 100만 달러의 펜타그램을 둘러싼 사건을 해결하는 이야기.", type: "mine" },

    { id: 5, title: "모노노케 히메", year: 1997, date: "1997-07-12", rating: 8.3, poster: "/gl0jzn4BupSbL2qMVeqrjKkF9Js.jpg", overview: "일본 애니메이션의 걸작으로, 인간과 자연의 갈등을 그린 판타지 영화.", type: "mine" },

    { id: 6, title: "암살자(들)", year: 2026, date: "2026-09-23", rating: 7.2, poster: "/c55ijsOdntj6P25vDwHLdgsBpmV.jpg", overview: "엄살을 부리는 주인공이 겪는 코미디와 드라마가 어우러진 영화.", type: "mine", rank: 2 },

    { id: 7, title: "클레이페이스", year: 2026, date: "2026-10-19", rating: 7.5, poster: "/LSGpoSAlitss0KOvVakkeUToZo.jpg", overview: "고담을 배경으로 한 인물의 변화와 정체성을 다루는 영화.", type: "boxoffice", boxoffice: true, audience: 84051, rank: 5 },

    { id: 8, title: "스파이더맨 : 브랜드 뉴 데이", year: 2026, date: "2026-07-29", rating: 8.4, poster: "/mt6uZzy7DAsncHlGzMsyNgLR6v.jpg", overview: "스파이더맨이 새로운 위협과 마주하며 다시 한번 도시와 소중한 사람들을 지키기 위해 나서는 이야기.", type: "boxoffice", boxoffice: true, rank: 1 },

    { id: 9, title: "미니언즈 & 몬스터즈", year: 2026, date: "2026-07-15", rating: 7.5, poster: "/8uvgppq5obV06X9X8SogQiU79Kd.jpg", overview: "엉뚱하고 장난기 넘치는 미니언들이 새로운 몬스터들과 만나 벌이는 유쾌한 모험 이야기.", type: "boxoffice", boxoffice: true, rank: 3 },

    { id: 10, title: "모아나", year: 2026, date: "2026-07-08", rating: 7.4, poster: "/etJXeoQovaAcQD8gG0vebtoIlMH.jpg", overview: "바다를 사랑하는 모아나가 새로운 모험을 떠나며 자신의 용기와 운명을 찾아가는 이야기.", type: "boxoffice", boxoffice: true, rank: 4 }
];
