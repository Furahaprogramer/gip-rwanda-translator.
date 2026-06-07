export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text } = req.body;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key setup missing on server.' });
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                system: "You are an expert English and Kinyarwanda translator. Translate the text accurately. Return ONLY the final translated text response with no conversational filler.",
                messages: [{ role: 'user', content: `Translate this text: ${text}` }]
            })
        });

        const data = await response.json();
        const translation = data.content[0].text;
        return res.status(200).json({ translation });
    } catch (error) {
        return res.status(500).json({ error: 'Failed executing translation backend.' });
    }
}
