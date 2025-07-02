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
  Building,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useGeoAnalysis } from '../hooks/useGeoAnalysis';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import LoadingAnimation from './LoadingAnimation';
import ScoreCard from './ScoreCard';
import CompetitorGrid from './CompetitorGrid';
import RecommendationsList from './RecommendationsList';
import reportService from '../services/reportService';

const Dashboard = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState(null);
  const [downloadingFormat, setDownloadingFormat] = useState(null);

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

  const handleDownloadReport = async (format) => {
    if (!analysis) {
      setDownloadMessage({ 
        type: 'error', 
        text: 'No analysis data available. Please analyze a website first.' 
      });
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadingFormat(format);
      setDownloadMessage(null);
      
      console.log('Starting download for format:', format);
      console.log('Analysis data:', analysis);
      console.log('Competitors data:', competitors);
      console.log('Recommendations data:', recommendations);
      
      const reportData = await reportService.generateFullReport(
        websiteUrl,
        analysis,
        competitors,
        recommendations
      );

      console.log('Generated report data:', reportData);

      const result = await reportService.downloadReport(reportData, format);
      
      if (result.success) {
        setDownloadMessage({ 
          type: 'success', 
          text: `${format.toUpperCase()} report downloaded successfully!` 
        });
      } else {
        setDownloadMessage({ 
          type: 'error', 
          text: result.error || `Failed to download ${format.toUpperCase()} report. Please try again.` 
        });
      }
    } catch (error) {
      console.error('Download error in component:', error);
      setDownloadMessage({ 
        type: 'error', 
        text: `Download failed: ${error.message || 'Unknown error occurred'}` 
      });
    } finally {
      setIsDownloading(false);
      setDownloadingFormat(null);
      // Clear message after 5 seconds
      setTimeout(() => setDownloadMessage(null), 5000);
    }
  };

  // Fallback download for simple formats
  const handleFallbackDownload = (format) => {
    if (!analysis) return;

    try {
      const reportData = {
        website: websiteUrl,
        analysis,
        competitors,
        recommendations,
        generatedAt: new Date().toISOString(),
        summary: {
          totalCompetitors: competitors.length,
          totalRecommendations: recommendations.length,
          overallScore: analysis.geoScore || 0
        }
      };

      let content, mimeType, filename;

      switch (format) {
        case 'json':
          content = JSON.stringify(reportData, null, 2);
          mimeType = 'application/json';
          filename = `analysis-report-${Date.now()}.json`;
          break;
        case 'csv':
          content = generateCSVReport(reportData);
          mimeType = 'text/csv';
          filename = `analysis-report-${Date.now()}.csv`;
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadMessage({ 
        type: 'success', 
        text: `${format.toUpperCase()} report downloaded successfully!` 
      });
    } catch (error) {
      console.error('Fallback download error:', error);
      setDownloadMessage({ 
        type: 'error', 
        text: `Failed to download ${format.toUpperCase()} report: ${error.message}` 
      });
    }
  };

  const generateCSVReport = (data) => {
    let csv = 'Website Analysis Report\n';
    csv += `Website,${data.website}\n`;
    csv += `Generated At,${data.generatedAt}\n`;
    csv += `Overall Score,${data.analysis?.geoScore || 'N/A'}\n`;
    csv += `Grade,${data.analysis?.grade || 'N/A'}\n`;
    csv += `Business Type,${data.analysis?.businessType || 'N/A'}\n`;
    csv += `Industry,${data.analysis?.industry || 'N/A'}\n\n`;
    
    // Metrics section
    if (data.analysis?.metrics && data.analysis.metrics.length > 0) {
      csv += 'Metrics\n';
      csv += 'Name,Score,Description\n';
      data.analysis.metrics.forEach(metric => {
        csv += `"${metric.name || ''}",${metric.score || 0},"${(metric.description || '').replace(/"/g, '""')}"\n`;
      });
      csv += '\n';
    }
    
    // Competitors section
    if (data.competitors && data.competitors.length > 0) {
      csv += 'Competitors\n';
      csv += 'Name,Website,Score,Category,Market Position\n';
      data.competitors.forEach(competitor => {
        csv += `"${competitor.name || ''}","${competitor.website || ''}",${competitor.geoScore || 0},"${competitor.category || ''}","${competitor.marketPosition || ''}"\n`;
      });
      csv += '\n';
    }
    
    // Recommendations section
    if (data.recommendations && data.recommendations.length > 0) {
      csv += 'Recommendations\n';
      csv += 'Title,Priority,Category,Description,Expected Impact\n';
      data.recommendations.forEach(rec => {
        csv += `"${rec.title || ''}","${rec.priority || ''}","${rec.category || ''}","${(rec.description || '').replace(/"/g, '""')}",${rec.expectedImpact || 0}\n`;
      });
    }
    
    return csv;
  };

  const renderReportsTab = () => {
    const downloadFormats = [
      {
        format: 'json',
        title: 'JSON Export',
        description: 'Developer-friendly format with complete data',
        icon: '⚙️',
        color: 'purple',
        available: true,
        useServer: false
      },
      {
        format: 'csv',
        title: 'CSV Data',
        description: 'Spreadsheet-compatible format for analysis',
        icon: '📋',
        color: 'blue',
        available: true,
        useServer: false
      },
      {
        format: 'pdf',
        title: 'PDF Report',
        description: 'Professional formatted report for presentations',
        icon: '📄',
        color: 'red',
        available: false,
        useServer: true
      },
      {
        format: 'excel',
        title: 'Excel Spreadsheet',
        description: 'Multi-sheet Excel file with structured data',
        icon: '📊',
        color: 'green',
        available: false,
        useServer: true
      },
      {
        format: 'html',
        title: 'HTML Report',
        description: 'Web-ready formatted report',
        icon: '🌐',
        color: 'orange',
        available: false,
        useServer: true
      }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            Download Reports
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Export your website analysis in multiple formats for sharing and further analysis.
          </p>
          
          {downloadMessage && (
            <div className={`mb-4 p-4 rounded-lg flex items-center space-x-2 ${
              downloadMessage.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-800/20 dark:text-green-300 dark:border-green-700' 
                : 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-800/20 dark:text-red-300 dark:border-red-700'
            }`}>
              {downloadMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{downloadMessage.text}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {downloadFormats.map(({ format, title, description, icon, color, available, useServer }) => (
              <div key={format} className="relative">
                <button
                  onClick={() => useServer ? handleDownloadReport(format) : handleFallbackDownload(format)}
                  disabled={!analysis || isDownloading || !available}
                  className={`w-full p-6 border-2 border-dashed rounded-lg transition-all duration-200 text-center relative
                    ${available ? '' : 'opacity-50'}
                    ${color === 'red' ? 'border-red-300 hover:border-red-500 hover:bg-red-50 dark:border-red-600 dark:hover:border-red-400 dark:hover:bg-red-900/20' : ''}
                    ${color === 'green' ? 'border-green-300 hover:border-green-500 hover:bg-green-50 dark:border-green-600 dark:hover:border-green-400 dark:hover:bg-green-900/20' : ''}
                    ${color === 'blue' ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50 dark:border-blue-600 dark:hover:border-blue-400 dark:hover:bg-blue-900/20' : ''}
                    ${color === 'purple' ? 'border-purple-300 hover:border-purple-500 hover:bg-purple-50 dark:border-purple-600 dark:hover:border-purple-400 dark:hover:bg-purple-900/20' : ''}
                    ${color === 'orange' ? 'border-orange-300 hover:border-orange-500 hover:bg-orange-50 dark:border-orange-600 dark:hover:border-orange-400 dark:hover:bg-orange-900/20' : ''}
                    disabled:opacity-50 disabled:cursor-not-allowed
                    dark:bg-gray-800/50
                    ${!available ? 'cursor-not-allowed' : ''}
                  `}
                >
                  <div className="text-3xl mb-2">{icon}</div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">{title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{description}</p>
                  
                  {!available && (
                    <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                      Coming Soon - Server Implementation Required
                    </div>
                  )}
                  
                  {isDownloading && downloadingFormat === format && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 rounded-lg flex items-center justify-center">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Generating...
                        </span>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
          
          {!analysis && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-700 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-700 dark:text-yellow-300">
                Please analyze a website first to enable report downloads.
              </p>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-700">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Available Formats:</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span><strong>JSON & CSV:</strong> Ready for download (client-side generation)</span>
              </li>
              <li className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span><strong>PDF, Excel, HTML:</strong> Requires backend server setup</span>
              </li>
            </ul>
          </div>
        </div>
        
        {analysis && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Report Summary</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analysis.geoScore || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Overall Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{competitors.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Competitors</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{recommendations.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Recommendations</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{analysis.metrics?.length || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Metrics</div>
              </div>
            </div>
            
            {websiteUrl && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Analyzed Website:</strong> {websiteUrl}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Last Updated:</strong> {new Date().toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {analysis && <ScoreCard analysis={analysis} />}
            {competitors.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Top Competitors
                </h3>
                <CompetitorGrid competitors={competitors.slice(0, 6)} />
                {competitors.length > 6 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setActiveTab('competitors')}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      View all {competitors.length} competitors →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 'competitors':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center space-x-2">
                <Users className="w-6 h-6" />
                <span>Competitor Analysis</span>
              </h2>
              {competitors.length > 0 ? (
                <CompetitorGrid competitors={competitors} />
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">No competitor data available. Please run an analysis first.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'technical':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center space-x-2">
                <TrendingUp className="w-6 h-6" />
                <span>Technical Issues & Recommendations</span>
              </h2>
              {recommendations.length > 0 ? (
                <RecommendationsList recommendations={recommendations} />
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">No recommendations available. Please run an analysis first.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'reports':
        return renderReportsTab();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <ThemeToggle />

      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              AI-Powered Website Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive SEO and competitive analysis with downloadable reports
            </p>
          </div>
        </div>
      </header>

      {/* URL Input Form */}
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
          <div className="relative">
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Globe className="w-5 h-5" />
                <span>Analyze Website</span>
              </>
            )}
          </button>
        </form>

        {/* Loading Animation */}
        {isAnalyzing && <LoadingAnimation progress={progress} />}

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mt-4">
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <strong>Error:</strong> {error}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        {analysis && (
          <div className="flex justify-center mt-8 mb-6">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shadow-sm">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'competitors', label: 'Competitors', icon: Users },
                { id: 'technical', label: 'Technical', icon: TrendingUp },
                { id: 'reports', label: 'Reports', icon: FileText }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto">
          {analysis && renderTabContent()}
        </div>

        {/* Success Message */}
        {analysis && !isAnalyzing && (
          <div className="max-w-2xl mx-auto mt-6">
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <div>
                Analysis completed successfully! Use the tabs above to explore results and download reports.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
