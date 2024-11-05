/**
 * Utility functions for calculating conversation metrics
 */

/**
 * Calculate average response time between user messages and AI responses
 * @param {Array} messages - Array of conversation messages
 * @returns {number} Average response time in seconds
 */
const calculateAverageResponseTime = (messages) => {
    let totalTime = 0;
    let responsePairs = 0;
  
    for (let i = 0; i < messages.length - 1; i++) {
      const currentMsg = messages[i];
      const nextMsg = messages[i + 1];
  
      if (currentMsg.role === 'user' && nextMsg.role === 'AI') {
        const responseTime = new Date(nextMsg.timestamp) - new Date(currentMsg.timestamp);
        totalTime += responseTime;
        responsePairs++;
      }
    }
  
    return responsePairs > 0 
      ? (totalTime / (responsePairs * 1000)).toFixed(2) 
      : 0;
  };
  
  /**
   * Calculate automation rate based on AI responses and function calls
   * @param {Array} messages - Array of conversation messages
   * @returns {string} Automation rate as percentage
   */
  const calculateAutomationRate = (messages) => {
    const totalMessages = messages.length;
    const aiMessages = messages.filter(msg => msg.role === 'AI').length;
    const automationRate = (aiMessages / totalMessages) * 100;
    return `${Math.round(automationRate)}%`;
  };
  
  /**
   * Determine conversation category based on content analysis
   * @param {Array} messages - Array of conversation messages
   * @returns {string} Conversation category
   */
  const determineCategory = (messages) => {
    const messageContent = messages
      .map(msg => msg.message.toLowerCase())
      .join(' ');
    
    const functionCalls = messages
      .filter(msg => msg.function_call)
      .map(msg => msg.function_call.name);
  
    // Category patterns
    const patterns = {
      Booking: {
        keywords: ['book', 'reserve', 'reservation', 'stay', 'night'],
        functions: ['booking', 'check_availability', 'reserve_room']
      },
      Support: {
        keywords: ['help', 'issue', 'problem', 'support', 'assist'],
        functions: ['support_ticket', 'resolve_issue']
      },
      Information: {
        keywords: ['info', 'detail', 'tell me about', 'what is', 'how'],
        functions: ['get_info', 'fetch_details']
      },
      Payment: {
        keywords: ['pay', 'price', 'cost', 'rate', 'charge'],
        functions: ['process_payment', 'check_rates']
      },
      Cancellation: {
        keywords: ['cancel', 'refund', 'reschedule'],
        functions: ['cancel_booking', 'process_refund']
      }
    };
  
    // Score each category
    const scores = Object.entries(patterns).reduce((acc, [category, pattern]) => {
      let score = 0;
      
      // Check keywords
      pattern.keywords.forEach(keyword => {
        if (messageContent.includes(keyword)) score += 1;
      });
      
      // Check function calls
      pattern.functions.forEach(func => {
        if (functionCalls.includes(func)) score += 2;
      });
      
      acc[category] = score;
      return acc;
    }, {});
  
    // Find category with highest score
    const topCategory = Object.entries(scores)
      .reduce((top, [category, score]) => 
        score > top.score ? { category, score } : top,
        { category: 'General', score: 0 }
      );
  
    return topCategory.score > 0 ? topCategory.category : 'General';
  };
  
  /**
   * Calculate comprehensive conversation metrics
   * @param {Array} messages - Array of conversation messages
   * @returns {Object} Calculated metrics
   */
  export const calculateMetrics = (messages) => {
    if (!messages?.length) return null;
  
    const firstMessage = messages[0];
    const lastMessage = messages[messages.length - 1];
    const conversationDuration = 
      new Date(lastMessage.timestamp) - new Date(firstMessage.timestamp);
  
    const functionCalls = messages.filter(msg => msg.function_call);
    const uniqueFunctions = new Set(
      functionCalls.map(msg => msg.function_call.name)
    );
  
    const detailedMetrics = {
      // Basic metrics
      totalMessages: messages.length,
      responseTime: `${calculateAverageResponseTime(messages)}s`,
      automationRate: calculateAutomationRate(messages),
      category: determineCategory(messages),
  
      // Additional metrics
      duration: {
        milliseconds: conversationDuration,
        seconds: Math.floor(conversationDuration / 1000),
        minutes: Math.floor(conversationDuration / (1000 * 60))
      },
      messageDistribution: {
        ai: messages.filter(msg => msg.role === 'AI').length,
        user: messages.filter(msg => msg.role === 'user').length
      },
      functionMetrics: {
        totalCalls: functionCalls.length,
        uniqueFunctions: uniqueFunctions.size,
        functionsUsed: Array.from(uniqueFunctions)
      }
    };
  
    // Performance indicators
    detailedMetrics.performanceIndicators = {
      responseSpeed: calculateResponseSpeedRating(detailedMetrics.responseTime),
      automationEfficiency: calculateAutomationEfficiency(detailedMetrics),
      conversationQuality: calculateConversationQuality(messages),
    };
  
    return detailedMetrics;
  };
  
  /**
   * Calculate response speed rating
   * @param {string} responseTime - Average response time
   * @returns {string} Speed rating
   */
  const calculateResponseSpeedRating = (responseTime) => {
    const seconds = parseFloat(responseTime);
    if (seconds <= 2) return 'Excellent';
    if (seconds <= 5) return 'Good';
    if (seconds <= 10) return 'Fair';
    return 'Needs Improvement';
  };
  
  /**
   * Calculate automation efficiency
   * @param {Object} metrics - Conversation metrics
   * @returns {string} Efficiency rating
   */
  const calculateAutomationEfficiency = (metrics) => {
    const automationPercentage = parseInt(metrics.automationRate);
    const hasFunctions = metrics.functionMetrics.totalCalls > 0;
  
    if (automationPercentage === 100 && hasFunctions) return 'Optimal';
    if (automationPercentage >= 90) return 'High';
    if (automationPercentage >= 75) return 'Good';
    return 'Moderate';
  };
  
  /**
   * Calculate conversation quality score
   * @param {Array} messages - Conversation messages
   * @returns {Object} Quality metrics
   */
  const calculateConversationQuality = (messages) => {
    // Analysis patterns
    const positivePatterns = [
      'thank', 'great', 'good', 'help', 'perfect', 'excellent'
    ];
    const negativePatterns = [
      'bad', 'issue', 'problem', 'wrong', 'error', 'not working'
    ];
  
    let positiveCount = 0;
    let negativeCount = 0;
  
    messages.forEach(msg => {
      if (msg.role === 'user') {
        const content = msg.message.toLowerCase();
        positivePatterns.forEach(pattern => {
          if (content.includes(pattern)) positiveCount++;
        });
        negativePatterns.forEach(pattern => {
          if (content.includes(pattern)) negativeCount++;
        });
      }
    });
  
    const totalSentiments = positiveCount + negativeCount;
    const sentimentScore = totalSentiments > 0
      ? (positiveCount / totalSentiments) * 100
      : 50;
  
    return {
      score: sentimentScore.toFixed(1),
      rating: sentimentScore >= 80 ? 'Excellent' :
              sentimentScore >= 60 ? 'Good' :
              sentimentScore >= 40 ? 'Fair' : 'Needs Improvement'
    };
  };
  
  export default {
    calculateMetrics,
    calculateAverageResponseTime,
    calculateAutomationRate,
    determineCategory
  };