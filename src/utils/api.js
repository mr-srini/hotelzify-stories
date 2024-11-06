// Base configuration for API calls
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || "https://api.hotelzify.com",
  //   BASE_URL: " ",
  AUTH_TOKEN:
    process.env.REACT_APP_AUTH_TOKEN ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM1OTgsInJvbGUiOjQsInJvbGVzIjoiQURNSU4iLCJob3RlbElkcyI6WzMyNjcsMzQ5MCw0MTIxLDQ1MDgsNDUwOSw0NTEwLDQ2MDYsNDYwNyw0NjA5LDQ2MTAsNDYxMSw0NjEyLDQ2MTMsNDYxNSw0NjE2LDQ2MTcsNDYxOCw0NjE5LDQ2MjAsNDYyMiw0NjIzLDQ2ODAsNTEwMyw1MTUxLDUxNTIsNTE1Myw1MTU0LDUxNTYsNTE1Nyw1MTU4LDUxNTksNTE2MCw1MTYzLDUxNjQsNTE2NSw1MTY2LDUxNjgsNTE2OSw1MTcwLDUxNzEsNTE3Miw1MTczLDUxNzYsNTE3Nyw1MTc5LDUxODAsNTc5Miw1NzkzLDU3OTQsNTc5Niw2MDUxLDYxNzEsNjM5Nyw3ODIzLDc4NTcsNzg1OCw3ODU5LDc4NjAsNzg2MSw3ODYyLDc4NjMsNzg2NCw3ODY1LDc4NjYsNzg2Nyw3ODY4LDc4NjksNzg3MCw3ODcxLDc4NzIsNzg3Myw3ODc1LDc4NzYsNzg3Nyw3ODc4LDc4NzksNzg4MCw3ODgxLDc4ODIsNzg4Myw3ODg0LDgwMDEsODAwMiw4MDAzLDgwMDQsODAwNSw4MDA2LDgwMDcsODAwOCw4MDA5LDgwMTEsODAxNCw4MDE1LDgwMTgsODAxOSw4MDIwLDgwMjEsODAyMiw4MDIzLDgwMjUsODAyNiw4MDI3LDkwNTksOTA2MCw5MDYyLDkwNjMsOTA2NCw5MDY1LDkwNjYsOTA3Myw5MDc2LDkwNzcsOTA3OCw5MDc5LDkwODAsOTA4Nyw5MDg5LDkwOTAsMjI5NiwxMjQ3NSwxNDczOCwxNzA4NywxNzA4OCwxNzA4OSwxNzA5MCwxNzUxNiwxNzUxNywxNzUxOCwxNzUxOSwxNzUyMCwxNzUyMSwxNzUyMiwxNzUyMywxNzUyNCwxNzUyOCwxNzUyOSwxNzUzMCwxNzUzNSwxNzUzNiwxNzUzNywxNzUzOSwxNzU0MCwxNzU0MSwxNzU0MywxNzU0NiwxNzU0NywxNzU0OCwxNzU0OSwxNzU1MCwxNzU1MSwxNzU1MiwxNzU1MywxNzU1NCwxNzU1NSwxNzU1NiwyMzUxNSwyMzUxNl0sImlhdCI6MTczMDY5ODgwMSwiZXhwIjoyMzM1NDk4ODAxfQ.iC70JvQOfVg5JNybkjc4J47M8uXCmG5zIVG_m4hgvRM",
  ENDPOINTS: {
    CHAT: "/hotel/authorised/v1/chatbot-widget/messages",
    CONVERSATION: "/hotel/authorised/v1/chatbot-widget/conversation",
  },
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
};

/**
 * Creates API request headers with authentication
 * @returns {Object} Headers object
 */
const createHeaders = () => ({
  ...API_CONFIG.DEFAULT_HEADERS,
  Authorization: `Bearer ${API_CONFIG.AUTH_TOKEN}`,
});

/**
 * Handles API errors and provides consistent error formatting
 * @param {Error} error - The caught error
 * @param {string} context - Context where the error occurred
 * @returns {Object} Formatted error object
 */
