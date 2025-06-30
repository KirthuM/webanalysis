import React from 'react';
import { TrendingUp, Award, AlertCircle } from 'lucide-react';

const ScoreCard = ({ analysis }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade) => {
    if (['A+', 'A'].includes(grade)) return 'bg-green-100 text-green-800';
    if (['B+', 'B'].includes(grade)) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Award className="w-6 h-6 mr-2 text-blue-600" />
          GeoScore Analysis
        </h2>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getGradeColor(analysis.grade)}`}>
          Grade: {analysis.grade}
        </div>
      </div>

      {/* Main Score */}
      <div className="text-center mb-8">
        <div className={`text-6xl font-bold ${getScoreColor(analysis.geoScore)} mb-2`}>
          {analysis.geoScore}
        </div>
        <div className="text-gray-600 text-lg">Overall GeoScore</div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {analysis.metrics?.map((metric, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">{metric.name}</h3>
              <span className={`font-bold ${getScoreColor(metric.score)}`}>
                {metric.score}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full ${
                  metric.score >= 80 ? 'bg-green-500' : 
                  metric.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${metric.score}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-green-800 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {analysis.strengths?.map((strength, index) => (
              <li key={index} className="text-sm text-green-700 flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-red-800 mb-3 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {analysis.weaknesses?.map((weakness, index) => (
              <li key={index} className="text-sm text-red-700 flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
