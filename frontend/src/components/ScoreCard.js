import React from 'react';
import { TrendingUp, Award, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ScoreCard = ({ analysis }) => {
  // Function to get color based on score value
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Function to get grade color styling
  const getGradeColor = (grade) => {
    if (['A+', 'A'].includes(grade)) {
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
    }
    if (['B+', 'B'].includes(grade)) {
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
    }
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
  };

  // Function to get progress bar color
  const getScoreBarColor = (score) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (score >= 60) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card bg-white dark:bg-gray-800 shadow-xl border-0"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <Award className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
          GeoScore Analysis
        </h2>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getGradeColor(analysis.grade)}`}>
          Grade: {analysis.grade}
        </div>
      </div>

      {/* Score and Info Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            {analysis.geoScore}
          </div>
          <div className="text-gray-600 dark:text-gray-300">Overall Score</div>
        </div>
        
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Business Type: 
            <span className="font-semibold text-gray-800 dark:text-white ml-1">
              {analysis.businessType}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Industry: 
            <span className="font-semibold text-gray-800 dark:text-white ml-1">
              {analysis.industry}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="space-y-4">
        {analysis.metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            {/* Metric Header */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800 dark:text-white">
                {metric.name}
              </span>
              <span className={`font-bold ${getScoreColor(metric.score)}`}>
                {metric.score}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.score}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-2 rounded-full ${getScoreBarColor(metric.score)}`}
              />
            </div>

            {/* Metric Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {metric.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ScoreCard;
