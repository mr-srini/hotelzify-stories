import React from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { Bot } from "lucide-react";
import useConversation from "./hooks/useConversation";
import MetricsCard from "./components/MetricsCard";
import ConversationThread from "./components/ConversationThread";
import AnalysisCard from "./components/AnalysisCard";
import BookingCard from "./components/BookingCard";

// Conversation Analysis Component
const ConversationAnalysis = () => {
  const { conversationId } = useParams();
  const { conversation, loading, error, metrics } =
    useConversation(conversationId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-3">
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {conversation && (
          <div className="space-y-8">
            {/* {metrics && <MetricsCard metrics={metrics} />} */}

            {metrics && conversation && (
              <AnalysisCard messages={conversation.data} metrics={metrics} />
            )}
            <ConversationThread
              messages={conversation.data}
              hotelName={conversation.data[0]?.hotel?.name}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ExternalRedirect = () => {
  React.useEffect(() => {
    window.location.href = "https://hotelzify.com";
  }, []);

  return null;
};

// Main App Component
const App = () => {
  return (
    <Routes>
      {/* Redirect root to hotelzify.com */}
      <Route path="/" element={<ExternalRedirect />} />

      {/* Conversation analysis route */}
      <Route path="/:conversationId" element={<ConversationAnalysis />} />
    </Routes>
  );
};

export default App;
