// src/components/SuccessMetrics.jsx
import React from "react";
import { BarChart2, CheckCircle } from "lucide-react";
import PropTypes from "prop-types";

const SuccessMetrics = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="bg-blue-50 rounded-lg shadow p-4">
      <div className="flex items-center mb-3">
        <BarChart2 className="text-blue-500 mr-2" size={20} />
        <h3 className="font-bold text-blue-800">Success Metrics</h3>
      </div>

      {/* Sales Approach */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-blue-700 mb-2">
          Sales Approach
        </h4>
        <div className="space-y-2">
          {analysis.salesApproach.map((point, index) => (
            <div key={index} className="flex items-center text-blue-700">
              <CheckCircle className="mr-2" size={16} />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Response Quality */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-blue-700 mb-2">
          Response Quality
        </h4>
        <div className="space-y-2">
          {analysis.responseQuality.map((point, index) => (
            <div key={index} className="flex items-center text-blue-700">
              <CheckCircle className="mr-2" size={16} />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Service */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-blue-700 mb-2">
          Customer Service
        </h4>
        <div className="space-y-2">
          {analysis.customerService.map((point, index) => (
            <div key={index} className="flex items-center text-blue-700">
              <CheckCircle className="mr-2" size={16} />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Outcome */}
      {analysis.bookingOutcome && (
        <div className="mt-4 pt-4 border-t border-blue-100">
          <h4 className="text-sm font-semibold text-blue-700 mb-2">
            Booking Outcome
          </h4>
          <div className="flex items-center text-blue-700">
            <CheckCircle className="mr-2" size={16} />
            <span>{`${analysis.bookingOutcome.status} - ${analysis.bookingOutcome.type}`}</span>
          </div>
          <div className="text-sm text-blue-600 mt-1 ml-6">
            {analysis.bookingOutcome.quality}
          </div>
        </div>
      )}
    </div>
  );
};

SuccessMetrics.propTypes = {
  analysis: PropTypes.shape({
    salesApproach: PropTypes.arrayOf(PropTypes.string).isRequired,
    responseQuality: PropTypes.arrayOf(PropTypes.string).isRequired,
    customerService: PropTypes.arrayOf(PropTypes.string).isRequired,
    bookingOutcome: PropTypes.shape({
      status: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      quality: PropTypes.string.isRequired,
    }).isRequired,
  }),
};

export default SuccessMetrics;
