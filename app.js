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
const GEMINI_API_KEY = 'AQ.Ab8RN6ITD2Y--lzr5Y9G0G2D3vuQzwduRWqmsnY_YGIg11nmKw';

// 1. Data Definitions

// Personality Test Questions
const testQuestions = [
  {
    title: "여가 시간을 보낼 때 가장 좋아하는 방식은?",
    options: [
      { text: "밖에 나가서 땀 흘리며 활발하게 뛰어놀거나 운동하기", scores: { tomato: 4, cucumber: 1, potato: 0, cabbage: 0, apple: 0 } },
      { text: "조용하고 예쁜 카페나 자연 속에서 감상하고 힐링하기", scores: { apple: 4, cabbage: 2, tomato: 0, cucumber: 0, potato: 0 } },
      { text: "내 방 침대나 소파에서 가장 편안하게 뒹굴뒹굴하기", scores: { potato: 4, cabbage: 1, tomato: 0, cucumber: 0, apple: 0 } }
    ]
  },
  {
    title: "방학 숙제나 계획표를 세울 때 나는?",
    options: [
      { text: "매일 정해진 분량을 규칙적으로 꼬박꼬박 해낸다", scores: { cucumber: 4, tomato: 1, potato: 0, cabbage: 0, apple: 0 } },
      { text: "계획은 세우지만 기분과 상황에 따라 유동적으로 한다", scores: { potato: 3, apple: 2, tomato: 0, cucumber: 0, cabbage: 0 } },
      { text: "친구들이나 가족과 함께 즐겁게 할 수 있는 일부터 찾는다", scores: { tomato: 2, cabbage: 3, potato: 0, cucumber: 0, apple: 0 } }
    ]
  },
  {
    title: "친구가 우울해할 때 나의 대처법은?",
    options: [
      { text: "신나는 곳에 데려가서 우울한 기분을 확 풀어준다", scores: { tomato: 3, cucumber: 1, potato: 0, cabbage: 0, apple: 0 } },
      { text: "조용히 옆에서 이야기를 끝까지 들어주고 공감해준다", scores: { cabbage: 4, apple: 1, potato: 0, cucumber: 0, tomato: 0 } },
      { text: "어떻게 해결하면 좋을지 현실적이고 체계적인 조언을 해준다", scores: { cucumber: 4, tomato: 0, potato: 0, cabbage: 0, apple: 0 } }
    ]
  },
  {
    title: "무언가를 기르거나 만들 때 가장 기대되는 순간은?",
    options: [
      { text: "눈에 띄는 확실한 결과물이나 맛있는 열매를 얻을 때", scores: { tomato: 4, cucumber: 2, potato: 0, cabbage: 0, apple: 0 } },
      { text: "매일 조금씩 듬직하게 성장해가는 과정을 지켜볼 때", scores: { cabbage: 4, cucumber: 1, potato: 0, tomato: 0, apple: 0 } },
      { text: "예쁜 꽃이 피거나 감성적이고 아름다운 변화를 볼 때", scores: { apple: 4, cabbage: 1, potato: 0, cucumber: 0, tomato: 0 } }
    ]
  },
  {
    title: "새로운 취미를 시작한다면 어떤 스타일이 좋은가요?",
    options: [
      { text: "에너지를 마음껏 발산하며 열정적으로 할 수 있는 취미", scores: { tomato: 4, cucumber: 0, potato: 0, cabbage: 0, apple: 0 } },
      { text: "꾸준한 인내심과 섬세함이 필요한 정밀한 작업이나 공부", scores: { cucumber: 4, apple: 2, potato: 0, tomato: 0, cabbage: 0 } },
      { text: "복잡하지 않고 마음이 편안해지며 느긋하게 즐기는 취미", scores: { potato: 4, cabbage: 2, tomato: 0, cucumber: 0, apple: 0 } }
    ]
  },
  {
    title: "내 책상이나 방을 정리하는 습관은?",
    options: [
      { text: "물건들이 항상 있어야 할 자리에 딱 맞춰 정돈되어 있다", scores: { cucumber: 4, apple: 0, tomato: 0, potato: 0, cabbage: 0 } },
      { text: "나만의 미적 감각으로 예쁜 소품이나 그림과 함께 장식한다", scores: { apple: 4, cabbage: 1, tomato: 0, potato: 0, cucumber: 0 } },
      { text: "조금 어질러져 있어도 내가 물건을 찾을 수 있으면 괜찮다", scores: { potato: 4, tomato: 1, cabbage: 0, cucumber: 0, apple: 0 } }
    ]
  },
  {
    title: "가장 좋아하는 계절의 분위기는?",
    options: [
      { text: "뜨거운 태양 아래에서 신나고 열정적으로 놀 수 있는 여름", scores: { tomato: 4, cucumber: 1, potato: 0, cabbage: 0, apple: 0 } },
      { text: "선선한 바람이 불고 마음이 차분해지며 여유로운 가을", scores: { cabbage: 4, apple: 2, potato: 0, tomato: 0, cucumber: 0 } },
      { text: "따뜻한 이불 속에서 귤을 까먹는 포근하고 느긋한 겨울", scores: { potato: 4, cabbage: 1, tomato: 0, cucumber: 0, apple: 0 } }
    ]
  }
];

