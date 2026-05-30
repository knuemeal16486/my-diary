// Safe Lucide icon creator fallback (prevents script crashes if CDN is offline/blocked)
if (typeof lucide === 'undefined') {
  window.lucide = {
    createIcons: function() {
      console.warn("Lucide icons library not loaded. Icons will be text fallback.");
    }
  };
}

// GitHub Actions 배포 시 '__GEMINI_API_KEY__' 플레이스홀더가 GitHub Secret으로 자동 교체됩니다.
// 로컬 테스트 시에는 아래 값을 직접 입력하되, 절대 커밋하지 마세요.
const GEMINI_API_KEY = '__GEMINI_API_KEY__';

// 1. Data Definitions

// Personality Test Questions
const testQuestions = [
  {
    title: "혹시 예전에 집이나 학교에서 식물을 직접 심고 키워본 경험이 있니?",
    options: [
      { text: "응! 물도 주고 싹이 트고 자라는 것을 끝까지 책임감 있게 지켜본 적이 있어.", scores: { tomato: 3, apple: 3, potato: 0, cucumber: 0, cabbage: 0 } },
      { text: "아니, 식물을 내 손으로 오랫동안 보살펴본 경험은 거의 없는 것 같아.", scores: { potato: 3, cabbage: 3, cucumber: 2, tomato: 0, apple: 0 } }
    ]
  },
  {
    title: "스스로 생각하기에 나는 규칙적인 생활 습관(아침 기상, 숙제 등)을 잘 지키는 편이니?",
    options: [
      { text: "매일 계획한 일정을 제시간에 척척 해내고, 약속을 성실하게 잘 지키는 규칙적인 편이야!", scores: { cucumber: 3, tomato: 3, apple: 2, potato: 0, cabbage: 0 } },
      { text: "그때그때 내 기분에 따라 자유롭게 행동하거나 가끔 늦잠도 자는 편안한 스타일이야~", scores: { potato: 3, cabbage: 3, apple: 1, tomato: 0, cucumber: 0 } }
    ]
  },
  {
    title: "평소 운동장이나 밖에서 뛰어놀기처럼 활동적이고 몸을 움직이는 것을 좋아하는 편이니?",
    options: [
      { text: "완전 좋아해! 활발하게 뛰어놀고 친구들과 게임을 할 때 온몸에 에너지가 가득해져!", scores: { tomato: 3, cucumber: 3, apple: 0, potato: 0, cabbage: 0 } },
      { text: "방 안에서 조용히 만들기, 그리기, 책 읽기나 퍼즐처럼 차분하게 집중하는 게 더 좋아.", scores: { potato: 3, cabbage: 3, apple: 3, tomato: 0, cucumber: 0 } }
    ]
  },
  {
    title: "만약 나만의 초록 친구를 들여놓는다면, 내 방의 어디에 두고 가꾸고 싶니?",
    options: [
      { text: "햇빛이 잘 들고 따뜻한 창가나 베란다 틈에 놓아 매일 햇살 목욕을 시켜줄래.", scores: { tomato: 3, cucumber: 3, apple: 3, potato: 0, cabbage: 0 } },
      { text: "내 공부 책상이나 침대 머리맡처럼 내가 늘 앉아서 공부하고 쉴 때 가까이 볼 수 있게 할래.", scores: { potato: 3, cabbage: 3, apple: 0, tomato: 0, cucumber: 0 } }
    ]
  },
  {
    title: "식물을 기르면서 너는 어떤 즐거움을 가장 느껴보고 싶니?",
    options: [
      { text: "식물이 자라서 맛있는 열매를 맺거나 향을 맡으며 무언가 수확하는 기쁨!", scores: { tomato: 3, cucumber: 3, apple: 3, potato: 0, cabbage: 0 } },
      { text: "매일 자라나는 예쁜 꽃과 푸르른 잎사귀들을 조용히 보면서 마음이 편안해지는 정서적 힐링!", scores: { cabbage: 3, potato: 3, apple: 0, tomato: 0, cucumber: 0 } }
    ]
  }
];

// Plant Profile Catalog
const plantProfiles = {
  tomato: {
    name: "방울토마토",
    slogan: "열정 가득! 쑥쑥 자라나 빨간 결실을 맺는 활력 메이트",
    desc: "방울토마토는 밝은 햇빛을 아주 좋아하고 곁가지도 많아 매일 돌봐주는 보람을 크게 느끼게 하는 대표적인 실과 식물입니다. 에너지가 넘치고 목표를 향해 활기차게 노력하는 정원사님에게 빨간 열매의 커다란 수확의 기쁨을 선물해줄 찰떡궁합 식물입니다!",
    personality: "활발하고 호기심 많은 성격. 문장의 끝에 항상 느낌표(!)를 자주 쓰며 성장을 기대함.",
    themeColor: "#E53935",
    careInfo: {
      water: { min: 50, max: 80, desc: "촉촉한 흙을 좋아해요" },
      sun: { min: 60, max: 95, desc: "풍부한 햇볕이 최고에요" },
      wind: { min: 40, max: 80, desc: "시원한 환기가 필요해요" },
      soil: { min: 40, max: 80, desc: "영양분이 가득해야 열매를 맺어요" }
    }
  },
  potato: {
    name: "감자",
    slogan: "땅속 깊이 든든하게 영양을 채우는 튼튼 식량 메이트",
    desc: "감자는 보이지 않는 흙 속에서 덩이줄기를 조용히 뚱뚱하게 키우는 강인하고 실용적인 식량 작물입니다. 겉으로 드러나지 않아도 묵묵히 제 몫을 다하고 차분한 매력을 지닌 정원사님과 닮았습니다. 과습에 약하므로 물을 너무 자주 주지 않아도 잘 견디는 초보 맞춤형 반려 작물입니다.",
    personality: "친근하고 듬직하며 구수한 성격. 차분하고 안정된 다정한 어투로 이야기함.",
    themeColor: "#8D6E63",
    careInfo: {
      water: { min: 30, max: 60, desc: "물이 너무 많으면 감자가 썩어요" },
      sun: { min: 45, max: 75, desc: "부드러본 간접 햇빛이 좋아요" },
      wind: { min: 35, max: 70, desc: "답답하지 않은 환기가 필요해요" },
      soil: { min: 35, max: 75, desc: "보슬보슬한 가벼운 흙을 좋아해요" }
    }
  },
  cabbage: {
    name: "배추",
    slogan: "풍성한 잎사귀로 포근하게 감싸 안아주는 김장 대장 메이트",
    desc: "배추는 시원한 가을바람 속에서 속이 꽉 찬 잎들을 둥글게 모아 풍성하게 자라나는 우리 전통 채소입니다. 차분하고 사려 깊으며 주변 사람들을 포근하게 챙겨주길 좋아하는 정원사님처럼, 넓고 튼튼한 초록 잎사귀를 펼쳐 평화로운 마음을 느끼게 해 줄 든든한 힐링 친구입니다.",
    personality: "온화하고 사려 깊은 성격. 늘 정원사님을 포근하게 토닥여 주는 다정함을 보임.",
    themeColor: "#4CAF50",
    careInfo: {
      water: { min: 55, max: 80, desc: "물이 풍부해야 잎이 커져요" },
      sun: { min: 45, max: 75, desc: "과도한 햇볕보다는 시원함을 선호해요" },
      wind: { min: 50, max: 90, desc: "바람(통풍)이 안 통하면 시들어요" },
      soil: { min: 45, max: 80, desc: "영양이 아주 듬뿍 든 흙이 좋아요" }
    }
  },
  cucumber: {
    name: "오이",
    slogan: "넝쿨을 따라 하늘 높이 뻗어 나가는 아삭아삭 성장 메이트",
    desc: "오이는 지지대를 감고 쑥쑥 자라나 시원하고 아삭한 열매를 맺는 넝쿨 채소입니다. 물을 무척 좋아하고 매일 눈에 띄게 줄기가 길어지는 활동적인 성질을 가져서, 매일 꾸준한 관심과 규칙적인 돌봄을 제공할 줄 아는 성실하고 적극적인 정원사님과 환상의 케미를 뽐냅니다.",
    personality: "명랑하고 장난기 가득한 성격. 물과 햇빛을 만날 때 아삭하고 톡 쏘는 기쁨을 표현함.",
    themeColor: "#2E7D32",
    careInfo: {
      water: { min: 60, max: 85, desc: "수분이 항상 촉촉해야 해요" },
      sun: { min: 60, max: 90, desc: "따뜻한 태양빛을 매우 환영해요" },
      wind: { min: 45, max: 85, desc: "바람이 살랑살랑 불어야 줄기가 튼튼해요" },
      soil: { min: 40, max: 80, desc: "뿌리가 잘 뻗을 수 있는 흙이 좋아요" }
    }
  },
  apple: {
    name: "사과",
    slogan: "새콤달콤 빨간 사과나무와 함께 떠나는 설레는 시간 여행",
    desc: "사과나무는 아름다운 꽃을 피우고 오랜 시간 정성을 들여 새콤달콤한 붉은 과일을 익히는 과수 작물입니다. 한 번 심으면 오랫동안 마주하며 감정을 나누는 깊은 유대감을 선호하는 정원사님에게 최고의 반려 식물입니다. 느리지만 확실한 자연의 변화를 보여주며 힐링과 따스함을 선물합니다.",
    personality: "인내심 있고 지혜로운 어조. 시적이고 여유 있는 말솜씨로 정원사님을 이끌어 줌.",
    themeColor: "#D32F2F",
    careInfo: {
      water: { min: 40, max: 70, desc: "적당하고 일정한 수분이 알맞아요" },
      sun: { min: 55, max: 85, desc: "붉은 빛깔을 내려면 가을볕이 필요해요" },
      wind: { min: 40, max: 80, desc: "상쾌한 공기 흐름을 아주 좋아해요" },
      soil: { min: 35, max: 70, desc: "배수가 잘 되고 깊이가 있는 흙이 좋아요" }
    }
  }
};

