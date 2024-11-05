const CLAUDE_API_KEY = process.env.REACT_APP_CLAUDE_API_KEY;

export const analyzeConversation = async (messages) => {
  try {
    const prompt = `
          Analyze this hotel booking conversation and provide:
          1. Key success metrics
          2. Sales approach characteristics
          3. Response quality assessment
          4. Customer service evaluation
          5. Booking outcome analysis
    
          Conversation:
          ${JSON.stringify(messages, null, 2)}
    
          Format the response as JSON with the following structure:
          {
            "metrics": [
              {
                "title": "string",
                "points": ["string"]
              }
            ],
            "salesApproach": ["string"],
            "responseQuality": ["string"],
            "customerService": ["string"],
            "bookingOutcome": {
              "status": "string",
              "type": "string",
              "quality": "string"
            }
          }
        `;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-2",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();
    return JSON.parse(data.content[0].text);
  } catch (error) {
    console.error("Claude Analysis Error:", error);
    return null;
  }
};
