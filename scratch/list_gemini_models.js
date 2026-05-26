const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = "AIzaSyCY9hI4SCMfhmhvlsqI35kGDvBgmAOczgA";
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  console.log("Listing models...");
  try {
    // In @google/generative-ai, listing models is not directly on genAI, but we can do a direct fetch to the Google API using the key
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log("Models list response:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.log("Error listing models:", e.message);
  }
}

run();