// Curriculum Quizzes — 3-Stage Quest System (6th Grade Practical Arts)
const questStages = [
  {
    stageName: "씨앗 탐험가",
    stageEmoji: "🌱",
    stageDesc: "식물이 자라는 기본 조건을 배워보자!",
    questions: [
      {
        question: "식물이 스스로 자라고 건강한 생명을 유지하는 데 꼭 필요한 '성장 4대 필수 요소'가 아닌 것은 무엇일까요?",
        options: ["적당한 수분(물)", "따뜻한 햇빛", "공기 순환(바람과 환기)", "매일 주는 설탕물"],
        answer: 3,
        explanation: "식물에게는 적절한 수분, 햇빛, 환기(바람/이산화탄소 공급), 그리고 흙 속의 영양분이 필수적입니다. 설탕물을 많이 주면 오히려 삼투압 현상 때문에 뿌리가 상하고 썩을 수 있으니 삼가야 해요!"
      },
      {
        question: "씨앗이 싹을 틔우기 위해 반드시 필요한 조건 세 가지를 모두 고른 것은 무엇일까요?",
        options: ["물, 적절한 온도, 공기(산소)", "물, 비료, 햇빛", "햇빛, 바람, 설탕", "흙, 비료, 햇빛"],
        answer: 0,
        explanation: "씨앗이 발아(싹트기)하려면 물, 적절한 온도, 공기(산소)가 필요합니다. 햇빛은 싹이 튼 이후 자라는 데 필요하지만, 발아 자체에는 필수가 아닙니다. 씨앗을 흙에 묻으면 어두워도 싹이 트는 이유가 바로 이 때문이에요!"
      },
      {
        question: "화분에 물을 주는 정원사의 가장 올바른 습관은 무엇일까요?",
        options: [
          "식물이 지루하지 않게 1시간마다 조금씩 물을 뿌려준다.",
          "매일 아침 찰랑찰랑하게 화분을 물바다로 채워둔다.",
          "손가락으로 겉흙을 한 마디 정도 만져보고 완전히 보슬하게 말랐을 때, 배수구로 물이 나올 때까지 듬뿍 준다.",
          "시들기 전까지는 절대 물을 주지 않고 몇 달간 그대로 둔다."
        ],
        answer: 2,
        explanation: "정답은 흙 상태를 손가락이나 이쑤시개 등으로 체크한 뒤, 물을 줄 때는 화분 받침대 밑으로 흘러나올 때까지 골고루 듬뿍 주는 것입니다. 잦은 찔끔 물주기는 뿌리를 숨 막히게 만듭니다."
      },
      {
        question: "식물의 뿌리가 하는 아주 고마운 일 중 거리가 먼 것은 무엇일까요?",
        options: [
          "화분 속 흙을 움켜쥐어 식물이 쓰러지지 않게 고정해준다.",
          "이산화탄소를 흡수하고 산소를 잎 밖으로 내뱉는 호흡 및 광합성을 총괄한다.",
          "흙 속 물과 녹아있는 영양 성분을 빨아들여 온몸으로 전달한다.",
          "남는 영양분을 뿌리 통통한 곳에 저장하여 보관하기도 한다."
        ],
        answer: 1,
        explanation: "광합성과 기체 교환은 주로 식물의 '잎'에 있는 엽록체와 기공을 통해 이루어집니다. 뿌리는 흡수, 지탱, 저장의 역할을 훌륭히 수행한답니다!"
      }
    ]
  },
  {
    stageName: "성장 수호자",
    stageEmoji: "🌿",
    stageDesc: "광합성과 식물이 자라는 비밀을 파헤쳐보자!",
    questions: [
      {
        question: "식물의 초록색 잎 속 엽록체에서 햇빛, 이산화탄소, 물을 이용해 스스로 유기 양분을 만들어내는 놀라운 생명 현상을 무엇이라고 부를까요?",
        options: ["광합성 작용", "증산 작용", "호흡 작용", "화분 작용"],
        answer: 0,
        explanation: "정답은 광합성 작용입니다! 식물은 동물처럼 먹이를 찾지 않는 대신 햇빛을 받아 녹말과 같은 양분을 직접 제조해요. 이때 산소도 함께 발생시켜 지구를 맑게 해준답니다."
      },
      {
        question: "방울토마토나 허브 등을 키울 때, 잎 겨드랑이에서 삐져나오는 불필요한 어린 곁가지를 손으로 꺾어주어 원줄기가 튼튼하게 열매를 맺도록 돕는 작업을 무엇이라고 할까요?",
        options: ["솎아내기", "곁순 따기", "꽃눈 자르기", "북주기"],
        answer: 1,
        explanation: "정답은 곁순 따기입니다! 곁순을 떼어내지 않으면 쓸데없는 줄기가 번성하여 영양분이 다 분산되므로, 열매나 본줄기가 작고 약하게 자라게 됩니다. 정리가 필수적이에요."
      },
      {
        question: "식물의 잎이 초록색으로 보이는 이유는 무엇일까요?",
        options: [
          "잎 속에 물이 가득 차 있어서",
          "잎 세포 안에 엽록소(클로로필)라는 초록 색소가 있어서",
          "흙의 갈색이 반대 색인 초록으로 보여서",
          "햇빛이 초록색 파장만 잎에 반사시켜서"
        ],
        answer: 1,
        explanation: "잎이 초록색인 것은 세포 안 엽록체에 '엽록소(클로로필)'라는 초록 색소가 있기 때문입니다. 엽록소는 빨간색·파란색 빛은 흡수하고 초록색 빛은 반사하기 때문에 우리 눈에 초록으로 보인답니다!"
      },
      {
        question: "식물이 뿌리로 흡수한 물을 잎의 기공을 통해 수증기로 내보내는 현상을 무엇이라고 하나요?",
        options: ["광합성", "증산 작용", "삼투압 현상", "호흡 작용"],
        answer: 1,
        explanation: "증산 작용입니다! 식물은 증산을 통해 체온을 조절하고 뿌리에서 물을 위로 끌어올리는 힘을 만들어냅니다. 더운 여름날 숲이 시원한 이유 중 하나가 바로 나무들의 증산 작용 덕분이에요."
      }
    ]
  },
  {
    stageName: "한살이 마스터",
    stageEmoji: "🍎",
    stageDesc: "씨앗에서 열매까지, 식물의 한살이를 완성하자!",
    questions: [
      {
        question: "식물의 꽃이 열매로 변하기 위해 꼭 필요한 과정은 무엇일까요?",
        options: [
          "물을 많이 주면 꽃이 저절로 열매로 변한다.",
          "꽃가루가 암술머리에 옮겨지는 수분(꽃가루받이)이 이루어져야 한다.",
          "꽃잎이 모두 떨어져야만 열매가 생긴다.",
          "비가 오면 꽃이 자동으로 열매가 된다."
        ],
        answer: 1,
        explanation: "꽃이 열매가 되려면 꽃가루가 암술머리에 닿는 '수분(꽃가루받이)'이 이루어져야 합니다! 꿀벌이나 바람이 꽃가루를 옮겨주는 역할을 하지요. 수분 후 씨방이 자라 열매가 되고, 그 안에 씨앗이 생겨납니다."
      },
      {
        question: "한 해 살이 식물(방울토마토 등)의 한살이 순서로 올바른 것은 무엇일까요?",
        options: [
          "씨앗 → 꽃 → 새싹 → 잎 → 열매",
          "씨앗 → 새싹 → 잎과 줄기 → 꽃 → 열매 → 씨앗",
          "씨앗 → 잎 → 열매 → 꽃 → 새싹",
          "새싹 → 씨앗 → 꽃 → 잎 → 열매"
        ],
        answer: 1,
        explanation: "씨앗 → 새싹(발아) → 잎과 줄기(성장) → 꽃(개화) → 열매(결실) → 씨앗(채종)으로 이어지는 것이 한 해 살이 식물의 한살이입니다. 우리가 기르는 반려 식물도 이 과정을 거친답니다!"
      },
      {
        question: "방울토마토의 꽃은 어떤 색깔인가요?",
        options: ["빨간색", "파란색", "노란색", "보라색"],
        answer: 2,
        explanation: "방울토마토의 꽃은 노란색입니다! 작은 별 모양의 노란 꽃이 피고 나면, 꽃가루받이를 거쳐 초록색 열매가 열립니다. 그 열매가 익으면서 빨갛게 변하는 거예요. 꽃과 열매의 색이 다르다는 게 신기하죠?"
      },
      {
        question: "식물의 씨앗 속에 들어있는, 싹이 될 어린 식물체를 무엇이라고 하나요?",
        options: ["배유(배젖)", "종피(씨껍질)", "배(배아)", "떡잎"],
        answer: 2,
        explanation: "씨앗 속의 어린 식물체를 '배(胚, 배아)'라고 합니다! 씨앗을 심으면 배아가 자라 새싹이 됩니다. 배유(배젖)는 배아에게 영양을 공급하는 저장 조직이고, 종피는 씨앗을 보호하는 껍질이에요."
      }
    ]
  }
];


// 2. Application State Variables
let appState = {
  userName: "꼬마 정원사",
  currentView: "intro", // intro, test, loading, result, dashboard
  testAnswers: [],      // User answer choices
  currentQuestionIndex: 0,
  selectedPlantKey: "", // tomato, potato, cabbage, cucumber, apple
  environment: "",      // window, balcony, room, outdoor
  growthXP: 0,          // 0 to 100
  growthStage: 1,       // 1:씨앗, 2:새싹, 3:성장기, 4:개화/결실
  fertilizerCount: 1,   // Active items count
  stats: {
    water: 50,
    sun: 30,
    wind: 40,
    soil: 40
  },
  weather: "sunny",     // sunny, rainy, windy
  isSunLampOn: false,
  isWindowOpen: false,
  diaryList: [],
  chatLog: [],
  quizStageIndex: 0,
  quizQIndexInStage: 0,
  completedStages: [],
  badges: [],
  stageCorrectCount: 0,
  isSimulating: false,
  simulationIntervalId: null,
  dailyGrowth: {},      // Record of XP gained per date "YYYY-MM-DD"
  currentCalendarDate: new Date()
};

// Plant Growth Badges
const BADGES = [
  { key: 'seed_explorer',    emoji: '🌱', name: '씨앗 탐험가',   desc: '씨앗이 싹트는 비밀을 배웠어요!' },
  { key: 'growth_guardian',  emoji: '🌿', name: '광합성 박사',   desc: '광합성으로 식물이 자라는 원리를 알았어요!' },
  { key: 'lifecycle_master', emoji: '🍎', name: '한살이 완성자', desc: '씨앗부터 열매까지 한살이를 완성했어요!' },
  { key: 'plant_doctor',     emoji: '🔬', name: '식물 박사',     desc: '모든 퀘스트를 완료한 진짜 식물 박사!' },
  { key: 'perfect_gardener', emoji: '⭐', name: '완벽 정원사',   desc: '한 단계를 오답 없이 완주했어요!' },
];
const STAGE_BADGE_KEYS = ['seed_explorer', 'growth_guardian', 'lifecycle_master'];

// 인사이드 아웃 감정 정의 (mood key → 표시 정보)
const INSIDE_OUT_EMOTIONS = {
  joy:          { label: '기쁨이',  emoji: '😄', color: '#FFD700', causeRain: false, causeSunny: true,  causeWind: false },
  sadness:      { label: '슬픔이',  emoji: '😢', color: '#4A90D9', causeRain: true,  causeSunny: false, causeWind: false },
  anger:        { label: '버럭이',  emoji: '😠', color: '#E53935', causeRain: false, causeSunny: false, causeWind: true  },
  fear:         { label: '소심이',  emoji: '😨', color: '#8E44AD', causeRain: false, causeSunny: false, causeWind: true  },
  disgust:      { label: '까칠이',  emoji: '🤢', color: '#43A047', causeRain: false, causeSunny: false, causeWind: false },
  anxiety:      { label: '불안이',  emoji: '😟', color: '#FF7043', causeRain: true,  causeSunny: false, causeWind: false },
  ennui:        { label: '따분이',  emoji: '😑', color: '#546E7A', causeRain: true,  causeSunny: false, causeWind: false },
  envy:         { label: '부럵이',  emoji: '🙄', color: '#00897B', causeRain: false, causeSunny: false, causeWind: false },
  embarrassment:{ label: '당황이',  emoji: '😳', color: '#E91E8C', causeRain: false, causeSunny: false, causeWind: false },
};


