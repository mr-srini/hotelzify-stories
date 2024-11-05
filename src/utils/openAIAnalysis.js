const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
      }),
    });

    const data = await response.json();

    console.log("data: ", data)

    return JSON.parse(data.content[0].text);
  } catch (error) {
    console.error("OPENAI Analysis Error:", error);
    return null;
  }
};
