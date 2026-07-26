const apiKey = 'sk-amZ67dWiYAhfKzaUPqyvSHMix91qQ6rBwzTLiwcvXUUmlRCbXkcCTBs6NQxgMgnj';
const endpoints = [
    'https://ai-litellm-app.dev.ciptadusa.com/v1/chat/completions',
    'https://api.opencode.ai/v1/chat/completions',
    'https://openrouter.ai/api/v1/chat/completions'
];

async function testEndpoint(url) {
    console.log(`\nTesting URL: ${url}`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'kr/deepseek-3.2',
                messages: [{ role: 'user', content: 'Tes koneksi AI, tolong jawab singkat OK' }]
            })
        });

        console.log(`HTTP Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log(`Response Body: ${text.substring(0, 300)}`);
    } catch (err) {
        console.error(`Fetch Error: ${err.message}`);
    }
}

async function run() {
    for (const url of endpoints) {
        await testEndpoint(url);
    }
}

run();
