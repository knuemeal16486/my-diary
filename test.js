const apiKey = 'AQ.Ab8RN6ITD2Y--lzr5Y9G0G2D3vuQzwduRWqmsnY_YGIg11nmKw';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{
      parts: [{ text: 'Hello' }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 200
    }
  })
}).then(async r => {
  console.log(r.status);
  console.log(await r.text());
}).catch(e => console.error(e));
