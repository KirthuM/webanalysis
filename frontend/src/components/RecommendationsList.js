import React from 'react';
import { Lightbulb, Clock, Zap, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

const RecommendationsList = ({ recommendations }) => {
  // Handle both array format and object format with recommendations array
  const recommendationsArray = Array.isArray(recommendations) 
    ? recommendations 
    : recommendations?.recommendations || [];

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700';
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return <Zap className="w-4 h-4 text-green-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'hard': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'technical': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'content': return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'ux': return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'performance': return 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
      case 'seo': return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'security': return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (!recommendationsArray || recommendationsArray.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Recommendations Available</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Run an analysis to get personalized recommendations for improving your website.
          </p>
        </div>
      </div>
    );
  }

  // Calculate summary stats
  const priorityStats = recommendationsArray.reduce((acc, rec) => {
    const priority = rec.priority?.toLowerCase() || 'medium';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {});

  const avgImpact = recommendationsArray.reduce((sum, rec) => 
    sum + (rec.expectedImpact || 5), 0) / recommendationsArray.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <Lightbulb className="w-6 h-6 mr-3 text-blue-600" />
          AI Recommendations
        </h2>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {recommendationsArray.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Recommendations</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {priorityStats.high || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">High Priority</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {priorityStats.medium || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Medium Priority</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {avgImpact.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Impact Score</div>
          </div>
        </div>

        {/* Priority Actions */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            🎯 <span className="ml-2">Priority Actions</span>
          </h3>
          <div className="space-y-2">
            {recommendationsArray
              .filter(rec => rec.priority?.toLowerCase() === 'high')
              .slice(0, 3)
              .map((action, index) => (
                <div key={index} className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-red-800 dark:text-red-300 font-medium">{action.title}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Detailed Recommendations */}
      <div className="space-y-4">
        {recommendationsArray.map((rec, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{rec.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                    {rec.priority || 'Medium'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(rec.category)}`}>
                    {rec.category || 'General'}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{rec.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                {getDifficultyIcon(rec.difficulty)}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Difficulty:</strong> {rec.difficulty || 'Medium'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Time:</strong> {rec.timeEstimate || '1-2 days'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Impact:</strong> {rec.expectedImpact || 5}/10
                </span>
              </div>
            </div>

            {rec.implementation && rec.implementation.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Implementation Steps:
                </h4>
                <ol className="list-decimal list-inside space-y-1">
                  {rec.implementation.map((step, stepIndex) => (
                    <li key={stepIndex} className="text-sm text-gray-600 dark:text-gray-300 pl-2 leading-relaxed">
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