// 3. Dynamic SVG Generator
// Renders vector graphic of the plant based on its key, growth stage, and safety status
let _svgUid = 0;
function generatePlantSVG(plantKey, stage, stats) {
  const profile = plantProfiles[plantKey];
  if (!profile) return '';
  const uid = ++_svgUid;

  const isThirsty = stats.water < (profile.careInfo.water.min - 10) || stats.water > (profile.careInfo.water.max + 10);
  const isDark = stats.sun < (profile.careInfo.sun.min - 10);
  const isStifled = stats.wind < (profile.careInfo.wind.min - 10);
  const isStressed = isThirsty || isDark || isStifled;

  let stemColor = isStressed ? "#827717" : "#33691E"; // Darker realistic green
  let leafColor = isStressed ? "#AFB42B" : "#43A047";
  let darkLeafColor = isStressed ? "#827717" : "#1B5E20";
  let highlightLeafColor = isStressed ? "#C0CA33" : "#66BB6A";
  
  const animationClass = isStressed ? "sway-stressed" : "sway-healthy";

  // Stage 6: 채종 — golden autumn senescence (natural life cycle completion)
  if (stage === 6 && !isStressed) {
    leafColor = "#B8A860";
    darkLeafColor = "#7A6830";
    highlightLeafColor = "#D4C870";
  }

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="${animationClass}" width="100%" height="100%">
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="5" stdDeviation="3" flood-color="#000" flood-opacity="0.3"/>
      </filter>
      <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.2"/>
      </filter>
      
      <linearGradient id="tomato-grad" x1="0.2" y1="0.2" x2="0.8" y2="0.8">
        <stop offset="0%" stop-color="#FF5252"/>
        <stop offset="60%" stop-color="#D32F2F"/>
        <stop offset="100%" stop-color="#B71C1C"/>
      </linearGradient>
      
      <linearGradient id="potato-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFE082"/>
        <stop offset="70%" stop-color="#D7CCC8"/>
        <stop offset="100%" stop-color="#8D6E63"/>
      </linearGradient>
      
      <linearGradient id="cucumber-grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#1B5E20"/>
        <stop offset="50%" stop-color="#388E3C"/>
        <stop offset="100%" stop-color="#1B5E20"/>
      </linearGradient>
      
      <linearGradient id="apple-grad" x1="0.2" y1="0.2" x2="0.8" y2="0.8">
        <stop offset="0%" stop-color="#FF8A80"/>
        <stop offset="40%" stop-color="#E53935"/>
        <stop offset="100%" stop-color="#880E4F"/>
      </linearGradient>
      
      <radialGradient id="cabbage-grad" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#E8F5E9"/>
        <stop offset="60%" stop-color="#A5D6A7"/>
        <stop offset="100%" stop-color="#4CAF50"/>
      </radialGradient>
      
      <linearGradient id="trunk-grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#4E342E"/>
        <stop offset="50%" stop-color="#6D4C41"/>
        <stop offset="100%" stop-color="#3E2723"/>
      </linearGradient>
    </defs>
  `;

  // Draw Unified Cut-away Soil Background for all plants
  svg += `
    <g filter="url(#shadow)">
      <path d="M20,130 L180,130 L180,195 Q100,205 20,195 Z" fill="#5D4037" />
      <path d="M20,130 L180,130 L180,145 Q100,150 20,145 Z" fill="#4E342E" />
      <!-- Soil textures -->
      <circle cx="60" cy="160" r="2" fill="#3E2723" opacity="0.6"/>
      <circle cx="140" cy="180" r="3" fill="#3E2723" opacity="0.6"/>
      <circle cx="70" cy="185" r="4" fill="#3E2723" opacity="0.6"/>
      <circle cx="120" cy="155" r="2" fill="#3E2723" opacity="0.6"/>
      <circle cx="90" cy="190" r="1.5" fill="#3E2723" opacity="0.6"/>
      <circle cx="160" cy="165" r="2.5" fill="#3E2723" opacity="0.6"/>
      <circle cx="40" cy="175" r="3" fill="#3E2723" opacity="0.6"/>
    </g>
  `;

  // Helpers for realistic drawing
  const drawStem = (x1, y1, x2, y2, w, color = stemColor) => {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx*dx + dy*dy);
    const nx = -(dy/len)*(w/2), ny = (dx/len)*(w/2);
    const cx = (x1+x2)/2 - nx*1.5;
    const cy = (y1+y2)/2 - ny*1.5;
    return `<path d="M${x1-nx},${y1-ny} Q${cx-nx},${cy-ny} ${x2-nx},${y2-ny} L${x2+nx},${y2+ny} Q${cx+nx},${cy+ny} ${x1+nx},${y1+ny} Z" fill="${color}" filter="url(#shadow)"/>`;
  };
  
  const drawTomatoLeaf = (cx, cy, s, r) => `
    <g transform="translate(${cx}, ${cy}) scale(${s}) rotate(${r})" filter="url(#soft-shadow)">
      <path d="M0,0 Q5,-15 0,-30" fill="none" stroke="${darkLeafColor}" stroke-width="1.5"/>
      <path d="M0,-30 C-8,-25 -10,-15 0,-15 C10,-15 8,-25 0,-30 Z" fill="${leafColor}"/>
      <path d="M-1,-22 C-12,-20 -15,-10 -2,-12 Z" fill="${leafColor}"/>
      <path d="M1,-22 C12,-20 15,-10 2,-12 Z" fill="${leafColor}"/>
      <path d="M-3,-15 C-15,-12 -12,-5 0,-5 Z" fill="${leafColor}"/>
      <path d="M3,-15 C15,-12 12,-5 0,-5 Z" fill="${leafColor}"/>
    </g>
  `;
  
  const drawBroadLeaf = (cx, cy, s, r) => `
    <g transform="translate(${cx}, ${cy}) scale(${s}) rotate(${r})" filter="url(#soft-shadow)">
      <path d="M0,0 C-20,-10 -25,-30 0,-40 C25,-30 20,-10 0,0 Z" fill="${leafColor}"/>
      <path d="M0,0 Q0,-20 0,-38" fill="none" stroke="${highlightLeafColor}" stroke-width="1"/>
      <path d="M0,-10 Q-8,-15 -12,-12 M0,-20 Q-10,-25 -15,-20 M0,-10 Q8,-15 12,-12 M0,-20 Q10,-25 15,-20" fill="none" stroke="${highlightLeafColor}" stroke-width="0.5"/>
    </g>
  `;
  
  const drawCucumberLeaf = (cx, cy, s, r) => `
    <g transform="translate(${cx}, ${cy}) scale(${s}) rotate(${r})" filter="url(#soft-shadow)">
      <path d="M0,0 C-15,-5 -30,-20 -20,-35 C-10,-45 0,-30 5,-40 C10,-50 25,-40 25,-25 C35,-15 15,-5 0,0 Z" fill="${leafColor}"/>
      <path d="M0,0 L-10,-20 M0,0 L5,-35 M0,0 L18,-18" fill="none" stroke="${highlightLeafColor}" stroke-width="1.5" opacity="0.6"/>
    </g>
  `;

  const drawAppleLeaf = (cx, cy, s, r) => `
    <g transform="translate(${cx}, ${cy}) scale(${s}) rotate(${r})" filter="url(#soft-shadow)">
      <path d="M0,0 C-15,-10 -10,-25 0,-35 C10,-25 15,-10 0,0 Z" fill="${leafColor}"/>
      <path d="M0,0 Q2,-15 0,-33" fill="none" stroke="${highlightLeafColor}" stroke-width="1"/>
    </g>
  `;

  const drawTomato = (cx, cy, s) => `
    <g transform="translate(${cx}, ${cy}) scale(${s})" filter="url(#shadow)">
      <circle cx="0" cy="0" r="14" fill="url(#tomato-grad)"/>
      <path d="M-4,-8 Q0,-12 4,-8" fill="none" stroke="#FFF" stroke-width="2" opacity="0.4" stroke-linecap="round"/>
      <path d="M0,-14 L-3,-9 M0,-14 L3,-9 M0,-14 L-6,-14 M0,-14 L6,-14 M0,-14 L0,-9" fill="none" stroke="#1B5E20" stroke-width="2"/>
    </g>
  `;
  
  const drawPotato = (cx, cy, s, r=0) => `
    <g transform="translate(${cx}, ${cy}) scale(${s}) rotate(${r})" filter="url(#shadow)">
      <ellipse cx="0" cy="0" rx="16" ry="11" fill="url(#potato-grad)"/>
      <path d="M-8,-2 Q-6,-4 -4,-2" fill="none" stroke="#8D6E63" stroke-width="1"/>
      <circle cx="-6" cy="-2" r="1" fill="#795548"/>
      <path d="M4,3 Q6,1 8,3" fill="none" stroke="#8D6E63" stroke-width="1"/>
      <circle cx="6" cy="3" r="1" fill="#795548"/>
    </g>
  `;
  
  const drawCabbageLeafWavy = (cx, cy, s, r, color) => `
    <g transform="translate(${cx}, ${cy}) scale(${s}) rotate(${r})" filter="url(#shadow)">
      <path d="M0,0 C-30,-20 -40,-60 -20,-80 C0,-100 40,-90 50,-60 C60,-30 40,-10 0,0 Z" fill="${color}"/>
      <path d="M0,0 Q-5,-40 -10,-70 M0,0 Q10,-35 25,-55 M-5,-40 Q-20,-50 -25,-40 M10,-35 Q25,-40 30,-30" fill="none" stroke="#E8F5E9" stroke-width="1.5" opacity="0.5"/>
    </g>
  `;
  
  const drawCucumber = (cx, cy, s, r) => `
    <g transform="translate(${cx}, ${cy}) scale(${s}) rotate(${r})" filter="url(#shadow)">
      <rect x="-7" y="0" width="14" height="40" rx="7" fill="url(#cucumber-grad)"/>
      <path d="M-4,5 L-4,35 M0,5 L0,35 M4,5 L4,35" stroke="#7CB342" stroke-width="1" stroke-dasharray="2,3" opacity="0.7"/>
      <path d="M-3,40 L0,44 L3,40 Z" fill="#FBC02D"/>
    </g>
  `;
  
  const drawApple = (cx, cy, s) => `
    <g transform="translate(${cx}, ${cy}) scale(${s})" filter="url(#shadow)">
      <path d="M0,0 Q2,-5 5,-8" fill="none" stroke="#4E342E" stroke-width="2"/>
      <path d="M5,-8 Q10,-10 12,-5 C8,-2 5,-5 5,-8 Z" fill="#4CAF50"/>
      <circle cx="0" cy="10" r="12" fill="url(#apple-grad)"/>
      <path d="M-5,3 Q-2,0 2,3" fill="none" stroke="#FFF" stroke-width="2" opacity="0.4" stroke-linecap="round"/>
    </g>
  `;

  const drawFlower = (cx, cy, s, color) => `
    <g transform="translate(${cx}, ${cy}) scale(${s})" filter="url(#shadow)">
      <path d="M0,0 C-5,-10 5,-10 0,0 C10,-5 10,5 0,0 C5,10 -5,10 0,0 C-10,5 -10,-5 0,0 Z" fill="${color}"/>
      <circle cx="0" cy="0" r="2" fill="#F57F17"/>
    </g>
  `;

  const drawTendril = (cx, cy, s, r) => `
    <g transform="translate(${cx}, ${cy}) scale(${s}) rotate(${r})">
      <path d="M0,0 Q10,-5 5,-10 T0,-15 T5,-20 T0,-25" fill="none" stroke="${highlightLeafColor}" stroke-width="1.5"/>
    </g>
  `;

  // Draws seeds on soil surface — signals 한살이 완성 (Stage 6)
  const drawSeedPile = () => `
    <g filter="url(#soft-shadow)" opacity="0.9">
      <ellipse cx="82" cy="132" rx="4.5" ry="2.5" fill="#C8A060" transform="rotate(-25 82 132)"/>
      <ellipse cx="98" cy="130" rx="3.5" ry="2" fill="#D4A857" transform="rotate(5 98 130)"/>
      <ellipse cx="113" cy="131" rx="4" ry="2.5" fill="#BC9048" transform="rotate(20 113 131)"/>
      <ellipse cx="128" cy="133" rx="3" ry="2" fill="#C8A060" transform="rotate(-15 128 133)"/>
      <ellipse cx="70" cy="134" rx="3.5" ry="2" fill="#D4A857" transform="rotate(30 70 134)"/>
    </g>
  `;

  const drawRoot = (stage) => {
    let roots = '';
    if (stage >= 2) {
      roots += `<path d="M100,135 Q90,150 95,160 M100,135 Q110,150 105,160" fill="none" stroke="#A1887F" stroke-width="2" filter="url(#shadow)"/>`;
    }
    if (stage >= 3) {
      roots += `<path d="M95,160 Q85,170 70,175 M105,160 Q120,170 130,180 M100,135 Q100,165 95,185" fill="none" stroke="#A1887F" stroke-width="1.5" filter="url(#shadow)"/>`;
    }
    if (stage >= 4) {
      roots += `<path d="M70,175 Q60,180 50,190 M130,180 Q145,185 155,190 M95,185 Q110,195 100,200" fill="none" stroke="#8D6E63" stroke-width="1" filter="url(#shadow)"/>`;
      roots += `<path d="M90,150 Q75,160 65,165 M110,150 Q125,160 135,165" fill="none" stroke="#A1887F" stroke-width="1" filter="url(#shadow)"/>`;
    }
    return roots;
  };

  // Draw generic roots for all non-potato plants
  if (plantKey !== 'potato') {
    svg += drawRoot(stage);
  }

  if (stage === 1) {
    if (plantKey === 'tomato') {
      svg += `<ellipse cx="100" cy="172" rx="3" ry="2" fill="#FFCC80" filter="url(#shadow)"/>`;
      svg += `<path d="M99,170 Q105,165 95,155" stroke="${stemColor}" stroke-width="2" fill="none"/>`;
      svg += drawTomatoLeaf(95, 155, 0.4, 45);
    } else if (plantKey === 'potato') {
      svg += drawPotato(100, 160, 0.8, -10);
      svg += `<path d="M100,152 Q100,140 95,130" stroke="${stemColor}" stroke-width="3" fill="none"/>`;
      svg += drawBroadLeaf(95, 130, 0.4, -30);
    } else if (plantKey === 'cabbage') {
      svg += `<circle cx="100" cy="172" r="2" fill="#3E2723" filter="url(#shadow)"/>`;
      svg += `<path d="M100,170 Q105,160 98,155" stroke="${stemColor}" stroke-width="2" fill="none"/>`;
      svg += drawBroadLeaf(98, 155, 0.3, -40);
      svg += drawBroadLeaf(98, 155, 0.3, 40);
    } else if (plantKey === 'cucumber') {
      svg += `<ellipse cx="100" cy="172" rx="4" ry="2" fill="#FFF59D" filter="url(#shadow)"/>`;
      svg += `<path d="M100,170 Q105,150 90,145" stroke="${stemColor}" stroke-width="2" fill="none"/>`;
      svg += drawCucumberLeaf(90, 145, 0.3, 20);
    } else if (plantKey === 'apple') {
      svg += `<ellipse cx="100" cy="180" rx="4" ry="2" fill="#3E2723" filter="url(#shadow)"/>`;
      svg += `<path d="M100,180 Q105,160 98,150" stroke="#5D4037" stroke-width="3" fill="none"/>`;
      svg += drawAppleLeaf(98, 150, 0.5, -45);
    }
  }
  else if (stage === 2) {
    if (plantKey === 'potato') {
      // Seed potato
      svg += drawPotato(100, 160, 0.7, -10);
      // Roots & new small potato
      svg += `<path d="M100,160 Q95,180 85,185" fill="none" stroke="#795548" stroke-width="1.5"/>`;
      svg += drawPotato(85, 185, 0.6, 20);
      // Underground stem
      svg += `<path d="M100,152 Q100,140 100,130" stroke="${stemColor}" stroke-width="4" fill="none"/>`;
      // Above ground stem
      svg += drawStem(100, 130, 100, 110, 4);
      // Leaves
      svg += drawBroadLeaf(100, 130, 0.8, -40);
      svg += drawBroadLeaf(100, 120, 0.8, 40);
      svg += drawBroadLeaf(100, 110, 0.9, -10);
    } else {
      if (plantKey === 'apple') {
        svg += drawStem(100, 185, 100, 110, 6, "url(#trunk-grad)");
      } else {
        svg += drawStem(100, 175, 100, 120, 4);
      }
      
      if (plantKey === 'cucumber') {
        svg += drawStem(100, 120, 80, 90, 3);
        svg += drawCucumberLeaf(100, 120, 0.6, -30);
        svg += drawCucumberLeaf(80, 90, 0.6, 40);
        svg += drawTendril(100, 120, 1, 20);
      } else if (plantKey === 'cabbage') {
        svg += drawCabbageLeafWavy(100, 175, 0.6, -45, "#81C784");
        svg += drawCabbageLeafWavy(100, 175, 0.6, 45, "#81C784");
        svg += drawCabbageLeafWavy(100, 160, 0.5, 0, "#A5D6A7");
      } else if (plantKey === 'tomato') {
        svg += drawStem(100, 120, 90, 90, 3);
        svg += drawTomatoLeaf(100, 140, 0.8, -50);
        svg += drawTomatoLeaf(100, 120, 0.8, 50);
        svg += drawTomatoLeaf(90, 90, 0.9, -10);
      } else if (plantKey === 'apple') {
        svg += drawAppleLeaf(100, 150, 0.8, -40);
        svg += drawAppleLeaf(100, 130, 0.8, 40);
        svg += drawAppleLeaf(100, 110, 1, 0);
      }
    }
  }
  else if (stage >= 3) {
    if (plantKey === 'tomato') {
      svg += drawStem(100, 175, 95, 60, 8); 
      svg += drawStem(98, 140, 60, 110, 5); 
      svg += drawStem(97, 100, 140, 80, 5); 
      svg += drawStem(96, 70, 50, 50, 4); 
      
      svg += drawTomatoLeaf(75, 125, 0.9, -60);
      svg += drawTomatoLeaf(60, 110, 1, -40);
      svg += drawTomatoLeaf(120, 90, 0.9, 60);
      svg += drawTomatoLeaf(140, 80, 1, 40);
      svg += drawTomatoLeaf(70, 60, 0.8, -50);
      svg += drawTomatoLeaf(50, 50, 0.9, -30);
      svg += drawTomatoLeaf(95, 60, 1.2, 10);
      
      if (stage === 3) {
        svg += drawFlower(65, 120, 1.2, "#FFEE58");
        svg += drawFlower(135, 90, 1.2, "#FFEE58");
        svg += drawFlower(85, 75, 1.2, "#FFEE58");
      } else {
        // Stage 4+: fruits (more at stage 5-6)
        svg += drawTomato(65, 120, 1);
        svg += drawTomato(50, 125, 0.8);
        svg += drawTomato(135, 90, 1.2);
        svg += drawTomato(125, 75, 0.9);
        svg += drawTomato(85, 75, 1);
        if (stage >= 5) {
          svg += drawTomato(45, 112, 0.85);
          svg += drawTomato(155, 87, 0.9);
          svg += drawTomato(100, 62, 1.05);
        }
      }
    }
    else if (plantKey === 'potato') {
      // Seed potato and underground stem
      svg += drawPotato(100, 160, 0.6, -10);
      svg += `<path d="M100,152 Q100,140 100,130" stroke="${stemColor}" stroke-width="6" fill="none"/>`;
      // Roots
      svg += `<path d="M100,160 Q80,160 70,180 M100,160 Q120,160 130,175 M100,160 Q105,170 95,190 M100,160 Q130,150 145,170 M100,160 Q75,150 60,165 M100,160 Q115,185 110,200" fill="none" stroke="#795548" stroke-width="1.5"/>`;
      
      // Potatoes
      if (stage === 3) {
        svg += drawPotato(80, 175, 0.8, -15);
        svg += drawPotato(125, 165, 0.7, 25);
        svg += drawPotato(100, 185, 0.9, 10);
        svg += drawPotato(70, 190, 0.5, 40);
      } else if (stage === 4) {
        svg += drawPotato(80, 175, 1.3, -15);
        svg += drawPotato(125, 165, 1.1, 25);
        svg += drawPotato(100, 185, 1.4, 10);
        svg += drawPotato(140, 180, 0.9, -20);
        svg += drawPotato(70, 190, 0.8, 40);
        svg += drawPotato(110, 200, 1.0, -10);
        svg += drawPotato(60, 165, 1.1, 50);
      } else {
        // Stage 5-6: abundant underground harvest
        svg += drawPotato(80, 175, 1.5, -15);
        svg += drawPotato(125, 165, 1.3, 25);
        svg += drawPotato(100, 185, 1.6, 10);
        svg += drawPotato(140, 180, 1.1, -20);
        svg += drawPotato(70, 190, 1.0, 40);
        svg += drawPotato(110, 200, 1.2, -10);
        svg += drawPotato(60, 165, 1.3, 50);
        svg += drawPotato(152, 173, 0.9, 35);
        svg += drawPotato(48, 178, 0.8, -35);
      }
      
      // Above ground stems
      svg += drawStem(100, 130, 95, 40, 8);
      svg += drawStem(100, 130, 55, 70, 6);
      svg += drawStem(100, 130, 145, 60, 6);
      
      svg += drawBroadLeaf(80, 100, 1.1, -40);
      svg += drawBroadLeaf(55, 70, 1.2, -60);
      svg += drawBroadLeaf(120, 95, 1.1, 40);
      svg += drawBroadLeaf(145, 60, 1.2, 60);
      svg += drawBroadLeaf(95, 70, 1.1, -10);
      svg += drawBroadLeaf(95, 40, 1.3, 10);
      
      if (stage === 4 || stage === 5) {
        svg += drawFlower(95, 30, 1.2, "#FFF");
        svg += drawFlower(85, 35, 1, "#FFF");
        svg += drawFlower(105, 35, 1, "#FFF");
      }
    }
    else if (plantKey === 'cabbage') {
      svg += drawCabbageLeafWavy(100, 180, 1.6, -70, "#4CAF50");
      svg += drawCabbageLeafWavy(100, 180, 1.6, 70, "#4CAF50");
      svg += drawCabbageLeafWavy(100, 170, 1.5, -50, "#66BB6A");
      svg += drawCabbageLeafWavy(100, 170, 1.5, 50, "#66BB6A");
      svg += drawCabbageLeafWavy(100, 175, 1.4, -30, "#81C784");
      svg += drawCabbageLeafWavy(100, 175, 1.4, 30, "#81C784");
      
      if (stage === 3) {
        // No head yet — just growing leaves
        svg += drawCabbageLeafWavy(100, 160, 1.2, -15, "#A5D6A7");
        svg += drawCabbageLeafWavy(100, 160, 1.2, 15, "#A5D6A7");
        svg += drawCabbageLeafWavy(100, 150, 1, 0, "#C8E6C9");
      } else if (stage === 4) {
        // Head forming
        svg += `<circle cx="100" cy="120" r="45" fill="url(#cabbage-grad)" filter="url(#shadow)"/>`;
        svg += `<path d="M55,120 C55,80 80,75 100,75 C110,75 120,80 120,90 C120,110 90,165 55,120 Z" fill="#C8E6C9" stroke="#E8F5E9" stroke-width="1.5" filter="url(#soft-shadow)"/>`;
        svg += `<path d="M145,120 C145,80 120,75 100,75 C90,75 80,80 80,90 C80,110 110,165 145,120 Z" fill="#A5D6A7" stroke="#E8F5E9" stroke-width="1.5" filter="url(#soft-shadow)"/>`;
        svg += drawCabbageLeafWavy(100, 160, 1.2, -15, "#A5D6A7");
        svg += drawCabbageLeafWavy(100, 160, 1.2, 15, "#A5D6A7");
      } else {
        // Stage 5: full firm head | Stage 6: bolting with flower stalk
        svg += `<circle cx="100" cy="114" r="52" fill="url(#cabbage-grad)" filter="url(#shadow)"/>`;
        svg += `<path d="M48,114 C48,70 76,65 100,65 C112,65 124,70 124,82 C124,108 88,165 48,114 Z" fill="#C8E6C9" stroke="#E8F5E9" stroke-width="1.5" filter="url(#soft-shadow)"/>`;
        svg += `<path d="M152,114 C152,70 124,65 100,65 C88,65 76,70 76,82 C76,108 112,165 152,114 Z" fill="#A5D6A7" stroke="#E8F5E9" stroke-width="1.5" filter="url(#soft-shadow)"/>`;
        svg += drawCabbageLeafWavy(100, 160, 1.3, -15, "#A5D6A7");
        svg += drawCabbageLeafWavy(100, 160, 1.3, 15, "#A5D6A7");
        if (stage === 6) {
          // Bolting: flower stalk shooting up from head
          svg += `<path d="M100,65 Q97,42 100,20" stroke="#558B2F" stroke-width="4" fill="none" filter="url(#shadow)"/>`;
          svg += drawFlower(100, 20, 1.5, "#FFEE58");
          svg += drawFlower(88, 30, 1, "#FFEE58");
          svg += drawFlower(112, 28, 1.1, "#FFEE58");
        }
      }
    }
    else if (plantKey === 'cucumber') {
      svg += `<line x1="70" y1="30" x2="70" y2="180" stroke="#90A4AE" stroke-width="3" filter="url(#shadow)" />`;
      svg += `<line x1="130" y1="30" x2="130" y2="180" stroke="#90A4AE" stroke-width="3" filter="url(#shadow)" />`;
      svg += `<line x1="40" y1="70" x2="160" y2="70" stroke="#90A4AE" stroke-width="3" filter="url(#shadow)" />`;
      svg += `<line x1="40" y1="120" x2="160" y2="120" stroke="#90A4AE" stroke-width="3" filter="url(#shadow)" />`;
      
      svg += `<path d="M100,175 Q110,140 85,120 T65,80 T90,40 T140,50 T130,90" fill="none" stroke="${stemColor}" stroke-width="5" filter="url(#shadow)"/>`;
      
      svg += drawCucumberLeaf(100, 155, 0.8, -20);
      svg += drawCucumberLeaf(85, 120, 1, -50);
      svg += drawTendril(85, 120, 1, -20);
      svg += drawCucumberLeaf(65, 80, 1.1, -70);
      svg += drawTendril(65, 80, 1.2, 30);
      svg += drawCucumberLeaf(90, 40, 1.2, 10);
      svg += drawCucumberLeaf(140, 50, 1.1, 50);
      svg += drawCucumberLeaf(130, 90, 0.9, 80);
      
      if (stage === 3) {
        svg += drawFlower(80, 125, 1, "#FFEB3B");
        svg += drawFlower(70, 90, 1, "#FFEB3B");
        svg += drawFlower(135, 60, 1, "#FFEB3B");
      } else {
        svg += drawCucumber(80, 130, 1.1, -5);
        svg += drawCucumber(70, 95, 1.3, 10);
        svg += drawCucumber(135, 60, 1.2, -15);
        svg += drawFlower(95, 45, 1.2, "#FFEB3B");
        svg += drawFlower(145, 55, 1.2, "#FFEB3B");
        if (stage >= 5) {
          svg += drawCucumber(50, 112, 1.0, 15);
          svg += drawCucumber(155, 82, 0.9, -20);
        }
      }
    }
    else if (plantKey === 'apple') {
      svg += drawStem(100, 190, 100, 80, 20, "url(#trunk-grad)");
      svg += `<path d="M100,120 Q60,100 40,70" fill="none" stroke="url(#trunk-grad)" stroke-width="12" filter="url(#shadow)"/>`;
      svg += `<path d="M100,100 Q140,90 160,50" fill="none" stroke="url(#trunk-grad)" stroke-width="10" filter="url(#shadow)"/>`;
      svg += `<path d="M100,80 Q100,50 110,30" fill="none" stroke="url(#trunk-grad)" stroke-width="10" filter="url(#shadow)"/>`;
      
      svg += `<circle cx="50" cy="70" r="35" fill="#388E3C" filter="url(#shadow)"/>`;
      svg += `<circle cx="150" cy="60" r="35" fill="#388E3C" filter="url(#shadow)"/>`;
      svg += `<circle cx="110" cy="40" r="40" fill="#2E7D32" filter="url(#shadow)"/>`;
      svg += `<circle cx="80" cy="50" r="45" fill="#4CAF50" filter="url(#shadow)"/>`;
      svg += `<circle cx="120" cy="80" r="40" fill="#4CAF50" filter="url(#shadow)"/>`;
      
      svg += drawAppleLeaf(40, 60, 0.8, -20);
      svg += drawAppleLeaf(160, 50, 0.8, 30);
      svg += drawAppleLeaf(80, 30, 0.9, -10);
      
      if (stage === 3) {
        svg += drawFlower(45, 80, 1.2, "#FCE4EC");
        svg += drawFlower(110, 50, 1.2, "#FCE4EC");
        svg += drawFlower(150, 70, 1.2, "#FCE4EC");
      } else {
        svg += drawApple(45, 80, 1.2);
        svg += drawApple(70, 60, 1);
        svg += drawApple(110, 50, 1.3);
        svg += drawApple(150, 70, 1.1);
        svg += drawApple(130, 95, 1);
        svg += drawApple(90, 90, 1.2);
        if (stage >= 5) {
          svg += drawApple(55, 95, 1);
          svg += drawApple(162, 85, 0.9);
        }
        if (stage === 6) {
          // Fallen apples on soil
          svg += drawApple(76, 132, 0.65);
          svg += drawApple(130, 132, 0.6);
        }
      }
    }
    // Stage 6: seeds on soil (한살이 완성 — 씨앗으로 돌아옴)
    if (stage === 6) {
      svg += drawSeedPile();
    }
  }
  
  svg += `</svg>`;

  // Scope all SVG IDs to this call to prevent conflicts when multiple SVGs coexist in DOM
  const ids = ['shadow', 'soft-shadow', 'tomato-grad', 'potato-grad', 'cucumber-grad', 'apple-grad', 'cabbage-grad', 'trunk-grad'];
  ids.forEach(id => {
    svg = svg.replaceAll(`id="${id}"`, `id="${id}-${uid}"`)
             .replaceAll(`url(#${id})`, `url(#${id}-${uid})`);
  });

  return svg;
}