const handleApiError = (error, context) => {
  const errorResponse = {
    message: error.message || "An unexpected error occurred",
    context,
    timestamp: new Date().toISOString(),
    status: error.status || 500,
  };

  if (error.response) {
    errorResponse.status = error.response.status;
    errorResponse.data = error.response.data;
  }

  console.error(`API Error [${context}]:`, errorResponse);
  return Promise.reject(errorResponse);
};

/**
 * Validates API configuration
 * @returns {boolean} Configuration validity status
 */
const validateApiConfig = () => {
  if (!API_CONFIG.AUTH_TOKEN) {
    console.error("API Error: Authentication token is missing");
    return false;
  }
  if (!API_CONFIG.BASE_URL) {
    console.error("API Error: Base URL is missing");
    return false;
  }
  return true;
};

/**
 * Fetches conversation messages
 * @param {string} conversationId - ID of the conversation
 * @param {Object} options - Additional options for the request
 * @returns {Promise<Object>} Conversation data
 */
export const fetchConversationData = async (conversationId, options = {}) => {
  if (!validateApiConfig()) {
    return handleApiError(
      new Error("Invalid API configuration"),
      "fetchConversationData"
    );
  }

  const { pageSize = 50, page = 1, sortOrder = "asc" } = options;

  try {
    const queryParams = new URLSearchParams({
      conversationId,
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT}?${queryParams}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      throw {
        status: response.status,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();

    // Sort messages if needed
    if (data.data && Array.isArray(data.data)) {
      data.data.sort((a, b) => {
        const comparison = new Date(a.timestamp) - new Date(b.timestamp);
        return sortOrder === "desc" ? -comparison : comparison;
      });
    }

    return data;
  } catch (error) {
    return handleApiError(error, "fetchConversationData");
  }
};

/**
 * Fetches conversation details
 * @param {string} conversationId - ID of the conversation
 * @returns {Promise<Object>} Conversation metadata
 */
export const fetchConversationDetails = async (conversationId) => {
  if (!validateApiConfig()) {
    return handleApiError(
      new Error("Invalid API configuration"),
      "fetchConversationDetails"
    );
  }

  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONVERSATION}/${conversationId}`,
      {
        method: "GET",
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      throw {
        status: response.status,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error, "fetchConversationDetails");
  }
};

/**
 * Handles API rate limiting
 * @type {Object}
 */
const RateLimiter = {
  requests: new Map(),
  limit: 10, // requests
  window: 60000, // milliseconds (1 minute)

  canMakeRequest(key) {
    const now = Date.now();
    const windowStart = now - this.window;

    // Clear old requests
    this.requests.forEach((timestamp, reqKey) => {
      if (timestamp < windowStart) this.requests.delete(reqKey);
    });

    // Count requests in current window
    let requestCount = 0;
    this.requests.forEach((timestamp) => {
      if (timestamp > windowStart) requestCount++;
    });

    return requestCount < this.limit;
  },

  logRequest(key) {
    this.requests.set(key, Date.now());
  },
};

/**
 * Makes a rate-limited API call
 * @param {Function} apiCall - The API call to make
 * @param {string} key - Unique key for rate limiting
 * @param {...any} args - Arguments for the API call
 * @returns {Promise<any>} API response
 */
export const makeRateLimitedRequest = async (apiCall, key, ...args) => {
  if (!RateLimiter.canMakeRequest(key)) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }

  try {
    const result = await apiCall(...args);
    RateLimiter.logRequest(key);
    return result;
  } catch (error) {
    throw error;
  }
};

// Utility function to format the API response
export const formatApiResponse = (response) => {
  if (!response?.data) return null;

  return {
    messages: response.data,
    metadata: {
      totalCount: response.data.length,
      timestamp: new Date().toISOString(),
    },
  };
};

export default {
  fetchConversationData,
  fetchConversationDetails,
  makeRateLimitedRequest,
  formatApiResponse,
};
