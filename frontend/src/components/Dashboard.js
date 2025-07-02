import React, { useState } from 'react';
import {
  Globe,
  Brain,
  RefreshCw,
  CheckCircle,
  Users,
  FileText,
  BarChart3,
  Download,
  TrendingUp,
  Building
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
  const [activeTab, setActiveTab] = useState('dashboard');

  const {
    analysis,
    competitors,
    recommendations,
    isAnalyzing,
    error,
    progress,
    performAnalysis,
  } = useGeoAnalysis();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (websiteUrl.trim()) {
      await performAnalysis(websiteUrl.trim());
    }
  };

  const handleDownloadReport = (format) => {
    if (!analysis) return;

    const reportData = {
      website: websiteUrl,
      analysis,
      competitors,
      recommendations,
      generatedAt: new Date().toISOString()
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analysis-report-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const csvContent = generateCSVReport(reportData);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analysis-report-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const generateCSVReport = (data) => {
    let csv = 'Metric,Score,Description\n';
    if (data.analysis && data.analysis.metrics) {
      data.analysis.metrics.forEach(metric => {
        csv += `"${metric.name}",${metric.score},"${metric.description}"\n`;
      });
    }
    return csv;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            {analysis && <ScoreCard analysis={analysis} />}
            {competitors.length > 0 && <CompetitorGrid competitors={competitors.slice(0, 10)} />}
          </div>
        );
      case 'competitors':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Competitor Analysis</h2>
            {competitors.length > 0 ? (
              <CompetitorGrid competitors={competitors} />
            ) : (
              <p>No competitor data available</p>
            )}
          </div>
        );
      case 'technical':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Technical Issues & Recommendations</h2>
            {recommendations.length > 0 ? (
              <RecommendationsList recommendations={recommendations} />
            ) : (
              <p>No recommendations available</p>
            )}
          </div>
        );
      case 'reports':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Download Reports</h2>
            <button
              onClick={() => handleDownloadReport('json')}
              disabled={!analysis}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download JSON Report
            </button>
            <button
              onClick={() => handleDownloadReport('csv')}
              disabled={!analysis}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download CSV Report
            </button>
            {!analysis && (
              <p>Please analyze a website first to enable downloads</p>
            )}
          </div>
        );
      default:
        return null;
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
              AI-Powered Website Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive SEO and competitive analysis
            </p>
          </div>
        </div>
      </header>

      {/* URL Input Form */}
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Globe className="w-5 h-5" />
                Analyze
              </>
            )}
          </button>
        </form>

        {/* Loading Animation */}
        {isAnalyzing && <LoadingAnimation progress={progress} />}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mt-4">
            Error: {error}
          </div>
        )}

        {/* Navigation Tabs */}
        {analysis && (
          <div className="flex space-x-4 mt-6">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Globe },
              { id: 'competitors', label: 'Competitors', icon: Users },
              { id: 'technical', label: 'Technical Issues', icon: TrendingUp },
              { id: 'reports', label: 'Reports', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Tab Content */}
        {analysis && renderTabContent()}

        {/* Success Message */}
        {analysis && (
          <div className="mt-4 text-green-600">
            <CheckCircle className="inline-block mr-2" />
            Analysis completed successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
