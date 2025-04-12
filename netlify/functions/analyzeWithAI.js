// functions/analyzeWithAI.js
exports.handler = async function(event, context) {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API key not configured.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key not configured." }),
    };
  }

  let prompt;
  try {
    const body = JSON.parse(event.body || "{}");
    prompt = body.prompt;
  } catch (error) {
    console.error("Error parsing request body:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON in request body." }),
    };
  }

  if (!prompt) {
    console.error("Prompt is required.");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Prompt is required." }),
    };
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-zero:free",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from OpenRouter:", errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorData.error || "Unknown error" }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Fetch failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data from OpenRouter." }),
    };
  }
};