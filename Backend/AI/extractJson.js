function extractJSON(text) {
  try {
    // Match the first JSON block between `{ ... }`
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("No JSON found in the text");
    }

    // Parse the extracted JSON
    return JSON.parse(match[0]);
  } catch (err) {
    console.error("Failed to extract JSON:", err.message);
    return null;
  }
}

module.exports = extractJSON;