// 4. View Navigation Utility
function switchView(viewName) {
  appState.currentView = viewName;
  
  // Hide all views, display the selected one
  document.querySelectorAll('.view-section').forEach(view => {
    view.classList.remove('active');
    view.classList.add('hidden');
  });

  const activeView = document.getElementById('view-' + viewName);
  if (activeView) {
    activeView.classList.remove('hidden');
    // Force reflow for transitions
    void activeView.offsetWidth;
    activeView.classList.add('active');
  }

  // Header display logic
  const header = document.getElementById('main-header');
  if (viewName === 'intro' || viewName === 'test' || viewName === 'loading') {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }

  // Handle specialized view entries
  if (viewName === 'dashboard') {
    startSimulation();
    initWeather();
    updateDashboardUI();
  } else {
    stopSimulation();
  }
}


// 5. Personality Test Logic
function initTest() {
  appState.testAnswers = [];
  appState.currentQuestionIndex = 0;
  renderQuestion();
}

function renderQuestion() {
  const currentQuestion = testQuestions[appState.currentQuestionIndex];
  
  // Update progress bar
  const progressPercent = ((appState.currentQuestionIndex + 1) / testQuestions.length) * 100;
  document.getElementById('test-progress-fill').style.width = `${progressPercent}%`;
  document.getElementById('test-progress-text').innerText = `${appState.currentQuestionIndex + 1} / ${testQuestions.length}`;
  
  // Render question text
  document.getElementById('test-question-title').innerText = currentQuestion.title;
  
  // Render options grid
  const optionsContainer = document.getElementById('test-options');
  optionsContainer.innerHTML = '';
  
  currentQuestion.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `
      <span class="num-indicator">${idx + 1}</span>
      <span>${opt.text}</span>
    `;
    btn.addEventListener('click', () => handleOptionClick(opt));
    optionsContainer.appendChild(btn);
  });
  
  lucide.createIcons();
}

function handleOptionClick(selectedOption) {
  appState.testAnswers.push(selectedOption);
  
  if (appState.currentQuestionIndex < testQuestions.length - 1) {
    appState.currentQuestionIndex++;
    renderQuestion();
  } else {
    // Process Results
    processTestResults();
  }
}

function processTestResults() {
  switchView('loading');
  
  // Simulate AI matching delay and calculation logging
  let logLines = [
    ">> 성향 데이터 파싱 완료...",
    ">> 학생 정원사 스타일 분석 매개변수 계산 완료...",
    ">> 식물 세포 어포던스 매핑 완료...",
    ">> 최적의 짝꿍 반려 식물 세포 탐색 성공!"
  ];
  
  const logContainer = document.querySelector('.analysis-logs');
  logContainer.innerHTML = '';
  
  let delay = 600;
  logLines.forEach((line, index) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = `log-line ${index === 3 ? 'text-green animate-pulse' : ''}`;
      div.innerText = line;
      logContainer.appendChild(div);
    }, delay * (index + 1));
  });

  setTimeout(() => {
    // Tally personality points
    let tallies = { tomato: 0, potato: 0, cabbage: 0, cucumber: 0, apple: 0 };
    appState.testAnswers.forEach(ans => {
      Object.keys(ans.scores).forEach(key => {
        tallies[key] += ans.scores[key];
      });
    });

    // Select plant with max points
    let maxKey = 'tomato';
    let maxVal = -1;
    Object.keys(tallies).forEach(key => {
      if (tallies[key] > maxVal) {
        maxVal = tallies[key];
        maxKey = key;
      }
    });

    appState.selectedPlantKey = maxKey;
    showResultScreen(maxKey);
  }, 3200);
}

function showResultScreen(plantKey) {
  const profile = plantProfiles[plantKey];
  
  document.getElementById('recommended-plant-name').innerText = profile.name;
  document.getElementById('recommended-plant-slogan').innerText = profile.slogan;
  document.getElementById('recommended-plant-desc').innerText = profile.desc;
  
  // Inject Preview SVG
  const previewBox = document.getElementById('result-plant-preview');
  previewBox.innerHTML = generatePlantSVG(plantKey, 4, { water: 60, sun: 70, wind: 60, soil: 50 }); // Healthy stage 4 as preview
  
  // Set theme color styling of result button
  const startBtn = document.getElementById('btn-adopt-plant');
  startBtn.style.background = `linear-gradient(135deg, ${profile.themeColor} 0%, #37474F 100%)`;
  
  switchView('result');
}


// 6. Growth Simulation Engine
function startSimulation() {
  if (appState.isSimulating) return;
  appState.isSimulating = true;

  // Run simulation interval tick every 2.5 seconds (faster for class)
  appState.simulationIntervalId = setInterval(() => {
    simulationTick();
  }, 2500);
}

