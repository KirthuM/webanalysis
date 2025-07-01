import React, { useState } from 'react';
import { 
  Search, 
  TrendingUp, 
  Globe, 
  Brain, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react';
import { useGeoAnalysis } from '../hooks/useGeoAnalysis';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import LoadingAnimation from './LoadingAnimation';
import ScoreCard from './ScoreCard';
import CompetitorGrid from './CompetitorGrid';
import RecommendationsList from './RecommendationsList';

const Dashboard = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const { theme } = useTheme();
  
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
      const url = websiteUrl.startsWith('http') 
        ? websiteUrl 
        : `https://${websiteUrl}`;
      await performAnalysis(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <ThemeToggle />
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              🌐 Web Analysis Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              AI-powered website analysis and competitive intelligence
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="card bg-white dark:bg-gray-800 shadow-xl border-0 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="Enter website URL (e.g., example.com)"
                className="
                  w-full pl-12 pr-4 py-3 
                  border border-gray-300 dark:border-gray-600 
                  rounded-lg focus:ring-2 focus:ring-blue-500 
                  bg-white dark:bg-gray-700 
                  text-gray-900 dark:text-white 
                  placeholder-gray-500 dark:placeholder-gray-400 
                  transition-colors duration-200
                "
                disabled={isAnalyzing}
              />
            </div>
            
            <button
              type="submit"
              disabled={isAnalyzing || !websiteUrl.trim()}
              className="
                w-full 
                bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-700 hover:to-purple-700 
                disabled:from-gray-400 disabled:to-gray-500 
                text-white font-semibold py-3 px-6 rounded-lg 
                transition-all duration-200 transform hover:scale-105 
                disabled:hover:scale-100 disabled:cursor-not-allowed 
                flex items-center justify-center space-x-2
              "
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Analyze Website</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Loading Animation */}
        {isAnalyzing && <LoadingAnimation progress={progress} />}

        {/* Error Message */}
        {error && (
          <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-8">
            <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Analysis Failed</span>
            </div>
            <p className="text-red-600 dark:text-red-300 mt-2">{error}</p>
            <button
              onClick={resetAnalysis}
              className="mt-4 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div className="space-y-8">
            <ScoreCard analysis={analysis} />
            
            {competitors.length > 0 && (
              <CompetitorGrid competitors={competitors} />
            )}
            
            {recommendations.length > 0 && (
              <RecommendationsList recommendations={recommendations} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
