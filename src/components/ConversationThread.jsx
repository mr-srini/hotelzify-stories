import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Bot, User, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

import SuccessMetrics from "../components/SuccessMetrics";
import BookingCard from "./BookingCard";

const ConversationThread = ({ messages, hotelName }) => {
  if (!messages?.length) return null;

  const MessageAvatar = ({ role }) => (
    <div
      className={`rounded-full p-2 ${
        role === "AI" ? "bg-blue-100" : "bg-gray-100"
      }`}
    >
      {role === "AI" ? (
        <Bot className="text-blue-500" size={24} />
      ) : (
        <User className="text-gray-500" size={24} />
      )}
    </div>
  );

  const MessageTime = ({ timestamp }) => (
    <div className="flex items-center gap-1 text-gray-500 text-sm">
      <Clock size={14} />
      {format(new Date(timestamp), "h:mm a")}
    </div>
  );

  const FunctionCallBadge = ({ name }) => (
    <div className="inline-flex items-center px-2 py-1 mt-1 rounded-full text-xs bg-purple-100 text-purple-700">
      <span className="mr-1">🔧</span>
      {name}
    </div>
  );

  const MessageBubble = ({ message }) => {
    const isAI = message.role === "AI";
    const hasError = message.error;
    const hasFunctionCall = message.function_call;

    return (
      <div
        className={`bg-white rounded-lg shadow p-4 ${
          isAI ? "border-l-2 border-grey-500" : ""
        }`}
      >
        <div className="flex items-start space-x-3">
          <MessageAvatar role={message.role} />

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <span className="font-bold text-gray-900">
                  {isAI
                    ? hotelName || "AI Assistant"
                    : message.role === "Owner"
                    ? "Human Agent"
                    : "Guest"}
                </span>
                {isAI && (
                  <CheckCircle className="text-blue-500 ml-2" size={16} />
                )}
              </div>
              <MessageTime timestamp={message.timestamp} />
            </div>

            {/* Message Content */}
            <div className="text-gray-800 whitespace-pre-wrap break-words">
              {message.message}
            </div>

            {/* Function Call Badge */}
            {hasFunctionCall && (
              <FunctionCallBadge
                name={message.function_call.name?.toUpperCase()}
              />
            )}

            {/* Error Display */}
            {/* {hasError && (
              <div className="mt-2 text-red-600 text-sm flex items-center">
                <AlertTriangle size={14} className="mr-1" />
                {message.error}
              </div>
            )} */}

            {/* Additional Info */}
            {isAI && (
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center text-gray-500 text-xs">
                  <Clock className="mr-1" size={12} />
                  <span>Quick response</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Function Call Details (if exists) */}
        {hasFunctionCall && (
          <div className="">
            {/* <div className="mt-3 ml-12 p-3 bg-gray-50 rounded-lg text-sm">
              <div className="font-medium text-gray-700 mb-1">
                Function Output:
              </div>
              <pre className="text-gray-600 overflow-x-auto">
                {JSON.stringify(message.function_call.output, null, 2)}
              </pre>
            </div> */}
            {message.function_call.name === "booking" && (
              <BookingCard booking={message.function_call.output} />
            )}
          </div>
        )}
      </div>
    );
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = format(new Date(message.timestamp), "MMMM d, yyyy");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div>
      {/* {analysis && <SuccessMetrics analysis={analysis} />} */}
      <div className="space-y-6">
        {Object.entries(messageGroups).map(([date, messages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gray-200 h-px flex-grow"></div>
              <div className="px-4 text-sm font-medium text-gray-500">
                {date}
              </div>
              <div className="bg-gray-200 h-px flex-grow"></div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-4">
              {messages.map((message, index) => (
                <MessageBubble key={message._id || index} message={message} />
              ))}
            </div>
          </div>
        ))}

        {/* Quick Scroll Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

ConversationThread.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      role: PropTypes.oneOf(["AI", "user"]).isRequired,
      message: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      function_call: PropTypes.shape({
        name: PropTypes.string.isRequired,
        arguments: PropTypes.object,
        output: PropTypes.any,
      }),
      error: PropTypes.string,
    })
  ),
  hotelName: PropTypes.string,
};

ConversationThread.defaultProps = {
  messages: [],
  hotelName: "AI Assistant",
};

export default ConversationThread;