function stopSimulation() {
  if (!appState.isSimulating) return;
  appState.isSimulating = false;
  if (appState.simulationIntervalId) {
    clearInterval(appState.simulationIntervalId);
    appState.simulationIntervalId = null;
  }
}

function simulationTick() {
  const profile = plantProfiles[appState.selectedPlantKey];
  if (!profile) return;

  // 1. Natural drain of water, wind levels, and soil nutrient
  let waterDrain = 3;
  let targetSun = 20;
  let targetWind = 20;
  let soilDrain = 1.5;

  // Apply Weather Modifiers
  if (appState.weather === 'sunny') { waterDrain += 2; targetSun += 30; }
  if (appState.weather === 'rainy') { waterDrain -= 10; targetSun -= 10; }
  if (appState.weather === 'windy') { waterDrain += 1; targetWind += 40; }

  // Apply Environment Modifiers
  switch (appState.environment) {
    case 'window':
      waterDrain += 2;
      targetSun += 25;
      targetWind += 5;
      break;
    case 'balcony':
      waterDrain += 1;
      targetSun += 15;
      targetWind += 30;
      break;
    case 'room':
      waterDrain -= 1;
      targetSun -= 10;
      targetWind -= 10;
      break;
    case 'outdoor':
      waterDrain += 3;
      targetSun += 35;
      targetWind += 40;
      soilDrain += 1.0;
      break;
  }

  appState.stats.water = Math.max(0, Math.min(100, appState.stats.water - waterDrain));
  
  // Sun Lamp Override
  if (appState.isSunLampOn) targetSun = 90;
  appState.stats.sun = Math.max(0, Math.min(100, appState.stats.sun + (targetSun - appState.stats.sun) * 0.3));

  // Window Open Override
  if (appState.isWindowOpen) targetWind = Math.max(targetWind, 85);
  appState.stats.wind = Math.max(0, Math.min(100, appState.stats.wind + (targetWind - appState.stats.wind) * 0.3));

  // Soil nutrient slowly consumed
  appState.stats.soil = Math.max(0, Math.min(100, appState.stats.soil - soilDrain));

  // 2. Growth Point Calculation (Check if environment falls in safe range)
  const isWaterSafe = appState.stats.water >= profile.careInfo.water.min && appState.stats.water <= profile.careInfo.water.max;
  const isSunSafe = appState.stats.sun >= profile.careInfo.sun.min && appState.stats.sun <= profile.careInfo.sun.max;
  const isWindSafe = appState.stats.wind >= profile.careInfo.wind.min && appState.stats.wind <= profile.careInfo.wind.max;
  const isSoilSafe = appState.stats.soil >= profile.careInfo.soil.min && appState.stats.soil <= profile.careInfo.soil.max;

  const isIdealGrowth = isWaterSafe && isSunSafe && isWindSafe && isSoilSafe;

  if (isIdealGrowth) {
    // (자동으로 성장 경험치가 오르는 로직을 제거했습니다. 이제 AI 선생님과 대화하며 행동해야 경험치가 오릅니다.)
  }

  // 3. Real weather is applied by KMA API, so random weather is disabled

  updateDashboardUI();
}

function triggerStageLevelUp() {
  const profile = plantProfiles[appState.selectedPlantKey];
  // Add announcement to chat
  const stageNames = ["씨앗", "새싹", "성장기", "개화", "결실", "채종"];
  const stageName = stageNames[appState.growthStage - 1] || "완성";
  const stageEmoji = ["🌱","🌿","🍃","🌸","🍎","🌾"][appState.growthStage - 1] || "🌾";
  addBotMessage(`${stageEmoji} 축하해요! 정원사님 덕분에 [${stageName}] 단계로 성장했어요!`);
}

function triggerWeatherEffect() {
  const weatherIcons = { sunny: 'sun', rainy: 'cloud-rain', windy: 'wind' };
  const weatherTexts = { sunny: '맑음', rainy: '비 내림', windy: '바람 붊' };

  const weatherHud = document.getElementById('hud-weather');
  if (weatherHud) {
    weatherHud.innerHTML = `
      <i data-lucide="${weatherIcons[appState.weather]}" class="text-sunny"></i>
      <span id="hud-weather-text">${weatherTexts[appState.weather]}</span>
    `;
  }
  
  // Set weather class to garden viewport
  const gView = document.getElementById('garden-view-port');
  gView.className = `garden-view weather-${appState.weather}`;
  
  // Manage environmental overlay layers
  const rainLayer = document.getElementById('effect-rain');
  const windLayer = document.getElementById('effect-wind');
  
  if (appState.weather === 'rainy') {
    rainLayer.classList.remove('hidden-effect');
  } else {
    rainLayer.classList.add('hidden-effect');
  }

  if (appState.weather === 'windy' || appState.isWindowOpen) {
    windLayer.classList.remove('hidden-effect');
  } else {
    windLayer.classList.add('hidden-effect');
  }

  lucide.createIcons();
}


// 7. Update Dashboard Views
function updateDashboardUI() {
  const profile = plantProfiles[appState.selectedPlantKey];
  if (!profile) return;

  // 1. Text Labels
  const potNameEl = document.getElementById('pot-plant-name');
  if (potNameEl) potNameEl.innerText = profile.name.toUpperCase();
  document.getElementById('header-user-name').innerText = appState.userName;
  document.getElementById('fertilizer-count').innerText = appState.fertilizerCount;
  
  // Growth stage HUD
  const stageNames = ["씨앗", "새싹", "성장기", "개화", "결실", "채종"];
  const stageName = stageNames[appState.growthStage - 1] || "채종";
  document.getElementById('hud-stage-text').innerText = stageName;
  document.getElementById('growth-stage-indicator').innerText = stageName;
  document.getElementById('growth-percent').innerText = appState.growthXP;
  document.getElementById('growth-fill').style.width = `${appState.growthXP}%`;

  // 2. Pot & Plant SVG
  const plantHolder = document.getElementById('plant-svg-holder');
  plantHolder.innerHTML = generatePlantSVG(appState.selectedPlantKey, appState.growthStage, appState.stats);

  const flowerPotEl = document.querySelector('.flowerpot');
  if (flowerPotEl) {
    if (appState.selectedPlantKey === 'potato' || appState.selectedPlantKey === 'apple') {
      flowerPotEl.style.display = 'none';
    } else {
      flowerPotEl.style.display = '';
    }
  }

  // 3. Stats progress bars & Safe-Zones
  const statsList = ['water', 'sun', 'wind', 'soil'];
  let isAnyDanger = false;
  let dangerMessage = "";

  statsList.forEach(stat => {
    const val = Math.round(appState.stats[stat]);

    // Check danger
    const minVal = profile.careInfo[stat].min;
    const maxVal = profile.careInfo[stat].max;
    
    let statusLabel = "";
    if (val < minVal) {
      isAnyDanger = true;
      dangerMessage = `${stat === 'water' ? '물이 부족해 말라가고 있어요!' : stat === 'sun' ? '햇빛이 너무 부족해 시들시들해요.' : stat === 'wind' ? '공기가 탁해서 숨쉬기 힘들어요.' : '흙에 영양분이 전부 닳았어요!'}`;
      statusLabel = stat === 'water' ? '😟 목말라요!' : stat === 'sun' ? '🌑 어두워요!' : stat === 'wind' ? '😮‍💨 답답해요!' : '🌱 배고파요!';
    } else if (val > maxVal) {
      isAnyDanger = true;
      dangerMessage = `${stat === 'water' ? '과습 상태에요! 뿌리가 썩을 수 있어요.' : stat === 'sun' ? '직사광선이 너무 강해 잎사귀가 타고 있어요!' : stat === 'wind' ? '바람이 너무 강해요.' : '영양 성분이 과다하여 해로워요!'}`;
      statusLabel = stat === 'water' ? '😵 물 너무 많아요!' : stat === 'sun' ? '🥵 너무 뜨거워요!' : stat === 'wind' ? '🌪️ 바람 세요!' : '😰 영양 과다!';
    }

    const chipBtn = document.getElementById(`chip-${stat}`);
    if (chipBtn) {
        const actionName = stat === 'water' ? '물 주기' : stat === 'sun' ? '햇빛 쬐기' : stat === 'wind' ? '환기 하기' : '비료 주기';
        const iconName = stat === 'water' ? 'droplet' : stat === 'sun' ? 'sun' : stat === 'wind' ? 'wind' : 'sparkles';
        chipBtn.innerHTML = `<i data-lucide="${iconName}"></i> ${actionName} ${statusLabel}`;
    }
  });

  // Health warnings box
  const alertBox = document.getElementById('health-alert');
  if (isAnyDanger) {
    alertBox.classList.remove('hidden');
    document.getElementById('health-alert-text').innerText = dangerMessage;
  } else {
    alertBox.classList.add('hidden');
  }

  // Active statuses styling for toggle buttons
  const sunBtn = document.getElementById('btn-care-sun');
  if (sunBtn) {
    if (appState.isSunLampOn) {
      sunBtn.classList.add('btn-sunny');
      sunBtn.innerHTML = `<i data-lucide="sun"></i> 조명 끄기`;
      document.getElementById('effect-sunlight').classList.remove('hidden-effect');
    } else {
      sunBtn.classList.remove('btn-sunny');
      sunBtn.innerHTML = `<i data-lucide="sun-dim"></i> 햇빛쬐기`;
      document.getElementById('effect-sunlight').classList.add('hidden-effect');
    }
  } else {
    // Control effects even if buttons are missing
    if (appState.isSunLampOn) {
      document.getElementById('effect-sunlight').classList.remove('hidden-effect');
    } else {
      document.getElementById('effect-sunlight').classList.add('hidden-effect');
    }
  }

  const windBtn = document.getElementById('btn-care-wind');
  if (windBtn) {
    if (appState.isWindowOpen) {
      windBtn.classList.add('btn-teal');
      windBtn.innerHTML = `<i data-lucide="wind"></i> 창문 닫기`;
      document.getElementById('effect-wind').classList.remove('hidden-effect');
    } else {
      windBtn.classList.remove('btn-teal');
      windBtn.innerHTML = `<i data-lucide="wind"></i> 환기하기`;
      if (appState.weather !== 'windy') {
        document.getElementById('effect-wind').classList.add('hidden-effect');
      }
    }
  } else {
    if (appState.isWindowOpen) {
      document.getElementById('effect-wind').classList.remove('hidden-effect');
    } else if (appState.weather !== 'windy') {
      document.getElementById('effect-wind').classList.add('hidden-effect');
    }
  }

  lucide.createIcons();
}


// 8. Care actions
function giveWater() {
  appState.stats.water = Math.min(100, appState.stats.water + 20);
  
  // Trigger overlay drip animation
  const anim = document.getElementById('water-can-animation');
  anim.classList.remove('hidden-effect');
  setTimeout(() => {
    anim.classList.add('hidden-effect');
  }, 1800);

  addBotMessage("💧 시원한 물 감사합니다! 흙이 수분을 머금어 촉촉해졌어요.");
  updateDashboardUI();
}

function toggleSunLamp() {
  appState.isSunLampOn = !appState.isSunLampOn;
  if (appState.isSunLampOn) {
    appState.stats.sun = Math.min(100, appState.stats.sun + 15);
    addBotMessage("💡 인공 조명(생장용 LED)을 켰습니다! 식물 잎사귀들이 에너지를 내기 시작했어요.");
  } else {
    addBotMessage("💡 조명을 껐습니다. 자연 날씨 상태의 빛으로 돌아갑니다.");
  }
  updateDashboardUI();
}

function toggleWindow() {
  appState.isWindowOpen = !appState.isWindowOpen;
  if (appState.isWindowOpen) {
    appState.stats.wind = Math.min(100, appState.stats.wind + 20);
    addBotMessage("🪟 창문을 시원하게 열었어요! 맑은 바깥바람이 화분 사이로 흘러 들어옵니다.");
  } else {
    addBotMessage("🪟 창문을 닫아 방 안의 공기 흐름을 진정시켰습니다.");
  }
  updateDashboardUI();
}

function useFertilizer() {
  if (appState.fertilizerCount <= 0) {
    addBotMessage("🧪 아이템이 부족합니다! [실과 퀴즈] 탭에서 초등 퀴즈를 풀고 비료를 더 모아보세요!");
    return;
  }

  appState.fertilizerCount--;
  appState.stats.soil = Math.min(100, appState.stats.soil + 30);
  appState.growthXP = Math.min(100, appState.growthXP + 15); // Gives bonus XP

  // Trigger sparkle animation
  const anim = document.getElementById('fertilizer-animation');
  anim.classList.remove('hidden-effect');
  setTimeout(() => {
    anim.classList.add('hidden-effect');
  }, 1800);

  addBotMessage("🧪 유기농 비료를 흙에 솔솔 뿌렸습니다! 영양분도 공급하고 식물이 빠르게 자라도록 도왔어요.");
  updateDashboardUI();
}


// 9. Simulated AI Chat Engine
let isProcessingChat = false;

const MAX_CHAT_BUBBLES = 40;

function trimChatHistory(container) {
  const bubbles = container.querySelectorAll('.chat-bubble');
  if (bubbles.length > MAX_CHAT_BUBBLES) {
    bubbles[1].remove();
  }
}


function addBotMessage(text) {
  const container = document.getElementById('chat-messages-container');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble bot';
  const p = document.createElement('p');
  p.textContent = text;
  const time = document.createElement('span');
  time.className = 'time';
  time.textContent = '방금 전';
  bubble.appendChild(p);
  bubble.appendChild(time);
  container.appendChild(bubble);
  trimChatHistory(container);
  container.scrollTop = container.scrollHeight;
}

function addUserMessage(text) {
  const container = document.getElementById('chat-messages-container');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble user';
  const p = document.createElement('p');
  p.textContent = text;
  const time = document.createElement('span');
  time.className = 'time';
  time.textContent = '방금 전';
  bubble.appendChild(p);
  bubble.appendChild(time);
  container.appendChild(bubble);
  trimChatHistory(container);
  container.scrollTop = container.scrollHeight;
}

