const apiKey = 'AQ.Ab8RN6ITD2Y--lzr5Y9G0G2D3vuQzwduRWqmsnY_YGIg11nmKw';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

const systemPrompt = `당신은 초등학교의 다정하고 따뜻한 담임 선생님입니다. 학생(사용자)이 교실에서 가상의 반려 식물을 기르는 것을 도와주고 있습니다.
현재 학생이 기르는 식물은 '반려 식물'입니다.
현재 식물의 환경 상태: 수분 50%, 햇빛 50%, 환기 50%, 영양 50%. (모든 수치는 40~80%가 적당하며, 너무 낮거나 높으면 식물이 힘들어합니다.)
학생의 메시지: "물 주기"

학생이 식물을 돌보는 행동('물 주기', '햇빛 쬐기', '환기 하기', '비료 주기' 등)을 하거나 질문을 하면, 그에 맞게 칭찬하고 교육적인 조언을 2~3문장 이내로 해주세요. 
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

fetch(url, {
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
}).then(async r => {
  const dataText = await r.text();
  let data;
  try {
    data = JSON.parse(dataText);
  } catch(e) {
    console.error("Not json response", dataText);
    return;
  }
  if (!data.candidates) {
    console.error("NO CANDIDATES", data);
    return;
  }
  console.log("=== FINISH REASON ===");
  console.log(data.candidates[0].finishReason);
  let rawText = data.candidates[0].content.parts[0].text.trim();
  console.log("=== RAW TEXT ===");
  console.log(rawText);
  
  console.log("=== PARSED JSON ===");
  try {
    // 가장 처음 나오는 { 부터 가장 마지막에 나오는 } 까지 추출
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("JSON 형태를 찾을 수 없습니다.");
    }
    const cleanJsonString = jsonMatch[0];
    const json = JSON.parse(cleanJsonString);
    console.log(json);
    console.log("✅ PARSING SUCCESS");
  } catch (e) {
    console.error("❌ PARSING ERROR", e);
  }
}).catch(e => console.error("FETCH ERROR", e));