// Plant Profile Catalog
const plantProfiles = {
  tomato: {
    name: "방울토마토",
    slogan: "열정 가득! 쑥쑥 자라나 빨간 결실을 맺는 활력 메이트",
    desc: "방울토마토는 햇빛을 좋아하고 쑥쑥 자라서 매일 돌보는 즐거움이 큰 식물이에요. 힘이 넘치고 무엇이든 열심히 하는 정원사님과 잘 어울려요. 빨간 열매가 열리면 정말 뿌듯할 거예요!",
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
    desc: "감자는 흙 속에서 조용히 영양을 모으며 자라는 든든한 식물이에요. 겉으로 드러내지 않아도 자기 할 일을 차분히 해내는 정원사님과 닮았어요. 물을 자주 주지 않아도 잘 자라서 처음 키우기에 딱 좋아요!",
    themeColor: "#8D6E63",
    careInfo: {
      water: { min: 30, max: 60, desc: "물이 너무 많으면 감자가 썩어요" },
      sun: { min: 45, max: 75, desc: "부드러운 간접 햇빛이 좋아요" },
      wind: { min: 35, max: 70, desc: "답답하지 않은 환기가 필요해요" },
      soil: { min: 35, max: 75, desc: "보슬보슬한 가벼운 흙을 좋아해요" }
    }
  },
  cabbage: {
    name: "배추",
    slogan: "풍성한 잎사귀로 포근하게 감싸 안아주는 김장 대장 메이트",
    desc: "배추는 시원한 바람 속에서 넓은 잎을 동그랗게 모으며 자라는 채소예요. 친구들을 따뜻하게 챙겨 주는 마음 넓은 정원사님과 닮았어요. 푸른 잎이 자라는 모습을 보면 마음이 편안해질 거예요!",
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
    desc: "오이는 줄기를 위로 쭉쭉 뻗으며 빠르게 자라고 아삭한 열매를 맺는 채소예요. 물을 아주 좋아해서, 날마다 꾸준히 돌봐 주는 성실한 정원사님과 잘 맞아요. 매일 자라는 모습을 보는 재미가 쏠쏠해요!",
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
    desc: "사과나무는 예쁜 꽃을 피우고, 오랜 시간 정성을 들여야 달콤한 사과가 열리는 나무예요. 천천히 기다리며 정을 쌓는 걸 좋아하는 정원사님과 닮았어요. 느리지만 멋진 변화를 보여 줄 거예요!",
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


// 식물 퀴즈 문제 풀 (초등학생 수준, 랜덤 출제)
const quizPool = [
  // 뿌리
  { question: "뿌리가 하는 일이 아닌 것은 무엇일까요?", options: ["물을 흡수해요", "식물을 땅에 고정해요", "광합성을 해요", "영양분을 저장해요"], answer: 2, explanation: "광합성은 잎이 하는 일이에요! 뿌리는 물과 영양분을 흡수하고, 식물이 쓰러지지 않게 땅에 붙잡아 주는 역할을 해요." },
  { question: "뿌리는 어디서 물을 흡수할까요?", options: ["하늘에서", "흙 속에서", "잎에서", "꽃에서"], answer: 1, explanation: "뿌리는 흙 속에 뻗어 있어서 흙에 있는 물과 영양분을 빨아들여요. 그래서 화분에 물을 주면 뿌리가 흡수하는 거예요!" },
  { question: "감자의 먹는 부분은 식물의 어떤 기관일까요?", options: ["잎", "꽃", "뿌리(덩이줄기)", "씨앗"], answer: 2, explanation: "우리가 먹는 감자는 땅속에서 자라는 줄기(덩이줄기)예요. 영양분이 가득 저장된 덩어리랍니다!" },
  // 줄기
  { question: "줄기가 하는 일은 무엇일까요?", options: ["씨앗을 만들어요", "물과 영양분을 위아래로 옮겨줘요", "햇빛을 흡수해요", "뿌리에서 광합성을 해요"], answer: 1, explanation: "줄기는 물과 영양분이 다니는 길이에요! 뿌리에서 흡수한 물을 잎까지 올려 보내고, 잎에서 만든 양분을 뿌리까지 내려 보내는 통로 역할을 해요." },
  { question: "오이는 줄기로 무엇을 하면서 높이 올라갈까요?", options: ["날아서", "덩굴손으로 감으면서", "뿌리로 붙어서", "꽃으로 잡아서"], answer: 1, explanation: "오이는 덩굴손이라는 가는 실 같은 기관으로 다른 것을 감으면서 위로 올라가요. 그래서 지지대를 세워주면 높이 잘 자란답니다!" },
  { question: "식물의 줄기 색이 보통 초록색인 이유는 무엇일까요?", options: ["흙이 초록색이라서", "줄기에도 엽록소가 있어서", "물이 초록색이라서", "햇빛이 초록색이라서"], answer: 1, explanation: "줄기에도 엽록소가 들어있어서 초록색으로 보여요. 잎뿐 아니라 어린 줄기도 광합성을 조금씩 할 수 있답니다!" },
  // 잎
  { question: "잎이 하는 가장 중요한 일은 무엇일까요?", options: ["물을 저장해요", "햇빛을 받아 양분을 만들어요(광합성)", "씨앗을 보호해요", "뿌리를 감싸요"], answer: 1, explanation: "잎은 햇빛·물·이산화탄소를 이용해 식물의 먹이(양분)를 직접 만들어요. 이걸 '광합성'이라고 해요!" },
  { question: "잎이 초록색인 이유는 무엇일까요?", options: ["물이 많아서", "엽록소라는 초록 색소가 있어서", "흙색이 비쳐서", "바람 때문에"], answer: 1, explanation: "잎 안에 엽록소라는 초록색 물질이 있어서 초록으로 보여요. 이 엽록소가 햇빛을 받아 광합성을 해요!" },
  { question: "잎에는 아주 작은 구멍이 있어요. 이 구멍의 이름은 무엇일까요?", options: ["기공", "씨방", "수술", "화분"], answer: 0, explanation: "잎에는 기공이라는 아주 작은 구멍이 있어요. 이 구멍으로 이산화탄소가 들어오고, 산소와 수증기가 나가요!" },
  // 꽃
  { question: "꽃의 역할은 무엇일까요?", options: ["물을 저장해요", "씨앗을 만들기 위해 꽃가루받이를 해요", "광합성을 해요", "뿌리에서 물을 끌어올려요"], answer: 1, explanation: "꽃은 씨앗을 만들기 위한 기관이에요. 꽃가루가 암술에 닿으면(꽃가루받이) 씨앗이 만들어지고, 꽃은 열매가 된답니다!" },
  { question: "꿀벌이 꽃에서 꿀을 먹을 때 식물에게 도움이 되는 이유는 무엇일까요?", options: ["꿀벌이 물을 줘서", "꿀벌이 꽃가루를 다른 꽃에 옮겨줘서", "꿀벌이 잎을 청소해줘서", "꿀벌이 뿌리를 돌봐줘서"], answer: 1, explanation: "꿀벌이 꽃에서 꽃으로 날아다니면서 몸에 묻은 꽃가루를 옮겨줘요. 이 덕분에 꽃가루받이가 이루어져 씨앗과 열매가 만들어진답니다!" },
  { question: "방울토마토 꽃의 색깔은 무엇일까요?", options: ["빨간색", "파란색", "노란색", "보라색"], answer: 2, explanation: "방울토마토 꽃은 작고 귀여운 노란 별 모양이에요! 노란 꽃이 지고 나면 초록 열매가 열리고, 그게 빨갛게 익는 거예요." },
  // 씨앗·한살이
  { question: "씨앗이 싹을 틔우기 위해 꼭 필요한 것이 아닌 것은?", options: ["물", "따뜻한 온도", "공기", "비료"], answer: 3, explanation: "씨앗이 싹트려면 물, 온도, 공기(산소)가 필요해요. 비료는 싹이 튼 뒤에 도움이 되지만, 발아에는 꼭 필요하지 않아요!" },
  { question: "식물의 한살이 순서를 바르게 나열한 것은?", options: ["꽃→씨앗→새싹→열매", "씨앗→새싹→꽃→열매→씨앗", "새싹→씨앗→열매→꽃", "열매→꽃→씨앗→새싹"], answer: 1, explanation: "씨앗이 땅에 떨어져 싹이 트고, 잎과 줄기가 자라고, 꽃이 피고, 열매가 맺히고, 그 안에 새 씨앗이 만들어져요. 이게 한살이예요!" },
  { question: "열매 안에는 무엇이 들어있을까요?", options: ["뿌리", "씨앗", "꽃가루", "엽록소"], answer: 1, explanation: "열매 안에는 씨앗이 들어있어요! 우리가 먹는 토마토·오이·사과도 모두 열매이고, 안에 씨앗이 있답니다." },
  // 물·햇빛·환기
  { question: "식물에 물을 너무 많이 주면 어떻게 될까요?", options: ["더 빠르게 자라요", "뿌리가 썩을 수 있어요", "꽃이 더 많이 펴요", "잎이 더 초록해져요"], answer: 1, explanation: "물이 너무 많으면 흙 속에 공기가 없어져서 뿌리가 숨을 못 쉬고 썩어버려요. 흙이 보슬보슬 마를 때 물을 주는 게 좋아요!" },
  { question: "식물에게 햇빛이 필요한 가장 큰 이유는 무엇일까요?", options: ["몸을 따뜻하게 하려고", "광합성으로 양분을 만들려고", "물을 흡수하려고", "씨앗을 퍼뜨리려고"], answer: 1, explanation: "식물은 햇빛이 있어야 잎에서 광합성을 할 수 있어요. 햇빛이 없으면 양분을 만들지 못해서 점점 시들어버린답니다!" },
  { question: "식물을 키울 때 환기(바람)가 필요한 이유는 무엇일까요?", options: ["식물이 춥게 해주려고", "신선한 공기를 공급하고 병을 예방하려고", "흙을 말리려고", "꽃을 예쁘게 하려고"], answer: 1, explanation: "환기를 하면 신선한 공기(이산화탄소)가 공급되고, 습기가 줄어들어 곰팡이나 병이 생기는 걸 막아줘요. 바람이 살짝 불어야 줄기도 튼튼해진답니다!" },
  { question: "식물을 가장 잘 자라게 하려면 어디에 두는 게 좋을까요?", options: ["어둡고 습한 창고", "햇빛이 잘 들고 바람이 통하는 곳", "에어컨 바람이 세게 나오는 곳", "물 속"], answer: 1, explanation: "식물은 햇빛·공기·적당한 온도가 필요해요. 햇빛이 잘 들고 환기가 잘 되는 창가나 베란다가 식물이 자라기 딱 좋은 환경이에요!" },
  // 광합성
  { question: "광합성을 할 때 식물이 내놓는 기체는 무엇일까요?", options: ["이산화탄소", "산소", "수소", "질소"], answer: 1, explanation: "식물은 광합성을 하면서 산소를 만들어 공기 중으로 내보내요. 우리가 숨 쉬는 산소의 많은 부분이 식물 덕분이에요!" },
  { question: "광합성에 필요하지 않은 것은?", options: ["햇빛", "물", "이산화탄소", "비료"], answer: 3, explanation: "광합성은 햇빛 + 물 + 이산화탄소로 이루어져요. 비료는 식물의 영양 보충에 도움을 주지만, 광합성 자체에는 필요하지 않아요!" },
  // 흙·비료
  { question: "식물에게 비료를 주는 이유는 무엇일까요?", options: ["물 대신 주려고", "식물에게 필요한 영양분을 보충해주려고", "흙을 단단하게 만들려고", "해충을 쫓으려고"], answer: 1, explanation: "비료에는 식물이 잘 자라는 데 필요한 영양분(질소·인·칼륨 등)이 들어있어요. 흙 속 영양분이 부족해지면 비료를 주어 보충해야 해요!" },
  { question: "좋은 흙의 조건이 아닌 것은?", options: ["물을 잘 담아둘 수 있어요", "공기가 통해요", "딱딱하고 돌덩어리만 있어요", "미생물이 살고 있어요"], answer: 2, explanation: "좋은 흙은 물을 적당히 머금고, 공기가 잘 통하고, 미생물이 살면서 영양분을 만들어줘요. 딱딱한 흙은 뿌리가 뻗기 어려워요!" },
  // 식물 기관 종합
  { question: "식물의 4가지 기관을 모두 고른 것은?", options: ["뿌리·줄기·잎·꽃(열매)", "뿌리·물·햇빛·흙", "씨앗·비료·물·공기", "잎·구름·바람·흙"], answer: 0, explanation: "식물은 뿌리·줄기·잎·꽃(열매)으로 이루어져 있어요. 각 기관이 서로 다른 중요한 역할을 해서 식물이 살아갈 수 있어요!" },
  { question: "식물에서 양분을 만드는 기관은 어디일까요?", options: ["뿌리", "줄기", "잎", "씨앗"], answer: 2, explanation: "잎에 있는 엽록소가 햇빛을 받아 광합성으로 양분을 만들어요. 잎이 넓고 초록색인 이유도 햇빛을 많이 받기 위해서랍니다!" },
  { question: "사과나무는 열매를 맺기까지 몇 년 이상 걸릴까요?", options: ["1주일", "1달", "3~5년", "10분"], answer: 2, explanation: "사과나무는 씨앗에서 열매를 맺기까지 보통 3~5년이 걸려요. 식물에 따라 자라는 속도가 모두 달라요!" },
  { question: "배추를 맛있게 기르려면 어느 계절이 좋을까요?", options: ["한여름", "봄·가을 서늘한 때", "한겨울", "계절은 상관없어요"], answer: 1, explanation: "배추는 너무 덥거나 춥지 않은 봄이나 가을에 잘 자라요. 우리가 먹는 김장 배추도 주로 가을에 수확한답니다!" },
  { question: "씨앗이 물을 만나면 어떻게 될까요?", options: ["녹아버려요", "씨앗이 불어나다가 싹을 틔워요", "딱딱하게 굳어요", "꽃이 바로 피어요"], answer: 1, explanation: "씨앗은 물을 흡수하면 내부가 활동을 시작해서 점점 부풀다가 싹을 틔워요. 이걸 '발아'라고 해요!" },
  { question: "식물에 물이 부족하면 어떻게 될까요?", options: ["꽃이 더 예쁘게 피어요", "잎이 시들고 축 처져요", "뿌리가 더 길어져요", "씨앗이 더 많이 생겨요"], answer: 1, explanation: "물이 부족하면 세포가 탱탱함을 잃어서 잎이 축 처지고 시들어요. 빨리 물을 주면 다시 살아나지만, 너무 오래 방치하면 식물이 죽을 수도 있어요!" },
  { question: "뿌리가 없어서 공중에 떠 있다면 식물이 살 수 있을까요?", options: ["네, 잘 살아요", "아니요, 물과 영양분을 흡수할 수 없어요", "네, 잎으로만 살 수 있어요", "아니요, 줄기가 없어서요"], answer: 1, explanation: "뿌리가 없으면 흙에서 물과 영양분을 흡수할 수 없고, 식물이 쓰러지기도 해요. 뿌리는 식물 생명의 기반이에요!" },
  { question: "오이의 어떤 부분을 먹을까요?", options: ["뿌리", "씨앗만", "열매", "잎만"], answer: 2, explanation: "우리가 먹는 오이는 식물의 열매예요! 꽃이 지고 나서 만들어지는 열매 안에는 작은 씨앗들이 가득 들어있어요." },
];
// Plant Part Educational Info (per species)
const PLANT_PART_INFO = {
  tomato: {
    root:   { icon: '🌱', name: '방울토마토 뿌리', struct: '주뿌리에서 가느다란 곁뿌리와 뿌리털이 사방으로 뻗어요.', func: '흙 속의 물과 무기 양분을 빨아들여 줄기로 보내요. 식물이 쓰러지지 않게 흙에 고정해 줘요.' },
    stem:   { icon: '🌿', name: '토마토 줄기', struct: '속이 꽉 찬 둥근 줄기예요. 표면에 짧은 털이 빽빽이 나 있고 독특한 향이 나요.', func: '뿌리에서 올라온 물과 영양분을 잎·열매에 전달해요. 겨드랑이에서 곁순이 자라 영양분을 빼앗으므로 제때 따줘야 해요.' },
    leaf:   { icon: '🍃', name: '토마토 잎 (겹깃꼴겹잎)', struct: '작은 잎 여러 장이 깃털처럼 모인 복엽이에요. 가장자리는 톱니 모양이에요.', func: '햇빛·물·이산화탄소로 광합성을 해 양분을 만들어요. 기공을 통해 증산 작용도 해요.' },
    flower: { icon: '🌼', name: '토마토 꽃 (노란 별 모양)', struct: '작은 별 모양의 노란 꽃이에요. 꽃잎 5장, 수술과 암술이 꽃 안에 함께 있어요.', func: '꽃가루받이(수분) 후 씨방이 자라 열매가 돼요. 자기 꽃가루로 수분하는 자가수분 식물이에요.' },
    fruit:  { icon: '🍅', name: '방울토마토 열매', struct: '둥글고 빨간 열매예요. 처음엔 초록색이다가 익으면 빨갛게 변해요. 씨가 여러 개 들어있어요.', func: '씨앗을 보호해요. 동물이 먹으면 씨앗을 다른 곳에 퍼뜨려줘요. 리코펜·비타민 C가 풍부해요.' },
    soil:   { icon: '🌍', name: '흙 (토양)', struct: '미세한 모래·점토·유기물·물·공기·미생물이 뒤섞여 있어요.', func: '뿌리를 지탱하고 물과 영양분(질소·인·칼륨)을 저장해요. 미생물이 죽은 생물을 분해해 식물의 비료로 만들어줘요.' }
  },
  potato: {
    root:   { icon: '🌱', name: '감자 뿌리', struct: '덩이줄기(감자)에서 가느다란 뿌리가 사방으로 뻗어요.', func: '흙 속의 물과 무기 양분을 흡수해 줄기와 잎에 공급해요.' },
    stem:   { icon: '🥔', name: '감자 덩이줄기 (줄기식물!)', struct: '땅속에서 굵어진 줄기예요! 겉에 오목한 눈(芽)이 여러 개 있어요. 뿌리가 아니라 줄기가 변형된 것이에요.', func: '광합성으로 만든 녹말을 저장해요. 눈에서 새 싹이 돋아 새 식물이 될 수 있어요. 씨감자로 번식에 사용해요.' },
    leaf:   { icon: '🍃', name: '감자 잎 (겹깃꼴겹잎)', struct: '작은 잎 여러 쌍이 좌우로 달린 복엽이에요. 부드럽고 진한 초록색이에요.', func: '광합성을 통해 양분을 만들어요. 만든 양분은 줄기를 타고 내려가 땅속 감자에 저장돼요.' },
    flower: { icon: '🌸', name: '감자 꽃 (흰색/연보라)', struct: '별 모양의 작은 꽃이 모여 피어요. 흰색이나 연보라색이에요.', func: '꽃가루받이 후 작은 초록 열매를 맺어요. 하지만 감자는 주로 씨감자(덩이줄기)로 번식해요.' },
    fruit:  { icon: '🥔', name: '감자 덩이줄기 (먹는 부분)', struct: "\'눈(芽)\'이라는 오목한 부분이 여러 개 있어요. 속은 노란빛이나 흰빛이에요.", func: '겨울이나 건조한 계절에 살아남기 위해 에너지(녹말)를 저장해요. 사람의 중요한 식량이에요.' },
    soil:   { icon: '🌍', name: '흙 (토양)', struct: '미세한 모래·점토·유기물·물·공기·미생물이 뒤섞여 있어요.', func: '감자는 과습에 약해요. 배수가 잘 되는 보슬보슬한 흙이 필요해요. 영양분이 풍부한 흙에서 잘 자라요.' }
  },
  cabbage: {
    root:   { icon: '🌱', name: '배추 뿌리', struct: '굵은 주뿌리에서 많은 곁뿌리가 뻗어요. 비교적 얕게 퍼지는 천근성 뿌리예요.', func: '물과 무기 양분(질소·인·칼륨 등)을 흡수해요. 식물을 흙에 고정시켜요.' },
    stem:   { icon: '🌿', name: '배추 줄기 (밑동)', struct: '짧고 굵은 줄기에 잎이 빽빽하게 달려 있어요. 밑동이 단단하게 결구를 이뤄요.', func: '물과 양분의 이동 통로예요. 잎이 단단하게 붙어 있도록 지지대 역할을 해요.' },
    leaf:   { icon: '🥬', name: '배추 잎 (결구엽)', struct: '넓고 부드러운 잎이 속을 향해 겹겹이 말려 있어요. 바깥잎은 짙은 초록, 속잎은 연한 노란색이에요.', func: '광합성을 해 양분을 만들어요. 겹겹이 쌓여 수분을 저장하고 속을 보호해요. 비타민·무기질이 풍부해요.' },
    flower: { icon: '🌼', name: '배추 꽃 (추대)', struct: '봄이 되면 가운데서 꽃대가 올라와 노란 십자 모양의 작은 꽃이 피어요.', func: '꽃가루받이 후 씨앗이 만들어져요. 꽃대가 올라오면(추대) 잎이 질겨지고 단맛이 줄어들어요.' },
    fruit:  { icon: '🥬', name: '배추 결구 (우리가 먹는 부분)', struct: '잎이 안으로 말려 단단하고 촘촘한 구 모양을 만들어요. 속은 연한 노란색이에요.', func: '우리가 먹는 부분이에요! 김치의 주재료로 각종 비타민과 섬유질이 풍부해요.' },
    soil:   { icon: '🌍', name: '흙 (토양)', struct: '미세한 모래·점토·유기물·물·공기·미생물이 뒤섞여 있어요.', func: '배추는 물을 많이 필요로 해 수분 보유력이 좋은 흙을 좋아해요. 영양분이 풍부한 흙에서 잘 자라요.' }
  },
  cucumber: {
    root:   { icon: '🌱', name: '오이 뿌리', struct: '얕고 넓게 퍼지는 천근성 뿌리예요. 뿌리가 상처를 잘 입으므로 조심해야 해요.', func: '많은 수분을 흡수해요(오이 열매의 95%가 수분!). 뿌리가 얕아서 화분에서도 잘 자라요.' },
    stem:   { icon: '🌿', name: '오이 줄기 (덩굴줄기)', struct: '가늘고 긴 덩굴 줄기예요. 마디마다 잎과 덩굴손이 달리고 거친 털이 있어요.', func: '덩굴손으로 지지대를 감아 위로 올라가요. 물과 양분의 이동 통로예요. 덩굴로 자라야 열매가 잘 열려요.' },
    leaf:   { icon: '🍃', name: '오이 잎 (손바닥 모양)', struct: '오각형 손바닥 모양 잎이에요. 표면에 거친 털이 있고 가장자리가 톱니 모양이에요.', func: '광합성을 해요. 표면의 털이 해충과 강한 햇빛을 막아줘요. 마디에서 덩굴손이 나와 지지대를 감아요.' },
    flower: { icon: '🌼', name: '오이 꽃 (노란색)', struct: '수꽃과 암꽃이 같은 식물에 따로 피어요. 암꽃 아래에 작은 오이 모양이 보여요.', func: '꿀벌이 꽃가루를 옮겨 수분이 이루어져야 열매가 커져요. 수꽃과 암꽃이 분리된 단성화 식물이에요.' },
    fruit:  { icon: '🥒', name: '오이 열매', struct: '길고 초록색인 열매예요. 표면에 작은 혹과 가시가 있고 속에 씨가 줄지어 있어요.', func: '씨앗을 보호해요. 95%가 수분이라 시원하고 아삭한 식감을 줘요. 수분 보충과 피부 미용에 좋아요.' },
    soil:   { icon: '🌍', name: '흙 (토양)', struct: '미세한 모래·점토·유기물·물·공기·미생물이 뒤섞여 있어요.', func: '오이는 수분을 매우 좋아해 촉촉한 흙이 필요해요. 뿌리가 얕아서 가볍고 통기성 좋은 흙을 선호해요.' }
  },
  apple: {
    root:   { icon: '🌱', name: '사과나무 뿌리', struct: '굵고 깊은 주뿌리와 넓게 퍼지는 곁뿌리로 구성돼요. 뿌리 끝 뿌리털이 흡수를 담당해요.', func: '깊은 땅속에서 물과 무기 양분을 끌어올려요. 나무가 쓰러지지 않도록 지탱해요. 겨울 동안 양분을 저장해요.' },
    stem:   { icon: '🌲', name: '사과나무 줄기 (목질줄기)', struct: '나무처럼 딱딱한 목질부 줄기예요. 껍질(수피) 아래에 물관과 체관이 있어요.', func: '물관으로 물·무기 양분을 위로 보내요. 체관으로 잎에서 만든 양분을 열매·뿌리에 전달해요. 해마다 나이테가 생겨요.' },
    leaf:   { icon: '🍃', name: '사과 잎 (긴 타원형)', struct: '끝이 뾰족한 타원형 잎이에요. 가장자리에 작은 톱니가 있고 앞면은 광택이 나요.', func: '광합성으로 당분을 만들어요. 가을이 되면 엽록소가 분해되어 빨간색·노란색 단풍이 들어요.' },
    flower: { icon: '🌸', name: '사과꽃 (분홍빛 흰색)', struct: '분홍빛이 도는 흰 꽃이에요. 꽃잎 5장, 수술 여러 개, 암술 1개로 구성돼요.', func: '꿀벌이 다른 품종의 사과나무에 꽃가루를 옮겨 줘야 열매가 잘 맺혀요. 이를 타가수분이라고 해요.' },
    fruit:  { icon: '🍎', name: '사과 열매', struct: '빨갛고 동그란 열매예요. 우리가 먹는 과육은 꽃받침이 발달한 부분이에요. 가운데에 씨앗 5개가 있어요.', func: '씨앗을 보호하고 퍼뜨려요. 사과산과 비타민 C가 풍부해요. 열매가 빨갛게 익으려면 130~150일이 걸려요.' },
    soil:   { icon: '🌍', name: '흙 (토양)', struct: '미세한 모래·점토·유기물·물·공기·미생물이 뒤섞여 있어요.', func: '사과나무는 깊고 배수가 잘 되는 흙을 좋아해요. 뿌리가 깊어 화분보다 넓은 땅이 필요해요.' }
  }
};

// Plant Growth Timeline (6 stages × 5 plants)
const PLANT_GROWTH_TIMELINE = {
  tomato: [
    { stage:1, emoji:'🌱', title:'씨앗·발아', weeks:'1~2주', parts:[{name:'씨앗',icon:'🟤',desc:'껍질(종피) 안에 어린 식물체(배아)와 영양분(배유)이 들어있어요.'},{name:'뿌리(유근)',icon:'🌱',desc:'씨앗에서 가장 먼저 나오는 부분이에요. 물을 흡수하기 시작해요.'}], tip:'20~25℃ 따뜻한 곳, 촉촉한 흙 → 5~7일 안에 싹이 터요.' },
    { stage:2, emoji:'🌿', title:'새싹·유묘', weeks:'3~4주', parts:[{name:'떡잎(자엽)',icon:'🍃',desc:'씨앗 속 영양분으로 자라는 첫 번째 잎이에요. 광합성을 시작해요.'},{name:'줄기',icon:'🌿',desc:'뿌리에서 잎까지 물과 양분을 전달하는 통로예요.'},{name:'뿌리',icon:'🌱',desc:'곁뿌리와 뿌리털이 늘어나 흡수 면적을 넓혀요.'}], tip:'하루 6시간 이상 햇빛이 없으면 줄기가 웃자라요.' },
    { stage:3, emoji:'🍃', title:'성장기·본잎', weeks:'5~8주', parts:[{name:'본잎(겹깃꼴겹잎)',icon:'🍃',desc:'광합성을 본격적으로 담당해요. 가장자리가 톱니 모양의 복엽이에요.'},{name:'줄기',icon:'🌿',desc:'굵어지면서 물관과 체관이 발달해요.'},{name:'곁순',icon:'✂️',desc:'잎 겨드랑이에서 자라는 가지예요. 제때 따줘야 열매가 커요.'}], tip:'곁순따기를 꾸준히 해야 영양분이 주줄기에 집중돼요.' },
    { stage:4, emoji:'🌼', title:'개화(꽃피기)', weeks:'9~10주', parts:[{name:'노란 별 모양 꽃',icon:'🌼',desc:'수술과 암술이 함께 있어 혼자서도 꽃가루받이가 가능해요(자가수분).'},{name:'수술·암술',icon:'🌸',desc:'수술의 꽃가루가 암술머리에 닿으면 열매가 생겨요.'}], tip:'꽃을 살살 흔들어 꽃가루받이를 도와주세요.' },
    { stage:5, emoji:'🍅', title:'결실(열매)', weeks:'11~14주', parts:[{name:'초록 열매',icon:'🟢',desc:'수정 후 씨방이 자라 열매가 돼요. 처음엔 초록색이에요.'},{name:'빨간 열매',icon:'🍅',desc:'리코펜 색소가 쌓이면서 빨갛게 익어요. 이때 수확해요!'},{name:'씨앗',icon:'🟤',desc:'열매 안에 다음 세대의 씨앗이 자라요.'}], tip:'물을 갑자기 많이 주면 열매가 갈라져요. 꾸준히 주세요.' },
    { stage:6, emoji:'🌾', title:'채종(씨앗 수확)', weeks:'15주+', parts:[{name:'완숙 씨앗',icon:'🌾',desc:'완전히 익은 열매에서 씨앗을 꺼내 말려요. 이 씨앗으로 새 한살이를 시작할 수 있어요.'}], tip:'씨앗을 잘 건조시켜 서늘하고 어두운 곳에 보관하면 이듬해 다시 심을 수 있어요.' }
  ],
  potato: [
    { stage:1, emoji:'🌱', title:'씨감자·발아', weeks:'1~2주', parts:[{name:'씨감자(덩이줄기)',icon:'🥔',desc:'눈(芽)에서 새 싹이 돋아나요. 감자는 씨앗이 아닌 줄기(덩이줄기)로 번식해요!'},{name:'뿌리',icon:'🌱',desc:'씨감자에서 가느다란 뿌리가 뻗어 물을 흡수해요.'}], tip:'씨감자의 눈이 위를 향하도록 심어요. 발아 전 과습하면 썩어요.' },
    { stage:2, emoji:'🌿', title:'새싹·줄기 신장', weeks:'3~4주', parts:[{name:'지상부 줄기',icon:'🌿',desc:'씨감자에서 여러 줄기가 올라와요.'},{name:'본잎(겹깃꼴)',icon:'🍃',desc:'복엽 구조의 잎이 펼쳐져 광합성을 시작해요.'},{name:'지하 줄기',icon:'🥔',desc:'땅속 줄기 끝이 부풀기 시작해 새 감자가 될 준비를 해요.'}], tip:'싹이 나면 흙을 북돋아(북주기) 줄기가 더 많이 나오게 해요.' },
    { stage:3, emoji:'🍃', title:'성장기·괴경 비대', weeks:'5~8주', parts:[{name:'본잎',icon:'🍃',desc:'광합성으로 만든 양분이 땅속 감자로 이동해요.'},{name:'땅속 덩이줄기(감자)',icon:'🥔',desc:'줄기 끝이 굵어져 녹말을 저장해요. 뿌리가 아니라 줄기예요!'},{name:'뿌리',icon:'🌱',desc:'물과 무기 양분을 흡수해 지상부와 지하 감자에 공급해요.'}], tip:'이 시기 땅을 파지 마세요. 빛을 받은 감자에 독성(솔라닌)이 생겨요.' },
    { stage:4, emoji:'🌼', title:'개화·결실', weeks:'9~11주', parts:[{name:'흰색/연보라 꽃',icon:'🌸',desc:'별 모양의 꽃이 모여 피어요. 꽃가루받이 후 작은 초록 열매를 맺어요.'},{name:'땅속 감자(성숙)',icon:'🥔',desc:'감자가 더욱 굵어지며 수확할 준비를 해요.'}], tip:'꽃이 피면 수확이 가까워졌다는 신호예요.' },
    { stage:5, emoji:'🥔', title:'수확기', weeks:'12~16주', parts:[{name:'성숙한 감자',icon:'🥔',desc:'녹말이 가득 찬 감자를 수확해요. 줄기가 말라가면 수확할 때예요.'}], tip:'줄기가 노랗게 말라갈 때 수확하면 가장 맛있어요.' },
    { stage:6, emoji:'🌾', title:'씨감자 보관', weeks:'수확 후', parts:[{name:'씨감자',icon:'🥔',desc:'눈이 많은 감자를 골라 서늘하고 어두운 곳에 보관해요. 이듬해 씨감자로 써요.'}], tip:'빛에 노출되면 독성이 생겨요. 반드시 어두운 곳에 보관하세요.' }
  ],
  cabbage: [
    { stage:1, emoji:'🌱', title:'씨앗·발아', weeks:'1주', parts:[{name:'씨앗',icon:'🟤',desc:'매우 작고 둥근 씨앗이에요. 서늘한 온도(15~20℃)에서 잘 발아해요.'},{name:'뿌리(유근)',icon:'🌱',desc:'씨앗에서 처음 나오는 기관으로 물 흡수를 시작해요.'}], tip:'15~20℃ 서늘한 환경에서 3~5일 안에 발아해요.' },
    { stage:2, emoji:'🌿', title:'새싹·유묘', weeks:'2~3주', parts:[{name:'떡잎',icon:'🍃',desc:'씨앗 속 영양분으로 자라는 첫 번째 잎이에요.'},{name:'줄기(밑동)',icon:'🌿',desc:'짧고 굵은 줄기가 자라기 시작해요.'}], tip:'모종을 키울 때는 솎아주기가 중요해요.' },
    { stage:3, emoji:'🥬', title:'잎 성장기', weeks:'4~7주', parts:[{name:'겉잎(결구엽 전)',icon:'🥬',desc:'넓은 잎이 사방으로 펼쳐져요. 이 잎들이 광합성을 담당해요.'},{name:'줄기',icon:'🌿',desc:'짧고 굵어지면서 잎을 지탱해요.'}], tip:'이 시기 비료를 충분히 주면 결구가 튼실해져요.' },
    { stage:4, emoji:'🥬', title:'결구(속 차기)', weeks:'8~11주', parts:[{name:'속잎(결구)',icon:'🥬',desc:'잎이 안으로 말려 단단한 공 모양을 만들어요. 속은 연한 노란색이에요.'},{name:'겉잎',icon:'🍃',desc:'광합성으로 만든 양분을 속잎에 공급해요.'}], tip:'결구가 단단해지면 수확 직전이에요.' },
    { stage:5, emoji:'🥬', title:'수확기', weeks:'12~15주', parts:[{name:'완성된 결구',icon:'🥬',desc:'꽉 찬 배추를 수확해요. 우리나라 김치의 주재료예요!'}], tip:'너무 늦게 수확하면 꽃대가 올라와(추대) 잎이 질겨져요.' },
    { stage:6, emoji:'🌼', title:'추대·채종', weeks:'수확 후', parts:[{name:'꽃대(추대)',icon:'🌼',desc:'따뜻해지면 가운데서 꽃대가 올라와 노란 꽃이 피어요.'},{name:'씨앗',icon:'🟤',desc:'꽃가루받이 후 씨앗 꼬투리가 생겨요. 완전히 익으면 채종해요.'}], tip:'추대가 시작되면 잎이 질겨지니 식용은 그 전에 해야 해요.' }
  ],
  cucumber: [
    { stage:1, emoji:'🌱', title:'씨앗·발아', weeks:'1주', parts:[{name:'씨앗',icon:'🟤',desc:'납작하고 희끄무레한 씨앗이에요. 따뜻한 온도(25~30℃)에서 잘 발아해요.'},{name:'뿌리(유근)',icon:'🌱',desc:'오이는 뿌리가 약해서 직파(바로 심기)를 추천해요.'}], tip:'25~30℃ 따뜻한 환경에서 3~5일 안에 발아해요.' },
    { stage:2, emoji:'🌿', title:'새싹·유묘', weeks:'2~3주', parts:[{name:'떡잎',icon:'🍃',desc:'납작하고 둥근 떡잎 2장이 펼쳐져요.'},{name:'줄기(덩굴)',icon:'🌿',desc:'초기 줄기가 올라오기 시작해요.'}], tip:'지지대를 미리 세워두면 나중에 덩굴이 타고 올라가요.' },
    { stage:3, emoji:'🍃', title:'덩굴·잎 성장', weeks:'4~6주', parts:[{name:'손바닥 모양 잎',icon:'🍃',desc:'광합성을 담당해요. 표면에 털이 있어 해충과 강한 햇빛을 막아요.'},{name:'덩굴손',icon:'🌀',desc:'지지대를 감아 위로 올라가는 기관이에요.'},{name:'덩굴 줄기',icon:'🌿',desc:'빠르게 자라며 지지대를 타고 위로 뻗어요.'}], tip:'덩굴손이 지지대를 잘 잡을 수 있게 자주 유인해줘요.' },
    { stage:4, emoji:'🌼', title:'개화', weeks:'7~8주', parts:[{name:'수꽃(노란색)',icon:'🌼',desc:'꽃가루를 만들어요. 암꽃보다 먼저 피어요.'},{name:'암꽃(노란색)',icon:'🌼',desc:'꽃 아래에 작은 오이 모양이 달려있어요. 수분 후 열매가 돼요.'}], tip:'수꽃과 암꽃이 함께 피어야 열매가 맺혀요.' },
    { stage:5, emoji:'🥒', title:'결실·수확', weeks:'9~12주', parts:[{name:'오이 열매',icon:'🥒',desc:'초록색으로 빠르게 자라요. 95%가 수분이에요!'},{name:'씨앗',icon:'🟤',desc:'열매 속에 씨앗이 줄지어 자라요.'}], tip:'15~20cm 정도 자라면 수확해요. 너무 크면 씨앗이 굵어져 맛이 떨어져요.' },
    { stage:6, emoji:'🌾', title:'채종', weeks:'완숙 후', parts:[{name:'완숙 열매(노란색)',icon:'🟡',desc:'채종용은 노랗게 될 때까지 두어요. 안의 씨앗을 채취해요.'}], tip:'씨앗을 잘 씻어 말린 뒤 서늘하고 건조한 곳에 보관하세요.' }
  ],
  apple: [
    { stage:1, emoji:'🌱', title:'씨앗·묘목', weeks:'1~4주', parts:[{name:'씨앗',icon:'🟤',desc:'사과씨는 저온 처리(층적 처리)를 해야 발아해요.'},{name:'어린 뿌리',icon:'🌱',desc:'뿌리가 자라며 땅에 자리를 잡아요.'}], tip:'실제로는 씨앗보다 접목(다른 나무에 붙이기)으로 재배하는 경우가 많아요.' },
    { stage:2, emoji:'🌿', title:'묘목 성장', weeks:'5~12주', parts:[{name:'어린 줄기',icon:'🌿',desc:'나무처럼 딱딱한 목질부 줄기가 자라기 시작해요.'},{name:'타원형 잎',icon:'🍃',desc:'광합성으로 양분을 만들어 나무 전체에 공급해요.'}], tip:'사과나무는 다년생 식물로 해마다 자라요. 인내가 필요해요!' },
    { stage:3, emoji:'🍃', title:'가지·수관 성장', weeks:'여러 달', parts:[{name:'가지',icon:'🌿',desc:'주가지에서 곁가지가 발달해 수관을 형성해요.'},{name:'잎',icon:'🍃',desc:'수많은 잎이 광합성을 해요. 가을에는 단풍이 들어요.'}], tip:'가지치기로 햇빛이 잘 들어오게 해야 맛있는 사과가 열려요.' },
    { stage:4, emoji:'🌸', title:'개화', weeks:'봄(4~5월)', parts:[{name:'사과꽃(분홍빛 흰색)',icon:'🌸',desc:'꽃잎 5장의 예쁜 꽃이 피어요. 꿀벌이 꽃가루를 다른 품종에 옮겨줘야 해요(타가수분).'},{name:'수술·암술',icon:'🌸',desc:'암술에 꽃가루가 닿아야 열매가 맺혀요.'}], tip:'주변에 다른 품종의 사과나무가 있어야 열매가 잘 맺혀요.' },
    { stage:5, emoji:'🍎', title:'결실·수확', weeks:'꽃 후 130~150일', parts:[{name:'사과 열매',icon:'🍎',desc:'꽃받침이 발달해 열매가 돼요. 가운데 씨앗 5개가 있어요.'},{name:'씨앗',icon:'🟤',desc:'열매 가운데에 씨앗이 자라요.'}], tip:'봉지 씌우기를 하면 예쁜 빨간 사과가 돼요. 가을(9~10월)에 수확해요.' },
    { stage:6, emoji:'🍂', title:'낙엽·겨울잠', weeks:'가을~겨울', parts:[{name:'단풍·낙엽',icon:'🍂',desc:'가을에 잎의 엽록소가 분해되어 단풍이 들고 잎이 떨어져요.'},{name:'가지·눈(芽)',icon:'🌿',desc:'이듬해 봄을 위한 꽃눈과 잎눈이 가지에 자리잡아요.'}], tip:'사과나무는 겨울에 쉬고 봄에 다시 꽃을 피워요. 수년간 열매를 맺는 다년생 식물이에요.' }
  ]
};

// Plant Life Cycle Summary Info
const PLANT_LIFE_CYCLE_INFO = {
  tomato: {
    naturalDuration: '약 3~4개월 (90~120일)',
    characteristics: '덩굴성 한해살이 식물로 줄기에서 곁가지가 많이 자라요. 열매는 처음엔 초록색이다가 익으면 빨간색으로 변해요. 꽃이 노란색이고 작은 열매가 송이로 열려요.',
    uses: '생으로 먹거나 주스·케첩·파스타 소스로 활용해요. 비타민C와 항산화 성분인 리코펜이 풍부해 건강에도 아주 좋아요.',
    careWarnings: ['줄기 밑동이 과습하면 역병(무름병)이 생겨요','곁순을 제때 따줘야 열매가 커요','지지대를 꼭 세워 쓰러짐을 막아요','강한 직사광선에 오래 노출되면 잎이 타요'],
    funFact: '방울토마토는 식물학적으로 채소가 아니라 과일이에요! 씨앗이 있는 씨방이 발달한 열매이기 때문이에요.'
  },
  potato: {
    naturalDuration: '약 3~4개월 (90~120일)',
    characteristics: '땅 속에 덩이줄기(감자)를 만드는 식물이에요. 지상부는 여름에 마르고, 땅 속에 영양분이 가득 찬 감자가 남아요. 꽃은 흰색 또는 보라색이에요.',
    uses: '찌거나 구워 먹고, 감자볶음·감자탕·감자튀김·매시드포테이토 등 다양하게 활용해요. 탄수화물과 비타민C가 풍부해요.',
    careWarnings: ['과습하면 역병과 무름병이 생겨요','감자가 빛에 노출되면 솔라닌(독소)이 생겨 녹색이 돼요','북주기(흙 덮기)를 꼭 해줘야 감자가 많이 달려요','씨감자의 눈(芽)을 살려서 심어야 해요'],
    funFact: '감자는 뿌리가 아니라 줄기(땅속줄기=덩이줄기)예요! 눈(芽)에서 싹이 나는 것이 바로 그 증거예요.'
  },
  cabbage: {
    naturalDuration: '약 3~4개월 (90~120일)',
    characteristics: '잎이 겹겹이 쌓여 공처럼 둥글게 뭉치는 채소예요. 서늘한 날씨를 좋아하고, 속잎은 빛이 닿지 않아 노란색이며 가장 달고 부드러워요.',
    uses: '쌈을 싸 먹거나 볶음·샐러드·피클로 먹고, 양배추즙은 위장 건강에 좋아요. 비타민K와 식이섬유가 풍부해요.',
    careWarnings: ['고온에 약해 여름 재배는 어려워요','배추흰나비 애벌레를 자주 확인해요','수확 시기를 놓치면 꽃대가 올라와(추대) 잎이 질겨져요','물이 잎 사이에 고이면 무름병이 생겨요'],
    funFact: '배추의 속이 노란 이유는 빛이 닿지 못해 엽록소가 없기 때문이에요. 이 부분이 가장 달고 부드러워요!'
  },
  cucumber: {
    naturalDuration: '약 2~3개월 (60~90일)',
    characteristics: '덩굴손으로 지지대를 타고 오르는 한해살이 채소예요. 열매는 수분이 95%로 매우 많고, 씨를 심은 지 2달 만에 수확할 수 있을 만큼 빠르게 자라요.',
    uses: '오이무침·피클·냉국·비빔밥 재료로 다양하게 쓰여요. 수분이 많아 더운 여름에 시원하게 먹기 좋고, 피부 팩으로도 활용해요.',
    careWarnings: ['뿌리가 약해 이식 시 조심해야 해요','물을 많이 필요로 해 건조하면 쓴맛이 나요','덩굴손을 지지대에 자주 유인해줘야 해요','흰가루병(잎에 흰 가루 같은 병)을 조심해야 해요'],
    funFact: '오이 열매의 95%가 수분이에요! 더운 여름날 오이를 먹으면 수분 보충에 최고예요.'
  },
  apple: {
    naturalDuration: '꽃이 핀 후 130~150일 (나무 자체는 수십 년 다년생)',
    characteristics: '여러 해 동안 자라는 낙엽 과일나무예요. 봄에 분홍빛 흰 꽃이 피고, 꿀벌이 꽃가루를 다른 품종으로 옮겨야 열매가 맺혀요. 가을에 잎이 단풍이 들고 떨어져요.',
    uses: '생과일로 먹거나 주스·잼·사과식초·사이다·파이 등으로 다양하게 활용해요. 식이섬유와 비타민C가 풍부하고 소화에도 좋아요.',
    careWarnings: ['다른 품종과 함께 심어야 꽃가루받이가 잘 돼요(타가수분)','가지치기를 매년 해야 햇빛이 잘 들어요','병해충(사과 응애, 붉은별무늬병)을 자주 확인해야 해요','열매가 많이 달리면 솎아내야(적과) 큰 사과가 돼요'],
    funFact: '사과는 씨를 심으면 부모와 다른 사과나무가 자라요! 그래서 농부들은 좋은 사과를 접목(접붙이기)해서 재배해요.'
  }
};

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
  quizSeenIndices: [],
  quizCurrentIdx: null,
  quizCorrectCount: 0,
  badges: [],
  isSimulating: false,
  simulationIntervalId: null,
  dailyGrowth: {},      // Record of XP gained per date "YYYY-MM-DD"
  currentCalendarDate: new Date(),
  emotionMissionCompleted: false, // Tracks if the user completed the current emotion care mission
  lastDangerState: {}   // Tracks which stats are in danger to avoid duplicate messages
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

// 감정 정의 (mood key → 표시 정보)
const EMOTIONS = {
  joy:          { label: '기쁨',    emoji: '😄', color: '#FFD700', causeRain: false, causeSunny: true,  causeWind: false },
  sadness:      { label: '슬픔',    emoji: '😢', color: '#4A90D9', causeRain: true,  causeSunny: false, causeWind: false },
  anger:        { label: '화남',    emoji: '😠', color: '#E53935', causeRain: false, causeSunny: false, causeWind: true  },
  fear:         { label: '두려움',  emoji: '😨', color: '#8E44AD', causeRain: false, causeSunny: false, causeWind: true  },
  disgust:      { label: '싫음',    emoji: '🤢', color: '#43A047', causeRain: false, causeSunny: false, causeWind: false },
  anxiety:      { label: '불안',    emoji: '😟', color: '#FF7043', causeRain: true,  causeSunny: false, causeWind: false },
  ennui:        { label: '따분함',  emoji: '😑', color: '#546E7A', causeRain: true,  causeSunny: false, causeWind: false },
  envy:         { label: '부러움',  emoji: '🙄', color: '#00897B', causeRain: false, causeSunny: false, causeWind: false },
  embarrassment:{ label: '부끄러움',emoji: '😳', color: '#E91E8C', causeRain: false, causeSunny: false, causeWind: false },
};


// 3. Dynamic SVG Generator
// Renders vector graphic of the plant based on its key, growth stage, and safety status

function buildClickZones(plantKey, stage) {
  let z = '';
  // Underground: root zone
  z += `<rect x="25" y="132" width="150" height="65" fill="transparent" class="plant-hit-area" data-part="root" style="cursor:pointer"/>`;
  // Potato special: tuber = stem zone (overlaps root, drawn after = higher priority)
  if (plantKey === 'potato' && stage >= 3) {
    z += `<rect x="50" y="148" width="100" height="45" fill="transparent" class="plant-hit-area" data-part="stem" style="cursor:pointer"/>`;
  }
  // Above ground leaf zone
  if (stage >= 1) {
    z += `<rect x="20" y="15" width="160" height="115" fill="transparent" class="plant-hit-area" data-part="leaf" style="cursor:pointer"/>`;
  }
  // Stem zone (center strip, drawn after leaf = higher priority at center)
  if (plantKey !== 'potato' && stage >= 1) {
    z += `<rect x="88" y="50" width="24" height="82" fill="transparent" class="plant-hit-area" data-part="stem" style="cursor:pointer"/>`;
  }
  // Flower zone (stage 3) - drawn last = topmost
  if (stage === 3) {
    z += `<rect x="20" y="15" width="160" height="115" fill="transparent" class="plant-hit-area" data-part="flower" style="cursor:pointer"/>`;
  }
  // Fruit zone (stage 4+)
  if (stage >= 4) {
    z += `<rect x="20" y="15" width="160" height="115" fill="transparent" class="plant-hit-area" data-part="fruit" style="cursor:pointer"/>`;
  }
  return z;
}

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

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="${animationClass}" width="100%" height="100%" style="overflow: visible;">
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

  // Soil group — static, never sways
  svg += `<g class="plant-soil">`;
  svg += `
    <g filter="url(#shadow)">
      <path d="M-2000,130 L2200,130 L2200,1000 L-2000,1000 Z" fill="#5D4037" />
      <path d="M-2000,130 L2200,130 L2200,145 Q100,150 -2000,145 Z" fill="#4E342E" />
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
  // Roots go inside the soil group so they never sway
  if (plantKey !== 'potato') {
    svg += drawRoot(stage);
  }
  svg += `</g>`;
  // Plant body — everything above ground sways
  svg += `<g class="plant-body">`;

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
  
  // Helper for drawing a realistic napa cabbage leaf with thick white veins
  const drawNapaLeaf = (cx, cy, s, r, color, isInner = false) => {
    // isInner leaves are lighter and have smaller spread
    const ribColor = isInner ? "#F1F8E9" : "#E8F5E9"; // White/very light green for the thick stem/ribs
    const veinOpacity = isInner ? 0.8 : 0.6;
    
    return `
    <g transform="translate(${cx}, ${cy}) scale(${s}) rotate(${r})" filter="url(#shadow)">
      <!-- Leaf Background (Frilly Edge) -->
      <path d="M0,0 
               C-20,-10 -30,-30 -25,-50 
               C-20,-60 -35,-80 -20,-100 
               C-5,-115 5,-115 20,-100 
               C35,-80 20,-60 25,-50 
               C30,-30 20,-10 0,0 Z" 
            fill="${color}"/>
      
      <!-- Thick Central White Rib / Stem -->
      <path d="M-4,0 
               Q-5,-40 -2,-80 
               Q1,-100 2,-80 
               Q5,-40 4,0 Z" 
            fill="${ribColor}"/>
            
      <!-- Branching Veins -->
      <path d="M-3,-20 Q-15,-40 -20,-60 M-2,-45 Q-15,-65 -15,-80 M3,-15 Q15,-35 20,-55 M2,-40 Q15,-60 15,-75 M-1,-60 Q-8,-75 -10,-90 M1,-60 Q8,-75 10,-90" 
            fill="none" stroke="${ribColor}" stroke-width="2.5" stroke-linecap="round" opacity="${veinOpacity}"/>
    </g>
    `;
  };
  
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

  function drawRoot(stage) {
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
        svg += drawNapaLeaf(100, 175, 0.6, -45, "#7CB342");
        svg += drawNapaLeaf(100, 175, 0.6, 45, "#7CB342");
        svg += drawNapaLeaf(100, 160, 0.5, 0, "#8BC34A");
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
      // Base dark green wide outer leaves (flaring outwards)
      svg += drawNapaLeaf(100, 180, 0.9, -65, "#4CAF50");
      svg += drawNapaLeaf(100, 180, 0.9, 65, "#4CAF50");
      svg += drawNapaLeaf(100, 180, 1.0, -45, "#66BB6A");
      svg += drawNapaLeaf(100, 180, 1.0, 45, "#66BB6A");
      
      if (stage === 3) {
        // Stage 3: Growing leaves, not tightly packed yet
        svg += drawNapaLeaf(100, 180, 0.9, -25, "#81C784");
        svg += drawNapaLeaf(100, 180, 0.9, 25, "#81C784");
        svg += drawNapaLeaf(100, 180, 0.8, 0, "#A5D6A7", true);
      } else if (stage === 4) {
        // Stage 4: Starting to head (결구 시작)
        svg += drawNapaLeaf(100, 180, 1.0, -20, "#81C784");
        svg += drawNapaLeaf(100, 180, 1.0, 20, "#81C784");
        svg += drawNapaLeaf(100, 180, 0.9, -10, "#A5D6A7", true);
        svg += drawNapaLeaf(100, 180, 0.9, 10, "#A5D6A7", true);
        svg += drawNapaLeaf(100, 180, 0.85, 0, "#C8E6C9", true);
      } else {
        // Stage 5 & 6: Full huge napa cabbage head (꽉 찬 배추)
        // Outer wrapping leaves
        svg += drawNapaLeaf(100, 180, 1.1, -30, "#81C784");
        svg += drawNapaLeaf(100, 180, 1.1, 30, "#81C784");
        
        // Inner head structure (tightly packed, overlapping)
        svg += drawNapaLeaf(100, 180, 1.0, -15, "#A5D6A7", true);
        svg += drawNapaLeaf(100, 180, 1.0, 15, "#9CCC65", true); // Slight color variation
        
        // Core
        svg += drawNapaLeaf(100, 180, 0.95, -5, "#C8E6C9", true);
        svg += drawNapaLeaf(100, 180, 0.95, 5, "#DCE775", true); // Yellowish center
        
        // Front most covering leaf
        svg += drawNapaLeaf(100, 180, 0.9, 0, "#AED581", true);
        
        if (stage === 6) {
          // Bolting: flower stalk shooting up from head
          svg += `<path d="M100,80 Q95,40 100,10" stroke="#8BC34A" stroke-width="6" fill="none" filter="url(#shadow)"/>`;
          svg += drawFlower(100, 10, 1.4, "#FFEE58");
          svg += drawFlower(85, 20, 0.9, "#FFEE58");
          svg += drawFlower(115, 15, 1.1, "#FFEE58");
          svg += drawFlower(95, 0, 0.9, "#FFEE58");
          svg += drawFlower(105, -5, 0.8, "#FFEE58");
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
  
  svg += `</g>`; // close plant-body
  svg += buildClickZones(plantKey, stage);
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
    "🌱 답변을 꼼꼼히 읽고 있어요...",
    "🔍 어떤 식물과 잘 맞을지 살펴보는 중...",
    "💚 식물 친구들과 성격을 비교하고 있어요...",
    "✨ 딱 맞는 반려 식물을 찾았어요!"
  ];
  
  const logContainer = document.querySelector('.analysis-logs');
  logContainer.innerHTML = '';
  
  let delay = 350;
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
  }, 1600);
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

function spawnParticles() {
  const holder = document.getElementById('garden-view-port');
  if (!holder) return;

  const now = new Date();
  const hour = now.getHours();
  const isDay = (hour >= 6 && hour < 18);
  const isSunny = appState.weather === 'sunny';

  let type = '';
  if (isDay) {
    // 광합성: 낮이면서 맑은 날일 때 주로 발생
    if (isSunny || Math.random() > 0.5) type = 'photo';
  } else {
    // 호흡: 밤에는 항상 일정하게 발생
    if (Math.random() > 0.3) type = 'respire';
  }

  if (!type) return;

  const count = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    
    if (type === 'photo') {
      p.classList.add('particle-photo');
      const size = Math.random() * 4 + 3;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      
      // Start near top edges
      const startX = Math.random() * 100;
      const startY = Math.random() * 40;
      p.style.left = startX + '%';
      p.style.top = startY + '%';
      
      // Target: center bottom (towards plant)
      p.style.setProperty('--tx', (50 - startX) + 'vw');
      p.style.setProperty('--ty', (80 - startY) + 'vh');
    } else {
      p.classList.add('particle-respire');
      const size = Math.random() * 3 + 2;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      
      // Start near center bottom (plant leaves)
      const startX = 40 + Math.random() * 20;
      const startY = 60 + Math.random() * 20;
      p.style.left = startX + '%';
      p.style.top = startY + '%';
      
      // Target: float outward and up
      const angle = Math.random() * Math.PI + Math.PI; // Upwards hemisphere
      const distance = 80 + Math.random() * 100;
      p.style.setProperty('--tx', (Math.cos(angle) * distance) + 'px');
      p.style.setProperty('--ty', (Math.sin(angle) * distance - 50) + 'px');
    }
    
    holder.appendChild(p);
    
    setTimeout(() => {
      if (p.parentNode) p.parentNode.removeChild(p);
    }, 4000);
  }
}

function simulationTick() {
  const profile = plantProfiles[appState.selectedPlantKey];
  if (!profile) return;

  // 1. Natural drain of water, wind levels, and soil nutrient
  let waterDrain = 0.5;
  let targetSun = 20;
  let targetWind = 20;
  let soilDrain = 0.1;

  // Apply Weather Modifiers
  if (appState.weather === 'sunny') { waterDrain += 0.5; targetSun += 30; }
  if (appState.weather === 'rainy') { waterDrain -= 1.0; targetSun -= 10; }
  if (appState.weather === 'windy') { waterDrain += 0.2; targetWind += 40; }

  // Apply Environment Modifiers
  switch (appState.environment) {
    case 'window':
      waterDrain += 0.3;
      targetSun += 25;
      targetWind += 5;
      break;
    case 'balcony':
      waterDrain += 0.2;
      targetSun += 15;
      targetWind += 30;
      break;
    case 'room':
      waterDrain -= 0.2;
      targetSun -= 10;
      targetWind -= 10;
      break;
    case 'outdoor':
      waterDrain += 0.5;
      targetSun += 35;
      targetWind += 40;
      soilDrain += 0.1;
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

  // 4. 생명 활동 파티클 렌더링
  spawnParticles();

  updateDashboardUI();
}

function triggerStageLevelUp() {
  const profile = plantProfiles[appState.selectedPlantKey];
  // Add announcement to chat
  const stageNames = ["씨앗", "새싹", "성장기", "개화", "결실", "채종"];
  const stageName = stageNames[appState.growthStage - 1] || "완성";
  const stageEmoji = ["🌱","🌿","🍃","🌸","🍎","🌾"][appState.growthStage - 1] || "🌾";
  showToast(`${stageEmoji} 축하해요! 정원사님 덕분에 [${stageName}] 단계로 성장했어요!`, 'celebrate');
  if (appState.growthStage === 6) {
    setTimeout(() => showLifeCycleComplete(), 1500);
  }
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
  const STAT_CONFIG = {
    water: {
      action: '물 주기', icon: 'droplet',
      low:  { alert: '물이 부족해 말라가고 있어요!',          chip: '😟 목말라요!',    plant: '😟 목말라요! 물이 필요해요 💧' },
      high: { alert: '과습 상태에요! 뿌리가 썩을 수 있어요.',  chip: '😵 물 너무 많아요!', plant: '😵 물이 너무 많아요! 뿌리가 아파요' }
    },
    sun: {
      action: '햇빛 쬐기', icon: 'sun',
      low:  { alert: '햇빛이 너무 부족해 시들시들해요.',       chip: '🌑 어두워요!',    plant: '🌑 어두워요! 햇빛이 그리워요 ☀️' },
      high: { alert: '직사광선이 너무 강해 잎사귀가 타고 있어요!', chip: '🥵 너무 뜨거워요!', plant: '🥵 너무 뜨거워요! 그늘이 필요해요' }
    },
    wind: {
      action: '환기 하기', icon: 'wind',
      low:  { alert: '공기가 탁해서 숨쉬기 힘들어요.',        chip: '😮‍💨 답답해요!',  plant: '😮‍💨 답답해요! 창문 좀 열어줘요 🪟' },
      high: { alert: '바람이 너무 강해요.',                   chip: '🌪️ 바람 세요!',  plant: '🌪️ 바람이 너무 강해요!' }
    },
    soil: {
      action: '비료 주기', icon: 'sparkles',
      low:  { alert: '흙에 영양분이 전부 닳았어요!',          chip: '🌱 배고파요!',    plant: '🌱 배고파요! 비료가 필요해요 🧪' },
      high: { alert: '영양 성분이 과다하여 해로워요!',         chip: '😰 영양 과다!',  plant: '😰 영양이 너무 많아요!' }
    }
  };

  const statsList = ['water', 'sun', 'wind', 'soil'];
  let isAnyDanger = false;
  let dangerMessage = "";

  statsList.forEach(stat => {
    const val = Math.round(appState.stats[stat]);
    const cfg = STAT_CONFIG[stat];
    const { min: minVal, max: maxVal } = profile.careInfo[stat];

    let statusLabel = "";
    let dangerKey = null;
    let dangerCfg = null;

    if (val < minVal) {
      isAnyDanger = true;
      dangerKey = `${stat}_low`;
      dangerCfg = cfg.low;
    } else if (val > maxVal) {
      isAnyDanger = true;
      dangerKey = `${stat}_high`;
      dangerCfg = cfg.high;
    }

    if (dangerCfg) {
      dangerMessage = dangerCfg.alert;
      statusLabel = dangerCfg.chip;
    }

    if (dangerKey && appState.lastDangerState[stat] !== dangerKey) {
      showPlantBubble(dangerCfg.plant);
    }
    appState.lastDangerState[stat] = dangerKey;

    const chipBtn = document.getElementById(`chip-${stat}`);
    if (chipBtn) {
      chipBtn.innerHTML = `<i data-lucide="${cfg.icon}"></i> ${cfg.action}`;
      chipBtn.classList.toggle('chip-danger', !!dangerCfg);
    }
  });

  // Stat mini card (water & sun only)
  const waterVal = Math.round(appState.stats.water);
  const sunVal   = Math.round(appState.stats.sun);
  const windVal  = Math.round(appState.stats.wind);
  const soilVal  = Math.round(appState.stats.soil);
  const waterFill = document.getElementById('stat-fill-water');
  const sunFill   = document.getElementById('stat-fill-sun');
  const windFill  = document.getElementById('stat-fill-wind');
  const soilFill  = document.getElementById('stat-fill-soil');
  const waterPct  = document.getElementById('stat-pct-water');
  const sunPct    = document.getElementById('stat-pct-sun');
  const windPct   = document.getElementById('stat-pct-wind');
  const soilPct   = document.getElementById('stat-pct-soil');
  if (waterFill) waterFill.style.width = `${waterVal}%`;
  if (sunFill)   sunFill.style.width   = `${sunVal}%`;
  if (windFill)  windFill.style.width  = `${windVal}%`;
  if (soilFill)  soilFill.style.width  = `${soilVal}%`;
  if (waterPct)  waterPct.textContent  = `${waterVal}%`;
  if (sunPct)    sunPct.textContent    = `${sunVal}%`;
  if (windPct)   windPct.textContent   = `${windVal}%`;
  if (soilPct)   soilPct.textContent   = `${soilVal}%`;

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

  showToast("💧 시원한 물 감사합니다! 흙이 수분을 머금어 촉촉해졌어요.");
  checkEmotionCareMission('물 주기');
  updateDashboardUI();
}

function toggleSunLamp() {
  appState.isSunLampOn = !appState.isSunLampOn;
  if (appState.isSunLampOn) {
    appState.stats.sun = Math.min(100, appState.stats.sun + 15);
    showToast("💡 인공 조명(생장용 LED)을 켰습니다! 식물 잎사귀들이 에너지를 내기 시작했어요.");
    checkEmotionCareMission('햇빛 쬐기');
  } else {
    showToast("💡 조명을 껐어요");
  }
  updateDashboardUI();
}

function toggleWindow() {
  appState.isWindowOpen = !appState.isWindowOpen;
  if (appState.isWindowOpen) {
    appState.stats.wind = Math.min(100, appState.stats.wind + 20);
    showToast("🪟 창문을 시원하게 열었어요! 맑은 바깥바람이 화분 사이로 흘러 들어옵니다.");
    checkEmotionCareMission('환기 하기');
  } else {
    showToast("🪟 창문을 닫았어요");
  }
  updateDashboardUI();
}

function useFertilizer() {
  if (appState.fertilizerCount <= 0) {
    showToast("🧪 비료가 부족해요! [식물 퀴즈]를 풀어 모아보세요", 'warn');
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

  showToast("🧪 유기농 비료를 흙에 솔솔 뿌렸습니다! 영양분도 공급하고 식물이 빠르게 자라도록 도왔어요.");
  checkEmotionCareMission('비료 주기');
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

// 돌보기/시스템 피드백을 채팅과 분리해 토스트로 표시
// type: '' | 'warn' | 'error' | 'celebrate'
function showToast(text, type = '') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast' + (type ? ` toast-${type}` : '');
  toast.textContent = text;
  container.appendChild(toast);
  // 다음 프레임에 show 클래스 추가 (트랜지션 발동)
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// 식물의 needs(목말라요 등)를 식물 위 말풍선으로 표시
let plantBubbleTimer = null;
function showPlantBubble(text) {
  const bubble = document.getElementById('plant-speech-bubble');
  if (!bubble) return;
  bubble.textContent = text;
  bubble.classList.remove('hidden');
  requestAnimationFrame(() => bubble.classList.add('show'));
  clearTimeout(plantBubbleTimer);
  plantBubbleTimer = setTimeout(() => {
    bubble.classList.remove('show');
    setTimeout(() => bubble.classList.add('hidden'), 300);
  }, 3500);
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
    if (error.message === 'API_KEY_MISSING') {
      addBotMessage("선생님 연결이 아직 준비되지 않았어요. 선생님께 API 키 설정을 부탁드려요! 🔑");
    } else if (error.message.startsWith('API_ERROR:')) {
      const status = error.message.split(':')[1];
      addBotMessage(`API 오류 (${status}): ${status === '400' ? '요청이 잘못됐어요 — API 키를 확인해주세요.' : status === '403' ? 'API 키가 유효하지 않아요.' : status === '404' ? 'AI 모델을 찾을 수 없어요. API 키가 올바른지 확인해주세요.' : status === '429' ? '요청이 너무 많아요. 잠시 후 다시 시도해주세요.' : '서버 오류가 발생했어요.'}`);
    } else {
      addBotMessage("앗, 선생님이 잠깐 자리를 비웠어요. 조금 뒤에 다시 말해줄래요? 😊");
    }
  } finally {
    isProcessingChat = false;
  }
}

async function fetchGeminiResponse(userText) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === '__GEMINI_API_KEY__') {
    throw new Error('API_KEY_MISSING');
  }
  const profile = plantProfiles[appState.selectedPlantKey] || { name: '반려 식물' };
  const water = appState.stats.water;
  const sun = appState.stats.sun;
  const wind = appState.stats.wind;
  const soil = appState.stats.soil;

  const recentDiary = appState.diaryList[0];
  const recentEmotion = recentDiary ? recentDiary.mood : "평온";
  const weatherLabel = appState.weather === 'rainy' ? '마음에 비가 옴(우울/슬픔)' : appState.weather === 'windy' ? '마음에 바람이 붊(화/두려움)' : appState.weather === 'sunny' ? '마음에 해가 뜸(기쁨/행복)' : '평온함';

  const systemPrompt = `당신은 초등학교의 다정하고 똑똑한 식물학자이자 따뜻한 담임 선생님입니다. 학생(사용자)이 교실에서 가상의 반려 식물을 기르는 것을 도와주고 있습니다.

[현재 상태]
- 기르는 식물: '${profile.name}'
- 식물의 환경: 수분 ${Math.round(water)}%, 햇빛 ${Math.round(sun)}%, 환기 ${Math.round(wind)}%, 영양 ${Math.round(soil)}%. (40~80%가 적당)
- 학생의 감정: ${recentEmotion} (마음 날씨: ${weatherLabel})
- 학생의 메시지: "${userText}"

[선생님의 역할 및 답변 규칙]
1. 항상 학생을 존중하고 다정한 '해요체(존댓말)'를 사용하세요.
2. 학생의 질문(특히 식물이나 자연에 관한 질문)에는 사실에 입각하여 정확하면서도 초등학생이 이해하기 쉽게 친절히 설명해 주세요.
3. 식물 재배 팁이나 성장 과정에 대한 지식을 자연스럽게 알려주어 식물 성장에 대한 모든 것을 커버하세요.
4. 학생이 감정을 표현하거나 일상적인 대화를 걸어올 때는, 학생의 최근 감정 상태(${recentEmotion})를 세심하게 관찰하고 공감하며 위로하거나 칭찬해 주세요.
5. 답변은 항상 아주 간결하고 짧게(1~2문장) 핵심만 다정하게 답해 주세요. 억지로 말을 길게 지어낼 필요가 없습니다.
6. 학생의 행동이나 좋은 질문이 식물 성장에 기여했다면 관련 수치(water, sun, wind, soil)와 경험치(growth)를 +10 ~ +20 올려주세요. 그렇지 않다면 0을 주세요.

반드시 아래 JSON 형식으로만 응답해야 합니다.
{
  "reply": "학생에게 할 다정하고 사실적인 존댓말 답변",
  "stats": {
    "water": 0,
    "sun": 0,
    "wind": 0,
    "soil": 0,
    "growth": 0
  }
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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
    throw new Error(`API_ERROR:${response.status}`);
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

function renderQuestProgress() {
  const bar = document.getElementById('quest-progress-bar');
  if (!bar) return;
  const seen = appState.quizSeenIndices.length;
  const total = quizPool.length;
  const pct = Math.round((seen / total) * 100);
  bar.innerHTML = `
    <div class="quest-chip quest-chip-active">🌿 식물 퀴즈 — ${seen}/${total}문제 완료 (${pct}%)</div>
  `;
}

function loadQuiz() {
  // 모든 문제를 다 봤으면 초기화
  if (appState.quizSeenIndices.length >= quizPool.length) {
    appState.quizSeenIndices = [];
    awardBadge('plant_doctor');
  }

  // 아직 안 나온 문제 중 랜덤 선택
  const remaining = quizPool
    .map((_, i) => i)
    .filter(i => !appState.quizSeenIndices.includes(i));
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  appState.quizCurrentIdx = pick;
  appState.quizSeenIndices.push(pick);

  renderQuestProgress();

  const qData = quizPool[pick];
  const seen = appState.quizSeenIndices.length;
  const total = quizPool.length;

  const card = document.getElementById('quiz-card');
  card.innerHTML = `
    <div class="quiz-header-badge">
      <i data-lucide="graduation-cap" class="text-green"></i>
      <span id="quiz-stage-label">🌱 식물 퀴즈 ${seen}/${total}</span>
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
  const qData = quizPool[appState.quizCurrentIdx];
  const optionsWrapper = document.getElementById('quiz-options-list');

  optionsWrapper.style.pointerEvents = 'none';

  const feedbackBox = document.getElementById('quiz-result-feedback');
  const fbTitle = document.getElementById('quiz-feedback-title');
  const fbDesc = document.getElementById('quiz-feedback-desc');
  const fbIconContainer = document.getElementById('quiz-feedback-icon-container');
  const nextBtn = document.getElementById('btn-next-quiz');

  if (chosenIndex === qData.answer) {
    btnElement.classList.add('correct');
    appState.fertilizerCount++;
    appState.quizCorrectCount++;
    document.getElementById('fertilizer-count').textContent = appState.fertilizerCount;
    fbTitle.textContent = "정답입니다! 🌟";
    fbTitle.className = "text-green";
    fbDesc.textContent = qData.explanation;
    fbIconContainer.className = "feedback-icon-circle";
    fbIconContainer.innerHTML = '<i data-lucide="check" class="text-green"></i>';
    document.querySelector('.reward-indicator').classList.remove('hidden');
    if (appState.quizCorrectCount === 5) awardBadge('seed_explorer');
    if (appState.quizCorrectCount === 10) awardBadge('growth_guardian');
    if (appState.quizCorrectCount === 20) awardBadge('perfect_gardener');
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

  const allDone = appState.quizSeenIndices.length >= quizPool.length;
  nextBtn.textContent = allDone ? "🎉 전체 완료! 다시 도전 →" : "다음 문제 도전하기 →";

  feedbackBox.classList.remove('hidden');
  lucide.createIcons();
}

function nextQuiz() {
  loadQuiz();
}


// 10b. Plant Explorer Tab
function renderPlantExplorer() {
  const pane = document.getElementById('pane-explore');
  if (!pane) return;
  const plantKey = appState.selectedPlantKey;
  const profile = plantProfiles[plantKey];
  const timeline = PLANT_GROWTH_TIMELINE[plantKey];
  if (!profile || !timeline) return;

  let html = `<div class="explore-header" style="background: linear-gradient(135deg, ${profile.themeColor}22, ${profile.themeColor}11); border-radius: 12px; padding: 14px; margin-bottom: 14px; border-left: 4px solid ${profile.themeColor};">
    <div style="font-size: 1.1em; font-weight: 800; color: ${profile.themeColor};">${profile.name} 성장 탐구</div>
    <div style="font-size: 12px; color: #666; margin-top: 4px;">${profile.slogan}</div>
  </div>
  <div style="font-size: 11px; font-weight: 700; color: #888; margin-bottom: 10px; letter-spacing: 0.3px;">📅 주차별 성장 단계</div>`;

  timeline.forEach(item => {
    const isCurrent = item.stage === appState.growthStage;
    const isDone = item.stage < appState.growthStage;
    const borderColor = isCurrent ? profile.themeColor : isDone ? '#A5D6A7' : '#E0E0E0';
    const bgColor = isCurrent ? `${profile.themeColor}12` : isDone ? '#F1F8E9' : '#FAFAFA';
    const stageLabel = isCurrent ? '<span class="explore-current-badge">현재 단계</span>' : isDone ? '<span class="explore-done-badge">✓ 완료</span>' : '<span class="explore-locked-badge">잠김</span>';

    html += `<div class="explore-stage-card" style="border: 2px solid ${borderColor}; background: ${bgColor};">
      <div class="explore-stage-header">
        <span class="explore-stage-emoji">${item.emoji}</span>
        <div class="explore-stage-info">
          <div class="explore-stage-title">${item.title}</div>
          <div class="explore-stage-weeks">⏰ ${item.weeks}</div>
        </div>
        ${stageLabel}
      </div>
      <div class="explore-parts-list">
        ${item.parts.map(p => `<div class="explore-part-row">
          <span class="explore-part-icon">${p.icon}</span>
          <div><span class="explore-part-name">${p.name}</span><span class="explore-part-desc">${p.desc}</span></div>
        </div>`).join('')}
      </div>
      <div class="explore-tip">💡 ${item.tip}</div>
    </div>`;
  });

  pane.innerHTML = html;
}

function showLifeCycleComplete() {
  const plantKey = appState.selectedPlantKey;
  const profile = plantProfiles[plantKey];
  const cycleInfo = PLANT_LIFE_CYCLE_INFO[plantKey];
  if (!profile || !cycleInfo) return;

  // Calculate growing duration from dailyGrowth records
  const growthDates = Object.keys(appState.dailyGrowth).sort();
  const weekCount = growthDates.length > 0
    ? Math.ceil(growthDates.length / 7)
    : '여러';

  // Tally emotions from diary
  const emotionCounts = {};
  appState.diaryList.forEach(d => {
    if (d.moodKey) emotionCounts[d.moodKey] = (emotionCounts[d.moodKey] || 0) + 1;
  });
  const topEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => EMOTIONS[key])
    .filter(Boolean);
  const emotionStr = topEmotions.length > 0
    ? topEmotions.map(e => `${e.emoji} ${e.label}`).join('  ')
    : '😊 설레임과 함께';

  const modal = document.getElementById('lifecycle-complete-modal');
  if (!modal) return;

  modal.querySelector('#lc-plant-emoji').textContent = ['🌱','🌿','🍃','🌸','🍎','🌾'][5];
  modal.querySelector('#lc-plant-name').textContent = profile.name;
  modal.querySelector('#lc-weeks').textContent = `약 ${weekCount} 주`;
  modal.querySelector('#lc-emotions').textContent = emotionStr;
  modal.querySelector('#lc-natural-duration').textContent = cycleInfo.naturalDuration;
  modal.querySelector('#lc-fun-fact').textContent = cycleInfo.funFact;

  const warningList = modal.querySelector('#lc-warnings');
  warningList.innerHTML = cycleInfo.careWarnings.map(w => `<li>${w}</li>`).join('');

  modal.classList.remove('hidden');
}

// 10c. Plant Part Interaction
function initPlantInteraction() {
  const holder = document.getElementById('plant-svg-holder');
  holder.addEventListener('click', (e) => {
    const hit = e.target.closest('.plant-hit-area');
    if (!hit) return;
    showPlantPartInfo(hit.getAttribute('data-part'), appState.selectedPlantKey);
  });
  document.getElementById('plant-info-close').addEventListener('click', () => {
    document.getElementById('plant-info-panel').classList.add('hidden');
  });
  document.getElementById('lc-close-btn')?.addEventListener('click', () => {
    document.getElementById('lifecycle-complete-modal').classList.add('hidden');
  });
}

function showPlantPartInfo(part, plantKey) {
  const info = PLANT_PART_INFO[plantKey]?.[part];
  if (!info) return;
  document.getElementById('plant-info-icon').textContent = info.icon;
  document.getElementById('plant-info-name').textContent = info.name;
  document.getElementById('plant-info-struct').textContent = info.struct;
  document.getElementById('plant-info-func').textContent = info.func;
  const panel = document.getElementById('plant-info-panel');
  panel.classList.remove('hidden');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 10b. Plant Explorer Tab
function renderPlantExplorer() {
  const pane = document.getElementById('pane-explore');
  if (!pane) return;
  const plantKey = appState.selectedPlantKey;
  const profile = plantProfiles[plantKey];
  const timeline = PLANT_GROWTH_TIMELINE[plantKey];
  if (!profile || !timeline) return;

  let html = `<div class="explore-header" style="background: linear-gradient(135deg, ${profile.themeColor}22, ${profile.themeColor}11); border-radius: 12px; padding: 14px; margin-bottom: 14px; border-left: 4px solid ${profile.themeColor};">
    <div style="font-size: 1.1em; font-weight: 800; color: ${profile.themeColor};">${profile.name} 성장 탐구</div>
    <div style="font-size: 12px; color: #666; margin-top: 4px;">${profile.slogan}</div>
  </div>
  <div style="font-size: 11px; font-weight: 700; color: #888; margin-bottom: 10px; letter-spacing: 0.3px;">📅 주차별 성장 단계</div>`;

  timeline.forEach(item => {
    const isCurrent = item.stage === appState.growthStage;
    const isDone = item.stage < appState.growthStage;
    const borderColor = isCurrent ? profile.themeColor : isDone ? '#A5D6A7' : '#E0E0E0';
    const bgColor = isCurrent ? `${profile.themeColor}12` : isDone ? '#F1F8E9' : '#FAFAFA';
    const stageLabel = isCurrent ? '<span class="explore-current-badge">현재 단계</span>' : isDone ? '<span class="explore-done-badge">✓ 완료</span>' : '<span class="explore-locked-badge">잠김</span>';

    html += `<div class="explore-stage-card" style="border: 2px solid ${borderColor}; background: ${bgColor};">
      <div class="explore-stage-header">
        <span class="explore-stage-emoji">${item.emoji}</span>
        <div class="explore-stage-info">
          <div class="explore-stage-title">${item.title}</div>
          <div class="explore-stage-weeks">⏰ ${item.weeks}</div>
        </div>
        ${stageLabel}
      </div>
      <div class="explore-parts-list">
        ${item.parts.map(p => `<div class="explore-part-row">
          <span class="explore-part-icon">${p.icon}</span>
          <div><span class="explore-part-name">${p.name}</span><span class="explore-part-desc">${p.desc}</span></div>
        </div>`).join('')}
      </div>
      <div class="explore-tip">💡 ${item.tip}</div>
    </div>`;
  });

  pane.innerHTML = html;
}

function showLifeCycleComplete() {
  const plantKey = appState.selectedPlantKey;
  const profile = plantProfiles[plantKey];
  const cycleInfo = PLANT_LIFE_CYCLE_INFO[plantKey];
  if (!profile || !cycleInfo) return;

  // Calculate growing duration from dailyGrowth records
  const growthDates = Object.keys(appState.dailyGrowth).sort();
  let durationText = '여러 날';
  if (growthDates.length > 0) {
    const firstDate = new Date(growthDates[0]);
    const lastDate = new Date(growthDates[growthDates.length - 1]);
    const totalDays = Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;
    if (weeks > 0 && days > 0) {
      durationText = `약 ${weeks}주 ${days}일`;
    } else if (weeks > 0) {
      durationText = `약 ${weeks}주`;
    } else {
      durationText = `약 ${totalDays}일`;
    }
  }

  // Tally emotions from diary
  const emotionCounts = {};
  appState.diaryList.forEach(d => {
    if (d.moodKey) emotionCounts[d.moodKey] = (emotionCounts[d.moodKey] || 0) + 1;
  });
  const topEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => INSIDE_OUT_EMOTIONS[key])
    .filter(Boolean);
  const emotionStr = topEmotions.length > 0
    ? topEmotions.map(e => `${e.emoji} ${e.label}`).join('  ')
    : '😊 설레임과 함께';

  const modal = document.getElementById('lifecycle-complete-modal');
  if (!modal) return;

  modal.querySelector('#lc-plant-emoji').textContent = ['🌱','🌿','🍃','🌸','🍎','🌾'][5];
  modal.querySelector('#lc-plant-name').textContent = profile.name;
  modal.querySelector('#lc-weeks').textContent = durationText;
  modal.querySelector('#lc-emotions').textContent = emotionStr;
  modal.querySelector('#lc-natural-duration').textContent = cycleInfo.naturalDuration;
  modal.querySelector('#lc-characteristics').textContent = cycleInfo.characteristics;
  modal.querySelector('#lc-uses').textContent = cycleInfo.uses;
  modal.querySelector('#lc-fun-fact').textContent = cycleInfo.funFact;

  const warningList = modal.querySelector('#lc-warnings');
  warningList.innerHTML = cycleInfo.careWarnings.map(w => `<li>${w}</li>`).join('');

  modal.classList.remove('hidden');
}

// 10c. Plant Part Interaction
function initPlantInteraction() {
  const holder = document.getElementById('plant-svg-holder');
  holder.addEventListener('click', (e) => {
    const hit = e.target.closest('.plant-hit-area');
    if (!hit) return;
    showPlantPartInfo(hit.getAttribute('data-part'), appState.selectedPlantKey);
  });
  document.getElementById('plant-info-close').addEventListener('click', () => {
    document.getElementById('plant-info-panel').classList.add('hidden');
  });
  document.getElementById('lc-close-btn')?.addEventListener('click', () => {
    document.getElementById('lifecycle-complete-modal').classList.add('hidden');
  });
}

function showPlantPartInfo(part, plantKey) {
  const info = PLANT_PART_INFO[plantKey]?.[part];
  if (!info) return;
  document.getElementById('plant-info-icon').textContent = info.icon;
  document.getElementById('plant-info-name').textContent = info.name;
  document.getElementById('plant-info-struct').textContent = info.struct;
  document.getElementById('plant-info-func').textContent = info.func;
  const panel = document.getElementById('plant-info-panel');
  panel.classList.remove('hidden');
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
  const emotion = EMOTIONS[moodKey] || EMOTIONS.joy;
  
  const saveBtn = document.getElementById('btn-save-diary');
  const originalBtnText = saveBtn.innerHTML;
  saveBtn.innerHTML = '<i data-lucide="loader" class="spin-icon"></i> AI가 하루 요약 그림을 그리는 중...';
  saveBtn.disabled = true;
  lucide.createIcons();

  let generatedImageUrl = "";
  let teacherComment = "";
  try {
    const prompt = await fetchImagePromptFromGemini(text, emotion.label);
    if (prompt) {
      generatedImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=400&height=300&nologo=true&model=flux-pro&enhance=true`;
    }
  } catch(e) {
    console.error("Failed to generate image prompt", e);
  }

  try {
    saveBtn.innerHTML = '<i data-lucide="loader" class="spin-icon"></i> 선생님의 다정한 코멘트를 기다리는 중...';
    teacherComment = await fetchTeacherCommentFromGemini(text, emotion.label) || "";
  } catch(e) {
    console.error("Failed to fetch teacher comment", e);
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
    userPhotos: uploadedPhotosBase64.slice(),
    teacherComment: teacherComment
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
    showToast(`🌧️ 일기 작성 완료! 비 온 뒤 흙처럼 식물이 쑥쑥 자랐어요 ×2.0 XP 🌱`, 'celebrate');
  } else {
    showToast(`📝 일기 작성 완료! 식물도 함께 성장했어요 🌱`, 'celebrate');
  }
}

async function fetchImagePromptFromGemini(text, mood) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === '__GEMINI_API_KEY__') return null;
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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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

