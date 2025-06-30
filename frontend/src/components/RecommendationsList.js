import React from 'react';
import { Lightbulb, Clock, Zap, AlertTriangle } from 'lucide-react';

const RecommendationsList = ({ recommendations }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return <Zap className="w-4 h-4 text-green-500" />;
      case 'Medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Hard': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Technical': return 'bg-blue-50 text-blue-700';
      case 'Content': return 'bg-green-50 text-green-700';
      case 'UX': return 'bg-purple-50 text-purple-700';
      case 'Performance': return 'bg-orange-50 text-orange-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Lightbulb className="w-6 h-6 mr-2 text-blue-600" />
        AI Recommendations
      </h2>

      {/* Summary Stats */}
      {recommendations.estimatedScoreIncrease && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800">Potential Score Increase</h3>
              <p className="text-sm text-blue-600">By implementing these recommendations</p>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              +{recommendations.estimatedScoreIncrease}
            </div>
          </div>
        </div>
      )}

      {/* Priority Actions */}
      {recommendations.priorityActions && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">🎯 Priority Actions</h3>
          <div className="space-y-2">
            {recommendations.priorityActions.map((action, index) => (
              <div key={index} className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  {index + 1}
                </div>
                <span className="text-red-800">{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Recommendations */}
      <div className="space-y-4">
        {recommendations.recommendations?.map((rec, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{rec.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                    {rec.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(rec.category)}`}>
                    {rec.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{rec.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                {getDifficultyIcon(rec.difficulty)}
                <span className="text-sm text-gray-600">
                  <strong>Difficulty:</strong> {rec.difficulty}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  <strong>Time:</strong> {rec.timeEstimate}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">
                  <strong>Impact:</strong> {rec.expectedImpact}/10
                </span>
              </div>
            </div>

            {rec.implementation && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Implementation Steps:</h4>
                <ol className="list-decimal list-inside space-y-1">
                  {rec.implementation.map((step, stepIndex) => (
                    <li key={stepIndex} className="text-sm text-gray-600 pl-2">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsList;
