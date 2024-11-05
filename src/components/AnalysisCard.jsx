import React from "react";
import PropTypes from "prop-types";
import {
  BarChart2,
  Bot,
  CheckCircle,
  Clock,
  MessageSquare,
  Activity,
  PieChart,
  Zap,
} from "lucide-react";

const AnalysisCard = ({ messages, metrics }) => {
  if (!messages?.length || !metrics) return null;

  const getAutomationDetails = () => {
    const totalMessages = messages.length;
    const aiMessages = messages.filter((msg) => msg.role === "AI");
    const functionCalls = messages.filter((msg) => msg.function_call);
    const uniqueFunctions = new Set(
      functionCalls.map((msg) => msg.function_call.name)
    );

    // Calculate only AI response times
    const responseTimeStats = [];
    const sortedMessages = [...messages].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    for (let i = 0; i < sortedMessages.length; i++) {
      if (sortedMessages[i].role === "user") {
        // Find next AI message
        for (let j = i + 1; j < sortedMessages.length; j++) {
          if (sortedMessages[j].role === "AI") {
            const timeDiff =
              new Date(sortedMessages[j].timestamp) -
              new Date(sortedMessages[i].timestamp);
            responseTimeStats.push(timeDiff);
            break;
          }
        }
      }
    }
    console.log(responseTimeStats)

    const avgResponseTime = responseTimeStats.length
      ? (
          responseTimeStats.reduce((a, b) => a + b, 0) /
          responseTimeStats.length /
          1000
        ).toFixed(2)
      : 0;

    return {
      totalMessages,
      aiResponses: aiMessages.length,
      functionalResponses: functionCalls.length,
      uniqueFunctionCount: uniqueFunctions.size,
      avgResponseTime,
    };
  };

  const details = getAutomationDetails();

  const StatCard = ({ icon: Icon, label, value, subtext }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-sm">{label}</span>
        <Icon size={18} className="text-blue-500" />
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
    </div>
  );

  const ProgressBar = ({ value, max, label, color = "blue" }) => (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-medium text-gray-800">
          {Math.round((value / max) * 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`bg-${color}-500 h-2 rounded-full`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );

  const getFunctionAnalysis = () => {
    const functionTypes = messages
      .filter((msg) => msg.function_call)
      .reduce((acc, msg) => {
        const type = msg.function_call.name;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

    return Object.entries(functionTypes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  const topFunctions = getFunctionAnalysis();

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={MessageSquare}
          label="Total Interactions"
          value={details.totalMessages}
          subtext="Messages exchanged"
        />
        <StatCard
          icon={Bot}
          label="AI Responses"
          value={details.aiResponses}
          subtext="Automated replies"
        />
        {/* Instead of function call. should use something else */}
        <StatCard
          icon={Zap}
          label="Function Calls"
          value={details.functionalResponses}
          subtext={`${details.uniqueFunctionCount} unique functions`}
        />
        <StatCard
          icon={Clock}
          label="Avg Response Time"
          value={`${details.avgResponseTime}s`}
          subtext="Per message"
        />
      </div>

      {/* Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Activity className="text-blue-500 mr-2" size={20} />
            <h3 className="font-bold text-gray-800">Automation Analysis</h3>
          </div>

          <ProgressBar
            label="AI Messages"
            value={details.aiResponses}
            max={details.aiResponses}
            color="blue"
          />

          <ProgressBar
            label="Functional Operations"
            value={details.functionalResponses}
            max={details.aiResponses}
            color="green"
          />

          {details.avgResponseTime < 3 && (
            <div className="mt-4 flex items-center text-green-600 text-sm">
              <CheckCircle size={16} className="mr-2" />
              High-performance response time achieved
            </div>
          )}
        </div>

        {/* Function Usage */}
        {/* <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <PieChart className="text-blue-500 mr-2" size={20} />
            <h3 className="font-bold text-gray-800">Top Functions Used</h3>
          </div>

          <div className="space-y-3">
            {topFunctions.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap size={16} className="text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">{name}</span>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {count} calls
                </span>
              </div>
            ))}
          </div>
        </div> */}
        <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <BarChart2 className="text-blue-500 mr-2" size={20} />
            <h3 className="font-bold text-blue-800">Quick Analysis</h3>
          </div>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex items-center">
              <CheckCircle className="mr-2" size={16} />
              {details.avgResponseTime < 3 ? "Excellent" : "Good"} response time
              performance
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2" size={16} />
              {details.functionalResponses > 0 ? "Active" : "Limited"} use of
              functional operations
            </div>
            {metrics.automationRate === "100%" && (
              <div className="flex items-center">
                <CheckCircle className="mr-2" size={16} />
                Full automation achieved
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Analysis Summary */}
    </div>
  );
};

AnalysisCard.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      role: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      function_call: PropTypes.shape({
        name: PropTypes.string.isRequired,
        arguments: PropTypes.object,
        output: PropTypes.any,
      }),
    })
  ).isRequired,
  metrics: PropTypes.shape({
    automationRate: PropTypes.string.isRequired,
    responseTime: PropTypes.string.isRequired,
    totalMessages: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
};

export default AnalysisCard;
