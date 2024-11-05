import React from "react";
import { Clock, MessageCircle, Bot, Tag } from "lucide-react";
import PropTypes from "prop-types";

const MetricsCard = ({ metrics }) => {
  if (!metrics) return null;

  const getCategoryColor = (category) => {
    const colors = {
      Booking: "text-emerald-800 bg-emerald-50",
      Pricing: "text-blue-800 bg-blue-50",
      Availability: "text-violet-800 bg-violet-50",
      Cancellation: "text-rose-800 bg-rose-50",
      Information: "text-amber-800 bg-amber-50",
      General: "text-slate-800 bg-slate-50",
    };
    return colors[category] || colors["General"];
  };

  const getMetricIcon = (metricType) => {
    const iconProps = { size: 24 };
    switch (metricType) {
      case "response":
        return <Clock {...iconProps} className="text-blue-500" />;
      case "messages":
        return <MessageCircle {...iconProps} className="text-emerald-500" />;
      case "automation":
        return <Bot {...iconProps} className="text-violet-500" />;
      case "category":
        return <Tag {...iconProps} className="text-amber-500" />;
      default:
        return null;
    }
  };

  const MetricBox = ({ type, label, value, customClass = "" }) => (
    <div
      className={`flex items-center space-x-3 p-3 rounded-lg ${customClass}`}
    >
      {getMetricIcon(type)}
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
      <div className="grid grid-cols-2 gap-4">
        <MetricBox
          type="response"
          label="Response Time"
          value={metrics.responseTime}
          customClass="bg-blue-50"
        />

        <MetricBox
          type="messages"
          label="Messages"
          value={metrics.totalMessages}
          customClass="bg-emerald-50"
        />

        <MetricBox
          type="automation"
          label="Automation Rate"
          value={metrics.automationRate}
          customClass="bg-violet-50"
        />

        <MetricBox
          type="category"
          label="Category"
          value={metrics.category}
          customClass={getCategoryColor(metrics.category)}
        />
      </div>

      {/* Tooltip for metrics explanation */}
      <div className="mt-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Clock size={12} />
          <span>Response time is the average time taken for AI to respond</span>
        </div>
        <div className="flex items-center space-x-1 mt-1">
          <Bot size={12} />
          <span>
            Automation rate shows the percentage of AI-handled responses
          </span>
        </div>
      </div>
    </div>
  );
};

// Props validation
MetricsCard.propTypes = {
  metrics: PropTypes.shape({
    responseTime: PropTypes.string.isRequired,
    totalMessages: PropTypes.number.isRequired,
    automationRate: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }),
};

MetricsCard.defaultProps = {
  metrics: null,
};

export default MetricsCard;
