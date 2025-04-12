async function analyzeWithAI(prompt) {
  try {
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch('/.netlify/functions/your-function-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from API (${response.status}):`, errorText);
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in analyzeWithAI:", error.message);
    // Implement retry logic or fallback behavior here
    
    // For now, return a placeholder result so your app doesn't crash
    return { error: error.message, fallback: true };
  }
}