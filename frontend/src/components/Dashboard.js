
import React, { useState } from 'react';
import { Globe, Brain, RefreshCw } from 'lucide-react';
import { useGeoAnalysis } from '../hooks/useGeoAnalysis';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import Navigation from './Navigation';
import LoadingAnimation from './LoadingAnimation';
import ScoreCard from './ScoreCard';
import CompetitorGrid from './CompetitorGrid';
import RecommendationsList from './RecommendationsList';
import FloatingElements from './FloatingElements';
import { Users, FileText } from 'lucide-react';

const Dashboard = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const { theme } = useTheme();
  const { analysis, competitors, recommendations, isAnalyzing, error, progress, performAnalysis, resetAnalysis } = useGeoAnalysis();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (websiteUrl.trim()) {
      await performAnalysis(websiteUrl.trim());
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Search Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="Enter website URL (e.g., https://example.com)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    disabled={isAnalyzing}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAnalyzing || !websiteUrl.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      <span>Analyze Website</span>
                    </>
                  )}
                </button>
              </form>
            </div>
            {/* Loading State */}
            {isAnalyzing && <LoadingAnimation progress={progress} />}
            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            {/* Results */}
            {analysis && <ScoreCard analysis={analysis} />}
          </div>
        );
      case 'competitors':
        return competitors.length > 0 ? (
          <CompetitorGrid competitors={competitors} />
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Run an analysis to see competitor data</p>
          </div>
        );
      case 'issues':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Technical Issues</h2>
            <p className="text-gray-600 dark:text-gray-400">Technical analysis coming soon...</p>
          </div>
        );
      case 'reports':
        return recommendations.length > 0 ? (
          <RecommendationsList recommendations={recommendations} />
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Run an analysis to generate reports</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <FloatingElements />
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            <Brain className="w-10 h-10 inline-block mr-3 text-blue-500" /> AI-Powered Website Analysis
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Get comprehensive insights about any website's performance and optimization opportunities
          </p>
        </header>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;
