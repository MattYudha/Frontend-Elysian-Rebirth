const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = "AIzaSyCY9hI4SCMfhmhvlsqI35kGDvBgmAOczgA";
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
    try {
        console.log(`Testing model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        console.log(`Success with ${modelName}! Response: ${result.response.text().trim()}`);
        return true;
    } catch (e) {
        console.log(`Failed for ${modelName}: ${e.message}`);
        return false;
    }
}

async function run() {
    const models = [
        'gemini-1.5-flash',
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-pro',
        'gemini-1.0-pro',
        'gemini-1.5-pro'
    ];
    for (const m of models) {
        const ok = await testModel(m);
        if (ok) {
            console.log(`FOUND WORKING MODEL: ${m}`);
        }
    }
}

run();
