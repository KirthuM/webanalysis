import React, { useState } from 'react';
import { Search, TrendingUp, Globe, Brain, Sparkles, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useGeoAnalysis } from '../hooks/useGeoAnalysis';
import LoadingAnimation from './LoadingAnimation';
import ScoreCard from './ScoreCard';
import CompetitorGrid from './CompetitorGrid';
import RecommendationsList from './RecommendationsList';

const Dashboard = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const { 
    analysis, 
    competitors, 
    recommendations, 
    isAnalyzing, 
    error, 
    progress,
    performAnalysis, 
    resetAnalysis 
  } = useGeoAnalysis();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (websiteUrl.trim()) {
      const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
      await performAnalysis(url);
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const isValidUrl = websiteUrl && validateUrl(websiteUrl);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header - Matching Reference Design */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
            <div className="ml-6">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GeoScore AI
              </h1>
            </div>
          </div>

          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Advanced AI-powered website analysis with competitor insights and SEO recommendations
          </p>

          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center px-4 py-2 bg-blue-100 rounded-full">
              <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
              <span className="font-medium text-blue-800">OpenAI GPT-4</span>
            </div>
            <div className="flex items-center px-4 py-2 bg-green-100 rounded-full">
              <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
              <span className="font-medium text-green-800">Real-time Analysis</span>
            </div>
            <div className="flex items-center px-4 py-2 bg-purple-100 rounded-full">
              <Globe className="h-4 w-4 mr-2 text-purple-600" />
              <span className="font-medium text-purple-800">Competitor Intelligence</span>
            </div>
          </div>
        </div>

        {/* Analysis Form - Improved Design */}
        <div className="max-w-4xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="space-y-6">
              <div className="relative">
                <div className="mb-3">
                  <label htmlFor="website-url" className="block text-lg font-semibold text-gray-700 mb-2">
                    Website URL
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="website-url"
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="Enter website URL (e.g., example.com or https://example.com)"
                    className={`w-full px-6 py-4 pr-14 text-lg border-2 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 transition-all duration-200 ${
                      isValidUrl ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white'
                    }`}
                    disabled={isAnalyzing}
                  />
                  <Search className="absolute right-5 top-5 h-6 w-6 text-gray-400" />
                  {isValidUrl && (
                    <div className="absolute right-12 top-4">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={!isValidUrl || isAnalyzing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="animate-spin h-6 w-6 mr-3" />
                      Analyzing... {progress}%
                    </>
                  ) : (
                    <>
                      <Brain className="h-6 w-6 mr-3" />
                      Analyze with AI
                    </>
                  )}
                </button>
                
                {(analysis || error) && (
                  <button
                    type="button"
                    onClick={resetAnalysis}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors duration-200 font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Loading Animation */}
        {isAnalyzing && (
          <div className="max-w-4xl mx-auto mb-8">
            <LoadingAnimation progress={progress} />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-1">
                    Analysis Failed
                  </h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {analysis && !isAnalyzing && (
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Website Info */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Website Analysis Results</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
                    Business Type
                  </h3>
                  <p className="text-2xl font-bold text-blue-900">
                    {analysis.businessType}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                  <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">
                    Industry
                  </h3>
                  <p className="text-2xl font-bold text-green-900">
                    {analysis.industry}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                  <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">
                    Analysis Date
                  </h3>
                  <p className="text-2xl font-bold text-purple-900">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Score Card */}
            <ScoreCard analysis={analysis} />

            {/* Competitors */}
            {competitors && competitors.length > 0 && (
              <CompetitorGrid competitors={competitors} />
            )}

            {/* Recommendations */}
            {recommendations && recommendations.length > 0 && (
              <RecommendationsList recommendations={recommendations} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
