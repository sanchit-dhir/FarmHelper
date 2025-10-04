const { textToSpeech } = require('../ElevenLab/VoiceChecks');
const CallGeminiWithTxt = require("../AI/CallGemini");
const extractJSON = require("../AI/extractJson");
const makeSoilFertilizerPrompt = require("../AI/soilFertilizerPrompt");


const soil = async (req, res) => {
  try {
    const { locality, cropType, growthStage, soilType, message } = req.body || {};

    if (!locality || !cropType || !growthStage || !soilType || !message) {
      res.status(400).json({ message: "Enter all Fields" });
    }

    const prompt = makeSoilFertilizerPrompt(locality, cropType, growthStage, soilType, message);
    const responseTxt = await CallGeminiWithTxt(prompt);
    const responseJson = await extractJSON(responseTxt);
    await textToSpeech(responseJson.speech_index, 'public/output.mp3');
    res.status(200).json({ message: "Success!", data: responseJson, audio: 'http://localhost:3000/output.mp3' });
  } catch (error) {
    console.log(error);
  }
}



module.exports = {
  soil
}