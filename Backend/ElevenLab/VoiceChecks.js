// elevenlabs.js
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import fs from "fs";

// Initialize ElevenLabs client
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY, // set your API key in .env
});

/**
 * Convert Text to Speech
 * @param {string} text - The text you want to convert
 * @param {string} outputFile - Path to save the generated audio file
 */
const textToSpeech = async (text, outputFile = "output.mp3") => {
  try {
    const audio = await elevenlabs.textToSpeech.convert("4BoDaQ6aygOP6fpsUmJe", {
      text,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.7,
      },
    });

    const fileStream = fs.createWriteStream(outputFile);
    for await (const chunk of audio) {
      fileStream.write(chunk);
    }
    fileStream.end();
    console.log(`✅ Audio saved to ${outputFile}`);
  } catch (error) {
    console.error("❌ Error in TTS:", error);
  }
};

/**
 * Convert Speech to Text
 * @param {string} audioFile - Path to audio file (mp3, wav, etc.)
 */
const speechToText = async (audioFile) => {
  try {
    const response = await elevenlabs.speechToText.transcribe({
      file: fs.createReadStream(audioFile),
      model_id: "eleven_monolingual_v1", // or "eleven_multilingual_v1"
    });

    console.log("✅ Transcription:", response.text);
    return response.text;
  } catch (error) {
    console.error("❌ Error in STT:", error);
  }
};

// ✅ Export functions
export { textToSpeech, speechToText };