async function processUserChat(messageText) {
  if (!messageText.trim() || isProcessingChat) return;
  isProcessingChat = true;

  addUserMessage(messageText);

  // Show thinking delay / indicator
  const container = document.getElementById('chat-messages-container');
  const thinkingBubble = document.createElement('div');
  thinkingBubble.className = 'chat-bubble bot thinking';
  thinkingBubble.innerHTML = `<p><i data-lucide="loader" class="spin-icon"></i> 선생님이 생각 중...</p>`;
  container.appendChild(thinkingBubble);
  container.scrollTop = container.scrollHeight;
  lucide.createIcons();

  try {
    const aiResponse = await fetchGeminiResponse(messageText);
    thinkingBubble.remove();

    if (aiResponse.stats) {
      if (typeof aiResponse.stats.water === 'number') appState.stats.water = Math.max(0, Math.min(100, appState.stats.water + aiResponse.stats.water));
      if (typeof aiResponse.stats.sun === 'number') appState.stats.sun = Math.max(0, Math.min(100, appState.stats.sun + aiResponse.stats.sun));
      if (typeof aiResponse.stats.wind === 'number') appState.stats.wind = Math.max(0, Math.min(100, appState.stats.wind + aiResponse.stats.wind));
      if (typeof aiResponse.stats.soil === 'number') appState.stats.soil = Math.max(0, Math.min(100, appState.stats.soil + aiResponse.stats.soil));
      if (typeof aiResponse.stats.growth === 'number') appState.growthXP = Math.min(100, appState.growthXP + aiResponse.stats.growth);

      updateDashboardUI();

      // Check for growth stage progression
      if (appState.growthXP >= 100) {
        if (appState.growthStage < 6) {
          appState.growthStage++;
          appState.growthXP = 0;
          triggerStageLevelUp();
        }
      }
    }

    addBotMessage(aiResponse.reply || "응답을 불러오지 못했어요.");
  } catch (error) {
    console.error(error);
    thinkingBubble.remove();
    addBotMessage("앗, 선생님이 지금 교무실에 다녀오느라 바쁘네요. 조금 뒤에 다시 말해줄래요?");
  } finally {
    isProcessingChat = false;
  }
}

async function fetchGeminiResponse(userText) {
  const profile = plantProfiles[appState.selectedPlantKey] || { name: '반려 식물' };
  const water = appState.stats.water;
  const sun = appState.stats.sun;
  const wind = appState.stats.wind;
  const soil = appState.stats.soil;

  const systemPrompt = `당신은 초등학교의 다정하고 따뜻한 담임 선생님입니다. 학생(사용자)이 교실에서 가상의 반려 식물을 기르는 것을 도와주고 있습니다.
현재 학생이 기르는 식물은 '${profile.name}'입니다.
현재 식물의 환경 상태: 수분 ${Math.round(water)}%, 햇빛 ${Math.round(sun)}%, 환기 ${Math.round(wind)}%, 영양 ${Math.round(soil)}%. (모든 수치는 40~80%가 적당하며, 너무 낮거나 높으면 식물이 힘들어합니다.)
학생의 메시지: "${userText}"

학생이 식물을 돌보는 행동('물 주기', '햇빛 쬐기', '환기 하기', '비료 주기' 등)을 할 때는 무조건 1문장(한 줄)으로만 아주 짧고 다정하게 코멘트해 주세요. 긴 설명은 생략하세요. 일반적인 대화에서도 짧고 간결하게 대답해 주세요.
학생이 식물에게 도움이 되는 행동(물 주기, 햇빛 쬐기 등)을 했거나 질문에 좋은 대답을 했다면, 수치(water, sun, wind, soil 중 해당하는 것)를 +10 ~ +20 올려주고, 동시에 경험치(growth)를 +10 ~ +20 올려주세요. 행동에 실패했거나 무관한 대답이라면 0을 주세요.
반드시 아래 JSON 형식으로만 응답해야 합니다.
{
  "reply": "학생에게 할 다정한 텍스트 메시지",
  "stats": {
    "water": 0,
    "sun": 0,
    "wind": 0,
    "soil": 0,
    "growth": 0
  }
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: systemPrompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API Error:", response.status, errorText);
    throw new Error('Gemini API 연동 중 오류 발생');
  }

  const data = await response.json();
  if (data.candidates && data.candidates.length > 0) {
    let rawText = data.candidates[0].content.parts[0].text.trim();
    
    try {
      // 가장 처음 나오는 { 부터 가장 마지막에 나오는 } 까지 추출 (불필요한 텍스트 무시)
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("JSON 형태를 찾을 수 없습니다.");
      }
      return JSON.parse(jsonMatch[0]);
    } catch(e) {
      console.error("JSON 파싱 에러:", e, rawText);
      throw e;
    }
  } else {
    throw new Error('응답을 파싱할 수 없습니다.');
  }
}


// 10. Educational Quizzes Logic

function renderBadges() {
  const rack = document.getElementById('badge-rack');
  if (!rack) return;
  rack.innerHTML = '';
  BADGES.forEach(badge => {
    const earned = appState.badges.includes(badge.key);
    const item = document.createElement('div');
    item.className = `badge-item${earned ? ' badge-earned' : ' badge-locked'}`;
    item.title = earned ? badge.desc : '아직 획득하지 못한 뱃지';
    item.innerHTML = `<div class="badge-circle">${earned ? badge.emoji : '🔒'}</div><div class="badge-name">${badge.name}</div>`;
    rack.appendChild(item);
  });
}

function awardBadge(key) {
  if (appState.badges.includes(key)) return;
  appState.badges.push(key);
  renderBadges();
  const badge = BADGES.find(b => b.key === key);
  if (badge) showBadgeNotification(badge);
}

function showBadgeNotification(badge) {
  const existing = document.getElementById('badge-notification');
  if (existing) existing.remove();
  const notif = document.createElement('div');
  notif.id = 'badge-notification';
  notif.className = 'badge-notification';
  notif.innerHTML = `
    <div class="badge-notif-inner">
      <div class="badge-notif-emoji">${badge.emoji}</div>
      <div>
        <div class="badge-notif-title">🎉 새 뱃지 획득!</div>
        <div class="badge-notif-name">${badge.name}</div>
        <div class="badge-notif-desc">${badge.desc}</div>
      </div>
    </div>
  `;
  document.body.appendChild(notif);
  setTimeout(() => notif.classList.add('badge-notif-show'), 50);
  setTimeout(() => {
    notif.classList.remove('badge-notif-show');
    setTimeout(() => notif.remove(), 400);
  }, 3500);
}

function checkStageCompletion(stageIdx) {
  const stage = questStages[stageIdx];
  if (appState.stageCorrectCount === stage.questions.length) {
    awardBadge('perfect_gardener');
  }
  awardBadge(STAGE_BADGE_KEYS[stageIdx]);
  appState.stageCorrectCount = 0;
}

function renderQuestProgress() {
  const bar = document.getElementById('quest-progress-bar');
  if (!bar) return;
  bar.innerHTML = '';
  questStages.forEach((stage, i) => {
    const chip = document.createElement('div');
    chip.className = 'quest-chip';
    if (appState.completedStages.includes(i)) {
      chip.classList.add('quest-chip-done');
      chip.textContent = `${stage.stageEmoji} ${stage.stageName}`;
    } else if (i === appState.quizStageIndex) {
      chip.classList.add('quest-chip-active');
      chip.textContent = `${stage.stageEmoji} ${stage.stageName}`;
    } else {
      chip.classList.add('quest-chip-locked');
      chip.textContent = `🔒 ${stage.stageName}`;
    }
    bar.appendChild(chip);
  });
}

function loadQuiz() {
  renderQuestProgress();

  const stage = questStages[appState.quizStageIndex];
  const qData = stage.questions[appState.quizQIndexInStage];

  const card = document.getElementById('quiz-card');
  card.innerHTML = `
    <div class="quiz-header-badge">
      <i data-lucide="graduation-cap" class="text-green"></i>
      <span id="quiz-stage-label">${stage.stageEmoji} ${stage.stageName} — ${appState.quizQIndexInStage + 1}/${stage.questions.length}번</span>
    </div>
    <h3 id="quiz-question"></h3>
    <div class="quiz-options-list" id="quiz-options-list"></div>
    <div id="quiz-result-feedback" class="quiz-feedback-box hidden">
      <div class="feedback-icon-circle" id="quiz-feedback-icon-container">
        <i data-lucide="check" class="text-green"></i>
      </div>
      <h4 id="quiz-feedback-title">정답입니다!</h4>
      <p id="quiz-feedback-desc">설명이 여기에 나타납니다.</p>
      <div class="reward-indicator text-green">
        <i data-lucide="sparkles"></i> 친환경 비료 1개 획득!
      </div>
      <button id="btn-next-quiz" class="btn-primary btn-full mt-10">다음 문제 도전하기 →</button>
    </div>
  `;

  document.getElementById('quiz-question').textContent = qData.question;

  const optionsWrapper = document.getElementById('quiz-options-list');
  optionsWrapper.style.pointerEvents = 'all';
  qData.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleQuizAnswer(index, btn));
    optionsWrapper.appendChild(btn);
  });

  document.getElementById('btn-next-quiz').addEventListener('click', nextQuiz);
  lucide.createIcons();
}

function handleQuizAnswer(chosenIndex, btnElement) {
  const stage = questStages[appState.quizStageIndex];
  const qData = stage.questions[appState.quizQIndexInStage];
  const optionsWrapper = document.getElementById('quiz-options-list');

  optionsWrapper.style.pointerEvents = 'none';

  const feedbackBox = document.getElementById('quiz-result-feedback');
  const fbTitle = document.getElementById('quiz-feedback-title');
  const fbDesc = document.getElementById('quiz-feedback-desc');
  const fbIconContainer = document.getElementById('quiz-feedback-icon-container');
  const nextBtn = document.getElementById('btn-next-quiz');

  const isLastQInStage = (appState.quizQIndexInStage === stage.questions.length - 1);
  const isLastStage = (appState.quizStageIndex === questStages.length - 1);

  if (chosenIndex === qData.answer) {
    btnElement.classList.add('correct');
    appState.fertilizerCount++;
    appState.stageCorrectCount++;
    document.getElementById('fertilizer-count').textContent = appState.fertilizerCount;
    fbTitle.textContent = "정답입니다! 🌟";
    fbTitle.className = "text-green";
    fbDesc.textContent = qData.explanation;
    fbIconContainer.className = "feedback-icon-circle";
    fbIconContainer.innerHTML = '<i data-lucide="check" class="text-green"></i>';
    document.querySelector('.reward-indicator').classList.remove('hidden');
  } else {
    btnElement.classList.add('wrong');
    const correctBtn = optionsWrapper.children[qData.answer];
    if (correctBtn) correctBtn.classList.add('correct');
    fbTitle.textContent = "아쉬워요! 💡";
    fbTitle.className = "text-brown";
    fbDesc.textContent = qData.explanation;
    fbIconContainer.className = "feedback-icon-circle wrong-icon";
    fbIconContainer.innerHTML = '<i data-lucide="x"></i>';
    document.querySelector('.reward-indicator').classList.add('hidden');
  }

  if (isLastQInStage && isLastStage) {
    nextBtn.textContent = "🎉 모든 퀘스트 완료!";
  } else if (isLastQInStage) {
    nextBtn.textContent = "🏆 다음 단계로 이동 →";
  } else {
    nextBtn.textContent = "다음 문제 도전하기 →";
  }

  feedbackBox.classList.remove('hidden');
  lucide.createIcons();
}

function nextQuiz() {
  const stage = questStages[appState.quizStageIndex];
  const isLastQInStage = (appState.quizQIndexInStage === stage.questions.length - 1);

  if (isLastQInStage) {
    appState.completedStages.push(appState.quizStageIndex);
    if (appState.quizStageIndex === questStages.length - 1) {
      showAllQuestsComplete();
    } else {
      showStageComplete();
    }
  } else {
    appState.quizQIndexInStage++;
    loadQuiz();
  }
}

function showStageComplete() {
  const completedStageIdx = appState.quizStageIndex;
  const completedStage = questStages[completedStageIdx];
  checkStageCompletion(completedStageIdx);

  appState.quizStageIndex++;
  appState.quizQIndexInStage = 0;

  appState.fertilizerCount += 2;
  document.getElementById('fertilizer-count').textContent = appState.fertilizerCount;

  const nextStage = questStages[appState.quizStageIndex];
  renderQuestProgress();

  const card = document.getElementById('quiz-card');
  card.innerHTML = `
    <div style="text-align:center; padding: 20px 10px;">
      <div style="font-size: 3em; margin-bottom: 10px;">${completedStage.stageEmoji}</div>
      <h3 style="color: var(--primary-green); margin-bottom: 8px;">${completedStage.stageName} 완료!</h3>
      <p style="font-size: 13px; color: #555; margin-bottom: 16px;">정말 잘했어요! 비료 2개를 추가로 획득했어요 🌿</p>
      <div style="background: #E8F5E9; border-radius: 12px; padding: 14px; margin-bottom: 20px;">
        <div style="font-size: 1.6em;">${nextStage.stageEmoji}</div>
        <div style="font-weight: 700; color: #2E7D32; margin: 4px 0;">${nextStage.stageName}</div>
        <div style="font-size: 12px; color: #555;">${nextStage.stageDesc}</div>
      </div>
      <button id="btn-stage-next" class="btn-primary btn-full">다음 단계 시작하기 →</button>
    </div>
  `;
  document.getElementById('btn-stage-next').addEventListener('click', loadQuiz);
}

function showAllQuestsComplete() {
  checkStageCompletion(appState.quizStageIndex);
  awardBadge('plant_doctor');

  appState.fertilizerCount += 3;
  document.getElementById('fertilizer-count').textContent = appState.fertilizerCount;

  appState.quizStageIndex = 0;
  appState.quizQIndexInStage = 0;
  appState.completedStages = [];
  renderQuestProgress();

  const card = document.getElementById('quiz-card');
  card.innerHTML = `
    <div style="text-align:center; padding: 20px 10px;">
      <div style="font-size: 3.5em; margin-bottom: 10px;">🏆</div>
      <h3 style="color: var(--primary-green); margin-bottom: 8px;">식물 한살이 마스터!</h3>
      <p style="font-size: 13px; color: #555; margin-bottom: 12px;">모든 퀘스트를 완료했어요! 비료 3개를 추가로 획득했어요 🌟</p>
      <p style="font-size: 12px; color: #888; margin-bottom: 20px;">처음부터 다시 도전해서 실력을 확인해 보세요!</p>
      <button id="btn-quest-replay" class="btn-primary btn-full">🌱 다시 도전하기</button>
    </div>
  `;
  document.getElementById('btn-quest-replay').addEventListener('click', loadQuiz);
}


// 11. Observation Diary Logic
let uploadedPhotosBase64 = [];

async function saveDiary() {
  const textArea = document.getElementById('diary-text');
  const text = textArea.value.trim();
  
  if (!text) {
    alert("일기 내용을 적어주세요!");
    return;
  }

  const activeMoodBtn = document.querySelector('.mood-btn.active');
  const moodKey = activeMoodBtn ? activeMoodBtn.getAttribute('data-mood') : 'joy';
  const emotion = INSIDE_OUT_EMOTIONS[moodKey] || INSIDE_OUT_EMOTIONS.joy;
  
  const saveBtn = document.getElementById('btn-save-diary');
  const originalBtnText = saveBtn.innerHTML;
  saveBtn.innerHTML = '<i data-lucide="loader" class="spin-icon"></i> AI가 하루 요약 그림을 그리는 중...';
  saveBtn.disabled = true;
  lucide.createIcons();

  let generatedImageUrl = "";
  try {
    const prompt = await fetchImagePromptFromGemini(text, emotion.label);
    if (prompt) {
      generatedImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=400&height=300&nologo=true`;
    }
  } catch(e) {
    console.error("Failed to generate image prompt", e);
  }
  
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const entry = {
    date: dateStr,
    moodKey: moodKey,
    mood: emotion.emoji + ' ' + emotion.label,
    color: emotion.color,
    content: text,
    imageUrl: generatedImageUrl,
    userPhotos: uploadedPhotosBase64.slice()
  };

  appState.diaryList.unshift(entry);
  
  // Reset UI
  textArea.value = '';
  document.getElementById('diary-ghost-text').innerHTML = '';
  const fileUpload = document.getElementById('diary-photo-upload');
  if (fileUpload) fileUpload.value = '';
  const previewContainer = document.getElementById('photo-preview-container');
  if (previewContainer) previewContainer.innerHTML = '';
  uploadedPhotosBase64 = [];
  
  renderDiaries();
  analyzeEmotionWeather();

  const xpGain = (appState.weather === 'rainy') ? 20 : 10;
  appState.growthXP = Math.min(100, appState.growthXP + xpGain);
  if (appState.growthXP >= 100 && appState.growthStage < 6) {
    appState.growthStage++;
    appState.growthXP = 0;
    triggerStageLevelUp();
  }

  updateDashboardUI();

  saveBtn.innerHTML = originalBtnText;
  saveBtn.disabled = false;
  lucide.createIcons();

  if (appState.weather === 'rainy') {
    addBotMessage(`🌧️ ${emotion.label}의 시간을 일기로 표현해줘서 고마워요! 비 온 뒤 흙이 더 단단해지듯, 식물이 폭발적으로 성장했어요! ×2.0 XP 획득 🌱`);
  } else {
    addBotMessage(`📝 ${emotion.label}의 하루를 일기로 남겨줘서 고마워요! 식물도 함께 성장했답니다 🌱`);
  }
}

