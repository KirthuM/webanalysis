import React from 'react';
import { ExternalLink, TrendingUp, Building } from 'lucide-react';

const CompetitorGrid = ({ competitors }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 'Leader': return 'bg-green-100 text-green-800';
      case 'Challenger': return 'bg-blue-100 text-blue-800';
      case 'Follower': return 'bg-yellow-100 text-yellow-800';
      case 'Niche': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Building className="w-6 h-6 mr-2 text-blue-600" />
        Competitive Analysis
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competitors.map((competitor, index) => (
          <div key={index} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-800 truncate">{competitor.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(competitor.marketPosition)}`}>
                {competitor.marketPosition}
              </span>
            </div>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">GeoScore</span>
                <span className={`font-bold ${getScoreColor(competitor.geoScore)}`}>
                  {competitor.geoScore}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    competitor.geoScore >= 80 ? 'bg-green-500' : 
                    competitor.geoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${competitor.geoScore}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-3">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Category</span>
              <p className="text-sm text-gray-700">{competitor.category}</p>
            </div>

            <div className="mb-4">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Key Strengths</span>
              <ul className="mt-1">
                {competitor.strengths?.slice(0, 2).map((strength, idx) => (
                  <li key={idx} className="text-xs text-gray-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <a 
              href={competitor.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Visit Website
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorGrid;
