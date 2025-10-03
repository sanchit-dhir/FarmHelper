const { GoogleGenAI } = require('@google/genai');


async function CallGeminiWithTxt(prompt) {
  const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
}

module.exports = CallGeminiWithTxt;