async function fetchImagePromptFromGemini(text, mood) {
  const prompt = `당신은 초등학생 일기를 바탕으로 그림 프롬프트를 생성하는 AI입니다.
아래 일기에서 가장 구체적이고 기억에 남는 장면을 딱 하나 골라, 그 순간을 담은 영문 그림 프롬프트를 작성하세요.

규칙:
1. 일기 속 실제 사건·행동을 반드시 포함할 것 (예: hands holding a pencil writing in a notebook, walking home through fallen autumn leaves)
2. 시점은 반드시 1인칭(나의 눈으로 보이는 장면, POV)으로 묘사할 것 — 주인공 캐릭터가 화면에 등장하지 않도록 함
3. 등장인물은 반드시 사람(human)이어야 하며, 의인화된 동물 캐릭터는 절대 등장하지 않을 것
4. 감정(${mood})에 맞는 분위기와 색감을 넣을 것
5. 마지막에 반드시 ", first-person POV, soft watercolor illustration, children's storybook style, warm pastel colors, no text, no anthropomorphic animals" 를 붙일 것
6. 영문 한 문장(60단어 이하)만 출력할 것. 설명이나 따옴표 없이 프롬프트 문장만 출력.

일기 내용: "${text}"
오늘의 감정: ${mood}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 150 }
    })
  });
  
  if (!response.ok) return null;
  const data = await response.json();
  if (data.candidates && data.candidates.length > 0) {
    return data.candidates[0].content.parts[0].text.trim();
  }
  return null;
}

// 핵심 로직: 최근 3개 일기의 감정 패턴 → 식물 날씨 분석
//
// [조건] — 인사이드 아웃 캐릭터 기반
// ① 슬픔이/따분이/불안이가 2개 이상 → rainy  (성장 x2 보너스!)
// ② 기쁨이가 2개 이상               → sunny
// ③ 버럭이/소심이가 2개 이상         → windy
// ④ 그 외                            → 현재 날씨 유지
function analyzeEmotionWeather() {
  const recent = appState.diaryList.slice(0, 3); // 최근 3개
  if (recent.length === 0) return;

  const rainCount  = recent.filter(e => INSIDE_OUT_EMOTIONS[e.moodKey]?.causeRain).length;
  const sunnyCount = recent.filter(e => INSIDE_OUT_EMOTIONS[e.moodKey]?.causeSunny).length;
  const windCount  = recent.filter(e => INSIDE_OUT_EMOTIONS[e.moodKey]?.causeWind).length;

  let newWeather = appState.weather;

  if      (rainCount  >= 2) newWeather = 'rainy';
  else if (sunnyCount >= 2) newWeather = 'sunny';
  else if (windCount  >= 2) newWeather = 'windy';

  if (newWeather !== appState.weather) {
    appState.weather = newWeather;
    triggerWeatherEffect();

    const msgs = {
      rainy: '🌧️ 마음 속 감정들이 모여 비가 내리기 시작했어요. 슬픈 마음도 일기로 쓰면 식물의 양분이 된답니다 🌱',
      sunny: '☀️ 기쁨찬 하루들이 모여서 해가 떠올랐어요! 식물도 덩달아 활짝 웃고 있어요 ☀️',
      windy: '💨 강렬한 감정들이 맞닿아 바람이 불어요. 식물도 함께 힘차게 버텨낼 거예요! 💨',
    };
    if (msgs[newWeather]) addBotMessage(msgs[newWeather]);
  }
}

function renderDiaries() {
  const container = document.getElementById('diary-list-container');
  document.getElementById('diary-count').innerText = appState.diaryList.length;

  if (appState.diaryList.length === 0) {
    container.innerHTML = `
      <div class="empty-diary-state">
        <i data-lucide="book-dashed" class="icon-huge opacity-30"></i>
        <p>아직 기록된 일기가 없습니다. 식물에게 오늘 하루를 들려주세요!</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = '';
  appState.diaryList.forEach(diary => {
    const card = document.createElement('div');
    card.className = 'diary-card';
    const bgColor = diary.color || '#888';
    
    let mediaHtml = '';
    
    if (diary.imageUrl) {
      mediaHtml += `<div style="margin-bottom:10px;"><img src="${diary.imageUrl}" style="width:100%; border-radius:8px; max-height:200px; object-fit:cover;" alt="AI 요약 그림"></div>`;
    }
    
    if (diary.userPhotos && diary.userPhotos.length > 0) {
      mediaHtml += `<div style="display:flex; gap:8px; overflow-x:auto; margin-bottom:10px;">`;
      diary.userPhotos.forEach(photo => {
        mediaHtml += `<img src="${photo}" style="width:80px; height:80px; object-fit:cover; border-radius:8px; flex-shrink:0;">`;
      });
      mediaHtml += `</div>`;
    }

    card.innerHTML = `
      <div class="diary-card-header">
        <span class="diary-date"><i data-lucide="calendar" class="icon-small"></i> ${diary.date}</span>
        <span class="diary-mood-chip" style="background:${bgColor}22; color:${bgColor}; border:1px solid ${bgColor}55">${diary.mood}</span>
      </div>
      ${mediaHtml}
      <p class="diary-body">${escapeHTML(diary.content)}</p>
    `;
    container.appendChild(card);
  });

  lucide.createIcons();
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// --- Real-Time Weather System (Open-Meteo API, CORS-free) ---

// Real weather data stored globally
let realWeatherData = null;
let clockIntervalId = null;

// WMO weather code to Korean description + emoji
function decodeWMO(code) {
  if (code === 0) return { text: "맑음", emoji: "☀️", type: "sunny" };
  if (code <= 2) return { text: "구름 조금", emoji: "🌤️", type: "sunny" };
  if (code === 3) return { text: "흐림", emoji: "☁️", type: "cloudy" };
  if (code <= 49) return { text: "안개", emoji: "🌫️", type: "cloudy" };
  if (code <= 59) return { text: "이슬비", emoji: "🌦️", type: "rainy" };
  if (code <= 69) return { text: "비", emoji: "🌧️", type: "rainy" };
  if (code <= 79) return { text: "눈", emoji: "🌨️", type: "rainy" };
  if (code <= 84) return { text: "소나기", emoji: "⛈️", type: "rainy" };
  if (code <= 99) return { text: "뇌우", emoji: "🌩️", type: "rainy" };
  return { text: "알 수 없음", emoji: "🌡️", type: "sunny" };
}

// Reverse geocoding to get location name
async function getLocationName(lat, lon) {
  try {
    const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ko`);
    if (!resp.ok) return null;
    const data = await resp.json();
    const addr = data.address;
    // Try to get city/town/village level name
    const city = addr.city || addr.town || addr.village || addr.county || addr.state || "";
    const district = addr.suburb || addr.borough || addr.neighbourhood || "";
    return district ? `${city} ${district}` : city;
  } catch (e) {
    return null;
  }
}

// Generate plant care advice based on real weather
function generatePlantWeatherAdvice(weatherData) {
  const profile = plantProfiles[appState.selectedPlantKey];
  if (!profile) return "날씨 정보를 확인하세요.";

  const temp = weatherData.temperature;
  const windMs = weatherData.windspeed;
  const precip = weatherData.precipitation;
  const humidity = weatherData.humidity;
  const wType = weatherData.weatherType;

  let advices = [];

  // Temperature advice
  if (temp < 10) {
    advices.push(`기온이 ${temp}°C로 매우 낮아요. 식물을 실내로 옮기거나 보온에 신경 쓰세요.`);
  } else if (temp >= 10 && temp <= 15) {
    advices.push(`기온 ${temp}°C — 약간 쌀쌀해요. 보온에 주의하세요.`);
  } else if (temp >= 16 && temp <= 28) {
    advices.push(`기온 ${temp}°C — 식물이 좋아하는 쾌적한 날씨예요! 🌿`);
  } else if (temp > 28 && temp <= 35) {
    advices.push(`기온 ${temp}°C로 더워요. 물을 자주 주고 그늘에서 키우세요.`);
  } else if (temp > 35) {
    advices.push(`기온 ${temp}°C! 폭염 주의 — 오전/저녁에만 햇빛을 쬐어 주세요.`);
  }

  // Rain advice
  if (wType === 'rainy') {
    if (precip > 0) {
      advices.push(`강수량 ${precip}mm — 오늘은 물주기를 줄이거나 건너뛰어도 괜찮아요.`);
    }
    advices.push(`비가 오는 날씨예요. 화분의 배수가 잘 되는지 확인하세요.`);
  }

  // Wind advice
  if (windMs >= 5 && windMs < 10) {
    advices.push(`바람이 ${windMs}m/s — 가벼운 지지대를 세워주면 좋아요.`);
  } else if (windMs >= 10) {
    advices.push(`강풍 ${windMs}m/s! 줄기가 부러지지 않도록 안으로 들이거나 지지대를 고정하세요.`);
  }

  // Humidity advice
  if (humidity < 30) {
    advices.push(`습도 ${humidity}% — 건조해요. 분무기로 잎에 물을 가볍게 뿌려주세요.`);
  } else if (humidity > 80) {
    advices.push(`습도 ${humidity}% — 높아요. 과습에 주의하고 통풍을 강화하세요.`);
  }

  return advices.length > 0 ? advices[0] : `현재 날씨(${weatherData.weatherText})는 식물 관리에 적합합니다.`;
}

// Start the live clock (HH:MM, updates every minute)
function startClock() {
  if (clockIntervalId) clearInterval(clockIntervalId);
  function updateClock() {
    const el = document.getElementById('w-clock');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }
  updateClock();
  clockIntervalId = setInterval(updateClock, 60000);
}

// Apply real weather to simulation stats
function applyRealWeatherToStats(weatherData) {
  const temp = weatherData.temperature;
  const windMs = weatherData.windspeed;
  const precip = weatherData.precipitation;
  const wType = weatherData.weatherType;

  // Map real temp to sun stat (10–35°C → 20–90)
  let sunFromTemp = Math.round(((temp - 5) / 35) * 80 + 10);
  sunFromTemp = Math.max(10, Math.min(95, sunFromTemp));

  // Map wind speed to wind stat (0–20 m/s → 20–100)
  let windStat = Math.round((windMs / 20) * 80 + 20);
  windStat = Math.max(20, Math.min(100, windStat));

  // Rain adds water stat
  if (wType === 'rainy') {
    appState.stats.water = Math.min(100, appState.stats.water + (precip > 0 ? 15 : 8));
    appState.weather = 'rainy';
  } else if (windMs >= 7) {
    appState.weather = 'windy';
  } else {
    appState.weather = 'sunny';
  }

  // Gradually adjust sun stat based on real temperature (50% blend)
  appState.stats.sun = Math.round(appState.stats.sun * 0.5 + sunFromTemp * 0.5);
  // Gradually adjust wind stat (40% blend)
  appState.stats.wind = Math.round(appState.stats.wind * 0.6 + windStat * 0.4);

  triggerWeatherEffect();
}

// Main weather init function
async function initWeather() {
  try {
    let lat, lon, locationName;

    if (navigator.geolocation) {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
        });
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        locationName = await getLocationName(lat, lon);
      } catch (e) {
        // Geolocation denied or failed — use Seoul default
        lat = 37.5665;
        lon = 126.9780;
        locationName = "서울 (기본 위치)";
      }
    } else {
      lat = 37.5665;
      lon = 126.9780;
      locationName = "서울 (기본 위치)";
    }

    await fetchOpenMeteoWeather(lat, lon, locationName || "내 위치");
  } catch (error) {
    console.error("Weather init failed:", error);
    showWeatherError();
  }
}

async function fetchOpenMeteoWeather(lat, lon, locationName) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m` +
      `&wind_speed_unit=ms&timezone=auto`;

    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Open-Meteo fetch failed");
    const data = await resp.json();

    const cur = data.current;
    const wmo = decodeWMO(cur.weather_code);

    realWeatherData = {
      temperature: Math.round(cur.temperature_2m * 10) / 10,
      humidity: cur.relative_humidity_2m,
      precipitation: Math.round(cur.precipitation * 10) / 10,
      windspeed: Math.round(cur.wind_speed_10m * 10) / 10,
      weatherCode: cur.weather_code,
      weatherText: wmo.text,
      weatherEmoji: wmo.emoji,
      weatherType: wmo.type,
      location: locationName
    };

    updateWeatherPanel(realWeatherData);
    applyRealWeatherToStats(realWeatherData);
    updateDashboardUI();

    // Post a chat notification about real weather
    const advice = generatePlantWeatherAdvice(realWeatherData);
    addBotMessage(`🌍 [${locationName}] 실시간 날씨: ${wmo.emoji} ${wmo.text}, 기온 ${realWeatherData.temperature}°C, 풍속 ${realWeatherData.windspeed}m/s — ${advice}`);

  } catch (error) {
    console.error("Open-Meteo fetch error:", error);
    showWeatherError();
  }
}

function updateWeatherPanel(data) {
  const loadingEl = document.getElementById('weather-loading');
  const contentEl = document.getElementById('weather-content');
  if (!loadingEl || !contentEl) return;

  loadingEl.classList.add('hidden');
  contentEl.classList.remove('hidden');

  document.getElementById('w-main-icon').textContent = data.weatherEmoji;
  const labelEl = document.getElementById('w-weather-label');
  if (labelEl) labelEl.textContent = data.weatherText;
  document.getElementById('w-temp').textContent = `${data.temperature}°C`;
  document.getElementById('w-wind').textContent = `${data.windspeed} m/s`;
  document.getElementById('w-location').textContent = data.location;

  // Color the panel based on weather
  const panel = document.getElementById('weather-panel');
  panel.className = 'weather-panel';
  if (data.weatherType === 'rainy') panel.classList.add('weather-panel-rainy');
  else if (data.weatherType === 'cloudy') panel.classList.add('weather-panel-cloudy');
  else panel.classList.add('weather-panel-sunny');

  // Start the live clock
  startClock();

  // Re-init lucide icons
  lucide.createIcons();
}

function showWeatherError() {
  const loadingEl = document.getElementById('weather-loading');
  if (loadingEl) {
    loadingEl.innerHTML = '<span style="color:#EF9A9A;">날씨 정보를 불러오지 못했습니다.</span>';
  }
}


// 12. Initialization & Setup Event Handlers
document.addEventListener("DOMContentLoaded", () => {
  // Lucide initialize
  lucide.createIcons();
  
  // Event: Start Test
  document.getElementById('btn-start-test').addEventListener('click', () => {
    const nameInput = document.getElementById('input-name');
    const name = nameInput.value.trim();
    if (!name) {
      alert("정원사의 이름을 써주세요!");
      return;
    }
    appState.userName = name;
    switchView('test');
    initTest();
  });

  // Event: Adopt & Go to Environment Selection
  document.getElementById('btn-adopt-plant').addEventListener('click', () => {
    switchView('environment');
    
    // Clear the preview SVG to prevent SVG filter ID conflicts (e.g. #shadow)
    const previewBox = document.getElementById('result-plant-preview');
    if (previewBox) previewBox.innerHTML = '';
  });

  // Event: Environment Selection Logic
  document.querySelectorAll('.env-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Remove selected from all
      document.querySelectorAll('.env-card').forEach(c => c.classList.remove('selected'));
      // Add selected to clicked
      const targetCard = e.target.closest('.env-card');
      targetCard.classList.add('selected');
      
      // Save to appState
      appState.environment = targetCard.getAttribute('data-env');
      
      // Enable start button
      document.getElementById('btn-start-dashboard').disabled = false;
    });
  });

  // Event: Start Dashboard with Environment
  document.getElementById('btn-start-dashboard').addEventListener('click', () => {
    switchView('dashboard');
    
    // Load initial systems
    loadQuiz();
    renderBadges();
    renderDiaries();
    
    const envNames = { window: "창가", balcony: "베란다", room: "방 안", outdoor: "야외 정원" };
    addBotMessage(`🌱 안녕, ${appState.userName} 정원사님! 드디어 내가 자랄 [${envNames[appState.environment]}] 흙 속에 자리를 잡았어. 물, 햇빛, 흙, 바람 게이지를 조절하여 내가 튼튼하게 자랄 수 있게 도와줘!`);
  });

  // Reset Application to Initial Screen
  document.getElementById('btn-reset').addEventListener('click', () => {
    if (confirm("처음부터 다시 성향 검사를 하고 식물을 기르시겠습니까?")) {
      stopSimulation();
      appState = {
        userName: "꼬마 정원사",
        currentView: "intro",
        testAnswers: [],
        currentQuestionIndex: 0,
        selectedPlantKey: "",
        environment: "",
        growthXP: 0,
        growthStage: 1,
        fertilizerCount: 1,
        stats: { water: 50, sun: 30, wind: 40, soil: 40 },
        weather: "sunny",
        isSunLampOn: false,
        isWindowOpen: false,
        diaryList: [],
        chatLog: [],
        quizStageIndex: 0,
        quizQIndexInStage: 0,
        completedStages: [],
        badges: [],
        stageCorrectCount: 0,
        isSimulating: false,
        simulationIntervalId: null,
        dailyGrowth: {},
        currentCalendarDate: new Date()
      };
      
      document.getElementById('input-name').value = '';
      document.getElementById('chat-messages-container').innerHTML = `
        <div class="chat-bubble bot">
          <p>안녕! 나를 심어줘서 고마워. 앞으로 너와 함께 자랄 생각을 하니 기뻐! 내 목소리가 들리면 아래 선택지나 하고 싶은 말을 입력해줘!</p>
          <span class="time">방금 전</span>
        </div>
      `;
      document.getElementById('effect-rain').classList.add('hidden-effect');
      document.getElementById('effect-wind').classList.add('hidden-effect');
      document.getElementById('effect-sunlight').classList.add('hidden-effect');
      
      switchView('intro');
    }
  });

  // Dashboard Control Toggles
  document.getElementById('btn-care-water')?.addEventListener('click', giveWater);
  document.getElementById('btn-care-sun')?.addEventListener('click', toggleSunLamp);
  document.getElementById('btn-care-wind')?.addEventListener('click', toggleWindow);
  document.getElementById('btn-care-fertilizer')?.addEventListener('click', useFertilizer);

  // Dev Mode Skip Button
  document.getElementById('btn-dev-skip').addEventListener('click', () => {
    if (appState.growthStage < 6) {
      appState.growthStage++;
      appState.growthXP = 0;
      triggerStageLevelUp();
      updateDashboardUI();
      addBotMessage("⏩ [빠른 성장] 강제로 다음 단계로 건너뛰었습니다!");
    } else {
      alert("이미 마지막 성장 단계(채종)입니다! 씨앗을 수확해 한살이가 완성되었어요 🌾");
    }
  });

  // Tab View Switcher
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Find parent button if icon is clicked
      const targetBtn = e.target.closest('.tab-btn');
      const tabName = targetBtn.getAttribute('data-tab');

      // Clear active states
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      // Add active state
      targetBtn.classList.add('active');
      document.getElementById(`pane-${tabName}`).classList.add('active');
      
      // Auto-focus triggers
      if (tabName === 'chat') {
        document.getElementById('chat-messages-container').scrollTop = document.getElementById('chat-messages-container').scrollHeight;
      } else if (tabName === 'calendar') {
        renderCalendar();
      }
    });
  });

  // Send message events
  document.getElementById('btn-send-message').addEventListener('click', () => {
    const input = document.getElementById('chat-input-field');
    const msg = input.value.trim();
    if (msg) {
      processUserChat(msg);
      input.value = '';
    }
  });

  document.getElementById('chat-input-field').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const msg = e.target.value.trim();
      if (msg) {
        processUserChat(msg);
        e.target.value = '';
      }
    }
  });

  // Chat Prompt Chip Click Actions — 돌보기 버튼은 즉각 액션 실행
  document.getElementById('chat-prompt-chips').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip-btn');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === '물 주기')      giveWater();
    else if (action === '햇빛 쬐기') toggleSunLamp();
    else if (action === '환기 하기') toggleWindow();
    else if (action === '비료 주기') useFertilizer();
    else processUserChat(action);
  });

  // Diary mood buttons action
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // 선택한 감정 색상을 mood-selector 테두리에 반영
      const color = btn.getAttribute('data-color');
      if (color) {
        document.querySelector('.mood-selector').style.setProperty('--selected-color', color);
      }
    });
  });

  // Reset diaryList in appState on new plant start
  document.getElementById('btn-save-diary').addEventListener('click', saveDiary);

  // Diary Photo Upload logic
  const fileUploadEl = document.getElementById('diary-photo-upload');
  if (fileUploadEl) {
    fileUploadEl.addEventListener('change', (e) => {
      const files = e.target.files;
      const container = document.getElementById('photo-preview-container');
      container.innerHTML = '';
      uploadedPhotosBase64 = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          uploadedPhotosBase64.push(ev.target.result);
          const img = document.createElement('img');
          img.src = ev.target.result;
          img.style.width = '60px';
          img.style.height = '60px';
          img.style.objectFit = 'cover';
          img.style.borderRadius = '8px';
          container.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Diary Autocomplete (Ghost text) logic
  const diaryInput = document.getElementById('diary-text');
  const ghostText = document.getElementById('diary-ghost-text');
  if (diaryInput && ghostText) {
    let typingTimer;
    let currentSuggestion = "";

    function escapeHtmlSimple(unsafe) {
      if (!unsafe) return "";
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    diaryInput.addEventListener('input', () => {
      clearTimeout(typingTimer);
      ghostText.innerHTML = '<span style="color: transparent;">' + escapeHtmlSimple(diaryInput.value) + '</span>';
      currentSuggestion = "";
      
      if (diaryInput.value.trim().length > 0) {
        typingTimer = setTimeout(async () => {
          try {
            const prompt = `당신은 초등학생의 일기 쓰기를 도와주는 AI입니다. 학생이 쓴 다음 문장의 뒷부분(3~5단어 정도)을 자연스럽게 이어지도록 예상해서 완성해주세요. 반드시 이어질 단어만 출력하고 다른 설명은 하지 마세요.
현재까지 쓴 내용: "${diaryInput.value}"`;
            
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
            
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 50 }
              })
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.candidates && data.candidates.length > 0) {
                let suggestion = data.candidates[0].content.parts[0].text.trim();
                currentSuggestion = " " + suggestion;
                if (diaryInput.value.trim().length > 0) {
                  ghostText.innerHTML = '<span style="color: transparent;">' + escapeHtmlSimple(diaryInput.value) + '</span><span style="color: rgba(150,150,150,0.7);">' + escapeHtmlSimple(currentSuggestion) + '</span>';
                }
              }
            }
          } catch (e) {
            console.error("Autocomplete error", e);
          }
        }, 1000);
      }
    });

    diaryInput.addEventListener('keydown', (e) => {
      if ((e.key === 'Tab' || e.key === 'ArrowRight') && currentSuggestion) {
        e.preventDefault();
        diaryInput.value += currentSuggestion;
        ghostText.innerHTML = '<span style="color: transparent;">' + escapeHtmlSimple(diaryInput.value) + '</span>';
        currentSuggestion = "";
      }
    });
  }

  // Trigger weather effects on startup
  triggerWeatherEffect();
});

