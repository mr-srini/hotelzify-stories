// Simplified version of useConversation.js
import { useState, useEffect } from "react";
import { fetchConversationData } from "../utils/api";
import { analyzeConversation } from "../utils/openAIAnalysis";

const useConversation = (conversationId) => {
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (!conversationId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await fetchConversationData(conversationId);

        setConversation(data);

        // Calculate metrics here
        setMetrics({
          responseTime: "2.5s",
          totalMessages: data.data.length,
          automationRate: "100%",
          category: "Booking",
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [conversationId]);

  return { conversation, loading, error, metrics };
};

export default useConversation;
