

import React from 'react';
import { TrendingUp, Award, AlertCircle, Zap, Globe, Shield } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import CircularProgress from './CircularProgress';

const ScoreCard = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
          <AlertCircle className="w-6 h-6" />
          <span className="text-lg">No analysis data available</span>
        </div>
      </div>
    );
  }

  const {
    geoScore = 0,
    grade = 'N/A',
    businessType = 'Unknown',
    industry = 'General',
    metrics = [],
    strengths = [],
    weaknesses = [],
    summary = 'Analysis in progress...'
  } = analysis;

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
      'A': 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
      'B+': 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
      'B': 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
      'C+': 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
      'C': 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
      'D+': 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
      'D': 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
      'F': 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
    };
    return gradeColors[grade] || 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981'; // Emerald
    if (score >= 60) return '#3B82F6'; // Blue
    if (score >= 40) return '#F59E0B'; // Amber
    if (score >= 20) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  const getMetricIcon = (metricName) => {
    const name = metricName.toLowerCase();
    if (name.includes('performance')) return <Zap className="w-5 h-5" />;
    if (name.includes('seo')) return <Globe className="w-5 h-5" />;
    if (name.includes('security')) return <Shield className="w-5 h-5" />;
    if (name.includes('user') || name.includes('ux')) return <Award className="w-5 h-5" />;
    return <TrendingUp className="w-5 h-5" />;
  };

  // Calculate overall stats
  const avgMetricScore = metrics.length > 0 
    ? metrics.reduce((sum, m) => sum + (m.score || 0), 0) / metrics.length 
    : geoScore;

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden backdrop-blur-sm">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm p-8 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
            {/* Left Side - Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4 flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <span>Website Analysis Score</span>
              </h2>
              
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-4 text-blue-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Business Type:</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                      {businessType}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Industry:</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                      {industry}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Score Display */}
            <div className="flex items-center space-x-8">
              {/* Main Score */}
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">
                  <AnimatedCounter 
                    end={geoScore} 
                    duration={1500} 
                    decimals={0}
                  />
                </div>
                <div className="text-blue-100 text-sm font-medium">Overall Score</div>
              </div>

              {/* Grade Badge */}
              <div className={`px-6 py-3 rounded-xl font-bold text-2xl ${getGradeColor(grade)} border-2 border-white/20 backdrop-blur-sm`}>
                Grade: {grade}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8">
        {/* Performance Metrics with Circle Charts */}
        {metrics.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg mr-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              Performance Metrics
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {metrics.map((metric, index) => (
                <div 
                  key={index} 
                  className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600"
                >
                  <div className="flex flex-col items-center space-y-4">
                    {/* Circle Progress */}
                    <CircularProgress
                      percentage={metric.score || 0}
                      size={100}
                      strokeWidth={6}
                      color="auto"
                      animate={true}
                      showPercentage={true}
                    />
                    
                    {/* Metric Info */}
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <div className="text-blue-500 dark:text-blue-400">
                          {getMetricIcon(metric.name)}
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-800 dark:text-white text-sm leading-tight">
                        {metric.name || 'Unnamed Metric'}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                        {metric.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Performance Summary */}
            <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    Average Performance Score
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Based on {metrics.length} key metrics
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: getScoreColor(avgMetricScore) }}>
                    <AnimatedCounter 
                      end={avgMetricScore} 
                      duration={1200} 
                      decimals={1}
                      startDelay={500}
                    />%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Performance</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Summary */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-2 rounded-lg mr-3">
              <Globe className="w-5 h-5 text-white" />
            </div>
            Analysis Summary
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
              {summary}
            </p>
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strengths */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700/50">
            <h3 className="text-xl font-bold mb-4 text-emerald-700 dark:text-emerald-400 flex items-center">
              <Award className="w-6 h-6 mr-3" />
              Key Strengths
            </h3>
            {strengths.length > 0 ? (
              <ul className="space-y-3">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-3 group">
                    <div className="bg-emerald-500 rounded-full p-1 mt-0.5 group-hover:scale-110 transition-transform">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 flex-1 leading-relaxed">
                      {strength}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <Award className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-50" />
                <p className="text-emerald-600 dark:text-emerald-400 italic">
                  No specific strengths identified yet
                </p>
              </div>
            )}
          </div>

          {/* Weaknesses */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700/50">
            <h3 className="text-xl font-bold mb-4 text-red-700 dark:text-red-400 flex items-center">
              <AlertCircle className="w-6 h-6 mr-3" />
              Areas for Improvement
            </h3>
            {weaknesses.length > 0 ? (
              <ul className="space-y-3">
                {weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start space-x-3 group">
                    <div className="bg-red-500 rounded-full p-1 mt-0.5 group-hover:scale-110 transition-transform">
                      <AlertCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 flex-1 leading-relaxed">
                      {weakness}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2 opacity-50" />
                <p className="text-red-600 dark:text-red-400 italic">
                  No specific weaknesses identified yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
