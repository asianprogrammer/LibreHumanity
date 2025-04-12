// analyzeWithAI.js
exports.handler = async (event, context) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

  try {
    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt) throw new Error("Prompt required");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-instruct", // Faster model
        messages: [{
          role: "system",
          content: "Respond ONLY with valid JSON matching the provided schema"
        }, {
          role: "user", 
          content: prompt
        }],
        temperature: 0.3,
        max_tokens: 1200
      })
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return { statusCode: 200, body: await response.text() };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: error.name === 'AbortError' ? 408 : 500,
      body: JSON.stringify({
        error: error.message,
        fallback: {
          report_meta: {
            title: "Conflict Analysis Report",
            source: "System Generated",
            period: "2023-2024",
            last_updated: new Date().toISOString().split('T')[0]
          },
          // ... rest of fallback structure
        }
      })
    };
  }
};