async function fetchTeacherCommentFromGemini(text, mood) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === '__GEMINI_API_KEY__') return null;

  const prompt = `당신은 초등학교의 다정하고 따뜻한 담임 선생님입니다. 학생이 반려 식물을 관찰하고 다음과 같은 일기를 썼습니다.
일기 내용: "${text}"
학생의 오늘 감정: ${mood}

학생의 일기를 읽고, 깊은 공감과 칭찬을 담은 따뜻한 선생님의 코멘트를 1~2문장으로 '해요체(존댓말)'를 사용하여 다정하게 작성해 주세요. JSON 포맷 없이 순수 텍스트로만 대답해 주세요.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  try {
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
  } catch(e) {
    console.error("Teacher comment fetch error:", e);
  }
  return null;
}

// 핵심 로직: 최근 3개 일기의 감정 패턴 → 식물 날씨 분석
//
// [조건] — 감정별 날씨 효과
// ① 슬픔/따분함/불안이 2개 이상 → rainy  (성장 x2 보너스!)
// ② 기쁨이 2개 이상             → sunny
// ③ 화남/두려움이 2개 이상       → windy
// ④ 그 외                        → 현재 날씨 유지
function analyzeEmotionWeather() {
  const recent = appState.diaryList.slice(0, 3); // 최근 3개
  if (recent.length === 0) return;

  const rainCount  = recent.filter(e => EMOTIONS[e.moodKey]?.causeRain).length;
  const sunnyCount = recent.filter(e => EMOTIONS[e.moodKey]?.causeSunny).length;
  const windCount  = recent.filter(e => EMOTIONS[e.moodKey]?.causeWind).length;

  let newWeather = appState.weather;

  if      (rainCount  >= 2) newWeather = 'rainy';
  else if (sunnyCount >= 2) newWeather = 'sunny';
  else if (windCount  >= 2) newWeather = 'windy';

  if (newWeather !== appState.weather) {
    appState.weather = newWeather;
    triggerWeatherEffect();

    const msgs = {
      rainy: '🌧️ 감정들이 모여 비가 내려요. 슬픈 마음도 식물의 양분이 돼요 🌱',
      sunny: '☀️ 기쁜 하루들이 모여 해가 떠올랐어요! 식물도 활짝 웃어요',
      windy: '💨 강렬한 감정들이 맞닿아 바람이 불어요!',
    };
    if (msgs[newWeather]) showToast(msgs[newWeather]);
    
    appState.emotionMissionCompleted = false;
  }
  updateEmotionMissionUI();
}

function updateEmotionMissionUI() {
  const alertBox = document.getElementById('emotion-mission-alert');
  const alertText = document.getElementById('emotion-mission-text');
  if (!alertBox || !alertText) return;

  if (appState.emotionMissionCompleted) {
    alertBox.classList.add('hidden');
    return;
  }

  alertBox.classList.remove('hidden');
  if (appState.weather === 'rainy') {
    alertText.innerHTML = "마음에 비가 내리는 날엔 따뜻한 위로가 필요해요. 식물에게 <strong>[햇빛 쬐기]</strong>를 선물해 줄까요?";
  } else if (appState.weather === 'windy') {
    alertText.innerHTML = "마음에 거센 바람이 불고 있군요! 깊은 심호흡으로 마음을 환기하듯, 식물에게 <strong>[환기 하기]</strong> 버튼을 눌러주세요.";
  } else if (appState.weather === 'sunny') {
    alertText.innerHTML = "행복한 에너지가 가득하네요! 이 에너지를 나누어 식물에게 <strong>[비료 주기]</strong>를 해보세요.";
  } else {
    alertBox.classList.add('hidden');
  }
}

function checkEmotionCareMission(action) {
  if (appState.emotionMissionCompleted) return;

  let isMatch = false;
  let message = "";

  if (appState.weather === 'rainy' && action === '햇빛 쬐기') {
    isMatch = true;
    message = "💖 마음에 비가 올 때 따뜻한 햇빛을 쬐어주셨군요! 기분이 한결 나아지고 식물도 쑥쑥 자라납니다. (보너스 XP +10)";
  } else if (appState.weather === 'windy' && action === '환기 하기') {
    isMatch = true;
    message = "💖 마음에 거센 바람이 불 때, 창문을 열어 환기해 주셨군요! 마음이 차분해지고 식물도 상쾌해합니다. (보너스 XP +10)";
  } else if (appState.weather === 'sunny' && action === '비료 주기') {
    isMatch = true;
    message = "💖 행복한 햇살 아래서 비료를 주셨군요! 기쁨의 에너지가 식물에게 듬뿍 전해졌어요. (보너스 XP +10)";
  }

  if (isMatch) {
    appState.emotionMissionCompleted = true;
    appState.growthXP = Math.min(100, appState.growthXP + 10);
    showToast(message, 'celebrate');
    updateEmotionMissionUI();
    
    // Check level up from bonus
    if (appState.growthXP >= 100 && appState.growthStage < 6) {
      appState.growthStage++;
      appState.growthXP = 0;
      triggerStageLevelUp();
    }
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

    let commentHtml = '';
    if (diary.teacherComment) {
      commentHtml = `
        <div style="margin-top: 15px; padding: 12px; background: rgba(74, 144, 226, 0.05); border-left: 3px solid #4A90D9; border-radius: 4px;">
          <div style="font-weight: bold; color: #4A90D9; margin-bottom: 5px; font-size: 0.9rem; display: flex; align-items: center; gap: 4px;">
            <i data-lucide="message-square" style="width:14px; height:14px;"></i> 선생님의 코멘트
          </div>
          <p style="margin: 0; font-size: 0.95rem; color: #333; line-height: 1.5; font-family: 'GangwonEdu_OTFBoldA', sans-serif;">${escapeHTML(diary.teacherComment)}</p>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="diary-card-header">
        <span class="diary-date"><i data-lucide="calendar" class="icon-small"></i> ${diary.date}</span>
        <span class="diary-mood-chip" style="background:${bgColor}22; color:${bgColor}; border:1px solid ${bgColor}55">${diary.mood}</span>
      </div>
      ${mediaHtml}
      <p class="diary-body">${escapeHTML(diary.content)}</p>
      ${commentHtml}
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

    // Day/Night Update
    const hour = now.getHours();
    const isDay = (hour >= 6 && hour < 18);
    
    const gardenView = document.getElementById('garden-view-port');
    if (gardenView) {
      if (isDay) {
        gardenView.classList.add('theme-day');
        gardenView.classList.remove('theme-night');
      } else {
        gardenView.classList.add('theme-night');
        gardenView.classList.remove('theme-day');
      }
    }
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
    startClock(); // 즉각적인 시간(낮/밤) 테마 적용
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
    showToast(`🌍 ${locationName} ${wmo.emoji} ${wmo.text}, ${realWeatherData.temperature}°C — ${advice}`);

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

  // Randomize name placeholder so it feels like real kids
  const sampleNames = ['김초롱', '박한별', '이새싹', '최푸름', '정하늘', '윤초록', '한빛나', '오나무', '류솔잎', '신꽃님'];
  const pick = sampleNames[Math.floor(Math.random() * sampleNames.length)];
  document.getElementById('input-name').placeholder = `예: ${pick}`;
  
  // Event: Start Test
  document.getElementById('btn-start-test').addEventListener('click', () => {
    const nameInput = document.getElementById('input-name');
    const name = nameInput.value.trim();
    if (!name) {
      alert("이름을 입력해주세요!");
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
    initPlantInteraction();
    renderPlantExplorer();
    renderDiaries();
    
    const envNames = { window: "창가", balcony: "베란다", room: "방 안", outdoor: "야외 정원" };
    addBotMessage(`🌱 안녕하세요, ${appState.userName} 정원사님! 드디어 제가 자랄 [${envNames[appState.environment]}] 흙 속에 자리를 잡았어요. 물, 햇빛, 흙, 바람 게이지를 조절하여 제가 튼튼하게 자랄 수 있게 도와주세요!`);
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
        quizSeenIndices: [],
        quizCurrentIdx: null,
        quizCorrectCount: 0,
        badges: [],
        isSimulating: false,
        simulationIntervalId: null,
        dailyGrowth: {},
        currentCalendarDate: new Date(),
        lastDangerState: {}
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
      showToast("⏩ 다음 단계로 건너뛰었어요!");
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
      } else if (tabName === 'explore') {
        renderPlantExplorer();
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
      
      const color = btn.getAttribute('data-color');
      if (color) {
        const editor = document.querySelector('.diary-editor');
        if (editor) {
          // 일기장의 배경색과 테두리를 감정에 맞게 은은하게 변경
          editor.style.backgroundColor = `color-mix(in srgb, ${color} 8%, rgba(255, 255, 255, 0.75))`;
          editor.style.borderColor = `color-mix(in srgb, ${color} 20%, rgba(255, 255, 255, 0.4))`;
        }
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
            
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
            
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
      
      if (lastDiary.color) {
        // 감정 달력 해당 칸을 감정에 맞는 은은한 색으로 칠함
        dayDiv.style.backgroundColor = `color-mix(in srgb, ${lastDiary.color} 15%, white)`;
        dayDiv.style.borderColor = `color-mix(in srgb, ${lastDiary.color} 30%, rgba(0,0,0,0.05))`;
      }
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

  // Emotion Report Bindings
  const btnEmotionReport = document.getElementById('btn-emotion-report');
  const erModal = document.getElementById('emotion-report-modal');
  const erClose = document.getElementById('er-close-btn');
  const erOk = document.getElementById('er-ok-btn');

  if (btnEmotionReport) {
    btnEmotionReport.addEventListener('click', () => {
      generateEmotionReport();
    });
  }

  const closeERModal = () => {
    if (erModal) erModal.classList.add('hidden');
  };

  if (erClose) erClose.addEventListener('click', closeERModal);
  if (erOk) erOk.addEventListener('click', closeERModal);
});

// ----------------------------------------------------
// Emotion Calendar Report Generation
// ----------------------------------------------------
async function generateEmotionReport() {
  const modal = document.getElementById('emotion-report-modal');
  const content = document.getElementById('er-content');
  const loading = document.getElementById('er-loading');
  const title = document.getElementById('er-month-title');
  
  if (!modal || !content || !loading || !title) return;

  modal.classList.remove('hidden');
  content.style.display = 'none';
  loading.style.display = 'flex';
  
  const currentMonth = appState.currentCalendarDate.getMonth();
  const currentYear = appState.currentCalendarDate.getFullYear();
  title.innerText = `${currentYear}년 ${currentMonth + 1}월`;

  // Collect this month's diaries
  const monthlyDiaries = appState.diaryList.filter(d => {
    const dDate = new Date(d.date);
    return dDate.getMonth() === currentMonth && dDate.getFullYear() === currentYear;
  });

  if (monthlyDiaries.length === 0) {
    loading.style.display = 'none';
    content.style.display = 'block';
    content.innerHTML = "<p>이번 달에는 아직 작성된 일기가 없어요. 나의 감정을 들려주면 식물이 더 기뻐할 거예요!</p>";
    return;
  }

  // Count emotions
  let emotionCounts = {};
  monthlyDiaries.forEach(d => {
    // d.mood format is usually "emoji label" e.g., "😄 기쁨이"
    const moodName = d.mood.split(' ')[1] || d.mood;
    emotionCounts[moodName] = (emotionCounts[moodName] || 0) + 1;
  });
  
  const emotionSummary = Object.entries(emotionCounts).map(([mood, count]) => `${mood} ${count}번`).join(', ');

  const prompt = `당신은 초등학교 다정하고 따뜻한 담임 선생님입니다. 학생이 반려 식물(현재 ${appState.growthStage}단계)을 기르면서 작성한 한 달치 감정 일기 통계를 바탕으로 다정하고 따뜻한 회고 보고서를 작성해 주세요.
  
이번 달 학생의 감정 통계: ${emotionSummary}
총 작성한 일기 수: ${monthlyDiaries.length}개

요구사항:
1. 학생이 다양한 감정을 느꼈음을 인정하고 공감해 주세요.
2. 비(슬픔/우울/불안)나 바람(화/두려움) 같은 감정의 날씨도 식물이 튼튼하게 자라는데 큰 도움이 되었다는 점을 꼭 칭찬해 주세요. (실제로 비가 올 때 식물이 물을 듬뿍 마셔서 경험치를 2배로 얻었습니다)
3. 햇빛(기쁨/행복)이 식물을 미소 짓게 했다는 점도 언급해 주세요.
4. 초등학생 6학년이 읽기 좋게 다정하고 부드러운 '해요체(존댓말)'로 작성해 주세요.
5. 3~4문단 정도로 구성하고, 마크다운(HTML)을 약간 섞어서 보기 좋게 작성해 주세요. (예: <strong>강조</strong>, <br> 등)
6. 반드시 선생님이 학생에게 편지를 쓰는 듯한 어조로 작성하세요.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 400 }
      })
    });
    
    if (!response.ok) throw new Error("API Request Failed");
    const data = await response.json();
    let reportHtml = "보고서를 불러올 수 없어요.";
    if (data.candidates && data.candidates.length > 0) {
      reportHtml = data.candidates[0].content.parts[0].text;
    }

    // Convert markdown bold to HTML and newlines to <br>
    reportHtml = reportHtml.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
    reportHtml = reportHtml.replace(/\\n/g, '<br>');

    content.innerHTML = reportHtml;
  } catch (err) {
    console.error(err);
    content.innerHTML = "<p>앗, 선생님이 바쁘셔서 보고서를 작성하지 못했어요. 잠시 후 다시 시도해 주세요!</p>";
  } finally {
    loading.style.display = 'none';
    content.style.display = 'block';
  }
}