// 10. Daily Growth Tracking & Emotion Calendar
function addDailyGrowth(xp) {
  if (typeof xp !== "number" || xp <= 0) return;
  const todayStr = new Date().toISOString().split("T")[0];
  if (!appState.dailyGrowth[todayStr]) {
    appState.dailyGrowth[todayStr] = 0;
  }
  appState.dailyGrowth[todayStr] += xp;
  
  if (document.getElementById("pane-calendar") && document.getElementById("pane-calendar").classList.contains("active")) {
    renderCalendar();
  }
}

function renderCalendar() {
  const grid = document.getElementById("calendar-grid");
  const monthYearLabel = document.getElementById("calendar-month-year");
  if (!grid || !monthYearLabel) return;
  
  grid.innerHTML = "";
  
  const d = appState.currentCalendarDate;
  const year = d.getFullYear();
  const month = d.getMonth();
  
  monthYearLabel.innerText = `${year}년 ${month + 1}월`;
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Empty slots before 1st day
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "calendar-day empty";
    grid.appendChild(emptyDiv);
  }
  
  const today = new Date();
  const isCurrentMonth = (year === today.getFullYear() && month === today.getMonth());
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    
    // Find last diary entry for this day
    const diariesForDay = appState.diaryList.filter(entry => entry.date === dateStr);
    const lastDiary = diariesForDay[diariesForDay.length - 1];
    
    const xpGained = appState.dailyGrowth[dateStr] || 0;
    
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    if (isCurrentMonth && day === today.getDate()) {
      dayDiv.classList.add("today");
    }
    
    let innerHTML = `<div class="cal-date">${day}</div>`;
    
    if (lastDiary) {
      const emojiOnly = lastDiary.mood.split(" ")[0]; // Get the emoji
      innerHTML += `<div class="cal-emoji" title="${lastDiary.mood}">${emojiOnly}</div>`;
    }
    
    if (xpGained > 0) {
      innerHTML += `<div class="cal-xp">+${Math.round(xpGained)}XP</div>`;
    }
    
    dayDiv.innerHTML = innerHTML;
    grid.appendChild(dayDiv);
  }
}

// Bind Calendar Events
document.addEventListener("DOMContentLoaded", () => {
  const btnPrev = document.getElementById("btn-cal-prev");
  const btnNext = document.getElementById("btn-cal-next");
  
  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      appState.currentCalendarDate.setMonth(appState.currentCalendarDate.getMonth() - 1);
      renderCalendar();
    });
  }
  
  if (btnNext) {
    btnNext.addEventListener("click", () => {
      appState.currentCalendarDate.setMonth(appState.currentCalendarDate.getMonth() + 1);
      renderCalendar();
    });
  }
});

